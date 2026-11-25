import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Zap,
  Lightbulb,
  Wind,
  Radar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const BRANCHES = [
  { id: 'lazimpat', name: 'Lazimpat Branch', baseKwh: 420, spike: false },
  { id: 'patan', name: 'Patan Branch', baseKwh: 390, spike: false },
  { id: 'baneshwor', name: 'Baneshwor Branch', baseKwh: 890, spike: true },
  { id: 'boudha', name: 'Boudha Branch', baseKwh: 410, spike: false },
];

export function CompResourcePlanningSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scanned, setScanned] = useState(false);
  const [lightingScheduled, setLightingScheduled] = useState(false);
  const [acScheduled, setAcScheduled] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const optimized = lightingScheduled && acScheduled;

  const baneshworKwh =
    890 - (lightingScheduled ? 210 : 0) - (acScheduled ? 250 : 0);
  const monthlyBillNpr =
    185000 - (lightingScheduled ? 38000 : 0) - (acScheduled ? 46000 : 0);

  const handleAnalyzePower = () => {
    soundFx.playPop();
    setScanned(true);
  };

  const toggleSchedule = (type: 'lighting' | 'ac') => {
    if (!scanned) {
      soundFx.playAlert();
      return;
    }
    const nextLight = type === 'lighting' ? !lightingScheduled : lightingScheduled;
    const nextAc = type === 'ac' ? !acScheduled : acScheduled;
    setLightingScheduled(nextLight);
    setAcScheduled(nextAc);

    if (nextLight && nextAc) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(19000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setScanned(false);
    setLightingScheduled(false);
    setAcScheduled(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART ENERGY MONITOR · OPERATING COST REDUCTION
          </span>
          <h3 className="font-display text-lg font-bold">
            {optimized
              ? 'Schedules Optimized! Operating Costs Cut by NPR 84,000/mo (+NPR 19,000)'
              : 'Spot High Electricity Usage Across Branches & Cut Operating Costs'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!scanned && (
            <motion.button
              type="button"
              onClick={handleAnalyzePower}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Branch Electricity Usage</span>
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
        {/* Left: Branch Electricity Bars */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Daily Branch Electricity Consumption (kWh)
            </span>
            <span
              className={`font-mono font-bold ${
                optimized ? 'text-emerald-400' : scanned ? 'text-rose-400' : 'text-slate-500'
              }`}
            >
              {optimized
                ? 'ALL BRANCHES NORMAL'
                : scanned
                  ? 'BANESHWOR SPIKE DETECTED'
                  : 'SCAN TO AUDIT'}
            </span>
          </div>

          <div className="space-y-3.5">
            {BRANCHES.map((b) => {
              const kwh = b.spike ? baneshworKwh : b.baseKwh;
              const isHigh = scanned && b.spike && !optimized;
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isHigh
                      ? 'bg-rose-950/35 border-rose-500/60'
                      : b.spike && optimized
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white inline-flex items-center gap-1.5">
                      <Zap
                        className={`w-3.5 h-3.5 ${
                          isHigh ? 'text-rose-400' : 'text-amber-400'
                        }`}
                        aria-hidden="true"
                      />
                      {b.name}
                    </span>
                    <span
                      className={`font-mono tabular-nums font-bold inline-flex items-center gap-1 ${
                        isHigh
                          ? 'text-rose-400'
                          : b.spike && optimized
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                      }`}
                    >
                      {isHigh && <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />}
                      {kwh} kWh/day
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      className={`h-full rounded-full ${
                        isHigh
                          ? 'bg-rose-500'
                          : b.spike && optimized
                            ? 'bg-emerald-500'
                            : 'bg-sky-500'
                      }`}
                      animate={{ width: `${Math.min(100, (kwh / 950) * 100)}%` }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 170, damping: 20 }
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Lighting & AC Schedule Controls + Operating Cost Meter */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                BANESHWOR BRANCH SCHEDULE CONTROLS
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Adjust Lighting & AC Schedules
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {scanned
                  ? 'Baneshwor leaves full lighting & AC running during closed night hours. Toggle both schedules below:'
                  : 'Run Step 1 to identify which branch has unusually high electricity consumption.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleSchedule('lighting')}
              className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                lightingScheduled
                  ? 'bg-emerald-950/60 border-emerald-400 text-white'
                  : scanned
                    ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Auto-Dim Closing Hours Lighting</p>
                  <p className="text-[11px] text-slate-400">Saves 210 kWh/day</p>
                </div>
              </div>
              {lightingScheduled && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleSchedule('ac')}
              className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                acScheduled
                  ? 'bg-emerald-950/60 border-emerald-400 text-white'
                  : scanned
                    ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Set Smart AC Off-Peak Timer</p>
                  <p className="text-[11px] text-slate-400">Saves 250 kWh/day</p>
                </div>
              </div>
              {acScheduled && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </button>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">Baneshwor Monthly Power Cost</span>
              <span
                className={`font-mono tabular-nums text-base font-bold ${
                  optimized ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                NPR {monthlyBillNpr.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700">
            {optimized
              ? 'Lower operating costs let SmartMart offer better value while protecting profit margins.'
              : 'Toggle both lighting and AC timers to bring Baneshwor’s energy cost down.'}
          </p>
        </div>
      </div>
    </div>
  );
}
