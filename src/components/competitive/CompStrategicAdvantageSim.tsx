import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  FileBarChart2,
  MapPin,
  Send,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

type Step = 'START' | 'REPORTS_GENERATED' | 'MARKET_ANALYZED' | 'SUBMITTED' | 'APPROVED';

const CITIES = [
  {
    id: 'pokhara',
    name: 'Pokhara',
    salesGrowth: '+38% YoY',
    demographics: 'High young families & tourism',
    profitability: '26% projected margin',
    trend: 'Strong modern grocery demand',
    isBest: true,
  },
  {
    id: 'dharan',
    name: 'Dharan',
    salesGrowth: '+9% YoY',
    demographics: 'Saturated local competitors',
    profitability: '11% projected margin',
    trend: 'Slow category growth',
    isBest: false,
  },
  {
    id: 'birgunj',
    name: 'Birgunj',
    salesGrowth: '+6% YoY',
    demographics: 'High price sensitivity',
    profitability: '8% projected margin',
    trend: 'Thin retail margins',
    isBest: false,
  },
];

export function CompStrategicAdvantageSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>('START');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const handleGenerateReports = () => {
    soundFx.playPop();
    setStep('REPORTS_GENERATED');
    setWrongMsg(null);
  };

  const handleSelectMarket = (cityId: string, isBest: boolean) => {
    if (step === 'START') {
      soundFx.playAlert();
      setWrongMsg('First generate MIS reports (sales, demographics, profitability, trends).');
      return;
    }
    setSelectedCity(cityId);
    if (isBest) {
      soundFx.playPop();
      setWrongMsg(null);
      setStep('MARKET_ANALYZED');
    } else {
      soundFx.playAlert();
      setWrongMsg('Margin and demand growth here are weak. Check Pokhara in the MIS reports!');
    }
  };

  const handleSubmitRecommendation = () => {
    soundFx.playPop();
    setStep('SUBMITTED');
  };

  const handleTopMgmtApprove = () => {
    soundFx.playVictory();
    setStep('APPROVED');
    if (!rewarded) {
      setRewarded(true);
      onComplete(25000);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setStep('START');
    setSelectedCity(null);
    setWrongMsg(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART EXPANSION STRATEGY · POKHARA BRANCH DECISION
          </span>
          <h3 className="font-display text-lg font-bold">
            {step === 'APPROVED'
              ? 'Top Management Approved Pokhara Branch! Strategic Advantage Secured (+NPR 25,000)'
              : 'Follow the 5-Step MIS Strategic Workflow for Pokhara Expansion'}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* 5-Stage Progress Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        {[
          { key: '1', label: '1. Generate MIS Reports', done: step !== 'START' },
          { key: '2', label: '2. Regional Analysis', done: step === 'MARKET_ANALYZED' || step === 'SUBMITTED' || step === 'APPROVED' },
          { key: '3', label: '3. Identify Pokhara', done: selectedCity === 'pokhara' && step !== 'START' },
          { key: '4', label: '4. Submit Proposal', done: step === 'SUBMITTED' || step === 'APPROVED' },
          { key: '5', label: '5. Final Approval', done: step === 'APPROVED' },
        ].map((item) => (
          <div
            key={item.key}
            className={`px-3 py-2 rounded-lg border font-medium flex items-center gap-1.5 ${
              item.done
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 shrink-0 ${item.done ? 'text-emerald-400' : 'text-slate-600'}`}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: MIS Reports Across Markets */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              MIS Market Comparison (Sales · Demographics · Profitability · Trends)
            </span>
            {step === 'START' && (
              <motion.button
                type="button"
                onClick={handleGenerateReports}
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <FileBarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Generate MIS Reports</span>
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CITIES.map((city) => {
              const isSelected = selectedCity === city.id;
              const revealed = step !== 'START';
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelectMarket(city.id, city.isBest)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected && city.isBest
                      ? 'bg-emerald-950/40 border-emerald-400'
                      : isSelected
                        ? 'bg-rose-950/40 border-rose-500'
                        : revealed
                          ? 'bg-slate-900 border-slate-700 hover:border-amber-400'
                          : 'bg-slate-900/50 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-white inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      {city.name}
                    </span>
                    {isSelected && city.isBest && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    )}
                  </div>

                  {revealed ? (
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <p className="text-sky-300">Sales: {city.salesGrowth}</p>
                      <p className="text-emerald-300">Profit: {city.profitability}</p>
                      <p className="text-slate-400 font-sans">{city.demographics}</p>
                      <p className="text-slate-300 font-sans">{city.trend}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Click Generate MIS Reports to inspect data.</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Regional Manager -> Top Management Decision Box */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                MANAGEMENT DECISION DESK
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Regional & Top Management Review
              </h4>
            </div>

            {step === 'START' && (
              <p className="text-xs text-slate-300 leading-relaxed">
                Step 1: Click <strong>Generate MIS Reports</strong> to view sales reports, demographics, branch profitability, and purchasing trends.
              </p>
            )}

            {step === 'REPORTS_GENERATED' && (
              <p className="text-xs text-slate-200 leading-relaxed">
                Step 2 & 3: As the Regional Manager, analyze the reports on the left and click the most profitable expansion market.
              </p>
            )}

            {step === 'MARKET_ANALYZED' && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-emerald-200">
                  <strong>Pokhara Identified:</strong> +38% sales growth and 26% projected margin outpace all other cities.
                </div>
                <button
                  type="button"
                  onClick={handleSubmitRecommendation}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>4. Submit Proposal to Top Management</span>
                </button>
              </motion.div>
            )}

            {step === 'SUBMITTED' && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 text-xs text-sky-200">
                  <strong>Top Management Desk:</strong> Proposal received with full MIS demographic & profitability backing.
                </div>
                <button
                  type="button"
                  onClick={handleTopMgmtApprove}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" aria-hidden="true" />
                  <span>5. Approve Pokhara Branch Expansion</span>
                </button>
              </motion.div>
            )}

            {step === 'APPROVED' && (
              <motion.div
                initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400 text-xs text-emerald-100 space-y-1.5"
              >
                <p className="font-bold text-emerald-300 text-sm">
                  Strategic Expansion Approved: SmartMart Pokhara!
                </p>
                <p>
                  Because MIS linked sales trends, demographics, and margin forecasts, top management launched Pokhara ahead of competitors.
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {wrongMsg && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{wrongMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-slate-400 pt-3 border-t border-slate-700">
            MIS turns raw regional data into confident executive decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
