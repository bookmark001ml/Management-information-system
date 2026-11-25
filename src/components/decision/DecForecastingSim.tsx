import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  Droplets,
  Wheat,
  Candy,
  Radar,
  Plus,
  Minus,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface FestiveItem {
  id: 'oil' | 'rice' | 'sweets';
  name: string;
  unit: string;
  icon: typeof Droplets;
  normalStock: number;
  dashainForecast: number;
}

const FESTIVE_ITEMS: FestiveItem[] = [
  { id: 'oil', name: 'Cooking Oil', unit: 'crates', icon: Droplets, normalStock: 40, dashainForecast: 110 },
  { id: 'rice', name: 'Basmati Rice', unit: 'sacks', icon: Wheat, normalStock: 50, dashainForecast: 140 },
  { id: 'sweets', name: 'Festive Sweets', unit: 'boxes', icon: Candy, normalStock: 35, dashainForecast: 120 },
];

export function DecForecastingSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [forecasted, setForecasted] = useState(false);
  const [orders, setOrders] = useState<Record<'oil' | 'rice' | 'sweets', number>>({
    oil: 40,
    rice: 50,
    sweets: 35,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const isPrepared =
    forecasted &&
    FESTIVE_ITEMS.every((item) => orders[item.id] >= item.dashainForecast - 5);

  const handleRunForecast = () => {
    soundFx.playPop();
    setForecasted(true);
  };

  const adjustOrder = (id: 'oil' | 'rice' | 'sweets', delta: number) => {
    if (!forecasted) {
      soundFx.playAlert();
      return;
    }
    soundFx.playClick();
    setConfirmed(false);
    setOrders((prev) => ({
      ...prev,
      [id]: Math.max(20, Math.min(180, prev[id] + delta)),
    }));
  };

  const handleApplyDashainPlan = () => {
    setForecasted(true);
    setOrders({ oil: 110, rice: 140, sweets: 120 });
    setConfirmed(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(21000);
    }
  };

  const handleConfirm = () => {
    if (!isPrepared) {
      soundFx.playAlert();
      return;
    }
    setConfirmed(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(21000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setForecasted(false);
    setOrders({ oil: 40, rice: 50, sweets: 35 });
    setConfirmed(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            DASHAIN FESTIVAL APPROACHING · PREDICTIVE DEMAND FORECAST
          </span>
          <h3 className="font-display text-lg font-bold">
            {confirmed
              ? 'Dashain Inventory Planned! Cooking Oil, Rice & Sweets Ready (+NPR 21,000)'
              : 'Analyze Past Dashain Sales & Plan Festive Inventory'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!forecasted && (
            <motion.button
              type="button"
              onClick={handleRunForecast}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Previous Dashain Sales</span>
            </motion.button>
          )}
          {forecasted && !confirmed && (
            <button
              type="button"
              onClick={handleApplyDashainPlan}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Apply Dashain Stock Plan</span>
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

      <AnimatePresence>
        {forecasted && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 text-xs text-sky-200"
          >
            <strong>MIS Dashain Forecast:</strong> Previous festival records predict 2.8× demand spikes — stock at least <strong>110 Oil crates</strong>, <strong>140 Rice sacks</strong>, and <strong>120 Sweets boxes</strong>.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FESTIVE_ITEMS.map((item) => {
          const Icon = item.icon;
          const qty = orders[item.id];
          const ready = forecasted && qty >= item.dashainForecast - 5;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${
                ready
                  ? 'bg-emerald-950/35 border-emerald-500/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-white inline-flex items-center gap-2">
                    <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    {item.name}
                  </span>
                  {ready && <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Your Order</span>
                    <span className="text-white font-bold">
                      {qty} {item.unit}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      className={`h-full rounded-full ${ready ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      animate={{ width: `${Math.min(100, (qty / 160) * 100)}%` }}
                      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {forecasted
                      ? `Dashain Estimate: ${item.dashainForecast} ${item.unit}`
                      : `Normal Week: ${item.normalStock} ${item.unit}`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => adjustOrder(item.id, -10)}
                  aria-label={`Decrease ${item.name} order`}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="font-mono tabular-nums text-sm font-bold text-amber-300">
                  {qty} {item.unit}
                </span>
                <button
                  type="button"
                  onClick={() => adjustOrder(item.id, 10)}
                  aria-label={`Increase ${item.name} order`}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-slate-300">
          {confirmed
            ? 'Dashain inventory is stocked! SmartMart is ready for peak festival demand without shortages.'
            : 'Adjust Cooking Oil, Rice, and Sweets to meet the Dashain demand estimate, then confirm your inventory plan.'}
        </p>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
        >
          {confirmed ? 'Dashain Plan Confirmed' : 'Confirm Festive Inventory'}
        </button>
      </div>
    </div>
  );
}
