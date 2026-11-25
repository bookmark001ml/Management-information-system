import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Droplets,
  Truck,
  ShieldCheck,
  Radar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface DecGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const SUPPLIERS = [
  {
    id: 'budget-oil',
    name: 'Sasto Agro Oil',
    pricePerLiter: 'NPR 225/L (Lowest)',
    deliveryTime: '72 hrs (Frequent Delays)',
    qualityRecord: '74% Pass · 11% Leakage Claims',
    isBest: false,
  },
  {
    id: 'himalayan-pure',
    name: 'Himalayan Pure Mills',
    pricePerLiter: 'NPR 240/L (Competitive)',
    deliveryTime: '24 hrs (99% On-Time)',
    qualityRecord: '99.2% Lab Quality Pass',
    isBest: true,
  },
  {
    id: 'metro-imports',
    name: 'Metro Import Distributors',
    pricePerLiter: 'NPR 275/L (High)',
    deliveryTime: '48 hrs (Standard)',
    qualityRecord: '94% Pass',
    isBest: false,
  },
];

export function DecDataDrivenSim({ onComplete }: DecGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [compared, setCompared] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const isSolved = picked === 'himalayan-pure';

  const handleCompare = () => {
    soundFx.playPop();
    setCompared(true);
  };

  const handleSelectSupplier = (id: string, isBest: boolean) => {
    if (!compared) {
      soundFx.playAlert();
      return;
    }
    setPicked(id);
    if (isBest) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(17000);
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setCompared(false);
    setPicked(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART PURCHASING DESK · COOKING OIL SUPPLIER SELECTION
          </span>
          <h3 className="font-display text-lg font-bold">
            {isSolved
              ? 'Right Supplier Selected! Himalayan Pure Mills Contracted (+NPR 17,000)'
              : 'Compare Price, Delivery Time & Quality Records for Cooking Oil'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!compared && (
            <motion.button
              type="button"
              onClick={handleCompare}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Compare Suppliers in MIS</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUPPLIERS.map((sup) => {
          const isPicked = picked === sup.id;
          const right = isPicked && sup.isBest;
          const wrong = isPicked && !sup.isBest;

          return (
            <button
              key={sup.id}
              type="button"
              onClick={() => handleSelectSupplier(sup.id, sup.isBest)}
              className={`text-left rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-colors cursor-pointer ${
                right
                  ? 'bg-emerald-950/45 border-emerald-400'
                  : wrong
                    ? 'bg-rose-950/40 border-rose-500'
                    : compared
                      ? 'bg-slate-950 border-slate-700 hover:border-amber-400'
                      : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-white inline-flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    {sup.name}
                  </span>
                  {right && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />}
                  {wrong && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />}
                </div>

                {compared ? (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 text-xs font-mono"
                  >
                    <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between">
                      <span className="text-slate-400">Price</span>
                      <span className="text-amber-300 font-bold">{sup.pricePerLiter}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between">
                      <span className="text-slate-400 inline-flex items-center gap-1">
                        <Truck className="w-3 h-3" aria-hidden="true" />
                        Delivery
                      </span>
                      <span className={sup.isBest ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                        {sup.deliveryTime}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 flex justify-between">
                      <span className="text-slate-400 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                        Quality
                      </span>
                      <span className={sup.isBest ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                        {sup.qualityRecord}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Click “1. Compare Suppliers in MIS” to review price, delivery speed, and quality records.
                  </p>
                )}
              </div>

              <span className="pt-3 border-t border-slate-800 text-xs font-bold text-amber-400 block">
                {right ? 'Supplier Selected' : 'Select Cooking Oil Supplier'}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={picked ?? (compared ? 'compared' : 'idle')}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isSolved
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : picked
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          {isSolved
            ? 'Great data-driven choice! Himalayan Pure Mills combines competitive pricing (NPR 240/L), 24h on-time delivery, and a 99.2% lab quality record.'
            : picked === 'budget-oil'
              ? 'Lowest price alone is a trap: 72h delays and 11% leakage claims cause stockouts and returns! Look at delivery + quality.'
              : picked === 'metro-imports'
                ? 'Metro Imports costs NPR 275/L and takes 48h—another supplier offers better pricing, faster 24h delivery, and 99.2% quality.'
                : 'Compare all three cooking oil suppliers in MIS before selecting the best overall partner.'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
