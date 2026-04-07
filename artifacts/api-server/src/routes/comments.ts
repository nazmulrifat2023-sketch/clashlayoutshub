import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, commentsTable, basesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import {
  ListCommentsParams,
  AddCommentParams,
  AddCommentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapComment(c: typeof commentsTable.$inferSelect) {
  return {
    ...c,
    created_at: c.created_at.toISOString(),
  };
}

router.get("/comments/:baseId", async (req, res): Promise<void> => {
  const params = ListCommentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const comments = await db.select().from(commentsTable)
    .where(eq(commentsTable.base_id, params.data.baseId))
    .orderBy(desc(commentsTable.created_at));

  res.json(comments.map(mapComment));
});

router.post("/comments/:baseId", async (req, res): Promise<void> => {
  const params = AddCommentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AddCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [comment] = await db.insert(commentsTable).values({
    base_id: params.data.baseId,
    ...parsed.data,
  }).returning();

  if (parsed.data.rating) {
    const allRatings = await db.select({ rating: commentsTable.rating })
      .from(commentsTable)
      .where(eq(commentsTable.base_id, params.data.baseId));

    const validRatings = allRatings.filter(r => r.rating != null).map(r => r.rating!);
    if (validRatings.length > 0) {
      const avg = validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
      await db.update(basesTable)
        .set({ rating_avg: avg.toFixed(2), rating_count: validRatings.length })
        .where(eq(basesTable.id, params.data.baseId));
    }
  }

  res.status(201).json(mapComment(comment));
});

export default router;
