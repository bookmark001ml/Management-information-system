import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Smartphone,
  MapPin,
  Camera,
  Music,
  MessageCircle,
  Wifi,
  Battery,
  Cpu,
  MemoryStick,
  HardDrive,
  Bell,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

const MOBILE_APPS = [
  { id: 'maps', name: 'Maps', icon: MapPin, ramMb: 420, cpuPct: 32, color: 'bg-emerald-500' },
  { id: 'camera', name: 'Camera', icon: Camera, ramMb: 540, cpuPct: 38, color: 'bg-sky-500' },
  { id: 'music', name: 'Music', icon: Music, ramMb: 210, cpuPct: 16, color: 'bg-purple-500' },
  { id: 'chat', name: 'Messages', icon: MessageCircle, ramMb: 180, cpuPct: 12, color: 'bg-amber-500' },
];

export function MobileOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [openApps, setOpenApps] = useState<string[]>(['maps']);
  const [battery, setBattery] = useState(92);
  const [notificationText, setNotificationText] = useState('Touch any app icon to launch');
  const [notified, setNotified] = useState(false);

  // Auto-open apps smoothly during playback, draining battery gradually
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setOpenApps((prev) => {
        if (prev.length < MOBILE_APPS.length) {
          const nextApp = MOBILE_APPS[prev.length];
          setNotificationText(`OS launched ${nextApp.name} · Loaded into RAM`);
          return [...prev, nextApp.id];
        } else {
          if (!notified) {
            setNotified(true);
            soundFx.playVictory();
            onSimulationComplete();
          }
          setIsPlaying(false);
          return prev;
        }
      });
      setBattery((b) => Math.max(25, b - 7));
    }, 1100);
    return () => clearInterval(timer);
  }, [isPlaying, notified, onSimulationComplete]);

  // Drain battery slowly while apps stay active
  useEffect(() => {
    if (openApps.length === 0) return;
    const drain = setInterval(() => {
      setBattery((b) => Math.max(15, b - openApps.length));
    }, 1800);
    return () => clearInterval(drain);
  }, [openApps.length]);

  const toggleApp = (appId: string, name: string) => {
    soundFx.playPop();
    setOpenApps((prev) => {
      const exists = prev.includes(appId);
      const next = exists ? prev.filter((x) => x !== appId) : [...prev, appId];
      setNotificationText(
        exists ? `Closed ${name} · RAM freed` : `Touch input -> Launched ${name}`
      );
      if (next.length >= 2 && !notified) {
        setNotified(true);
        onSimulationComplete();
      }
      return next;
    });
  };

  const totalRam = openApps.reduce((sum, id) => {
    const app = MOBILE_APPS.find((a) => a.id === id);
    return sum + (app?.ramMb ?? 0);
  }, 600);

  const totalCpu = Math.min(
    98,
    openApps.reduce((sum, id) => {
      const app = MOBILE_APPS.find((a) => a.id === id);
      return sum + (app?.cpuPct ?? 0);
    }, 8)
  );

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            08 · SMARTPHONE OS HARDWARE & TOUCH SIMULATOR
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            Tap app icons on the phone to watch CPU, RAM, storage, wireless, and battery respond.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setOpenApps(['maps']);
              setBattery(92);
              setNotificationText('Replaying mobile OS launch sequence...');
              setIsPlaying(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setOpenApps([]);
              setBattery(100);
              setNotificationText('Screen idle · Touch an app icon');
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Smartphone + Hardware Resource Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Smartphone Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[290px] rounded-[2rem] border-2 border-slate-700 bg-slate-950 p-4 space-y-4 shadow-2xl">
            {/* Phone Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
              <span>5G · Wi-Fi</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span className="inline-flex items-center gap-1">
                  <Battery
                    className={`w-3.5 h-3.5 ${battery < 40 ? 'text-rose-400' : 'text-emerald-400'}`}
                    aria-hidden="true"
                  />
                  {battery}%
                </span>
              </div>
            </div>

            {/* Notification Banner */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-2 text-[11px] text-cyan-200">
              <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{notificationText}</span>
            </div>

            {/* Touchable App Icons Grid */}
            <div className="grid grid-cols-2 gap-3 py-2">
              {MOBILE_APPS.map((app) => {
                const Icon = app.icon;
                const active = openApps.includes(app.id);
                return (
                  <motion.button
                    key={app.id}
                    type="button"
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                    onClick={() => toggleApp(app.id, app.name)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                      active
                        ? 'bg-slate-800 border-cyan-400 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${app.color} flex items-center justify-center text-slate-950`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold">{app.name}</span>
                    <span className="font-mono text-[10px] text-cyan-300">
                      {active ? 'RUNNING' : 'TAP TO OPEN'}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Mobile OS Hardware Coordinator */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-white">
                <Cpu className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                Mobile CPU Load
              </span>
              <span className="font-mono tabular-nums font-bold text-cyan-300">{totalCpu}%</span>
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-400 rounded-full"
                animate={{ width: `${totalCpu}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-white">
                <MemoryStick className="w-4 h-4 text-purple-400" aria-hidden="true" />
                RAM Allocated ({openApps.length} active apps)
              </span>
              <span className="font-mono tabular-nums font-bold text-purple-300">
                {totalRam} MB / 4096 MB
              </span>
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-400 rounded-full"
                animate={{ width: `${(totalRam / 4096) * 100}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 font-semibold text-white">
              <HardDrive className="w-4 h-4 text-sky-400" aria-hidden="true" />
              Flash Storage App Read
            </span>
            <span className="font-mono text-sky-300 font-bold">
              {openApps.length > 0 ? 'Loading Assets -> RAM' : 'Idle'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-white">
                <Smartphone className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                Battery Remaining (Drains as Apps Run)
              </span>
              <span
                className={`font-mono tabular-nums font-bold ${
                  battery < 40 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {battery}%
              </span>
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  battery < 40 ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                animate={{ width: `${battery}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
