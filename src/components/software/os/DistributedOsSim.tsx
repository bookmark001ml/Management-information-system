import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Laptop,
  Server,
  Warehouse,
  CreditCard,
  Truck,
  PackageCheck,
  CheckCircle2,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { soundFx } from '../../../utils/soundFx';
import { OsSimProps } from './BatchOsSim';

interface DistStep {
  step: number;
  title: string;
  animationNote: string;
  studentSees: string;
  packetText: string;
  packetTone: 'cyan' | 'emerald' | 'purple' | 'amber';
}

const DIST_STEPS: DistStep[] = [
  {
    step: 1,
    title: 'Customer Order',
    animationNote: 'Customer orders a laptop online.',
    studentSees: 'Customer clicks Place Order.',
    packetText: 'Order: 1× Laptop',
    packetTone: 'cyan',
  },
  {
    step: 2,
    title: 'Request Received',
    animationNote: 'Computer A receives the order.',
    studentSees: 'Order data enters Computer A.',
    packetText: 'Computer A: Order #4082',
    packetTone: 'cyan',
  },
  {
    step: 3,
    title: 'Stock Verification',
    animationNote: 'Computer A sends a request to Computer B.',
    studentSees: 'Computer B checks warehouse inventory and finds 5 laptops.',
    packetText: 'Stock Check → 5 Laptops Found',
    packetTone: 'purple',
  },
  {
    step: 4,
    title: 'Stock Confirmation',
    animationNote: 'Computer B sends confirmation to Computer A.',
    studentSees: 'Animated data travels back showing Stock Available.',
    packetText: 'Stock Available ✓',
    packetTone: 'emerald',
  },
  {
    step: 5,
    title: 'Payment Processing',
    animationNote: 'Computer A forwards payment information to Computer C.',
    studentSees: 'Computer C verifies the payment.',
    packetText: 'Verifying Payment...',
    packetTone: 'amber',
  },
  {
    step: 6,
    title: 'Payment Confirmation',
    animationNote: 'Computer C sends payment success notification.',
    studentSees: 'Green payment confirmation travels across the network.',
    packetText: 'Payment Confirmed ✓',
    packetTone: 'emerald',
  },
  {
    step: 7,
    title: 'Delivery Arrangement',
    animationNote: 'Computer D receives the confirmed order.',
    studentSees: 'Delivery person is assigned and tracking number generated.',
    packetText: 'Driver Assigned · #TRK-902',
    packetTone: 'cyan',
  },
  {
    step: 8,
    title: 'Order Preparation',
    animationNote: 'Warehouse receives the dispatch instruction.',
    studentSees: 'Laptop is picked, packed and labelled.',
    packetText: 'Picked, Packed & Labelled',
    packetTone: 'purple',
  },
  {
    step: 9,
    title: 'Delivery',
    animationNote: 'Delivery person travels to the customer.',
    studentSees: "Animated delivery vehicle moves towards the customer's location.",
    packetText: 'Out for Delivery → Customer',
    packetTone: 'amber',
  },
  {
    step: 10,
    title: 'Job Completed',
    animationNote: 'Customer receives the laptop.',
    studentSees:
      'Order status changes to DELIVERED. All computers update their shared order information.',
    packetText: 'DELIVERED · Shared State Synced',
    packetTone: 'emerald',
  },
];

export function DistributedOsSim({ onSimulationComplete }: OsSimProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0); // 0..9
  const [isPlaying, setIsPlaying] = useState(true);
  const [networkOnline, setNetworkOnline] = useState(true);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!isPlaying || !networkOnline) return;
    if (stepIdx >= DIST_STEPS.length - 1) {
      setIsPlaying(false);
      if (!notified) {
        setNotified(true);
        soundFx.playVictory();
        onSimulationComplete();
      }
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((i) => i + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, networkOnline, notified, onSimulationComplete]);

  const current = DIST_STEPS[stepIdx];
  const s = current.step;

  const handlePlaceOrderClick = () => {
    soundFx.playClick();
    setNetworkOnline(true);
    setStepIdx(1);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#050a18] p-5 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            05 · DISTRIBUTED ONLINE LAPTOP ORDER SYSTEM
          </span>
          <p className="text-xs text-slate-200 mt-0.5 font-medium">
            {networkOnline
              ? `Step ${current.step}/10 · ${current.title}: ${current.studentSees}`
              : 'Network Link Interrupted — remote computers cannot exchange order data!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setNetworkOnline((n) => !n);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap border ${
              networkOnline
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-400'
                : 'bg-rose-950/60 border-rose-500 text-rose-200'
            }`}
          >
            {networkOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            )}
            <span>{networkOnline ? 'Network: Online' : 'Restore Network'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (stepIdx >= DIST_STEPS.length - 1) {
                setStepIdx(0);
                setIsPlaying(true);
              } else {
                setIsPlaying((p) => !p);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            )}
            <span>
              {isPlaying
                ? 'Pause'
                : stepIdx >= DIST_STEPS.length - 1
                  ? 'Play Again'
                  : 'Play'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setNetworkOnline(true);
              setStepIdx(0);
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
              setNetworkOnline(true);
              setStepIdx(0);
              setIsPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Live Animated Data Banner + Customer Action */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-cyan-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              Customer Laptop Order · Status:{' '}
              <span className={s === 10 ? 'text-emerald-400' : 'text-cyan-300'}>
                {s === 10 ? 'DELIVERED' : s >= 7 ? 'DISPATCHED' : s >= 2 ? 'PROCESSING' : 'READY TO ORDER'}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">{current.animationNote}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
              current.packetTone === 'emerald'
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                : current.packetTone === 'amber'
                  ? 'bg-amber-950/60 border-amber-400 text-amber-300'
                  : current.packetTone === 'purple'
                    ? 'bg-purple-950/60 border-purple-400 text-purple-300'
                    : 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
            }`}
          >
            {networkOnline ? current.packetText : 'NETWORK PAUSED'}
          </span>

          <button
            type="button"
            onClick={handlePlaceOrderClick}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* 4 Distributed Computers + Warehouse & Delivery Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Computer A: Order Receiver */}
        <div
          className={`rounded-xl border p-4 space-y-2 transition-colors ${
            s === 2 || s === 4 || s === 6 || s === 10
              ? 'bg-cyan-950/45 border-cyan-400'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-300 inline-flex items-center gap-1.5">
              <Server className="w-4 h-4" aria-hidden="true" />
              Computer A
            </span>
            <span className="font-mono text-[10px] text-slate-400">Order Hub</span>
          </div>
          <p className="text-xs font-bold text-white">Order Management Node</p>
          <p className="text-[11px] text-slate-300">
            {s === 1
              ? 'Waiting for customer order...'
              : s === 10
                ? 'Synced: DELIVERED'
                : 'Coordinating stock & payment'}
          </p>
        </div>

        {/* Computer B: Warehouse Inventory */}
        <div
          className={`rounded-xl border p-4 space-y-2 transition-colors ${
            s === 3 || s === 4 || s === 8 || s === 10
              ? 'bg-purple-950/40 border-purple-400'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-purple-300 inline-flex items-center gap-1.5">
              <Warehouse className="w-4 h-4" aria-hidden="true" />
              Computer B
            </span>
            <span className="font-mono text-[10px] text-slate-400">Warehouse</span>
          </div>
          <p className="text-xs font-bold text-white">
            {s >= 3 ? (s >= 8 ? '4 Laptops Left · Packed' : '5 Laptops in Stock') : 'Inventory Database'}
          </p>
          <p className="text-[11px] text-slate-300">
            {s === 3
              ? 'Checking warehouse → Found 5!'
              : s === 4
                ? 'Sending Stock Available ✓'
                : s === 8
                  ? 'Picked, packed & labelled'
                  : s === 10
                    ? 'Synced: DELIVERED'
                    : 'Ready for stock check'}
          </p>
        </div>

        {/* Computer C: Payment Server */}
        <div
          className={`rounded-xl border p-4 space-y-2 transition-colors ${
            s === 5 || s === 6 || s === 10
              ? 'bg-emerald-950/40 border-emerald-400'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-300 inline-flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" aria-hidden="true" />
              Computer C
            </span>
            <span className="font-mono text-[10px] text-slate-400">Payments</span>
          </div>
          <p className="text-xs font-bold text-white">Payment Gateway Node</p>
          <p className="text-[11px] text-slate-300">
            {s === 5
              ? 'Verifying customer payment...'
              : s === 6
                ? 'Green confirmation sent!'
                : s === 10
                  ? 'Synced: DELIVERED'
                  : 'Awaiting payment verification'}
          </p>
        </div>

        {/* Computer D: Delivery Arrangement */}
        <div
          className={`rounded-xl border p-4 space-y-2 transition-colors ${
            s >= 7
              ? 'bg-amber-950/35 border-amber-400'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-300 inline-flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4" aria-hidden="true" />
              Computer D
            </span>
            <span className="font-mono text-[10px] text-slate-400">Logistics</span>
          </div>
          <p className="text-xs font-bold text-white">
            {s >= 7 ? 'Tracking #TRK-902' : 'Delivery Scheduler'}
          </p>
          <p className="text-[11px] text-slate-300">
            {s === 7
              ? 'Assigned driver & tracking ID'
              : s === 9
                ? 'Driver en route to customer'
                : s === 10
                  ? 'Synced: DELIVERED'
                  : 'Waiting for confirmed order'}
          </p>
        </div>
      </div>

      {/* Animated Delivery Route Track (Warehouse -> Delivery Vehicle -> Customer) */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 inline-flex items-center gap-1.5">
            <Warehouse className="w-4 h-4 text-purple-400" aria-hidden="true" />
            Warehouse Dispatch
          </span>
          <span className="font-mono text-[11px] text-cyan-300">
            {s >= 9
              ? s === 10
                ? 'DELIVERED TO CUSTOMER!'
                : 'Delivery Vehicle Moving...'
              : 'Preparing Order'}
          </span>
          <span className="font-semibold text-slate-200 inline-flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            Customer Location
          </span>
        </div>

        <div className="relative h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center px-3">
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-700" />
          <motion.div
            className="relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400 text-amber-200"
            animate={{
              left: s >= 10 ? '82%' : s === 9 ? '52%' : s === 8 ? '12%' : '2%',
            }}
            style={{ position: 'absolute' }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
          >
            {s === 10 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Truck className="w-4 h-4" aria-hidden="true" />
            )}
            <span className="font-mono text-[10px] font-bold">
              {s === 10 ? 'DELIVERED' : s === 9 ? 'IN TRANSIT' : 'LAPTOP'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Interactive 10-Step Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DIST_STEPS.map((item, idx) => {
          const active = idx === stepIdx;
          const done = idx < stepIdx;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsPlaying(false);
                setStepIdx(idx);
              }}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                active
                  ? 'bg-cyan-950/60 border-cyan-400 text-white'
                  : done
                    ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-cyan-300 block">
                STEP {item.step}
              </span>
              <span className="text-[11px] font-semibold leading-tight block truncate">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
