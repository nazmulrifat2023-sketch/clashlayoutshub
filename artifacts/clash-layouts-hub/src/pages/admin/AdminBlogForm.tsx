import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useCreateBlogPost, useGetBlogPost, useUpdateBlogPost } from "@workspace/api-client-react";
import { toast } from "sonner";

type FormData = {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
};

export function AdminBlogForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = !!slug;
  const [, setLocation] = useLocation();

  const { data: existing } = useGetBlogPost(slug || "", { query: { enabled: isEdit } });
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { published: true },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        content: existing.content,
        excerpt: existing.excerpt,
        featured_image: existing.featured_image,
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || "",
        published: existing.published ?? true,
      });
    }
  }, [existing, reset]);

  async function onSubmit(data: FormData) {
    if (isEdit) {
      updatePost.mutate({ slug: slug!, data }, {
        onSuccess: () => { toast.success("Post updated!"); setLocation("/admin/blog"); },
      });
    } else {
      createPost.mutate({ data }, {
        onSuccess: () => { toast.success("Post created!"); setLocation("/admin/blog"); },
      });
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black mb-6">{isEdit ? "Edit Post" : "New Blog Post"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Title</label>
          <input {...register("title", { required: true })} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Featured Image URL</label>
          <input {...register("featured_image", { required: true })} placeholder="https://..." className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Excerpt</label>
          <textarea {...register("excerpt", { required: true })} rows={2} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Content</label>
          <textarea {...register("content", { required: true })} rows={12} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-mono" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Meta Title</label>
            <input {...register("meta_title")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Meta Description</label>
            <input {...register("meta_description")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("published")} id="published" className="w-4 h-4 accent-primary" />
          <label htmlFor="published" className="text-sm font-medium">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setLocation("/admin/blog")}
            className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={createPost.isPending || updatePost.isPending}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {createPost.isPending || updatePost.isPending ? "Saving..." : (isEdit ? "Update Post" : "Publish Post")}
          </button>
        </div>
      </form>
    </div>
  );
}
