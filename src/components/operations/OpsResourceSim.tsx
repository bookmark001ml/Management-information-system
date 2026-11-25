import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Wheat,
  CakeSlice,
  Croissant,
  Radar,
  SlidersHorizontal,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface BakeryProduct {
  id: 'bread' | 'cakes' | 'pastries';
  name: string;
  unit: string;
  icon: typeof Wheat;
  estimatedDemand: number;
  initialBake: number;
  flourKg: number;
  butterKg: number;
  sugarKg: number;
}

const BAKERY_ITEMS: BakeryProduct[] = [
  {
    id: 'bread',
    name: 'Bread',
    unit: 'loaves',
    icon: Wheat,
    estimatedDemand: 90,
    initialBake: 130,
    flourKg: 0.4,
    butterKg: 0.04,
    sugarKg: 0.02,
  },
  {
    id: 'cakes',
    name: 'Cakes',
    unit: 'cakes',
    icon: CakeSlice,
    estimatedDemand: 25,
    initialBake: 45,
    flourKg: 0.35,
    butterKg: 0.25,
    sugarKg: 0.3,
  },
  {
    id: 'pastries',
    name: 'Pastries',
    unit: 'pcs',
    icon: Croissant,
    estimatedDemand: 115,
    initialBake: 165,
    flourKg: 0.12,
    butterKg: 0.08,
    sugarKg: 0.05,
  },
];

export function OpsResourceSim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [forecastReady, setForecastReady] = useState(false);
  const [schedule, setSchedule] = useState<Record<'bread' | 'cakes' | 'pastries', number>>({
    bread: 130,
    cakes: 45,
    pastries: 165,
  });
  const [rewarded, setRewarded] = useState(false);

  const checkSchedule = (next: Record<'bread' | 'cakes' | 'pastries', number>) => {
    const balanced = BAKERY_ITEMS.every(
      (item) => Math.abs(next[item.id] - item.estimatedDemand) <= 5
    );
    if (balanced) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(20000);
      }
    } else {
      soundFx.playClick();
    }
  };

  const handleAnalyzePastSales = () => {
    soundFx.playPop();
    setForecastReady(true);
  };

  const adjustSchedule = (id: 'bread' | 'cakes' | 'pastries', delta: number) => {
    if (!forecastReady) {
      soundFx.playAlert();
      return;
    }
    const next = {
      ...schedule,
      [id]: Math.max(10, Math.min(180, schedule[id] + delta)),
    };
    setSchedule(next);
    checkSchedule(next);
  };

  const handleApplySuggested = () => {
    setForecastReady(true);
    const ideal = { bread: 90, cakes: 25, pastries: 115 };
    setSchedule(ideal);
    checkSchedule(ideal);
  };

  const handleReset = () => {
    soundFx.playClick();
    setForecastReady(false);
    setSchedule({ bread: 130, cakes: 45, pastries: 165 });
  };

  const totalExcess = BAKERY_ITEMS.reduce(
    (sum, item) => sum + Math.max(0, schedule[item.id] - item.estimatedDemand),
    0
  );
  const totalScheduled = BAKERY_ITEMS.reduce((sum, item) => sum + schedule[item.id], 0);
  const flourNeeded = Math.round(
    BAKERY_ITEMS.reduce((s, i) => s + schedule[i.id] * i.flourKg, 0)
  );
  const butterNeeded = Math.round(
    BAKERY_ITEMS.reduce((s, i) => s + schedule[i.id] * i.butterKg, 0)
  );
  const sugarNeeded = Math.round(
    BAKERY_ITEMS.reduce((s, i) => s + schedule[i.id] * i.sugarKg, 0)
  );

  const wastePct = Math.round((totalExcess / Math.max(1, totalScheduled)) * 100);
  const isOptimal = forecastReady && totalExcess <= 12;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART BAKERY · BREAD, CAKES & PASTRIES
          </span>
          <h3 className="font-display text-lg font-bold">
            {isOptimal
              ? 'Production Schedule Adjusted! Material & Food Wastage Minimized (+NPR 20,000)'
              : 'Estimate Daily Demand & Optimize Material Usage'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!forecastReady && (
            <motion.button
              type="button"
              onClick={handleAnalyzePastSales}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Past Sales & Demand</span>
            </motion.button>
          )}

          {forecastReady && !isOptimal && (
            <button
              type="button"
              onClick={handleApplySuggested}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Apply Suggested Schedule</span>
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
        {forecastReady && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-sky-950/60 border border-sky-500/40 rounded-xl px-4 py-3 text-xs text-sky-200 flex flex-wrap items-center justify-between gap-3"
          >
            <span>
              <strong>MIS Estimated Daily Demand:</strong> 90 Bread · 25 Cakes · 115 Pastries
            </span>
            <span className="font-mono font-semibold text-sky-300">
              Required Ingredients: 59 kg Flour · 19 kg Butter · 15 kg Sugar
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BAKERY_ITEMS.map((item) => {
            const Icon = item.icon;
            const qty = schedule[item.id];
            const excess = Math.max(0, qty - item.estimatedDemand);
            const matched = forecastReady && Math.abs(qty - item.estimatedDemand) <= 5;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  matched
                    ? 'bg-emerald-950/35 border-emerald-500/60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-white">
                      <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      {item.name}
                    </span>
                    {matched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" aria-hidden="true" />
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Schedule</span>
                      <span className="font-bold text-white">
                        {qty} {item.unit}
                      </span>
                    </div>

                    <div className="h-5 bg-slate-900 rounded-md p-0.5 flex overflow-hidden">
                      <motion.div
                        className={`h-full rounded-l ${matched ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        animate={{
                          width: `${Math.min(100, (Math.min(qty, item.estimatedDemand) / 170) * 100)}%`,
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 180, damping: 22 }
                        }
                      />
                      {excess > 0 && (
                        <motion.div
                          className="h-full bg-rose-500 rounded-r ml-0.5"
                          animate={{ width: `${Math.min(100, (excess / 170) * 100)}%` }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 180, damping: 22 }
                          }
                        />
                      )}
                    </div>

                    <p className="font-mono text-[10px] text-slate-400">
                      {forecastReady
                        ? `Suggested: ${item.estimatedDemand} (${excess > 0 ? `+${excess} excess` : 'Balanced'})`
                        : `Over-baking by ${excess} ${item.unit}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => adjustSchedule(item.id, -5)}
                    aria-label={`Decrease ${item.name} schedule`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="font-mono tabular-nums text-xs font-bold text-amber-300">
                    {qty} {item.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustSchedule(item.id, 5)}
                    aria-label={`Increase ${item.name} schedule`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Ingredient Usage & Wastage Meter */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Required Ingredients
              </span>
              <span
                className={`font-mono tabular-nums text-xs font-bold ${
                  isOptimal ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {wastePct}% Wastage
              </span>
            </div>

            <div className="space-y-2.5 font-mono tabular-nums text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Flour</span>
                <span className="text-white font-bold">{flourNeeded} kg</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Butter</span>
                <span className="text-white font-bold">{butterNeeded} kg</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Sugar</span>
                <span className="text-white font-bold">{sugarNeeded} kg</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-400">Excess Production</span>
                <span className={isOptimal ? 'text-emerald-400' : 'text-rose-400'}>
                  {totalExcess} excess units
                </span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${isOptimal ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  animate={{ width: `${Math.max(4, wastePct * 2.5)}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 180, damping: 22 }
                  }
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
            {isOptimal
              ? 'SmartMart bakery matched production schedules and ingredients to daily demand, minimizing waste.'
              : 'Analyze past sales first, then adjust bread, cakes, and pastries to match MIS demand estimates.'}
          </p>
        </div>
      </div>
    </div>
  );
}
