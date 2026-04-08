import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { CalendarDays, Eye, ArrowRight, BookOpen } from "lucide-react";
import { useListBlogPosts } from "@workspace/api-client-react";

const GOLD = "#EB8D00";

/** Derive a display tag from the post title / slug */
function deriveTag(title: string, slug: string): string {
  const text = `${title} ${slug}`.toLowerCase();
  if (text.includes("war")) return "War";
  if (text.includes("farm")) return "Farming";
  if (text.includes("trophy")) return "Trophy";
  if (text.includes("legend")) return "Legend";
  if (text.includes("hybrid")) return "Hybrid";
  if (text.includes("guide")) return "Guide";
  if (text.includes("tip")) return "Tips";
  if (text.includes("attack")) return "Attack";
  if (text.includes("defend") || text.includes("defense")) return "Defense";
  return "Strategy";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Single blog card — uniform across all posts */
function BlogCard({ post }: { post: any }) {
  const tag = deriveTag(post.title, post.slug);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden
                 transition-all duration-300 ease-out
                 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out
                       group-hover:scale-105"
          />
        ) : (
          /* Fallback placeholder */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GOLD}22 0%, ${GOLD}08 100%)` }}
          >
            <BookOpen className="w-10 h-10 opacity-30" style={{ color: GOLD }} />
          </div>
        )}

        {/* Gold category tag */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold
                     backdrop-blur-sm shadow-sm"
          style={{ backgroundColor: GOLD, color: "#1a1200" }}
        >
          {tag}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h2
          className="font-black text-base leading-snug line-clamp-2 mb-2
                     group-hover:text-primary transition-colors duration-200"
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views?.toLocaleString() ?? 0}
            </span>
          </div>

          <span
            className="flex items-center gap-1 text-xs font-bold transition-all duration-200
                       group-hover:gap-2"
            style={{ color: GOLD }}
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Loading skeleton — matches the exact card shape */
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-4/6" />
        </div>
        <div className="flex justify-between pt-3 border-t border-border/60">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function BlogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListBlogPosts({ page, limit: 9 });

  useSEO({
    title: "Clash of Clans Blog — Pro Guides & Meta Strategies 2026 | ClashLayoutsHub",
    description: "Expert CoC guides: base breakdowns, war strategies, farming tips, and Town Hall meta analysis. Updated every week for the 2026 meta.",
    ogTitle: "Clash of Clans Blog — Pro Guides & Strategies 2026",
    ogDescription: "Pro base guides, war strategies, and meta breakdowns for every Town Hall level. Stay ahead of the CoC meta with ClashLayoutsHub.",
    canonical: "https://clashlayoutshub.com/blog",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${GOLD}20` }}
          >
            <BookOpen className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Clash of Clans Blog</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base ml-[52px]">
          Pro strategies, base breakdowns, and meta guides — updated for 2026.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data && data.posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {data.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium
                           disabled:opacity-40 hover:border-primary/50 hover:bg-muted
                           transition-colors"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                      p === page
                        ? "text-white"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                    style={p === page ? { backgroundColor: GOLD } : {}}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium
                           disabled:opacity-40 hover:border-primary/50 hover:bg-muted
                           transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: `${GOLD}15` }}
          >
            <BookOpen className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Check back soon for Clash of Clans strategies, base breakdowns, and meta guides.
          </p>
        </div>
      )}
    </div>
  );
}
