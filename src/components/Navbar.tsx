import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Sun, Moon } from 'lucide-react';
import { MIS_TOPICS } from '../data/misTopics';
import { OPERATIONS_TOPICS } from '../data/operationsTopics';
import { COMPETITIVE_TOPICS } from '../data/competitiveTopics';
import { DECISION_TOPICS } from '../data/decisionTopics';
import { OS_TOPICS } from '../data/osTopics';

interface NavbarProps {
  activeSection: 'importance' | 'operations' | 'competitive' | 'decision' | 'software';
  activeSlug: string | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onNavigateTopic: (slug: string) => void;
  onNavigateOperations: () => void;
  onNavigateOperationTopic: (slug: string) => void;
  onNavigateCompetitive: () => void;
  onNavigateCompetitiveTopic: (slug: string) => void;
  onNavigateDecision: () => void;
  onNavigateDecisionTopic: (slug: string) => void;
  onNavigateSoftwareOs: (slug?: string) => void;
}

export function Navbar({
  activeSection,
  activeSlug,
  theme,
  onToggleTheme,
  onNavigateHome,
  onNavigateTopic,
  onNavigateOperations,
  onNavigateOperationTopic,
  onNavigateCompetitive,
  onNavigateCompetitiveTopic,
  onNavigateDecision,
  onNavigateDecisionTopic,
  onNavigateSoftwareOs,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(
    activeSection === 'software'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTopicsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentList =
    activeSection === 'operations'
      ? OPERATIONS_TOPICS
      : activeSection === 'competitive'
        ? COMPETITIVE_TOPICS
        : activeSection === 'decision'
          ? DECISION_TOPICS
          : activeSection === 'software'
            ? OS_TOPICS
            : MIS_TOPICS;

  const currentIdx = activeSlug
    ? currentList.findIndex((t) => t.slug === activeSlug)
    : -1;
  const nextTopic =
    currentIdx >= 0 && currentIdx < currentList.length - 1
      ? currentList[currentIdx + 1]
      : currentList[0];

  const handleSelectTopic = (slug: string) => {
    setTopicsOpen(false);
    setMobileOpen(false);
    if (activeSection === 'operations') {
      onNavigateOperationTopic(slug);
    } else if (activeSection === 'competitive') {
      onNavigateCompetitiveTopic(slug);
    } else if (activeSection === 'decision') {
      onNavigateDecisionTopic(slug);
    } else if (activeSection === 'software') {
      onNavigateSoftwareOs(slug);
    } else {
      onNavigateTopic(slug);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            onNavigateHome();
          }}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          Kathmandu Bakery
        </button>

        {/* Zone 2: Clean single-line nav links (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => {
              setTopicsOpen(false);
              onNavigateHome();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              activeSection === 'importance' && activeSlug === null
                ? 'text-white border-amber-500'
                : 'border-transparent hover:text-white'
            }`}
          >
            Importance
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicsOpen(false);
              onNavigateOperations();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              activeSection === 'operations' && activeSlug === null
                ? 'text-white border-amber-500'
                : 'border-transparent hover:text-white'
            }`}
          >
            Operations
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicsOpen(false);
              onNavigateCompetitive();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              activeSection === 'competitive' && activeSlug === null
                ? 'text-white border-amber-500'
                : 'border-transparent hover:text-white'
            }`}
          >
            Competitive
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicsOpen(false);
              onNavigateDecision();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              activeSection === 'decision' && activeSlug === null
                ? 'text-white border-amber-500'
                : 'border-transparent hover:text-white'
            }`}
          >
            Decision-Making
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicsOpen(false);
              onNavigateSoftwareOs();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
              activeSection === 'software'
                ? 'text-cyan-300 border-cyan-400'
                : 'border-transparent hover:text-white'
            }`}
          >
            Software
          </button>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setTopicsOpen((o) => !o)}
              aria-expanded={topicsOpen}
              className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                activeSlug !== null && activeSection !== 'software'
                  ? 'text-white border-amber-500'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <span>Topics</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  topicsOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {topicsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-1.5 text-xs font-medium text-slate-400 border-b border-slate-800 mb-1">
                  {activeSection === 'operations'
                    ? '6 Business Operations'
                    : activeSection === 'competitive'
                      ? '8 Competitive Advantage'
                      : activeSection === 'decision'
                        ? '7 Decision-Making'
                        : activeSection === 'software'
                          ? '8 Types of Operating System'
                          : '8 Importance of MIS'}
                </div>
                <div className="space-y-0.5">
                  {currentList.map((topic) => {
                    const isCurrent = topic.slug === activeSlug;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-300 font-semibold'
                            : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="font-mono tabular-nums text-xs text-amber-400">
                          {topic.index}
                        </span>
                        <span className="truncate">{topic.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Theme Toggle + 1 primary action (Desktop) + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTopic(nextTopic.slug)}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{activeSlug ? `Next: ${nextTopic.shortTitle}` : 'Start 01'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 max-h-[82vh] overflow-y-auto space-y-2">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onNavigateHome();
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
              activeSection === 'importance'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span>Importance of MIS</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onNavigateOperations();
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
              activeSection === 'operations'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span>Role of MIS in Business Operations</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onNavigateCompetitive();
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
              activeSection === 'competitive'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span>Role of MIS in Competitive Advantage</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onNavigateDecision();
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
              activeSection === 'decision'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span>Role of MIS in Decision-Making</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setMobileSoftwareOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
                activeSection === 'software'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <span>Software</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileSoftwareOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {mobileSoftwareOpen && (
              <div className="pl-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigateSoftwareOs();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[44px] ${
                    activeSection === 'software'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800/70 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>Types of Operating System</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
