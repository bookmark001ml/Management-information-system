import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Radar,
  PackageX,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  CalendarClock,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface WarehouseLot {
  id: string;
  name: string;
  rack: string;
  crates: number;
  daysLeft: number; // <=0 expired, 1-2 near expiry, >7 fresh
  sourceCause: string;
  monthlyWasteNpr: number;
}

const WAREHOUSE_LOTS: WarehouseLot[] = [
  {
    id: 'flour',
    name: 'Organic Bread Flour',
    rack: 'Rack A1',
    crates: 18,
    daysLeft: 42,
    sourceCause: 'Fresh rotation · No wastage',
    monthlyWasteNpr: 0,
  },
  {
    id: 'cream',
    name: 'Whipping Cream Cartons',
    rack: 'Cold Rack B2',
    crates: 14,
    daysLeft: 1,
    sourceCause: 'Source of Wastage: New cartons stacked in front; old batch hidden at back!',
    monthlyWasteNpr: 11200,
  },
  {
    id: 'butter',
    name: 'Cultured Butter Blocks',
    rack: 'Cold Rack B4',
    crates: 9,
    daysLeft: 0,
    sourceCause: 'Source of Wastage: Over-ordered by 40% before slow mid-week days!',
    monthlyWasteNpr: 7300,
  },
  {
    id: 'sugar',
    name: 'Raw Cane Sugar',
    rack: 'Rack C1',
    crates: 12,
    daysLeft: 90,
    sourceCause: 'Dry storage · No wastage',
    monthlyWasteNpr: 0,
  },
];

export function ProblemAnalysisSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scanned, setScanned] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [fixedIds, setFixedIds] = useState<string[]>([]);
  const [pileTick, setPileTick] = useState(1);
  const [wonShown, setWonShown] = useState(false);

  const problemIds = ['cream', 'butter'];
  const allFixed = problemIds.every((id) => fixedIds.includes(id));

  // Animate expired boxes accumulating in the warehouse until fixed
  useEffect(() => {
    if (allFixed) return;
    const timer = setInterval(() => {
      setPileTick((t) => (t >= 4 ? 1 : t + 1));
    }, 1100);
    return () => clearInterval(timer);
  }, [allFixed]);

  const handleScan = () => {
    soundFx.playPop();
    setScanned(true);
    setSelectedLotId('cream');
  };

  const handleSelectLot = (lot: WarehouseLot) => {
    if (!scanned) {
      soundFx.playAlert();
      return;
    }
    setSelectedLotId(lot.id);
    if (lot.daysLeft <= 2 && !fixedIds.includes(lot.id)) {
      soundFx.playPop();
    } else {
      soundFx.playClick();
    }
  };

  const handleFixSource = (lotId: string) => {
    if (fixedIds.includes(lotId)) return;
    const next = [...fixedIds, lotId];
    setFixedIds(next);

    if (problemIds.every((id) => next.includes(id))) {
      if (!wonShown) {
        setWonShown(true);
        soundFx.playVictory();
        onComplete(18500);
      } else {
        soundFx.playVictory();
      }
    } else {
      soundFx.playPop();
      const other = problemIds.find((id) => !next.includes(id));
      if (other) setSelectedLotId(other);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setScanned(false);
    setSelectedLotId(null);
    setFixedIds([]);
    setPileTick(1);
  };

  const selectedLot = WAREHOUSE_LOTS.find((l) => l.id === selectedLotId) ?? null;

  const remainingWaste = WAREHOUSE_LOTS.reduce(
    (sum, lot) => (fixedIds.includes(lot.id) ? sum : sum + lot.monthlyWasteNpr),
    0
  );

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-rose-400 block">
            {allFixed
              ? 'WAREHOUSE WASTAGE STOPPED · +NPR 18,500 SAVED/MO'
              : `EXPIRED & NEAR-EXPIRY STOCK PILING UP (-NPR ${remainingWaste.toLocaleString()}/MO)`}
          </span>
          <h3 className="font-display text-lg font-bold">
            {allFixed
              ? 'MIS Flagged Expiring Lots & Cleared Both Sources of Wastage'
              : 'Identify Expiring Warehouse Stock & Fix the Source of Wastage'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!scanned && (
            <motion.button
              type="button"
              onClick={handleScan}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <Radar className="w-4 h-4" aria-hidden="true" />
              <span>Scan Warehouse Expiry Dates</span>
            </motion.button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Warehouse</span>
          </button>
        </div>
      </div>

      {/* Main Split: Animated Warehouse Racks + Wastage Source Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Warehouse Shelves with Accumulating Expired Crates */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          {scanned && !allFixed && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-sky-400/15 to-transparent pointer-events-none"
              animate={{ left: ['-20%', '120%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            />
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 relative z-10">
            <span>Kathmandu Bakery Warehouse Racks</span>
            <span className="font-mono">
              {scanned ? 'MIS Expiry Alerts Active' : 'Unscanned Inventory'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
            {WAREHOUSE_LOTS.map((lot) => {
              const isRisk = lot.daysLeft <= 2;
              const isFixed = fixedIds.includes(lot.id);
              const showAlert = scanned && isRisk && !isFixed;
              const isSelected = selectedLotId === lot.id;

              const statusLabel = isFixed
                ? 'FIFO FIXED · FRESH'
                : !scanned
                  ? `${lot.crates} crates stored`
                  : lot.daysLeft === 0
                    ? 'EXPIRED TODAY ▲'
                    : lot.daysLeft <= 2
                      ? `EXPIRES IN ${lot.daysLeft} DAY ▲`
                      : `${lot.daysLeft} days left · OK`;

              return (
                <motion.button
                  key={lot.id}
                  type="button"
                  onClick={() => handleSelectLot(lot)}
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  className={`text-left rounded-xl border p-4 transition-colors cursor-pointer relative ${
                    isFixed
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : showAlert
                        ? isSelected
                          ? 'bg-rose-950 border-rose-400 ring-2 ring-rose-400/40'
                          : 'bg-rose-950/60 border-rose-500/70'
                        : isSelected
                          ? 'bg-slate-800 border-sky-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        {lot.rack}
                      </span>
                      <p className="font-display text-sm font-bold text-white mt-0.5">
                        {lot.name}
                      </p>
                    </div>
                    {showAlert ? (
                      <PackageX className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                    ) : isFixed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <CalendarClock className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                    )}
                  </div>

                  {/* Animated Accumulating Crate Blocks */}
                  <div className="mt-3 flex items-center gap-1.5 h-6">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const isPilingSpoiled =
                        isRisk && !isFixed && idx >= 5 - Math.min(4, pileTick);
                      return (
                        <motion.div
                          key={idx}
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : isPilingSpoiled
                                ? { scale: [0.95, 1.06, 0.95] }
                                : { scale: 1 }
                          }
                          transition={{ repeat: Infinity, duration: 1.0, delay: idx * 0.1 }}
                          className={`flex-1 h-4 rounded-sm ${
                            isFixed
                              ? 'bg-emerald-500/70'
                              : isPilingSpoiled
                                ? showAlert
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500/70'
                                : 'bg-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <p
                    className={`font-mono text-[11px] font-semibold mt-2.5 ${
                      isFixed
                        ? 'text-emerald-400'
                        : showAlert
                          ? 'text-rose-300'
                          : scanned
                            ? 'text-emerald-400/80'
                            : 'text-slate-400'
                    }`}
                  >
                    {statusLabel}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: MIS Wastage Source Analysis Panel */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <AnimatePresence mode="wait">
            {!scanned ? (
              <motion.div
                key="unscanned"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 my-auto"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  HIDDEN WAREHOUSE SPOILAGE
                </div>
                <p className="font-display text-base font-bold text-white">
                  Expired boxes are piling up in the warehouse.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click <strong>Scan Warehouse Expiry Dates</strong> so MIS can detect items approaching expiry and trace the exact source of wastage.
                </p>
              </motion.div>
            ) : selectedLot ? (
              <motion.div
                key={selectedLot.id + fixedIds.join(',')}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-sky-300 font-bold">
                    MIS ROOT-CAUSE REPORT · {selectedLot.rack}
                  </span>
                  {selectedLot.monthlyWasteNpr > 0 && !fixedIds.includes(selectedLot.id) && (
                    <span className="font-mono text-xs font-bold text-rose-400">
                      -NPR {selectedLot.monthlyWasteNpr.toLocaleString()}/mo
                    </span>
                  )}
                </div>

                <h4 className="font-display text-lg font-bold text-white">
                  {selectedLot.name}
                </h4>

                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    fixedIds.includes(selectedLot.id)
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : selectedLot.daysLeft <= 2
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {fixedIds.includes(selectedLot.id)
                    ? 'Fixed! MIS moved near-expiry batches to front-of-shelf use and capped mid-week reorders.'
                    : selectedLot.sourceCause}
                </div>

                {selectedLot.daysLeft <= 2 && !fixedIds.includes(selectedLot.id) && (
                  <button
                    type="button"
                    onClick={() => handleFixSource(selectedLot.id)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Fix Wastage Source ({selectedLot.rack})</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>Wastage Sources Resolved</span>
            <span className="font-mono font-bold text-white">
              {fixedIds.length} / {problemIds.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
