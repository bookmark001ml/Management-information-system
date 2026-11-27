import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Car,
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
                  ? 'Cruising · Radar Scanning'
                  : s === 2
                    ? 'Sudden Impact / Hazard!'
                    : 'Signal Sent to RTOS ECU ✓'}
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
                    ? 'Firing Airbag Inflator!'
                    : 'Airbag Armed'}
              </p>
            </div>
          </div>

          {/* Proper SVG Car & Airbag Highway Simulation Stage */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden p-3 sm:p-4 space-y-3">
            {/* Live HUD Bar inside Simulation */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span className="text-slate-200 font-bold">
                  {s === 1
                    ? 'SPEED: 80 km/h · NORMAL HIGHWAY CRUISE'
                    : s === 2
                      ? 'ALERT: OBSTACLE DETECTED AHEAD!'
                      : s === 3
                        ? 'SENSOR → RTOS ECU (0.8 ms)'
                        : s === 4
                          ? 'RTOS EVALUATING IMPACT (4 ms / 10 ms)'
                          : s === 5
                            ? 'RTOS TRIGGER → FIRING AIRBAG!'
                            : 'IMPACT ABSORBED · DRIVER SAFE'}
                </span>
              </div>

              {/* Deterministic Deadline Bar */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">DEADLINE:</span>
                <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      s >= 5 ? 'bg-emerald-400' : s >= 3 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    animate={{
                      width:
                        s <= 1 ? '0%' : s === 2 ? '12%' : s === 3 ? '24%' : '40%',
                    }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35 }}
                  />
                </div>
                <span className="text-emerald-300 font-bold tabular-nums">
                  {s >= 4 ? '4ms/10ms' : s === 3 ? '2ms/10ms' : '0ms/10ms'}
                </span>
              </div>
            </div>

            {/* Highway & Cutaway Car SVG Scene */}
            <div className="relative w-full h-56 sm:h-64 rounded-xl bg-gradient-to-b from-[#060d20] via-[#0a1530] to-[#0f172a] border border-slate-800/80 overflow-hidden">
              <svg
                viewBox="0 0 800 260"
                className="w-full h-full"
                role="img"
                aria-label="Car collision sensor, RTOS ECU, and airbag inflation simulation"
              >
                <defs>
                  <linearGradient id="headlightGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fde047" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>

                {/* Distant city/mountain skyline */}
                <path
                  d="M0 155 L60 120 L130 148 L210 108 L295 145 L380 118 L460 150 L560 112 L645 142 L730 115 L800 148 L800 175 L0 175 Z"
                  fill="#0f1e3a"
                  opacity="0.7"
                />

                {/* Highway guardrail */}
                <rect x="0" y="168" width="800" height="6" fill="#334155" />
                {[60, 180, 300, 420, 540, 660, 760].map((px) => (
                  <rect key={px} x={px} y="168" width="6" height="16" fill="#475569" />
                ))}

                {/* Asphalt highway road */}
                <rect x="0" y="180" width="800" height="80" fill="#111827" />
                <line x1="0" y1="182" x2="800" y2="182" stroke="#475569" strokeWidth="2" />

                {/* Scrolling dashed road lines (active during Step 1 cruise) */}
                <motion.g
                  animate={
                    prefersReducedMotion || s > 2
                      ? { x: 0 }
                      : { x: [0, -80] }
                  }
                  transition={
                    s > 2
                      ? { duration: 0.2 }
                      : { repeat: Infinity, duration: 0.45, ease: 'linear' }
                  }
                >
                  {[-40, 40, 120, 200, 280, 360, 440, 520, 600, 680, 760, 840].map((dx) => (
                    <rect
                      key={dx}
                      x={dx}
                      y="218"
                      width="44"
                      height="6"
                      rx="3"
                      fill="#f59e0b"
                      opacity="0.7"
                    />
                  ))}
                </motion.g>

                {/* Sudden Road Hazard / Barrier Block (Steps 2..7) */}
                {s >= 2 && (
                  <motion.g
                    initial={prefersReducedMotion ? false : { x: 140, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35 }}
                  >
                    {/* Concrete & striped safety barrier */}
                    <rect
                      x="585"
                      y="138"
                      width="72"
                      height="70"
                      rx="8"
                      fill="#1e293b"
                      stroke="#ef4444"
                      strokeWidth="3"
                    />
                    <path d="M593 148 L649 148 L639 162 L593 162 Z" fill="#ef4444" />
                    <path d="M593 172 L649 172 L639 186 L593 186 Z" fill="#f59e0b" />
                    <text
                      x="621"
                      y="128"
                      textAnchor="middle"
                      fill="#fca5a5"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      HAZARD
                    </text>
                  </motion.g>
                )}

                {/* Moving Cutaway Car Assembly */}
                <motion.g
                  animate={{
                    x: s === 1 ? 65 : s === 2 ? 215 : s === 3 ? 255 : 275,
                  }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 120, damping: 18 }
                  }
                >
                  {/* Headlight beam */}
                  <polygon points="300,158 435,132 435,196 300,174" fill="url(#headlightGrad)" />

                  {/* Car shadow on asphalt */}
                  <ellipse cx="165" cy="212" rx="142" ry="10" fill="#020617" opacity="0.75" />

                  {/* Lower Car Chassis Body */}
                  <path
                    d="M28 176 L34 146 Q42 134 65 132 L105 94 Q122 82 155 82 L218 82 Q242 84 260 116 L296 130 Q308 136 308 152 L306 178 Q305 186 294 186 L40 186 Q28 186 28 176 Z"
                    fill="url(#carPaint)"
                    stroke="#7dd3fc"
                    strokeWidth="2"
                  />

                  {/* Cutaway Interior Cabin Window */}
                  <path
                    d="M112 96 L154 90 L215 90 Q232 91 248 122 L100 122 Z"
                    fill="#0b132b"
                    stroke="#bae6fd"
                    strokeWidth="2"
                  />

                  {/* Seated Driver Silhouette inside Cutaway */}
                  <circle cx="152" cy="105" r="8" fill="#fde68a" />
                  <path
                    d="M144 114 Q152 112 162 122 L142 122 Z"
                    fill="#334155"
                  />

                  {/* Steering Wheel & Column */}
                  <line x1="210" y1="122" x2="196" y2="108" stroke="#94a3b8" strokeWidth="3.5" />
                  <line x1="192" y1="103" x2="200" y2="114" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />

                  {/* INFLATING AIRBAG (Steps 5, 6, 7) */}
                  {s >= 5 && (
                    <motion.g
                      initial={prefersReducedMotion ? false : { scale: 0.15, opacity: 0 }}
                      animate={{
                        scale: s >= 6 ? 1.05 : 0.72,
                        opacity: 1,
                      }}
                      style={{ transformOrigin: '192px 108px' }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 260, damping: 14 }
                      }
                    >
                      <ellipse
                        cx="179"
                        cy="106"
                        rx="19"
                        ry="15"
                        fill="#f8fafc"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                      <text
                        x="179"
                        y="109"
                        textAnchor="middle"
                        fill="#065f46"
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        AIRBAG
                      </text>
                    </motion.g>
                  )}

                  {/* RTOS ECU Computer Chip under Dashboard */}
                  <rect
                    x="222"
                    y="138"
                    width="34"
                    height="20"
                    rx="4"
                    fill={s >= 4 ? '#06b6d4' : '#0f172a'}
                    stroke={s >= 4 ? '#a5f3fc' : '#38bdf8'}
                    strokeWidth="2"
                  />
                  <text
                    x="239"
                    y="151"
                    textAnchor="middle"
                    fill={s >= 4 ? '#020617' : '#7dd3fc'}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    RTOS
                  </text>

                  {/* Wiring line from Front Bumper Sensor -> RTOS ECU -> Airbag */}
                  <path
                    d="M304 160 L256 148"
                    stroke={s >= 3 ? '#f59e0b' : '#475569'}
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  <path
                    d="M222 145 L196 112"
                    stroke={s >= 5 ? '#10b981' : '#475569'}
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />

                  {/* Animated Signal Pulse traveling Bumper Sensor -> RTOS ECU (Step 3) */}
                  {s === 3 && !prefersReducedMotion && (
                    <motion.circle
                      r="5"
                      fill="#fbbf24"
                      animate={{ cx: [304, 256], cy: [160, 148] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                  )}

                  {/* Animated Trigger Pulse traveling RTOS ECU -> Airbag (Step 5) */}
                  {s === 5 && !prefersReducedMotion && (
                    <motion.circle
                      r="5"
                      fill="#34d399"
                      animate={{ cx: [222, 196], cy: [145, 112] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                    />
                  )}

                  {/* Front Bumper Collision Sensor */}
                  <circle
                    cx="306"
                    cy="160"
                    r="6"
                    fill={s >= 2 ? '#ef4444' : '#22d3ee'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Radar Sensor Waves ahead of bumper */}
                  <path
                    d="M316 148 Q326 160 316 172"
                    fill="none"
                    stroke={s >= 2 ? '#ef4444' : '#34d399'}
                    strokeWidth="2.5"
                  />
                  <path
                    d="M324 142 Q338 160 324 178"
                    fill="none"
                    stroke={s >= 2 ? '#ef4444' : '#34d399'}
                    strokeWidth="2"
                    opacity="0.7"
                  />

                  {/* Rear Taillight (Bright Brake Red on Step 2+) */}
                  <rect
                    x="28"
                    y="148"
                    width="8"
                    height="14"
                    rx="2"
                    fill={s >= 2 ? '#ef4444' : '#991b1b'}
                  />

                  {/* Headlight */}
                  <rect x="298" y="144" width="9" height="10" rx="2" fill="#fef08a" />

                  {/* Front & Rear Alloy Wheels */}
                  {[82, 246].map((wx) => (
                    <g key={wx} transform={`translate(${wx}, 186)`}>
                      <circle r="22" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                      <motion.g
                        animate={
                          prefersReducedMotion || s > 1
                            ? { rotate: 0 }
                            : { rotate: [0, 360] }
                        }
                        transition={
                          s > 1
                            ? { duration: 0.2 }
                            : { repeat: Infinity, duration: 0.5, ease: 'linear' }
                        }
                      >
                        <circle r="12" fill="#94a3b8" />
                        <line x1="-11" y1="0" x2="11" y2="0" stroke="#1e293b" strokeWidth="3" />
                        <line x1="0" y1="-11" x2="0" y2="11" stroke="#1e293b" strokeWidth="3" />
                      </motion.g>
                    </g>
                  ))}

                  {/* Impact Flash on Step 5/6/7 */}
                  {s >= 5 && (
                    <polygon
                      points="304,155 318,142 314,158 326,164 312,170 316,184 303,172"
                      fill="#f59e0b"
                    />
                  )}
                </motion.g>

                {/* Final Scene Safety Banner (Steps 6 & 7) */}
                {s >= 6 && (
                  <g>
                    <rect
                      x="24"
                      y="20"
                      width="335"
                      height="34"
                      rx="8"
                      fill="#064e3b"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    <text
                      x="191"
                      y="41"
                      textAnchor="middle"
                      fill="#ecfdf5"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      DRIVER PROTECTED · 4 ms RTOS RESPONSE ✓
                    </text>
                  </g>
                )}
              </svg>
            </div>
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
                {s === 4
                  ? 'Slow Connection · Frame Late'
                  : s === 5
                    ? 'Packet Drop · Frame Skipped!'
                    : 'Stable Connection'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-[11px] text-slate-400 block">PLAYBACK STATUS</span>
              <p className="text-sm font-bold text-cyan-300 mt-1 inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {s === 1
                  ? 'Opening YouTube...'
                  : s === 2
                    ? 'Loading Video Chunks...'
                    : s === 4
                      ? 'Stuttering (Late Frame)'
                      : s === 5
                        ? 'Video Frozen · Buffering!'
                        : 'Lecture Playing Smoothly'}
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

          {/* Animated YouTube Lecture Video Player & Interruption Stage */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {/* Player Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-2 font-bold text-white">
                <Tv className="w-4 h-4 text-rose-400" aria-hidden="true" />
                YouTube Lecture · BBA Operating Systems
              </span>
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded ${
                  s === 5
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : s === 4
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {s === 1
                  ? 'INITIALIZING PLAYER'
                  : s === 2
                    ? 'BUFFERING CHUNKS'
                    : s === 4
                      ? 'DELAY: FRAME LATE'
                      : s === 5
                        ? 'INTERRUPTION · VIDEO FROZEN'
                        : 'PLAYING HD'}
              </span>
            </div>

            {/* Video Screen Canvas */}
            <div className="relative w-full h-60 sm:h-68 rounded-xl bg-[#070d1f] border border-slate-800 overflow-hidden">
              <svg
                viewBox="0 0 800 280"
                className="w-full h-full"
                role="img"
                aria-label="YouTube online lecture video player showing smooth animation and buffering interruption"
              >
                <defs>
                  <linearGradient id="lectureBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0b1530" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Lecture Video Background */}
                <rect x="0" y="0" width="800" height="236" fill="url(#lectureBg)" />

                {/* Step 1: Opening YouTube Skeleton */}
                {s === 1 ? (
                  <g>
                    <rect x="260" y="65" width="280" height="90" rx="14" fill="#1e293b" />
                    <polygon points="385,92 385,128 420,110" fill="#ef4444" />
                    <text
                      x="400"
                      y="182"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="14"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      OPENING YOUTUBE LECTURE...
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* Digital Whiteboard inside Lecture Video */}
                    <rect
                      x="250"
                      y="24"
                      width="490"
                      height="185"
                      rx="12"
                      fill="#061224"
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <text
                      x="275"
                      y="52"
                      fill="#38bdf8"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      LECTURE SLIDE: REAL-TIME SCHEDULING
                    </text>

                    {/* Animated Waveform / Bar Chart on Whiteboard (freezes on Step 5!) */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const baseH = 38 + ((i * 23) % 55);
                      return (
                        <motion.rect
                          key={i}
                          x={285 + i * 42}
                          width="26"
                          rx="4"
                          fill={i % 2 === 0 ? '#22d3ee' : '#34d399'}
                          animate={
                            prefersReducedMotion || s === 2 || s === 5
                              ? { y: 175 - baseH, height: baseH }
                              : {
                                  y: [175 - baseH, 175 - (baseH + 26), 175 - baseH],
                                  height: [baseH, baseH + 26, baseH],
                                }
                          }
                          transition={{
                            repeat: Infinity,
                            duration: s === 4 ? 1.8 : 0.9,
                            delay: i * 0.1,
                          }}
                        />
                      );
                    })}

                    {/* Animated Sine Wave on Whiteboard (freezes on Step 5!) */}
                    <motion.path
                      d="M555 125 Q585 75 615 125 T675 125 T725 125"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={
                        prefersReducedMotion || s === 2 || s === 5
                          ? { y: 0 }
                          : { y: [-6, 6, -6] }
                      }
                      transition={{ repeat: Infinity, duration: 1.1 }}
                    />

                    {/* Lecturer / Professor Character on Left of Video */}
                    <g transform="translate(85, 42)">
                      {/* Lectern / Desk */}
                      <rect x="20" y="128" width="108" height="44" rx="6" fill="#1e293b" stroke="#475569" />
                      {/* Professor Torso */}
                      <path
                        d="M36 128 Q42 82 74 82 Q106 82 112 128 Z"
                        fill="#0284c7"
                      />
                      {/* Head */}
                      <circle cx="74" cy="54" r="24" fill="#fde68a" />
                      {/* Glasses */}
                      <rect x="57" y="48" width="13" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="2" />
                      <rect x="78" y="48" width="13" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="2" />
                      <line x1="70" y1="52" x2="78" y2="52" stroke="#0f172a" strokeWidth="2" />

                      {/* Animated Speaking Mouth + Gesturing Arm with Pointer (freezes during interruption!) */}
                      <motion.ellipse
                        cx="74"
                        cy="66"
                        rx="5"
                        fill="#78350f"
                        animate={
                          prefersReducedMotion || s === 2 || s === 5
                            ? { ry: 2 }
                            : { ry: [2, 5, 2] }
                        }
                        transition={{ repeat: Infinity, duration: 0.45 }}
                      />

                      <motion.g
                        style={{ transformOrigin: '104px 96px' }}
                        animate={
                          prefersReducedMotion || s === 2 || s === 5
                            ? { rotate: 0 }
                            : { rotate: [-12, 10, -12] }
                        }
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      >
                        <line
                          x1="104"
                          y1="96"
                          x2="150"
                          y2="78"
                          stroke="#38bdf8"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <line
                          x1="146"
                          y1="79"
                          x2="188"
                          y2="62"
                          stroke="#fbbf24"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </motion.g>
                    </g>
                  </g>
                )}

                {/* STEP 4 OVERLAY: Late Frame / Jitter Tear Warning on Image */}
                {s === 4 && (
                  <g>
                    <motion.rect
                      x="0"
                      y="78"
                      width="800"
                      height="10"
                      fill="#f59e0b"
                      opacity="0.28"
                      animate={prefersReducedMotion ? undefined : { y: [50, 175, 95] }}
                      transition={{ repeat: Infinity, duration: 0.55 }}
                    />
                    <rect
                      x="18"
                      y="16"
                      width="268"
                      height="28"
                      rx="6"
                      fill="#451a03"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text
                      x="152"
                      y="34"
                      textAnchor="middle"
                      fill="#fde68a"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      SLOW INTERNET · FRAME DELAYED
                    </text>
                  </g>
                )}

                {/* STEP 5 OVERLAY: Visible Video Freeze / Glitch Interruption & Buffering Spinner */}
                {s === 5 && (
                  <g>
                    {/* Frozen dark scrim + pixelated glitch tear bands across image */}
                    <rect x="0" y="0" width="800" height="236" fill="#020617" opacity="0.62" />
                    <rect x="0" y="54" width="800" height="12" fill="#ef4444" opacity="0.35" />
                    <rect x="90" y="138" width="620" height="9" fill="#38bdf8" opacity="0.35" />
                    <rect x="40" y="182" width="520" height="8" fill="#f59e0b" opacity="0.3" />

                    {/* Spinning Circular YouTube Buffering Wheel in Center of Image */}
                    <g transform="translate(400, 102)">
                      <circle r="28" fill="#0f172a" opacity="0.88" stroke="#334155" strokeWidth="3" />
                      <motion.circle
                        r="21"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeDasharray="85 50"
                        animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
                      />
                    </g>

                    {/* Interruption Callout Banner on Video Image */}
                    <rect
                      x="220"
                      y="148"
                      width="360"
                      height="34"
                      rx="8"
                      fill="#450a0a"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <text
                      x="400"
                      y="169"
                      textAnchor="middle"
                      fill="#fecaca"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      INTERRUPTION: VIDEO FROZEN · FRAME SKIPPED
                    </text>
                  </g>
                )}

                {/* STEP 2 OVERLAY: Initial Buffering Spinner */}
                {s === 2 && (
                  <g>
                    <rect x="0" y="0" width="800" height="236" fill="#020617" opacity="0.45" />
                    <g transform="translate(400, 112)">
                      <motion.circle
                        r="22"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="80 55"
                        animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      />
                    </g>
                  </g>
                )}

                {/* STEP 6 & 7 OVERLAY: Resumed Badge */}
                {s >= 6 && (
                  <g>
                    <rect
                      x="18"
                      y="16"
                      width="315"
                      height="28"
                      rx="6"
                      fill="#064e3b"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    <text
                      x="175"
                      y="34"
                      textAnchor="middle"
                      fill="#ecfdf5"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {s === 6
                        ? 'PLAYBACK RESUMED SMOOTHLY ✓'
                        : 'LECTURE COMPLETED · DELAY TOLERATED ✓'}
                    </text>
                  </g>
                )}

                {/* Bottom YouTube Player Control Bar & Progress Scrubber */}
                <rect x="0" y="236" width="800" height="44" fill="#020617" />
                {/* Track */}
                <rect x="20" y="244" width="760" height="6" rx="3" fill="#334155" />
                {/* Buffered Gray Bar */}
                <motion.rect
                  x="20"
                  y="244"
                  height="6"
                  rx="3"
                  fill="#64748b"
                  animate={{
                    width:
                      s === 1
                        ? 40
                        : s === 2
                          ? 220
                          : s === 3
                            ? 440
                            : s === 4 || s === 5
                              ? 485
                              : 740,
                  }}
                  transition={{ duration: 0.45 }}
                />
                {/* Red YouTube Playhead Progress Bar */}
                <motion.rect
                  x="20"
                  y="244"
                  height="6"
                  rx="3"
                  fill={s === 5 ? '#f59e0b' : '#ef4444'}
                  animate={{
                    width:
                      s === 1
                        ? 15
                        : s === 2
                          ? 60
                          : s === 3
                            ? 280
                            : s === 4
                              ? 355
                              : s === 5
                                ? 355
                                : s === 6
                                  ? 540
                                  : 710,
                  }}
                  transition={{ duration: 0.45 }}
                />
                <text x="24" y="268" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {s === 5 ? '⏸ PAUSED (INTERRUPTION)' : s <= 2 ? '⏳ LOADING' : '▶ LIVE STREAM'}
                </text>
                <text x="776" y="268" textAnchor="end" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  {s === 1
                    ? '00:00 / 12:30'
                    : s === 2
                      ? '00:15 / 12:30'
                      : s === 3
                        ? '03:40 / 12:30'
                        : s === 4 || s === 5
                          ? '05:12 / 12:30 (FROZEN)'
                          : s === 6
                            ? '08:25 / 12:30'
                            : '12:30 / 12:30'}
                </text>
              </svg>
            </div>

            {/* Incoming Internet Frame Stream Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-300">
                INCOMING VIDEO FRAMES:
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((f) => {
                  const isLate = (s === 4 || s === 5) && f === 4;
                  const isActive = s >= 3 && !(s === 5 && f >= 4);
                  return (
                    <span
                      key={f}
                      className={`px-2 py-0.5 rounded font-bold border ${
                        isLate
                          ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                          : isActive
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {isLate ? 'F4 (LATE!)' : `F${f}`}
                    </span>
                  );
                })}
              </div>
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
