import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  FileText,
  Cpu,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  UserX,
  Plus,
  Send,
  Layers,
  Clock,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';

export interface OsSimProps {
  onSimulationComplete: () => void;
}

type TaskCategory = 'payroll' | 'electricity' | 'banking';

interface BatchTask {
  id: number;
  category: TaskCategory;
  label: string;
  batchName: string;
}

const CATEGORY_META: Record<
  TaskCategory,
  {
    buttonLabel: string;
    itemPrefix: string;
    batchName: string;
    badgeClass: string;
    cardClass: string;
  }
> = {
  payroll: {
    buttonLabel: 'Payroll Slip',
    itemPrefix: 'Payroll',
    batchName: 'Batch A · Payroll',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    cardClass: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100',
  },
  electricity: {
    buttonLabel: 'Electricity Bill',
    itemPrefix: 'Elec Bill',
    batchName: 'Batch B · Electricity',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    cardClass: 'bg-purple-950/40 border-purple-500/40 text-purple-100',
  },
  banking: {
    buttonLabel: 'Bank Statement',
    itemPrefix: 'Statement',
    batchName: 'Batch C · Statements',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    cardClass: 'bg-amber-950/35 border-amber-500/40 text-amber-100',
  },
};

function createInitialTasks(): BatchTask[] {
  return [
    { id: 1, category: 'payroll', label: 'Payroll #101', batchName: CATEGORY_META.payroll.batchName },
    { id: 2, category: 'electricity', label: 'Elec Bill #201', batchName: CATEGORY_META.electricity.batchName },
    { id: 3, category: 'payroll', label: 'Payroll #102', batchName: CATEGORY_META.payroll.batchName },
    { id: 4, category: 'banking', label: 'Statement #301', batchName: CATEGORY_META.banking.batchName },
    { id: 5, category: 'electricity', label: 'Elec Bill #202', batchName: CATEGORY_META.electricity.batchName },
    { id: 6, category: 'banking', label: 'Statement #302', batchName: CATEGORY_META.banking.batchName },
  ];
}

function sortBySimilarity(tasks: BatchTask[]): BatchTask[] {
  const order: Record<TaskCategory, number> = { payroll: 0, electricity: 1, banking: 2 };
  return [...tasks].sort((a, b) => order[a.category] - order[b.category]);
}

export function BatchOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [nextId, setNextId] = useState(7);
  const [stagedTasks, setStagedTasks] = useState<BatchTask[]>(createInitialTasks);
  const [queuedBatch, setQueuedBatch] = useState<BatchTask[]>(() =>
    sortBySimilarity(createInitialTasks())
  );
  const [processedIdx, setProcessedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedNotified, setCompletedNotified] = useState(false);

  const groupedStaged = useMemo(() => sortBySimilarity(stagedTasks), [stagedTasks]);

  useEffect(() => {
    if (!isPlaying) return;
    if (queuedBatch.length === 0) {
      setIsPlaying(false);
      return;
    }
    if (processedIdx >= queuedBatch.length) {
      setIsPlaying(false);
      if (!completedNotified) {
        setCompletedNotified(true);
        soundFx.playVictory();
        onSimulationComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setProcessedIdx((i) => i + 1);
    }, 650);
    return () => clearTimeout(timer);
  }, [isPlaying, processedIdx, queuedBatch.length, completedNotified, onSimulationComplete]);

  const handleAddTask = (category: TaskCategory) => {
    soundFx.playPop();
    const meta = CATEGORY_META[category];
    const num =
      category === 'payroll'
        ? 100 + nextId
        : category === 'electricity'
          ? 200 + nextId
          : 300 + nextId;
    const newTask: BatchTask = {
      id: nextId,
      category,
      label: `${meta.itemPrefix} #${num}`,
      batchName: meta.batchName,
    };
    setNextId((n) => n + 1);
    setStagedTasks((prev) => [...prev, newTask]);
  };

  const handleAddMixedPack = () => {
    soundFx.playPop();
    const categories: TaskCategory[] = ['payroll', 'electricity', 'banking'];
    const created = categories.map((cat, offset) => {
      const id = nextId + offset;
      const meta = CATEGORY_META[cat];
      return {
        id,
        category: cat,
        label: `${meta.itemPrefix} #${(offset + 1) * 100 + id}`,
        batchName: meta.batchName,
      };
    });
    setNextId((n) => n + 3);
    setStagedTasks((prev) => [...prev, ...created]);
  };

  const handleSendToSystem = () => {
    if (stagedTasks.length === 0) return;
    soundFx.playClick();
    const sorted = sortBySimilarity(stagedTasks);
    setQueuedBatch(sorted);
    setProcessedIdx(0);
    setStagedTasks([]);
    setIsPlaying(true);
  };

  const handleReplay = () => {
    soundFx.playClick();
    if (queuedBatch.length === 0) {
      const defaults = sortBySimilarity(createInitialTasks());
      setQueuedBatch(defaults);
    }
    setProcessedIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    soundFx.playClick();
    const defaults = createInitialTasks();
    setStagedTasks(defaults);
    setQueuedBatch([]);
    setProcessedIdx(0);
    setNextId(7);
    setIsPlaying(false);
  };

  const remainingQueue = queuedBatch.slice(processedIdx);
  const activeJob =
    processedIdx > 0 && processedIdx <= queuedBatch.length
      ? queuedBatch[processedIdx - 1]
      : null;
  const completedJobs = queuedBatch.slice(0, processedIdx);
  const estimatedWaitSec = Math.max(0, Math.round(remainingQueue.length * 0.65));

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      {/* Lab Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold text-cyan-400">
            01 · INTERACTIVE BATCH PROCESSING CENTER
          </span>
          <span className="font-mono text-[11px] text-slate-300 inline-flex items-center gap-1">
            <UserX className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
            {isPlaying ? 'Human Interaction Locked During Run' : 'Zero Human Input Once Sent'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (queuedBatch.length === 0 && stagedTasks.length > 0) {
                handleSendToSystem();
              } else if (processedIdx >= queuedBatch.length && queuedBatch.length > 0) {
                setProcessedIdx(0);
                setIsPlaying(true);
              } else {
                setIsPlaying((p) => !p);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>
                  {processedIdx >= queuedBatch.length && queuedBatch.length > 0
                    ? 'Play Again'
                    : 'Play'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* User Task Builder: Add tasks based on similarity & Send to System */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Add Tasks by Similarity & Send Batch to System
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click tasks below to add them—the OS automatically groups similar tasks together before running.
            </p>
          </div>
          <span className="font-mono text-xs text-cyan-300 font-semibold">
            {stagedTasks.length} staged tasks ready
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['payroll', 'electricity', 'banking'] as TaskCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleAddTask(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors hover:brightness-110 ${meta.badgeClass}`}
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{meta.buttonLabel}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleAddMixedPack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Add 3 Mixed Tasks</span>
          </button>

          <button
            type="button"
            onClick={handleSendToSystem}
            disabled={stagedTasks.length === 0}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Send Grouped Batch to System ({stagedTasks.length})</span>
          </button>
        </div>

        {groupedStaged.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {groupedStaged.map((task) => (
              <span
                key={task.id}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-mono ${CATEGORY_META[task.category].badgeClass}`}
              >
                {task.label} ({task.batchName.split('·')[0].trim()})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3-Zone Animated Batch Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Zone 1: Auto-Grouped Batch Queue */}
        <div className="lg:col-span-4 rounded-xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">1. Grouped Batch Queue</span>
            <span className="font-mono text-[11px] text-cyan-400">
              {remainingQueue.length} queued
            </span>
          </div>

          <div className="space-y-2 min-h-[190px] max-h-[220px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {remainingQueue.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-center px-3 text-xs text-slate-500 font-mono">
                  {queuedBatch.length === 0
                    ? 'Add tasks above and click "Send Grouped Batch"'
                    : 'All tasks in this batch finished!'}
                </div>
              ) : (
                remainingQueue.slice(0, 6).map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, x: 24 }}
                    transition={{ duration: 0.25 }}
                    className={`px-3 py-2 rounded-lg border flex items-center justify-between text-xs ${CATEGORY_META[job.category].cardClass}`}
                  >
                    <span className="inline-flex items-center gap-2 font-medium">
                      <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {job.label}
                    </span>
                    <span className="font-mono text-[10px] opacity-85">{job.batchName}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Zone 2: Central Processing Machine */}
        <div className="lg:col-span-4 rounded-xl bg-gradient-to-b from-[#0b1530] to-slate-950 border border-cyan-500/40 p-5 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          {!prefersReducedMotion && isPlaying && (
            <motion.div
              className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          )}

          <motion.div
            animate={
              prefersReducedMotion || !isPlaying
                ? undefined
                : { scale: [1, 1.07, 1] }
            }
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative z-10"
          >
            <Cpu className="w-8 h-8 text-cyan-300" aria-hidden="true" />
          </motion.div>

          <div className="relative z-10 space-y-1">
            <span className="font-mono text-[11px] text-cyan-400 block">
              2. PROCESSING MACHINE
            </span>
            <p className="font-display text-base font-bold text-white">
              {activeJob
                ? `Executing ${activeJob.label}`
                : queuedBatch.length > 0 && processedIdx >= queuedBatch.length
                  ? 'Batch Run Complete'
                  : 'Waiting for Batch'}
            </p>
            <p className="text-xs text-slate-400">
              {activeJob
                ? `${activeJob.batchName} · Running sequentially`
                : 'Similar tasks execute back-to-back without stopping'}
            </p>
          </div>

          <div className="w-full space-y-1.5 relative z-10">
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                animate={{
                  width:
                    queuedBatch.length > 0
                      ? `${(processedIdx / queuedBatch.length) * 100}%`
                      : '0%',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-amber-300">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {remainingQueue.length > 0
                  ? `Wait until batch ends: ~${estimatedWaitSec}s`
                  : 'Results released to users'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 3: Output Section & Completed Jobs Counter */}
        <div className="lg:col-span-4 rounded-xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">3. Output Section</span>
            <span className="font-mono text-[11px] text-emerald-400">
              {queuedBatch.length > 0 && processedIdx >= queuedBatch.length
                ? 'ALL OUTPUTS READY'
                : 'COLLECTING OUTPUT'}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="font-mono text-[11px] text-slate-400 block">
              COMPLETED JOBS COUNTER
            </span>
            <motion.p
              key={completedJobs.length}
              initial={prefersReducedMotion ? false : { scale: 0.9 }}
              animate={{ scale: 1 }}
              className="font-mono tabular-nums text-4xl font-bold text-cyan-300"
            >
              {completedJobs.length}
            </motion.p>
            <span className="text-xs text-slate-400 block">
              of {queuedBatch.length} tasks in current batch
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {queuedBatch.map((job, idx) => {
              const done = idx < processedIdx;
              return (
                <div
                  key={job.id}
                  title={job.label}
                  className={`h-7 rounded flex items-center justify-center border transition-colors ${
                    done
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
