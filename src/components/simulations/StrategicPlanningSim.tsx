import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { TrendingUp, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface MissionGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

interface ZoneOption {
  id: 'boudha' | 'patan' | 'lazimpat';
  name: string;
  growth: string;
  threeYearSales: [number, number, number]; // Year 1, Year 2, Year 3 (in Lakh NPR)
  winning: boolean;
  payback: number;
}

const YEARS = ['Year 1', 'Year 2', 'Year 3'];

const ZONES: ZoneOption[] = [
  {
    id: 'patan',
    name: 'Patan',
    growth: '+12% flat over 3 yrs',
    threeYearSales: [14, 15, 16],
    winning: false,
    payback: 34,
  },
  {
    id: 'lazimpat',
    name: 'Lazimpat',
    growth: '+15% slow over 3 yrs',
    threeYearSales: [16, 17, 18],
    winning: false,
    payback: 30,
  },
  {
    id: 'boudha',
    name: 'Boudha',
    growth: '+260% 3-yr surge',
    threeYearSales: [10, 21, 36],
    winning: true,
    payback: 10,
  },
];

const FIREWORK_BURSTS = [
  { x: '22%', y: '28%', color: '#fbbf24', delay: 0 },
  { x: '52%', y: '20%', color: '#34d399', delay: 0.2 },
  { x: '78%', y: '32%', color: '#38bdf8', delay: 0.35 },
  { x: '38%', y: '44%', color: '#f472b6', delay: 0.5 },
];

function FireworksOverlay() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const angles = Array.from({ length: 12 }).map((_, i) => (i * 360) / 12);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {FIREWORK_BURSTS.map((burst, bIdx) => (
        <div
          key={bIdx}
          className="absolute"
          style={{ left: burst.x, top: burst.y }}
        >
          {angles.map((deg, sIdx) => {
            const rad = (deg * Math.PI) / 180;
            const dist = 46;
            const tx = Math.cos(rad) * dist;
            const ty = Math.sin(rad) * dist;
            return (
              <motion.span
                key={sIdx}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: burst.color }}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                animate={{
                  x: [0, tx, tx * 1.15],
                  y: [0, ty, ty * 1.15 + 10],
                  scale: [0.3, 1.15, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 0.9,
                  duration: 1.15,
                  delay: burst.delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function StrategicPlanningSim({ onComplete }: MissionGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [inspectId, setInspectId] = useState<'boudha' | 'patan' | 'lazimpat'>('patan');
  const [builtZone, setBuiltZone] = useState<string | null>(null);

  const zone = ZONES.find((z) => z.id === inspectId) ?? ZONES[0];
  const builtObj = ZONES.find((z) => z.id === builtZone);

  const handleInspect = (id: 'boudha' | 'patan' | 'lazimpat') => {
    soundFx.playClick();
    setInspectId(id);
  };

  const handleBuild = () => {
    setBuiltZone(zone.id);
    if (zone.winning) {
      soundFx.playVictory();
      onComplete(35000);
    } else {
      soundFx.playAlert();
    }
  };

  const showFireworks = builtObj?.id === 'boudha';

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6 relative overflow-hidden">
      <AnimatePresence>{showFireworks && <FireworksOverlay />}</AnimatePresence>

      {/* 3-Year Trend Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-20">
        <div className="flex flex-wrap gap-2">
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => handleInspect(z.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                inspectId === z.id
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Review {z.name} (3-Yr Data)
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleBuild}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>Open New Branch in {zone.name}</span>
        </button>
      </div>

      {/* 3-Year Sales Data Bars + Expansion Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-20">
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-300">
              3-Year Sales & Customer Growth · {zone.name} (NPR Lakhs)
            </span>
            <span
              className={`font-mono text-xs font-bold inline-flex items-center gap-1 ${
                zone.winning ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              {zone.growth}
            </span>
          </div>

          <div className="h-44 flex items-end gap-6 sm:gap-10 px-4 pt-4 pb-2 border-b border-slate-800">
            {zone.threeYearSales.map((val, i) => (
              <div key={YEARS[i]} className="flex-1 h-full flex flex-col items-center justify-end">
                <span className="font-mono text-xs font-bold text-slate-300 mb-1.5">
                  NPR {val}L
                </span>
                <div className="w-full max-w-[64px] h-full flex items-end bg-slate-900 rounded-t-lg p-1">
                  <motion.div
                    className={`w-full rounded-t ${
                      zone.winning ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    animate={{ height: `${Math.round((val / 40) * 100)}%` }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 200, damping: 22, delay: i * 0.06 }
                    }
                  />
                </div>
                <span className="font-mono text-xs text-slate-400 mt-2">{YEARS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`lg:col-span-5 rounded-xl border p-5 flex flex-col justify-between transition-colors ${
            builtObj
              ? builtObj.winning
                ? 'bg-emerald-950/60 border-emerald-500/60'
                : 'bg-rose-950/50 border-rose-500/60'
              : 'bg-slate-800/70 border-slate-700'
          }`}
        >
          {builtObj ? (
            <div className="space-y-4">
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${
                  builtObj.winning ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {builtObj.winning ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    WINNING EXPANSION · +NPR 35,000
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                    INCORRECT STRATEGIC PLANNING
                  </>
                )}
              </div>

              <p className="font-mono text-3xl font-bold text-white">
                {builtObj.winning ? `${builtObj.payback} Months Payback` : 'Incorrect Strategic Planning'}
              </p>

              <p className="text-xs text-slate-200 leading-relaxed">
                {builtObj.winning
                  ? '3 years of MIS sales data confirm Boudha customers tripled (10L → 36L)—an ideal location for a new branch!'
                  : `${builtObj.name} stayed flat over 3 years (${builtObj.growth}). Review all 3-year datasets and open in the fastest-growing area!`}
              </p>
            </div>
          ) : (
            <div className="space-y-3 my-auto">
              <p className="font-display text-base font-bold text-white">
                Mission: Review 3 Years of Sales Data
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare 3-year sales growth across Patan, Lazimpat, and Boudha, then choose where Kathmandu Bakery should open its new branch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
