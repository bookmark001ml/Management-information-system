export interface OperationsTopic {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  topicFocus: string;
  category: string;
  missionGoal: string;
}

export const OPERATIONS_TOPICS: OperationsTopic[] = [
  {
    id: 'ops-improved-decision-making',
    slug: 'improved-decision-making',
    index: '01',
    title: 'Improved Decision-Making',
    shortTitle: 'Decision-Making',
    topicFocus: 'Deciding which products to stock more.',
    category: 'SmartMart Stocking',
    missionGoal: 'Spot milk selling faster than other products and increase milk orders.',
  },
  {
    id: 'ops-enhanced-operational-efficiency',
    slug: 'enhanced-operational-efficiency',
    index: '02',
    title: 'Enhanced Operational Efficiency',
    shortTitle: 'Operational Efficiency',
    topicFocus: 'Reducing checkout time.',
    category: 'Checkout Flow',
    missionGoal: 'Use MIS replenishment reports to cut manual shelf checks and speed up checkout.',
  },
  {
    id: 'ops-competitive-advantage',
    slug: 'competitive-advantage',
    index: '03',
    title: 'Competitive Advantage',
    shortTitle: 'Competitive Advantage',
    topicFocus: 'Attracting and retaining customers.',
    category: 'Customer Retention',
    missionGoal: 'Identify frequent baby-product buyers and send them personalized discounts.',
  },
  {
    id: 'ops-performance-tracking-control',
    slug: 'performance-tracking-control',
    index: '04',
    title: 'Performance Tracking and Control',
    shortTitle: 'Performance Control',
    topicFocus: 'Monitoring monthly sales targets.',
    category: 'Target Monitoring',
    missionGoal: 'Spot the NPR 10 lakh shortfall against the NPR 50 lakh target and fix it.',
  },
  {
    id: 'ops-resource-optimization',
    slug: 'resource-optimization',
    index: '05',
    title: 'Resource Optimization',
    shortTitle: 'Resource Optimization',
    topicFocus: 'Optimizing material usage and production schedules.',
    category: 'SmartMart Bakery',
    missionGoal: 'Estimate daily demand for bread, cakes, and pastries and minimize wastage.',
  },
  {
    id: 'ops-problem-identification-analysis',
    slug: 'problem-identification-analysis',
    index: '06',
    title: 'Problem Identification and Analysis',
    shortTitle: 'Problem Analysis',
    topicFocus: 'Identifying reasons for product shortages.',
    category: 'Dairy Loss Audit',
    missionGoal: 'Analyze purchase, sales, and expiry records to uncover dairy over-purchasing.',
  },
];
