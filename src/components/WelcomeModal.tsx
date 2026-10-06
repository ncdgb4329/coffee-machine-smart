import React from 'react';
import { 
  Coffee, 
  Sparkles, 
  Radio, 
  GitFork, 
  ArrowRight, 
  Check, 
  X,
  Volume2,
  Clock,
  Sun
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectStarter: (prompt: string) => void;
}

export const WelcomeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectStarter,
}) => {
  if (!isOpen) return null;

  const starterPrompts = [
    {
      title: 'Wake Up & Brew Immediately',
      prompt: 'I am awake now.',
      icon: <Sun className="w-4 h-4 text-emerald-400" />,
      description: 'Signals you just got out of bed and immediately fires up the 9-bar extraction sequence.',
      badge: 'Most Popular',
    },
    {
      title: 'Schedule a Morning Brew',
      prompt: 'Brew coffee when I wake up tomorrow',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      description: 'Arms Box B in standby mode waiting to detect your voice upon waking.',
      badge: 'Standby Mode',
    },
    {
      title: 'Morning Conversation',
      prompt: 'What is the weather outside today?',
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      description: 'The machine responds wittily to your chatter and inquires: "Do you need me to brew?".',
      badge: 'Conversational',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-sans tracking-tight">
                Welcome to Barista-OS
              </h2>
              <p className="text-xs text-zinc-400">
                Smart Coffee Machine Simulator with Natural Language Understanding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all cursor-pointer"
            title="Close Welcome Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 relative z-10 text-xs text-zinc-300">
          {/* Section 1: What this app does */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              What This App Does
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              This interactive application simulates a next-generation smart coffee maker that understands when you wake up and responds to natural voice instructions. Whether you ask for coffee upon waking, schedule a brew for tomorrow, or simply start morning conversation, the machine understands your intent and coordinates its physical extraction system.
            </p>
          </div>

          {/* Section 2: Main Features */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Three Interactive Panels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Voice Terminal</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Chat naturally or simulate speech to instruct the coffee maker.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Status Dashboard</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Glowing Box A & Box B indicators plus animated espresso extraction with crema.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-sky-400 font-medium mb-1">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Live Flowchart</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Real-time state diagram tracking intent parsing, standby, and brewing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Where to Start */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Where to Start (Click Any Prompt to Begin)
            </h3>
            <div className="space-y-2">
              {starterPrompts.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectStarter(item.prompt);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {item.description}
                      </p>
                      <code className="text-[10px] text-amber-400/90 font-mono mt-1 block">
                        "{item.prompt}"
                      </code>
                    </div>
                  </div>

                  <div className="shrink-0 p-1.5 text-zinc-500 group-hover:text-amber-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between relative z-10">
          <span className="text-[11px] font-mono text-zinc-500">
            Acoustics & Voice Synthesis Supported
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
