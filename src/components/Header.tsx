import React from 'react';
import { Coffee, Volume2, VolumeX, RotateCcw, Sparkles, HelpCircle, Flame } from 'lucide-react';

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  onResetAll: () => void;
  onOpenHelp: () => void;
  onOpenWelcome: () => void;
}

export const Header: React.FC<Props> = ({
  isMuted,
  onToggleMute,
  onResetAll,
  onOpenHelp,
  onOpenWelcome,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-[0_0_18px_rgba(245,158,11,0.35)]">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-100 font-sans">
                Barista-OS
              </h1>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                Smart Coffee
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Interactive Coffee Maker Simulator · Natural Voice Intent & State Machine Flowchart
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Welcome Guide button */}
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            title="Open Welcome Guide & Instructions"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Welcome Guide</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              isMuted
                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100'
            }`}
            title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* State Logic Rules */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
            title="View Logic Rules & Scenarios"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Rules</span>
          </button>

          {/* Reset System State */}
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            title="Reset to Idle State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
