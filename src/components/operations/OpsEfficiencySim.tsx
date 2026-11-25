import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ClipboardList,
  Database,
  FileSpreadsheet,
  Users,
  ShoppingCart,
  Clock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

type Stage = 'MANUAL' | 'ANALYZED' | 'REPORT_READY' | 'PRIORITIZED';

const REPLENISHMENT_REPORT = [
  { id: 'milk', product: 'Fresh Milk (1L)', left: '4 packs', priority: 'Urgent #1', aisle: 'Dairy A2' },
  { id: 'diapers', product: 'Baby Diapers (M)', left: '6 packs', priority: 'High #2', aisle: 'Care B1' },
  { id: 'rice', product: 'Basmati Rice (5kg)', left: '5 bags', priority: 'Medium #3', aisle: 'Grains C4' },
];

export function OpsEfficiencySim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>('MANUAL');
  const [rewarded, setRewarded] = useState(false);

  const handleAnalyze = () => {
    soundFx.playPop();
    setStage('ANALYZED');
  };

  const handleGenerateReport = () => {
    soundFx.playPop();
    setStage('REPORT_READY');
  };

  const handlePrioritizeRestock = () => {
    soundFx.playVictory();
    setStage('PRIORITIZED');
    if (!rewarded) {
      setRewarded(true);
      onComplete(17000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setStage('MANUAL');
  };

  const checkoutSeconds =
    stage === 'MANUAL' ? 270 : stage === 'ANALYZED' ? 210 : stage === 'REPORT_READY' ? 140 : 52;
  const shelfCheckMins = stage === 'PRIORITIZED' ? 10 : 95;
  const customersServedPct = stage === 'PRIORITIZED' ? 92 : stage === 'REPORT_READY' ? 58 : 34;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART FLOOR & CHECKOUT · OPERATIONAL EFFICIENCY
          </span>
          <h3 className="font-display text-lg font-bold">
            {stage === 'PRIORITIZED'
              ? 'Checkout Time Cut by 80%! Employees Serve Customers Faster (+NPR 17,000)'
              : 'Replace Manual Shelf Checks with Automated MIS Replenishment'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stage === 'MANUAL' && (
            <motion.button
              type="button"
              onClick={handleAnalyze}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Sales & Inventory Data</span>
            </motion.button>
          )}

          {stage === 'ANALYZED' && (
            <motion.button
              type="button"
              onClick={handleGenerateReport}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Generate Replenishment Report</span>
            </motion.button>
          )}

          {stage === 'REPORT_READY' && (
            <motion.button
              type="button"
              onClick={handlePrioritizeRestock}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>3. Prioritize Restocking & Free Staff</span>
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

      {/* Live KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Checkout Wait Time</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          </div>
          <motion.p
            key={checkoutSeconds}
            initial={prefersReducedMotion ? false : { scale: 0.92 }}
            animate={{ scale: 1 }}
            className={`font-mono tabular-nums text-2xl font-bold mt-1.5 ${
              stage === 'PRIORITIZED' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {Math.floor(checkoutSeconds / 60)}m {String(checkoutSeconds % 60).padStart(2, '0')}s
          </motion.p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Manual Shelf Checking</span>
            <ClipboardList className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-white mt-1.5">
            {shelfCheckMins} min/shift
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Staff Time Serving Customers</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          </div>
          <p
            className={`font-mono tabular-nums text-2xl font-bold mt-1.5 ${
              stage === 'PRIORITIZED' ? 'text-emerald-400' : 'text-amber-300'
            }`}
          >
            {customersServedPct}%
          </p>
        </div>
      </div>

      {/* Interactive Split: Supermarket Floor Animation + MIS Replenishment Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Supermarket Floor & Checkout Queue Animation */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                SmartMart Floor Activity
              </span>
              <span
                className={`font-mono font-bold ${
                  stage === 'PRIORITIZED' ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                {stage === 'MANUAL'
                  ? 'MANUAL SHELF CHECKS'
                  : stage === 'ANALYZED'
                    ? 'SYNCING POS & SHELVES'
                    : stage === 'REPORT_READY'
                      ? 'REPORT GENERATED'
                      : 'FAST CHECKOUT ACTIVE'}
              </span>
            </div>

            {/* Zone A: Store Aisles (Employees Checking Shelves vs Restocking) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Supermarket Aisles</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {stage === 'PRIORITIZED' ? '1 staff targeted restock' : '3 staff manually inspecting shelves'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {Array.from({ length: stage === 'PRIORITIZED' ? 1 : 3 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={
                      prefersReducedMotion || stage === 'PRIORITIZED'
                        ? undefined
                        : { x: [0, 6, 0] }
                    }
                    transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.2 }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      stage === 'PRIORITIZED'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{stage === 'PRIORITIZED' ? 'Priority Restock' : `Staff #${idx + 1} Checking`}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Zone B: Checkout Counters */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Checkout Counters</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {stage === 'PRIORITIZED' ? '4 Cashiers Active · Queue Clear' : '1 Cashier Active · Long Queue'}
                </span>
              </div>

              {/* Animated Customer Carts */}
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: stage === 'PRIORITIZED' ? 2 : 6 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      stage === 'PRIORITIZED'
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                ))}
                {stage === 'PRIORITIZED' && (
                  <span className="text-xs font-semibold text-emerald-400 ml-1">
                    Customers move smoothly through checkout!
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {stage === 'PRIORITIZED'
              ? 'With MIS handling low-stock detection automatically, staff spend less time walking aisles and more time serving shoppers at checkout.'
              : 'Right now employees waste hours manually counting shelves while checkout lines pile up.'}
          </p>
        </div>

        {/* Right: MIS Analysis & Replenishment Priority Report */}
        <div className="lg:col-span-6 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] text-amber-300 block">
                  MIS REPLENISHMENT ENGINE
                </span>
                <h4 className="font-display text-base font-bold text-white mt-0.5">
                  Sales & Inventory Analysis Report
                </h4>
              </div>
              {stage !== 'MANUAL' && (
                <span className="font-mono text-xs text-sky-300 font-semibold">
                  POS + STOCK SYNCED
                </span>
              )}
            </div>

            {stage === 'MANUAL' && (
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <Database className="w-7 h-7 text-slate-500 mx-auto" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-200">
                  No MIS Report Generated Yet
                </p>
                <p className="text-xs text-slate-400">
                  Click “1. Analyze Sales & Inventory Data” above to let MIS scan SmartMart’s checkout sales and stock levels.
                </p>
              </div>
            )}

            {stage === 'ANALYZED' && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 rounded-xl bg-sky-950/50 border border-sky-500/40 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-sky-200">
                  <span className="font-semibold">Analyzing 1,420 POS receipts & shelf balances...</span>
                  <span className="font-mono font-bold">3 LOW ITEMS FOUND</span>
                </div>
                <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sky-400 rounded-full"
                    initial={{ width: '10%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                  />
                </div>
                <p className="text-xs text-slate-300">
                  Data ready! Generate the replenishment report to highlight which items need restocking first.
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {(stage === 'REPORT_READY' || stage === 'PRIORITIZED') && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5"
                >
                  {REPLENISHMENT_REPORT.map((row, idx) => (
                    <motion.div
                      key={row.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: prefersReducedMotion ? 0 : idx * 0.08 }}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        stage === 'PRIORITIZED'
                          ? 'bg-emerald-950/40 border-emerald-500/40'
                          : 'bg-slate-900 border-amber-500/40'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{row.product}</p>
                        <p className="font-mono text-[11px] text-slate-400">
                          {row.aisle} · Only {row.left} left
                        </p>
                      </div>
                      <span
                        className={`font-mono text-xs font-bold ${
                          stage === 'PRIORITIZED' ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {stage === 'PRIORITIZED' ? 'RESTOCKED' : row.priority}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
            <span>Workflow:</span>
            <span className="font-mono text-[11px] text-slate-400 inline-flex items-center gap-1">
              Data <ArrowRight className="w-3 h-3" aria-hidden="true" /> Report{' '}
              <ArrowRight className="w-3 h-3" aria-hidden="true" /> Fast Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
