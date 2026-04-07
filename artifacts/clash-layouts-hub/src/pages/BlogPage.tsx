import { useState } from "react";
import { Link } from "wouter";
import { Clock, Eye } from "lucide-react";
import { useListBlogPosts } from "@workspace/api-client-react";

export function BlogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListBlogPosts({ page, limit: 9 });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Clash of Clans Blog</h1>
        <p className="text-muted-foreground">Tips, strategies, and guides from the ClashLayoutsHub community.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-xl animate-pulse aspect-[4/3]" />
          ))}
        </div>
      ) : data && data.posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.posts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className={`group bg-white rounded-xl border border-border overflow-hidden card-hover ${i === 0 && page === 1 ? "md:col-span-3" : ""}`}>
                <div className={`overflow-hidden bg-muted ${i === 0 && page === 1 ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
                  {post.featured_image && (
                    <img src={post.featured_image} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                </div>
                <div className="p-4">
                  <h2 className={`font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 ${i === 0 && page === 1 ? "text-xl" : "text-sm"}`}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.published_at || "").toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 transition-colors">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}
                className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No blog posts yet</p>
          <p className="text-sm mt-2">Check back soon for Clash of Clans strategies and guides.</p>
        </div>
      )}
    </div>
  );
}
