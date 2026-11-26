import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

interface TimelineStep {
  step: number;
  flow: string;
  status: 'Executing' | 'Waiting';
  description: string;
  activeCpu: 'A' | 'B' | 'C' | null;
  waitingIo: ('A' | 'B' | 'C')[];
  readyRam: ('A' | 'B' | 'C')[];
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 1,
    flow: 'CPU → Program A',
    status: 'Executing',
    description: 'Program A is processing data.',
    activeCpu: 'A',
    waitingIo: [],
    readyRam: ['B', 'C'],
  },
  {
    step: 2,
    flow: 'Program A → I/O request',
    status: 'Waiting',
    description: 'A needs data from the disk.',
    activeCpu: null,
    waitingIo: ['A'],
    readyRam: ['B', 'C'],
  },
  {
    step: 3,
    flow: 'CPU → Program B',
    status: 'Executing',
    description: 'B uses the CPU while A waits.',
    activeCpu: 'B',
    waitingIo: ['A'],
    readyRam: ['C'],
  },
  {
    step: 4,
    flow: 'Program B → I/O request',
    status: 'Waiting',
    description: 'B also waits for an operation.',
    activeCpu: null,
    waitingIo: ['A', 'B'],
    readyRam: ['C'],
  },
  {
    step: 5,
    flow: 'CPU → Program C',
    status: 'Executing',
    description: 'C gets its turn.',
    activeCpu: 'C',
    waitingIo: ['A', 'B'],
    readyRam: [],
  },
  {
    step: 6,
    flow: 'Program A → CPU',
    status: 'Executing',
    description: "A's I/O is complete, so it becomes ready to execute again.",
    activeCpu: 'A',
    waitingIo: ['B'],
    readyRam: ['C'],
  },
];

export function MultiprogrammingOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= TIMELINE_STEPS.length - 1) {
      setIsPlaying(false);
      if (!notified) {
        setNotified(true);
        soundFx.playVictory();
        onSimulationComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((i) => i + 1);
    }, 1450);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, notified, onSimulationComplete]);

  const current = TIMELINE_STEPS[stepIdx];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            02 · MULTIPROGRAMMING CPU EXECUTION TIMELINE
          </span>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            Step {current.step}: {current.flow} — {current.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (stepIdx >= TIMELINE_STEPS.length - 1) {
                setStepIdx(0);
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
            <span>
              {isPlaying
                ? 'Pause'
                : stepIdx >= TIMELINE_STEPS.length - 1
                  ? 'Play Again'
                  : 'Play'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setStepIdx(0);
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
              setStepIdx(0);
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Hardware Stage: RAM -> CPU -> Disk I/O */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Memory (RAM) */}
        <div className="lg:col-span-4 rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <MemoryStick className="w-4 h-4 text-purple-400" aria-hidden="true" />
              Main Memory (RAM)
            </span>
            <span className="font-mono text-[10px] text-slate-400">Programs A, B, C</span>
          </div>

          <div className="space-y-2.5">
            {(['A', 'B', 'C'] as const).map((prog) => {
              const isCpu = current.activeCpu === prog;
              const isIo = current.waitingIo.includes(prog);
              return (
                <div
                  key={prog}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                    isCpu
                      ? 'bg-emerald-950/50 border-emerald-400 text-white'
                      : isIo
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-display text-sm font-bold">Program {prog}</span>
                  <span className="font-mono text-[11px] font-bold">
                    {isCpu ? 'EXECUTING' : isIo ? 'WAITING (I/O)' : 'READY IN RAM'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single CPU */}
        <div className="lg:col-span-4 rounded-xl bg-gradient-to-b from-[#0b1530] to-slate-950 border border-cyan-500/50 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <motion.div
            key={current.step}
            initial={prefersReducedMotion ? false : { scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg ${
              current.activeCpu
                ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/20'
                : 'bg-amber-500/15 border-amber-400 shadow-amber-500/15'
            }`}
          >
            <Cpu
              className={`w-7 h-7 ${current.activeCpu ? 'text-emerald-300' : 'text-amber-300'}`}
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-bold text-white mt-0.5">
              {current.activeCpu ? `Prog ${current.activeCpu}` : 'Switching'}
            </span>
          </motion.div>

          <div className="space-y-1">
            <span
              className={`inline-block px-2.5 py-0.5 rounded font-mono text-[11px] font-bold ${
                current.status === 'Executing'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {current.status.toUpperCase()}
            </span>
            <p className="font-display text-sm font-bold text-white">{current.flow}</p>
            <p className="text-xs text-slate-300">{current.description}</p>
          </div>
        </div>

        {/* Disk / I/O Queue */}
        <div className="lg:col-span-4 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <HardDrive className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Disk / I/O Requests
            </span>
            <span className="font-mono text-[11px] text-amber-300">
              {current.waitingIo.length} waiting
            </span>
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            {current.waitingIo.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                No programs waiting for disk
              </div>
            ) : (
              current.waitingIo.map((p) => (
                <motion.div
                  key={p}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-amber-200">
                    Program {p} Disk Read
                  </span>
                  <span className="font-mono text-[11px] text-amber-300">WAITING</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Exact 6-Step CPU Execution Timeline */}
      <div className="space-y-2.5">
        <span className="font-mono text-[11px] font-semibold text-cyan-400 block">
          CPU EXECUTION TIMELINE (CLICK ANY STEP TO INSPECT)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TIMELINE_STEPS.map((item, idx) => {
            const isActive = idx === stepIdx;
            const isPast = idx < stepIdx;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsPlaying(false);
                  setStepIdx(idx);
                }}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer space-y-1.5 ${
                  isActive
                    ? 'bg-cyan-950/50 border-cyan-400 text-white'
                    : isPast
                      ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold inline-flex items-center gap-1 text-cyan-300">
                    <span>{item.step}.</span>
                    <span>{item.flow}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      item.status === 'Executing'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
                  <span>{item.description}</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
