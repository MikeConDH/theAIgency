
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, CompanyData, ReportData, ChatStepKey, ChatMessageFile } from './types';
import { CHAT_STEPS, INITIAL_BOT_MESSAGE, APP_TITLE } from './constants';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { ReportDisplay } from './components/ReportDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LiveReportPreview } from './components/LiveReportPreview';
import { generateCompanyAnalysisReport } from './services/geminiService';
import { BotIcon } from './components/icons/BotIcon';
import { UserIcon } from './components/icons/UserIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() }
  ]);
  const [currentStepKey, setCurrentStepKey] = useState<ChatStepKey | 'REPORT_GENERATION' | 'REPORT_DISPLAY' | 'FEEDBACK' | 'COMPLETED'>(CHAT_STEPS[0].key);
  const [companyData, setCompanyData] = useState<Partial<CompanyData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'missing'>('checking');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key !== "YOUR_GEMINI_API_KEY" && key.trim() !== "") {
      setApiKeyStatus('valid');
    } else {
      setApiKeyStatus('missing');
      addMessage('bot', "API Key is missing or invalid. Please ensure it's correctly configured. The application expects `process.env.API_KEY` to be set in the deployment environment.");
    }
  }, []);

  const addMessage = (sender: 'user' | 'bot', content: string | React.ReactNode, file?: ChatMessageFile) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: String(Date.now()), sender, content, file, timestamp: new Date() }
    ]);
  };

  const handleNextStep = useCallback(() => {
    const currentStepIndex = CHAT_STEPS.findIndex(step => step.key === currentStepKey);
    if (currentStepIndex < CHAT_STEPS.length - 1) {
      const nextStep = CHAT_STEPS[currentStepIndex + 1];
      setCurrentStepKey(nextStep.key);
      addMessage('bot', nextStep.question);
    } else {
      setCurrentStepKey('REPORT_GENERATION');
      addMessage('bot', "Thank you! I have all the information needed. I'm now generating your company analysis report. This may take a moment...");
    }
  }, [currentStepKey]);

  const processUserInput = useCallback((input: string) => {
    const currentStepConfig = CHAT_STEPS.find(step => step.key === currentStepKey);
    if (currentStepConfig) {
      setCompanyData(prevData => ({
        ...prevData,
        [currentStepConfig.dataKey]: input
      }));
      setTimeout(() => {
        handleNextStep();
      }, 300);
    }
  }, [currentStepKey, handleNextStep]);

  const handleSendMessage = (userInput: string, file?: ChatMessageFile) => {
    if ((!userInput.trim() && !file) || isLoading || apiKeyStatus === 'missing') return;
    addMessage('user', userInput, file);
    setError(null);

    if (!file && currentStepKey === 'FEEDBACK') {
        addMessage('bot', "Thank you for your feedback! This concludes our session.");
        setCurrentStepKey('COMPLETED');
    } else if (!file && CHAT_STEPS.some(step => step.key === currentStepKey)) {
      processUserInput(userInput);
    } else if (file) {
      // File handling logic: message with file is added, doesn't auto-progress chat steps.
      // User can add comments about the file or continue the conversation.
      addMessage('bot', `Received file: ${file.name}. You can add comments or continue with the current question if applicable.`);
    }
  };
  
  const generateReport = useCallback(async () => {
    if (apiKeyStatus !== 'valid') {
      setError("Cannot generate report: API Key is missing or invalid.");
      addMessage('bot', "I'm unable to generate the report due to an API key issue. Please check the configuration.");
      setIsLoading(false);
      const lastQuestionStep = CHAT_STEPS[CHAT_STEPS.length - 1];
      setCurrentStepKey(lastQuestionStep.key); 
      addMessage('bot', `Let's return to the last question: ${lastQuestionStep.question}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fullCompanyData = companyData as CompanyData; 
      const generatedReport = await generateCompanyAnalysisReport(fullCompanyData);
      setReport(generatedReport);
      addMessage('bot', "Your comprehensive company analysis report is ready! You can view it on the right and use the buttons to copy or download it.");
      setCurrentStepKey('REPORT_DISPLAY');
    } catch (err) {
      console.error("Error generating report:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the report.";
      setError(errorMessage);
      addMessage('bot', `Sorry, I encountered an error generating your report: ${errorMessage}. Let's try that last step again or you can try rephrasing your previous answer.`);
      const lastQuestionStep = CHAT_STEPS[CHAT_STEPS.length - 1];
      setCurrentStepKey(lastQuestionStep.key);
      addMessage('bot', `Continuing from: ${lastQuestionStep.question}`);
    } finally {
      setIsLoading(false);
    }
  }, [companyData, apiKeyStatus]);

  useEffect(() => {
    if (currentStepKey === 'REPORT_GENERATION' && !report && !isLoading) {
      generateReport();
    }
  }, [currentStepKey, report, isLoading, generateReport]);

  useEffect(() => {
    if (currentStepKey === 'REPORT_DISPLAY' && report) {
      setTimeout(() => {
        addMessage('bot', "I hope this report is insightful! What are your thoughts on the analysis? Feel free to provide any feedback.");
        setCurrentStepKey('FEEDBACK');
      }, 1000); 
    }
  }, [currentStepKey, report]);

  if (apiKeyStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4">
        <LoadingSpinner />
        <p className="text-stone-600 mt-4 text-lg">Verifying API Key...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto bg-rose-50 text-stone-800 shadow-2xl md:rounded-lg md:my-4">
      <header className="p-4 md:p-6 text-center border-b-2 border-rose-200">
        <h1 className="text-3xl md:text-4xl font-bold">
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{APP_TITLE}</span>
        </h1>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Panel (Left) */}
        <div className="flex-1 flex flex-col bg-rose-100 md:rounded-bl-lg">
          <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
                Icon={msg.sender === 'bot' ? BotIcon : UserIcon}
                file={msg.file}
              />
            ))}
            {isLoading && (currentStepKey === 'REPORT_GENERATION' || CHAT_STEPS.some(step => step.key === currentStepKey)) && (
              <div className="flex items-center justify-center py-2">
                <LoadingSpinner />
                <p className="ml-3 text-stone-500">AI is thinking...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="mx-4 md:mx-6 mb-2 p-3 bg-red-500 text-white rounded-md text-sm shadow-md">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="p-4 md:p-6 border-t border-rose-200">
            {(currentStepKey !== 'COMPLETED' && currentStepKey !== 'REPORT_DISPLAY') && apiKeyStatus === 'valid' && (
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || currentStepKey === 'REPORT_GENERATION'} 
                aria-busy={isLoading}
              />
            )}
            {apiKeyStatus === 'missing' && currentStepKey !== 'COMPLETED' && (
              <p className="text-center text-red-700 p-3 bg-red-100 rounded-md">
                API Key is not configured. Please ensure `process.env.API_KEY` is set. Chat functionality is disabled.
              </p>
            )}
            {currentStepKey === 'COMPLETED' && (
              <p className="text-center text-orange-600 p-3 text-lg">
                Thank you for using {APP_TITLE}!
              </p>
            )}
             {currentStepKey === 'REPORT_DISPLAY' && !isLoading && (
              <p className="text-center text-stone-500 p-3 text-sm">
                Review the report on the right. The chat will continue with feedback questions shortly.
              </p>
            )}
          </div>
        </div>

        {/* Report Panel (Right) */}
        <div className="w-full md:w-2/5 lg:w-2/5 xl:w-1/3 bg-amber-100 p-4 md:p-6 overflow-y-auto custom-scrollbar md:rounded-br-lg shadow-inner md:border-l border-rose-200 flex flex-col">
          {report ? (
            <ReportDisplay report={report} />
          ) : currentStepKey === 'REPORT_GENERATION' && isLoading ? (
            <div className="flex flex-col items-center justify-center h-full flex-grow">
              <LoadingSpinner />
              <p className="mt-3 text-stone-700">Generating your report...</p>
            </div>
          ) : (
            <LiveReportPreview companyData={companyData} chatSteps={CHAT_STEPS} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
