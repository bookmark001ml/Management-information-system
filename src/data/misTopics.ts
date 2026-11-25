export interface MisTopic {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  missionName: string;
  missionGoal: string;
  summary: string;
  keywords: string[];
}

export const MIS_TOPICS: MisTopic[] = [
  {
    id: 'improved-decision-making',
    slug: 'improved-decision-making',
    index: '01',
    title: 'Improved Decision Making',
    shortTitle: 'Decision Making',
    category: 'Forecasting',
    missionName: 'Spot Fast-Selling Milk',
    missionGoal: 'Notice milk selling faster than other products and increase tomorrow’s milk order.',
    summary: 'The MIS dashboard reveals milk sells fastest so the manager increases milk orders.',
    keywords: ['milk', 'sales', 'dashboard', 'order', 'fast', 'stock', 'decision', 'manager'],
  },
  {
    id: 'problem-identification-analysis',
    slug: 'problem-identification-analysis',
    index: '02',
    title: 'Problem Identification and Analysis',
    shortTitle: 'Problem Analysis',
    category: 'Diagnostics',
    missionName: 'Spot Warehouse Expiry & Waste',
    missionGoal: 'Scan the warehouse to catch expiring cream & butter and fix the source of wastage.',
    summary: 'MIS flags products nearing expiry in the warehouse and pinpoints what caused the waste.',
    keywords: ['expired', 'expiry', 'warehouse', 'wastage', 'cream', 'butter', 'fifo', 'spoilage'],
  },
  {
    id: 'competitive-advantage',
    slug: 'competitive-advantage',
    index: '03',
    title: 'Competitive Advantage',
    shortTitle: 'Competitive Edge',
    category: 'Market Position',
    missionName: 'Personalize Customer Discounts',
    missionGoal: 'Analyze customer purchase history and send personalized discounts.',
    summary: 'MIS analyzes purchase history to offer personalized discounts ahead of rivals.',
    keywords: ['competition', 'loyalty', 'purchase history', 'discount', 'personalized', 'croissant'],
  },
  {
    id: 'performance-tracking-control',
    slug: 'performance-tracking-control',
    index: '04',
    title: 'Performance Tracking and Control',
    shortTitle: 'Performance Control',
    category: 'KPI Monitoring',
    missionName: 'Close the NPR 8 Lakh Gap',
    missionGoal: 'Compare the NPR 50 lakh target against NPR 42 lakh actual sales and close the gap.',
    summary: 'MIS highlights the shortfall between NPR 50L target and NPR 42L actual sales.',
    keywords: ['kpi', 'target', '50 lakh', '42 lakh', 'variance', 'control', 'gap'],
  },
  {
    id: 'data-integration',
    slug: 'data-integration',
    index: '05',
    title: 'Data Integration',
    shortTitle: 'Data Integration',
    category: 'Unified Systems',
    missionName: 'Sync Purchase Across Records',
    missionGoal: 'Trigger a customer purchase and update Sales, Inventory, and Accounting together.',
    summary: 'One purchase simultaneously updates sales, inventory, and accounting records.',
    keywords: ['integration', 'purchase', 'sales', 'inventory', 'accounting', 'simultaneous', 'sync'],
  },
  {
    id: 'communication-coordination',
    slug: 'communication-coordination',
    index: '06',
    title: 'Improved Communication and Coordination',
    shortTitle: 'Communication',
    category: 'Team Sync',
    missionName: 'Low-Stock Alert & Notification',
    missionGoal: 'Drop inventory to low so Purchasing gets an alert and Branch Manager gets notified.',
    summary: 'Low inventory alerts the purchasing team and notifies the branch manager instantly.',
    keywords: ['communication', 'low inventory', 'purchasing', 'branch manager', 'alert', 'notification'],
  },
  {
    id: 'strategic-planning',
    slug: 'strategic-planning',
    index: '07',
    title: 'Support for Strategic Planning',
    shortTitle: 'Strategic Planning',
    category: 'Long-Term Growth',
    missionName: 'Review 3-Year Expansion Data',
    missionGoal: 'Review 3 years of sales data to pick the growing location for a new branch.',
    summary: 'Management reviews 3 years of sales data to choose where to open a new branch.',
    keywords: ['strategy', '3 years', 'trend', 'expansion', 'boudha', 'patan', 'new branch', 'planning'],
  },
  {
    id: 'resource-optimization',
    slug: 'resource-optimization',
    index: '08',
    title: 'Resource Optimization',
    shortTitle: 'Resource Optimization',
    category: 'Efficiency',
    missionName: 'Optimize Production & Materials',
    missionGoal: 'Analyze past sales for bread, cakes & pastries, allocate ingredients, and cut waste.',
    summary: 'MIS predicts daily demand so managers adjust production schedules and cut material waste.',
    keywords: ['optimization', 'bread', 'cakes', 'pastries', 'ingredients', 'flour', 'waste', 'schedule'],
  },
];
