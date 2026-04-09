import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, count, sql } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { ai, isAiAvailable } from "@workspace/integrations-gemini-ai";
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

router.get("/blog", async (req: Request, res: Response): Promise<void> => {
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

router.post("/blog", async (req: Request, res: Response): Promise<void> => {
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

router.get("/blog/:slug", async (req: Request, res: Response): Promise<void> => {
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

router.put("/blog/:slug", async (req: Request, res: Response): Promise<void> => {
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

router.delete("/blog/:slug", async (req: Request, res: Response): Promise<void> => {
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

router.post("/blog/generate-post", async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body as { title?: string };
  if (!title?.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (!isAiAvailable()) {
    res.json({ aiUnavailable: true, html: "" });
    return;
  }

  const prompt = `You are an expert Clash of Clans content writer for a base layout website. Write a comprehensive, engaging blog post based on this title: "${title}"

Requirements:
- Length: 700-900 words
- Format: Use HTML tags for structure — <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul>/<li> for bullet lists, <strong> for emphasis
- Tone: Professional, enthusiastic, strategic — like an expert clan war leader sharing insights
- Cover: strategy tips, why this topic matters, practical advice, and a conclusion
- Do NOT include the title as a heading — start directly with an introductory paragraph
- Return ONLY the HTML content, no markdown, no code blocks, no extra commentary`;

  try {
    console.log(`[blog/generate-post] Generating for: "${title}"`);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    let html = (response.text ?? "").trim();
    html = html.replace(/^```html?\s*/i, "").replace(/```\s*$/, "").trim();
    console.log(`[blog/generate-post] Generated ${html.length} chars of HTML`);
    res.json({ html });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[blog/generate-post] Error:", msg);
    res.status(500).json({ error: "Failed to generate post", detail: msg });
  }
});

router.post("/blog/generate-seo", async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body as { title?: string; content?: string };
  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }
  if (!isAiAvailable()) {
    res.json({ aiUnavailable: true, excerpt: "", meta_title: title ?? "", meta_description: "" });
    return;
  }

  const plainText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000);

  const prompt = `You are an SEO expert. Based on this blog post, generate SEO metadata.

Title: ${title || "(untitled)"}
Content preview: ${plainText}

Return ONLY valid JSON in this exact format:
{
  "excerpt": "A compelling 1-2 sentence summary of the post for readers. 150-200 characters.",
  "meta_title": "SEO-optimized page title under 60 characters including the main keyword.",
  "meta_description": "SEO meta description 140-160 characters, includes keyword and call to action."
}`;

  try {
    console.log(`[blog/generate-seo] Generating SEO for: "${title}"`);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 1024 },
    });

    let raw = (response.text ?? "").trim();
    const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeMatch) raw = codeMatch[1].trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const seo = JSON.parse(jsonMatch[0]);
    res.json(seo);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[blog/generate-seo] Error:", msg);
    res.status(500).json({ error: "Failed to generate SEO", detail: msg });
  }
});

export default router;
