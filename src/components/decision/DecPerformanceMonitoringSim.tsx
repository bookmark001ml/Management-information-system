import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Target,
  SearchCheck,
  Zap,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const BRANCH_DIAGNOSTICS = [
  { id: 'hours', label: 'Fix Peak-Hour Counter Staffing (-NPR 4L Gap)', recovery: 4 },
  { id: 'stock', label: 'Replenish Fast-Moving Staples Early (-NPR 3L Gap)', recovery: 3 },
  { id: 'promo', label: 'Run Targeted Weekend Member Offers (-NPR 3L Gap)', recovery: 3 },
];

export function DecPerformanceMonitoringSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [investigated, setInvestigated] = useState(false);
  const [fixes, setFixes] = useState<string[]>([]);
  const [rewarded, setRewarded] = useState(false);

  const recovered = BRANCH_DIAGNOSTICS.reduce(
    (s, d) => (fixes.includes(d.id) ? s + d.recovery : s),
    0
  );
  const actualLakh = 40 + recovered;
  const shortfallLakh = Math.max(0, 50 - actualLakh);
  const closed = actualLakh >= 50;

  const handleInvestigate = () => {
    soundFx.playPop();
    setInvestigated(true);
  };

  const toggleFix = (id: string) => {
    if (!investigated) {
      soundFx.playAlert();
      return;
    }
    const next = fixes.includes(id) ? fixes.filter((x) => x !== id) : [...fixes, id];
    setFixes(next);

    const nextTotal =
      40 +
      BRANCH_DIAGNOSTICS.reduce(
        (s, d) => (next.includes(d.id) ? s + d.recovery : s),
        0
      );

    if (nextTotal >= 50) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(18000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setInvestigated(false);
    setFixes([]);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART BRANCH PERFORMANCE · TARGET NPR 50L VS ACTUAL NPR 40L
          </span>
          <h3 className="font-display text-lg font-bold">
            {closed
              ? 'Performance Gap Closed! Branch Hit NPR 50 Lakh Target (+NPR 18,000)'
              : 'Dashboard Highlights NPR 10 Lakh Shortfall — Investigate & Fix'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!investigated && (
            <motion.button
              type="button"
              onClick={handleInvestigate}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <SearchCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Investigate Performance Gap</span>
            </motion.button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Target</span>
              <span className="font-mono tabular-nums text-xl font-bold text-white mt-1 block">
                NPR 50L
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Actual Sales</span>
              <span
                className={`font-mono tabular-nums text-xl font-bold mt-1 block ${
                  closed ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                NPR {actualLakh}L
              </span>
            </div>
            <div
              className={`p-3.5 rounded-xl border ${
                closed
                  ? 'bg-emerald-950/50 border-emerald-500/50'
                  : 'bg-rose-950/60 border-rose-500/60'
              }`}
            >
              <span className="text-[11px] text-slate-300 block">Shortfall</span>
              <span
                className={`font-mono tabular-nums text-xl font-bold mt-1 block ${
                  closed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {closed ? 'NPR 0L' : `-NPR ${shortfallLakh}L`}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 inline-flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                  Monthly Sales Target
                </span>
                <span className="font-mono tabular-nums font-bold text-sky-300">NPR 50 Lakh</span>
              </div>
              <div className="h-7 bg-slate-900 rounded-lg p-1">
                <div className="h-full w-full bg-sky-500/80 rounded" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Branch Actual Sales</span>
                <span
                  className={`font-mono tabular-nums font-bold inline-flex items-center gap-1 ${
                    closed ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {closed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      NPR {actualLakh} Lakh (GOAL REACHED)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      NPR {actualLakh} Lakh (-NPR {shortfallLakh}L SHORTFALL)
                    </>
                  )}
                </span>
              </div>

              <div className="h-9 bg-slate-900 rounded-lg p-1 flex items-center overflow-hidden">
                <motion.div
                  className={`h-full rounded ${closed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  animate={{ width: `${(actualLakh / 50) * 100}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 22 }
                  }
                />
                {!closed && (
                  <motion.div
                    className="h-full bg-rose-500/40 border-2 border-dashed border-rose-400 rounded-r ml-1 flex items-center justify-center overflow-hidden"
                    animate={
                      prefersReducedMotion
                        ? { width: `${(shortfallLakh / 50) * 100}%` }
                        : {
                            width: `${(shortfallLakh / 50) * 100}%`,
                            opacity: [0.6, 1, 0.6],
                          }
                    }
                    transition={{
                      width: { type: 'spring', stiffness: 180, damping: 22 },
                      opacity: { repeat: Infinity, duration: 1.2 },
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold text-rose-200 whitespace-nowrap px-1">
                      -{shortfallLakh}L GAP
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {investigated && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-500/40 text-xs text-sky-200"
              >
                <strong>Regional Manager Audit:</strong> Shortfall came from slow evening queues (-4L), staple stockouts (-3L), and missed weekend promotions (-3L).
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                REGIONAL MANAGER ACTIONS
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Close the NPR 10 Lakh Gap
              </h4>
            </div>

            {BRANCH_DIAGNOSTICS.map((item) => {
              const active = fixes.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFix(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-emerald-950/60 border-emerald-400 text-white'
                      : investigated
                        ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 text-xs font-semibold">
                    <Zap
                      className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-400' : 'text-amber-400'}`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                    +{item.recovery}L
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700">
            {closed
              ? 'Performance monitoring surfaced the NPR 10L shortfall early so the regional manager closed the gap.'
              : 'Investigate the NPR 10L shortfall first, then apply all 3 branch actions.'}
          </p>
        </div>
      </div>
    </div>
  );
}
