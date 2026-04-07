import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

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

const DESCRIPTION_TEMPLATES: Record<string, (th: number) => string> = {
  War: (th) =>
    `Best TH${th} war base layout for 2026 meta. This design features deep compartmentalization to slow down funneling attempts, centralized Town Hall protection, and overlapping defense coverage that counters Super Witch, Hybrid, and Yeti Smash strategies. Extensively tested in clan war leagues and verified by our community with high defense success rates.`,
  "Anti 3 Star": (th) =>
    `Dominant TH${th} anti-three-star base engineered for competitive clan war. The layout neutralizes the top attack strategies at TH${th} through strategic Scattershot and Eagle Artillery placement, tight compartments that bleed troops, and a core designed to resist queen charges. Community-verified with strong three-star prevention statistics.`,
  Farming: (th) =>
    `Top-rated TH${th} farming base for 2026 that locks Dark Elixir deep inside three wall layers, making it nearly impossible for Sneaky Goblins or Super Archers to reach. Gold and Elixir collectors are semi-exposed as a deliberate decoy while the storage core remains protected. Optimized for players actively farming between Town Hall upgrades.`,
  Hybrid: (th) =>
    `Versatile TH${th} hybrid base balancing trophy defense and resource protection simultaneously. This layout uses centralized storages with the Town Hall embedded nearby, forcing attackers to sacrifice troops to reach loot while generating enough trophy protection to keep you in a strong league. Tested against all common TH${th} attack compositions.`,
  Trophy: (th) =>
    `Proven TH${th} trophy base built for consistent high-league performance in 2026. The design prioritizes zero and one-star defense results through spread-out air defenses, hard-to-funnel compartments, and a Town Hall that serves as bait with heavy surrounding defenses. Ideal for pushing through Crystal, Master, and Champion leagues.`,
  "Anti Air": (th) =>
    `Specialized TH${th} anti-air base that destroys air armies before they can three-star. Air Defenses, Scattershots, and Air Sweepers are positioned to create overlapping coverage zones that eliminate Lava Hounds, Balloons, and Blimp attacks efficiently. A strong counter to the most popular air strategies in the current meta.`,
  "Legend League": (th) =>
    `Elite TH${th} Legend League base designed for the highest tier of competitive play. Every defense placement is optimized for maximum attack difficulty, with tight inner compartments, unpredictable Town Hall positioning, and layered wall segments that absorb super troops. Trusted by thousands of Legend League players worldwide.`,
  Progress: (th) =>
    `Smart TH${th} progress base that protects your key upgrade resources while you build toward TH${th + 1}. Builders' Huts and key storages are protected inside the core while outer structures distract attackers. A balanced layout that holds enough trophies for comfortable farming in the right league bracket.`,
};

router.post("/suggest-description", (req, res): void => {
  const { townhall, base_type, title } = req.body as {
    townhall?: number;
    base_type?: string;
    title?: string;
  };

  const th = Number(townhall) || 14;
  const type = base_type || "War";
  const generator = DESCRIPTION_TEMPLATES[type] ?? DESCRIPTION_TEMPLATES["War"];
  const description = generator(th);

  res.json({ description });
});

export default router;
