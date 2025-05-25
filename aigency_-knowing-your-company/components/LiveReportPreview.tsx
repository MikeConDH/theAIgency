
import React from 'react';
import { CompanyData, ChatStepConfig } from '../types';

// Define more user-friendly labels for each data key
const sectionLabels: Partial<Record<keyof CompanyData, string>> = {
  companyName: "Company Name",
  industry: "Industry",
  missionVision: "Mission & Vision",
  productsServices: "Products/Services Offered",
  competitors: "Main Competitors",
  strengths: "Key Strengths",
  weaknesses: "Areas for Improvement (Weaknesses)",
  opportunities: "Market Opportunities",
  threats: "Challenges/Threats",
  logisticsManagement: "Logistics Management Approach",
  logisticsTools: "Logistics Software/Tools",
  logisticsPainPoints: "Operational Pain Points",
  financialSummary: "Financial Summary",
  improvementAreas: "Targeted Improvement Areas",
  shortTermGoals: "Short-Term Goals (6-12 Months)",
  longTermGoals: "Long-Term Goals (3-5 Years)"
};

// Fix: Define LiveReportPreviewProps interface
interface LiveReportPreviewProps {
  companyData: Partial<CompanyData>;
  chatSteps: ChatStepConfig[];
}

export const LiveReportPreview: React.FC<LiveReportPreviewProps> = ({ companyData, chatSteps }) => {
  const relevantChatSteps = chatSteps.filter(step => sectionLabels[step.dataKey]);
  const hasAnyData = Object.values(companyData).some(value => value && String(value).trim() !== '');

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-6 text-center pb-2 border-b border-rose-300">
        Company Profile Live View
      </h2>
      {!hasAnyData && (
         <div className="flex-grow flex items-center justify-center">
            <p className="text-stone-500 text-center p-4 italic">
              Your company information will appear here as you answer the questions.
            </p>
        </div>
      )}
      {hasAnyData && (
        <div className="overflow-y-auto flex-grow custom-scrollbar pr-1 space-y-4">
          {relevantChatSteps.map(step => {
            const label = sectionLabels[step.dataKey] || step.dataKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const value = companyData[step.dataKey];
            
            if (!value) return null;

            return (
              <div key={step.key} className="bg-rose-50 p-3 md:p-4 rounded-lg shadow-md">
                <h3 className="text-sm md:text-base font-semibold text-orange-600 mb-1.5">
                  {label}
                </h3>
                <p className="text-stone-700 text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
