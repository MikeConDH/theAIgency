import React from 'react';
import { ReportData } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-rose-50 p-4 md:p-6 rounded-lg shadow-lg mb-6 ${className}`}>
    <h3 className="text-lg md:text-xl font-semibold text-orange-600 mb-3 border-b border-rose-300 pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const formatReportAsText = (report: ReportData): string => {
  let text = `Company Analysis Report\n`;
  text += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  text += `Current Company Status:\n`;
  text += `-----------------------\n`;
  text += `${report.currentStatus || 'N/A'}\n\n`;

  text += `Key Areas for Improvement:\n`;
  text += `--------------------------\n`;
  if (report.areasForImprovement && report.areasForImprovement.length > 0) {
    report.areasForImprovement.forEach(area => {
      text += `- ${area}\n`;
    });
  } else {
    text += `N/A\n`;
  }
  text += `\n`;

  text += `Recommended Roles to Hire:\n`;
  text += `--------------------------\n`;
  if (report.recommendedRoles && report.recommendedRoles.length > 0) {
    report.recommendedRoles.forEach(roleInfo => {
      text += `- Role: ${roleInfo.role}\n`;
      text += `  Justification: ${roleInfo.justification}\n`;
    });
  } else {
    text += `N/A\n`;
  }
  text += `\n`;

  text += `Actionable Steps:\n`;
  text += `-----------------\n`;
  if (report.actionableSteps && report.actionableSteps.length > 0) {
    report.actionableSteps.forEach((step, index) => {
      text += `${index + 1}. ${step}\n`;
    });
  } else {
    text += `N/A\n`;
  }
  return text;
};


export const ReportDisplay: React.FC<{ report: ReportData }> = ({ report }) => {
  if (!report) {
    return (
      <div className="text-center p-8 text-stone-500">
        Generating report, please wait...
      </div>
    );
  }

  const handleCopy = async () => {
    const textToCopy = formatReportAsText(report);
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy report: ', err);
      alert('Failed to copy report. You can try downloading it instead.');
    }
  };

  const handleDownload = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleDownloadTxt = () => {
    const textContent = formatReportAsText(report);
    handleDownload("company_analysis_report.txt", textContent, "text/plain;charset=utf-8");
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(report, null, 2);
    handleDownload("company_analysis_report.json", jsonContent, "application/json;charset=utf-8");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-orange-600 text-center sm:text-left pb-2 sm:pb-0">
          Company Analysis Report
        </h2>
        <div className="flex space-x-2 mt-2 sm:mt-0" role="group" aria-label="Report actions">
          <button
            onClick={handleCopy}
            className="p-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors text-xs sm:text-sm flex items-center"
            title="Copy report to clipboard"
            aria-label="Copy report to clipboard"
          >
            <ClipboardIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" /> Copy
          </button>
          <button
            onClick={handleDownloadTxt}
            className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-xs sm:text-sm flex items-center"
            title="Download report as TXT"
            aria-label="Download report as TXT"
          >
            <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" /> TXT
          </button>
          <button
            onClick={handleDownloadJson}
            className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-xs sm:text-sm flex items-center"
            title="Download report as JSON"
            aria-label="Download report as JSON"
          >
            <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" /> JSON
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 border-t border-rose-300 pt-4">
        <SectionCard title="Current Company Status">
          <p className="text-stone-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{report.currentStatus || "No information provided."}</p>
        </SectionCard>

        <SectionCard title="Key Areas for Improvement">
          {report.areasForImprovement && report.areasForImprovement.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-stone-700 text-sm md:text-base">
              {report.areasForImprovement.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-500 italic">No specific areas for improvement highlighted.</p>
          )}
        </SectionCard>

        <SectionCard title="Recommended Roles to Hire">
          {report.recommendedRoles && report.recommendedRoles.length > 0 ? (
            <div className="space-y-3">
              {report.recommendedRoles.map((roleInfo, index) => (
                <div key={index} className="bg-amber-200 p-3 rounded-md shadow">
                  <h4 className="font-semibold text-orange-700 text-sm md:text-base">{roleInfo.role}</h4>
                  <p className="text-xs md:text-sm text-amber-800 mt-1 leading-relaxed whitespace-pre-wrap">{roleInfo.justification}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 italic">No specific roles recommended at this time.</p>
          )}
        </SectionCard>

        <SectionCard title="Actionable Steps">
          {report.actionableSteps && report.actionableSteps.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2 text-stone-700 text-sm md:text-base">
              {report.actionableSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="text-stone-500 italic">No specific actionable steps provided.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
};