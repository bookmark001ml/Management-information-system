import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Globe,
  Music,
  Calculator,
  FileEdit,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

const APPS = [
  { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-cyan-400', border: 'border-cyan-400', text: 'text-cyan-300' },
  { id: 'music', name: 'Music Player', icon: Music, color: 'bg-purple-400', border: 'border-purple-400', text: 'text-purple-300' },
  { id: 'calc', name: 'Calculator', icon: Calculator, color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-300' },
  { id: 'editor', name: 'Doc Editor', icon: FileEdit, color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-300' },
];

type SpeedMode = 'slow' | 'fast' | 'realtime';

export function MultitaskingOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeAppIdx, setActiveAppIdx] = useState(0);
  const [sliceMsLeft, setSliceMsLeft] = useState(20);
  const [switchCount, setSwitchCount] = useState(0);
  const [timeline, setTimeline] = useState<number[]>([0]);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('realtime');
  const [notified, setNotified] = useState(false);

  // Real-time mode runs very, very fast (22ms interval switching apps rapidly!)
  const tickMs = speedMode === 'realtime' ? 22 : speedMode === 'fast' ? 65 : 200;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      if (speedMode === 'realtime') {
        // Ultra-fast real-time context switch every single tick
        setActiveAppIdx((idx) => {
          const nextIdx = (idx + 1) % APPS.length;
          setSwitchCount((c) => {
            const nextC = c + 1;
            if (nextC >= 20 && !notified) {
              setNotified(true);
              soundFx.playVictory();
              onSimulationComplete();
            }
            return nextC;
          });
          setTimeline((tl) => [...tl.slice(-15), nextIdx]);
          return nextIdx;
        });
        setSliceMsLeft((ms) => (ms <= 5 ? 20 : ms - 5));
      } else {
        setSliceMsLeft((prev) => {
          if (prev <= 5) {
            setActiveAppIdx((idx) => {
              const nextIdx = (idx + 1) % APPS.length;
              setSwitchCount((c) => {
                const nextC = c + 1;
                if (nextC >= 8 && !notified) {
                  setNotified(true);
                  soundFx.playVictory();
                  onSimulationComplete();
                }
                return nextC;
              });
              setTimeline((tl) => [...tl.slice(-15), nextIdx]);
              return nextIdx;
            });
            return 20;
          }
          return prev - 5;
        });
      }
    }, tickMs);
    return () => clearInterval(timer);
  }, [isPlaying, tickMs, speedMode, notified, onSimulationComplete]);

  const activeApp = APPS[activeAppIdx];
  const switchesPerSec =
    speedMode === 'realtime' ? '~45 switches/sec' : speedMode === 'fast' ? '~15 switches/sec' : '~5 switches/sec';

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            03 · REAL-TIME TIME-SHARING CPU SCHEDULER
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            {speedMode === 'realtime'
              ? 'Real-Time Speed: Single CPU switches so rapidly that all 4 apps appear to run simultaneously!'
              : 'Slow Motion lets you observe each 20ms time slice moving from app to app.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSpeedMode('slow');
              }}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer whitespace-nowrap ${
                speedMode === 'slow' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Slow Motion
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSpeedMode('fast');
              }}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer whitespace-nowrap ${
                speedMode === 'fast' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fast
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSpeedMode('realtime');
                setIsPlaying(true);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-bold cursor-pointer whitespace-nowrap ${
                speedMode === 'realtime'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" aria-hidden="true" />
              <span>Real-Time</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            )}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveAppIdx(0);
              setSliceMsLeft(20);
              setSwitchCount(0);
              setTimeline([0]);
              setIsPlaying(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveAppIdx(0);
              setSliceMsLeft(20);
              setSwitchCount(0);
              setTimeline([0]);
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4 Application Windows + Central Time-Slice CPU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {APPS.map((app, idx) => {
            const Icon = app.icon;
            const active = idx === activeAppIdx;
            // In Real-Time ultra-fast mode, all 4 apps feel live & active
            const feelsLive = speedMode === 'realtime' && isPlaying;
            return (
              <div
                key={app.id}
                className={`rounded-xl border p-4 flex flex-col justify-between min-h-[136px] transition-all ${
                  active
                    ? `bg-slate-900 ${app.border} shadow-lg`
                    : feelsLive
                      ? 'bg-slate-900/85 border-slate-700'
                      : 'bg-slate-950 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${app.text}`} aria-hidden="true" />
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      active ? app.text : feelsLive ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {active ? 'ACTIVE CPU' : feelsLive ? 'LIVE' : 'READY'}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-white">{app.name}</p>
                  <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${app.color}`}
                      animate={{
                        width: active
                          ? `${(sliceMsLeft / 20) * 100}%`
                          : feelsLive
                            ? '100%'
                            : '35%',
                      }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.05 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single CPU Time-Slice Engine */}
        <div className="lg:col-span-4 rounded-xl bg-gradient-to-b from-[#0b1530] to-slate-950 border border-cyan-500/40 p-5 flex flex-col items-center text-center space-y-2">
          <Cpu className={`w-8 h-8 ${activeApp.text}`} aria-hidden="true" />
          <span className="font-mono text-[11px] text-slate-400">
            SINGLE CPU · {switchesPerSec.toUpperCase()}
          </span>
          <p className="font-display text-lg font-bold text-white">{activeApp.name}</p>
          <span className="font-mono tabular-nums text-2xl font-bold text-cyan-300">
            {switchCount} switches
          </span>
        </div>
      </div>

      {/* Live CPU Time-Slice Switching Timeline */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">CPU Rapid Switching Timeline</span>
          <span className="font-mono text-[11px] text-cyan-400">
            {speedMode === 'realtime'
              ? 'Ultra-fast real-time rotation (22ms ticks)'
              : 'Each block = 20ms time slice'}
          </span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
          {timeline.map((appIndex, i) => {
            const app = APPS[appIndex];
            return (
              <div
                key={i}
                className={`h-7 rounded ${app.color} flex items-center justify-center text-[10px] font-mono font-bold text-slate-950`}
                title={app.name}
              >
                {app.name.slice(0, 2)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
