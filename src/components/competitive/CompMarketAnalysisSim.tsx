import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Leaf,
  TrendingUp,
  Radar,
  Store,
  CheckCircle2,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const DEMAND_TRENDS = [
  { id: 'organic', name: 'Organic Food Products', q1: 22, q2: 45, q3: 78, q4: 94, growth: '+145%', highlight: true },
  { id: 'packaged', name: 'Packaged Snacks', q1: 60, q2: 58, q3: 55, q4: 53, growth: '-8%', highlight: false },
  { id: 'beverages', name: 'Carbonated Drinks', q1: 52, q2: 49, q3: 46, q4: 44, growth: '-12%', highlight: false },
];

export function CompMarketAnalysisSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [organicAisles, setOrganicAisles] = useState(1);
  const [expandedDone, setExpandedDone] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const handleAnalyze = () => {
    soundFx.playPop();
    setAnalyzed(true);
  };

  const changeAisles = (delta: number) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    soundFx.playClick();
    setExpandedDone(false);
    setOrganicAisles((prev) => Math.max(1, Math.min(5, prev + delta)));
  };

  const handleConfirmExpansion = () => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    if (organicAisles >= 4) {
      setExpandedDone(true);
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(16000);
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleQuickExpand = () => {
    setAnalyzed(true);
    setOrganicAisles(4);
    setExpandedDone(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(16000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setOrganicAisles(1);
    setExpandedDone(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART MARKET TRENDS · DEMAND INTELLIGENCE
          </span>
          <h3 className="font-display text-lg font-bold">
            {expandedDone
              ? 'Organic Section Expanded to 4 Aisles! Captured Growing Trend (+NPR 16,000)'
              : 'Analyze Sales Patterns & Expand the Fastest-Growing Product Section'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!analyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyze}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Sales & Patterns</span>
            </motion.button>
          )}
          {analyzed && !expandedDone && (
            <button
              type="button"
              onClick={handleQuickExpand}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Expand Organic to 4 Aisles</span>
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
        {/* Left: Quarterly Demand Pattern Visualizer */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              SmartMart Customer Purchasing Patterns (Q1 – Q4)
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {analyzed ? 'ORGANIC TREND DETECTED' : 'AWAITING SCAN'}
            </span>
          </div>

          <div className="space-y-4">
            {DEMAND_TRENDS.map((trend) => {
              const quarters = [trend.q1, trend.q2, trend.q3, trend.q4];
              return (
                <div
                  key={trend.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    analyzed && trend.highlight
                      ? 'bg-emerald-950/35 border-emerald-500/60'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {trend.highlight ? (
                        <Leaf className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      )}
                      <span className="text-sm font-bold text-white">{trend.name}</span>
                    </div>
                    <span
                      className={`font-mono tabular-nums text-xs font-bold ${
                        analyzed && trend.highlight ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {analyzed ? `${trend.growth} demand` : 'Unscanned'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 items-end h-16">
                    {quarters.map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full bg-slate-800 rounded h-12 flex items-end overflow-hidden p-0.5">
                          <motion.div
                            className={`w-full rounded-sm ${
                              analyzed && trend.highlight ? 'bg-emerald-400' : 'bg-slate-600'
                            }`}
                            animate={{ height: analyzed ? `${val}%` : '35%' }}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { duration: 0.4, delay: idx * 0.08 }
                            }
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">Q{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Organic Section Expansion Decision + Student Takeaway */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGER EXPANSION DECISION
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Allocate Organic Section Aisles
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {analyzed
                  ? 'Organic food demand surged +145%. Expand the organic section to 4 or 5 aisles to capture this opportunity!'
                  : 'Run Step 1 to analyze customer purchasing patterns first.'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 inline-flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  Organic Aisles
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeAisles(-1)}
                    aria-label="Decrease organic aisles"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="font-mono tabular-nums text-xl font-bold text-emerald-400 w-10 text-center">
                    {organicAisles}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeAisles(1)}
                    aria-label="Increase organic aisles"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Animated Shelf Aisles Visual */}
              <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const active = idx < organicAisles;
                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: active ? 1 : 0.94, opacity: active ? 1 : 0.35 }}
                      className={`h-8 rounded-lg border flex items-center justify-center ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                    >
                      <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmExpansion}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Confirm Organic Expansion ({organicAisles} Aisles)
            </button>
          </div>

          <AnimatePresence>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                expandedDone
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-amber-300 block mb-1">
                STUDENT TAKEAWAY
              </span>
              {expandedDone ? (
                <span className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    MIS helps businesses understand market trends and identify new opportunities.
                  </span>
                </span>
              ) : (
                <span>
                  MIS helps businesses understand market trends and identify new opportunities.
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
