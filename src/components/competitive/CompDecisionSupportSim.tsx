import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

const STRATEGIES = [
  {
    id: 'price-cut',
    name: 'Slash All Prices by 25%',
    salesTrend: '+12% short-term',
    profitMargin: '4% (Loss Risk)',
    customerRetention: 'Low — price-war churn',
    netImpact: '-NPR 3.2L profit',
    isBest: false,
  },
  {
    id: 'loyalty',
    name: 'Offer Double Loyalty Points',
    salesTrend: '+16% steady',
    profitMargin: '17% healthy',
    customerRetention: 'High for existing members',
    netImpact: '+NPR 2.1L profit',
    isBest: false,
  },
  {
    id: 'bundles',
    name: 'Provide Smart Product Bundles',
    salesTrend: '+34% basket growth',
    profitMargin: '23% strong margin',
    customerRetention: 'Highest — attracts families & wins share',
    netImpact: '+NPR 4.8L profit',
    isBest: true,
  },
];

export function CompDecisionSupportSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const isOptimal = chosen === 'bundles';

  const handleLoadMisData = () => {
    soundFx.playPop();
    setDataLoaded(true);
  };

  const handleSelectStrategy = (id: string, isBest: boolean) => {
    if (!dataLoaded) {
      soundFx.playAlert();
      return;
    }
    setChosen(id);
    if (isBest) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(22000);
      }
    } else {
      soundFx.playAlert();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setDataLoaded(false);
    setChosen(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-rose-400 inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            RIVAL ALERT: COMPETITOR LAUNCHED MAJOR DISCOUNT CAMPAIGN
          </span>
          <h3 className="font-display text-lg font-bold mt-0.5">
            {isOptimal
              ? 'Best Strategy Chosen! Smart Product Bundles Beat Rival (+NPR 22,000)'
              : 'Compare MIS Data & Choose the Best Competitive Strategy'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!dataLoaded && (
            <motion.button
              type="button"
              onClick={handleLoadMisData}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. Load MIS Sales, Margins & Buying Data</span>
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

      {/* Three Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STRATEGIES.map((strat) => {
          const isPicked = chosen === strat.id;
          const right = isPicked && strat.isBest;
          const wrong = isPicked && !strat.isBest;

          return (
            <button
              key={strat.id}
              type="button"
              onClick={() => handleSelectStrategy(strat.id, strat.isBest)}
              className={`text-left rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-colors cursor-pointer ${
                right
                  ? 'bg-emerald-950/50 border-emerald-400'
                  : wrong
                    ? 'bg-rose-950/40 border-rose-500'
                    : dataLoaded
                      ? 'bg-slate-950 border-slate-700 hover:border-amber-400'
                      : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-white">
                    {strat.name}
                  </span>
                  {right && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />}
                  {wrong && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />}
                </div>

                {dataLoaded ? (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 text-xs font-mono"
                  >
                    <div className="flex justify-between p-2 rounded bg-slate-900">
                      <span className="text-slate-400">Sales Trend</span>
                      <span className="text-sky-300 font-bold">{strat.salesTrend}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900">
                      <span className="text-slate-400">Profit Margin</span>
                      <span
                        className={`font-bold ${
                          strat.isBest ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {strat.profitMargin}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900">
                      <span className="text-slate-400 block">Customer Behavior:</span>
                      <span className="font-sans text-slate-200">{strat.customerRetention}</span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Click “1. Load MIS Sales, Margins & Buying Data” above to compare outcomes.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">
                  {dataLoaded ? strat.netImpact : 'Unanalyzed'}
                </span>
                <span className={right ? 'text-emerald-400' : 'text-amber-400'}>
                  {right ? 'Selected' : 'Choose Strategy'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chosen ?? (dataLoaded ? 'loaded' : 'idle')}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isOptimal
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : chosen
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          {isOptimal
            ? 'Smart choice! MIS proved Smart Product Bundles deliver +34% basket growth, a 23% margin, and +NPR 4.8L net profit without starting a destructive price war.'
            : chosen === 'price-cut'
              ? 'Across-the-board 25% price cuts crush profit margins to 4% and lose money! Check which strategy delivers the highest sales lift and profit.'
              : chosen === 'loyalty'
                ? 'Double loyalty points help keep existing members, but MIS shows another option delivers stronger basket growth (+34%), margin (23%), and +NPR 4.8L profit.'
                : 'Load MIS sales trends, profit margins, and purchasing data first, then pick the strategy with the strongest profit and retention.'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
