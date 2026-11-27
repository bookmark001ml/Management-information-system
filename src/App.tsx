import { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { MIS_TOPICS } from './data/misTopics';
import { OPERATIONS_TOPICS } from './data/operationsTopics';
import { COMPETITIVE_TOPICS } from './data/competitiveTopics';
import { DECISION_TOPICS } from './data/decisionTopics';
import { OS_TOPICS } from './data/osTopics';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './components/OverviewPage';
import { TopicPage } from './components/TopicPage';
import { OperationsOverviewPage } from './components/OperationsOverviewPage';
import { OperationsTopicPage } from './components/OperationsTopicPage';
import { CompetitiveOverviewPage } from './components/CompetitiveOverviewPage';
import { CompetitiveTopicPage } from './components/CompetitiveTopicPage';
import { DecisionOverviewPage } from './components/DecisionOverviewPage';
import { DecisionTopicPage } from './components/DecisionTopicPage';
import { OsLearningLabPage } from './components/software/OsLearningLabPage';
import { SoftwareConceptsPage } from './components/software/SoftwareConceptsPage';
import { ComputerTypesPage } from './components/computers/ComputerTypesPage';
import { COMPUTER_TYPE_NODES } from './data/computerTypes';
import { soundFx } from './utils/soundFx';

interface RouteState {
  section: 'importance' | 'operations' | 'competitive' | 'decision' | 'software' | 'computers';
  slug: string | null;
  osComplete?: boolean;
  softwareView?: 'concepts' | 'os';
}

function getRouteFromHash(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { section: 'importance', slug: null };

  if (hash === 'computers' || hash.startsWith('computers/')) {
    return { section: 'computers', slug: null };
  }

  if (hash === 'software' || hash.startsWith('software/')) {
    if (hash === 'software' || hash === 'software/concepts') {
      return { section: 'software', slug: null, softwareView: 'concepts' };
    }
    const rest = hash.replace(/^software\/?(?:os\/?)?/, '');
    if (rest === 'complete') {
      return { section: 'software', slug: null, osComplete: true, softwareView: 'os' };
    }
    const matched = OS_TOPICS.find((t) => t.slug === rest);
    return {
      section: 'software',
      slug: matched ? matched.slug : OS_TOPICS[0].slug,
      osComplete: false,
      softwareView: 'os',
    };
  }

  if (hash === 'operations' || hash.startsWith('operations/')) {
    const clean = hash.replace(/^operations\/?/, '');
    if (!clean) return { section: 'operations', slug: null };
    const exists = OPERATIONS_TOPICS.some((t) => t.slug === clean);
    return { section: 'operations', slug: exists ? clean : null };
  }

  if (hash === 'competitive' || hash.startsWith('competitive/')) {
    const clean = hash.replace(/^competitive\/?/, '');
    if (!clean) return { section: 'competitive', slug: null };
    const exists = COMPETITIVE_TOPICS.some((t) => t.slug === clean);
    return { section: 'competitive', slug: exists ? clean : null };
  }

  if (hash === 'decision' || hash.startsWith('decision/')) {
    const clean = hash.replace(/^decision\/?/, '');
    if (!clean) return { section: 'decision', slug: null };
    const exists = DECISION_TOPICS.some((t) => t.slug === clean);
    return { section: 'decision', slug: exists ? clean : null };
  }

  const clean = hash.replace(/^topic\//, '');
  const exists = MIS_TOPICS.some((t) => t.slug === clean);
  return { section: 'importance', slug: exists ? clean : null };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => getRouteFromHash());
  const [clearedSlugs, setClearedSlugs] = useState<string[]>([]);
  const [opsClearedSlugs, setOpsClearedSlugs] = useState<string[]>([]);
  const [compClearedSlugs, setCompClearedSlugs] = useState<string[]>([]);
  const [decisionClearedSlugs, setDecisionClearedSlugs] = useState<string[]>([]);
  const [osExploredSlugs, setOsExploredSlugs] = useState<string[]>([]);
  const [bakeryCash, setBakeryCash] = useState<number>(50000);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('theme-mode') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    soundFx.enabled = soundOn;
  }, [soundOn]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem('theme-mode', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    soundFx.playClick();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateToHome = () => {
    window.location.hash = '/';
    setRoute({ section: 'importance', slug: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTopic = (slug: string) => {
    window.location.hash = `/topic/${slug}`;
    setRoute({ section: 'importance', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOperations = () => {
    window.location.hash = '/operations';
    setRoute({ section: 'operations', slug: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOperationTopic = (slug: string) => {
    window.location.hash = `/operations/${slug}`;
    setRoute({ section: 'operations', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCompetitive = () => {
    window.location.hash = '/competitive';
    setRoute({ section: 'competitive', slug: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCompetitiveTopic = (slug: string) => {
    window.location.hash = `/competitive/${slug}`;
    setRoute({ section: 'competitive', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDecision = () => {
    window.location.hash = '/decision';
    setRoute({ section: 'decision', slug: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDecisionTopic = (slug: string) => {
    window.location.hash = `/decision/${slug}`;
    setRoute({ section: 'decision', slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSoftwareConcepts = () => {
    window.location.hash = '/software/concepts';
    setRoute({ section: 'software', slug: null, softwareView: 'concepts' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSoftwareOs = (slug?: string) => {
    const targetSlug = slug ?? OS_TOPICS[0].slug;
    window.location.hash = `/software/os/${targetSlug}`;
    setRoute({ section: 'software', slug: targetSlug, osComplete: false, softwareView: 'os' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSoftwareOsComplete = () => {
    window.location.hash = '/software/os/complete';
    setRoute({ section: 'software', slug: null, osComplete: true, softwareView: 'os' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToComputers = () => {
    window.location.hash = '/computers';
    setRoute({ section: 'computers', slug: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMission = (slug: string, rewardNpr: number) => {
    setClearedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      setBakeryCash((cash) => cash + rewardNpr);
      return [...prev, slug];
    });
  };

  const handleCompleteOpsMission = (slug: string, rewardNpr: number) => {
    setOpsClearedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      setBakeryCash((cash) => cash + rewardNpr);
      return [...prev, slug];
    });
  };

  const handleCompleteCompMission = (slug: string, rewardNpr: number) => {
    setCompClearedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      setBakeryCash((cash) => cash + rewardNpr);
      return [...prev, slug];
    });
  };

  const handleCompleteDecisionMission = (slug: string, rewardNpr: number) => {
    setDecisionClearedSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      setBakeryCash((cash) => cash + rewardNpr);
      return [...prev, slug];
    });
  };

  const handleMarkOsExplored = (slug: string) => {
    setOsExploredSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  };

  const handleResetProgress = () => {
    setClearedSlugs([]);
    setOpsClearedSlugs([]);
    setCompClearedSlugs([]);
    setDecisionClearedSlugs([]);
    setBakeryCash(50000);
    if (route.section === 'operations') {
      navigateToOperations();
    } else if (route.section === 'competitive') {
      navigateToCompetitive();
    } else if (route.section === 'decision') {
      navigateToDecision();
    } else {
      navigateToHome();
    }
  };

  const handleResetOsLab = () => {
    setOsExploredSlugs([]);
    navigateToSoftwareOs(OS_TOPICS[0].slug);
  };

  const activeImportanceTopic =
    route.section === 'importance' && route.slug
      ? MIS_TOPICS.find((t) => t.slug === route.slug) ?? null
      : null;

  const activeOperationsTopic =
    route.section === 'operations' && route.slug
      ? OPERATIONS_TOPICS.find((t) => t.slug === route.slug) ?? null
      : null;

  const activeCompetitiveTopic =
    route.section === 'competitive' && route.slug
      ? COMPETITIVE_TOPICS.find((t) => t.slug === route.slug) ?? null
      : null;

  const activeDecisionTopic =
    route.section === 'decision' && route.slug
      ? DECISION_TOPICS.find((t) => t.slug === route.slug) ?? null
      : null;

  const currentClearedCount =
    route.section === 'operations'
      ? opsClearedSlugs.length
      : route.section === 'competitive'
        ? compClearedSlugs.length
        : route.section === 'decision'
          ? decisionClearedSlugs.length
          : clearedSlugs.length;

  const currentTotalCount =
    route.section === 'operations'
      ? OPERATIONS_TOPICS.length
      : route.section === 'competitive'
        ? COMPETITIVE_TOPICS.length
        : route.section === 'decision'
          ? DECISION_TOPICS.length
          : MIS_TOPICS.length;

  const hasAnyProgress =
    clearedSlugs.length > 0 ||
    opsClearedSlugs.length > 0 ||
    compClearedSlugs.length > 0 ||
    decisionClearedSlugs.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeSection={route.section}
        activeSoftwareSub={route.section === 'software' ? (route.softwareView ?? 'concepts') : null}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigateHome={navigateToHome}
        onNavigateOperations={navigateToOperations}
        onNavigateCompetitive={navigateToCompetitive}
        onNavigateDecision={navigateToDecision}
        onNavigateSoftwareConcepts={navigateToSoftwareConcepts}
        onNavigateSoftwareOs={navigateToSoftwareOs}
        onNavigateComputers={navigateToComputers}
      />

      {/* Compact HUD Strip (Hidden inside Software Lab & Computers 3D Explorer) */}
      {route.section !== 'software' && route.section !== 'computers' && (
        <div className="bg-slate-900/90 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-5 font-mono tabular-nums">
              <div>
                <span className="text-slate-400 mr-1.5">
                  {route.section === 'importance' ? 'BAKERY BANK:' : 'SMARTMART BANK:'}
                </span>
                <span className="font-bold text-amber-400">
                  NPR {bakeryCash.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 mr-1.5">MISSIONS CLEARED:</span>
                <span className="font-bold text-emerald-400">
                  {currentClearedCount} / {currentTotalCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundOn((s) => !s)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
              >
                {soundOn ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Sound ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>Muted</span>
                  </>
                )}
              </button>

              {hasAnyProgress && (
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <Sidebar
          activeSection={route.section}
          activeSoftwareSub={route.section === 'software' ? (route.softwareView ?? 'concepts') : null}
          onNavigateHome={navigateToHome}
          onNavigateOperations={navigateToOperations}
          onNavigateCompetitive={navigateToCompetitive}
          onNavigateDecision={navigateToDecision}
          onNavigateSoftwareConcepts={navigateToSoftwareConcepts}
          onNavigateSoftwareOs={() => navigateToSoftwareOs()}
          onNavigateComputers={navigateToComputers}
        />

        <main className="flex-1 min-w-0">
          {route.section === 'computers' ? (
            <ComputerTypesPage />
          ) : route.section === 'software' ? (
            route.softwareView === 'concepts' ? (
              <SoftwareConceptsPage onNavigateToOsTypes={() => navigateToSoftwareOs()} />
            ) : (
              <OsLearningLabPage
                activeSlug={route.slug}
                isCompleteScreen={Boolean(route.osComplete)}
                exploredSlugs={osExploredSlugs}
                onMarkExplored={handleMarkOsExplored}
                onSelectTopic={(slug) => navigateToSoftwareOs(slug)}
                onSelectComplete={navigateToSoftwareOsComplete}
                onResetLab={handleResetOsLab}
              />
            )
          ) : route.section === 'operations' ? (
            activeOperationsTopic ? (
              <OperationsTopicPage
                topic={activeOperationsTopic}
                isCompleted={opsClearedSlugs.includes(activeOperationsTopic.slug)}
                onCompleteMission={handleCompleteOpsMission}
                onNavigateOperationsHome={navigateToOperations}
                onSelectTopic={navigateToOperationTopic}
              />
            ) : (
              <OperationsOverviewPage
                clearedSlugs={opsClearedSlugs}
                onSelectTopic={navigateToOperationTopic}
                onResetProgress={handleResetProgress}
              />
            )
          ) : route.section === 'competitive' ? (
            activeCompetitiveTopic ? (
              <CompetitiveTopicPage
                topic={activeCompetitiveTopic}
                isCompleted={compClearedSlugs.includes(activeCompetitiveTopic.slug)}
                onCompleteMission={handleCompleteCompMission}
                onNavigateCompetitiveHome={navigateToCompetitive}
                onSelectTopic={navigateToCompetitiveTopic}
              />
            ) : (
              <CompetitiveOverviewPage
                clearedSlugs={compClearedSlugs}
                onSelectTopic={navigateToCompetitiveTopic}
                onResetProgress={handleResetProgress}
              />
            )
          ) : route.section === 'decision' ? (
            activeDecisionTopic ? (
              <DecisionTopicPage
                topic={activeDecisionTopic}
                isCompleted={decisionClearedSlugs.includes(activeDecisionTopic.slug)}
                onCompleteMission={handleCompleteDecisionMission}
                onNavigateDecisionHome={navigateToDecision}
                onSelectTopic={navigateToDecisionTopic}
              />
            ) : (
              <DecisionOverviewPage
                clearedSlugs={decisionClearedSlugs}
                onSelectTopic={navigateToDecisionTopic}
                onResetProgress={handleResetProgress}
              />
            )
          ) : activeImportanceTopic ? (
            <TopicPage
              topic={activeImportanceTopic}
              isCompleted={clearedSlugs.includes(activeImportanceTopic.slug)}
              onCompleteMission={handleCompleteMission}
              onNavigateHome={navigateToHome}
              onSelectTopic={navigateToTopic}
            />
          ) : (
            <OverviewPage
              clearedSlugs={clearedSlugs}
              onSelectTopic={navigateToTopic}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-display text-sm font-bold text-white">
            {route.section === 'computers'
              ? '3D Computer Explorer · Types of Computers'
              : route.section === 'software'
                ? 'Software Lab · Types of Operating Systems'
                : route.section === 'operations'
                  ? 'SmartMart · Role of MIS in Business Operations'
                  : route.section === 'competitive'
                    ? 'SmartMart · Role of MIS in Competitive Advantage'
                    : route.section === 'decision'
                      ? 'SmartMart · Role of MIS in Decision-Making'
                      : 'Kathmandu Bakery · MIS Tycoon'}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            {route.section === 'computers'
              ? COMPUTER_TYPE_NODES.map((node) => (
                  <span key={node.id} className="whitespace-nowrap">
                    {node.shortName}
                  </span>
                ))
              : route.section === 'software'
              ? OS_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => navigateToSoftwareOs(topic.slug)}
                    className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                      route.slug === topic.slug ? 'font-semibold text-cyan-400' : ''
                    }`}
                  >
                    {topic.index}. {topic.shortTitle}
                  </button>
                ))
              : route.section === 'operations'
                ? OPERATIONS_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => navigateToOperationTopic(topic.slug)}
                      className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                        route.slug === topic.slug ? 'font-semibold text-amber-400' : ''
                      }`}
                    >
                      {topic.index}. {topic.shortTitle}
                    </button>
                  ))
                : route.section === 'competitive'
                  ? COMPETITIVE_TOPICS.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => navigateToCompetitiveTopic(topic.slug)}
                        className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                          route.slug === topic.slug ? 'font-semibold text-amber-400' : ''
                        }`}
                      >
                        {topic.index}. {topic.shortTitle}
                      </button>
                    ))
                  : route.section === 'decision'
                    ? DECISION_TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => navigateToDecisionTopic(topic.slug)}
                          className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                            route.slug === topic.slug ? 'font-semibold text-amber-400' : ''
                          }`}
                        >
                          {topic.index}. {topic.shortTitle}
                        </button>
                      ))
                    : MIS_TOPICS.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => navigateToTopic(topic.slug)}
                          className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                            route.slug === topic.slug ? 'font-semibold text-amber-400' : ''
                          }`}
                        >
                          {topic.index}. {topic.shortTitle}
                        </button>
                      ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
