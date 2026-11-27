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
  ArrowRight,
  CheckCircle2,
  X,
  ListOrdered,
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
    title: 'Print Queue (1 by 1)',
    caption:
      '5. Print Queue: Selected computers send documents to the Central Server, which prints them one by one on the Shared Printer.',
  },
  {
    step: 6,
    title: 'All 30 PCs Sharing',
    caption: '6. Final Scene: All 30 computers share files from the server and use the same printer.',
  },
];

const LAB_PCS = Array.from({ length: 30 }, (_, i) => i + 1);

type PrintHop = 'idle' | 'pc-to-server' | 'server-to-printer' | 'printing';

interface QueuedPrintJob {
  id: number;
  pcNum: number;
  docName: string;
  status: 'queued' | 'active' | 'done';
}

function formatPc(pcNum: number): string {
  return `PC-${pcNum < 10 ? `0${pcNum}` : pcNum}`;
}

export function NetworkOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0); // 0..5
  const [isPlaying, setIsPlaying] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);

  // Multi-PC selection state
  const [selectedPcs, setSelectedPcs] = useState<number[]>([5, 12]);
  const [printQueue, setPrintQueue] = useState<QueuedPrintJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [printHop, setPrintHop] = useState<PrintHop>('idle');
  const [notified, setNotified] = useState(false);

  const current = LAB_STEPS[stepIdx];
  const s = current.step;

  const activeJob = printQueue.find((j) => j.id === activeJobId) ?? null;
  const hasPendingOrActive = printQueue.some((j) => j.status === 'queued' || j.status === 'active');

  // Helper to build a fresh print queue from the selected computers
  const startQueueForPcs = (pcsToQueue: number[]) => {
    const validPcs = pcsToQueue.length > 0 ? pcsToQueue : [12];
    if (pcsToQueue.length === 0) {
      setSelectedPcs([12]);
    }
    const baseId = Date.now();
    const jobs: QueuedPrintJob[] = validPcs.map((pcNum, idx) => ({
      id: baseId + idx,
      pcNum,
      docName: `${formatPc(pcNum)}_Assignment.pdf`,
      status: idx === 0 ? 'active' : 'queued',
    }));
    setPrintQueue(jobs);
    setActiveJobId(jobs[0].id);
    setPrintHop('pc-to-server');
  };

  // Timeline auto-advance (waits on Step 5 until all queued jobs print one by one)
  useEffect(() => {
    if (!isPlaying || !serverOnline) return;
    if (stepIdx === 4 && hasPendingOrActive) return;

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
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next === 4) {
        startQueueForPcs(selectedPcs);
      }
    }, 1450);

    return () => clearTimeout(timer);
  }, [
    isPlaying,
    stepIdx,
    serverOnline,
    hasPendingOrActive,
    notified,
    onSimulationComplete,
    selectedPcs,
  ]);

  // Process the active print job through 3 hops, then advance to the next queued job one-by-one
  useEffect(() => {
    if (!serverOnline || activeJobId === null) {
      if (!serverOnline) setPrintHop('idle');
      return;
    }

    setPrintHop('pc-to-server');

    const t1 = setTimeout(() => {
      setPrintHop('server-to-printer');
    }, 750);

    const t2 = setTimeout(() => {
      setPrintHop('printing');
    }, 1500);

    const t3 = setTimeout(() => {
      setPrintQueue((prev) => {
        const updated = prev.map((job) =>
          job.id === activeJobId ? { ...job, status: 'done' as const } : job
        );
        const nextQueued = updated.find((job) => job.status === 'queued');
        if (nextQueued) {
          setActiveJobId(nextQueued.id);
          return updated.map((job) =>
            job.id === nextQueued.id ? { ...job, status: 'active' as const } : job
          );
        } else {
          setActiveJobId(null);
          setPrintHop('idle');
          return updated;
        }
      });
    }, 2350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeJobId, serverOnline]);

  // Toggle PC in Selected Computers box (supports selecting multiple computers)
  const handleTogglePc = (pcNum: number) => {
    soundFx.playClick();
    setSelectedPcs((prev) =>
      prev.includes(pcNum) ? prev.filter((p) => p !== pcNum) : [...prev, pcNum]
    );
  };

  // Start printing all selected PCs one by one in the queue
  const handlePrintSelectedQueue = () => {
    soundFx.playClick();
    setServerOnline(true);
    setStepIdx(4);
    setIsPlaying(true);
    startQueueForPcs(selectedPcs);
  };

  const activePcLabel = activeJob ? formatPc(activeJob.pcNum) : null;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            06 · COLLEGE COMPUTER LAB (30 COMPUTERS)
          </span>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            {serverOnline
              ? current.caption
              : 'Central Server Offline — student logins, shared study materials, and print queue paused!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintSelectedQueue}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              Print Selected ({selectedPcs.length > 0 ? selectedPcs.length : 1})
            </span>
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
                setPrintQueue([]);
                setActiveJobId(null);
                setPrintHop('idle');
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
              setPrintQueue([]);
              setActiveJobId(null);
              setPrintHop('idle');
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
              setPrintQueue([]);
              setActiveJobId(null);
              setPrintHop('idle');
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Selected Computers Box + Print Queue Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Selected Computers Box */}
        <div className="lg:col-span-5 rounded-xl bg-slate-950 border border-amber-500/35 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-amber-300">
              SELECTED COMPUTERS BOX ({selectedPcs.length})
            </span>
            <div className="flex items-center gap-2">
              {selectedPcs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPcs([]);
                  }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handlePrintSelectedQueue}
                disabled={selectedPcs.length === 0}
                className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 text-[11px] font-bold cursor-pointer"
              >
                Send to Print Queue
              </button>
            </div>
          </div>

          {selectedPcs.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              Click multiple computers below (e.g., PC-03, PC-08, PC-15) to add them here for printing.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedPcs.map((pcNum, idx) => {
                const isActivePrinting = activeJob?.pcNum === pcNum;
                return (
                  <span
                    key={pcNum}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                      isActivePrinting
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-amber-500/15 border-amber-400/50 text-amber-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      #{idx + 1} {formatPc(pcNum)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTogglePc(pcNum)}
                      aria-label={`Remove ${formatPc(pcNum)}`}
                      className="ml-0.5 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Print Queue (Documents Printed One by One) */}
        <div className="lg:col-span-7 rounded-xl bg-slate-950 border border-cyan-500/35 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
              <ListOrdered className="w-4 h-4" aria-hidden="true" />
              SERVER PRINT QUEUE (ONE BY ONE)
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              {printQueue.length === 0
                ? 'Queue empty · Select PCs & click Send to Print Queue'
                : activeJob
                  ? `Now Printing: ${activeJob.docName}`
                  : 'All queued documents printed ✓'}
            </span>
          </div>

          {printQueue.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedPcs.map((pcNum, idx) => (
                <div
                  key={pcNum}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>
                    {idx + 1}. {formatPc(pcNum)}_Assignment.pdf (Ready)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {printQueue.map((job, idx) => (
                <div
                  key={job.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-colors ${
                    job.status === 'active'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : job.status === 'done'
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {idx + 1}. {job.docName}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      job.status === 'active'
                        ? 'bg-cyan-400 text-slate-950'
                        : job.status === 'done'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {job.status === 'active'
                      ? printHop === 'printing'
                        ? 'Printing'
                        : 'Sending'
                      : job.status === 'done'
                        ? 'Printed ✓'
                        : 'Queued'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Document Flow Pipeline: Active Selected PC -> Central Server -> Shared Printer */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-mono font-bold text-cyan-400">
            LIVE DOCUMENT ROUTE · SELECTED PC → CENTRAL SERVER → SHARED PRINTER
          </span>
          <span className="font-mono text-[11px] font-semibold text-emerald-300">
            {!serverOnline
              ? 'Route blocked (Server Offline)'
              : activeJob && printHop === 'pc-to-server'
                ? `1/3 · ${activePcLabel} sending ${activeJob.docName} → Central Server`
                : activeJob && printHop === 'server-to-printer'
                  ? `2/3 · Central Server forwarding ${activeJob.docName} → Shared Printer`
                  : activeJob && printHop === 'printing'
                    ? `3/3 · Shared Printer printing ${activeJob.docName} ✓`
                    : printQueue.length > 0 && !activeJob
                      ? `Completed all ${printQueue.length} queued documents!`
                      : 'Click PCs below and press Print Selected to watch queue flow'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
          {/* Node 1: Current Selected PC */}
          <div
            className={`md:col-span-3 p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
              serverOnline && activeJob && printHop === 'pc-to-server'
                ? 'bg-amber-950/45 border-amber-400 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <Monitor className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="font-mono text-[10px] text-amber-300">SENDING COMPUTER</div>
              <div className="text-xs font-bold truncate">
                {activeJob
                  ? activeJob.docName
                  : selectedPcs.length > 0
                    ? `${selectedPcs.map(formatPc).join(', ')}`
                    : 'No PC selected'}
              </div>
            </div>
          </div>

          {/* Animated Track 1: Selected PC -> Central Server */}
          <div className="md:col-span-1 relative h-9 flex items-center justify-center">
            <div className="w-full h-0.5 bg-slate-700 hidden md:block" />
            <ArrowRight className="w-4 h-4 text-slate-500 md:hidden" aria-hidden="true" />
            {serverOnline && activeJob && printHop === 'pc-to-server' && (
              <motion.div
                key={`hop1-${activeJob.id}`}
                initial={prefersReducedMotion ? false : { left: '0%', opacity: 0.4 }}
                animate={{ left: '70%', opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: 'easeInOut' }}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-bold shadow"
              >
                <FileText className="w-3 h-3" aria-hidden="true" />
                <span>{activePcLabel}</span>
              </motion.div>
            )}
          </div>

          {/* Node 2: Central File Server */}
          <div
            className={`md:col-span-3 p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
              !serverOnline
                ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                : activeJob && printHop === 'server-to-printer'
                  ? 'bg-cyan-950/60 border-cyan-400 text-white'
                  : activeJob && printHop === 'pc-to-server'
                    ? 'bg-cyan-950/35 border-cyan-500/60 text-cyan-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <Server
              className={`w-5 h-5 shrink-0 ${serverOnline ? 'text-cyan-400' : 'text-rose-400'}`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="font-mono text-[10px] text-cyan-300">CENTRAL SERVER SPOOLER</div>
              <div className="text-xs font-bold truncate">
                {!serverOnline
                  ? 'Offline'
                  : activeJob && printHop === 'server-to-printer'
                    ? `Spooling ${activePcLabel} → Printer`
                    : activeJob && printHop === 'pc-to-server'
                      ? `Queued from ${activePcLabel}`
                      : 'Print Queue Ready'}
              </div>
            </div>
          </div>

          {/* Animated Track 2: Central Server -> Shared Printer */}
          <div className="md:col-span-1 relative h-9 flex items-center justify-center">
            <div className="w-full h-0.5 bg-slate-700 hidden md:block" />
            <ArrowRight className="w-4 h-4 text-slate-500 md:hidden" aria-hidden="true" />
            {serverOnline && activeJob && printHop === 'server-to-printer' && (
              <motion.div
                key={`hop2-${activeJob.id}`}
                initial={prefersReducedMotion ? false : { left: '0%', opacity: 0.4 }}
                animate={{ left: '70%', opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: 'easeInOut' }}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono text-[9px] font-bold shadow"
              >
                <FileText className="w-3 h-3" aria-hidden="true" />
                <span>JOB</span>
              </motion.div>
            )}
          </div>

          {/* Node 3: Shared Printer */}
          <div
            className={`md:col-span-3 p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
              !serverOnline
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : activeJob && printHop === 'printing'
                  ? 'bg-emerald-950/55 border-emerald-400 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <Printer
              className={`w-5 h-5 shrink-0 ${
                activeJob && printHop === 'printing' ? 'text-emerald-400' : 'text-amber-400'
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] text-emerald-300">SHARED PRINTER</div>
              <div className="text-xs font-bold truncate">
                {!serverOnline
                  ? 'Unavailable'
                  : activeJob && printHop === 'printing'
                    ? `Printing ${activeJob.docName}`
                    : printQueue.some((j) => j.status === 'done') && !activeJob
                      ? 'All Docs Printed ✓'
                      : 'Waiting for Server'}
              </div>
            </div>
            {serverOnline && activeJob && printHop === 'printing' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* College Lab Layout: 30 Connected Computers -> Central File & Auth Server -> 1 Shared Printer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 30 College Lab Computers */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-white">
              30 College Lab Computers (Click to Select Multiple PCs)
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
              const isSelected = selectedPcs.includes(pc);
              const isCurrentlyPrinting = serverOnline && activeJob?.pcNum === pc;
              const loggedIn = serverOnline && s >= 2;
              return (
                <button
                  key={pc}
                  type="button"
                  onClick={() => handleTogglePc(pc)}
                  aria-pressed={isSelected}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    !serverOnline
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : isCurrentlyPrinting
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400/60'
                        : isSelected
                          ? 'bg-amber-500/25 border-amber-400 text-amber-100 ring-1 ring-amber-400/50'
                          : loggedIn
                            ? 'bg-cyan-950/35 border-cyan-500/40 text-cyan-100 hover:border-cyan-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400'
                  }`}
                >
                  <Monitor className="w-4 h-4 mx-auto mb-0.5" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-bold block">
                    {formatPc(pc)}
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
              prefersReducedMotion || !serverOnline || printHop !== 'server-to-printer'
                ? undefined
                : { scale: [1, 1.03, 1] }
            }
            transition={{ repeat: Infinity, duration: 0.9 }}
            className={`p-5 rounded-2xl border text-center space-y-3 h-full flex flex-col justify-center ${
              !serverOnline
                ? 'bg-rose-950/40 border-rose-500'
                : activeJob && (printHop === 'pc-to-server' || printHop === 'server-to-printer')
                  ? 'bg-gradient-to-b from-cyan-950/70 to-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-gradient-to-b from-[#0b1530] to-slate-950 border-cyan-400/60 shadow-lg shadow-cyan-500/15'
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
                {serverOnline ? 'Lab Auth & Print Spooler' : 'SERVER DOWN'}
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
                    : activeJob && printHop === 'pc-to-server'
                      ? `Doc received from ${activePcLabel}`
                      : activeJob && printHop === 'server-to-printer'
                        ? `Sending ${activePcLabel} to Printer`
                        : s >= 2
                          ? '30 Student Logins Verified'
                          : 'Network Ready'}
                </span>
              </div>
              {serverOnline && s >= 3 && (
                <div className="flex items-center justify-center gap-1 text-amber-300">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {activeJob
                      ? activeJob.docName
                      : printQueue.length > 0
                        ? `${printQueue.length} Docs Processed`
                        : 'Study_Notes.pdf Shared'}
                  </span>
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
                : activeJob && printHop === 'printing'
                  ? 'bg-emerald-950/45 border-emerald-400 shadow-lg shadow-emerald-500/15'
                  : s >= 4
                    ? 'bg-cyan-950/35 border-cyan-400/50'
                    : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Printer
              className={`w-9 h-9 mx-auto ${
                !serverOnline
                  ? 'text-rose-400'
                  : activeJob && printHop === 'printing'
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

            {serverOnline && activeJob && printHop === 'printing' && (
              <motion.div
                key={`printed-${activeJob.id}`}
                initial={prefersReducedMotion ? false : { y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-auto px-3 py-1.5 rounded bg-white text-slate-950 font-mono text-[10px] font-bold shadow border border-emerald-400"
              >
                {activeJob.docName} ✓
              </motion.div>
            )}

            <p className="text-xs text-center text-slate-300 leading-relaxed">
              {!serverOnline
                ? 'Unavailable while central server is down.'
                : activeJob && printHop === 'pc-to-server'
                  ? `${activePcLabel} is sending document to Central Server...`
                  : activeJob && printHop === 'server-to-printer'
                    ? `Receiving ${activePcLabel}'s document from Server...`
                    : activeJob && printHop === 'printing'
                      ? `Printing Assignment from ${activePcLabel}...`
                      : printQueue.some((j) => j.status === 'done')
                        ? `Finished printing ${printQueue.filter((j) => j.status === 'done').length} document(s) in order!`
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
                if (idx === 4) {
                  startQueueForPcs(selectedPcs);
                }
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
