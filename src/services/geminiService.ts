import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface EmailAssistantResult {
  improvedEmail: string;
  summaryOfChanges: string;
  suggestions: string;
  subjectLines: string[];
  aiLikelihoodScore: number; // 0 to 100
  flaggedSections: { original: string; reason: string; suggestion: string }[];
}

export async function processEmail(
  input: string,
  mode: 'write' | 'rewrite' | 'refine',
  tone: string = 'professional',
  additionalInstructions: string = ''
): Promise<EmailAssistantResult> {
  const model = "gemini-3.1-pro-preview";

  const systemInstruction = `
    You are an intelligent email assistant designed to write, rewrite, and refine emails with high professionalism and originality.
    
    Your goals:
    1. Improve tone, clarity, grammar, and structure.
    2. Adapt tone to: ${tone}.
    3. Humanize the content, avoiding robotic or overly generic AI-sounding phrases.
    4. Provide a simulated "AI-likelihood" analysis by flagging generic sections and suggesting human-like alternatives.
    5. Ensure the message is appropriate for the target audience.
    
    Output MUST be a JSON object with the following structure:
    {
      "improvedEmail": "The final polished email text",
      "summaryOfChanges": "A concise summary of what was improved",
      "suggestions": "Optional further improvements or tips",
      "subjectLines": ["3-5 subject line suggestions"],
      "aiLikelihoodScore": 0-100 (percentage score of how 'generic/AI-like' the original was),
      "flaggedSections": [
        { "original": "text snippet", "reason": "why it sounds generic/AI-like", "suggestion": "human-like alternative" }
      ]
    }
    
    Additional Context: ${additionalInstructions}
  `;

  const prompt = mode === 'write' 
    ? `Write a ${tone} email based on these points: ${input}`
    : `Rewrite and refine this email to be ${tone}: ${input}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedEmail: { type: Type.STRING },
            summaryOfChanges: { type: Type.STRING },
            suggestions: { type: Type.STRING },
            subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiLikelihoodScore: { type: Type.NUMBER },
            flaggedSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  suggestion: { type: Type.STRING }
                },
                required: ["original", "reason", "suggestion"]
              }
            }
          },
          required: ["improvedEmail", "summaryOfChanges", "suggestions", "subjectLines", "aiLikelihoodScore", "flaggedSections"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as EmailAssistantResult;
  } catch (error) {
    console.error("Error processing email:", error);
    throw error;
  }
}
