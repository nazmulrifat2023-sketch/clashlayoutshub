import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const uploadsDir = path.resolve(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.post("/upload/image", upload.single("image"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const url = `/api/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

router.post("/suggest-description", async (req, res): Promise<void> => {
  const { townhall, base_type } = req.body as {
    townhall?: number;
    base_type?: string;
  };

  const th = Number(townhall) || 14;
  const type = base_type || "War";

  const prompt = `You are a senior Clash of Clans analyst writing expert base reviews for a top-tier strategy website. Write a detailed, blog-style description for a Town Hall ${th} ${type} base layout.

STRUCTURE — Return ONLY valid HTML using these tags: <h3>, <p>, <strong>. No markdown, no code blocks, no preamble.

Cover exactly these 3 sections in order:

<h3>Defensive Mechanism</h3>
<p>Explain the core structure of this base. Describe the compartment layout, how the Town Hall is protected, the placement logic for key defenses (Scattershots, Eagle Artillery, Inferno Towers, etc.), and how troop pathing is disrupted. Be specific to TH${th}.</p>

<h3>Anti-Meta Tactics</h3>
<p>Explain how this base defends against the current top attack strategies for TH${th} — such as Queen Charge Hybrid, Super Witch Smash, Electro Dragon spam, Blizzard Lalo, or Root Riders. Describe which specific design choices make it resilient to each threat.</p>

<h3>Clan Castle Recommendation</h3>
<p>Suggest the ideal Clan Castle troop composition for this base type. Name specific troops (e.g., Super Minions, Electro Dragon, Inferno Dragon, Skeleton Spell) and explain why they synergize with the base's defensive layout and funneling weaknesses.</p>

RULES:
- Total HTML output must be 1000–1200 characters (including tags).
- Tone: professional, analytical, expert-level — like a paid strategy guide.
- Do NOT include any intro text, title, or closing remarks outside the 3 sections.
- Return ONLY the HTML — nothing else.`;

  try {
    console.log(`[suggest-description] Generating for TH${th} ${type}`);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    let description = (response.text ?? "").trim();
    // Strip any markdown code fences Gemini might wrap around HTML
    description = description.replace(/^```html?\s*/i, "").replace(/```\s*$/, "").trim();
    console.log(`[suggest-description] Raw length: ${description.length} chars`);

    if (!description || description.length < 100) {
      throw new Error("AI returned too short a description");
    }

    // Hard-cap at 1400 chars at the last closing tag boundary
    if (description.length > 1400) {
      const slice = description.slice(0, 1400);
      const lastTag = slice.lastIndexOf("</p>");
      description = lastTag > 800 ? slice.slice(0, lastTag + 4) : slice;
    }

    console.log(`[suggest-description] Final length: ${description.length} chars`);
    res.json({ description });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[suggest-description] Gemini error:", msg);
    res.status(500).json({ error: "Failed to generate description", detail: msg });
  }
});

export default router;
