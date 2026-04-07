import { Router, type IRouter } from "express";
import { eq, desc, count, sql } from "drizzle-orm";
import { db, reportsTable, basesTable } from "@workspace/db";
import {
  ListReportsQueryParams,
  CreateReportBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reports", async (req, res): Promise<void> => {
  const parsed = ListReportsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { page = 1 } = parsed.data;
  const limit = 20;
  const offset = (page - 1) * limit;

  const reports = await db
    .select({
      id: reportsTable.id,
      base_id: reportsTable.base_id,
      base_title: basesTable.title,
      reason: reportsTable.reason,
      reporter_ip: reportsTable.reporter_ip,
      created_at: reportsTable.created_at,
    })
    .from(reportsTable)
    .leftJoin(basesTable, eq(reportsTable.base_id, basesTable.id))
    .orderBy(desc(reportsTable.created_at))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db.select({ total: count() }).from(reportsTable);

  res.json({
    reports: reports.map(r => ({
      ...r,
      created_at: r.created_at.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = CreateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket?.remoteAddress || "unknown";

  await db.insert(reportsTable).values({
    base_id: parsed.data.base_id,
    reason: parsed.data.reason,
    reporter_ip: ip,
  });

  const [{ reportCount }] = await db
    .select({ reportCount: count() })
    .from(reportsTable)
    .where(eq(reportsTable.base_id, parsed.data.base_id));

  if (reportCount >= 5) {
    await db.update(basesTable)
      .set({ is_active: false })
      .where(eq(basesTable.id, parsed.data.base_id));
  } else {
    await db.update(basesTable)
      .set({ report_count: reportCount })
      .where(eq(basesTable.id, parsed.data.base_id));
  }

  res.status(201).json({ message: "Report submitted. Thank you for helping us maintain quality." });
});

export default router;
