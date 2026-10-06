import React from 'react';
import { BrewingState, FlowNodeId, IntentType, SystemState } from '../types';
import { 
  GitFork, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Sparkles, 
  Coffee, 
  RotateCcw, 
  MessageSquare, 
  HelpCircle,
  Zap
} from 'lucide-react';

interface Props {
  activeNode: FlowNodeId;
  systemState: SystemState;
  brewingState: BrewingState;
  lastIntent?: IntentType;
}

interface FlowStepInfo {
  id: FlowNodeId;
  label: string;
  subtitle: string;
  category: 'primary' | 'branch';
  icon: React.ReactNode;
  ruleExplanation: string;
}

export const FlowchartPanel: React.FC<Props> = ({
  activeNode,
  systemState,
  brewingState,
  lastIntent,
}) => {
  const [selectedNode, setSelectedNode] = React.useState<FlowNodeId | null>(null);

  const steps: FlowStepInfo[] = [
    {
      id: 'user_input',
      label: 'User Input',
      subtitle: 'Voice or text phrase received',
      category: 'primary',
      icon: <MessageSquare className="w-4 h-4" />,
      ruleExplanation: 'Audio intake stream or text prompt entered via the Voice Command Simulator.',
    },
    {
      id: 'intent_classification',
      label: 'Intent Classification',
      subtitle: 'NLU acoustic & semantic parsing',
      category: 'primary',
      icon: <Zap className="w-4 h-4" />,
      ruleExplanation: 'Analyzes user utterance against state context to determine intent: Set Wake-Up, Wake-Up Trigger, Cancel, or Unrelated.',
    },
    {
      id: 'wakeup_standby',
      label: 'Wake-Up Standby State',
      subtitle: 'Box B: Amber standby armed',
      category: 'primary',
      icon: <Clock className="w-4 h-4" />,
      ruleExplanation: 'Machine enters armed standby waiting for the user to wake up. Responsive to ANY subsequent voice input.',
    },
    {
      id: 'wakeup_trigger',
      label: 'Wake-Up Trigger',
      subtitle: 'Awakening detected or standby voice input',
      category: 'primary',
      icon: <Sparkles className="w-4 h-4" />,
      ruleExplanation: 'Explicitly stating "I am awake now" / "Good morning", or speaking while in standby mode, confirms the user is awake and fires the 9-bar brewing sequence.',
    },
    {
      id: 'brewing_process',
      label: 'Brewing Process',
      subtitle: 'Box B: Pulsing Amber / Orange',
      category: 'primary',
      icon: <Flame className="w-4 h-4" />,
      ruleExplanation: 'Runs timed 9-bar extraction sequence: grinding beans, pre-infusion, extraction, and crema foam creation.',
    },
    {
      id: 'completion',
      label: 'Completion',
      subtitle: 'Box B: Bright Solid Green',
      category: 'primary',
      icon: <Coffee className="w-4 h-4" />,
      ruleExplanation: 'Fresh artisanal coffee ready in cup! Machine chimes and congratulates user with warm barista remark.',
    },
  ];

  const branchSteps: FlowStepInfo[] = [
    {
      id: 'cancel_branch',
      label: 'Cancellation / Reset',
      subtitle: 'Negative intent recognized',
      category: 'branch',
      icon: <RotateCcw className="w-4 h-4" />,
      ruleExplanation: 'Expressions like "Never mind" or "Cancel my order" cancel the scheduled brew and return Box B to Idle.',
    },
    {
      id: 'unrelated_branch',
      label: 'Conversation / Brew Inquiry',
      subtitle: 'Witty reply + "Do you need me to brew?"',
      category: 'branch',
      icon: <HelpCircle className="w-4 h-4" />,
      ruleExplanation: 'Casual morning conversation triggers a witty coffee-obsessed response followed by: "Do you need me to brew?". Answering affirmatively starts brewing immediately.',
    },
  ];

  // Helper to determine node state
  const getNodeStatus = (nodeId: FlowNodeId) => {
    if (activeNode === nodeId) return 'ACTIVE';
    
    // Check completed flow history based on current brewing state
    if (brewingState === 'COFFEE_READY') {
      if (['user_input', 'intent_classification', 'wakeup_standby', 'wakeup_trigger', 'brewing_process'].includes(nodeId)) {
        return 'COMPLETED';
      }
    } else if (brewingState === 'BREWING') {
      if (['user_input', 'intent_classification', 'wakeup_standby', 'wakeup_trigger'].includes(nodeId)) {
        return 'COMPLETED';
      }
    } else if (brewingState === 'WAITING_FOR_WAKEUP') {
      if (['user_input', 'intent_classification'].includes(nodeId)) {
        return 'COMPLETED';
      }
    }
    return 'PENDING';
  };

  const currentInspectorStep = [...steps, ...branchSteps].find(
    (s) => s.id === (selectedNode || activeNode)
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-emerald-400" />
            Live Flowchart & State Machine
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Dynamic execution graph highlighting the active state and branches
          </p>
        </div>
        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            Active Node:
          </span>
          <span className="text-zinc-200 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {activeNode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Flowchart Graph */}
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
        {/* Primary Pipeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Core Brewing Pipeline
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Sequential Flow [1 → 6]
            </span>
          </div>

          <div className="space-y-2 relative">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-zinc-800 pointer-events-none" />

            {steps.map((step, idx) => {
              const status = getNodeStatus(step.id);
              const isActive = status === 'ACTIVE';
              const isCompleted = status === 'COMPLETED';

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedNode(step.id)}
                  className={`relative flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/60'
                      : isCompleted
                      ? 'bg-zinc-900/40 border-emerald-500/30 hover:border-emerald-500/50'
                      : 'bg-zinc-900/20 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Step Icon & Status Dot */}
                  <div
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 z-10 transition-all ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-[0_0_12px_#f59e0b]'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          isActive
                            ? 'text-amber-400'
                            : isCompleted
                            ? 'text-zinc-200'
                            : 'text-zinc-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Flow arrow indicator */}
                  {idx < steps.length - 1 && (
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400 animate-pulse' : 'text-zinc-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Branches Section */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Conditional Logic Branches
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Branching Paths
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {branchSteps.map((step) => {
              const isActive = activeNode === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedNode(step.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/50'
                      : 'bg-zinc-900/30 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <h5 className={`text-xs font-semibold ${isActive ? 'text-amber-400' : 'text-zinc-300'}`}>
                      {step.label}
                    </h5>
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Inspector Box */}
        {currentInspectorStep && (
          <div className="mt-4 p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-500 uppercase">
                  Logic Inspector
                </span>
                <span className="text-xs font-semibold text-zinc-200">
                  {currentInspectorStep.label}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                {getNodeStatus(currentInspectorStep.id)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {currentInspectorStep.ruleExplanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
