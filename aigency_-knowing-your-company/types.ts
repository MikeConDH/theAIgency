
import React from 'react';

export interface ChatMessageFile {
  name: string;
  type: string; // MIME type
  content: string; // base64 data URL
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string | React.ReactNode; // Text content
  file?: ChatMessageFile; // Optional file
  timestamp: Date;
}

export interface CompanyData {
  companyName: string;
  industry: string;
  missionVision: string;
  productsServices: string;
  competitors: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  logisticsManagement: string;
  logisticsTools: string;
  logisticsPainPoints: string;
  financialSummary: string; // Kept as string summary, no file upload
  improvementAreas: string;
  shortTermGoals: string;
  longTermGoals: string;
}

export type ChatStepKey = 
  | 'GET_COMPANY_NAME'
  | 'GET_INDUSTRY'
  | 'GET_MISSION_VISION'
  | 'GET_PRODUCTS_SERVICES'
  | 'GET_COMPETITORS'
  | 'GET_STRENGTHS'
  | 'GET_WEAKNESSES'
  | 'GET_OPPORTUNITIES'
  | 'GET_THREATS'
  | 'GET_LOGISTICS_MANAGEMENT'
  | 'GET_LOGISTICS_TOOLS'
  | 'GET_LOGISTICS_PAIN_POINTS'
  | 'GET_FINANCIAL_SUMMARY'
  | 'GET_IMPROVEMENT_AREAS'
  | 'GET_SHORT_TERM_GOALS'
  | 'GET_LONG_TERM_GOALS';


export interface ChatStepConfig {
  key: ChatStepKey;
  question: string;
  dataKey: keyof CompanyData;
}

export interface ReportData {
  currentStatus: string;
  areasForImprovement: string[];
  recommendedRoles: Array<{ role: string; justification: string }>;
  actionableSteps: string[];
}

export interface IconProps {
  className?: string;
}