import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Baby,
  ShoppingBasket,
  Send,
  Radar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface OpsGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface SmartMartCustomer {
  id: string;
  name: string;
  frequentCategory: string;
  babyOrders: number;
  isBabyBuyer: boolean;
}

const CUSTOMERS: SmartMartCustomer[] = [
  {
    id: 'sita',
    name: 'Sita R.',
    frequentCategory: 'Baby Diapers & Formula',
    babyOrders: 14,
    isBabyBuyer: true,
  },
  {
    id: 'anil',
    name: 'Anil M.',
    frequentCategory: 'Baby Wipes & Infant Cereal',
    babyOrders: 11,
    isBabyBuyer: true,
  },
  {
    id: 'priya',
    name: 'Priya K.',
    frequentCategory: 'Baby Lotion & Milk',
    babyOrders: 9,
    isBabyBuyer: true,
  },
  {
    id: 'bikash',
    name: 'Bikash T.',
    frequentCategory: 'Coffee & Snacks',
    babyOrders: 0,
    isBabyBuyer: false,
  },
];

export function OpsCompetitiveSim({ onComplete }: OpsGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scanned, setScanned] = useState(false);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const babyBuyerIds = CUSTOMERS.filter((c) => c.isBabyBuyer).map((c) => c.id);
  const allBabySent = babyBuyerIds.every((id) => sentIds.includes(id));

  const handleAnalyzeHistory = () => {
    soundFx.playPop();
    setScanned(true);
    setWrongMsg(null);
  };

  const handleSendDiscount = (customer: SmartMartCustomer) => {
    if (!scanned) {
      soundFx.playAlert();
      setWrongMsg('Run the MIS purchase history scan first to spot frequent baby-product buyers.');
      return;
    }
    if (!customer.isBabyBuyer) {
      soundFx.playAlert();
      setWrongMsg(`${customer.name} buys Coffee & Snacks, not baby products. Target frequent baby-product buyers!`);
      return;
    }
    if (sentIds.includes(customer.id)) return;

    const next = [...sentIds, customer.id];
    setSentIds(next);
    setWrongMsg(null);

    if (babyBuyerIds.every((id) => next.includes(id))) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(18000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleSendAllBaby = () => {
    setScanned(true);
    setWrongMsg(null);
    setSentIds(babyBuyerIds);
    soundFx.playVictory();
    if (!rewarded) {
      setRewarded(true);
      onComplete(18000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setScanned(false);
    setSentIds([]);
    setWrongMsg(null);
  };

  const retentionRate = Math.min(96, 52 + sentIds.length * 14);

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART LOYALTY ENGINE · PURCHASE HISTORY ANALYSIS
          </span>
          <h3 className="font-display text-lg font-bold">
            {allBabySent
              ? 'Personalized Baby-Care Discounts Sent! Customers Stay Loyal (+NPR 18,000)'
              : 'Find Frequent Baby-Product Buyers & Send Personalized Discounts'}
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
              <span>1. Analyze Purchase History</span>
            </motion.button>
          )}
          {scanned && !allBabySent && (
            <button
              type="button"
              onClick={handleSendAllBaby}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>2. Send Discounts to Baby Buyers</span>
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

      {/* Customer Purchase History Cards + Retention Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CUSTOMERS.map((cust) => {
            const isSent = sentIds.includes(cust.id);
            const highlighted = scanned && cust.isBabyBuyer;

            return (
              <div
                key={cust.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  isSent
                    ? 'bg-emerald-950/40 border-emerald-500/60'
                    : highlighted
                      ? 'bg-slate-950 border-amber-400/70'
                      : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          highlighted
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cust.isBabyBuyer ? (
                          <Baby className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ShoppingBasket className="w-4 h-4" aria-hidden="true" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{cust.name}</p>
                        <p className="font-mono text-[11px] text-slate-400">
                          {scanned ? cust.frequentCategory : 'History unscanned'}
                        </p>
                      </div>
                    </div>

                    {isSent && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>

                  {scanned && (
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-400">Baby-care orders:</span>
                      <span
                        className={`font-mono font-bold ${
                          cust.isBabyBuyer ? 'text-amber-300' : 'text-slate-500'
                        }`}
                      >
                        {cust.babyOrders} trips
                      </span>
                    </motion.div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSendDiscount(cust)}
                  disabled={isSent}
                  className={`mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isSent
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                      : highlighted
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {isSent
                      ? 'Personalized 20% Baby Offer Sent'
                      : 'Send 20% Baby Product Discount'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Retention & Competitive Edge Panel */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                RETENTION MONITOR
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                SmartMart vs. Rival Stores
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Customer Retention</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  {retentionRate}%
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${retentionRate}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 170, damping: 20 }
                  }
                />
              </div>
              <p className="font-mono text-[11px] text-slate-400 pt-1">
                Targeted baby offers sent: {sentIds.length} / {babyBuyerIds.length}
              </p>
            </div>

            <AnimatePresence>
              {wrongMsg && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{wrongMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
            {allBabySent
              ? 'SmartMart turned purchase-history insights into personalized baby-product discounts—attracting and retaining families ahead of competitors.'
              : 'Click Analyze Purchase History first so SmartMart identifies frequent baby-product buyers.'}
          </p>
        </div>
      </div>
    </div>
  );
}
