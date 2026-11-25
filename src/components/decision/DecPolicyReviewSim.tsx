import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  FileText,
  Radar,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

export function DecPolicyReviewSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [reorderThreshold, setReorderThreshold] = useState(50);
  const [policyUpdated, setPolicyUpdated] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const isSafePolicy = reorderThreshold >= 120;

  const handleAnalyzePolicy = () => {
    soundFx.playPop();
    setAnalyzed(true);
  };

  const adjustThreshold = (delta: number) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    soundFx.playClick();
    setPolicyUpdated(false);
    setReorderThreshold((prev) => Math.max(40, Math.min(160, prev + delta)));
  };

  const handleConfirmPolicy = () => {
    if (!analyzed || !isSafePolicy) {
      soundFx.playAlert();
      return;
    }
    setPolicyUpdated(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(19000);
    }
  };

  const handleQuickUpdate = () => {
    setAnalyzed(true);
    setReorderThreshold(120);
    setPolicyUpdated(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(19000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setReorderThreshold(50);
    setPolicyUpdated(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART INVENTORY POLICY · REORDER LEVEL REVIEW
          </span>
          <h3 className="font-display text-lg font-bold">
            {policyUpdated
              ? 'Reorder Policy Updated to 120 Units! Fast-Seller Stockouts Stopped (+NPR 19,000)'
              : 'Review the 50-Unit Reorder Policy Causing Fast-Seller Stockouts'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!analyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyzePolicy}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Sales & Stockout Reports</span>
            </motion.button>
          )}
          {analyzed && !policyUpdated && (
            <button
              type="button"
              onClick={handleQuickUpdate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Set Fast-Seller Reorder to 120 Units</span>
            </button>
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
        {/* Left: Stockout Simulation */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Fast-Selling Items (Lead Time: 2 Days · Sales: 55 units/day)
            </span>
            <span
              className={`font-mono font-bold inline-flex items-center gap-1 ${
                isSafePolicy ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSafePolicy ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  ZERO STOCKOUTS
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  STOCKOUTS OCCURRING
                </>
              )}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  2-Day Delivery Buffer Needed
                </span>
                <span className="font-mono font-bold text-sky-300">110+ units</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Current Policy Reorder Trigger
                </span>
                <span
                  className={`font-mono font-bold ${
                    isSafePolicy ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {reorderThreshold} units
                </span>
              </div>

              <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${
                    isSafePolicy ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  animate={{ width: `${Math.min(100, (reorderThreshold / 160) * 100)}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 22 }
                  }
                />
              </div>
            </div>

            <AnimatePresence>
              {analyzed && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isSafePolicy
                      ? 'bg-emerald-950/45 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/45 border-rose-500/50 text-rose-200'
                  }`}
                >
                  {isSafePolicy
                    ? 'With reorder threshold raised to 120+ units, fresh orders trigger early enough that shelves stay stocked during the 2-day delivery window.'
                    : 'MIS Stockout Report: Fast-selling items sell 110 units during the 2-day delivery wait—triggering reorders at 50 units guarantees empty shelves!'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Policy Adjustment Controls */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGEMENT POLICY REVIEW
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Increase Fast-Seller Reorder Level
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Raise the reorder policy from 50 units to at least 120 units for fast-selling products.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <span className="text-xs text-slate-300">Reorder Level</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustThreshold(-10)}
                  aria-label="Decrease reorder threshold by 10"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="font-mono tabular-nums text-2xl font-bold text-amber-300 w-16 text-center">
                  {reorderThreshold}
                </span>
                <button
                  type="button"
                  onClick={() => adjustThreshold(10)}
                  aria-label="Increase reorder threshold by 10"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPolicy}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Update Reorder Policy ({reorderThreshold} Units)
            </button>
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700">
            {policyUpdated
              ? 'Management updated SmartMart’s inventory policy using MIS stockout analytics.'
              : 'Analyze stockout reports first, then raise the reorder level to 120+ units.'}
          </p>
        </div>
      </div>
    </div>
  );
}
