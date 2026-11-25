import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Milk,
  Croissant,
  ShoppingBag,
  Package,
  TrendingUp,
  Plus,
  Minus,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const OTHER_PRODUCTS = [
  { id: 'bread', name: 'Whole Wheat Bread', icon: Croissant, rate: 12, barMax: 68, color: 'bg-amber-500' },
  { id: 'oil', name: 'Sunflower Cooking Oil', icon: ShoppingBag, rate: 8, barMax: 48, color: 'bg-sky-500' },
  { id: 'biscuits', name: 'Digestive Biscuits', icon: Package, rate: 10, barMax: 56, color: 'bg-emerald-500' },
];

const INITIAL_ORDER = 20;
const RECOMMENDED_ORDER = 50;

export function OpsDecisionMakingSim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [milkOrder, setMilkOrder] = useState(INITIAL_ORDER);
  const [pulseTick, setPulseTick] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'LOW' | 'OPTIMAL'>('IDLE');
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPulseTick((t) => (t + 1) % 8);
    }, 750);
    return () => clearInterval(id);
  }, []);

  const milkSoldPct = Math.min(100, Math.round(((pulseTick + 2) / 6) * 100));
  const cratesRemaining = Math.max(0, milkOrder - Math.round((48 * (pulseTick + 1)) / 8));
  const isSufficient = milkOrder >= 45;

  const changeOrder = (delta: number) => {
    soundFx.playClick();
    setStatus('IDLE');
    setMilkOrder((prev) => Math.max(15, Math.min(65, prev + delta)));
  };

  const handleConfirmOrder = () => {
    if (isSufficient) {
      setStatus('OPTIMAL');
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(15000);
      }
    } else {
      setStatus('LOW');
      soundFx.playAlert();
    }
  };

  const handleQuickStock = () => {
    soundFx.playPop();
    setMilkOrder(RECOMMENDED_ORDER);
    setStatus('OPTIMAL');
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(15000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setMilkOrder(INITIAL_ORDER);
    setStatus('IDLE');
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART POS ANALYTICS · STOCKING DECISION
          </span>
          <h3 className="font-display text-lg font-bold">
            {status === 'OPTIMAL'
              ? 'Milk Order Increased! Shelves Stay Stocked All Day (+NPR 15,000)'
              : 'MIS Shows Milk Selling Faster Than Other Products'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {status !== 'OPTIMAL' && (
            <button
              type="button"
              onClick={handleQuickStock}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Set Order to 50 Crates</span>
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
        {/* Left: Live Product Sales Velocity Comparison */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Hourly Sales Speed Across SmartMart Aisles
            </span>
            <span className="font-mono font-bold text-amber-300">
              MILK 3× FASTER TURNOVER
            </span>
          </div>

          <div className="space-y-4">
            {/* Milk Fast-Seller Highlight */}
            <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/50 relative overflow-hidden">
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent pointer-events-none"
                  animate={{ left: ['-20%', '120%'] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                />
              )}

              <div className="flex items-center justify-between mb-2.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                    <Milk className="w-4 h-4 text-sky-300" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Fresh Dairy Milk (1L Packs)
                    </span>
                    <span className="font-mono text-[11px] text-sky-300">
                      32 units/hr · Daily demand: 48 crates
                    </span>
                  </div>
                </div>
                <span
                  className={`font-mono tabular-nums text-xs font-bold ${
                    cratesRemaining === 0 && !isSufficient ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {cratesRemaining === 0 && !isSufficient
                    ? 'OUT OF STOCK'
                    : `${cratesRemaining} crates left`}
                </span>
              </div>

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

              {/* Animated Milk Cartons Moving Off Shelf */}
              <div className="mt-3 grid grid-cols-10 gap-1.5 relative z-10">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const picked = idx < Math.round((milkSoldPct / 100) * 10);
                  return (
                    <motion.div
                      key={idx}
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : picked
                            ? { y: -3, opacity: 0.25, scale: 0.92 }
                            : { y: 0, opacity: 1, scale: 1 }
                      }
                      transition={{ duration: 0.2 }}
                      className={`h-7 rounded flex items-center justify-center border ${
                        picked
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

            {/* Slower Moving Supermarket Items */}
            <div className="space-y-2.5">
              {OTHER_PRODUCTS.map((item) => {
                const Icon = item.icon;
                const widthPct = Math.round(((pulseTick + 3) / 10) * item.barMax);
                return (
                  <div
                    key={item.id}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-900/70 border border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="inline-flex items-center gap-2 font-medium text-slate-300">
                        <Icon className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        {item.name}
                      </span>
                      <span className="font-mono tabular-nums text-[11px] text-slate-400">
                        {item.rate} units/hr · Shelf steady
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color} opacity-75`}
                        animate={{ width: `${widthPct}%` }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: User Decision Controls to Increase Milk Orders */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGER ACTION
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Decide Tomorrow’s Milk Order
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                20 crates sell out early while bread, oil, and biscuits stay well stocked. Increase the milk order to meet demand.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Milk Order Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeOrder(-5)}
                    aria-label="Decrease milk crates by 5"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="font-mono tabular-nums text-2xl font-bold text-sky-300 w-14 text-center">
                    {milkOrder}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeOrder(5)}
                    aria-label="Increase milk crates by 5"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  Daily Requirement:
                </span>
                <span
                  className={`font-mono tabular-nums font-bold ${
                    isSufficient ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {milkOrder} / 48 crates
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Confirm Milk Order ({milkOrder} Crates)
            </button>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              status === 'OPTIMAL'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : status === 'LOW'
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            {status === 'OPTIMAL' ? (
              <span className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  SmartMart stocked {milkOrder} milk crates based on live sales speed—preventing afternoon stockouts and growing revenue.
                </span>
              </span>
            ) : status === 'LOW' ? (
              <span className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {milkOrder} crates is below the 48-crate demand! Increase the milk order to at least 45 crates and confirm again.
                </span>
              </span>
            ) : (
              <span>
                Use the + button to raise milk orders from 20 crates toward 50 crates, then confirm your decision.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
