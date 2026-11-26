import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Car,
  AlertOctagon,
  Radar,
  ShieldCheck,
  Tv,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Wifi,
  Clock,
  Cpu,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

interface RtosStep {
  step: number;
  title: string;
  description: string;
}

const HARD_STEPS: RtosStep[] = [
  { step: 1, title: 'Show the Car', description: 'A car is travelling on a busy highway.' },
  { step: 2, title: 'Detect Danger', description: 'A sensor detects a sudden collision.' },
  {
    step: 3,
    title: 'Send Signal',
    description: 'The sensor immediately sends a signal to the computer.',
  },
  {
    step: 4,
    title: 'Process Information',
    description: 'The RTOS processes the sensor information within a very short, fixed time limit.',
  },
  {
    step: 5,
    title: 'Activate Airbag',
    description: 'The system immediately activates the airbag.',
  },
  {
    step: 6,
    title: 'Protect Driver',
    description: 'The airbag inflates and protects the driver.',
  },
  {
    step: 7,
    title: 'Final Scene',
    description: 'The system responds within the required time to prevent serious injury.',
  },
];

const SOFT_STEPS: RtosStep[] = [
  { step: 1, title: 'Open YouTube', description: 'Student starts watching an online lecture.' },
  { step: 2, title: 'Video Loading', description: 'YouTube begins loading video data.' },
  { step: 3, title: 'Play Video', description: 'The video starts playing.' },
  {
    step: 4,
    title: 'Delay Occurs',
    description: 'Internet connection becomes slow, and a video frame arrives late.',
  },
  {
    step: 5,
    title: 'Small Interruption',
    description: 'The video briefly freezes or skips a frame.',
  },
  { step: 6, title: 'Resume Playback', description: 'The video continues playing normally.' },
  {
    step: 7,
    title: 'Final Scene',
    description:
      'Student can still watch the lecture, although the delay has reduced the viewing experience.',
  },
];

export function RealTimeOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'hard' | 'soft'>('hard');
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepIdx, setStepIdx] = useState(0); // 0..6
  const [notified, setNotified] = useState(false);

  const steps = mode === 'hard' ? HARD_STEPS : SOFT_STEPS;
  const current = steps[stepIdx];
  const s = current.step;

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
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
  }, [isPlaying, stepIdx, steps.length, notified, onSimulationComplete]);

  const switchMode = (nextMode: 'hard' | 'soft') => {
    soundFx.playClick();
    setMode(nextMode);
    setStepIdx(0);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            07 · HARD vs SOFT REAL-TIME OPERATING SYSTEM
          </span>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            Step {current.step}/7 · {current.title}: {current.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => switchMode('hard')}
              className={`px-3 py-1.5 rounded font-bold cursor-pointer whitespace-nowrap ${
                mode === 'hard' ? 'bg-rose-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hard Real-Time (Car Airbag)
            </button>
            <button
              type="button"
              onClick={() => switchMode('soft')}
              className={`px-3 py-1.5 rounded font-bold cursor-pointer whitespace-nowrap ${
                mode === 'soft' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Soft Real-Time (YouTube Lecture)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (stepIdx >= steps.length - 1) {
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
                : stepIdx >= steps.length - 1
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

      {mode === 'hard' ? (
        <div className="space-y-5">
          {/* Hard Real-Time Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border transition-colors ${
                s >= 2 ? 'bg-amber-950/35 border-amber-400/60' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="font-mono text-[11px] text-slate-400 block">
                COLLISION SENSOR
              </span>
              <p className="text-sm font-bold text-amber-300 mt-1 inline-flex items-center gap-1.5">
                <Radar className="w-4 h-4" aria-hidden="true" />
                {s === 1
                  ? 'Highway Clear'
                  : s === 2
                    ? 'Sudden Collision Detected!'
                    : 'Signal Sent to Computer ✓'}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-colors ${
                s >= 4 ? 'bg-rose-950/35 border-rose-400' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="font-mono text-[11px] text-rose-300 block">
                RTOS FIXED TIME LIMIT
              </span>
              <p className="font-mono tabular-nums text-xl font-bold text-white mt-0.5 inline-flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                {s >= 4 ? '4 ms / 10 ms Limit (MET)' : 'Max Deadline: 10 ms'}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-colors ${
                s >= 5
                  ? 'bg-emerald-950/40 border-emerald-400'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="font-mono text-[11px] text-emerald-300 block">
                AIRBAG & DRIVER SAFETY
              </span>
              <p className="text-sm font-bold text-emerald-400 mt-1 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                {s >= 6
                  ? 'Airbag Inflated · Driver Protected!'
                  : s === 5
                    ? 'Activating Airbag Now!'
                    : 'Airbag Armed'}
              </p>
            </div>
          </div>

          {/* Highway & Airbag Animation Stage */}
          <div className="relative h-40 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-4 flex items-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-700" />

            {/* Moving Car on Highway */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 z-10"
              animate={{ left: s === 1 ? '18%' : '46%' }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45 }}
            >
              <div
                className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 ${
                  s >= 6
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : s >= 2
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                      : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                }`}
              >
                <Car className="w-7 h-7" aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold">
                  {s >= 6 ? 'AIRBAG INFLATED' : s === 5 ? 'AIRBAG TRIGGER' : 'HIGHWAY 80 km/h'}
                </span>
                {s >= 6 && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { scale: 0.3 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-white/90 border-2 border-emerald-400 flex items-center justify-center text-[9px] font-bold text-slate-950"
                    title="Inflated Airbag"
                  >
                    SAFE
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Sudden Collision Hazard */}
            {s >= 2 && (
              <motion.div
                initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-[14%] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 flex items-center gap-1.5 z-10"
              >
                <AlertOctagon className="w-5 h-5" aria-hidden="true" />
                <span className="font-mono text-xs font-bold">COLLISION HAZARD</span>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* Soft Real-Time: Student Watching YouTube Lecture */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-[11px] text-slate-400 block">INTERNET CONNECTION</span>
              <p
                className={`text-sm font-bold mt-1 inline-flex items-center gap-1.5 ${
                  s === 4 || s === 5 ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                <Wifi className="w-4 h-4" aria-hidden="true" />
                {s === 4 || s === 5 ? 'Slow Connection · Frame Late' : 'Stable Connection'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-[11px] text-slate-400 block">PLAYBACK STATUS</span>
              <p className="text-sm font-bold text-cyan-300 mt-1 inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {s === 1
                  ? 'Opening YouTube...'
                  : s === 2
                    ? 'Loading Video Data...'
                    : s === 5
                      ? 'Brief Freeze / Skipped Frame'
                      : 'Lecture Playing'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
              <span className="font-mono text-[11px] text-emerald-300 block">DEADLINE IMPACT</span>
              <p className="text-sm font-bold text-white mt-1">
                {s === 7
                  ? 'Lecture continues (minor quality dip)'
                  : 'Delay is tolerable (not life-critical)'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 font-bold text-white">
                <Tv className="w-4 h-4 text-rose-400" aria-hidden="true" />
                YouTube Lecture · BBA Operating Systems
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  s === 4 || s === 5 ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                {s === 5 ? 'BUFFERING / FRAME SKIP' : s === 4 ? 'FRAME ARRIVING LATE' : 'PLAYING'}
              </span>
            </div>

            <div className="h-32 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : s === 5
                      ? { opacity: [0.3, 0.7, 0.3] }
                      : s >= 3
                        ? { x: [-35, 35, -35] }
                        : undefined
                }
                transition={{ repeat: Infinity, duration: s === 5 ? 0.45 : 2.2 }}
                className={`px-5 py-3 rounded-lg font-mono text-xs font-bold border ${
                  s === 4 || s === 5
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                }`}
              >
                {s === 1 && 'Opening YouTube Lecture...'}
                {s === 2 && 'Loading Initial Video Chunks...'}
                {s === 3 && 'Playing Lecture Smoothly'}
                {s === 4 && 'Slow Internet — Video Frame Delayed'}
                {s === 5 && 'Brief Freeze · Skipping Late Frame...'}
                {s === 6 && 'Resumed! Video Playing Normally'}
                {s === 7 && 'Student Completes Lecture (Minor Delay Tolerated)'}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Step Interactive Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((item, idx) => {
          const active = idx === stepIdx;
          const done = idx < stepIdx;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsPlaying(false);
                setStepIdx(idx);
              }}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                active
                  ? 'bg-cyan-950/60 border-cyan-400 text-white'
                  : done
                    ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-cyan-300 block">
                STEP {item.step}
              </span>
              <span className="text-[11px] font-semibold leading-tight block truncate">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
