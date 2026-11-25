export interface CompetitiveTopic {
  id: string;
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  topicFocus: string;
  category: string;
  missionGoal: string;
}

export const COMPETITIVE_TOPICS: CompetitiveTopic[] = [
  {
    id: 'comp-market-analysis',
    slug: 'market-analysis',
    index: '01',
    title: 'Market Analysis',
    shortTitle: 'Market Analysis',
    topicFocus: 'Understanding customer demand and market trends.',
    category: 'Market Trends',
    missionGoal: 'Analyze sales patterns to spot rising organic demand and expand the organic section.',
  },
  {
    id: 'comp-strategic-advantage',
    slug: 'strategic-advantage',
    index: '02',
    title: 'Strategic Advantage',
    shortTitle: 'Strategic Advantage',
    topicFocus: 'Developing a strategy to outperform competitors.',
    category: 'Pokhara Expansion',
    missionGoal: 'Review MIS reports, identify Pokhara as profitable, submit proposal, and approve expansion.',
  },
  {
    id: 'comp-innovation-product',
    slug: 'innovation-and-product-development',
    index: '03',
    title: 'Innovation and Product Development',
    shortTitle: 'Product Innovation',
    topicFocus: 'Introducing new products based on customer preferences.',
    category: 'New Product Line',
    missionGoal: 'Spot surging sugar-free demand from feedback and launch sugar-free snacks.',
  },
  {
    id: 'comp-crm',
    slug: 'customer-relationship-management',
    index: '04',
    title: 'Customer Relationship Management (CRM)',
    shortTitle: 'CRM & Loyalty',
    topicFocus: 'Building customer loyalty.',
    category: 'Loyalty Rewards',
    missionGoal: 'Identify regular shoppers, send tailored rewards, and drive repeat store visits.',
  },
  {
    id: 'comp-resource-planning',
    slug: 'resource-planning-competitiveness',
    index: '05',
    title: 'Resource Planning for Competitiveness',
    shortTitle: 'Resource Planning',
    topicFocus: 'Reducing operating costs.',
    category: 'Cost Reduction',
    missionGoal: 'Detect high branch electricity usage and optimize lighting and AC schedules.',
  },
  {
    id: 'comp-decision-support',
    slug: 'decision-support-competitive-strategy',
    index: '06',
    title: 'Decision Support for Competitive Strategy',
    shortTitle: 'Competitive Strategy',
    topicFocus: 'Choosing the best competitive strategy.',
    category: 'Strategy Choice',
    missionGoal: 'Compare margins and sales trends to counter a rival discount campaign.',
  },
  {
    id: 'comp-innovation-tracking',
    slug: 'innovation-tracking-improvement',
    index: '07',
    title: 'Innovation Tracking and Continuous Improvement',
    shortTitle: 'Service Tracking',
    topicFocus: 'Monitoring the effectiveness of new services.',
    category: 'Self-Checkout UX',
    missionGoal: 'Track self-checkout friction and improve the interface with guided assistance.',
  },
  {
    id: 'comp-value-addition',
    slug: 'value-addition-differentiation',
    index: '08',
    title: 'Value Addition and Differentiation',
    shortTitle: 'Value Addition',
    topicFocus: 'Offering a unique shopping experience.',
    category: 'Weekly Bundles',
    missionGoal: 'Launch customized pre-packed weekly family grocery bundles rivals do not offer.',
  },
];
