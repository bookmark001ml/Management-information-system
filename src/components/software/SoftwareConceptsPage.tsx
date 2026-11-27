import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  HardDrive,
  AppWindow,
  Briefcase,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  Monitor,
  Wrench,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { soundFx } from '../../utils/soundFx';

interface SoftwareConceptsPageProps {
  onNavigateToOsTypes: () => void;
}

type ScenarioId = 'app' | 'driver';

interface ScenarioStep {
  title: string;
  detail: string;
}

interface ScenarioInfo {
  id: ScenarioId;
  label: string;
  userAction: string;
  appLayer: string;
  osLabel: string;
  driverLabel: string;
  hardwareTarget: string;
  steps: ScenarioStep[];
}

const SCENARIOS: ScenarioInfo[] = [
  {
    id: 'app',
    label: 'Open Word / Browser',
    userAction: 'User clicks to open MS Word / Browser',
    appLayer: 'Application Software requests RAM & CPU',
    osLabel: 'Operating System allocates RAM & CPU',
    driverLabel: 'Device Drivers handle display & keyboard',
    hardwareTarget: 'CPU & RAM launch and run the app',
    steps: [
      {
        title: '1. User clicks Open Word / Browser',
        detail: 'User double-clicks MS Word or web browser icon.',
      },
      {
        title: '2. Application requests resources',
        detail: 'Application Software asks the OS to load program files.',
      },
      {
        title: '3. OS allocates RAM & CPU',
        detail: 'Operating System assigns memory and CPU time.',
      },
      {
        title: '4. Hardware executes app',
        detail: 'CPU & RAM run MS Word / Browser on your screen.',
      },
    ],
  },
  {
    id: 'driver',
    label: 'Print Document',
    userAction: 'User clicks Print',
    appLayer: 'Application sends print request to OS',
    osLabel: 'OS forwards print job to Device Driver',
    driverLabel: 'Device Driver sends print signals to Printer',
    hardwareTarget: 'Printer prints the document',
    steps: [
      {
        title: '1. User clicks Print',
        detail: 'User clicks the Print button inside the document.',
      },
      {
        title: '2. Application → OS',
        detail: 'Application sends the print request to the Operating System.',
      },
      {
        title: '3. OS → Device Driver',
        detail: 'Operating System passes the print job to the Printer Device Driver.',
      },
      {
        title: '4. Device Driver → Printer',
        detail: 'Device Driver converts data into hardware signals for the Printer.',
      },
      {
        title: '5. Printer prints document',
        detail: 'Physical Printer prints the page cleanly!',
      },
    ],
  },
];

type SpeedOption = 'slow' | 'normal' | 'fast';

const SPEED_MS: Record<SpeedOption, number> = {
  slow: 1650,
  normal: 950,
  fast: 420,
};

export function SoftwareConceptsPage({
  onNavigateToOsTypes,
}: SoftwareConceptsPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>('normal');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  const activeScenario = SCENARIOS[scenarioIdx];
  const totalSteps = activeScenario.steps.length;

  useEffect(() => {
    if (!hasStarted || !isPlaying) return;
    const timer = setInterval(() => {
      setPulsePhase((p) => {
        if (p >= totalSteps - 1) {
          if (autoPlay) {
            setScenarioIdx((s) => (s + 1) % SCENARIOS.length);
          }
          return 0;
        }
        return p + 1;
      });
    }, SPEED_MS[speed]);
    return () => clearInterval(timer);
  }, [hasStarted, isPlaying, autoPlay, speed, totalSteps]);

  const handleSelectScenario = (idx: number) => {
    soundFx.playClick();
    setScenarioIdx(idx);
    setPulsePhase(0);
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handleToggleAutoPlay = () => {
    soundFx.playClick();
    const nextAuto = !autoPlay;
    setAutoPlay(nextAuto);
    if (nextAuto) {
      setHasStarted(true);
      setIsPlaying(true);
    }
  };

  const animDuration = speed === 'fast' ? 0.35 : speed === 'slow' ? 1.0 : 0.65;
  const isPrint = activeScenario.id === 'driver';
  const lastStepIdx = totalSteps - 1;

  // Derived active states for each tier
  const userActive = hasStarted && (pulsePhase === 0 || pulsePhase === lastStepIdx);
  const appActive = hasStarted && (isPrint ? pulsePhase === 1 : pulsePhase === 0 || pulsePhase === 1);
  const osActive = hasStarted && (isPrint ? pulsePhase === 1 || pulsePhase === 2 : pulsePhase === 1 || pulsePhase === 2);
  const driverActive = hasStarted && isPrint && (pulsePhase === 2 || pulsePhase === 3);
  const hardwareActive = hasStarted && (isPrint ? pulsePhase === 3 || pulsePhase === 4 : pulsePhase === 2 || pulsePhase === 3);

  return (
    <div className="min-h-full bg-[#030612] text-slate-100 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-semibold text-cyan-400">
              SOFTWARE · LECTURE NOTES
            </span>
            <h1
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1"
              style={{ textWrap: 'balance' }}
            >
              Software Concepts & Types of Software
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onNavigateToOsTypes();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <span>Explore Types of Operating System</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </header>

        {/* TOP MOVING ANIMATION: Live Software-to-Hardware Data Flow */}
        <section
          aria-label="Animated diagram of how software connects users to hardware"
          className="rounded-2xl border border-cyan-500/35 bg-[#050a18] p-5 sm:p-6 space-y-5 shadow-2xl shadow-cyan-950/30"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-semibold text-cyan-400">
                LIVE MOVING SIMULATION · HOW SOFTWARE WORKS
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {!hasStarted
                  ? 'Click Open Word / Browser or Print Document (or turn on Auto Play) to start the animation.'
                  : isPrint
                    ? 'Watch the print flow: User clicks Print → Application sends print request to OS → Device Driver → Printer.'
                    : 'Watch instructions flow continuously from User → Application Software → System Software (including Utility Software) → Hardware.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Speed Selector */}
              <div
                className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                role="group"
                aria-label="Animation speed selector"
              >
                {(['slow', 'normal', 'fast'] as SpeedOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSpeed(opt);
                    }}
                    className={`px-2.5 py-1 rounded font-semibold capitalize cursor-pointer whitespace-nowrap ${
                      speed === opt
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Auto Play Toggle */}
              <button
                type="button"
                onClick={handleToggleAutoPlay}
                aria-pressed={autoPlay}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer whitespace-nowrap transition-colors ${
                  autoPlay
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <span>{autoPlay ? 'Auto Play: ON' : 'Auto Play'}</span>
              </button>

              {/* Play / Pause Button */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  if (!hasStarted) {
                    setHasStarted(true);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying((p) => !p);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scenario Selector Buttons (Starts animation when clicked) */}
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((sc, idx) => {
              const isSelected = hasStarted && idx === scenarioIdx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-cyan-400'
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
          </div>

          {/* Moving Stack Animation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left: Animated Stack Layers */}
            <div className="lg:col-span-8 space-y-2.5">
              {/* Layer 1: User */}
              <div
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  userActive
                    ? 'bg-amber-950/35 border-amber-400'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-mono text-[10px] text-amber-300 block">
                      1. END USER
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {hasStarted ? activeScenario.userAction : 'Select a topic above to begin'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-amber-300 font-semibold">
                  {!hasStarted
                    ? 'WAITING'
                    : pulsePhase === 0
                      ? 'USER CLICKS'
                      : pulsePhase === lastStepIdx
                        ? 'COMPLETED ✓'
                        : 'ACTIVE'}
                </span>
              </div>

              {/* Moving Connector 1 */}
              <div className="flex items-center justify-center gap-2 py-0.5">
                <motion.div
                  animate={
                    prefersReducedMotion || !hasStarted || !isPlaying
                      ? undefined
                      : { y: pulsePhase === 0 ? [0, 5, 0] : pulsePhase === lastStepIdx ? [0, -5, 0] : 0 }
                  }
                  transition={{ repeat: Infinity, duration: animDuration }}
                  className="text-cyan-400 flex items-center gap-1 font-mono text-[10px]"
                >
                  {hasStarted && pulsePhase === lastStepIdx ? (
                    <ArrowUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  )}
                  <span>
                    {!hasStarted
                      ? 'Ready for instruction flow'
                      : pulsePhase === lastStepIdx
                        ? isPrint
                          ? 'Document printed for user'
                          : 'App ready on screen'
                        : 'User action enters Application'}
                  </span>
                </motion.div>
              </div>

              {/* Layer 2: Application Software */}
              <div
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  appActive
                    ? 'bg-purple-950/40 border-purple-400'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AppWindow className="w-5 h-5 text-purple-300 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-mono text-[10px] text-purple-300 block">
                      2. APPLICATION SOFTWARE
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {hasStarted ? activeScenario.appLayer : 'MS Word · Web Browser'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-purple-200 hidden sm:inline">
                  {hasStarted && isPrint && pulsePhase === 1 ? 'SENDING TO OS' : 'General Purpose'}
                </span>
              </div>

              {/* Moving Connector 2 */}
              <div className="flex items-center justify-center gap-2 py-0.5">
                <motion.div
                  animate={
                    prefersReducedMotion || !hasStarted || !isPlaying
                      ? undefined
                      : { y: pulsePhase === 1 ? [0, 5, 0] : 0 }
                  }
                  transition={{ repeat: Infinity, duration: animDuration }}
                  className="text-cyan-400 flex items-center gap-1 font-mono text-[10px]"
                >
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isPrint
                      ? 'Application sends print request to Operating System'
                      : 'Relies on System Software platform'}
                  </span>
                </motion.div>
              </div>

              {/* Layer 3: System Software (OS -> Device Driver flow) */}
              <div
                className={`p-4 rounded-xl border transition-colors space-y-3 ${
                  osActive || driverActive
                    ? 'bg-cyan-950/45 border-cyan-400'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-cyan-300">
                    3. SYSTEM SOFTWARE PLATFORM
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {!hasStarted
                      ? 'Idle · Ready to coordinate'
                      : driverActive && isPrint
                        ? activeScenario.driverLabel
                        : activeScenario.osLabel}
                  </span>
                </div>

                {isPrint ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <motion.div
                      animate={
                        prefersReducedMotion || !osActive || !isPlaying
                          ? undefined
                          : { scale: [1, 1.03, 1] }
                      }
                      transition={{ repeat: Infinity, duration: animDuration }}
                      className={`w-full sm:flex-1 px-3 py-2.5 rounded-lg border text-center text-xs font-bold ${
                        osActive
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Operating System (OS)
                    </motion.div>

                    <motion.div
                      animate={
                        prefersReducedMotion || !hasStarted || !isPlaying || pulsePhase !== 2
                          ? undefined
                          : { x: [0, 5, 0] }
                      }
                      transition={{ repeat: Infinity, duration: animDuration }}
                      className="flex items-center gap-1 text-cyan-300 font-mono text-[10px] shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 hidden sm:block" aria-hidden="true" />
                      <ArrowDown className="w-4 h-4 sm:hidden" aria-hidden="true" />
                      <span>OS → Driver</span>
                    </motion.div>

                    <motion.div
                      animate={
                        prefersReducedMotion || !driverActive || !isPlaying
                          ? undefined
                          : { scale: [1, 1.03, 1] }
                      }
                      transition={{ repeat: Infinity, duration: animDuration }}
                      className={`w-full sm:flex-1 px-3 py-2.5 rounded-lg border text-center text-xs font-bold ${
                        driverActive
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Device Driver (Printer)
                    </motion.div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'os', name: 'Operating System' },
                        { id: 'utility', name: 'Utility Software' },
                        { id: 'translator', name: 'Language Processor' },
                        { id: 'driver', name: 'Device Driver' },
                      ] as const
                    ).map((mod) => {
                      const isFocused = mod.id === 'os' && osActive;
                      return (
                        <motion.div
                          key={mod.id}
                          animate={
                            prefersReducedMotion || !isFocused || !isPlaying
                              ? undefined
                              : { scale: [1, 1.04, 1] }
                          }
                          transition={{ repeat: Infinity, duration: animDuration }}
                          className={`px-2.5 py-2 rounded-lg border text-center text-[11px] font-bold ${
                            isFocused
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {mod.name}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Moving Connector 3 */}
              <div className="flex items-center justify-center gap-2 py-0.5">
                <motion.div
                  animate={
                    prefersReducedMotion || !hasStarted || !isPlaying
                      ? undefined
                      : { y: (isPrint ? pulsePhase === 3 : pulsePhase === 2) ? [0, 5, 0] : 0 }
                  }
                  transition={{ repeat: Infinity, duration: animDuration }}
                  className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]"
                >
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isPrint
                      ? 'Device Driver sends commands to Printer'
                      : 'Direct hardware execution'}
                  </span>
                </motion.div>
              </div>

              {/* Layer 4: Physical Hardware */}
              <div
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  hardwareActive
                    ? 'bg-emerald-950/40 border-emerald-400'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-mono text-[10px] text-emerald-300 block">
                      4. PHYSICAL HARDWARE
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {hasStarted ? activeScenario.hardwareTarget : 'CPU · RAM · Printer'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">
                  {hardwareActive ? (isPrint ? 'PRINTING' : 'EXECUTING') : 'READY'}
                </span>
              </div>
            </div>

            {/* Right: Live Flow Status Readout */}
            <div className="lg:col-span-4 rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-4">
              <span className="font-mono text-[11px] font-bold text-cyan-400 block">
                ANIMATION STEP TRACKER
              </span>
              <div className="space-y-2">
                {activeScenario.steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      hasStarted && pulsePhase === idx
                        ? 'bg-cyan-950/50 border-cyan-400 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-bold">{step.title}</p>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      {hasStarted ? step.detail : 'Waiting for topic selection or Auto Play'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LECTURE NOTES BODY */}
        {/* Section 1: What is Software? */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>1. WHAT IS SOFTWARE?</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            <strong>Software</strong> is a collection of instructions, data, and computer programs that tell physical hardware what to do and how to perform specific tasks. While hardware consists of physical components you can touch (CPU, RAM, monitor, keyboard), software is the intangible intelligence that operates them.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Based on function and how it interacts with hardware, software is broadly classified into two primary categories: <strong>System Software</strong> and <strong>Application Software</strong>.
          </p>
        </section>

        {/* Section 2: System Software (OS, Language Processor, Device Driver, Utility Software) */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>2. SYSTEM SOFTWARE</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              <strong>System Software</strong> manages and controls computer hardware components and creates a stable platform for application software to run. It acts as an interface between physical hardware and user applications, runs mostly in the background from boot-up until shutdown, and is typically written in low-level languages like C, C++, or Assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2.1 Operating System */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-display text-base font-bold">
                <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>A. Operating System (OS)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The primary system software that loads when the computer starts. It manages memory (RAM), CPU scheduling, files, security, and hardware-software communication.
              </p>
              <p className="font-mono text-[11px] text-cyan-400">
                Examples: Windows, Linux, macOS, Android, iOS
              </p>
            </div>

            {/* 2.2 Utility Software (Replaces BIOS as requested!) */}
            <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-display text-base font-bold">
                <Wrench className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>B. Utility Software</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Specialized system software designed to maintain, protect, optimize, and repair a computer system so it stays fast, secure, and organized.
              </p>
              <p className="font-mono text-[11px] text-emerald-400">
                Examples: Antivirus (Windows Defender), Disk Cleanup, File Compression (WinRAR / 7-Zip), Backup Tools
              </p>
            </div>

            {/* 2.3 Language Processor */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-display text-base font-bold">
                <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>C. Language Processor (Translator)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Converts human-readable programming code into machine-understandable binary (0s and 1s). Includes <strong>Compilers</strong> (translate whole program at once), <strong>Interpreters</strong> (line-by-line), and <strong>Assemblers</strong> (assembly to machine code).
              </p>
              <p className="font-mono text-[11px] text-purple-300">
                Examples: GCC Compiler, Python Interpreter, MASM Assembler
              </p>
            </div>

            {/* 2.4 Device Driver */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-display text-base font-bold">
                <HardDrive className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>D. Device Driver</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Acts as a specialized communication bridge between the Operating System and attached hardware devices, allowing the OS to control peripherals without knowing internal hardware details.
              </p>
              <p className="font-mono text-[11px] text-amber-400">
                Examples: Printer Driver, Graphics Card (GPU) Driver, Audio & Mouse Drivers
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Application Software */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900 p-6 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold">
              <AppWindow className="w-4 h-4" aria-hidden="true" />
              <span>3. APPLICATION SOFTWARE</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              <strong>Application Software</strong> (commonly called an "app") is designed to help end-users accomplish specific, goal-oriented tasks such as writing documents, managing accounts, or browsing the web. Unlike system software, it cannot run independently and relies on system software to execute. Usually written in high-level languages like Python, Java, or JavaScript.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-display text-base font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>A. General Purpose Software</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ready-made ("off-the-shelf") software built for broad, everyday tasks used by millions of people across industries.
              </p>
              <p className="font-mono text-[11px] text-cyan-400">
                Examples: MS Word, MS Excel, Google Chrome, PowerPoint, VLC Media Player
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-display text-base font-bold">
                <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>B. Customized (Tailor-Made) Software</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Software specifically developed or tailored for a particular organization’s unique business workflow and rules.
              </p>
              <p className="font-mono text-[11px] text-amber-400">
                Examples: Railway Reservation System, Hospital Management System, SmartMart Inventory & Billing System
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: System Software vs Application Software Comparison Table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-white">
            4. System Software vs. Application Software
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-cyan-400 font-mono text-xs">
                  <th className="py-2.5 pr-4">Feature</th>
                  <th className="py-2.5 px-4">System Software</th>
                  <th className="py-2.5 pl-4">Application Software</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Primary Purpose</td>
                  <td className="py-3 px-4">Manages hardware and provides a platform for apps to run.</td>
                  <td className="py-3 pl-4">Helps end-users complete specific real-world tasks.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Dependency</td>
                  <td className="py-3 px-4">Runs independently from computer startup.</td>
                  <td className="py-3 pl-4">Depends on system software to execute.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">User Interaction</td>
                  <td className="py-3 px-4">Mostly runs in the background with minimal direct interaction.</td>
                  <td className="py-3 pl-4">Directly interacts with users whenever launched.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Languages Used</td>
                  <td className="py-3 px-4">Low-level languages (C, C++, Assembly).</td>
                  <td className="py-3 pl-4">High-level languages (Python, Java, C#, JavaScript).</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Examples</td>
                  <td className="py-3 px-4">Operating Systems, Utility Software, Device Drivers, Compilers.</td>
                  <td className="py-3 pl-4">MS Word, Excel, Chrome, Photoshop, Hospital MIS.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
