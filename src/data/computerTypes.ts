export type ComputerNodeId =
  | 'analog'
  | 'digital'
  | 'hybrid'
  | 'supercomputer'
  | 'mainframe'
  | 'minicomputer'
  | 'desktop'
  | 'laptop'
  | 'smartphone';

export interface ComputerTypeNode {
  id: ComputerNodeId;
  name: string;
  shortName: string;
  branch: 'data' | 'size';
  parentLabel?: string;
  tagline: string;
  howItWorks: string;
  realWorldUse: string;
  scaleBadge: string;
  visualCue: string;
  accentHex: string;
}

export const COMPUTER_TYPE_NODES: ComputerTypeNode[] = [
  {
    id: 'analog',
    name: 'Analog Computer',
    shortName: 'Analog',
    branch: 'data',
    tagline: 'Measures continuous physical signals (voltage, pressure, speed).',
    howItWorks:
      'Instead of counting 0s and 1s, an Analog Computer works with smoothly changing electrical voltages or mechanical dials to model continuous real-world measurements.',
    realWorldUse: 'Car analog speedometers, voltmeters, and flight/engineering wave simulators.',
    scaleBadge: 'Continuous Signal',
    visualCue: 'Watch the analog dial needle and sine wave respond continuously without discrete steps.',
    accentHex: '#f59e0b',
  },
  {
    id: 'digital',
    name: 'Digital Computer',
    shortName: 'Digital',
    branch: 'data',
    tagline: 'Processes discrete binary digits (0s and 1s) at high speed.',
    howItWorks:
      'Converts all text, numbers, and images into binary pulses (0 and 1) and runs precise logical and arithmetic calculations inside the CPU.',
    realWorldUse: 'Modern business laptops, accounting systems, calculators, and office PCs.',
    scaleBadge: 'Binary (0 & 1)',
    visualCue: 'Watch discrete binary data cubes race across copper motherboard traces into the CPU.',
    accentHex: '#22d3ee',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Computer',
    shortName: 'Hybrid',
    branch: 'data',
    tagline: 'Combines analog sensing speed with digital accuracy.',
    howItWorks:
      'Reads continuous analog signals from sensors (like a patient’s heartbeat), converts them into digital numbers via an ADC converter, and displays exact digital metrics.',
    realWorldUse: 'Hospital ICU patient monitors, petrol pump meters, and radar/medical scanners.',
    scaleBadge: 'Analog + Digital',
    visualCue: 'See the analog heartbeat probe pass signals through the converter bridge to the digital screen.',
    accentHex: '#10b981',
  },
  {
    id: 'supercomputer',
    name: 'Supercomputer',
    shortName: 'Supercomputer',
    branch: 'size',
    tagline: 'Fastest computing giant with thousands of parallel processors.',
    howItWorks:
      'Links thousands of high-speed CPUs and GPUs inside liquid-cooled cabinets to solve billions of scientific calculations simultaneously every second.',
    realWorldUse: 'Weather forecasting, climate modeling, space exploration, and AI research.',
    scaleBadge: 'Quadrillions Ops/Sec',
    visualCue: 'Observe the curved array of liquid-cooled racks feeding a live 3D simulation core.',
    accentHex: '#a855f7',
  },
  {
    id: 'mainframe',
    name: 'Mainframe Computer',
    shortName: 'Mainframe',
    branch: 'size',
    tagline: 'Ultra-reliable enterprise hub processing millions of transactions.',
    howItWorks:
      'Built for 24/7 uptime, a Mainframe handles massive volumes of simultaneous customer records, bank transfers, and database queries without slowing down.',
    realWorldUse: 'Global banks, airline ticket reservation systems, and national census databases.',
    scaleBadge: 'Millions of Users',
    visualCue: 'Watch multi-channel banking & airline transaction streams enter the dual-bay vault simultaneously.',
    accentHex: '#38bdf8',
  },
  {
    id: 'minicomputer',
    name: 'Minicomputer (Midrange)',
    shortName: 'Minicomputer',
    branch: 'size',
    tagline: 'Mid-sized multi-user server bridging mainframes and PCs.',
    howItWorks:
      'Serves dozens to hundreds of connected users in a single department or branch, sharing files, manufacturing data, and databases from one central cabinet.',
    realWorldUse: 'University department labs, mid-sized factories, and regional retail servers.',
    scaleBadge: '10–200 Users',
    visualCue: 'See the midrange server cabinet exchange data packets with surrounding branch terminals.',
    accentHex: '#fb923c',
  },
  {
    id: 'desktop',
    name: 'Desktop PC',
    shortName: 'Desktop PC',
    branch: 'size',
    parentLabel: 'Microcomputer',
    tagline: 'Stationary single-user computer with expandable power.',
    howItWorks:
      'Combines a dedicated tower (CPU, GPU, cooling fans, power supply) with a separate monitor, keyboard, and mouse for comfortable long-hour office or studio work.',
    realWorldUse: 'Office accounting desks, graphic design studios, and SmartMart manager stations.',
    scaleBadge: 'Single User · Stationary',
    visualCue: 'Toggle Explode View to inspect the internal CPU cooler and motherboard inside the tower.',
    accentHex: '#22d3ee',
  },
  {
    id: 'laptop',
    name: 'Laptop Computer',
    shortName: 'Laptop',
    branch: 'size',
    parentLabel: 'Microcomputer',
    tagline: 'Foldable portable personal computer with built-in battery.',
    howItWorks:
      'Packs processor, memory, SSD, screen, keyboard, trackpad, and rechargeable battery into a slim hinged aluminum clamshell so you can work anywhere.',
    realWorldUse: 'BBA students, traveling managers, business presentations, and remote work.',
    scaleBadge: 'Single User · Portable',
    visualCue: 'Watch the precision aluminum lid hinge smoothly and the backlit workspace come alive.',
    accentHex: '#34d399',
  },
  {
    id: 'smartphone',
    name: 'Smartphone & Tablet',
    shortName: 'Smartphone',
    branch: 'size',
    parentLabel: 'Microcomputer',
    tagline: 'Pocket-sized touchscreen microcomputer with wireless sensors.',
    howItWorks:
      'Integrates an energy-efficient mobile chip, touchscreen display, wireless radios (5G/Wi-Fi), and camera sensors into a slim handheld slab.',
    realWorldUse: 'Mobile banking, digital POS payments, messaging, and on-the-go business dashboards.',
    scaleBadge: 'Pocket Microcomputer',
    visualCue: 'Observe live wireless signal waves radiating from the slim touchscreen chassis.',
    accentHex: '#f472b6',
  },
];

export const COMPUTER_NODE_MAP: Record<ComputerNodeId, ComputerTypeNode> =
  COMPUTER_TYPE_NODES.reduce(
    (acc, node) => {
      acc[node.id] = node;
      return acc;
    },
    {} as Record<ComputerNodeId, ComputerTypeNode>
  );
