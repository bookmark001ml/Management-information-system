import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ScanBarcode,
  Clock,
  MessageSquareWarning,
  Sliders,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  Radar,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface CompGameProps {
  onComplete: (rewardNpr: number) => void;
  isCompleted: boolean;
}

export function CompInnovationTrackingSim({ onComplete }: CompGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const [tracked, setTracked] = useState(false);
  const [uiImproved, setUiImproved] = useState(false);
  const [helperAdded, setHelperAdded] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const solved = uiImproved && helperAdded;

  const checkoutTimeSec =
    225 - (uiImproved ? 105 : 0) - (helperAdded ? 65 : 0);
  const usagePct = 28 + (uiImproved ? 30 : 0) + (helperAdded ? 32 : 0);
  const satisfactionPct = 36 + (uiImproved ? 31 : 0) + (helperAdded ? 28 : 0);

  const handleTrackService = () => {
    soundFx.playPop();
    setTracked(true);
  };

  const toggleImprovement = (kind: 'ui' | 'helper') => {
    if (!tracked) {
      soundFx.playAlert();
      return;
    }
    const nextUi = kind === 'ui' ? !uiImproved : uiImproved;
    const nextHelper = kind === 'helper' ? !helperAdded : helperAdded;
    setUiImproved(nextUi);
    setHelperAdded(nextHelper);

    if (nextUi && nextHelper) {
      soundFx.playVictory();
      if (!rewarded) {
        setRewarded(true);
        onComplete(18000);
      }
    } else {
      soundFx.playPop();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setTracked(false);
    setUiImproved(false);
    setHelperAdded(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="font-mono text-[11px] text-amber-300 block">
            SMARTMART SELF-CHECKOUT · SERVICE PERFORMANCE TRACKING
          </span>
          <h3 className="font-display text-lg font-bold">
            {solved
              ? 'Self-Checkout Fixed! Fast 55s Checkout & 95% Satisfaction (+NPR 18,000)'
              : 'Monitor Self-Checkout Usage, Speed & Feedback to Fix Customer Friction'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!tracked && (
            <motion.button
              type="button"
              onClick={handleTrackService}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Radar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1. View Self-Checkout MIS Report</span>
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

      {/* 3 Live MIS Service Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
            <ScanBarcode className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            Customer Usage
          </span>
          <p className="font-mono tabular-nums text-2xl font-bold text-white mt-1.5">
            {usagePct}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            Avg Checkout Time
          </span>
          <p
            className={`font-mono tabular-nums text-2xl font-bold mt-1.5 ${
              solved ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {Math.floor(checkoutTimeSec / 60)}m {String(checkoutTimeSec % 60).padStart(2, '0')}s
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 block">Customer Satisfaction</span>
          <p
            className={`font-mono tabular-nums text-2xl font-bold mt-1.5 ${
              solved ? 'text-emerald-400' : 'text-amber-300'
            }`}
          >
            {satisfactionPct}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: MIS Service Diagnostic Feed */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Self-Checkout Customer Feedback Report
              </span>
              <span className={`font-mono font-bold ${solved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {solved ? 'SMOOTH FLOW' : tracked ? 'USABILITY ISSUES' : 'PENDING'}
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                solved
                  ? 'bg-emerald-950/35 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                {solved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <MessageSquareWarning className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span>
                  {solved
                    ? 'Customer Feedback: "Super easy screen and helpful attendant—checked out in under a minute!"'
                    : tracked
                      ? 'MIS Alert: 64% of shoppers struggle to find produce codes and cancel at the kiosk screen.'
                      : 'Click "1. View Self-Checkout MIS Report" to inspect usage, checkout speed, and customer feedback.'}
                </span>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1.5">
                <span className="text-slate-400">Self-Checkout Adoption</span>
                <span className="text-sky-300 font-bold">{usagePct}% of shoppers</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${solved ? 'bg-emerald-500' : 'bg-sky-500'}`}
                  animate={{ width: `${usagePct}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 170, damping: 20 }
                  }
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Tracking new innovations post-launch ensures technology actually improves the customer experience.
          </p>
        </div>

        {/* Right: Continuous Improvement Actions */}
        <div className="lg:col-span-6 bg-slate-800/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[11px] text-amber-300 block">
                CONTINUOUS IMPROVEMENT ACTIONS
              </span>
              <h4 className="font-display text-base font-bold text-white mt-0.5">
                Fix Self-Checkout Experience
              </h4>
            </div>

            <button
              type="button"
              onClick={() => toggleImprovement('ui')}
              className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                uiImproved
                  ? 'bg-emerald-950/60 border-emerald-400 text-white'
                  : tracked
                    ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Simplify Kiosk Touchscreen Interface</p>
                  <p className="text-[11px] text-slate-400">Add large visual produce icons & clear prompts</p>
                </div>
              </div>
              {uiImproved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => toggleImprovement('helper')}
              className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                helperAdded
                  ? 'bg-emerald-950/60 border-emerald-400 text-white'
                  : tracked
                    ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold">Provide Self-Checkout Staff Assistance</p>
                  <p className="text-[11px] text-slate-400">Station a friendly guide beside kiosks</p>
                </div>
              </div>
              {helperAdded && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />}
            </button>
          </div>

          <p className="text-xs text-slate-300 pt-3 border-t border-slate-700">
            {solved
              ? 'Continuous improvement complete! Customers now breeze through self-checkout.'
              : 'View the MIS report first, then apply both interface and assistance improvements.'}
          </p>
        </div>
      </div>
    </div>
  );
}
