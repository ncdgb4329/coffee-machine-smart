import React from 'react';
import { X, CheckCircle2, Clock, Sparkles, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTryPreset: (text: string) => void;
}

export const RulesGuideModal: React.FC<Props> = ({ isOpen, onClose, onTryPreset }) => {
  if (!isOpen) return null;

  const rules = [
    {
      title: '1. Set Wake-Up Brewing Request',
      badge: 'Intent: SET_WAKEUP_BREW',
      badgeColor: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
      description: 'Phrases like "Brew coffee when I wake up" or "Espresso first thing when I\'m up" set Box B to Standby / Waiting for Wake-Up (Amber indicator).',
      examples: ['Brew coffee when I wake up', 'Make a cup tomorrow morning', 'Espresso first thing when I\'m up'],
      actionLabel: 'Try Setup Command',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      title: '2. Wake-Up Event Trigger',
      badge: 'Intent: WAKEUP_TRIGGER',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
      description: 'Stating "I am awake now." or "Good morning!", or speaking any phrase after arming standby, immediately triggers the 9-bar extraction sequence (Pulsing Amber/Orange), transitioning to Coffee Ready (Bright Green).',
      examples: ['I am awake now.', 'Good morning!', 'I just woke up', 'Brew me coffee please'],
      actionLabel: 'Try Wake-Up Trigger',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: '3. Cancellation / Negative Intent',
      badge: 'Intent: CANCEL',
      badgeColor: 'border-rose-500/40 bg-rose-500/20 text-rose-300',
      description: 'Commands like "Never mind", "Cancel my order", or "Don\'t make coffee" cancel any active or scheduled brews and return Box B to Idle.',
      examples: ['Cancel my order', 'Never mind, don\'t make coffee', 'Abort current order'],
      actionLabel: 'Try Cancel Command',
      icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
    },
    {
      title: '4. Morning Conversation & Inquiries',
      badge: 'Intent: ASK_BREW_CONFIRM',
      badgeColor: 'border-sky-500/40 bg-sky-500/20 text-sky-300',
      description: 'When someone wakes up and starts talking without explicitly stating "I just woke up" or "brew me coffee", the machine replies wittily to whatever was said and asks: "Do you need me to brew?". Answering "Yes" starts brewing immediately!',
      examples: ['What\'s the weather today?', 'Hello there', 'I am so tired today'],
      actionLabel: 'Try Conversation',
      icon: <HelpCircle className="w-4 h-4 text-sky-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div>
            <h3 className="text-base font-bold text-zinc-100 font-sans">
              Smart Coffee Machine Logic & Intent Guide
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Natural language understanding rules and hardware state transitions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700/60">
                    {rule.icon}
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    {rule.title}
                  </h4>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${rule.badgeColor}`}>
                  {rule.badge}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {rule.description}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-zinc-500 mr-1">Examples:</span>
                {rule.examples.map((ex, exIdx) => (
                  <button
                    key={exIdx}
                    onClick={() => {
                      onTryPreset(ex);
                      onClose();
                    }}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 border border-zinc-700/60 text-zinc-300 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <span>"{ex}"</span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Barista-OS Firmware Spec v4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs cursor-pointer transition-all"
          >
            Got it, Let's Brew
          </button>
        </div>
      </div>
    </div>
  );
};
