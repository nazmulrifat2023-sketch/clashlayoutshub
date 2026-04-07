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

  const prompt = `Act as a high-level Clash of Clans strategist. Write a professional, engaging description for a Town Hall ${th} ${type} base. Focus on defense mechanics and troop pathing. The description MUST be between 800 to 900 characters long. Format it as a single, cohesive paragraph. Return ONLY the description text — no quotes, no labels, no extra commentary.`;

  try {
    console.log(`[suggest-description] Generating for TH${th} ${type}`);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    let description = (response.text ?? "").trim().replace(/^["']|["']$/g, "");
    console.log(`[suggest-description] Raw length: ${description.length} chars`);

    if (!description || description.length < 100) {
      throw new Error("AI returned too short a description");
    }

    // Trim to 900 chars at the nearest sentence boundary
    if (description.length > 900) {
      const slice = description.slice(0, 900);
      const lastPeriod = slice.lastIndexOf(".");
      description = lastPeriod > 600 ? slice.slice(0, lastPeriod + 1) : slice;
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
