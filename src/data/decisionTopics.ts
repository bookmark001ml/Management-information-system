export interface DecisionTopic {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  topicFocus: string;
  category: string;
  missionGoal: string;
}

export const DECISION_TOPICS: DecisionTopic[] = [
  {
    id: 'dec-strategic-planning',
    slug: 'strategic-planning',
    index: '01',
    title: 'Strategic Planning',
    shortTitle: 'Strategic Planning',
    topicFocus: 'Deciding long-term business expansion.',
    category: '5-Year Expansion',
    missionGoal: 'Analyze 5 years of sales, profit & customer data to evaluate Pokhara expansion.',
  },
  {
    id: 'dec-tactical-planning',
    slug: 'tactical-planning',
    index: '02',
    title: 'Tactical Planning',
    shortTitle: 'Tactical Planning',
    topicFocus: 'Planning monthly sales targets.',
    category: 'Branch Targets',
    missionGoal: 'Use past branch sales reports to set monthly targets and allocate promo budgets.',
  },
  {
    id: 'dec-data-driven',
    slug: 'data-driven-decision-making',
    index: '03',
    title: 'Data-Driven Decision-Making',
    shortTitle: 'Supplier Choice',
    topicFocus: 'Selecting the right supplier.',
    category: 'Cooking Oil Bid',
    missionGoal: 'Compare cooking oil suppliers on price, delivery time, and quality records.',
  },
  {
    id: 'dec-performance-monitoring',
    slug: 'performance-monitoring',
    index: '04',
    title: 'Performance Monitoring',
    shortTitle: 'Performance Gap',
    topicFocus: 'Monitoring branch sales performance.',
    category: 'NPR 10L Shortfall',
    missionGoal: 'Spot the NPR 10 lakh shortfall against the NPR 50 lakh target and investigate.',
  },
  {
    id: 'dec-problem-identification',
    slug: 'problem-identification',
    index: '05',
    title: 'Problem Identification',
    shortTitle: 'Food Wastage',
    topicFocus: 'Identifying causes of food wastage.',
    category: 'Dairy Expiry Audit',
    missionGoal: 'Review purchasing, sales & expiry records to spot dairy over-purchasing.',
  },
  {
    id: 'dec-forecasting',
    slug: 'forecasting-and-predictive-analysis',
    index: '06',
    title: 'Forecasting and Predictive Analysis',
    shortTitle: 'Dashain Forecast',
    topicFocus: 'Predicting future product demand.',
    category: 'Dashain Demand',
    missionGoal: 'Estimate Dashain surges for cooking oil, rice & sweets and plan inventory.',
  },
  {
    id: 'dec-policy-review',
    slug: 'policy-formulation-and-review',
    index: '07',
    title: 'Policy Formulation and Review',
    shortTitle: 'Reorder Policy',
    topicFocus: 'Reviewing inventory management policies.',
    category: 'Reorder Threshold',
    missionGoal: 'Review the 50-unit reorder rule and raise thresholds for fast-selling items.',
  },
];
