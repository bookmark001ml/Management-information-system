import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Users,
  Gift,
  HeartHandshake,
  Radar,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const REGULARS = [
  {
    id: 'r1',
    name: 'Meera P.',
    visits: '22 visits / quarter',
    preference: 'Organic Produce & Tea',
    offer: '15% Organic Basket Loyalty Reward',
  },
  {
    id: 'r2',
    name: 'Suresh D.',
    visits: '19 visits / quarter',
    preference: 'Fresh Bakery & Coffee',
    offer: 'Free Morning Croissant + Loyalty Points',
  },
  {
    id: 'r3',
    name: 'Anita L.',
    visits: '25 visits / quarter',
    preference: 'Household & Family Groceries',
    offer: 'NPR 500 Family Club Discount Voucher',
  },
];

export function CompCrmSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scanned, setScanned] = useState(false);
  const [rewardedIds, setRewardedIds] = useState<string[]>([]);
  const [won, setWon] = useState(false);

  const allSent = rewardedIds.length === REGULARS.length;

  const handleAnalyzeHistory = () => {
    soundFx.playPop();
    setScanned(true);
  };

  const handleRewardCustomer = (id: string) => {
    if (!scanned) {
      soundFx.playAlert();
      return;
    }
    if (rewardedIds.includes(id)) return;
    const next = [...rewardedIds, id];
    setRewardedIds(next);
    if (next.length === REGULARS.length) {
      soundFx.playVictory();
      if (!won) {
        setWon(true);
        onComplete(17000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleSendAll = () => {
    setScanned(true);
    setRewardedIds(REGULARS.map((r) => r.id));
    soundFx.playVictory();
    if (!won) {
      setWon(true);
      onComplete(17000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setScanned(false);
    setRewardedIds([]);
  };

  const repeatRate = 48 + rewardedIds.length * 16;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART CRM · LOYALTY & RETENTION
          </span>
          <h3 className="font-display text-lg font-bold">
            {allSent
              ? 'Regular Shoppers Rewarded! Repeat Visits Surged to 96% (+NPR 17,000)'
              : 'Identify Regular Customers & Send Personalized Loyalty Rewards'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!scanned && (
            <motion.button
              type="button"
              onClick={handleAnalyzeHistory}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Identify Regular Customers</span>
            </motion.button>
          )}
          {scanned && !allSent && (
            <button
              type="button"
              onClick={handleSendAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Send All Loyalty Rewards</span>
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
        <div className="lg:col-span-8 space-y-3">
          {REGULARS.map((cust) => {
            const rewarded = rewardedIds.includes(cust.id);
            return (
              <div
                key={cust.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  rewarded
                    ? 'bg-emerald-950/40 border-emerald-500/60'
                    : scanned
                      ? 'bg-slate-950 border-amber-400/60'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{cust.name}</span>
                      {scanned && (
                        <span className="font-mono text-[11px] text-sky-300">
                          · {cust.visits}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {scanned
                        ? `Preference: ${cust.preference}`
                        : 'Click Identify Regular Customers to reveal preferences'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRewardCustomer(cust.id)}
                  disabled={rewarded}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                    rewarded
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                      : scanned
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-pointer'
                  }`}
                >
                  {rewarded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Returning Customer!</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{scanned ? cust.offer : 'Send Reward'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Repeat Visit Gauge */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <h4 className="font-display text-base font-bold text-white">
                Customer Return Rate
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Repeat Shopping Rate</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  {repeatRate}%
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${repeatRate}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 170, damping: 20 }
                  }
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
            {allSent
              ? 'Personalized discounts and loyalty rewards encourage regular customers to keep returning to SmartMart.'
              : 'Analyze purchase history to uncover regular shoppers, then reward each with their favorite discount.'}
          </p>
        </div>
      </div>
    </div>
  );
}
