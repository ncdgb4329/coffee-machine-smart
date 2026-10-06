import React from 'react';
import { BrewingState, BrewingTelemetry } from '../types';
import { Coffee, Flame, Gauge, Sparkles, Check } from 'lucide-react';

interface Props {
  brewingState: BrewingState;
  telemetry: BrewingTelemetry;
  coffeeType: string;
  onDrinkCoffee: () => void;
}

export const EspressoMachineVisualizer: React.FC<Props> = ({
  brewingState,
  telemetry,
  coffeeType,
  onDrinkCoffee,
}) => {
  const isBrewing = brewingState === 'BREWING';
  const isReady = brewingState === 'COFFEE_READY';
  const isStandby = brewingState === 'WAITING_FOR_WAKEUP';

  // Liquid height in cup (0% to 75%)
  const liquidHeight = isReady ? 75 : isBrewing ? (telemetry.progress / 100) * 75 : 0;
  // Crema foam height (0% to 15%)
  const cremaHeight = isReady ? 14 : isBrewing && telemetry.progress > 40 ? ((telemetry.progress - 40) / 60) * 14 : 0;

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-md overflow-hidden">
      {/* Background ambient glow based on state */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isReady
            ? 'bg-emerald-500/20'
            : isBrewing
            ? 'bg-amber-500/25 animate-pulse'
            : isStandby
            ? 'bg-amber-500/10'
            : 'bg-zinc-800/10'
        }`}
      />

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Coffee className={`w-4 h-4 ${isReady ? 'text-emerald-400' : isBrewing ? 'text-amber-400' : isStandby ? 'text-amber-400' : 'text-zinc-500'}`} />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Extraction Chamber Visualizer
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {isBrewing || isReady ? `${telemetry.waterTemp.toFixed(1)}°C` : '88.0°C'}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            {isBrewing ? `${telemetry.pressureBars.toFixed(1)} BAR` : '0.0 BAR'}
          </span>
        </div>
      </div>

      {/* Main Machine Illustration & Cup Simulation */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Group Head / Portafilter Assembly */}
        <div className="relative w-40 flex flex-col items-center z-10">
          {/* Top chrome bar */}
          <div className="w-32 h-3 rounded-t-sm bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700 border-b border-zinc-900 shadow-md" />
          
          {/* Group head cylinder */}
          <div className="w-24 h-5 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 border-x border-zinc-700 flex items-center justify-center relative">
            {/* LED status strip */}
            <div
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                isReady
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : isBrewing
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse'
                  : isStandby
                  ? 'bg-amber-400/60 shadow-[0_0_4px_#f59e0b]'
                  : 'bg-zinc-700'
              }`}
            />
          </div>

          {/* Portafilter Handle & Basket */}
          <div className="relative flex items-center justify-center">
            {/* Portafilter basket */}
            <div className="w-16 h-4 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-b-md border border-zinc-600" />
            {/* Portafilter handle extending to right */}
            <div className="absolute left-10 top-0.5 w-14 h-3 bg-gradient-to-r from-amber-950 to-zinc-900 rounded-r-full border border-zinc-800 shadow-sm" />
          </div>

          {/* Dual Spouts */}
          <div className="flex gap-4 -mt-0.5">
            <div className="w-1.5 h-3 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-b-sm" />
            <div className="w-1.5 h-3 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-b-sm" />
          </div>

          {/* Liquid streams dripping when brewing */}
          {isBrewing && (
            <div className="flex gap-4 -mt-0.5 pointer-events-none">
              <div className="w-1 h-14 bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 rounded-full animate-pulse opacity-90 shadow-[0_0_4px_#78350f]" />
              <div className="w-1 h-14 bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 rounded-full animate-pulse opacity-90 shadow-[0_0_4px_#78350f]" />
            </div>
          )}
        </div>

        {/* Coffee Cup on Drip Tray */}
        <div className={`relative ${isBrewing ? '-mt-2' : 'mt-8'} transition-all duration-300 flex flex-col items-center`}>
          {/* Animated Steam Rising when hot/ready */}
          {(isBrewing || isReady) && (
            <div className="absolute -top-10 flex gap-2 pointer-events-none">
              <div className="w-1.5 h-8 bg-zinc-200/20 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '2s' }} />
              <div className="w-2 h-10 bg-zinc-200/25 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
              <div className="w-1.5 h-7 bg-zinc-200/20 rounded-full blur-[2px] animate-bounce" style={{ animationDuration: '1.8s', animationDelay: '0.8s' }} />
            </div>
          )}

          {/* Glass Cup Body */}
          <div className="relative w-24 h-20 rounded-b-3xl border-2 border-zinc-600/70 bg-gradient-to-b from-zinc-800/40 to-zinc-900/60 backdrop-blur-md overflow-hidden shadow-inner flex flex-col justify-end p-1">
            {/* Internal glass shine reflection */}
            <div className="absolute top-1 left-2 w-1.5 h-14 bg-white/10 rounded-full blur-[0.5px] pointer-events-none" />

            {/* Coffee Liquid */}
            <div
              className="w-full bg-gradient-to-t from-stone-950 via-amber-950 to-amber-900 transition-all duration-500 rounded-b-[20px] relative"
              style={{ height: `${liquidHeight}%` }}
            >
              {/* Crema layer */}
              {cremaHeight > 0 && (
                <div
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-t-sm shadow-[0_0_6px_#f59e0b] opacity-90 transition-all duration-500"
                  style={{ height: `${cremaHeight}px` }}
                />
              )}
            </div>

            {/* Cup handle */}
            <div className="absolute -right-3 top-3 w-4 h-8 border-2 border-zinc-600/70 rounded-r-xl pointer-events-none" />
          </div>

          {/* Drip Tray */}
          <div className="w-36 h-2 bg-zinc-800 rounded-full border border-zinc-700 mt-1 shadow-md flex items-center justify-center gap-1">
            <div className="w-2 h-0.5 bg-zinc-950 rounded-full" />
            <div className="w-2 h-0.5 bg-zinc-950 rounded-full" />
            <div className="w-2 h-0.5 bg-zinc-950 rounded-full" />
            <div className="w-2 h-0.5 bg-zinc-950 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Action & Beverage info */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
            Target Beverage
          </span>
          <span className="text-xs font-medium text-zinc-200">
            {coffeeType}
          </span>
        </div>

        {isReady ? (
          <button
            onClick={onDrinkCoffee}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold rounded-lg shadow-[0_0_15px_#10b98188] transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            Grab Mug & Enjoy
          </button>
        ) : isBrewing ? (
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            {telemetry.currentPhase} ({telemetry.timeRemaining}s)
          </div>
        ) : isStandby ? (
          <div className="text-xs font-mono text-amber-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Sensors Listening for Awakening
          </div>
        ) : (
          <div className="text-xs font-mono text-zinc-500">
            Awaiting Wake-Up Command
          </div>
        )}
      </div>
    </div>
  );
};
