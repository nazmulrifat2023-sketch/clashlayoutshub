import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { basesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const BASE_URL = "https://clashlayoutshub.com";

const STATIC_URLS = [
  { loc: "/",              changefreq: "daily",   priority: "1.0" },
  { loc: "/blog",          changefreq: "weekly",  priority: "0.8" },
  { loc: "/about",         changefreq: "monthly", priority: "0.6" },
  { loc: "/contact",       changefreq: "monthly", priority: "0.5" },
  { loc: "/submit-base",   changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy-policy",changefreq: "yearly",  priority: "0.3" },
  { loc: "/terms",         changefreq: "yearly",  priority: "0.3" },
  { loc: "/cookie-policy", changefreq: "yearly",  priority: "0.3" },
  { loc: "/dmca",          changefreq: "yearly",  priority: "0.3" },
  ...[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(th => ({
    loc: `/th/${th}`, changefreq: "weekly", priority: "0.9",
  })),
];

router.get("/sitemap.xml", async (_req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all published base slugs
    const bases = await db
      .select({ slug: basesTable.slug, updated_at: basesTable.created_at })
      .from(basesTable)
      .where(eq(basesTable.is_approved, true))
      .limit(5000);

    const urls: string[] = [];

    // Static URLs
    for (const u of STATIC_URLS) {
      urls.push(`  <url>\n    <loc>${BASE_URL}${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`);
    }

    // Dynamic base URLs
    for (const base of bases) {
      urls.push(`  <url>\n    <loc>${BASE_URL}/base/${base.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    console.error("[sitemap]", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

export default router;
