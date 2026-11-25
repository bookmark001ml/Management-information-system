import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OPERATIONS_TOPICS, OperationsTopic } from '../data/operationsTopics';
import { OpsDecisionMakingSim } from './operations/OpsDecisionMakingSim';
import { OpsEfficiencySim } from './operations/OpsEfficiencySim';
import { OpsCompetitiveSim } from './operations/OpsCompetitiveSim';
import { OpsPerformanceSim } from './operations/OpsPerformanceSim';
import { OpsResourceSim } from './operations/OpsResourceSim';
import { OpsProblemAnalysisSim } from './operations/OpsProblemAnalysisSim';
import { soundFx } from '../utils/soundFx';

interface OperationsTopicPageProps {
  topic: OperationsTopic;
  isCompleted: boolean;
  onCompleteMission: (slug: string, rewardNpr: number) => void;
  onNavigateOperationsHome: () => void;
  onSelectTopic: (slug: string) => void;
}

export function OperationsTopicPage({
  topic,
  isCompleted,
  onCompleteMission,
  onNavigateOperationsHome,
  onSelectTopic,
}: OperationsTopicPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentIndex = OPERATIONS_TOPICS.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? OPERATIONS_TOPICS[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < OPERATIONS_TOPICS.length - 1 ? OPERATIONS_TOPICS[currentIndex + 1] : null;

  const handleComplete = (rewardNpr: number) => {
    onCompleteMission(topic.slug, rewardNpr);
  };

  const renderGame = () => {
    const props = { onComplete: handleComplete, isCompleted };
    switch (topic.slug) {
      case 'improved-decision-making':
        return <OpsDecisionMakingSim {...props} />;
      case 'enhanced-operational-efficiency':
        return <OpsEfficiencySim {...props} />;
      case 'competitive-advantage':
        return <OpsCompetitiveSim {...props} />;
      case 'performance-tracking-control':
        return <OpsPerformanceSim {...props} />;
      case 'resource-optimization':
        return <OpsResourceSim {...props} />;
      case 'problem-identification-analysis':
        return <OpsProblemAnalysisSim {...props} />;
      default:
        return <OpsDecisionMakingSim {...props} />;
    }
  };

  return (
    <motion.article
      key={topic.slug}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-16 space-y-5"
    >
      {/* Compact Mission Switcher Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateOperationsHome();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Business Operations</span>
        </button>

        <div
          className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0"
          role="navigation"
          aria-label="Operations mission quick switcher"
        >
          {OPERATIONS_TOPICS.map((t) => {
            const isCurrent = t.slug === topic.slug;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(t.slug);
                }}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-mono tabular-nums mr-1">{t.index}</span>
                <span className="hidden xl:inline">{t.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold">
            <span className="text-amber-400">OPERATIONS {topic.index} OF 06</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Topic: {topic.topicFocus}</span>
            {isCompleted && (
              <span className="text-emerald-400 inline-flex items-center gap-1">
                <span aria-hidden="true">·</span>
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                CLEARED
              </span>
            )}
          </div>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-0.5"
            style={{ textWrap: 'balance' }}
          >
            {topic.title}
          </h1>
        </div>
        <p className="text-sm text-slate-300 max-w-md md:text-right">
          {topic.missionGoal}
        </p>
      </header>

      {/* Playable Game Stage */}
      <section aria-label={`Interactive game for ${topic.title}`}>
        {renderGame()}
      </section>

      {/* Bottom Prev / Next Mission Navigation */}
      <nav
        aria-label="Operations mission pagination"
        className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4"
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
            <ArrowLeft className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>
              {prevTopic.index}. {prevTopic.shortTitle}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onNavigateOperationsHome();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Operations Map</span>
          </button>
        )}

        {nextTopic ? (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onSelectTopic(nextTopic.slug);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs sm:text-sm font-bold text-slate-950 cursor-pointer"
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
              onNavigateOperationsHome();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs sm:text-sm font-bold text-slate-950 cursor-pointer"
          >
            <span>Finish & View Operations</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </nav>
    </motion.article>
  );
}
