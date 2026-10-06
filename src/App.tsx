/**
 * Smart Coffee Simulator
 * Barista-OS Natural Language Architecture
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BrewingState, 
  BrewingTelemetry, 
  ChatMessage, 
  FlowNodeId, 
  IntentEvaluationResult, 
  IntentType, 
  SystemState 
} from './types';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { StatusDashboard } from './components/StatusDashboard';
import { FlowchartPanel } from './components/FlowchartPanel';
import { RulesGuideModal } from './components/RulesGuideModal';
import { WelcomeModal } from './components/WelcomeModal';
import { soundEngine } from './utils/audio';
import { evaluateIntentLocally } from './utils/nlpEngine';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'machine',
    text: "Good morning! I'm your Barista smart coffee maker. Tell me when you're awake, schedule a cup for tomorrow morning, or chat with me while you wake up. What can I prepare for you today?",
    timestamp: 'Just now',
    intent: 'UNRELATED',
    confidence: 1.0,
    coffeeType: 'Artisan Espresso',
  },
];

export default function App() {
  // Machine States
  const [systemState, setSystemState] = useState<SystemState>('IDLE');
  const [brewingState, setBrewingState] = useState<BrewingState>('IDLE');
  const [activeNode, setActiveNode] = useState<FlowNodeId>('user_input');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [lastIntent, setLastIntent] = useState<IntentType | undefined>(undefined);
  const [lastConfidence, setLastConfidence] = useState<number | undefined>(undefined);
  const [coffeeType, setCoffeeType] = useState<string>('Artisan Espresso');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [promptedToBrew, setPromptedToBrew] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('barista_has_seen_welcome');
    }
    return true;
  });

  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('barista_has_seen_welcome', 'true');
    }
  };

  // Brewing Extraction Telemetry
  const [telemetry, setTelemetry] = useState<BrewingTelemetry>({
    progress: 0,
    timeRemaining: 6,
    waterTemp: 93.5,
    pressureBars: 9.0,
    currentPhase: 'Extraction Complete',
  });

  const brewingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up brewing timer on unmount
  useEffect(() => {
    return () => {
      if (brewingTimerRef.current) clearInterval(brewingTimerRef.current);
      soundEngine.stopBrewingSound();
    };
  }, []);

  // Sync mute state with sound engine
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) soundEngine.playClick();
  };

  // Optional Browser Speech Synthesis for audio voice remarks
  const handlePlayVoice = (text: string) => {
    soundEngine.playReplying();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * Run timed brewing countdown sequence with simulated extraction phases
   */
  const startBrewingSequence = (beverage: string) => {
    // Stop any existing brewing timer
    if (brewingTimerRef.current) clearInterval(brewingTimerRef.current);

    setBrewingState('BREWING');
    setActiveNode('brewing_process');
    soundEngine.startBrewingSound();

    const totalSeconds = 6;
    let elapsedMs = 0;
    const intervalMs = 200;
    const totalMs = totalSeconds * 1000;

    brewingTimerRef.current = setInterval(() => {
      elapsedMs += intervalMs;
      const progress = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
      const remaining = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));

      let currentPhase: BrewingTelemetry['currentPhase'] = 'Grinding Fresh Beans';
      let pressureBars = 2.5;

      if (progress < 25) {
        currentPhase = 'Grinding Fresh Beans';
        pressureBars = 3.0;
      } else if (progress < 50) {
        currentPhase = 'Tamping & Pre-infusion';
        pressureBars = 4.5;
      } else if (progress < 85) {
        currentPhase = '9-Bar Water Extraction';
        pressureBars = 9.2;
      } else {
        currentPhase = 'Crema Development';
        pressureBars = 8.5;
      }

      setTelemetry({
        progress,
        timeRemaining: remaining,
        waterTemp: 93.5 + (Math.sin(elapsedMs / 500) * 0.4),
        pressureBars,
        currentPhase,
      });

      // Completion reached
      if (elapsedMs >= totalMs) {
        if (brewingTimerRef.current) clearInterval(brewingTimerRef.current);
        brewingTimerRef.current = null;
        
        setBrewingState('COFFEE_READY');
        setActiveNode('completion');
        soundEngine.playCoffeeReady();

        const completionRemark = `Fresh brew ready! Grab your mug of ${beverage} before it cools down. Enjoy the crema!`;
        
        // Add machine completion message
        const readyMessage: ChatMessage = {
          id: `msg-ready-${Date.now()}`,
          sender: 'machine',
          text: completionRemark,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'WAKEUP_TRIGGER',
          confidence: 1.0,
          coffeeType: beverage,
        };
        setMessages((prev) => [...prev, readyMessage]);
        handlePlayVoice(completionRemark);
      }
    }, intervalMs);
  };

  /**
   * Main dispatch function: processes user text input
   */
  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    soundEngine.playClick();

    // 1. Log user message
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Hardware Box A transitions to Listening & Processing (Glowing Blue)
    setSystemState('LISTENING_PROCESSING');
    setActiveNode('intent_classification');
    soundEngine.playProcessingStart();

    // 3. Call server-side API (/api/chat) with fallback to deterministic local evaluator
    let evaluationResult: IntentEvaluationResult;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          currentState: {
            brewingState,
            systemState,
          },
          previousMachinePromptedBrew: promptedToBrew,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      evaluationResult = await response.json();
    } catch {
      // Offline / fallback evaluator
      evaluationResult = evaluateIntentLocally(trimmed, brewingState, promptedToBrew);
    }

    // Small realistic hardware processing delay (450ms) for high-fidelity feel
    await new Promise((resolve) => setTimeout(resolve, 450));

    // 4. Update Telemetry and States
    setLastIntent(evaluationResult.intent);
    setLastConfidence(evaluationResult.confidence);
    const targetCoffee = evaluationResult.coffeeType || coffeeType;
    setCoffeeType(targetCoffee);

    // Box A transitions to Replying (Solid Green)
    setSystemState('REPLYING');
    soundEngine.playReplying();

    const isAskingToBrew = evaluationResult.intent === 'ASK_BREW_CONFIRM' || 
      evaluationResult.promptToBrew === true || 
      evaluationResult.reply.toLowerCase().includes('do you need me to brew');

    // 5. Append Machine Response to Chat Log
    const machineMessage: ChatMessage = {
      id: `msg-bot-${Date.now()}`,
      sender: 'machine',
      text: evaluationResult.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: evaluationResult.intent,
      confidence: evaluationResult.confidence,
      coffeeType: targetCoffee,
      promptToBrew: isAskingToBrew,
    };
    setMessages((prev) => [...prev, machineMessage]);

    // 6. Execute State Machine Rules
    switch (evaluationResult.intent) {
      case 'WAKEUP_TRIGGER':
        setPromptedToBrew(false);
        setActiveNode('wakeup_trigger');
        // Immediately transition Box B to Brewing in Progress
        setTimeout(() => {
          startBrewingSequence(targetCoffee);
        }, 600);
        break;

      case 'SET_WAKEUP_BREW':
        setPromptedToBrew(false);
        setBrewingState('WAITING_FOR_WAKEUP');
        setActiveNode('wakeup_standby');
        soundEngine.playStandbyArmed();
        break;

      case 'ASK_BREW_CONFIRM':
        setPromptedToBrew(true);
        setActiveNode('unrelated_branch');
        break;

      case 'CANCEL':
        setPromptedToBrew(false);
        if (brewingTimerRef.current) {
          clearInterval(brewingTimerRef.current);
          brewingTimerRef.current = null;
        }
        soundEngine.playCancelSound();
        setBrewingState('IDLE');
        setActiveNode('cancel_branch');
        break;

      case 'UNRELATED':
      default:
        setPromptedToBrew(isAskingToBrew);
        setActiveNode('unrelated_branch');
        break;
    }

    // Return Box A to IDLE after replying pulse (1.6s)
    setTimeout(() => {
      setSystemState('IDLE');
    }, 1600);
  };

  /**
   * User drinks the coffee & resets the cup
   */
  const handleDrinkCoffee = () => {
    soundEngine.playClick();
    setBrewingState('IDLE');
    setActiveNode('user_input');
    setTelemetry({
      progress: 0,
      timeRemaining: 6,
      waterTemp: 93.5,
      pressureBars: 0,
      currentPhase: 'Extraction Complete',
    });

    const resetMsg: ChatMessage = {
      id: `msg-drink-${Date.now()}`,
      sender: 'machine',
      text: "Hope you enjoyed that cup! Drip tray cleared and thermoblock reset to standby. What's next on your schedule?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'UNRELATED',
      confidence: 1.0,
      coffeeType,
    };
    setMessages((prev) => [...prev, resetMsg]);
  };

  /**
   * Reset system to initial state
   */
  const handleResetAll = () => {
    soundEngine.playCancelSound();
    if (brewingTimerRef.current) {
      clearInterval(brewingTimerRef.current);
      brewingTimerRef.current = null;
    }
    setSystemState('IDLE');
    setBrewingState('IDLE');
    setActiveNode('user_input');
    setLastIntent(undefined);
    setLastConfidence(undefined);
    setMessages(INITIAL_MESSAGES);
    setTelemetry({
      progress: 0,
      timeRemaining: 6,
      waterTemp: 93.5,
      pressureBars: 0,
      currentPhase: 'Extraction Complete',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetAll={handleResetAll}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
      />

      {/* Main 3-Panel Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-5.5rem)] min-h-[750px]">
          
          {/* PANEL 1: Voice Command Simulator (Text Chat Interface) */}
          <div className="lg:col-span-4 h-full">
            <ChatPanel
              messages={messages}
              systemState={systemState}
              onSendMessage={handleSendMessage}
              onPlayVoice={handlePlayVoice}
              onClearHistory={() => setMessages(INITIAL_MESSAGES)}
            />
          </div>

          {/* PANEL 2: Hardware Status Dashboard (Light-Up Boxes A & B + Machine Visualizer) */}
          <div className="lg:col-span-4 h-full flex flex-col">
            <StatusDashboard
              systemState={systemState}
              brewingState={brewingState}
              telemetry={telemetry}
              lastIntent={lastIntent}
              lastConfidence={lastConfidence}
              coffeeType={coffeeType}
              onDrinkCoffee={handleDrinkCoffee}
              onManualTriggerWakeup={() => handleSendMessage("Good morning, I'm awake!")}
              onManualCancel={() => handleSendMessage("Cancel my order")}
            />
          </div>

          {/* PANEL 3: Live Flowchart / State Machine Diagram */}
          <div className="lg:col-span-4 h-full">
            <FlowchartPanel
              activeNode={activeNode}
              systemState={systemState}
              brewingState={brewingState}
              lastIntent={lastIntent}
            />
          </div>

        </div>
      </main>

      {/* First-Time User Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleCloseWelcome}
        onSelectStarter={(prompt) => handleSendMessage(prompt)}
      />

      {/* Rules Guide Modal */}
      <RulesGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onTryPreset={(phrase) => handleSendMessage(phrase)}
      />
    </div>
  );
}
