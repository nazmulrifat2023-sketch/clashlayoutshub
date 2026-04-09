import { GoogleGenAI } from "@google/genai";

// Lazy initialization — NEVER throw at module load time.
// On Vercel, AI_INTEGRATIONS_GEMINI_BASE_URL is not set (Replit-only).
// A top-level throw crashes the entire Lambda before any route is served.
let _ai: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!_ai) {
    if (!process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
      throw new Error(
        "AI_INTEGRATIONS_GEMINI_BASE_URL must be set. Did you forget to provision the Gemini AI integration?",
      );
    }
    if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
      throw new Error(
        "AI_INTEGRATIONS_GEMINI_API_KEY must be set. Did you forget to provision the Gemini AI integration?",
      );
    }
    _ai = new GoogleGenAI({
      apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
      httpOptions: {
        apiVersion: "",
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
      },
    });
  }
  return _ai;
}

// Convenience proxy — existing code using `ai.xxx` still works unchanged.
// The GoogleGenAI instance is only created on the first property access.
export const ai = new Proxy({} as GoogleGenAI, {
  get(_t, prop) {
    return (getAi() as any)[prop];
  },
});

// Check whether AI is available in the current environment.
export function isAiAvailable(): boolean {
  return !!(
    process.env.AI_INTEGRATIONS_GEMINI_BASE_URL &&
    process.env.AI_INTEGRATIONS_GEMINI_API_KEY
  );
}
