import { Router, type IRouter } from "express";
import { eq, desc, count, sql } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  CreateBlogPostBody,
  UpdateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostParams,
  DeleteBlogPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapPost(p: typeof blogPostsTable.$inferSelect) {
  return {
    ...p,
    published_at: p.published_at.toISOString(),
    created_at: p.created_at.toISOString(),
  };
}

router.get("/blog", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { page = 1, limit = 10 } = parsed.data;
  const offset = (page - 1) * limit;

  const [posts, [{ total }]] = await Promise.all([
    db.select().from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.published_at))
      .limit(limit).offset(offset),
    db.select({ total: count() }).from(blogPostsTable).where(eq(blogPostsTable.published, true)),
  ]);

  res.json({
    posts: posts.map(mapPost),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

  const [post] = await db.insert(blogPostsTable).values({ ...data, slug }).returning();
  res.status(201).json(mapPost(post));
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, params.data.slug));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  await db.update(blogPostsTable).set({ views: sql`${blogPostsTable.views} + 1` }).where(eq(blogPostsTable.id, post.id));
  res.json(mapPost(post));
});

router.put("/blog/:slug", async (req, res): Promise<void> => {
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.update(blogPostsTable).set(parsed.data).where(eq(blogPostsTable.slug, params.data.slug)).returning();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(mapPost(post));
});

router.delete("/blog/:slug", async (req, res): Promise<void> => {
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, params.data.slug)).returning();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json({ message: "Post deleted" });
});

export default router;
