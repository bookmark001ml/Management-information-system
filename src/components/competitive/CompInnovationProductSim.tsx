import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  MessageSquareHeart,
  Radar,
  Sparkles,
  PackageCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const FEEDBACK_LOGS = [
  { id: 'f1', shopper: 'Nisha G.', note: 'Looking for sugar-free oat biscuits!', tag: 'Sugar-Free' },
  { id: 'f2', shopper: 'Ramesh B.', note: 'Need diabetic-friendly sugar-free granola bars.', tag: 'Sugar-Free' },
  { id: 'f3', shopper: 'Kavita S.', note: 'Would buy sugar-free dark chocolate snacks weekly.', tag: 'Sugar-Free' },
];

const SUGAR_FREE_RANGE = [
  { id: 'oat', name: 'Sugar-Free Oat Cookies', demandScore: '94% Match' },
  { id: 'granola', name: 'Zero-Sugar Almond Granola', demandScore: '89% Match' },
  { id: 'cocoa', name: 'Stevia Dark Cocoa Bites', demandScore: '91% Match' },
];

export function CompInnovationProductSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scanned, setScanned] = useState(false);
  const [launched, setLaunched] = useState<string[]>([]);
  const [rewarded, setRewarded] = useState(false);

  const allLaunched = launched.length === SUGAR_FREE_RANGE.length;

  const handleScanFeedback = () => {
    soundFx.playPop();
    setScanned(true);
  };

  const handleLaunchItem = (id: string) => {
    if (!scanned) {
      soundFx.playAlert();
      return;
    }
    if (launched.includes(id)) return;
    const next = [...launched, id];
    setLaunched(next);
    if (next.length === SUGAR_FREE_RANGE.length) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(18000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleLaunchAll = () => {
    setScanned(true);
    setLaunched(SUGAR_FREE_RANGE.map((x) => x.id));
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(18000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setScanned(false);
    setLaunched([]);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART PRODUCT INNOVATION · FEEDBACK & HISTORY
          </span>
          <h3 className="font-display text-lg font-bold">
            {allLaunched
              ? 'Sugar-Free Snack Range Launched! New Demand Captured (+NPR 18,000)'
              : 'Analyze Feedback & Introduce Sugar-Free Products'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!scanned && (
            <motion.button
              type="button"
              onClick={handleScanFeedback}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Analyze History & Feedback</span>
            </motion.button>
          )}
          {scanned && !allLaunched && (
            <button
              type="button"
              onClick={handleLaunchAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Launch All Sugar-Free Snacks</span>
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
        {/* Left: Customer Feedback & Purchase History Signal */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Customer Purchase History & Feedback Stream
              </span>
              <span
                className={`font-mono font-bold ${
                  scanned ? 'text-amber-300' : 'text-slate-500'
                }`}
              >
                {scanned ? 'SUGAR-FREE DEMAND +160%' : 'IDLE'}
              </span>
            </div>

            {FEEDBACK_LOGS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-3.5 rounded-xl border ${
                  scanned
                    ? 'bg-sky-950/35 border-sky-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white inline-flex items-center gap-1.5">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    {item.shopper}
                  </span>
                  {scanned && (
                    <span className="font-mono text-[11px] font-bold text-amber-300">
                      {item.tag} Request
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">“{item.note}”</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {scanned && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/50 text-xs text-amber-200"
              >
                <strong>MIS Insight:</strong> Searches & feedback for sugar-free snacks grew 160% over 90 days—introduce a sugar-free range!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Introduce Sugar-Free Snack Range */}
        <div className="lg:col-span-6 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                PRODUCT DEVELOPMENT LAUNCHPAD
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                SmartMart Sugar-Free Snack Line
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {scanned
                  ? 'Click each new product below to stock SmartMart’s new sugar-free shelf:'
                  : 'Run Step 1 first so MIS confirms customer demand for sugar-free items.'}
              </p>
            </div>

            {SUGAR_FREE_RANGE.map((snack) => {
              const isOut = launched.includes(snack.id);
              return (
                <button
                  key={snack.id}
                  type="button"
                  onClick={() => handleLaunchItem(snack.id)}
                  disabled={isOut}
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    isOut
                      ? 'bg-emerald-950/50 border-emerald-400 text-white cursor-default'
                      : scanned
                        ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200 cursor-pointer'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isOut ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <PackageCheck className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                    )}
                    <div>
                      <p className="text-xs font-bold">{snack.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{snack.demandScore}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-300 shrink-0">
                    {isOut ? 'ON SHELF' : 'Introduce'}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700">
            {allLaunched
              ? 'SmartMart turned customer feedback into a thriving sugar-free product line before competitors reacted.'
              : `Products launched: ${launched.length} / ${SUGAR_FREE_RANGE.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
