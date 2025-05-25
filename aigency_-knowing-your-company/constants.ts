
import { ChatStepConfig }  from './types';

export const APP_TITLE = "AIgency: Knowing your company";

export const INITIAL_BOT_MESSAGE = `Welcome to ${APP_TITLE}! I'm here to help analyze your company's needs and provide insights for improvement. To start, please tell me your company's name.`;

export const CHAT_STEPS: ChatStepConfig[] = [
  {
    key: 'GET_COMPANY_NAME',
    question: "What is your company's name?",
    dataKey: 'companyName'
  },
  {
    key: 'GET_INDUSTRY',
    question: "Great! And what industry does your company operate in?",
    dataKey: 'industry'
  },
  {
    key: 'GET_MISSION_VISION',
    question: "Could you share your company's mission and vision?",
    dataKey: 'missionVision'
  },
  {
    key: 'GET_PRODUCTS_SERVICES',
    question: "What main products or services do you offer?",
    dataKey: 'productsServices'
  },
  {
    key: 'GET_COMPETITORS',
    question: "Who are your main competitors?",
    dataKey: 'competitors'
  },
  {
    key: 'GET_STRENGTHS',
    question: "Let's do a quick SWOT analysis. What do you consider your company's key strengths?",
    dataKey: 'strengths'
  },
  {
    key: 'GET_WEAKNESSES',
    question: "What areas or aspects do you think need improvement (weaknesses)?",
    dataKey: 'weaknesses'
  },
  {
    key: 'GET_OPPORTUNITIES',
    question: "What opportunities do you see in your industry or market?",
    dataKey: 'opportunities'
  },
  {
    key: 'GET_THREATS',
    question: "And what challenges or threats does your company face?",
    dataKey: 'threats'
  },
  {
    key: 'GET_LOGISTICS_MANAGEMENT',
    question: "Moving to operations: how do you currently manage logistics?",
    dataKey: 'logisticsManagement'
  },
  {
    key: 'GET_LOGISTICS_TOOLS',
    question: "What software or tools are you using for logistics and operations?",
    dataKey: 'logisticsTools'
  },
  {
    key: 'GET_LOGISTICS_PAIN_POINTS',
    question: "Are there any particular pain points in your current operations?",
    dataKey: 'logisticsPainPoints'
  },
  {
    key: 'GET_FINANCIAL_SUMMARY',
    question: "Regarding financials: I can't process files directly. Could you provide a brief summary of your company's revenue, typical expenses, and profit margins?",
    dataKey: 'financialSummary'
  },
  {
    key: 'GET_IMPROVEMENT_AREAS',
    question: "What specific areas of your business are you looking to improve?",
    dataKey: 'improvementAreas'
  },
  {
    key: 'GET_SHORT_TERM_GOALS',
    question: "What are your company's short-term goals (e.g., next 6-12 months)?",
    dataKey: 'shortTermGoals'
  },
  {
    key: 'GET_LONG_TERM_GOALS',
    question: "And what are your long-term goals (e.g., next 3-5 years)?",
    dataKey: 'longTermGoals'
  }
];