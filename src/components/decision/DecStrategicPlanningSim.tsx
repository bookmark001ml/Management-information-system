import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  TrendingUp,
  MapPin,
  Radar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const MARKETS = [
  {
    id: 'pokhara',
    name: 'Pokhara',
    fiveYearSales: [18, 26, 37, 51, 68],
    profitMargin: '25%',
    customerGrowth: '+44% 5-yr CAGR',
    isGrowthMarket: true,
  },
  {
    id: 'butwal',
    name: 'Butwal',
    fiveYearSales: [22, 24, 25, 24, 26],
    profitMargin: '12%',
    customerGrowth: '+4% 5-yr CAGR',
    isGrowthMarket: false,
  },
  {
    id: 'itahari',
    name: 'Itahari',
    fiveYearSales: [20, 21, 19, 22, 21],
    profitMargin: '10%',
    customerGrowth: '+2% 5-yr CAGR',
    isGrowthMarket: false,
  },
];

export function DecStrategicPlanningSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [pickedCity, setPickedCity] = useState<string | null>(null);
  const [branchConsidered, setBranchConsidered] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const handleAnalyze = () => {
    soundFx.playPop();
    setAnalyzed(true);
  };

  const handleSelectCity = (id: string, isGrowthMarket: boolean) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    setPickedCity(id);
    if (isGrowthMarket) {
      soundFx.playPop();
    } else {
      soundFx.playAlert();
      setBranchConsidered(false);
    }
  };

  const handleApproveExpansion = () => {
    setBranchConsidered(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(24000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setPickedCity(null);
    setBranchConsidered(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART BOARDROOM · 5-YEAR STRATEGIC EXPANSION
          </span>
          <h3 className="font-display text-lg font-bold">
            {branchConsidered
              ? 'Pokhara Selected for New SmartMart Branch Expansion! (+NPR 24,000)'
              : 'Analyze 5 Years of Data to Identify the Top Growth Market'}
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
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze 5 Years of MIS Data</span>
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

      {/* 5-Year Sales, Profitability & Customer Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MARKETS.map((m) => {
          const isSelected = pickedCity === m.id;
          const isRight = isSelected && m.isGrowthMarket;
          const isWrong = isSelected && !m.isGrowthMarket;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelectCity(m.id, m.isGrowthMarket)}
              className={`text-left rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-colors cursor-pointer ${
                isRight
                  ? 'bg-emerald-950/45 border-emerald-400'
                  : isWrong
                    ? 'bg-rose-950/40 border-rose-500'
                    : analyzed
                      ? 'bg-slate-950 border-slate-700 hover:border-amber-400'
                      : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-white inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    {m.name}
                  </span>
                  {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />}
                  {isWrong && <AlertTriangle className="w-5 h-5 text-rose-400" aria-hidden="true" />}
                </div>

                {/* 5-Year Bar Chart */}
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block mb-1.5">
                    5-Year Sales Trend (Y1–Y5)
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 items-end h-16">
                    {m.fiveYearSales.map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full bg-slate-800 rounded h-12 flex items-end overflow-hidden p-0.5">
                          <motion.div
                            className={`w-full rounded-sm ${
                              analyzed && m.isGrowthMarket ? 'bg-emerald-400' : 'bg-sky-500/60'
                            }`}
                            animate={{ height: analyzed ? `${Math.min(100, val * 1.4)}%` : '25%' }}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { duration: 0.35, delay: idx * 0.06 }
                            }
                          />
                        </div>
                        <span className="font-mono text-[9px] text-slate-500">Y{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analyzed && (
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profitability</span>
                      <span className={m.isGrowthMarket ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {m.profitMargin}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customers</span>
                      <span className={m.isGrowthMarket ? 'text-sky-300 font-bold' : 'text-slate-300'}>
                        {m.customerGrowth}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <span className="font-mono text-xs font-bold text-amber-300 pt-2 border-t border-slate-800 block">
                {isRight ? 'Growth Market Identified' : 'Select Market'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Management Expansion Decision Bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={branchConsidered ? 'done' : pickedCity ?? (analyzed ? 'analyzed' : 'idle')}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="text-xs text-slate-200 leading-relaxed">
            {branchConsidered ? (
              <span className="text-emerald-300 font-semibold inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 shrink-0" aria-hidden="true" />
                Top management approved opening a new SmartMart branch in Pokhara based on 5 years of steady sales, profit, and customer growth!
              </span>
            ) : pickedCity === 'pokhara' ? (
              <span>
                <strong>MIS Report Summary:</strong> Pokhara grew every year for 5 years (+44% customer CAGR, 25% profitability). Proceed to Top Management review!
              </span>
            ) : pickedCity ? (
              <span className="text-rose-300">
                5-year sales here are flat with lower margins. Check Pokhara’s 5-year upward curve!
              </span>
            ) : analyzed ? (
              <span>Click the city with the strongest 5-year sales, profitability, and customer trend.</span>
            ) : (
              <span>Click “1. Analyze 5 Years of MIS Data” to inspect sales, profitability, and customer records.</span>
            )}
          </div>

          {pickedCity === 'pokhara' && !branchConsidered && (
            <button
              type="button"
              onClick={handleApproveExpansion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>2. Approve New Pokhara Branch</span>
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
