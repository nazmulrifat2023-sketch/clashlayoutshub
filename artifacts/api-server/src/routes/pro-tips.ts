import { Router, type IRouter, type Request, type Response } from "express";
import { ai, isAiAvailable } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const TH_BUILDINGS: Record<number, string> = {
  3:  "Mortar, Archer Tower, Cannon",
  4:  "Air Defense, Mortar, Hidden Tesla",
  5:  "Air Sweeper, Dark Elixir Drill, Wizard Tower",
  6:  "X-Bow, Wizard Tower, Air Defense",
  7:  "X-Bow, Dark Elixir Storage, Skeleton Traps",
  8:  "Inferno Tower, X-Bow, Bomb Tower",
  9:  "Inferno Tower, X-Bow, Bomb Tower",
  10: "Inferno Tower, X-Bow, Giant Cannon",
  11: "Eagle Artillery, X-Bow, Inferno Tower",
  12: "Scattershot, Eagle Artillery, Inferno Tower",
  13: "Scattershot, Eagle Artillery, Giga Tesla",
  14: "Scattershot, Eagle Artillery, Giga Tesla",
  15: "Monolith, Scattershot, Eagle Artillery",
  16: "Monolith, Scattershot, Multi-Gear Tower",
  17: "Monolith, Scattershot, Ricochet Cannon",
  18: "Monolith, Super X-Bow, Ricochet Cannon",
};

router.post("/generate-pro-tips", async (req: Request, res: Response): Promise<void> => {
  if (!isAiAvailable()) {
    res.json({ aiUnavailable: true, tips: ["AI features are only available in the Replit environment. Add bases manually for now."] });
    return;
  }
  try {
    const { townhall, base_type } = req.body as { townhall?: number; base_type?: string };

    if (!townhall || !base_type) {
      res.status(400).json({ error: "townhall and base_type are required" });
      return;
    }

    const th = Number(townhall);
    const buildings = TH_BUILDINGS[th] ?? "Inferno Tower, Eagle Artillery, Scattershot";
    const building1 = buildings.split(",")[0].trim();

    const prompt = `You are a Clash of Clans expert. Return ONLY valid JSON — no markdown, no explanation.

Task: Generate 4 short, tactical defense tips for a TH${th} ${base_type} base.
Key buildings at TH${th}: ${buildings}.

Each tip: 1-2 sentences max, 20-30 words, specific and actionable.

Required JSON format (return exactly this structure):
["tip1 here","tip2 here","tip3 here","tip4 here"]

Tips must mention: ${building1}, Clan Castle, traps, and ${base_type} strategy.`;

    console.log(`[pro-tips] Generating tips for TH${th} ${base_type}`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const raw = (response.text ?? "").trim();
    console.log(`[pro-tips] Raw response (${raw.length} chars):`, raw.substring(0, 300));

    let jsonStr = raw;
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();

    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      console.error("[pro-tips] No JSON array found in response:", raw);
      res.status(500).json({ error: "AI returned unexpected format", raw });
      return;
    }

    let tips: string[];
    try {
      tips = JSON.parse(arrayMatch[0]);
    } catch (parseErr) {
      console.error("[pro-tips] JSON parse failed:", parseErr, "raw:", arrayMatch[0]);
      res.status(500).json({ error: "AI returned malformed JSON", raw: arrayMatch[0] });
      return;
    }

    if (!Array.isArray(tips) || tips.length === 0) {
      console.error("[pro-tips] Empty tips array:", tips);
      res.status(500).json({ error: "AI returned empty tips array" });
      return;
    }

    const cleanTips = tips.map((t) => String(t).trim()).filter(Boolean);
    console.log(`[pro-tips] Success — ${cleanTips.length} tips generated`);
    res.json({ tips: cleanTips });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pro-tips] Gemini call failed:", msg);
    res.status(500).json({ error: "Failed to generate pro tips", detail: msg });
  }
});

export default router;
