import { useState } from "react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useListBlogPosts, useDeleteBlogPost } from "@workspace/api-client-react";
import { toast } from "sonner";

export function AdminBlog() {
  const [page, setPage] = useState(1);
  const { data, refetch } = useListBlogPosts({ page, limit: 20 });
  const deletePost = useDeleteBlogPost();

  function handleDelete(slug: string) {
    if (!confirm("Delete this post?")) return;
    deletePost.mutate({ slug }, {
      onSuccess: () => { toast.success("Post deleted"); refetch(); },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Blog Posts</h1>
        <Link href="/admin/blog/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Views</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Published</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.posts.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-muted-foreground text-sm">No posts yet</td></tr>
            ) : data?.posts.map(post => (
              <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="w-3 h-3" />{post.views}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(post.published_at || "").toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/blog/${post.slug}/edit`}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => handleDelete(post.slug)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
