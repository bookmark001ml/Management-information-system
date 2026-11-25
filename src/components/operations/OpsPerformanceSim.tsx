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

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const TARGET_LAKH = 50;
const INITIAL_ACTUAL_LAKH = 40;

const CORRECTIVE_ACTIONS = [
  { id: 'evening', label: 'Extend Express Evening Checkout & Flash Offers', gainLakh: 4 },
  { id: 'dairy', label: 'Eliminate Afternoon Dairy Stockouts', gainLakh: 3 },
  { id: 'bundle', label: 'Launch Weekend SmartMart Family Bundles', gainLakh: 3 },
];

export function OpsPerformanceSim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [investigated, setInvestigated] = useState(false);
  const [applied, setApplied] = useState<string[]>([]);
  const [rewarded, setRewarded] = useState(false);

  const bonusLakh = CORRECTIVE_ACTIONS.reduce(
    (sum, a) => (applied.includes(a.id) ? sum + a.gainLakh : sum),
    0
  );
  const actualLakh = INITIAL_ACTUAL_LAKH + bonusLakh;
  const shortfallLakh = Math.max(0, TARGET_LAKH - actualLakh);
  const targetMet = actualLakh >= TARGET_LAKH;

  const handleInvestigate = () => {
    soundFx.playPop();
    setInvestigated(true);
  };

  const toggleAction = (id: string) => {
    if (!investigated) {
      soundFx.playAlert();
      return;
    }
    const exists = applied.includes(id);
    const next = exists ? applied.filter((x) => x !== id) : [...applied, id];
    setApplied(next);

    const nextActual =
      INITIAL_ACTUAL_LAKH +
      CORRECTIVE_ACTIONS.reduce(
        (sum, a) => (next.includes(a.id) ? sum + a.gainLakh : sum),
        0
      );

    if (nextActual >= TARGET_LAKH) {
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
    setApplied([]);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART MONTHLY SALES MONITOR · TARGET CONTROL
          </span>
          <h3 className="font-display text-lg font-bold">
            {targetMet
              ? 'Shortfall Closed! Monthly Target of NPR 50 Lakh Achieved (+NPR 18,000)'
              : 'Target: NPR 50 Lakh vs. Actual: NPR 40 Lakh — NPR 10 Lakh Shortfall'}
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
              <span>1. Investigate NPR 10L Shortfall</span>
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
        {/* Left: Target vs Actual & Highlighted NPR 10 Lakh Shortfall */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Monthly Target</span>
              <span className="font-mono tabular-nums text-xl font-bold text-white mt-1 block">
                NPR 50L
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Actual Sales</span>
              <motion.span
                key={actualLakh}
                initial={prefersReducedMotion ? false : { scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`font-mono tabular-nums text-xl font-bold mt-1 block ${
                  targetMet ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                NPR {actualLakh}L
              </motion.span>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                targetMet
                  ? 'bg-emerald-950/50 border-emerald-500/50'
                  : 'bg-rose-950/60 border-rose-500/60'
              }`}
            >
              <span className="text-[11px] text-slate-300 block">MIS Shortfall Alert</span>
              <span
                className={`font-mono tabular-nums text-xl font-bold mt-1 block ${
                  targetMet ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {targetMet ? 'NPR 0L' : `-NPR ${shortfallLakh}L`}
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
                <span className="font-mono tabular-nums font-bold text-sky-300">
                  NPR 50 Lakh (100%)
                </span>
              </div>
              <div className="h-7 bg-slate-900 rounded-lg p-1 overflow-hidden">
                <div className="h-full w-full bg-sky-500/80 rounded" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Actual Sales Progress</span>
                <span
                  className={`font-mono tabular-nums font-bold inline-flex items-center gap-1 ${
                    targetMet ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {targetMet ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      NPR {actualLakh} Lakh (TARGET MET)
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
                  className={`h-full rounded ${targetMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  animate={{ width: `${(actualLakh / TARGET_LAKH) * 100}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 22 }
                  }
                />

                {!targetMet && (
                  <motion.div
                    className="h-full bg-rose-500/40 border-2 border-dashed border-rose-400 rounded-r ml-1 flex items-center justify-center overflow-hidden"
                    animate={
                      prefersReducedMotion
                        ? { width: `${(shortfallLakh / TARGET_LAKH) * 100}%` }
                        : {
                            width: `${(shortfallLakh / TARGET_LAKH) * 100}%`,
                            opacity: [0.6, 1, 0.6],
                          }
                    }
                    transition={{
                      width: { type: 'spring', stiffness: 180, damping: 22 },
                      opacity: { repeat: Infinity, duration: 1.2 },
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold text-rose-200 whitespace-nowrap px-1">
                      -{shortfallLakh}L SHORTFALL
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {investigated && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-500/40 text-xs text-sky-200"
              >
                <strong>Investigation Finding:</strong> NPR 4L lost during slow evening checkouts, NPR 3L from dairy stockouts, and NPR 3L from missed weekend bundle sales.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Corrective Actions */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGER CORRECTIVE ACTION
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Recover the NPR 10 Lakh Shortfall
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {investigated
                  ? 'Select all 3 corrective actions below to bring monthly sales from NPR 40L up to NPR 50L:'
                  : 'First click "1. Investigate NPR 10L Shortfall" to unlock corrective actions.'}
              </p>
            </div>

            {CORRECTIVE_ACTIONS.map((act) => {
              const active = applied.includes(act.id);
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => toggleAction(act.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-emerald-950/60 border-emerald-400 text-white'
                      : investigated
                        ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold">{act.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-bold text-emerald-400 shrink-0">
                    +NPR {act.gainLakh}L
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700 leading-relaxed">
            {targetMet
              ? 'Monthly performance control complete! MIS surfaced the NPR 10 lakh gap early enough to hit the NPR 50 lakh goal.'
              : 'MIS compares target (NPR 50L) vs actual (NPR 40L) so the manager investigates and acts quickly.'}
          </p>
        </div>
      </div>
    </div>
  );
}
