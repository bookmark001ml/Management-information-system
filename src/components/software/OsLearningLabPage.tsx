import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Receipt,
  Zap,
  Server,
  Terminal,
  Laptop,
  Network,
  Cpu,
  ShieldAlert,
  Bot,
  Smartphone,
  Eye,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  OS_TOPICS,
  OS_GENERAL_DEFINITION,
  OsExample,
  OsTopic,
} from '../../data/osTopics';
import { BatchOsSim } from './os/BatchOsSim';
import { MultiprogrammingOsSim } from './os/MultiprogrammingOsSim';
import { MultitaskingOsSim } from './os/MultitaskingOsSim';
import { MultiprocessingOsSim } from './os/MultiprocessingOsSim';
import { DistributedOsSim } from './os/DistributedOsSim';
import { NetworkOsSim } from './os/NetworkOsSim';
import { RealTimeOsSim } from './os/RealTimeOsSim';
import { MobileOsSim } from './os/MobileOsSim';
import { soundFx } from '../../utils/soundFx';

interface OsLearningLabPageProps {
  activeSlug: string | null;
  isCompleteScreen: boolean;
  exploredSlugs: string[];
  onMarkExplored: (slug: string) => void;
  onSelectTopic: (slug: string) => void;
  onSelectComplete: () => void;
  onResetLab: () => void;
}

function renderExampleIcon(iconName: OsExample['iconName']) {
  const cls = 'w-5 h-5 text-cyan-300 shrink-0';
  switch (iconName) {
    case 'payroll':
      return <Receipt className={cls} aria-hidden="true" />;
    case 'electricity':
      return <Zap className={cls} aria-hidden="true" />;
    case 'mainframe':
      return <Server className={cls} aria-hidden="true" />;
    case 'linux':
      return <Terminal className={cls} aria-hidden="true" />;
    case 'windows':
    case 'macos':
      return <Laptop className={cls} aria-hidden="true" />;
    case 'server':
      return <Server className={cls} aria-hidden="true" />;
    case 'network':
      return <Network className={cls} aria-hidden="true" />;
    case 'cluster':
      return <Cpu className={cls} aria-hidden="true" />;
    case 'airbag':
      return <ShieldAlert className={cls} aria-hidden="true" />;
    case 'robot':
      return <Bot className={cls} aria-hidden="true" />;
    case 'android':
    case 'ios':
      return <Smartphone className={cls} aria-hidden="true" />;
    default:
      return <Cpu className={cls} aria-hidden="true" />;
  }
}

export function OsLearningLabPage({
  activeSlug,
  isCompleteScreen,
  exploredSlugs,
  onMarkExplored,
  onSelectTopic,
  onSelectComplete,
  onResetLab,
}: OsLearningLabPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const topic: OsTopic =
    (activeSlug && OS_TOPICS.find((t) => t.slug === activeSlug)) || OS_TOPICS[0];

  const currentIdx = OS_TOPICS.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIdx > 0 ? OS_TOPICS[currentIdx - 1] : null;
  const nextTopic =
    currentIdx < OS_TOPICS.length - 1 ? OS_TOPICS[currentIdx + 1] : null;

  // Reveal Stages 2-5 only AFTER the animation completes (or if student already explored / clicks Show Key Takeaways)
  const [insightsRevealed, setInsightsRevealed] = useState<boolean>(() =>
    exploredSlugs.includes(topic.slug)
  );
  // Small definition toggle below topic title when clicked
  const [definitionOpen, setDefinitionOpen] = useState(false);
  // Interactive Real-World Example selection
  const [selectedExampleIdx, setSelectedExampleIdx] = useState<number | null>(null);

  useEffect(() => {
    setInsightsRevealed(exploredSlugs.includes(topic.slug));
    setSelectedExampleIdx(null);
    setDefinitionOpen(false);
  }, [topic.slug, exploredSlugs]);

  const handleSimulationFinish = () => {
    setInsightsRevealed(true);
    onMarkExplored(topic.slug);
  };

  const renderSimulation = () => {
    const props = { onSimulationComplete: handleSimulationFinish };
    switch (topic.slug) {
      case 'batch-operating-system':
        return <BatchOsSim {...props} />;
      case 'multiprogramming-operating-system':
        return <MultiprogrammingOsSim {...props} />;
      case 'multitasking-operating-system':
        return <MultitaskingOsSim {...props} />;
      case 'multiprocessing-operating-system':
        return <MultiprocessingOsSim {...props} />;
      case 'distributed-operating-system':
        return <DistributedOsSim {...props} />;
      case 'network-operating-system':
        return <NetworkOsSim {...props} />;
      case 'real-time-operating-system':
        return <RealTimeOsSim {...props} />;
      case 'mobile-operating-system':
        return <MobileOsSim {...props} />;
      default:
        return <BatchOsSim {...props} />;
    }
  };

  const selectedExample =
    selectedExampleIdx !== null ? topic.examples[selectedExampleIdx] : null;

  return (
    <div className="min-h-full bg-[#030612] text-slate-100 pb-16">
      {/* Persistent Navigation & Progress System for all 8 OS Topics */}
      <div className="border-b border-cyan-500/20 bg-[#050b1c]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="font-mono font-semibold text-cyan-400 block">
                SOFTWARE · TYPES OF OPERATING SYSTEMS
              </span>
              <p className="text-[11px] text-slate-400">
                {OS_GENERAL_DEFINITION}
              </p>
            </div>
            <span className="font-mono tabular-nums text-slate-300">
              Progress: {exploredSlugs.length} / {OS_TOPICS.length} observed
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {OS_TOPICS.map((item) => {
              const isCurrent = !isCompleteScreen && item.slug === topic.slug;
              const isVisited = exploredSlugs.includes(item.slug);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onSelectTopic(item.slug);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 border ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : isVisited
                        ? 'bg-slate-900 text-cyan-200 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-mono tabular-nums">{item.index}</span>
                  <span>{item.shortTitle}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onSelectComplete();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                isCompleteScreen
                  ? 'bg-purple-500 text-slate-950 font-bold border-purple-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Summary
            </button>
          </div>
        </div>
      </div>

      {isCompleteScreen ? (
        /* Final Completion Screen */
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#07112a] via-[#050a18] to-[#120b29] p-6 sm:p-8 text-center space-y-4"
          >
            <Sparkles className="w-8 h-8 text-cyan-300 mx-auto" aria-hidden="true" />
            <h1
              className="font-display text-2xl sm:text-4xl font-bold text-white"
              style={{ textWrap: 'balance' }}
            >
              Types of Operating Systems Completed
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              You have explored {exploredSlugs.length} of {OS_TOPICS.length} interactive operating system simulations. Click any card below to revisit its animation.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(OS_TOPICS[0].slug);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                <span>Revisit From 01. Batch OS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onResetLab();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Lab Progress</span>
              </button>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OS_TOPICS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(item.slug);
                }}
                className="text-left p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{item.index}</span>
                  {exploredSlugs.includes(item.slug) && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  )}
                </div>
                <p className="font-display text-sm font-bold text-white">{item.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.smallDefinition}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Individual Topic Screen: ANIMATION FIRST -> VISUAL UNDERSTANDING -> MINIMAL EXPLANATION */
        <motion.article
          key={topic.slug}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6"
        >
          {/* Minimal Topic Title + Clickable Small Definition below it */}
          <header className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-semibold">
                  {topic.index} OF 08
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setDefinitionOpen((o) => !o);
                  }}
                  aria-expanded={definitionOpen}
                  className="block text-left group cursor-pointer"
                >
                  <h1
                    className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white inline-flex items-center gap-2 group-hover:text-cyan-200 transition-colors"
                    style={{ textWrap: 'balance' }}
                  >
                    <span>{topic.title}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-mono font-medium text-cyan-300">
                      <Info className="w-3 h-3" aria-hidden="true" />
                      <span>{definitionOpen ? 'Hide Definition' : 'Definition'}</span>
                    </span>
                  </h1>
                </button>
              </div>

              {!insightsRevealed && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    handleSimulationFinish();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-medium text-slate-300 cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Show Key Takeaways</span>
                </button>
              )}
            </div>

            <AnimatePresence>
              {definitionOpen && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 leading-relaxed max-w-3xl">
                    {topic.smallDefinition}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Stage 1: Immersive Animated Simulation */}
          <section aria-label={`Animated simulation for ${topic.title}`}>
            {renderSimulation()}
          </section>

          {/* Stages 2-5: Revealed After Animation Finishes */}
          <AnimatePresence>
            {insightsRevealed && (
              <motion.section
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                aria-label="Visual understanding and key takeaways"
              >
                {/* Stage 2: Visual Understanding (1 short sentence <= 20 words) */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#091229] to-purple-950/40 border border-cyan-500/30">
                  <span className="font-mono text-[11px] font-semibold text-cyan-400 block mb-1">
                    HOW IT WORKS
                  </span>
                  <p className="font-display text-base sm:text-lg font-semibold text-white">
                    {topic.mechanismSentence}
                  </p>
                </div>

                {/* Stage 3 & Stage 4: Exactly ONE Advantage (Green) + ONE Disadvantage (Red) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-emerald-950/35 border border-emerald-500/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>KEY ADVANTAGE</span>
                    </div>
                    <p className="text-sm text-emerald-50 font-medium leading-relaxed">
                      {topic.advantage}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-rose-950/35 border border-rose-500/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                      <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>KEY DISADVANTAGE</span>
                    </div>
                    <p className="text-sm text-rose-50 font-medium leading-relaxed">
                      {topic.disadvantage}
                    </p>
                  </div>
                </div>

                {/* Stage 5: Exactly TWO Interactive Real-World Examples */}
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-purple-300">
                      REAL-WORLD EXAMPLES · CLICK TO SEE WHAT HAPPENS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topic.examples.map((ex, idx) => {
                      const isSelected = selectedExampleIdx === idx;
                      return (
                        <button
                          key={ex.label}
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedExampleIdx(isSelected ? null : idx);
                          }}
                          aria-expanded={isSelected}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 text-white'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                              {renderExampleIcon(ex.iconName)}
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {ex.label}
                            </span>
                          </span>
                          {isSelected ? (
                            <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded Required Information for Clicked Example */}
                  <AnimatePresence mode="wait">
                    {selectedExample && (
                      <motion.div
                        key={selectedExample.label}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3"
                      >
                        <div>
                          <span className="font-mono text-[11px] font-bold text-cyan-400 block mb-1">
                            WHAT ACTUALLY HAPPENS · {selectedExample.label.toUpperCase()}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {selectedExample.whatHappens}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {selectedExample.howItWorksSteps.map((stepText, stepIdx) => (
                            <div
                              key={stepText}
                              className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                            >
                              <span className="font-mono text-[10px] font-bold text-purple-300 block">
                                STEP {stepIdx + 1}
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {stepText}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Previous / Next Navigation */}
          <nav
            aria-label="Operating system topics pagination"
            className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4"
          >
            {prevTopic ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(prevTopic.slug);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span>
                  {prevTopic.index}. {prevTopic.shortTitle}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextTopic ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(nextTopic.slug);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs sm:text-sm font-bold text-slate-950 cursor-pointer"
              >
                <span>
                  Next: {nextTopic.index}. {nextTopic.shortTitle}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectComplete();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-xs sm:text-sm font-bold text-slate-950 cursor-pointer"
              >
                <span>Finish & View Completion Summary</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </nav>
        </motion.article>
      )}
    </div>
  );
}
