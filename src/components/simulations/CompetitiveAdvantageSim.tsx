import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  UserCheck,
  Sparkles,
  Tag,
  Heart,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface CustomerProfile {
  id: string;
  name: string;
  history: string;
  frequency: string;
  offer: string;
  repeatLift: number;
}

const CUSTOMERS: CustomerProfile[] = [
  {
    id: 'aarav',
    name: 'Aarav S.',
    history: 'Bought 18× Butter Croissants + Espresso (7–9 AM)',
    frequency: '4 visits / week',
    offer: '20% Off Morning Croissant + Coffee Combo',
    repeatLift: 16,
  },
  {
    id: 'maya',
    name: 'Maya T.',
    history: 'Bought 6× Multigrain Sourdough Loaves (Weekends)',
    frequency: 'Every Saturday',
    offer: 'Free Cardamom Bun with Weekend Sourdough',
    repeatLift: 15,
  },
  {
    id: 'rohan',
    name: 'Rohan K.',
    history: 'Ordered 2× Custom Birthday Cakes last year',
    frequency: 'Special Occasions',
    offer: '15% Early-Bird Custom Cake Discount',
    repeatLift: 14,
  },
];

export function CompetitiveAdvantageSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [analyzedIds, setAnalyzedIds] = useState<string[]>([]);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [wonShown, setWonShown] = useState(false);

  const handleAnalyzeAll = () => {
    soundFx.playPop();
    setAnalyzedIds(CUSTOMERS.map((c) => c.id));
  };

  const handleSendOffer = (id: string) => {
    if (!analyzedIds.includes(id)) {
      soundFx.playPop();
      setAnalyzedIds((prev) => [...prev, id]);
    }
    if (sentIds.includes(id)) return;
    const next = [...sentIds, id];
    setSentIds(next);

    if (next.length === CUSTOMERS.length) {
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(22000);
      } else {
        soundFx.playVictory();
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleSendAll = () => {
    setAnalyzedIds(CUSTOMERS.map((c) => c.id));
    setSentIds(CUSTOMERS.map((c) => c.id));
    if (!wonShown) {
      setWonShown(true);
      soundFx.playVictory();
      onComplete(22000);
    } else {
      soundFx.playVictory();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setAnalyzedIds([]);
    setSentIds([]);
  };

  const loyaltyScore =
    40 +
    CUSTOMERS.reduce(
      (sum, c) => (sentIds.includes(c.id) ? sum + c.repeatLift : sum),
      0
    );
  const allSent = sentIds.length === CUSTOMERS.length;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            PURCHASE HISTORY ENGINE · KATHMANDU BAKERY LOYALTY
          </span>
          <h3 className="font-display text-lg font-bold">
            {allSent
              ? 'Personalized Offers Delivered! Repeat Visits Outpace Rivals (+NPR 22,000)'
              : 'Analyze Customer Purchase History & Send Personalized Discounts'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {analyzedIds.length < CUSTOMERS.length && (
            <button
              type="button"
              onClick={handleAnalyzeAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Analyze Purchase History</span>
            </button>
          )}
          {!allSent && (
            <button
              type="button"
              onClick={handleSendAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send All Discounts</span>
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

      {/* Main Split: Customer History Analysis Cards + Competitive Edge Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 space-y-3">
          {CUSTOMERS.map((cust, idx) => {
            const isAnalyzed = analyzedIds.includes(cust.id);
            const isSent = sentIds.includes(cust.id);

            return (
              <motion.div
                key={cust.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : idx * 0.06 }}
                className={`rounded-xl border p-4 transition-colors relative overflow-hidden ${
                  isSent
                    ? 'bg-emerald-950/40 border-emerald-500/60'
                    : isAnalyzed
                      ? 'bg-slate-950 border-amber-400/60'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                {isAnalyzed && !isSent && !prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent pointer-events-none"
                    animate={{ left: ['-20%', '120%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-sky-400" aria-hidden="true" />
                      <span className="font-display text-sm font-bold text-white">
                        {cust.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        · {cust.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                      <span>{cust.history}</span>
                    </p>
                  </div>

                  {isSent ? (
                    <motion.div
                      initial={prefersReducedMotion ? false : { scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Sent: {cust.offer}</span>
                    </motion.div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOffer(cust.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shrink-0"
                    >
                      <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {isAnalyzed ? `Offer: ${cust.offer}` : 'Analyze & Offer Discount'}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Repeat Customer Advantage Gauge */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between text-center">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer Retention Edge</span>
            <Heart className="w-4 h-4 text-rose-400" aria-hidden="true" />
          </div>

          <div className="my-4">
            <svg className="w-36 h-36 mx-auto -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={allSent ? '#10b981' : '#f59e0b'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={314}
                animate={{ strokeDashoffset: 314 - (314 * loyaltyScore) / 100 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 120, damping: 20 }
                }
              />
            </svg>
            <div className="-mt-24 mb-10">
              <span className="font-mono tabular-nums text-2xl font-bold text-white block">
                {loyaltyScore}%
              </span>
              <span className="text-[11px] text-slate-400">Repeat Rate</span>
            </div>
          </div>

          <div className="space-y-2 text-left pt-3 border-t border-slate-800 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Generic Rival:</span>
              <span className="text-slate-300">40% repeat</span>
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              {allSent
                ? 'Personalized discounts bring regulars back twice as often as generic flyers.'
                : 'MIS reads each customer’s favorite items and tailors offers rivals cannot match.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
