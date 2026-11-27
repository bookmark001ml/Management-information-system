import { useState } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Briefcase,
  Trophy,
  Compass,
  Cpu,
  Monitor,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface SidebarProps {
  activeSection: 'importance' | 'operations' | 'competitive' | 'decision' | 'software' | 'computers';
  activeSoftwareSub?: 'concepts' | 'os' | null;
  onNavigateHome: () => void;
  onNavigateOperations: () => void;
  onNavigateCompetitive: () => void;
  onNavigateDecision: () => void;
  onNavigateSoftwareConcepts: () => void;
  onNavigateSoftwareOs: () => void;
  onNavigateComputers: () => void;
}

export function Sidebar({
  activeSection,
  activeSoftwareSub,
  onNavigateHome,
  onNavigateOperations,
  onNavigateCompetitive,
  onNavigateDecision,
  onNavigateSoftwareConcepts,
  onNavigateSoftwareOs,
  onNavigateComputers,
}: SidebarProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [softwareOpen, setSoftwareOpen] = useState(
    activeSection === 'software'
  );

  const handleToggleSidebar = () => {
    soundFx.playClick();
    setIsSidebarCollapsed((c) => !c);
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className={`hidden lg:flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 transition-[width] duration-200 ${
        isSidebarCollapsed ? 'w-16' : 'w-68'
      }`}
    >
      {/* Top Collapse Toggle */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2">
        {!isSidebarCollapsed && (
          <span className="font-mono text-[11px] font-semibold text-slate-400 px-1.5 truncate">
            MENU
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-auto w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Main Sidebar Topics */}
      <div className="p-3 flex-1 space-y-2">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateHome();
          }}
          title="Importance of MIS"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            activeSection === 'importance'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="truncate">Importance of MIS</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateOperations();
          }}
          title="Role of MIS in Business Operations"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
            activeSection === 'operations'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="leading-snug">Role of MIS in Business Operations</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateCompetitive();
          }}
          title="Role of MIS in Competitive Advantage"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
            activeSection === 'competitive'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Trophy className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="leading-snug">Role of MIS in Competitive Advantage</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateDecision();
          }}
          title="Role of MIS in Decision-Making"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
            activeSection === 'decision'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="leading-snug">Role of MIS in Decision-Making</span>
          )}
        </button>

        {/* Software Topic with Expandable Child Topics */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (isSidebarCollapsed) {
                setIsSidebarCollapsed(false);
                setSoftwareOpen(true);
                if (activeSection !== 'software') {
                  onNavigateSoftwareConcepts();
                }
              } else {
                const nextOpen = !softwareOpen;
                setSoftwareOpen(nextOpen);
                if (nextOpen && activeSection !== 'software') {
                  onNavigateSoftwareConcepts();
                }
              }
            }}
            aria-expanded={softwareOpen}
            title="Software"
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'software'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-200 hover:bg-slate-800 hover:text-white'
            } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          >
            <span className="inline-flex items-center gap-3 min-w-0">
              <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
              {!isSidebarCollapsed && <span className="truncate">Software</span>}
            </span>
            {!isSidebarCollapsed &&
              (softwareOpen ? (
                <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
              ))}
          </button>

          {!isSidebarCollapsed && softwareOpen && (
            <div className="pl-5 pt-0.5 space-y-1.5">
              {/* Child 1 (Above Types of Operating System): Software Lecture Notes */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onNavigateSoftwareConcepts();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeSection === 'software' && activeSoftwareSub === 'concepts'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Software
              </button>

              {/* Child 2: Types of Operating System */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onNavigateSoftwareOs();
                }}
                aria-expanded={activeSection === 'software' && activeSoftwareSub === 'os'}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeSection === 'software' && activeSoftwareSub === 'os'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Types of Operating System
              </button>
              {activeSection === 'software' && activeSoftwareSub === 'os' && (
                <p className="px-3 py-1.5 text-[11px] leading-relaxed text-slate-300 bg-slate-950/70 border border-cyan-500/25 rounded-lg">
                  System software that manages hardware, memory, and programs so users and apps run smoothly.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Types of Computer (3D Tree Explorer) */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onNavigateComputers();
          }}
          title="Types of Computer (3D Tree)"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
            activeSection === 'computers'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'text-slate-200 hover:bg-slate-800 hover:text-white'
          } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Monitor className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="leading-snug">Types of Computer</span>
          )}
        </button>
      </div>
    </aside>
  );
}
