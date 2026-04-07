import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

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

router.post("/generate-pro-tips", async (req, res): Promise<void> => {
  try {
    const { townhall, base_type } = req.body as { townhall?: number; base_type?: string };

    if (!townhall || !base_type) {
      res.status(400).json({ error: "townhall and base_type are required" });
      return;
    }

    const th = Number(townhall);
    const buildings = TH_BUILDINGS[th] ?? "Inferno Tower, Eagle Artillery, Scattershot";

    const prompt = `You are a Clash of Clans Strategy Expert with 10+ years of competitive and Legend League experience.

Generate exactly 4 unique, professional, actionable defense tips for a TH${th} ${base_type} base.

Key buildings available at TH${th}: ${buildings}.

Rules:
- Each tip must be specific to TH${th} and the ${base_type} base type
- Mention specific buildings (e.g., ${buildings.split(",")[0].trim()}, Clan Castle, traps)
- No generic advice like "place defenses carefully"
- Write each tip as a single sentence or two — concise and tactical
- Avoid repetition between tips

Return ONLY a JSON array of 4 strings, nothing else. Example format:
["Tip one here.", "Tip two here.", "Tip three here.", "Tip four here."]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 1024 },
    });

    const raw = (response.text ?? "").trim();

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      res.status(500).json({ error: "AI returned unexpected format", raw });
      return;
    }

    const tips: string[] = JSON.parse(match[0]);
    if (!Array.isArray(tips) || tips.length === 0) {
      res.status(500).json({ error: "AI returned empty tips array" });
      return;
    }

    res.json({ tips });
  } catch (err) {
    console.error("Pro tips generation error:", err);
    res.status(500).json({ error: "Failed to generate pro tips" });
  }
});

export default router;
