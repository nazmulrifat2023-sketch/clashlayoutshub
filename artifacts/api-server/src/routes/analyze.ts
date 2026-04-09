import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { basesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { ai, isAiAvailable } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

router.get("/bases/:id/analyze", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [base] = await db
      .select()
      .from(basesTable)
      .where(eq(basesTable.id, id))
      .limit(1);

    if (!base) {
      return res.status(404).json({ error: "Base not found" });
    }

    if (base.ai_analysis) {
      return res.json({ analysis: base.ai_analysis, cached: true });
    }

    if (!isAiAvailable()) {
      return res.json({ aiUnavailable: true, analysis: null });
    }

    const prompt = buildPrompt(base);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const analysis = response.text ?? "";

    if (analysis) {
      await db
        .update(basesTable)
        .set({ ai_analysis: analysis, updated_at: new Date() })
        .where(eq(basesTable.id, id));
    }

    return res.json({ analysis, cached: false });
  } catch (err) {
    console.error("AI analyze error:", err);
    return res.status(500).json({ error: "Failed to generate analysis" });
  }
});

function buildPrompt(base: {
  title: string;
  townhall: number;
  base_type: string;
  description: string;
  win_rate: number;
  key_features: string[];
  best_against: string[];
  difficulty: string;
}): string {
  const keyFeats = base.key_features?.join(", ") || "centralized Town Hall, multi-compartment walls, overlapping defenses";
  const bestAgainst = base.best_against?.join(", ") || "Electro Dragons, Queen Charge, Lavaloon";

  return `You are a professional Clash of Clans base analyst and pro-player strategist with 8+ years of competitive experience. Write a comprehensive, unique, SEO-optimized base guide for the following layout. This must be at least 450 words of genuine, high-quality analysis. Do NOT use markdown headers or bullet points — write in fluent, engaging paragraphs only. No filler or generic content.

Base Details:
- Title: ${base.title}
- Town Hall Level: TH${base.townhall}
- Base Type: ${base.base_type}
- Win Rate: ${base.win_rate}%
- Difficulty: ${base.difficulty}
- Key Features: ${keyFeats}
- Best Against: ${bestAgainst}
- Admin Description: ${base.description}

Your analysis MUST cover all of the following sections in flowing paragraphs:

1. CORE DEFENSE PHILOSOPHY (100+ words): Explain how the Monolith, Eagle Artillery, and Inferno Towers (at TH${base.townhall}) are positioned and protected in this specific base type. Discuss the role of the Town Hall placement and how the inner compartments force attackers to commit their killsquad early.

2. ANTI-TROOP STRATEGY (120+ words): Provide detailed analysis of how this base counters the three most threatening attack strategies at TH${base.townhall}:
   - Electro Dragon Spam / Hydra (air funnel breaks, air defenses placement, Seeking Air Mines)
   - Queen Charge / Ground Hybrid (how the base delays the Queen walk, positions the Scattershot and X-Bow to punish the queen)
   - Lavaloon / Super Witch (how air traps, Giant Bombs, and the Eagle Artillery punish this army composition)

3. TRAP PLACEMENT LOGIC (80+ words): Explain specifically why Seeking Air Mines are positioned near the eagle artillery or key air defenses, and why Giant Bombs are placed at common funnel entry points. Discuss how the trap layout synergizes with the defense grid.

4. PRO-PLAYER TIPS (80+ words): Write 4-5 actionable pro tips for making this base even harder to three-star. Include tips about:
   - When to switch between this base and an alternative layout
   - How to use the Clan Castle troops most effectively for this base type
   - Legend League considerations if applicable at TH${base.townhall}
   - How to keep this base secret/effective longer by rotating it

5. META RELEVANCE (70+ words): Explain how this base is tuned for the current 2026 meta at TH${base.townhall}. Mention the specific update or patch that makes this layout effective, and why it will hold up for the rest of the current season.

Write professionally, as if published in a top gaming strategy guide. Target keyword: "Best TH${base.townhall} ${base.base_type} Base 2026". Include the keyword naturally 2-3 times.`;
}

export default router;
