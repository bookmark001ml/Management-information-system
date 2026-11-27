import { useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeSection: 'importance' | 'operations' | 'competitive' | 'decision' | 'software' | 'computers';
  activeSoftwareSub?: 'concepts' | 'os' | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onNavigateOperations: () => void;
  onNavigateCompetitive: () => void;
  onNavigateDecision: () => void;
  onNavigateSoftwareConcepts: () => void;
  onNavigateSoftwareOs: (slug?: string) => void;
  onNavigateComputers: () => void;
}

export function Navbar({
  activeSection,
  activeSoftwareSub,
  theme,
  onToggleTheme,
  onNavigateHome,
  onNavigateOperations,
  onNavigateCompetitive,
  onNavigateDecision,
  onNavigateSoftwareConcepts,
  onNavigateSoftwareOs,
  onNavigateComputers,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(
    activeSection === 'software'
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Left: Kathmandu Bakery wordmark */}
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

        {/* Right: Light/Dark Mode Toggle (+ mobile drawer trigger on small screens) */}
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
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (since Sidebar is hidden below lg) */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 max-h-[82vh] overflow-y-auto space-y-2">
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
              <div className="pl-4 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigateSoftwareConcepts();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[44px] ${
                    activeSection === 'software' && activeSoftwareSub === 'concepts'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800/70 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>Software</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigateSoftwareOs();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[44px] ${
                    activeSection === 'software' && activeSoftwareSub === 'os'
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

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onNavigateComputers();
            }}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer min-h-[44px] ${
              activeSection === 'computers'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span>Types of Computer</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}
    </header>
  );
}
