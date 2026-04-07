import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { savedBasesTable, basesTable, submissionsTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getUserFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/user/saved-bases", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select({
      saved_at: savedBasesTable.created_at,
      base_id: savedBasesTable.base_id,
      id: basesTable.id,
      title: basesTable.title,
      townhall: basesTable.townhall,
      base_type: basesTable.base_type,
      image_url: basesTable.image_url,
      win_rate: basesTable.win_rate,
      copy_count: basesTable.copy_count,
      slug: basesTable.slug,
    })
    .from(savedBasesTable)
    .innerJoin(basesTable, eq(savedBasesTable.base_id, basesTable.id))
    .where(eq(savedBasesTable.user_id, user.id))
    .orderBy(desc(savedBasesTable.created_at));

  res.json(rows);
});

router.get("/user/submissions", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.submitter_user_id, user.id))
    .orderBy(desc(submissionsTable.submitted_at));

  res.json(rows);
});

router.post("/bases/:id/save", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { id: base_id } = req.params;

  const existing = await db
    .select({ id: savedBasesTable.id })
    .from(savedBasesTable)
    .where(and(eq(savedBasesTable.user_id, user.id), eq(savedBasesTable.base_id, base_id)))
    .limit(1);

  if (existing.length) {
    await db
      .delete(savedBasesTable)
      .where(and(eq(savedBasesTable.user_id, user.id), eq(savedBasesTable.base_id, base_id)));
    res.json({ saved: false });
  } else {
    await db.insert(savedBasesTable).values({ user_id: user.id, base_id });
    res.json({ saved: true });
  }
});

router.get("/bases/:id/saved", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.json({ saved: false }); return; }

  const { id: base_id } = req.params;
  const existing = await db
    .select({ id: savedBasesTable.id })
    .from(savedBasesTable)
    .where(and(eq(savedBasesTable.user_id, user.id), eq(savedBasesTable.base_id, base_id)))
    .limit(1);

  res.json({ saved: existing.length > 0 });
});

router.patch("/user/profile", async (req: Request, res: Response): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { display_name } = req.body as { display_name?: string };
  if (!display_name?.trim()) { res.status(400).json({ error: "display_name is required" }); return; }

  const { usersTable } = await import("@workspace/db/schema");
  const { eq } = await import("drizzle-orm");

  const [updated] = await db
    .update(usersTable)
    .set({ display_name: display_name.trim() })
    .where(eq(usersTable.id, user.id))
    .returning({ id: usersTable.id, email: usersTable.email, display_name: usersTable.display_name, created_at: usersTable.created_at });

  res.json(updated);
});

export default router;
