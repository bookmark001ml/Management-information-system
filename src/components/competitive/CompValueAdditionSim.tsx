import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PackagePlus,
  ShoppingBasket,
  Radar,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const WEEKLY_BUNDLES = [
  {
    id: 'family-essentials',
    name: 'Weekly Family Essentials Box',
    contents: 'Basmati Rice · Lentils · Cooking Oil · Fresh Milk · Eggs',
    demand: '78% of working families requested',
  },
  {
    id: 'healthy-breakfast',
    name: 'Healthy Morning Breakfast Pack',
    contents: 'Whole Wheat Bread · Oats · Yogurt · Fresh Fruit · Honey',
    demand: '64% repeat preference match',
  },
  {
    id: 'baby-care-week',
    name: '7-Day Parent Convenience Bundle',
    contents: 'Diapers · Wipes · Baby Cereal · Gentle Soap',
    demand: '71% convenience score',
  },
];

export function CompValueAdditionSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzed, setAnalyzed] = useState(false);
  const [launchedIds, setLaunchedIds] = useState<string[]>([]);
  const [rewarded, setRewarded] = useState(false);

  const allLaunched = launchedIds.length === WEEKLY_BUNDLES.length;

  const handleAnalyzePreferences = () => {
    soundFx.playPop();
    setAnalyzed(true);
  };

  const handleLaunchBundle = (id: string) => {
    if (!analyzed) {
      soundFx.playAlert();
      return;
    }
    if (launchedIds.includes(id)) return;
    const next = [...launchedIds, id];
    setLaunchedIds(next);
    if (next.length === WEEKLY_BUNDLES.length) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(20000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleLaunchAll = () => {
    setAnalyzed(true);
    setLaunchedIds(WEEKLY_BUNDLES.map((b) => b.id));
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(20000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzed(false);
    setLaunchedIds([]);
  };

  const convenienceIndex = 42 + launchedIds.length * 19;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART DIFFERENTIATION · CUSTOMIZED WEEKLY GROCERY PACKAGES
          </span>
          <h3 className="font-display text-lg font-bold">
            {allLaunched
              ? 'Weekly Grocery Packages Live! Unique Experience Beats Rivals (+NPR 20,000)'
              : 'Launch Pre-Packed Weekly Grocery Bundles Based on Customer Preferences'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!analyzed && (
            <motion.button
              type="button"
              onClick={handleAnalyzePreferences}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze Shopping Preferences</span>
            </motion.button>
          )}
          {analyzed && !allLaunched && (
            <button
              type="button"
              onClick={handleLaunchAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Launch All Family Bundles</span>
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
        {/* Left: Customized Pre-Packed Family Bundles */}
        <div className="lg:col-span-8 space-y-3">
          {WEEKLY_BUNDLES.map((bundle) => {
            const active = launchedIds.includes(bundle.id);
            return (
              <div
                key={bundle.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  active
                    ? 'bg-emerald-950/40 border-emerald-500/60'
                    : analyzed
                      ? 'bg-slate-950 border-amber-400/50'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <PackagePlus className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{bundle.name}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{bundle.contents}</p>
                    {analyzed && (
                      <p className="font-mono text-[11px] text-sky-300 mt-1">{bundle.demand}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchBundle(bundle.id)}
                  disabled={active}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                      : analyzed
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-pointer'
                  }`}
                >
                  {active ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Offered in Store</span>
                    </>
                  ) : (
                    <span>Launch Package</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Unique Shopping Experience Score */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <h4 className="font-display text-base font-bold text-white">
                Shopper Convenience Index
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Convenience vs Rivals</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  {convenienceIndex}%
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${convenienceIndex}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 170, damping: 20 }
                  }
                />
              </div>
              <p className="font-mono text-[11px] text-slate-400 pt-1">
                Packages active: {launchedIds.length} / {WEEKLY_BUNDLES.length}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
            {allLaunched
              ? 'Families pick up ready-made weekly grocery packages in seconds—a unique convenience competitors do not offer.'
              : 'Analyze customer preferences first, then launch all 3 customized weekly family packages.'}
          </p>
        </div>
      </div>
    </div>
  );
}
