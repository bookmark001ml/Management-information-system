import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PackageMinus,
  Server,
  ShoppingCart,
  UserCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface LowStockItem {
  id: string;
  name: string;
  levelPct: number;
  reorderNote: string;
}

const ITEMS: LowStockItem[] = [
  {
    id: 'flour',
    name: 'Organic Bread Flour',
    levelPct: 12,
    reorderNote: '10 sacks left (below 25-sack minimum)',
  },
  {
    id: 'butter',
    name: 'Unsalted Dairy Butter',
    levelPct: 10,
    reorderNote: '4 kg left (below 15 kg minimum)',
  },
];

export function CommunicationSyncSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [itemIdx, setItemIdx] = useState(0);
  const [stockLow, setStockLow] = useState(false);
  const [misOn, setMisOn] = useState(true);
  const [approved, setApproved] = useState(false);
  const [wonShown, setWonShown] = useState(false);

  const item = ITEMS[itemIdx];

  const triggerLowInventory = () => {
    setStockLow(true);
    setApproved(false);
    if (misOn) {
      soundFx.playPop();
    } else {
      soundFx.playAlert();
    }
  };

  const handleManagerApprove = () => {
    setApproved(true);
    if (!wonShown) {
      setWonShown(true);
      soundFx.playVictory();
      onComplete(17000);
    } else {
      soundFx.playVictory();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setStockLow(false);
    setApproved(false);
    setItemIdx((i) => (i + 1) % ITEMS.length);
  };

  const displayPct = approved ? 92 : stockLow ? item.levelPct : 72;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            LOW-INVENTORY ALERT ROUTING · {item.name.toUpperCase()}
          </span>
          <h3 className="font-display text-lg font-bold">
            {approved
              ? 'Coordinated! Purchasing Ordered & Branch Manager Approved (+NPR 17,000)'
              : 'Drop Inventory to Low & Watch Purchasing + Branch Manager Sync'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMisOn(false);
                setApproved(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                !misOn ? 'bg-rose-600 text-white' : 'text-slate-300'
              }`}
            >
              No MIS
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMisOn(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                misOn ? 'bg-emerald-600 text-white' : 'text-slate-300'
              }`}
            >
              MIS Active
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Switch Item</span>
          </button>
        </div>
      </div>

      {/* Animated Flow: Low Inventory -> MIS -> Purchasing Department + Branch Manager */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* 1. Warehouse Inventory Gauge */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{item.name}</span>
              <PackageMinus
                className={`w-4 h-4 ${
                  stockLow && !approved ? 'text-rose-400' : 'text-sky-400'
                }`}
                aria-hidden="true"
              />
            </div>

            <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                className={`h-full rounded-full ${
                  approved
                    ? 'bg-emerald-500'
                    : stockLow
                      ? 'bg-rose-500'
                      : 'bg-sky-500'
                }`}
                animate={{ width: `${displayPct}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 180, damping: 20 }
                }
              />
            </div>

            <p className="font-mono text-[11px] text-slate-400">
              {approved
                ? 'Restocked to 92%'
                : stockLow
                  ? `LOW STOCK (${item.levelPct}%) ▲`
                  : 'Normal stock (72%)'}
            </p>

            {!stockLow && (
              <button
                type="button"
                onClick={triggerLowInventory}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Simulate Low Inventory
              </button>
            )}
          </div>

          {/* Conduit 1 */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
              {!prefersReducedMotion && stockLow && misOn && (
                <motion.div
                  className="absolute top-0 bottom-0 w-7 bg-amber-400 rounded-full"
                  animate={{ left: ['-25%', '115%'] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                />
              )}
            </div>
          </div>

          {/* 2. MIS Hub */}
          <div
            className={`lg:col-span-3 rounded-xl border p-4 text-center ${
              stockLow && misOn
                ? 'bg-slate-900 border-sky-400 shadow-lg shadow-sky-950/50'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <Server
              className={`w-6 h-6 mx-auto mb-2 ${
                stockLow && !misOn ? 'text-rose-400' : 'text-sky-400'
              }`}
              aria-hidden="true"
            />
            <p className="font-display text-sm font-bold">MIS Alert Engine</p>
            <p className="text-xs text-slate-400 mt-1">
              {!stockLow
                ? 'Monitoring stock levels...'
                : misOn
                  ? 'Sending instant alert + notification'
                  : 'No automated alerts active'}
            </p>
          </div>

          {/* Conduit 2: Dual Branches */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-4">
            {[0, 1].map((b) => (
              <div
                key={b}
                className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden"
              >
                {!prefersReducedMotion && stockLow && misOn && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-7 bg-emerald-400 rounded-full"
                    animate={{ left: ['-25%', '115%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      delay: b * 0.15,
                      ease: 'linear',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 3. Purchasing Department + Branch Manager */}
          <div className="lg:col-span-4 space-y-3">
            {/* Purchasing Department Alert */}
            <motion.div
              animate={
                prefersReducedMotion || !(stockLow && misOn)
                  ? undefined
                  : { scale: [1, 1.02, 1] }
              }
              transition={{ repeat: approved ? 0 : Infinity, duration: 1.3 }}
              className={`p-3.5 rounded-xl border ${
                stockLow && misOn
                  ? 'bg-slate-900 border-amber-400/70'
                  : stockLow && !misOn
                    ? 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold inline-flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  Purchasing Department
                </span>
                {stockLow && misOn ? (
                  <span className="font-mono text-[10px] text-amber-300 font-bold inline-flex items-center gap-1">
                    <Bell className="w-3 h-3" aria-hidden="true" />
                    ALERT RECEIVED
                  </span>
                ) : stockLow ? (
                  <span className="font-mono text-[10px] text-rose-400 font-bold">
                    UNAWARE
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-300 mt-1.5">
                {approved
                  ? `Purchase order sent to supplier for ${item.name}.`
                  : stockLow && misOn
                    ? `Reorder Alert: ${item.reorderNote}`
                    : stockLow
                      ? 'Nobody called Purchasing — stock about to run dry!'
                      : 'Standing by for threshold alerts'}
              </p>
            </motion.div>

            {/* Branch Manager Notification */}
            <motion.div
              animate={
                prefersReducedMotion || !(stockLow && misOn)
                  ? undefined
                  : { scale: [1, 1.02, 1] }
              }
              transition={{ repeat: approved ? 0 : Infinity, duration: 1.3, delay: 0.2 }}
              className={`p-3.5 rounded-xl border space-y-2.5 ${
                approved
                  ? 'bg-emerald-950/40 border-emerald-500/60'
                  : stockLow && misOn
                    ? 'bg-slate-900 border-sky-400/70'
                    : stockLow && !misOn
                      ? 'bg-rose-950/40 border-rose-500/60'
                      : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold inline-flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  Branch Manager
                </span>
                {approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                ) : stockLow && misOn ? (
                  <span className="font-mono text-[10px] text-sky-300 font-bold inline-flex items-center gap-1">
                    <Bell className="w-3 h-3" aria-hidden="true" />
                    NOTIFIED
                  </span>
                ) : stockLow ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" aria-hidden="true" />
                ) : null}
              </div>

              <p className="text-xs text-slate-300">
                {approved
                  ? 'Restock approved! Kitchen schedule protected.'
                  : stockLow && misOn
                    ? `Notification: Approve restock for ${item.name}`
                    : stockLow
                      ? 'Learns about empty shelves too late.'
                      : 'Standing by for manager notifications'}
              </p>

              {stockLow && misOn && !approved && (
                <button
                  type="button"
                  onClick={handleManagerApprove}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Approve Restock Notification
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
