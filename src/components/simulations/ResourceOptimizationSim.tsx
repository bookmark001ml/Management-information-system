import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Croissant,
  CakeSlice,
  Wheat,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Minus,
  Radar,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface BakeryLine {
  id: 'bread' | 'cakes' | 'pastries';
  name: string;
  unit: string;
  icon: typeof Wheat;
  predictedDemand: number;
  unplannedQty: number;
  flourPerUnitKg: number;
  butterPerUnitKg: number;
  sugarPerUnitKg: number;
}

const LINES: BakeryLine[] = [
  {
    id: 'bread',
    name: 'Bread',
    unit: 'loaves',
    icon: Wheat,
    predictedDemand: 85,
    unplannedQty: 120,
    flourPerUnitKg: 0.4,
    butterPerUnitKg: 0.04,
    sugarPerUnitKg: 0.02,
  },
  {
    id: 'cakes',
    name: 'Cakes',
    unit: 'cakes',
    icon: CakeSlice,
    predictedDemand: 24,
    unplannedQty: 40,
    flourPerUnitKg: 0.35,
    butterPerUnitKg: 0.25,
    sugarPerUnitKg: 0.3,
  },
  {
    id: 'pastries',
    name: 'Pastries',
    unit: 'pcs',
    icon: Croissant,
    predictedDemand: 110,
    unplannedQty: 160,
    flourPerUnitKg: 0.12,
    butterPerUnitKg: 0.08,
    sugarPerUnitKg: 0.05,
  },
];

export function ResourceOptimizationSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [quantities, setQuantities] = useState<Record<'bread' | 'cakes' | 'pastries', number>>({
    bread: 120,
    cakes: 40,
    pastries: 160,
  });
  const [wonShown, setWonShown] = useState(false);

  const handleAnalyze = () => {
    soundFx.playPop();
    setAnalyzed(true);
  };

  const checkOptimal = (next: Record<'bread' | 'cakes' | 'pastries', number>) => {
    const exact = LINES.every(
      (line) => Math.abs(next[line.id] - line.predictedDemand) <= 5
    );
    if (exact) {
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(21000);
      } else {
        soundFx.playVictory();
      }
    } else {
      soundFx.playClick();
    }
  };

  const adjustQty = (id: 'bread' | 'cakes' | 'pastries', delta: number) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    const next = {
      ...quantities,
      [id]: Math.max(10, Math.min(180, quantities[id] + delta)),
    };
    setQuantities(next);
    checkOptimal(next);
  };

  const handleApplySchedule = () => {
    setAnalyzed(true);
    const ideal = { bread: 85, cakes: 24, pastries: 110 };
    setQuantities(ideal);
    checkOptimal(ideal);
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setQuantities({ bread: 120, cakes: 40, pastries: 160 });
  };

  // Compute total excess units & required ingredients
  const totalExcess = LINES.reduce(
    (sum, l) => sum + Math.max(0, quantities[l.id] - l.predictedDemand),
    0
  );
  const totalPlanned = LINES.reduce((sum, l) => sum + quantities[l.id], 0);
  const totalDemand = LINES.reduce((sum, l) => sum + l.predictedDemand, 0);

  const flourKg = Math.round(
    LINES.reduce((s, l) => s + quantities[l.id] * l.flourPerUnitKg, 0)
  );
  const butterKg = Math.round(
    LINES.reduce((s, l) => s + quantities[l.id] * l.butterPerUnitKg, 0)
  );
  const sugarKg = Math.round(
    LINES.reduce((s, l) => s + quantities[l.id] * l.sugarPerUnitKg, 0)
  );

  const wastePct = Math.min(
    100,
    Math.round((totalExcess / Math.max(1, totalPlanned)) * 100)
  );
  const isOptimized = analyzed && totalExcess <= 12 && totalPlanned >= totalDemand - 12;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            BREAD, CAKES & PASTRIES · PRODUCTION & MATERIAL ALLOCATION
          </span>
          <h3 className="font-display text-lg font-bold">
            {isOptimized
              ? 'Schedules & Ingredients Adjusted! Excess Waste Slashed (+NPR 21,000)'
              : 'Analyze Past Sales, Predict Demand & Adjust Production Quantities'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!analyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyze}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <Radar className="w-4 h-4" aria-hidden="true" />
              <span>1. Analyze Past Sales with MIS</span>
            </motion.button>
          )}

          {analyzed && !isOptimized && (
            <button
              type="button"
              onClick={handleApplySchedule}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>2. Apply MIS Schedule & Materials</span>
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

      {/* MIS Prediction Banner */}
      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-sky-950/60 border border-sky-500/40 rounded-xl px-4 py-3 text-xs text-sky-200 flex flex-wrap items-center justify-between gap-3"
          >
            <span>
              <strong>MIS Demand Forecast:</strong> Today’s past sales trend predicts{' '}
              <strong className="text-white">85 Bread</strong>,{' '}
              <strong className="text-white">24 Cakes</strong>, and{' '}
              <strong className="text-white">110 Pastries</strong>.
            </span>
            <span className="font-mono text-sky-300 font-semibold">
              Suggested Materials: 46 kg Flour · 18 kg Butter · 14 kg Sugar
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Production Lines + Material Wastage Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Bread, Cakes, Pastries Schedule Controls */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LINES.map((line) => {
            const Icon = line.icon;
            const qty = quantities[line.id];
            const excess = Math.max(0, qty - line.predictedDemand);
            const matched = analyzed && Math.abs(qty - line.predictedDemand) <= 5;
            const barMax = 160;

            return (
              <div
                key={line.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  matched
                    ? 'bg-emerald-950/35 border-emerald-500/60'
                    : excess > 10
                      ? 'bg-slate-950 border-rose-500/50'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span className="font-display text-sm font-bold text-white">
                        {line.name}
                      </span>
                    </div>
                    {matched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" aria-hidden="true" />
                    )}
                  </div>

                  {/* Animated Production vs Predicted Demand Bars */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Planned Bake</span>
                      <span className="text-white font-bold">
                        {qty} {line.unit}
                      </span>
                    </div>
                    <div className="h-5 bg-slate-900 rounded-md p-0.5 flex overflow-hidden">
                      <motion.div
                        className={`h-full rounded-l ${
                          matched ? 'bg-emerald-500' : 'bg-sky-500'
                        }`}
                        animate={{
                          width: `${Math.min(100, (Math.min(qty, line.predictedDemand) / barMax) * 100)}%`,
                        }}
                        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                      />
                      {excess > 0 && (
                        <motion.div
                          className="h-full bg-rose-500 rounded-r ml-0.5"
                          animate={{
                            width: `${Math.min(100, (excess / barMax) * 100)}%`,
                          }}
                          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                        />
                      )}
                    </div>

                    <p className="font-mono text-[10px] text-slate-400">
                      {analyzed
                        ? `MIS Target: ${line.predictedDemand} (${excess > 0 ? `+${excess} excess` : 'Exact'})`
                        : `Unadjusted: ${excess} excess wasted`}
                    </p>
                  </div>
                </div>

                {/* Adjust Production Quantity */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => adjustQty(line.id, -5)}
                    aria-label={`Decrease ${line.name} production`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {qty} {line.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustQty(line.id, 5)}
                    aria-label={`Increase ${line.name} production`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Ingredient Allocation & Wastage Drop Meter */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Allocated Ingredients
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  isOptimized ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {wastePct}% Excess Waste
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Flour Allocated</span>
                <span className="text-white font-bold">{flourKg} kg</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Butter Allocated</span>
                <span className="text-white font-bold">{butterKg} kg</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-900">
                <span className="text-slate-400">Sugar Allocated</span>
                <span className="text-white font-bold">{sugarKg} kg</span>
              </div>
            </div>

            {/* Animated Wastage Decrease Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-400">Material & Food Wastage</span>
                <span className={isOptimized ? 'text-emerald-400' : 'text-rose-400'}>
                  {totalExcess} excess units
                </span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${
                    isOptimized ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  animate={{ width: `${Math.max(4, wastePct * 2.5)}%` }}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
            {isOptimized
              ? 'Manager aligned production schedules and raw materials to predicted demand—excess production and material wastage dropped!'
              : 'Click Analyze Past Sales with MIS, then adjust Bread, Cakes & Pastries schedules to cut excess waste.'}
          </p>
        </div>
      </div>
    </div>
  );
}
