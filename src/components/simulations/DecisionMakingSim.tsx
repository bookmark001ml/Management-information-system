import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Milk,
  Croissant,
  CakeSlice,
  Coffee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface ProductMetric {
  id: string;
  name: string;
  icon: typeof Milk;
  soldPerHour: number;
  dailyDemand: number;
  currentOrder: number;
  color: string;
}

const OTHER_PRODUCTS: ProductMetric[] = [
  {
    id: 'croissant',
    name: 'Croissants',
    icon: Croissant,
    soldPerHour: 14,
    dailyDemand: 24,
    currentOrder: 25,
    color: 'bg-amber-500',
  },
  {
    id: 'brownie',
    name: 'Walnut Brownies',
    icon: CakeSlice,
    soldPerHour: 9,
    dailyDemand: 18,
    currentOrder: 20,
    color: 'bg-sky-500',
  },
  {
    id: 'espresso',
    name: 'Masala Chai',
    icon: Coffee,
    soldPerHour: 12,
    dailyDemand: 22,
    currentOrder: 24,
    color: 'bg-emerald-500',
  },
];

const MILK_DEMAND = 45;
const OLD_MILK_ORDER = 20;

export function DecisionMakingSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [milkOrder, setMilkOrder] = useState(OLD_MILK_ORDER);
  const [hourTick, setHourTick] = useState(0); // 0..6 animated sale ticks
  const [decisionApplied, setDecisionApplied] = useState<'NONE' | 'OLD' | 'INCREASED'>('NONE');
  const [wonShown, setWonShown] = useState(false);

  // Continuous live sales pulse showing milk selling much faster than other products
  useEffect(() => {
    const timer = setInterval(() => {
      setHourTick((t) => (t + 1) % 7);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  const milkSoldPct = Math.min(100, Math.round(((hourTick + 1) / 4) * 100));
  const milkStockLeft = Math.max(0, milkOrder - Math.round((MILK_DEMAND * (hourTick + 1)) / 6));
  const isEnoughMilk = milkOrder >= 42;

  const adjustMilk = (delta: number) => {
    soundFx.playClick();
    setDecisionApplied('NONE');
    setMilkOrder((prev) => Math.max(15, Math.min(55, prev + delta)));
  };

  const handleConfirmDecision = () => {
    if (isEnoughMilk) {
      setDecisionApplied('INCREASED');
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(15000);
      } else {
        soundFx.playVictory();
      }
    } else {
      setDecisionApplied('OLD');
      soundFx.playAlert();
    }
  };

  const handleQuickIncrease = () => {
    soundFx.playPop();
    setMilkOrder(45);
    setDecisionApplied('INCREASED');
    if (!wonShown) {
      setWonShown(true);
      soundFx.playVictory();
      onComplete(15000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setMilkOrder(OLD_MILK_ORDER);
    setDecisionApplied('NONE');
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            LIVE MIS SALES DASHBOARD · KATHMANDU BAKERY
          </span>
          <h3 className="font-display text-lg font-bold">
            {decisionApplied === 'INCREASED'
              ? 'Smart Decision! Milk Order Increased to Match Fast Demand (+NPR 15,000)'
              : 'Spot the Fastest-Selling Product & Adjust Tomorrow’s Order'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {decisionApplied !== 'INCREASED' && (
            <button
              type="button"
              onClick={handleQuickIncrease}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Increase Milk to 45 Crates</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Split: Animated Product Velocity Dashboard + Manager Order Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Live Product Sales Velocity Dashboard */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Live Sales Speed (Bottles / Trays per Hour)
            </span>
            <span className="font-mono text-rose-400 font-bold inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              MILK SELLING 2.5× FASTER
            </span>
          </div>

          <div className="space-y-4">
            {/* Highlighted Fast-Moving Product: Fresh Milk */}
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-400/60 relative overflow-hidden">
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent pointer-events-none"
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              )}

              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                    <Milk className="w-4 h-4 text-sky-300" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Fresh Milk (1L Bottles)
                    </span>
                    <span className="font-mono text-[11px] text-amber-300">
                      Demand: 45 crates/day · Fastest item!
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-xs font-bold ${
                    milkStockLeft === 0 && !isEnoughMilk ? 'text-rose-400' : 'text-sky-300'
                  }`}
                >
                  {milkStockLeft === 0 && !isEnoughMilk
                    ? 'SOLD OUT EARLY ▲'
                    : `${milkStockLeft} crates left`}
                </span>
              </div>

              {/* Animated Fast Sales Bar */}
              <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 relative z-10">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                  animate={{ width: `${milkSoldPct}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 20 }
                  }
                />
              </div>

              {/* Animated Bottles Flying Off Shelf */}
              <div className="mt-3 flex items-center gap-1.5 overflow-hidden relative z-10">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const soldOut = idx < Math.round((milkSoldPct / 100) * 10);
                  return (
                    <motion.div
                      key={idx}
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : soldOut
                            ? { y: -4, opacity: 0.28, scale: 0.9 }
                            : { y: 0, opacity: 1, scale: 1 }
                      }
                      transition={{ duration: 0.25 }}
                      className={`flex-1 h-6 rounded flex items-center justify-center border ${
                        soldOut
                          ? 'bg-slate-800/40 border-slate-800 text-slate-600'
                          : 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                      }`}
                    >
                      <Milk className="w-3.5 h-3.5" aria-hidden="true" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Other Products Moving at Normal Pace */}
            <div className="space-y-2.5">
              {OTHER_PRODUCTS.map((prod) => {
                const Icon = prod.icon;
                const steadyPct = Math.round(((hourTick + 2) / 10) * 75);
                return (
                  <div
                    key={prod.id}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-900/70 border border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="inline-flex items-center gap-2 font-medium text-slate-300">
                        <Icon className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        {prod.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {prod.soldPerHour}/hr · Stock OK
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${prod.color} opacity-75`}
                        animate={{ width: `${steadyPct}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Manager Decision Panel */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGER DECISION
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Set Tomorrow’s Milk Order
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Dashboard insight: 20 crates sell out before noon. Increase the order to meet demand!
              </p>
            </div>

            {/* Milk Crate Visual Counter */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Milk Crates Ordered</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustMilk(-5)}
                    aria-label="Decrease milk order by 5 crates"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="font-mono tabular-nums text-2xl font-bold text-sky-300 w-12 text-center">
                    {milkOrder}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustMilk(5)}
                    aria-label="Increase milk order by 5 crates"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Animated Delivery Truck Crates Preview */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  Morning Delivery:
                </span>
                <span
                  className={`font-mono font-bold ${
                    isEnoughMilk ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {milkOrder} / {MILK_DEMAND} crates needed
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmDecision}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Confirm Milk Order ({milkOrder} Crates)
            </button>
          </div>

          {/* Decision Outcome Feedback */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              decisionApplied === 'INCREASED'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : decisionApplied === 'OLD'
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            {decisionApplied === 'INCREASED' ? (
              <span className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Because the MIS dashboard highlighted fast milk sales, increasing the order prevented stockouts and boosted daily sales!
                </span>
              </span>
            ) : decisionApplied === 'OLD' ? (
              <span className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {milkOrder} crates is too low! Milk sold out early while customers walked away. Increase the order to at least 45 crates.
                </span>
              </span>
            ) : (
              <span>
                Watch the live dashboard: milk drains much faster than croissants, brownies, or chai. Adjust the milk order and confirm!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
