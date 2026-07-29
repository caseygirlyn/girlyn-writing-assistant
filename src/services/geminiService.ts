import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type ContentFormat = 'email' | 'general' | 'essay' | 'article' | 'cover_letter' | 'social';

export interface WritingAssistantResult {
  improvedText: string;
  summaryOfChanges: string;
  suggestions: string;
  headlinesOrSubjects: string[];
  aiLikelihoodScore: number; // 0 to 100
  flaggedSections: { original: string; reason: string; suggestion: string }[];
  wordCount: number;
}

export async function processWriting(
  input: string,
  mode: 'write' | 'rewrite' | 'refine',
  contentType: ContentFormat = 'email',
  tone: string = 'professional',
  additionalInstructions: string = ''
): Promise<WritingAssistantResult> {
  const model = "gemini-3.1-pro-preview";

  const formatNameMap: Record<ContentFormat, string> = {
    email: "email",
    general: "general text / document",
    essay: "essay / academic draft",
    article: "article / blog post",
    cover_letter: "cover letter / job application",
    social: "social media post / announcement"
  };

  const targetFormatName = formatNameMap[contentType] || "writing piece";

  const systemInstruction = `
    You are an intelligent, high-end writing and email assistant designed to write, rewrite, and refine all kinds of text (emails, essays, articles, cover letters, social posts, general text) with exceptional polish, clarity, and authentic human phrasing.
    
    Your goals:
    1. Structure, flow, clarity, and precision: Refine the text into top-tier, publication-ready ${targetFormatName}.
    2. Adapt tone to: "${tone}".
    3. Humanize the writing: Eliminate robotic AI clichés, filler words, passive voice overuses, and overly predictable transitions (like "In conclusion", "It is important to remember", "Delve into", "Tapestry", "Beacon", "Testament", "Furthermore").
    4. Provide a realistic "AI-Likelihood" analysis (0-100% score) flagging generic, formulaic phrases and offering fresh, distinct human phrasing suggestions.
    5. Provide 3-5 appropriate headlines/titles (for articles/essays/posts) or subject lines (for emails/letters).
    
    Output MUST be a JSON object conforming strictly to the requested schema.
    
    Additional user instructions: ${additionalInstructions || "None"}
  `;

  let prompt = "";
  if (mode === 'write') {
    prompt = `Write a fresh ${tone} ${targetFormatName} based on these core ideas/outline:\n\n${input}`;
  } else if (mode === 'refine') {
    prompt = `Correct all grammar, spelling, punctuation, and style flaws in this ${targetFormatName} while retaining its exact meaning:\n\n${input}`;
  } else {
    prompt = `Rewrite, humanize, and polish this ${targetFormatName} into a smooth ${tone} version:\n\n${input}`;
  }

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
            improvedText: { type: Type.STRING },
            summaryOfChanges: { type: Type.STRING },
            suggestions: { type: Type.STRING },
            headlinesOrSubjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiLikelihoodScore: { type: Type.NUMBER },
            wordCount: { type: Type.NUMBER },
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
          required: ["improvedText", "summaryOfChanges", "suggestions", "headlinesOrSubjects", "aiLikelihoodScore", "wordCount", "flaggedSections"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    if (!result.wordCount && result.improvedText) {
      result.wordCount = result.improvedText.trim().split(/\s+/).length;
    }
    return result as WritingAssistantResult;
  } catch (error) {
    console.error("Error processing writing task:", error);
    throw error;
  }
}

// Backward compatibility wrapper for email processing
export async function processEmail(
  input: string,
  mode: 'write' | 'rewrite' | 'refine',
  tone: string = 'professional',
  additionalInstructions: string = ''
) {
  const res = await processWriting(input, mode, 'email', tone, additionalInstructions);
  return {
    improvedEmail: res.improvedText,
    summaryOfChanges: res.summaryOfChanges,
    suggestions: res.suggestions,
    subjectLines: res.headlinesOrSubjects,
    aiLikelihoodScore: res.aiLikelihoodScore,
    flaggedSections: res.flaggedSections
  };
}
