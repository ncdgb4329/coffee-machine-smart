import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, IntentType, SystemState } from '../types';
import { 
  Send, 
  Mic, 
  Sparkles, 
  Bot, 
  User, 
  Clock, 
  Check, 
  Volume2, 
  Coffee, 
  Flame, 
  RotateCcw,
  Sun
} from 'lucide-react';

interface Props {
  messages: ChatMessage[];
  systemState: SystemState;
  onSendMessage: (text: string) => void;
  onPlayVoice: (text: string) => void;
  onClearHistory: () => void;
}

export const ChatPanel: React.FC<Props> = ({
  messages,
  systemState,
  onSendMessage,
  onPlayVoice,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, systemState]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Preset voice commands to test all logic branches
  const presetCommands = [
    { label: 'Awake Now', phrase: 'I am awake now.', tag: 'TRIGGER' },
    { label: 'Good Morning', phrase: 'Good morning!', tag: 'TRIGGER' },
    { label: 'Direct Brew', phrase: 'Brew me coffee please', tag: 'TRIGGER' },
    { label: 'Morning Chatter', phrase: 'What is the weather outside today?', tag: 'CONVERSATION' },
    { label: 'Schedule Ahead', phrase: 'Brew coffee when I wake up tomorrow', tag: 'SET' },
    { label: 'Cancel', phrase: 'Cancel my order, never mind', tag: 'CANCEL' },
  ];

  // Simulating voice microphone recording
  const handleSimulateVoice = (phrase?: string) => {
    setIsSimulatingVoice(true);
    const targetPhrase = phrase || 'I am awake now.';
    
    // Simulate speech-to-text typing effect
    let currentIdx = 0;
    setInputText('');
    const timer = setInterval(() => {
      currentIdx += 2;
      setInputText(targetPhrase.slice(0, currentIdx));
      if (currentIdx >= targetPhrase.length) {
        clearInterval(timer);
        setIsSimulatingVoice(false);
        setTimeout(() => {
          onSendMessage(targetPhrase);
          setInputText('');
        }, 350);
      }
    }, 40);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 backdrop-blur-md overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Voice Command Simulator
            </h2>
            <p className="text-[11px] text-zinc-500">
              Natural Language Acoustic & Text Terminal
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
          title="Clear Conversation Log"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Log
        </button>
      </div>

      {/* Preset Voice Command Quick Chips */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Quick Voice Prompts:
          </span>
          <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
            <Sun className="w-3 h-3" />
            Wake-Up Reactive
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presetCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(item.phrase)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                item.tag === 'TRIGGER' ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' :
                item.tag === 'SET' ? 'bg-amber-400' :
                item.tag === 'CANCEL' ? 'bg-rose-400' : 'bg-sky-400'
              }`} />
              <span className="group-hover:text-amber-300 transition-colors">
                "{item.phrase}"
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 border-y border-zinc-900">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isLastMessage = idx === messages.length - 1;
          const isBrewPrompt = !isUser && (msg.promptToBrew || msg.text.includes('Do you need me to brew?'));

          const getIntentDisplayLabel = (intent?: IntentType) => {
            switch (intent) {
              case 'WAKEUP_TRIGGER': return 'Awake · Brewing Initiated';
              case 'SET_WAKEUP_BREW': return 'Wake-Up Scheduled';
              case 'CANCEL': return 'Order Cancelled';
              case 'ASK_BREW_CONFIRM': return 'Morning Inquiry';
              case 'UNRELATED': return 'Conversational Reply';
              default: return 'Barista Response';
            }
          };

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-amber-500 text-zinc-950 shadow-[0_0_10px_#f59e0b88]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700/60'
                    : 'bg-zinc-900/90 text-zinc-200 rounded-tl-none border border-zinc-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-zinc-500 font-mono">
                  <span>{isUser ? 'Voice Command' : 'Barista Coffee Maker'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Interactive confirmation chips if machine asked "Do you need me to brew?" */}
                {isBrewPrompt && isLastMessage && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      onClick={() => onSendMessage('Yes, please brew!')}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-bold flex items-center gap-1 shadow-[0_0_10px_#f59e0b66] transition-all cursor-pointer active:scale-95"
                    >
                      <Coffee className="w-3 h-3" />
                      Yes, start brewing!
                    </button>
                    <button
                      onClick={() => onSendMessage('No, just chatting')}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-all cursor-pointer"
                    >
                      No, just chatting
                    </button>
                  </div>
                )}

                {/* Intent Tag on machine response */}
                {!isUser && msg.intent && (
                  <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      msg.intent === 'WAKEUP_TRIGGER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      msg.intent === 'SET_WAKEUP_BREW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      msg.intent === 'CANCEL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      msg.intent === 'ASK_BREW_CONFIRM' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                    }`}>
                      {getIntentDisplayLabel(msg.intent)}
                    </span>

                    <button
                      onClick={() => onPlayVoice(msg.text)}
                      className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                      title="Play simulated voice remark"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Listening & Processing Live Indicator Bubble */}
        {systemState === 'LISTENING_PROCESSING' && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg shrink-0 bg-sky-500 text-zinc-950 flex items-center justify-center shadow-[0_0_12px_#38bdf8]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="rounded-xl rounded-tl-none bg-sky-950/40 border border-sky-500/40 px-3.5 py-2.5 text-xs text-sky-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Analyzing speech acoustics and evaluating intent...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice / Text Input Box */}
      <form onSubmit={handleSend} className="mt-3 relative flex items-center gap-2">
        {/* Simulate Voice Mic Button */}
        <button
          type="button"
          onClick={() => handleSimulateVoice()}
          disabled={isSimulatingVoice || systemState === 'LISTENING_PROCESSING'}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            isSimulatingVoice
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-[0_0_12px_#f59e0b] animate-pulse'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
          title="Simulate Voice Input with Speech Waveform"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Text Input Field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isSimulatingVoice ? 'Simulating speech-to-text voice recognition...' : 'Say or type something to the coffee maker...'}
            disabled={isSimulatingVoice || systemState === 'LISTENING_PROCESSING'}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-3 pr-9 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 pointer-events-none">
            ↵
          </kbd>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || systemState === 'LISTENING_PROCESSING'}
          className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 font-semibold rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
