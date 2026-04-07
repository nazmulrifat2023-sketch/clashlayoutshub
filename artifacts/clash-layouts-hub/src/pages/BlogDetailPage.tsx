import { useParams, Link } from "wouter";
import { ChevronRight, Clock, Eye } from "lucide-react";
import { useGetBlogPost } from "@workspace/api-client-react";

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug || "");

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-10 bg-muted rounded w-2/3" />
        <div className="h-60 bg-muted rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
      </nav>

      <h1 className="text-3xl font-black mb-4">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {new Date(post.published_at || "").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {post.views} views
        </span>
      </div>

      {post.featured_image && (
        <div className="aspect-[16/9] overflow-hidden rounded-xl mb-8 border border-border">
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-sm max-w-none">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-border">
        <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
