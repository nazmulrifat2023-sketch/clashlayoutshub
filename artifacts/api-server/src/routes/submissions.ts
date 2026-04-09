import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, submissionsTable } from "@workspace/db";
import {
  ListSubmissionsQueryParams,
  CreateSubmissionBody,
  UpdateSubmissionParams,
  UpdateSubmissionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapSubmission(s: typeof submissionsTable.$inferSelect) {
  return {
    ...s,
    submitted_at: s.submitted_at.toISOString(),
  };
}

router.get("/submissions", async (req: Request, res: Response): Promise<void> => {
  const parsed = ListSubmissionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, page = 1 } = parsed.data;
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = status ? [eq(submissionsTable.status, status)] : [];

  const [submissions, [{ total }]] = await Promise.all([
    db.select().from(submissionsTable)
      .where(conditions.length ? conditions[0] : undefined)
      .orderBy(desc(submissionsTable.submitted_at))
      .limit(limit).offset(offset),
    db.select({ total: count() }).from(submissionsTable)
      .where(conditions.length ? conditions[0] : undefined),
  ]);

  res.json({
    submissions: submissions.map(mapSubmission),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/submissions", async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.layout_link.includes("link.clashofclans.com")) {
    res.status(400).json({ error: "Layout link must be a valid Clash of Clans link (link.clashofclans.com)" });
    return;
  }

  await db.insert(submissionsTable).values({ ...parsed.data, status: "pending" });
  res.status(201).json({ message: "Submission received! Our team will review it soon." });
});

router.put("/submissions/:id", async (req: Request, res: Response): Promise<void> => {
  const params = UpdateSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [sub] = await db.update(submissionsTable).set(parsed.data).where(eq(submissionsTable.id, params.data.id)).returning();
  if (!sub) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json({ message: `Submission ${parsed.data.status}` });
});

export default router;
