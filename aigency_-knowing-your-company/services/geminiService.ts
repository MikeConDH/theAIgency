import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CompanyData, ReportData } from '../types';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.error("Gemini API Key is not configured or is a placeholder. Please set process.env.API_KEY.");
    throw new Error("API Key for Gemini is not configured. Please check your environment setup.");
  }
  return apiKey;
};


export const generateCompanyAnalysisReport = async (companyData: CompanyData): Promise<ReportData> => {
  let ai: GoogleGenAI;
  try {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    throw error; 
  }

  const prompt = `
You are a highly experienced business strategy consultant. Based on the following detailed company information, generate a comprehensive analysis report. Your insights should be actionable and tailored to the company's specific context.

Company Name: ${companyData.companyName || 'N/A'}
Industry: ${companyData.industry || 'N/A'}

Company Profile:
Mission & Vision: ${companyData.missionVision || 'N/A'}
Products/Services: ${companyData.productsServices || 'N/A'}
Main Competitors: ${companyData.competitors || 'N/A'}

SWOT Analysis:
Strengths: ${companyData.strengths || 'N/A'}
Weaknesses: ${companyData.weaknesses || 'N/A'}
Opportunities: ${companyData.opportunities || 'N/A'}
Threats: ${companyData.threats || 'N/A'}

Current Operations:
Logistics Management: ${companyData.logisticsManagement || 'N/A'}
Software/Tools Used for Logistics & Operations: ${companyData.logisticsTools || 'N/A'}
Operational Pain Points: ${companyData.logisticsPainPoints || 'N/A'}

Financial Insights Summary (User Provided): ${companyData.financialSummary || 'N/A'}

Goals for Improvement:
Specific Areas Company Wants to Improve: ${companyData.improvementAreas || 'N/A'}
Short-term Goals (next 6-12 months): ${companyData.shortTermGoals || 'N/A'}
Long-term Goals (next 3-5 years): ${companyData.longTermGoals || 'N/A'}

---

Please generate a report with the following sections. Be concise, insightful, and professional. Provide specific examples where possible.
1.  **Current Company Status:** A brief, synthesized overview of the company's current standing, highlighting key aspects from the provided information.
2.  **Key Areas for Improvement:** Identify 3-5 critical areas that require attention, based on weaknesses, threats, and pain points. Explain why each is important.
3.  **Recommended Roles to Hire:** Suggest 1-3 specific roles (e.g., "Digital Marketing Specialist," "Supply Chain Analyst," "Customer Success Manager") that could address the identified needs or capitalize on opportunities. Provide a clear justification for each role, linking it to specific company data points.
4.  **Actionable Steps:** Outline 3-5 concrete, actionable steps the company can take in the short to medium term to implement improvements and work towards their goals. These should be practical and specific.

Format your response STRICTLY as a JSON object with the following structure:
{
  "currentStatus": "string",
  "areasForImprovement": ["string: Detailed explanation for area 1", "string: Detailed explanation for area 2", ...],
  "recommendedRoles": [
    { "role": "string (e.g., Software Engineer)", "justification": "string: Why this role is needed based on data." },
    ...
  ],
  "actionableSteps": ["string: Specific step 1", "string: Specific step 2", ...]
}

If any information is critically missing or insufficient for a specific section, state that clearly within the relevant part of the JSON (e.g., "Insufficient data to provide a detailed financial assessment."). Ensure the entire output is a single valid JSON object.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17', 
      contents: [{ role: "user", parts: [{text: prompt}] }], // Updated contents structure
      config: {
        responseMimeType: "application/json",
        temperature: 0.6, // Slightly increased for more nuanced insights
        topP: 0.95,
        topK: 64,
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData: ReportData = JSON.parse(jsonStr);
      if (
        typeof parsedData.currentStatus !== 'string' ||
        !Array.isArray(parsedData.areasForImprovement) ||
        !Array.isArray(parsedData.recommendedRoles) ||
        !Array.isArray(parsedData.actionableSteps)
      ) {
        console.error("Parsed JSON does not match expected ReportData structure:", parsedData);
        throw new Error("Received malformed report data from AI. Structure is incorrect.");
      }
      // Validate that array elements are strings for areasForImprovement and actionableSteps
      if (!parsedData.areasForImprovement.every(item => typeof item === 'string')) {
        throw new Error("Malformed report data: 'areasForImprovement' should be an array of strings.");
      }
      if (!parsedData.actionableSteps.every(item => typeof item === 'string')) {
         throw new Error("Malformed report data: 'actionableSteps' should be an array of strings.");
      }
      // Validate structure of recommendedRoles
      if (!parsedData.recommendedRoles.every(item => typeof item.role === 'string' && typeof item.justification === 'string')) {
        throw new Error("Malformed report data: 'recommendedRoles' items should have 'role' and 'justification' strings.");
      }
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Raw response text from AI was (trimmed):", response.text.substring(0, 500));
      throw new Error(`Failed to parse the report data from AI. Please ensure the AI returns valid JSON. Error: ${(e as Error).message}`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Gemini API Key is invalid. Please check your configuration.");
        }
        if (error.message.includes("quota")) {
            throw new Error("You have exceeded your Gemini API quota. Please check your usage or billing.");
        }
         if (error.message.includes("timed out") || error.message.includes("deadline exceeded")) {
            throw new Error("The request to the AI model timed out. Please try again.");
        }
    }
    throw new Error(`An error occurred while communicating with the AI model: ${error instanceof Error ? error.message : String(error)}`);
  }
};