import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

const ALL_APPS = [
  { id: 1, name: 'App 1 · Video Render', core: 'Core 1' },
  { id: 2, name: 'App 2 · Data Sort', core: 'Core 2' },
  { id: 3, name: 'App 3 · Image Export', core: 'Core 3' },
  { id: 4, name: 'App 4 · Audio Mix', core: 'Core 4' },
];

export function MultiprocessingOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [appCount, setAppCount] = useState<1 | 2 | 3 | 4>(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0..100
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (progress >= 100) {
      setIsPlaying(false);
      if (!notified) {
        setNotified(true);
        soundFx.playVictory();
        onSimulationComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setProgress((p) => Math.min(100, p + 5));
    }, 115);
    return () => clearTimeout(timer);
  }, [isPlaying, progress, notified, onSimulationComplete]);

  const handleSelectCount = (count: 1 | 2 | 3 | 4) => {
    soundFx.playClick();
    setAppCount(count);
    setProgress(0);
    setIsPlaying(true);
  };

  // Single-core sequential runs each selected app one after another
  const sequentialTaskDone = Math.floor((progress / 100) * appCount);
  const utilizationPct = appCount * 25;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            04 · 4-CORE PARALLEL EXECUTION
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            Choose 1, 2, 3, or 4 applications to execute simultaneously on the 4-Core CPU.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (progress >= 100) {
                setProgress(0);
                setIsPlaying(true);
              } else {
                setIsPlaying((p) => !p);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            )}
            <span>{isPlaying ? 'Pause' : progress >= 100 ? 'Play Again' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setProgress(0);
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
              setProgress(0);
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* User Selection Prompt: Run 1, 2, 3, or 4 Applications */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white">
            How many applications do you want to run on the 4-Core CPU?
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Active Cores: {appCount} of 4 · Idle Cores: {4 - appCount} · CPU Utilization:{' '}
            <span className="text-cyan-300 font-mono font-bold">{utilizationPct}%</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {([1, 2, 3, 4] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => handleSelectCount(count)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${
                appCount === count
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400'
              }`}
            >
              Run {count} {count === 1 ? 'App' : 'Apps'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 CPU Cores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ALL_APPS.map((t, idx) => {
          const isAssigned = idx < appCount;
          const done = isAssigned && progress >= 100;
          return (
            <div
              key={t.id}
              className={`rounded-xl border p-4 space-y-3 transition-colors ${
                !isAssigned
                  ? 'bg-slate-950/60 border-slate-800/70 opacity-55'
                  : done
                    ? 'bg-emerald-950/35 border-emerald-400/60'
                    : 'bg-slate-950 border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs font-bold inline-flex items-center gap-1.5 ${
                    isAssigned ? 'text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  <Cpu className="w-4 h-4" aria-hidden="true" />
                  {t.core}
                </span>
                {!isAssigned ? (
                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                    IDLE
                  </span>
                ) : done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                ) : (
                  <span className="font-mono text-[11px] text-cyan-300 font-bold">
                    {progress}%
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-white">
                {isAssigned ? t.name : 'No App Assigned'}
              </p>

              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    !isAssigned
                      ? 'bg-slate-800'
                      : done
                        ? 'bg-emerald-400'
                        : 'bg-cyan-400'
                  }`}
                  animate={{ width: isAssigned ? `${progress}%` : '0%' }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Necessary Execution Speed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Single-Core CPU (Runs {appCount} {appCount === 1 ? 'App' : 'Apps'} One-by-One)
            </span>
            <span className="font-mono text-amber-300">
              {sequentialTaskDone} / {appCount} · {appCount}.0s total
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-3">
            {[0, 1, 2, 3].map((i) => {
              const activeInPlan = i < appCount;
              const slice = 100 / appCount;
              const fill = !activeInPlan
                ? 0
                : progress >= (i + 1) * slice
                  ? 100
                  : progress > i * slice
                    ? ((progress - i * slice) / slice) * 100
                    : 0;
              return (
                <div key={i} className="bg-slate-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-white">
              4-Core Parallel OS ({appCount} {appCount === 1 ? 'Core' : 'Cores'} Working Together)
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {progress >= 100
                ? `${appCount} / ${appCount} · 1.0s total (${appCount}× Faster)`
                : `Executing ${appCount} in parallel`}
            </span>
          </div>
          <div className="h-3 bg-slate-900 rounded overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
