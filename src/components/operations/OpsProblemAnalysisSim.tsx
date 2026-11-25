import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Milk,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const DAIRY_RECORDS = [
  {
    id: 'milk',
    name: 'Fresh Milk (1L)',
    purchased: 120,
    demand: 70,
    expiredLoss: 50,
    lossNpr: 5500,
  },
  {
    id: 'yogurt',
    name: 'Fresh Yogurt (500g)',
    purchased: 90,
    demand: 50,
    expiredLoss: 40,
    lossNpr: 4800,
  },
];

const CAUSE_OPTIONS = [
  {
    id: 'over-purchasing',
    label: 'Over-purchasing milk & yogurt above customer demand',
    isCorrect: true,
  },
  {
    id: 'freezer',
    label: 'Chiller temperature set too cold during morning delivery',
    isCorrect: false,
  },
  {
    id: 'checkout',
    label: 'Checkout counter barcode scanner running too fast',
    isCorrect: false,
  },
];

export function OpsProblemAnalysisSim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [recordsAnalyzed, setRecordsAnalyzed] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const isSolved = selectedCause === 'over-purchasing';

  const handleAnalyzeRecords = () => {
    soundFx.playPop();
    setRecordsAnalyzed(true);
    setSelectedCause(null);
  };

  const handleSelectCause = (optId: string, isCorrect: boolean) => {
    if (!recordsAnalyzed) {
      soundFx.playAlert();
      return;
    }
    setSelectedCause(optId);
    if (isCorrect) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(19000);
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setRecordsAnalyzed(false);
    setSelectedCause(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART DAIRY LOSS AUDIT · PURCHASE, SALES & EXPIRY RECORDS
          </span>
          <h3 className="font-display text-lg font-bold">
            {isSolved
              ? 'Over-Purchasing Identified! Dairy Wastage Eliminated (+NPR 19,000)'
              : 'Investigate Rising Losses from Expired Dairy Products'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!recordsAnalyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyzeRecords}
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
        {/* Left: Purchase vs Sales vs Expiry Records Comparison */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              SmartMart Dairy Expiry & Stock Comparison
            </span>
            <span
              className={`font-mono font-bold ${
                isSolved ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSolved ? 'ORDERS MATCH DEMAND' : 'NPR 10,300 EXPIRED LOSS'}
            </span>
          </div>

          <div className="space-y-4">
            {DAIRY_RECORDS.map((item) => {
              const adjustedPurchase = isSolved ? item.demand : item.purchased;
              const maxScale = 130;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isSolved
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : recordsAnalyzed
                        ? 'bg-slate-900 border-rose-500/50'
                        : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Milk
                        className={`w-4 h-4 ${isSolved ? 'text-emerald-400' : 'text-sky-300'}`}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-bold text-white">{item.name}</span>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isSolved ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isSolved
                        ? '0 expired units'
                        : `${item.expiredLoss} expired (-NPR ${item.lossNpr.toLocaleString()})`}
                    </span>
                  </div>

                  {/* Purchased vs Customer Demand Bars */}
                  <div className="space-y-2 text-[11px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Purchased Quantity</span>
                        <span className="font-bold text-white">{adjustedPurchase} units</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          className={`h-full rounded-full ${
                            isSolved ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          animate={{ width: `${(adjustedPurchase / maxScale) * 100}%` }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 180, damping: 22 }
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Customer Demand (Sales)</span>
                        <span className="font-bold text-sky-300">{item.demand} units</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${(item.demand / maxScale) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {recordsAnalyzed && !isSolved && (
                    <motion.p
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-rose-300 mt-3 font-medium"
                    >
                      MIS Record Alert: Purchased {item.purchased - item.demand} units above customer demand, causing expiry before sale.
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Manager Identifies Root Cause */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGER ROOT-CAUSE DIAGNOSIS
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Identify the Cause of Dairy Wastage
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {recordsAnalyzed
                  ? 'Based on MIS purchase, sales, and expiry-date records, select why milk and yogurt are expiring:'
                  : 'Click "1. Analyze Purchase, Sales & Expiry Records" first to inspect the dairy data.'}
              </p>
            </div>

            <div className="space-y-2.5">
              {CAUSE_OPTIONS.map((opt) => {
                const picked = selectedCause === opt.id;
                const wrongPicked = picked && !opt.isCorrect;
                const rightPicked = picked && opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectCause(opt.id, opt.isCorrect)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-start gap-2.5 ${
                      rightPicked
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100'
                        : wrongPicked
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                          : recordsAnalyzed
                            ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                            : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    {rightPicked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    ) : wrongPicked ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCause ?? (recordsAnalyzed ? 'ready' : 'idle')}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isSolved
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : selectedCause
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300'
              }`}
            >
              {isSolved
                ? 'Correct! MIS revealed milk and yogurt were ordered far above demand. The manager aligned purchases to demand and stopped the wastage.'
                : selectedCause
                  ? 'Not quite—look at the purchase vs. customer demand bars on the left. Milk and yogurt purchases far exceed sales!'
                  : 'Run the MIS record audit to compare dairy purchase orders against actual customer sales.'}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
