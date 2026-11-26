export interface OsExample {
  label: string;
  iconName:
    | 'payroll'
    | 'electricity'
    | 'mainframe'
    | 'linux'
    | 'windows'
    | 'macos'
    | 'server'
    | 'network'
    | 'cluster'
    | 'airbag'
    | 'robot'
    | 'android'
    | 'ios';
  whatHappens: string;
  howItWorksSteps: [string, string, string];
}

export interface OsTopic {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  smallDefinition: string;
  mechanismSentence: string;
  advantage: string;
  disadvantage: string;
  examples: [OsExample, OsExample];
}

export const OS_GENERAL_DEFINITION =
  'An Operating System (OS) is the core software that manages computer hardware, memory, and programs so users can run tasks easily.';

export const OS_TOPICS: OsTopic[] = [
  {
    id: 'batch-os',
    slug: 'batch-operating-system',
    index: '01',
    title: 'Batch Operating System',
    shortTitle: 'Batch OS',
    smallDefinition:
      'An operating system that groups similar tasks into batches and runs them automatically one after another without user interaction.',
    mechanismSentence:
      'Similar jobs are grouped into batches and processed sequentially without human interaction.',
    advantage: 'Efficiently processes large volumes of repetitive jobs.',
    disadvantage:
      'Users must wait for the entire batch to be processed before receiving results.',
    examples: [
      {
        label: 'Monthly employee payroll processing',
        iconName: 'payroll',
        whatHappens:
          'At month-end, HR submits thousands of attendance and salary records together. The Batch OS groups all salary calculations into one payroll batch and calculates tax, allowances, and net pay overnight without anyone clicking buttons.',
        howItWorksSteps: [
          'HR collects all employee timecards and groups them into one Payroll Batch.',
          'The system calculates salaries, taxes, and deductions sequentially for every worker.',
          'All payslips and bank transfer files are produced together at the end.',
        ],
      },
      {
        label: 'Electricity bill generation',
        iconName: 'electricity',
        whatHappens:
          'A power company reads meters from hundreds of thousands of homes. Instead of generating one bill at a time manually, the Batch OS groups all meter readings by area and prints every monthly bill in one automated run.',
        howItWorksSteps: [
          'Monthly meter readings from thousands of households enter the billing queue.',
          'The OS groups similar residential tariff jobs and computes charges automatically.',
          'Completed electricity bills are sent to the output printer and SMS dispatch.',
        ],
      },
    ],
  },
  {
    id: 'multiprogramming-os',
    slug: 'multiprogramming-operating-system',
    index: '02',
    title: 'Multiprogramming Operating System',
    shortTitle: 'Multiprogramming',
    smallDefinition:
      'An operating system that keeps multiple programs in RAM and switches the CPU to another program whenever one pauses for I/O.',
    mechanismSentence:
      'When one program waits for I/O, the OS switches the CPU to another program in RAM.',
    advantage:
      'Improves CPU utilization by keeping it busy while another program waits for I/O.',
    disadvantage: 'Requires complex memory management and CPU scheduling.',
    examples: [
      {
        label: 'IBM OS/360',
        iconName: 'mainframe',
        whatHappens:
          'Enterprise banks used IBM OS/360 mainframes to hold several accounting and reporting jobs in memory at once. While one job waited for magnetic tape or disk data, the CPU immediately processed another job so expensive hardware never sat idle.',
        howItWorksSteps: [
          'Multiple business jobs stay loaded inside mainframe memory (RAM) simultaneously.',
          'When Job 1 pauses to read customer records from disk, OS/360 switches CPU to Job 2.',
          'Once disk data arrives, Job 1 returns to ready state while CPU productivity stays high.',
        ],
      },
      {
        label: 'Modern Linux systems',
        iconName: 'linux',
        whatHappens:
          'On a Linux server running a database, web server, and backup script, the kernel keeps all programs in RAM. Whenever the database waits for a disk write, Linux immediately hands the CPU to the web server to serve user requests.',
        howItWorksSteps: [
          'Database, web server, and backup tools stay resident in memory together.',
          'Any program waiting on disk or network I/O is moved to a Waiting queue.',
          'Linux assigns the free CPU immediately to another ready program.',
        ],
      },
    ],
  },
  {
    id: 'multitasking-os',
    slug: 'multitasking-operating-system',
    index: '03',
    title: 'Multitasking / Time-Sharing Operating System',
    shortTitle: 'Multitasking',
    smallDefinition:
      'An operating system that rapidly shares CPU time slices among open applications so users can use many apps smoothly at once.',
    mechanismSentence:
      'One CPU rapidly rotates tiny time slices across apps so all programs feel simultaneous.',
    advantage: 'Allows users to interact with multiple applications responsively.',
    disadvantage: 'Frequent task switching creates processing overhead.',
    examples: [
      {
        label: 'Windows',
        iconName: 'windows',
        whatHappens:
          'When a student writes an assignment in Word while playing Spotify and browsing Chrome on Windows, the CPU gives each app a few milliseconds in rapid rotation—so fast that typing, music, and web pages all feel completely live.',
        howItWorksSteps: [
          'Windows assigns tiny millisecond time slices (quanta) to every open app.',
          'Every few milliseconds, Windows saves one app state and switches CPU to the next.',
          'Because switching happens dozens of times per second, all apps appear simultaneous.',
        ],
      },
      {
        label: 'macOS',
        iconName: 'macos',
        whatHappens:
          'On a MacBook running Zoom, Excel, and Safari together, macOS preemptive time-sharing ensures video calls do not freeze while spreadsheets recalculate—giving every active window fair, fast CPU turns.',
        howItWorksSteps: [
          'macOS scheduler divides CPU time into ultra-short slices across open windows.',
          'High-responsiveness apps like audio and cursor input receive quick turns.',
          'Users switch smoothly between spreadsheets, video, and browsers without waiting.',
        ],
      },
    ],
  },
  {
    id: 'multiprocessing-os',
    slug: 'multiprocessing-operating-system',
    index: '04',
    title: 'Multiprocessing Operating System',
    shortTitle: 'Multiprocessing',
    smallDefinition:
      'An operating system that uses two or more CPU cores simultaneously to execute multiple tasks in true parallel.',
    mechanismSentence:
      'Multiple CPU cores execute separate tasks simultaneously to finish work faster.',
    advantage: 'Faster execution through parallel processing.',
    disadvantage: 'More expensive hardware and complex processor coordination.',
    examples: [
      {
        label: 'Linux',
        iconName: 'linux',
        whatHappens:
          'On a multi-core workstation or cloud server, Linux assigns different programs or heavy math threads directly to Core 1, Core 2, Core 3, and Core 4 at the exact same instant—cutting completion time dramatically.',
        howItWorksSteps: [
          'Linux detects all physical CPU cores available on the motherboard.',
          'The OS dispatches independent tasks onto separate cores simultaneously.',
          'All cores share memory safely and finish heavy workloads up to 4× faster.',
        ],
      },
      {
        label: 'Windows Server',
        iconName: 'server',
        whatHappens:
          'Companies running Windows Server handle hundreds of employee logins, payroll queries, and database searches simultaneously by spreading workloads across multiple processor cores in parallel.',
        howItWorksSteps: [
          'Incoming company requests enter the Windows Server scheduler.',
          'Each request thread is routed to an available CPU core simultaneously.',
          'Parallel execution prevents bottlenecks during peak business hours.',
        ],
      },
    ],
  },
  {
    id: 'distributed-os',
    slug: 'distributed-operating-system',
    index: '05',
    title: 'Distributed Operating System',
    shortTitle: 'Distributed OS',
    smallDefinition:
      'An operating system that connects multiple independent computers over a network so they work together as one unified system.',
    mechanismSentence:
      'Networked computers split large tasks into subtasks and combine results as one unified system.',
    advantage: 'Easily scales processing capacity by adding more computers.',
    disadvantage: 'Depends on reliable network communication between computers.',
    examples: [
      {
        label: 'Amoeba',
        iconName: 'cluster',
        whatHappens:
          'Amoeba links dozens of separate workstation computers across a network and treats their combined CPUs as one giant processor pool. A user runs one command, and Amoeba automatically executes pieces across idle machines.',
        howItWorksSteps: [
          'User submits a heavy job from one terminal without choosing a specific machine.',
          'Amoeba finds idle computers on the network and sends subtasks to each.',
          'Results merge back seamlessly so the cluster feels like a single computer.',
        ],
      },
      {
        label: 'LOCUS',
        iconName: 'network',
        whatHappens:
          'LOCUS provides a single unified file system and process environment across multiple networked machines. Even if data lives on another building’s computer, LOCUS accesses and processes it transparently.',
        howItWorksSteps: [
          'Multiple independent computers connect through high-speed network links.',
          'LOCUS presents one shared directory and task space across every machine.',
          'Programs and files move across nodes automatically as demand changes.',
        ],
      },
    ],
  },
  {
    id: 'network-os',
    slug: 'network-operating-system',
    index: '06',
    title: 'Network Operating System',
    shortTitle: 'Network OS',
    smallDefinition:
      'An operating system running on a central server to manage logins, shared files, printers, and security across connected computers.',
    mechanismSentence:
      'A central server authenticates users and shares files and printers across connected computers.',
    advantage: 'Centralized management of users, files and shared resources.',
    disadvantage: 'If the central server fails, many network services become unavailable.',
    examples: [
      {
        label: 'Windows Server',
        iconName: 'server',
        whatHappens:
          'In a college computer lab or corporate office running Windows Server (Active Directory), students and staff log into any PC with one username. Their home folder, permissions, and shared printers load directly from the central server.',
        howItWorksSteps: [
          'Client PC sends the student or employee login credentials to Windows Server.',
          'The server verifies permissions and maps shared network folders.',
          'All print jobs from connected PCs route through the server print queue.',
        ],
      },
      {
        label: 'Novell NetWare',
        iconName: 'network',
        whatHappens:
          'Novell NetWare pioneered office and campus networks by letting dozens of desktop computers share one central file repository and expensive laser printer instead of giving every desk its own printer and duplicate files.',
        howItWorksSteps: [
          'Office or lab computers connect over LAN to the NetWare file server.',
          'Users authenticate once to access shared departmental documents.',
          'Shared printer queues handle jobs cleanly from any workstation.',
        ],
      },
    ],
  },
  {
    id: 'realtime-os',
    slug: 'real-time-operating-system',
    index: '07',
    title: 'Real-Time Operating System (RTOS)',
    shortTitle: 'Real-Time OS',
    smallDefinition:
      'An operating system built to process sensor inputs and respond within strict, predictable time limits.',
    mechanismSentence:
      'Processes sensor inputs within strict millisecond deadlines to trigger immediate responses.',
    advantage: 'Predictable and timely responses to critical events.',
    disadvantage: 'Complex design and strict resource constraints.',
    examples: [
      {
        label: 'Automotive airbag control systems',
        iconName: 'airbag',
        whatHappens:
          'During a sudden highway collision, impact sensors alert the vehicle’s Hard RTOS. Within a fixed limit of just a few milliseconds—no delays allowed—the RTOS fires the airbag inflator before the driver hits the steering wheel.',
        howItWorksSteps: [
          'Impact sensors detect sudden deceleration and send an immediate interrupt.',
          'The RTOS prioritizes the crash task above everything else within fixed milliseconds.',
          'Airbag inflator triggers instantly to cushion and protect the driver.',
        ],
      },
      {
        label: 'Industrial robotic control systems',
        iconName: 'robot',
        whatHappens:
          'On an automated car assembly line, robotic arms weld and place parts moving on a conveyor belt. An RTOS reads position sensors continuously and adjusts motors on exact millisecond schedules so arms never collide or miss.',
        howItWorksSteps: [
          'Optical and torque sensors stream live position data to the controller.',
          'The RTOS computes motor corrections within strict deterministic time windows.',
          'Robotic joints move smoothly and stop instantly if any hazard appears.',
        ],
      },
    ],
  },
  {
    id: 'mobile-os',
    slug: 'mobile-operating-system',
    index: '08',
    title: 'Mobile Operating System',
    shortTitle: 'Mobile OS',
    smallDefinition:
      'An operating system tailored for smartphones and tablets to coordinate touch input, apps, wireless networks, and battery power.',
    mechanismSentence:
      'Coordinates touch input, apps, wireless connectivity, memory, and battery inside mobile devices.',
    advantage:
      'Provides an intuitive, portable computing environment with a large app ecosystem.',
    disadvantage: 'Limited battery capacity compared with desktop computing systems.',
    examples: [
      {
        label: 'Android',
        iconName: 'android',
        whatHappens:
          'When you tap Google Maps on an Android phone, Android converts your touchscreen tap into an app launch, turns on GPS and 5G/Wi-Fi radios, allocates RAM, and pauses background apps to save battery.',
        howItWorksSteps: [
          'Touchscreen driver passes your tap gesture to the Android framework.',
          'Android loads the app into RAM while managing GPS, 5G, and camera access.',
          'Power manager throttles unused background apps to protect battery life.',
        ],
      },
      {
        label: 'iOS',
        iconName: 'ios',
        whatHappens:
          'On an iPhone, iOS tightly coordinates touch animations, Face ID security, App Store sandboxing, and chip power efficiency—suspending background apps automatically so your phone lasts all day.',
        howItWorksSteps: [
          'iOS translates multi-touch gestures into instant visual feedback.',
          'Each app runs inside a secure sandbox with controlled access to sensors.',
          'Memory and CPU power states adjust dynamically to maximize battery runtime.',
        ],
      },
    ],
  },
];
