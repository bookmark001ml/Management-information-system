import { motion, useReducedMotion } from 'motion/react';
import { Play, CheckCircle2, Trophy } from 'lucide-react';
import { MIS_TOPICS } from '../data/misTopics';
import { soundFx } from '../utils/soundFx';

interface OverviewPageProps {
  clearedSlugs: string[];
  onSelectTopic: (slug: string) => void;
  onResetProgress: () => void;
}

export function OverviewPage({
  clearedSlugs,
  onSelectTopic,
  onResetProgress,
}: OverviewPageProps) {
  const prefersReducedMotion = useReducedMotion();

  const nextUncleared =
    MIS_TOPICS.find((t) => !clearedSlugs.includes(t.slug)) ?? MIS_TOPICS[0];

  const allCleared = clearedSlugs.length === MIS_TOPICS.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8">
      {/* Game Title Arena Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="font-mono text-xs font-semibold text-amber-400">
            KATHMANDU BAKERY · MIS TYCOON
          </span>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1.5"
            style={{ textWrap: 'balance' }}
          >
            {allCleared
              ? 'All 8 MIS Missions Mastered!'
              : 'Run Kathmandu Bakery Through 8 Live MIS Missions'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            Play each interactive mission to learn how Management Information Systems boost
            profits, cut waste, and align your team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {allCleared ? (
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onResetProgress();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer transition-colors"
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              <span>Play Campaign Again</span>
            </button>
          ) : (
            <motion.button
              type="button"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              onClick={() => {
                soundFx.playClick();
                onSelectTopic(nextUncleared.slug);
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-amber-950/40"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>
                {clearedSlugs.length === 0
                  ? 'Start Mission 01'
                  : `Continue: ${nextUncleared.index}. ${nextUncleared.shortTitle}`}
              </span>
            </motion.button>
          )}
        </div>
      </section>

      {/* 8 Playable Mission Tiles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Select Any Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MIS_TOPICS.map((topic, idx) => {
            const isDone = clearedSlugs.includes(topic.slug);
            return (
              <motion.button
                key={topic.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTopic(topic.slug);
                }}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: prefersReducedMotion ? 0 : idx * 0.03 }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className={`text-left rounded-xl border p-5 flex flex-col justify-between transition-colors cursor-pointer group ${
                  isDone
                    ? 'bg-slate-900 border-emerald-500/50 hover:border-emerald-400'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-amber-400">
                      MISSION {topic.index}
                    </span>
                    {isDone ? (
                      <span className="font-mono text-[11px] font-bold text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        CLEARED
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-slate-500">
                        {topic.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-white mt-2.5 group-hover:text-amber-300 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {topic.missionGoal}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className={isDone ? 'text-emerald-400' : 'text-amber-400'}>
                    {isDone ? 'Replay Mission' : 'Play Mission'}
                  </span>
                  <Play
                    className={`w-3.5 h-3.5 fill-current ${
                      isDone ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
