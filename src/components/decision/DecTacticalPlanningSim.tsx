import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  FileBarChart2,
  Megaphone,
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

interface BranchPlan {
  id: 'lazimpat' | 'patan' | 'baneshwor';
  name: string;
  pastMonthlyAvg: number;
  recommendedTarget: number;
  recommendedPromo: number;
}

const BRANCHES: BranchPlan[] = [
  { id: 'lazimpat', name: 'Lazimpat Branch', pastMonthlyAvg: 22, recommendedTarget: 25, recommendedPromo: 4 },
  { id: 'patan', name: 'Patan Branch', pastMonthlyAvg: 18, recommendedTarget: 20, recommendedPromo: 3 },
  { id: 'baneshwor', name: 'Baneshwor Branch', pastMonthlyAvg: 14, recommendedTarget: 15, recommendedPromo: 3 },
];

export function DecTacticalPlanningSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [reportsLoaded, setReportsLoaded] = useState(false);
  const [targets, setTargets] = useState<Record<'lazimpat' | 'patan' | 'baneshwor', number>>({
    lazimpat: 18,
    patan: 15,
    baneshwor: 12,
  });
  const [promos, setPromos] = useState<Record<'lazimpat' | 'patan' | 'baneshwor', number>>({
    lazimpat: 1,
    patan: 1,
    baneshwor: 1,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const totalMonthlyTarget = targets.lazimpat + targets.patan + targets.baneshwor; // goal = 60L/mo (=720L annual)
  const totalPromo = promos.lazimpat + promos.patan + promos.baneshwor; // goal = 10L
  const isAligned =
    reportsLoaded &&
    totalMonthlyTarget >= 60 &&
    totalPromo >= 9 &&
    totalPromo <= 12 &&
    BRANCHES.every((b) => targets[b.id] >= b.recommendedTarget - 2);

  const handleLoadReports = () => {
    soundFx.playPop();
    setReportsLoaded(true);
  };

  const adjustTarget = (id: 'lazimpat' | 'patan' | 'baneshwor', delta: number) => {
    if (!reportsLoaded) {
      soundFx.playAlert();
      return;
    }
    soundFx.playClick();
    setConfirmed(false);
    setTargets((prev) => ({
      ...prev,
      [id]: Math.max(10, Math.min(35, prev[id] + delta)),
    }));
  };

  const adjustPromo = (id: 'lazimpat' | 'patan' | 'baneshwor', delta: number) => {
    if (!reportsLoaded) {
      soundFx.playAlert();
      return;
    }
    soundFx.playClick();
    setConfirmed(false);
    setPromos((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(6, prev[id] + delta)),
    }));
  };

  const handleApplyTacticalPlan = () => {
    setReportsLoaded(true);
    setTargets({ lazimpat: 25, patan: 20, baneshwor: 15 });
    setPromos({ lazimpat: 4, patan: 3, baneshwor: 3 });
    setConfirmed(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(18000);
    }
  };

  const handleConfirm = () => {
    if (!reportsLoaded || !isAligned) {
      soundFx.playAlert();
      return;
    }
    setConfirmed(true);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(18000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setReportsLoaded(false);
    setTargets({ lazimpat: 18, patan: 15, baneshwor: 12 });
    setPromos({ lazimpat: 1, patan: 1, baneshwor: 1 });
    setConfirmed(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            ANNUAL TARGET: NPR 720L (NPR 60L / MONTH) · REGIONAL TACTICAL PLANNING
          </span>
          <h3 className="font-display text-lg font-bold">
            {confirmed
              ? 'Monthly Branch Targets & Promo Budgets Set! (+NPR 18,000)'
              : 'Set Monthly Branch Targets & Allocate Promotional Budgets'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!reportsLoaded && (
            <motion.button
              type="button"
              onClick={handleLoadReports}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileBarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. View Previous Branch Sales Reports</span>
            </motion.button>
          )}
          {reportsLoaded && !confirmed && (
            <button
              type="button"
              onClick={handleApplyTacticalPlan}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Megaphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Apply MIS Branch Plan</span>
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

      {/* 3 Branch Tactical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BRANCHES.map((branch) => {
          const tgt = targets[branch.id];
          const promo = promos[branch.id];
          const ready =
            reportsLoaded &&
            tgt >= branch.recommendedTarget - 1 &&
            promo >= branch.recommendedPromo;

          return (
            <div
              key={branch.id}
              className={`rounded-xl border p-4 space-y-4 transition-colors ${
                ready
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-white">{branch.name}</h4>
                {ready && <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
                {reportsLoaded ? (
                  <span className="text-sky-300">
                    Past Avg: NPR {branch.pastMonthlyAvg}L/mo · Goal: {branch.recommendedTarget}L (Promo {branch.recommendedPromo}L)
                  </span>
                ) : (
                  <span className="text-slate-500">Load past sales reports to view benchmark</span>
                )}
              </div>

              {/* Monthly Sales Target Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Monthly Target</span>
                  <span className="font-mono tabular-nums font-bold text-amber-300">
                    NPR {tgt}L
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => adjustTarget(branch.id, -1)}
                    aria-label={`Decrease ${branch.name} monthly target`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(tgt / 35) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustTarget(branch.id, 1)}
                    aria-label={`Increase ${branch.name} monthly target`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Promo Budget Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Promo Budget</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400">
                    NPR {promo}L
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => adjustPromo(branch.id, -1)}
                    aria-label={`Decrease ${branch.name} promo budget`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(promo / 6) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustPromo(branch.id, 1)}
                    aria-label={`Increase ${branch.name} promo budget`}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary & Confirm */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 font-mono tabular-nums text-xs">
          <div>
            <span className="text-slate-400 mr-1.5">COMBINED MONTHLY TARGET:</span>
            <span className={totalMonthlyTarget >= 60 ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
              NPR {totalMonthlyTarget}L / 60L
            </span>
          </div>
          <div>
            <span className="text-slate-400 mr-1.5">PROMO BUDGET ALLOCATED:</span>
            <span className="text-sky-300 font-bold">NPR {totalPromo}L</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
        >
          {confirmed ? 'Tactical Plan Confirmed' : 'Confirm Monthly Targets & Budgets'}
        </button>
      </div>
    </div>
  );
}
