import { useState } from 'react';
import {
  Activity,
  Binary,
  HeartPulse,
  Cpu,
  Server,
  HardDrive,
  Monitor,
  Laptop,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Briefcase,
  Lightbulb,
} from 'lucide-react';
import {
  COMPUTER_NODE_MAP,
  COMPUTER_TYPE_NODES,
  type ComputerNodeId,
} from '../../data/computerTypes';
import { Computer3DViewport } from './Computer3DViewport';
import { soundFx } from '../../utils/soundFx';

const NODE_ICONS: Record<ComputerNodeId, typeof Cpu> = {
  analog: Activity,
  digital: Binary,
  hybrid: HeartPulse,
  supercomputer: Cpu,
  mainframe: Server,
  minicomputer: HardDrive,
  desktop: Monitor,
  laptop: Laptop,
  smartphone: Smartphone,
};

export function ComputerTypesPage() {
  const [selectedId, setSelectedId] = useState<ComputerNodeId>('analog');
  const activeNode = COMPUTER_NODE_MAP[selectedId];
  const currentIndex = COMPUTER_TYPE_NODES.findIndex((n) => n.id === selectedId);

  const handleSelect = (id: ComputerNodeId) => {
    soundFx.playClick();
    setSelectedId(id);
  };

  const handleStep = (dir: -1 | 1) => {
    const nextIdx = (currentIndex + dir + COMPUTER_TYPE_NODES.length) % COMPUTER_TYPE_NODES.length;
    handleSelect(COMPUTER_TYPE_NODES[nextIdx].id);
  };

  const renderTreeNodeButton = (id: ComputerNodeId, compact = false) => {
    const node = COMPUTER_NODE_MAP[id];
    const Icon = NODE_ICONS[id];
    const isActive = selectedId === id;

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleSelect(id)}
        aria-pressed={isActive}
        className={`group relative flex items-center gap-2 rounded-xl border text-left transition-all cursor-pointer ${
          compact ? 'px-2.5 py-2' : 'px-3 py-2.5'
        } ${
          isActive
            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
            : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800'
        }`}
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isActive ? node.accentHex : 'rgba(51, 65, 85, 0.55)',
            color: isActive ? '#020617' : node.accentHex,
          }}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-bold leading-tight truncate">{node.shortName}</div>
          <div className="text-[10px] text-slate-400 leading-tight truncate">
            {node.scaleBadge}
          </div>
        </div>
      </button>
    );
  };

  const isDataBranchActive = activeNode.branch === 'data';
  const isSizeBranchActive = activeNode.branch === 'size';
  const isMicroActive = activeNode.parentLabel === 'Microcomputer';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Interactive 3D Computer Architecture
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Types of Computers · 3D Classification Tree
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Click any computer node in the tree diagram to launch its live WebGL 3D procedural animation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Prev</span>
          </button>
          <span className="font-mono text-xs text-slate-400 px-1.5">
            {currentIndex + 1} / {COMPUTER_TYPE_NODES.length}
          </span>
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Interactive Hierarchical Tree Diagram */}
      <section
        aria-label="Types of computers classification tree"
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 overflow-x-auto"
      >
        <div className="min-w-[680px] flex flex-col items-center">
          {/* Root Node */}
          <div className="px-5 py-2.5 rounded-xl bg-slate-950 border-2 border-cyan-500/70 text-center shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Classification Root
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white">
              Types of Computers
            </div>
          </div>

          {/* Vertical Trunk from Root */}
          <div className="w-0.5 h-5 bg-slate-600" aria-hidden="true" />

          {/* Horizontal Main Split Bar */}
          <div className="w-full max-w-4xl grid grid-cols-12 gap-4 relative">
            {/* Horizontal Connector Line across the 2 branches */}
            <div
              className="hidden sm:block absolute top-0 left-[22%] right-[22%] h-0.5 bg-slate-600"
              aria-hidden="true"
            />

            {/* LEFT BRANCH: By Data Handling (5 cols) */}
            <div className="col-span-5 flex flex-col items-center">
              <div
                className={`w-0.5 h-4 ${
                  isDataBranchActive ? 'bg-amber-400' : 'bg-slate-600'
                }`}
                aria-hidden="true"
              />
              <div
                className={`w-full rounded-xl border p-3 transition-colors ${
                  isDataBranchActive
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="text-center mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                    Branch 1 · By Data Handling
                  </span>
                  <div className="text-xs font-bold text-white">
                    How Signals Are Processed
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {renderTreeNodeButton('analog')}
                  {renderTreeNodeButton('digital')}
                  {renderTreeNodeButton('hybrid')}
                </div>
              </div>
            </div>

            {/* RIGHT BRANCH: By Size & Processing Power (7 cols) */}
            <div className="col-span-7 flex flex-col items-center">
              <div
                className={`w-0.5 h-4 ${
                  isSizeBranchActive ? 'bg-cyan-400' : 'bg-slate-600'
                }`}
                aria-hidden="true"
              />
              <div
                className={`w-full rounded-xl border p-3 transition-colors ${
                  isSizeBranchActive
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="text-center mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                    Branch 2 · By Size &amp; Processing Power
                  </span>
                  <div className="text-xs font-bold text-white">
                    Scale, Speed &amp; User Capacity
                  </div>
                </div>

                {/* Top tier: Supercomputer, Mainframe, Minicomputer */}
                <div className="grid grid-cols-3 gap-2">
                  {renderTreeNodeButton('supercomputer', true)}
                  {renderTreeNodeButton('mainframe', true)}
                  {renderTreeNodeButton('minicomputer', true)}
                </div>

                {/* Sub-branch connector to Microcomputer */}
                <div className="flex flex-col items-center my-2">
                  <div
                    className={`w-0.5 h-3 ${
                      isMicroActive ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                    aria-hidden="true"
                  />
                  <div
                    className={`px-3 py-1 rounded-lg border text-[11px] font-bold ${
                      isMicroActive
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    Microcomputer (Personal Computer)
                  </div>
                  <div
                    className={`w-0.5 h-2.5 ${
                      isMicroActive ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                {/* Microcomputer children */}
                <div className="grid grid-cols-3 gap-2">
                  {renderTreeNodeButton('desktop', true)}
                  {renderTreeNodeButton('laptop', true)}
                  {renderTreeNodeButton('smartphone', true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Procedural WebGL Animation Stage */}
      <Computer3DViewport
        selectedId={selectedId}
        accentHex={activeNode.accentHex}
        label={activeNode.name}
      />

      {/* Focused BBA Understanding Strip */}
      <section
        aria-label="Selected computer explanation"
        className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeNode.accentHex }}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl font-bold text-white">
                {activeNode.name}
              </h2>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">{activeNode.tagline}</p>
          </div>

          <span className="font-mono text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
            {activeNode.parentLabel
              ? `Size Branch → ${activeNode.parentLabel}`
              : activeNode.branch === 'data'
                ? 'Classification: Data Handling'
                : 'Classification: Size & Power'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              <span>How It Works</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeNode.howItWorks}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>What To Watch in 3D</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeNode.visualCue}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
              <span>Real-World Business Use</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeNode.realWorldUse}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
