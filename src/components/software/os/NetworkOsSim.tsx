import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Server,
  Monitor,
  Printer,
  ShieldCheck,
  FileText,
  PowerOff,
  Power,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

interface NetStep {
  step: number;
  title: string;
  caption: string;
}

const LAB_STEPS: NetStep[] = [
  {
    step: 1,
    title: 'Connect 30 Lab PCs',
    caption: '1. All 30 computers in the college computer lab are connected to a network.',
  },
  {
    step: 2,
    title: 'Student Logins',
    caption: '2. Students log in using their individual usernames and passwords.',
  },
  {
    step: 3,
    title: 'Access Central Files',
    caption: '3. All 30 computers access study materials stored on a central file server.',
  },
  {
    step: 4,
    title: 'Shared Network Printer',
    caption: '4. Students can print assignments using one shared network printer.',
  },
  {
    step: 5,
    title: 'Print Assignment',
    caption: '5. Print Assignment: A student sends a print request to the one shared network printer.',
  },
  {
    step: 6,
    title: 'All 30 PCs Sharing',
    caption: '6. Final Scene: All 30 computers share files from the server and use the same printer.',
  },
];

const LAB_PCS = Array.from({ length: 30 }, (_, i) => i + 1);

export function NetworkOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0); // 0..5
  const [isPlaying, setIsPlaying] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);
  const [printingPc, setPrintingPc] = useState<number>(12);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!isPlaying || !serverOnline) return;
    if (stepIdx >= LAB_STEPS.length - 1) {
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
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, serverOnline, notified, onSimulationComplete]);

  const current = LAB_STEPS[stepIdx];
  const s = current.step;

  const handlePrintAssignment = (pcNum?: number) => {
    soundFx.playClick();
    setServerOnline(true);
    setPrintingPc(pcNum ?? Math.floor(Math.random() * 30) + 1);
    setStepIdx(4);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            06 · COLLEGE COMPUTER LAB (30 COMPUTERS)
          </span>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            {serverOnline
              ? current.caption
              : 'Central Server Offline — student logins, shared study materials, and network printer stopped!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePrintAssignment()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print Assignment</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setServerOnline((online) => !online);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap border ${
              serverOnline
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-400'
                : 'bg-rose-950/60 border-rose-500 text-rose-200'
            }`}
          >
            {serverOnline ? (
              <PowerOff className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            ) : (
              <Power className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            )}
            <span>{serverOnline ? 'Test Server Failure' : 'Restart Server'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (stepIdx >= LAB_STEPS.length - 1) {
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
                : stepIdx >= LAB_STEPS.length - 1
                  ? 'Play Again'
                  : 'Play'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setServerOnline(true);
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
              setServerOnline(true);
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

      {/* College Lab Layout: 30 Connected Computers -> Central File & Auth Server -> 1 Shared Printer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 30 College Lab Computers */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">
              30 College Lab Computers (Click any PC to Print)
            </span>
            <span className="font-mono text-[10px] text-cyan-300">
              {!serverOnline
                ? 'SERVER UNREACHABLE'
                : s >= 3
                  ? 'READING STUDY MATERIALS'
                  : s === 2
                    ? 'STUDENTS LOGGED IN'
                    : 'LAN CONNECTED'}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {LAB_PCS.map((pc) => {
              const isPrinterSender = serverOnline && s >= 5 && pc === printingPc;
              const loggedIn = serverOnline && s >= 2;
              return (
                <button
                  key={pc}
                  type="button"
                  onClick={() => handlePrintAssignment(pc)}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    !serverOnline
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : isPrinterSender
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                        : loggedIn
                          ? 'bg-cyan-950/35 border-cyan-500/40 text-cyan-100 hover:border-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Monitor className="w-4 h-4 mx-auto mb-0.5" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-bold block">
                    PC-{pc < 10 ? `0${pc}` : pc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Central File & Auth Server */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <motion.div
            animate={
              prefersReducedMotion || !serverOnline
                ? undefined
                : { scale: [1, 1.03, 1] }
            }
            transition={{ repeat: Infinity, duration: 1.6 }}
            className={`p-5 rounded-2xl border text-center space-y-3 h-full flex flex-col justify-center ${
              serverOnline
                ? 'bg-gradient-to-b from-[#0b1530] to-slate-950 border-cyan-400/60 shadow-lg shadow-cyan-500/15'
                : 'bg-rose-950/40 border-rose-500'
            }`}
          >
            <Server
              className={`w-10 h-10 mx-auto ${serverOnline ? 'text-cyan-300' : 'text-rose-400'}`}
              aria-hidden="true"
            />
            <div>
              <span className="font-mono text-[11px] text-cyan-400 block">
                CENTRAL FILE SERVER
              </span>
              <p className="font-display text-sm font-bold text-white mt-0.5">
                {serverOnline ? 'Lab Auth & Study Materials' : 'SERVER DOWN'}
              </p>
            </div>

            <div
              className={`p-2.5 rounded-lg text-[11px] font-mono space-y-1 ${
                !serverOnline
                  ? 'bg-rose-900/50 text-rose-200'
                  : 'bg-slate-900/90 text-emerald-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {!serverOnline
                    ? 'Logins Offline'
                    : s >= 2
                      ? '30 Student Logins Verified'
                      : 'Network Ready'}
                </span>
              </div>
              {serverOnline && s >= 3 && (
                <div className="flex items-center justify-center gap-1 text-amber-300">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Study_Notes.pdf Shared</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: 1 Shared Network Printer */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <div
            className={`p-5 rounded-2xl border h-full flex flex-col justify-center space-y-3 transition-colors ${
              !serverOnline
                ? 'bg-rose-950/30 border-rose-500/40'
                : s >= 5
                  ? 'bg-emerald-950/35 border-emerald-400/60'
                  : s >= 4
                    ? 'bg-cyan-950/35 border-cyan-400/50'
                    : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Printer
              className={`w-9 h-9 mx-auto ${
                !serverOnline
                  ? 'text-rose-400'
                  : s >= 5
                    ? 'text-emerald-300'
                    : 'text-amber-400'
              }`}
              aria-hidden="true"
            />
            <div className="text-center">
              <span className="font-mono text-[11px] text-amber-300 block">
                1 SHARED PRINTER
              </span>
              <p className="font-display text-sm font-bold text-white mt-0.5">
                College Lab Printer
              </p>
            </div>
            <p className="text-xs text-center text-slate-300 leading-relaxed">
              {!serverOnline
                ? 'Unavailable while central server is down.'
                : s === 5
                  ? `Printing Assignment from PC-${printingPc < 10 ? `0${printingPc}` : printingPc}...`
                  : s === 6
                    ? 'Serving print requests for all 30 lab computers!'
                    : s === 4
                      ? 'Shared printer ready for all 30 PCs.'
                      : 'Connected via Central Server.'}
            </p>
          </div>
        </div>
      </div>

      {/* 6-Step Interactive Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {LAB_STEPS.map((item, idx) => {
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
