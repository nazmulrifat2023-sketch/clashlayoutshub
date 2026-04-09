import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, count, sql, and, gte } from "drizzle-orm";
import { db, basesTable, submissionsTable, reportsTable, viewsAnalyticsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/analytics/dashboard", async (_req: Request, res: Response): Promise<void> => {
  const [
    [{ totalBases }],
    [{ totalViews }],
    [{ pendingSubmissions }],
    [{ activeReports }],
    basesByTH,
  ] = await Promise.all([
    db.select({ totalBases: count() }).from(basesTable).where(eq(basesTable.is_active, true)),
    db.select({ totalViews: sql<number>`COALESCE(SUM(${basesTable.views}), 0)` }).from(basesTable),
    db.select({ pendingSubmissions: count() }).from(submissionsTable).where(eq(submissionsTable.status, "pending")),
    db.select({ activeReports: count() }).from(reportsTable),
    db.select({ townhall: basesTable.townhall, count: count() })
      .from(basesTable)
      .where(eq(basesTable.is_active, true))
      .groupBy(basesTable.townhall)
      .orderBy(basesTable.townhall),
  ]);

  res.json({
    totalBases,
    totalViews: Number(totalViews),
    pendingSubmissions,
    activeReports,
    basesByTownhall: basesByTH,
  });
});

router.get("/analytics/views", async (_req: Request, res: Response): Promise<void> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().split("T")[0];

  const rows = await db
    .select({
      date: viewsAnalyticsTable.viewed_at,
      views: sql<number>`SUM(${viewsAnalyticsTable.count})`,
    })
    .from(viewsAnalyticsTable)
    .where(gte(viewsAnalyticsTable.viewed_at, cutoff))
    .groupBy(viewsAnalyticsTable.viewed_at)
    .orderBy(viewsAnalyticsTable.viewed_at);

  res.json(rows.map(r => ({ date: r.date, views: Number(r.views) })));
});

router.get("/analytics/top-bases", async (_req: Request, res: Response): Promise<void> => {
  const bases = await db.select().from(basesTable)
    .where(eq(basesTable.is_active, true))
    .orderBy(desc(basesTable.copies))
    .limit(10);

  res.json(bases.map(b => ({
    ...b,
    rating_avg: Number(b.rating_avg),
    health_score: Math.max(0, b.win_rate - b.report_count * 5),
    key_features: b.key_features || [],
    best_against: b.best_against || [],
    created_at: b.created_at.toISOString(),
    updated_at: b.updated_at.toISOString(),
  })));
});

export default router;
