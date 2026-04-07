import pg from "pg";
import { GoogleGenAI } from "@google/genai";

const { Client } = pg;
const db = new Client({ connectionString: process.env.DATABASE_URL });

const TH_BUILDINGS = {
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

const BASE_URL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
const API_KEY  = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

const ai = new GoogleGenAI({ vertexai: false, apiKey: API_KEY, httpOptions: { baseUrl: BASE_URL } });

async function generateTips(th, baseType) {
  const buildings = TH_BUILDINGS[th] ?? "Inferno Tower, Eagle Artillery";
  const b1 = buildings.split(",")[0].trim();
  const prompt = `You are a Clash of Clans expert. Return ONLY valid JSON — no markdown, no explanation.

Task: Generate 4 short, tactical defense tips for a TH${th} ${baseType} base.
Key buildings at TH${th}: ${buildings}.

Each tip: 1-2 sentences max, 20-30 words, specific and actionable.

Required JSON format:
["tip1 here","tip2 here","tip3 here","tip4 here"]

Tips must mention: ${b1}, Clan Castle, traps, and ${baseType} strategy.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { maxOutputTokens: 8192 },
  });

  const raw = (response.text ?? "").trim();
  const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr  = codeMatch ? codeMatch[1].trim() : raw;
  const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (!arrMatch) throw new Error(`No JSON array in response: ${raw.substring(0, 200)}`);
  const tips = JSON.parse(arrMatch[0]);
  if (!Array.isArray(tips) || tips.length === 0) throw new Error("Empty array");
  return tips.map(String);
}

async function runBatch(combos) {
  const results = await Promise.allSettled(
    combos.map(async ({ th, type }) => {
      try {
        const tips = await generateTips(th, type);
        await db.query(
          `UPDATE bases SET pro_tips = $1 WHERE townhall = $2 AND base_type = $3`,
          [tips, th, type]
        );
        console.log(`✅ TH${th} ${type} — ${tips.length} tips saved`);
        return { th, type, ok: true };
      } catch (err) {
        console.error(`❌ TH${th} ${type} — ${err.message}`);
        return { th, type, ok: false };
      }
    })
  );
  return results;
}

async function main() {
  await db.connect();
  console.log("Connected to DB");

  const { rows: combos } = await db.query(
    `SELECT DISTINCT townhall AS th, base_type AS type FROM bases WHERE pro_tips = '{}' ORDER BY townhall, base_type`
  );
  console.log(`Found ${combos.length} TH+type combos to fill`);

  // Process in batches of 5 concurrent
  const BATCH = 5;
  let done = 0;
  for (let i = 0; i < combos.length; i += BATCH) {
    const batch = combos.slice(i, i + BATCH);
    console.log(`\n--- Batch ${Math.floor(i / BATCH) + 1} (${i + 1}–${Math.min(i + BATCH, combos.length)} of ${combos.length}) ---`);
    await runBatch(batch);
    done += batch.length;
    // Short pause between batches to be polite to the API
    if (i + BATCH < combos.length) await new Promise(r => setTimeout(r, 1500));
  }

  const { rows: [{ cnt }] } = await db.query(
    `SELECT COUNT(*) AS cnt FROM bases WHERE array_length(pro_tips, 1) > 0`
  );
  console.log(`\n🎉 Done! ${cnt} bases now have pro tips.`);
  await db.end();
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
