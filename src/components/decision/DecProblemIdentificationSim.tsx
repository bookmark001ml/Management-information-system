import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Milk,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const DAIRY_ITEMS = [
  { id: 'milk', name: 'Fresh Milk (1L)', purchased: 130, demanded: 75, expired: 55 },
  { id: 'yogurt', name: 'Dairy Yogurt (500g)', purchased: 95, demanded: 55, expired: 40 },
  { id: 'paneer', name: 'Fresh Paneer (250g)', purchased: 70, demanded: 40, expired: 30 },
];

const CAUSES = [
  { id: 'over-purchasing', label: 'Over-purchasing above actual customer demand', isCorrect: true },
  { id: 'shelf-color', label: 'Dairy aisle signage font size too small', isCorrect: false },
  { id: 'pos-speed', label: 'Billing counter receipt printer running slowly', isCorrect: false },
];

export function DecProblemIdentificationSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const solved = selectedCause === 'over-purchasing';

  const handleAnalyze = () => {
    soundFx.playPop();
    setAnalyzed(true);
    setSelectedCause(null);
  };

  const handlePickCause = (id: string, isCorrect: boolean) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    setSelectedCause(id);
    if (isCorrect) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(18000);
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setSelectedCause(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART DAIRY EXPIRY AUDIT · PURCHASING, SALES & EXPIRY RECORDS
          </span>
          <h3 className="font-display text-lg font-bold">
            {solved
              ? 'Over-Purchasing Identified! Dairy Orders Aligned to Demand (+NPR 18,000)'
              : 'Identify Why Expired Dairy Products Are Causing Increasing Losses'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!analyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyze}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileSearch className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Purchase, Sales & Expiry Records</span>
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
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Purchasing vs. Customer Demand & Expiry Losses
            </span>
            <span className={`font-mono font-bold ${solved ? 'text-emerald-400' : 'text-rose-400'}`}>
              {solved ? '0 EXPIRED UNITS' : '125 EXPIRED UNITS'}
            </span>
          </div>

          <div className="space-y-3">
            {DAIRY_ITEMS.map((item) => {
              const orderQty = solved ? item.demanded : item.purchased;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    solved
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : analyzed
                        ? 'bg-slate-900 border-rose-500/50'
                        : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white inline-flex items-center gap-2">
                      <Milk className="w-4 h-4 text-sky-300" aria-hidden="true" />
                      {item.name}
                    </span>
                    <span className={`font-mono text-xs font-bold ${solved ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {solved ? 'Matched to Demand' : `${item.expired} expired`}
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Purchased</span>
                      <span className="text-white font-bold">{orderQty} units</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${solved ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        animate={{ width: `${(orderQty / 140) * 100}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer Demand</span>
                      <span className="text-sky-300 font-bold">{item.demanded} units</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${(item.demanded / 140) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                ROOT-CAUSE IDENTIFICATION
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                What Is Causing Food Wastage?
              </h4>
            </div>

            {CAUSES.map((c) => {
              const picked = selectedCause === c.id;
              const right = picked && c.isCorrect;
              const wrong = picked && !c.isCorrect;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handlePickCause(c.id, c.isCorrect)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-start gap-2.5 ${
                    right
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100'
                      : wrong
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : analyzed
                          ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                          : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  {right ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : wrong ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCause ?? (analyzed ? 'analyzed' : 'idle')}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                solved
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : selectedCause
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300'
              }`}
            >
              {solved
                ? 'Correct! MIS revealed more dairy products were bought than demanded. Identifying over-purchasing stopped expiry losses.'
                : selectedCause
                  ? 'Look at the Purchasing vs. Customer Demand bars on the left—orders far exceed what customers buy!'
                  : 'Click "1. Analyze Purchase, Sales & Expiry Records" first to inspect the dairy mismatch.'}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
