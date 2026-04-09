import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, desc, asc, ilike, sql, count, ne, inArray } from "drizzle-orm";
import { db, basesTable, reportsTable, copiesAnalyticsTable, viewsAnalyticsTable } from "@workspace/db";
import {
  ListBasesQueryParams,
  CreateBaseBody,
  UpdateBaseBody,
  GetBaseParams,
  GetBaseBySlugParams,
  IncrementBaseCopyParams,
  IncrementBaseViewParams,
  GetSimilarBasesParams,
  GetBaseTodayCopiesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function computeHealthScore(winRate: number, reportCount: number): number {
  return Math.max(0, winRate - reportCount * 5);
}

function mapBase(b: typeof basesTable.$inferSelect) {
  return {
    ...b,
    rating_avg: Number(b.rating_avg),
    health_score: computeHealthScore(b.win_rate, b.report_count),
    key_features: b.key_features || [],
    best_against: b.best_against || [],
    created_at: b.created_at.toISOString(),
    updated_at: b.updated_at.toISOString(),
  };
}

router.get("/bases", async (req: Request, res: Response): Promise<void> => {
  const parsed = ListBasesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { townhall, base_type, difficulty, sort, page = 1, limit = 20, search } = parsed.data;

  const conditions = [
    eq(basesTable.approved, true),
    eq(basesTable.is_active, true),
  ];

  if (townhall) conditions.push(eq(basesTable.townhall, townhall));
  if (base_type) conditions.push(eq(basesTable.base_type, base_type));
  if (difficulty) conditions.push(eq(basesTable.difficulty, difficulty));
  if (search) conditions.push(ilike(basesTable.title, `%${search}%`));

  let orderBy;
  switch (sort) {
    case "most_viewed": orderBy = desc(basesTable.views); break;
    case "top_rated": orderBy = desc(basesTable.rating_avg); break;
    case "most_copied": orderBy = desc(basesTable.copies); break;
    default: orderBy = desc(basesTable.created_at);
  }

  const offset = (page - 1) * limit;

  const [bases, [{ total }]] = await Promise.all([
    db.select().from(basesTable).where(and(...conditions)).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ total: count() }).from(basesTable).where(and(...conditions)),
  ]);

  res.json({
    bases: bases.map(mapBase),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.get("/bases/trending", async (_req: Request, res: Response): Promise<void> => {
  const bases = await db.select().from(basesTable)
    .where(and(eq(basesTable.approved, true), eq(basesTable.is_active, true)))
    .orderBy(desc(basesTable.copies))
    .limit(6);
  res.json(bases.map(mapBase));
});

router.get("/bases/base-of-day", async (_req: Request, res: Response): Promise<void> => {
  const bases = await db.select().from(basesTable)
    .where(and(eq(basesTable.approved, true), eq(basesTable.is_active, true)))
    .orderBy(desc(basesTable.rating_avg))
    .limit(1);
  if (!bases[0]) {
    res.json({ base: null });
    return;
  }
  res.json(mapBase(bases[0]));
});

router.get("/bases/stats", async (_req: Request, res: Response): Promise<void> => {
  const [{ total }] = await db.select({ total: count() }).from(basesTable).where(and(eq(basesTable.approved, true), eq(basesTable.is_active, true)));
  const [viewsRow] = await db.select({ totalViews: sql<number>`COALESCE(SUM(${basesTable.views}), 0)` }).from(basesTable);
  const [copiesRow] = await db.select({ totalCopies: sql<number>`COALESCE(SUM(${basesTable.copies}), 0)` }).from(basesTable);

  const { blogPostsTable } = await import("@workspace/db");
  const [{ blogCount }] = await db.select({ blogCount: count() }).from(blogPostsTable);

  res.json({
    totalBases: total,
    totalViews: Number(viewsRow?.totalViews ?? 0),
    totalCopies: Number(copiesRow?.totalCopies ?? 0),
    totalBlogPosts: blogCount,
  });
});

router.get("/bases/th-summary", async (_req: Request, res: Response): Promise<void> => {
  const result = await db
    .select({
      townhall: basesTable.townhall,
      count: count(),
      topType: sql<string>`MODE() WITHIN GROUP (ORDER BY ${basesTable.base_type})`,
    })
    .from(basesTable)
    .where(and(eq(basesTable.approved, true), eq(basesTable.is_active, true)))
    .groupBy(basesTable.townhall)
    .orderBy(basesTable.townhall);

  res.json(result.map(r => ({
    townhall: r.townhall,
    count: r.count,
    topType: r.topType || "War",
  })));
});

router.post("/bases", async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateBaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

  const [base] = await db.insert(basesTable).values({
    ...data,
    slug,
    views: 0,
    copies: 0,
    report_count: 0,
    rating_avg: "0",
    rating_count: 0,
  }).returning();

  res.status(201).json(mapBase(base));
});

router.get("/bases/slug/:slug", async (req: Request, res: Response): Promise<void> => {
  const params = GetBaseBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [base] = await db.select().from(basesTable).where(eq(basesTable.slug, params.data.slug));
  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }
  res.json(mapBase(base));
});

router.get("/bases/:id", async (req: Request, res: Response): Promise<void> => {
  const params = GetBaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [base] = await db.select().from(basesTable).where(eq(basesTable.id, params.data.id));
  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }
  res.json(mapBase(base));
});

router.put("/bases/:id", async (req: Request, res: Response): Promise<void> => {
  const idRaw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = UpdateBaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [base] = await db.update(basesTable)
    .set({ ...parsed.data, updated_at: new Date() })
    .where(eq(basesTable.id, idRaw))
    .returning();

  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }
  res.json(mapBase(base));
});

router.delete("/bases/:id", async (req: Request, res: Response): Promise<void> => {
  const idRaw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [base] = await db.delete(basesTable).where(eq(basesTable.id, idRaw)).returning();
  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }
  res.json({ message: "Base deleted" });
});

router.post("/bases/:id/copy", async (req: Request, res: Response): Promise<void> => {
  const params = IncrementBaseCopyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [base] = await db.update(basesTable)
    .set({ copies: sql`${basesTable.copies} + 1` })
    .where(eq(basesTable.id, params.data.id))
    .returning({ copies: basesTable.copies });

  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  await db.execute(sql`
    INSERT INTO copies_analytics (id, base_id, copied_at, count)
    VALUES (gen_random_uuid(), ${params.data.id}, ${today}, 1)
    ON CONFLICT (base_id, copied_at) DO UPDATE SET count = copies_analytics.count + 1
  `);

  res.json({ copies: base.copies, message: "Copy recorded" });
});

router.post("/bases/:id/view", async (req: Request, res: Response): Promise<void> => {
  const params = IncrementBaseViewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.update(basesTable)
    .set({ views: sql`${basesTable.views} + 1` })
    .where(eq(basesTable.id, params.data.id));

  const today = new Date().toISOString().split("T")[0];
  await db.execute(sql`
    INSERT INTO views_analytics (id, base_id, viewed_at, count)
    VALUES (gen_random_uuid(), ${params.data.id}, ${today}, 1)
    ON CONFLICT (base_id, viewed_at) DO UPDATE SET count = views_analytics.count + 1
  `);

  res.json({ message: "View recorded" });
});

router.get("/bases/:id/similar", async (req: Request, res: Response): Promise<void> => {
  const params = GetSimilarBasesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [base] = await db.select().from(basesTable).where(eq(basesTable.id, params.data.id));
  if (!base) {
    res.status(404).json({ error: "Base not found" });
    return;
  }

  const similar = await db.select().from(basesTable)
    .where(and(
      eq(basesTable.townhall, base.townhall),
      eq(basesTable.base_type, base.base_type),
      ne(basesTable.id, params.data.id),
      eq(basesTable.approved, true),
      eq(basesTable.is_active, true),
    ))
    .limit(6);

  res.json(similar.map(mapBase));
});

router.get("/bases/:id/today-copies", async (req: Request, res: Response): Promise<void> => {
  const params = GetBaseTodayCopiesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const result = await db.select({ count: copiesAnalyticsTable.count })
    .from(copiesAnalyticsTable)
    .where(and(
      eq(copiesAnalyticsTable.base_id, params.data.id),
      eq(copiesAnalyticsTable.copied_at, today),
    ))
    .limit(1);

  res.json({ todayCopies: result[0]?.count ?? 0 });
});

export default router;
