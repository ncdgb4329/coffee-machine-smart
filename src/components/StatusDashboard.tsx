import React from 'react';
import { BrewingState, BrewingTelemetry, IntentType, SystemState } from '../types';
import { EspressoMachineVisualizer } from './EspressoMachineVisualizer';
import { 
  Activity, 
  Cpu, 
  Flame, 
  Radio, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';

interface Props {
  systemState: SystemState;
  brewingState: BrewingState;
  telemetry: BrewingTelemetry;
  lastIntent?: IntentType;
  lastConfidence?: number;
  coffeeType: string;
  onDrinkCoffee: () => void;
  onManualTriggerWakeup: () => void;
  onManualCancel: () => void;
}

export const StatusDashboard: React.FC<Props> = ({
  systemState,
  brewingState,
  telemetry,
  lastIntent,
  lastConfidence,
  coffeeType,
  onDrinkCoffee,
  onManualTriggerWakeup,
  onManualCancel,
}) => {
  // Box A styles based on requirements:
  // States: Idle (Off/Dim), Listening & Processing (Flashing/Glowing Blue), Replying (Solid Green)
  const isSysIdle = systemState === 'IDLE';
  const isSysProcessing = systemState === 'LISTENING_PROCESSING';
  const isSysReplying = systemState === 'REPLYING';

  // Box B styles based on requirements:
  // States: Standby / Waiting for Wake-Up (Amber), Brewing in Progress (Animated Pulsing Amber/Orange), Coffee Ready / Done (Solid Bright Green)
  const isBrewIdle = brewingState === 'IDLE';
  const isBrewStandby = brewingState === 'WAITING_FOR_WAKEUP';
  const isBrewActive = brewingState === 'BREWING';
  const isBrewReady = brewingState === 'COFFEE_READY';

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Dashboard Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-500" />
            Hardware Status Dashboard
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time light-up hardware indicators and extraction telemetry
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ready & Connected
          </span>
        </div>
      </div>

      {/* LIGHT-UP BOXES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ======================================================== */}
        {/* BOX A: System & Processing Indicator                     */}
        {/* States: Idle (Off/Dim), Listening & Processing (Glowing Blue), Replying (Solid Green) */}
        {/* ======================================================== */}
        <div
          className={`relative rounded-xl border p-4 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[175px] ${
            isSysProcessing
              ? 'border-sky-500/80 bg-sky-950/20 shadow-[0_0_30px_rgba(56,189,248,0.25)] ring-1 ring-sky-500/50'
              : isSysReplying
              ? 'border-emerald-500/80 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/50'
              : 'border-zinc-800/80 bg-zinc-900/40 shadow-none'
          }`}
        >
          {/* Top header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isSysProcessing
                    ? 'bg-sky-500 text-black shadow-[0_0_12px_#38bdf8]'
                    : isSysReplying
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_#10b981]'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Box A · Processing Unit
                </span>
                <h3 className="text-xs font-semibold text-zinc-100">
                  Voice & NLP Engine
                </h3>
              </div>
            </div>

            {/* Glowing Status Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                isSysProcessing
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 animate-pulse'
                  : isSysReplying
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                  : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isSysProcessing
                    ? 'bg-sky-400 animate-ping'
                    : isSysReplying
                    ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                    : 'bg-zinc-600'
                }`}
              />
              {isSysProcessing
                ? 'LISTENING & PROCESSING'
                : isSysReplying
                ? 'REPLYING'
                : 'IDLE (STANDBY)'}
            </div>
          </div>

          {/* Central Visualizer: Audio wave / Neural state */}
          <div className="my-3 py-2 px-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity
                className={`w-4 h-4 ${
                  isSysProcessing
                    ? 'text-sky-400 animate-bounce'
                    : isSysReplying
                    ? 'text-emerald-400'
                    : 'text-zinc-600'
                }`}
              />
              <div className="text-[11px] font-mono">
                {isSysProcessing ? (
                  <span className="text-sky-300 animate-pulse flex items-center gap-1">
                    <span>Acoustic NLP classification active</span>
                    <span className="inline-block animate-bounce">...</span>
                  </span>
                ) : isSysReplying ? (
                  <span className="text-emerald-300">
                    Transmitting conversational audio payload
                  </span>
                ) : (
                  <span className="text-zinc-500">
                    Microphone sensor awaiting audio stream
                  </span>
                )}
              </div>
            </div>

            {/* Simulated mini waveform */}
            <div className="flex items-end gap-1 h-5">
              {[40, 70, 30, 90, 60, 100, 50, 80].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isSysProcessing
                      ? 'bg-sky-400 animate-pulse'
                      : isSysReplying
                      ? 'bg-emerald-400'
                      : 'bg-zinc-700 h-1.5'
                  }`}
                  style={{
                    height: isSysProcessing
                      ? `${Math.max(15, (height * (Math.sin(i + Date.now() / 200) + 1.2)) / 2)}%`
                      : isSysReplying
                      ? `${height * 0.7}%`
                      : '4px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Telemetry metadata */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
            <div>
              <span className="text-zinc-500 mr-1.5">Action:</span>
              <span className="text-zinc-200 font-semibold">
                {lastIntent === 'WAKEUP_TRIGGER' ? 'Awake · Brewing' :
                 lastIntent === 'SET_WAKEUP_BREW' ? 'Standby Armed' :
                 lastIntent === 'CANCEL' ? 'Cancelled' :
                 lastIntent === 'ASK_BREW_CONFIRM' ? 'Morning Inquiry' :
                 'Listening'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 mr-1.5">Acoustic Clarity:</span>
              <span className="text-zinc-200">
                {lastConfidence ? `${(lastConfidence * 100).toFixed(0)}%` : 'Optimal'}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOX B: Coffee Machine / Brewing Indicator                */}
        {/* States: Standby / Waiting for Wake-Up (Amber),           */}
        {/*         Brewing in Progress (Animated Pulsing Amber/Orange), */}
        {/*         Coffee Ready / Done (Solid Bright Green)         */}
        {/* ======================================================== */}
        <div
          className={`relative rounded-xl border p-4 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[175px] ${
            isBrewReady
              ? 'border-emerald-500/80 bg-emerald-950/25 shadow-[0_0_35px_rgba(34,197,94,0.3)] ring-1 ring-emerald-500/60'
              : isBrewActive
              ? 'border-amber-500/90 bg-amber-950/25 shadow-[0_0_35px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/60 animate-pulse'
              : isBrewStandby
              ? 'border-amber-500/60 bg-amber-950/15 shadow-[0_0_20px_rgba(245,158,11,0.18)]'
              : 'border-zinc-800/80 bg-zinc-900/40 shadow-none'
          }`}
        >
          {/* Top header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isBrewReady
                    ? 'bg-emerald-500 text-black shadow-[0_0_14px_#22c55e]'
                    : isBrewActive
                    ? 'bg-amber-500 text-black shadow-[0_0_14px_#f59e0b] animate-spin'
                    : isBrewStandby
                    ? 'bg-amber-500/80 text-black shadow-[0_0_10px_#f59e0b]'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
                style={isBrewActive ? { animationDuration: '6s' } : {}}
              >
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Box B · Extraction Unit
                </span>
                <h3 className="text-xs font-semibold text-zinc-100">
                  Espresso & Brewing
                </h3>
              </div>
            </div>

            {/* Glowing Status Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                isBrewReady
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  : isBrewActive
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-400/70 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : isBrewStandby
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-400/40'
                  : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isBrewReady
                    ? 'bg-emerald-400 shadow-[0_0_8px_#22c55e]'
                    : isBrewActive
                    ? 'bg-amber-400 animate-ping'
                    : isBrewStandby
                    ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                    : 'bg-zinc-600'
                }`}
              />
              {isBrewReady
                ? 'COFFEE READY / DONE'
                : isBrewActive
                ? 'BREWING IN PROGRESS'
                : isBrewStandby
                ? 'STANDBY / WAITING FOR WAKE-UP'
                : 'IDLE (DISARMED)'}
            </div>
          </div>

          {/* Central Progress or Action Banner */}
          <div className="my-3 py-2 px-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            {isBrewActive ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    {telemetry.currentPhase}
                  </span>
                  <span>{telemetry.timeRemaining}s remaining</span>
                </div>
                {/* Extraction bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
                    style={{ width: `${telemetry.progress}%` }}
                  />
                </div>
              </div>
            ) : isBrewStandby ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Standing by for wake-up morning voice event</span>
                </div>
                {/* Quick Wake-Up simulator trigger button */}
                <button
                  onClick={onManualTriggerWakeup}
                  className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-semibold cursor-pointer active:scale-95 transition-all shadow-[0_0_8px_#f59e0b66]"
                >
                  Trigger "I'm Awake"
                </button>
              </div>
            ) : isBrewReady ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fresh {coffeeType} ready at optimal 72°C drinking temp</span>
                </div>
                <button
                  onClick={onDrinkCoffee}
                  className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[10px] font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Drink & Reset
                </button>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Machine ready for scheduling</span>
                <span className="text-[10px] text-zinc-600">Thermoblock Primed</span>
              </div>
            )}
          </div>

          {/* Bottom Telemetry metadata */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
            <div>
              <span className="text-zinc-600 mr-1.5">MODE:</span>
              <span className="text-zinc-300 font-semibold">
                {isBrewStandby ? 'STANDBY ARMED' : isBrewActive ? 'EXTRACTION' : isBrewReady ? 'SERVE' : 'DISARMED'}
              </span>
            </div>
            {isBrewStandby && (
              <button
                onClick={onManualCancel}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Cancel Standby
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hardware Graphic Visualization: Extraction Chamber */}
      <EspressoMachineVisualizer
        brewingState={brewingState}
        telemetry={telemetry}
        coffeeType={coffeeType}
        onDrinkCoffee={onDrinkCoffee}
      />
    </div>
  );
};
