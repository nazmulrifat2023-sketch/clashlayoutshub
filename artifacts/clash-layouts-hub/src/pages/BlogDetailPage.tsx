import { useParams, Link } from "wouter";
import { ChevronRight, Clock, Eye, CalendarDays } from "lucide-react";
import { useGetBlogPost } from "@workspace/api-client-react";
import { AdUnit } from "@/components/ads/AdUnit";
import { useSEO } from "@/hooks/useSEO";

const GOLD = "#EB8D00";

/** Split HTML string at a natural point for ad injection */
function splitContent(html: string): [string, string] {
  const closeH2 = html.indexOf("</h2>");
  if (closeH2 > 80) return [html.slice(0, closeH2 + 5), html.slice(closeH2 + 5)];
  const closeP = html.indexOf("</p>");
  if (closeP > 40) return [html.slice(0, closeP + 4), html.slice(closeP + 4)];
  const mid = Math.floor(html.length * 0.3);
  return [html.slice(0, mid), html.slice(mid)];
}

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug || "");

  const plainText = post?.content
    ? post.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    : "";

  useSEO({
    title: post?.title,
    description: post
      ? plainText.slice(0, 155) + (plainText.length > 155 ? "…" : "")
      : undefined,
    ogImage: post?.cover_image || undefined,
    ogType: "article",
  });

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-10 animate-pulse space-y-4">
        <div className="h-3 bg-muted rounded w-40" />
        <div className="h-9 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-44" />
        <div className="aspect-[16/9] bg-muted rounded-2xl" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-4 bg-muted rounded ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    );
  }

  /* ── Not found ── */
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const [part1, part2] = splitContent(post.content || "");
  const readingMins = Math.max(1, Math.ceil(
    (post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 200
  ));
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <article className="max-w-3xl mx-auto px-5 py-8 pb-16">

      {/* Breadcrumb */}
      <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[220px] sm:max-w-none">
          {post.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground mb-7">
        {formattedDate && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {formattedDate}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {readingMins} min read
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          {post.views?.toLocaleString() ?? 0} views
        </span>
      </div>

      {/* Featured image */}
      {post.featured_image && (
        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 border border-border shadow-sm">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Excerpt / lead */}
      {post.excerpt && (
        <p
          className="text-base sm:text-lg font-medium text-muted-foreground leading-relaxed border-l-4 pl-4 mb-8 italic"
          style={{ borderColor: GOLD }}
        >
          {post.excerpt}
        </p>
      )}

      {/* Content — Part 1 */}
      <div
        className="prose prose-slate prose-base sm:prose-lg max-w-none
          prose-headings:font-black prose-headings:text-foreground
          prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
          prose-li:text-muted-foreground prose-li:leading-relaxed
          prose-ul:my-4 prose-ol:my-4
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-bold"
        dangerouslySetInnerHTML={{ __html: part1 }}
      />

      {/* Mid-article ad */}
      <AdUnit slot="blog-after-intro" className="my-8" />

      {/* Content — Part 2 */}
      {part2 && (
        <div
          className="prose prose-slate prose-base sm:prose-lg max-w-none
            prose-headings:font-black prose-headings:text-foreground
            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: part2 }}
        />
      )}

      {/* Pre-conclusion ad */}
      <AdUnit slot="blog-pre-conclusion" className="my-10" />

      {/* Footer nav */}
      <div className="pt-8 border-t border-border flex items-center justify-between">
        <Link
          href="/blog"
          className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
        >
          ← All Posts
        </Link>
        <span className="text-xs text-muted-foreground">
          ClashLayoutsHub Blog
        </span>
      </div>

    </article>
  );
}
