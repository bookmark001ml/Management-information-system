import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ShoppingBag,
  Server,
  Receipt,
  Package,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface PurchaseItem {
  id: string;
  label: string;
  priceNpr: number;
  stockChange: string;
  accountEntry: string;
}

const PURCHASES: PurchaseItem[] = [
  {
    id: 'croissant-box',
    label: '6× Butter Croissants',
    priceNpr: 1200,
    stockChange: '-6 Croissants (-0.4 kg butter)',
    accountEntry: '+NPR 1,200 Cash & Revenue',
  },
  {
    id: 'sourdough-combo',
    label: '2× Sourdough + Cake',
    priceNpr: 2450,
    stockChange: '-2 Loaves, -1 Cake',
    accountEntry: '+NPR 2,450 QR & Revenue',
  },
];

export function DataIntegrationSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState('croissant-box');
  const [misIntegrated, setMisIntegrated] = useState(true);
  const [salesCount, setSalesCount] = useState(0);
  const [totalNpr, setTotalNpr] = useState(0);
  const [stockRemaining, setStockRemaining] = useState(80);
  const [pulseSeq, setPulseSeq] = useState(0);
  const [wonShown, setWonShown] = useState(false);

  const currentItem = PURCHASES.find((p) => p.id === selectedId) ?? PURCHASES[0];

  const handlePurchase = () => {
    setPulseSeq((s) => s + 1);
    setSalesCount((c) => c + 1);
    setTotalNpr((n) => n + currentItem.priceNpr);

    if (misIntegrated) {
      setStockRemaining((s) => Math.max(0, s - (selectedId === 'croissant-box' ? 6 : 3)));
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(14000);
      } else {
        soundFx.playPop();
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setSalesCount(0);
    setTotalNpr(0);
    setStockRemaining(80);
    setPulseSeq(0);
  };

  const hasPurchased = salesCount > 0;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {PURCHASES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedId(item.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                selectedId === item.id
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label} (NPR {item.priceNpr.toLocaleString()})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMisIntegrated(false);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                !misIntegrated ? 'bg-rose-600 text-white' : 'text-slate-300'
              }`}
            >
              Disconnected
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMisIntegrated(true);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                misIntegrated ? 'bg-emerald-600 text-white' : 'text-slate-300'
              }`}
            >
              Integrated MIS
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset ledger"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Animated Simultaneous Update Diagram */}
      <div
        key={pulseSeq}
        className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Step 1: Customer Purchase Action */}
          <div className="lg:col-span-3 bg-slate-900 border border-amber-400/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-mono text-[10px] text-amber-300 block">
                POINT OF SALE
              </span>
              <p className="font-display text-sm font-bold text-white mt-1">
                Customer Buys {currentItem.label}
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              onClick={handlePurchase}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Complete Purchase</span>
            </motion.button>
          </div>

          {/* Conduit 1 */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
              {!prefersReducedMotion && hasPurchased && (
                <motion.div
                  className="absolute top-0 bottom-0 w-7 bg-amber-400 rounded-full"
                  initial={{ left: '-25%' }}
                  animate={{ left: '110%' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              )}
            </div>
          </div>

          {/* Step 2: MIS Hub */}
          <motion.div
            initial={
              prefersReducedMotion || !hasPurchased ? false : { scale: 0.92 }
            }
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`lg:col-span-3 rounded-xl border p-4 text-center ${
              misIntegrated
                ? 'bg-slate-900 border-sky-400/70'
                : 'bg-rose-950/30 border-rose-500/60'
            }`}
          >
            <Server
              className={`w-6 h-6 mx-auto mb-2 ${
                misIntegrated ? 'text-sky-400' : 'text-rose-400'
              }`}
              aria-hidden="true"
            />
            <p className="font-display text-sm font-bold">
              {misIntegrated ? 'Integrated MIS' : 'No Integration'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {misIntegrated
                ? 'Simultaneously updates all 3 records'
                : 'Only POS updates; stock & books lag'}
            </p>
          </motion.div>

          {/* Conduit 2: 3 Parallel Pulses */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-3">
            {[0, 1, 2].map((line) => {
              const activeLine = hasPurchased && (misIntegrated || line === 0);
              return (
                <div
                  key={line}
                  className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden"
                >
                  {!prefersReducedMotion && activeLine && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-7 bg-emerald-400 rounded-full"
                      initial={{ left: '-25%' }}
                      animate={{ left: '110%' }}
                      transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 3: 3 Simultaneous Records (Sales, Inventory, Accounting) */}
          <div className="lg:col-span-4 space-y-2.5">
            {/* Sales Record */}
            <motion.div
              initial={prefersReducedMotion || !hasPurchased ? false : { x: 10 }}
              animate={{ x: 0 }}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                hasPurchased
                  ? 'bg-slate-900 border-emerald-500/60'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-xs font-bold block">Sales Record</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {salesCount} orders · NPR {totalNpr.toLocaleString()}
                  </span>
                </div>
              </div>
              {hasPurchased && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
            </motion.div>

            {/* Inventory Record */}
            <motion.div
              initial={prefersReducedMotion || !hasPurchased ? false : { x: 10 }}
              animate={{ x: 0 }}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                hasPurchased && misIntegrated
                  ? 'bg-slate-900 border-emerald-500/60'
                  : hasPurchased && !misIntegrated
                    ? 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package
                  className={`w-4 h-4 shrink-0 ${
                    hasPurchased && !misIntegrated ? 'text-rose-400' : 'text-amber-400'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <span className="text-xs font-bold block">Inventory Record</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {hasPurchased && !misIntegrated
                      ? 'Out of sync! Still shows 80'
                      : `${stockRemaining} units remaining`}
                  </span>
                </div>
              </div>
              {hasPurchased &&
                (misIntegrated ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                ))}
            </motion.div>

            {/* Accounting Record */}
            <motion.div
              initial={prefersReducedMotion || !hasPurchased ? false : { x: 10 }}
              animate={{ x: 0 }}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                hasPurchased && misIntegrated
                  ? 'bg-slate-900 border-emerald-500/60'
                  : hasPurchased && !misIntegrated
                    ? 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen
                  className={`w-4 h-4 shrink-0 ${
                    hasPurchased && !misIntegrated ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <span className="text-xs font-bold block">Accounting Record</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {hasPurchased && !misIntegrated
                      ? 'Pending manual closing entry'
                      : `Balanced · NPR ${totalNpr.toLocaleString()}`}
                  </span>
                </div>
              </div>
              {hasPurchased &&
                (misIntegrated ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                ))}
            </motion.div>
          </div>
        </div>

        <p className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-300">
          {hasPurchased
            ? misIntegrated
              ? 'One customer purchase updated Sales, Inventory, and Accounting simultaneously!'
              : 'Without integration, Inventory and Accounting remain outdated until manual entry.'
            : 'Click Complete Purchase to watch one sale update Sales, Inventory, and Accounting at the exact same instant.'}
        </p>
      </div>
    </div>
  );
}
