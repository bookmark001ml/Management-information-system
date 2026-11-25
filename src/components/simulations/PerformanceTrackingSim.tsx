import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const TARGET_LAKH = 50;
const INITIAL_ACTUAL_LAKH = 42;

const BOOST_ACTIONS = [
  { id: 'corporate', label: 'Launch Corporate Breakfast Boxes', gainLakh: 4 },
  { id: 'happyhour', label: 'Trigger 4 PM Pastry Bundle Promo', gainLakh: 4 },
];

export function PerformanceTrackingSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [applied, setApplied] = useState<string[]>([]);
  const [wonShown, setWonShown] = useState(false);

  const bonusLakh = BOOST_ACTIONS.reduce(
    (sum, act) => (applied.includes(act.id) ? sum + act.gainLakh : sum),
    0
  );
  const actualLakh = INITIAL_ACTUAL_LAKH + bonusLakh;
  const gapLakh = Math.max(0, TARGET_LAKH - actualLakh);
  const onTarget = actualLakh >= TARGET_LAKH;

  const toggleAction = (id: string) => {
    const exists = applied.includes(id);
    const next = exists ? applied.filter((x) => x !== id) : [...applied, id];
    setApplied(next);

    const newActual =
      INITIAL_ACTUAL_LAKH +
      BOOST_ACTIONS.reduce(
        (sum, act) => (next.includes(act.id) ? sum + act.gainLakh : sum),
        0
      );

    if (newActual >= TARGET_LAKH) {
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(16000);
      } else {
        soundFx.playVictory();
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setApplied([]);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            MONTHLY PERFORMANCE DASHBOARD · KATHMANDU BAKERY
          </span>
          <h3 className="font-display text-lg font-bold">
            {onTarget
              ? 'Target Reached! NPR 50 Lakh Monthly Goal Achieved (+NPR 16,000)'
              : 'Target: NPR 50 Lakh vs. Actual: NPR 42 Lakh — Gap Highlighted'}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Month</span>
        </button>
      </div>

      {/* Main Split: Animated Target vs Actual Gap Visualizer + Control Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Highlighted NPR 50L vs NPR 42L Gap Meter */}
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
                  onTarget ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                NPR {actualLakh}L
              </motion.span>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                onTarget
                  ? 'bg-emerald-950/50 border-emerald-500/50'
                  : 'bg-rose-950/60 border-rose-500/60'
              }`}
            >
              <span className="text-[11px] text-slate-300 block">Variance Gap</span>
              <span
                className={`font-mono tabular-nums text-xl font-bold mt-1 block ${
                  onTarget ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {onTarget ? '0 Lakh' : `-NPR ${gapLakh}L`}
              </span>
            </div>
          </div>

          {/* Animated Comparison Bars with Highlighted Gap Zone */}
          <div className="space-y-4">
            {/* Target Bar */}
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

            {/* Actual Bar + Pulsing Shortfall Highlight */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-white">Actual Sales Progress</span>
                <span
                  className={`font-mono tabular-nums font-bold inline-flex items-center gap-1 ${
                    onTarget ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {onTarget ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      NPR {actualLakh} Lakh (ON TARGET)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      NPR {actualLakh} Lakh (-NPR {gapLakh}L SHORTFALL)
                    </>
                  )}
                </span>
              </div>

              <div className="h-9 bg-slate-900 rounded-lg p-1 flex items-center overflow-hidden relative">
                <motion.div
                  className={`h-full rounded ${
                    onTarget ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  animate={{ width: `${(actualLakh / TARGET_LAKH) * 100}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 22 }
                  }
                />

                {!onTarget && (
                  <motion.div
                    className="h-full bg-rose-500/40 border-2 border-dashed border-rose-400 rounded-r ml-1 flex items-center justify-center overflow-hidden"
                    animate={
                      prefersReducedMotion
                        ? { width: `${(gapLakh / TARGET_LAKH) * 100}%` }
                        : {
                            width: `${(gapLakh / TARGET_LAKH) * 100}%`,
                            opacity: [0.65, 1, 0.65],
                          }
                    }
                    transition={{
                      width: { type: 'spring', stiffness: 180, damping: 22 },
                      opacity: { repeat: Infinity, duration: 1.2 },
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold text-rose-200 whitespace-nowrap px-1">
                      -{gapLakh}L GAP
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Corrective Control Actions */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                PERFORMANCE CONTROL
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Close the NPR 8 Lakh Gap
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Because MIS highlighted the NPR 8L shortfall early, trigger corrective actions to hit NPR 50L:
              </p>
            </div>

            {BOOST_ACTIONS.map((act) => {
              const active = applied.includes(act.id);
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => toggleAction(act.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-emerald-950/60 border-emerald-400 text-white'
                      : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
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
                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                    +NPR {act.gainLakh}L
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700 leading-relaxed">
            {onTarget
              ? 'Control complete! Highlighting the NPR 50L vs 42L gap mid-month let management take action in time.'
              : 'MIS compares target (50L) vs actual (42L) live and puts the 8L gap front and center.'}
          </p>
        </div>
      </div>
    </div>
  );
}
