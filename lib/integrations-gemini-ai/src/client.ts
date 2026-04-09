import { GoogleGenAI } from "@google/genai";

// Lazy initialization — NEVER throw at module load time.
// Supports two modes:
//   1. Replit AI Integration: AI_INTEGRATIONS_GEMINI_BASE_URL + AI_INTEGRATIONS_GEMINI_API_KEY
//   2. Direct Google Gemini API: GEMINI_API_KEY (works on Vercel, local dev, etc.)
let _ai: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!_ai) {
    const replitBase = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
    const replitKey  = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    const directKey  = process.env.GEMINI_API_KEY;

    if (replitBase && replitKey) {
      _ai = new GoogleGenAI({
        apiKey: replitKey,
        httpOptions: { apiVersion: "", baseUrl: replitBase },
      });
    } else if (directKey) {
      _ai = new GoogleGenAI({ apiKey: directKey });
    } else {
      throw new Error(
        "No Gemini credentials found. Set GEMINI_API_KEY or the Replit AI Integration vars.",
      );
    }
  }
  return _ai;
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_t, prop) {
    return (getAi() as any)[prop];
  },
});

export function isAiAvailable(): boolean {
  return !!(
    (process.env.AI_INTEGRATIONS_GEMINI_BASE_URL && process.env.AI_INTEGRATIONS_GEMINI_API_KEY) ||
    process.env.GEMINI_API_KEY
  );
}
