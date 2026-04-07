import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useCreateBlogPost, useGetBlogPost, useUpdateBlogPost } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Sparkles, Wand2, Loader2, Bold, Italic, List, Heading2, Heading3,
  Link2, X, FileImage,
} from "lucide-react";

const GOLD = "#D4AF37";

type FormData = {
  title: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
};

function normalizeImgurUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,10})(?:\.[a-zA-Z]+)?$/);
  if (match) return `https://i.imgur.com/${match[1]}.png`;
  return url;
}

const inputCls =
  "w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white";

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[320px] p-4 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value]);

  const setLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-gray-50">
        <ToolbarBtn title="Bold" active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarBtn title="Bullet List" active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Insert Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="w-4 h-4" />
        </ToolbarBtn>
        {editor.isActive("link") && (
          <ToolbarBtn title="Remove Link"
            onClick={() => editor.chain().focus().unsetLink().run()}>
            <X className="w-4 h-4 text-red-400" />
          </ToolbarBtn>
        )}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums pr-1">
          {wordCount} words
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export function AdminBlogForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = !!slug;
  const [, setLocation] = useLocation();

  const { data: existing } = useGetBlogPost(slug || "", { query: { enabled: isEdit } });
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [generatingPost, setGeneratingPost] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: { published: true },
  });

  const title = watch("title") || "";
  const excerpt = watch("excerpt") || "";
  const metaTitle = watch("meta_title") || "";
  const metaDesc = watch("meta_description") || "";

  useEffect(() => {
    if (existing) {
      const img = normalizeImgurUrl(existing.featured_image || "");
      setImageUrl(img);
      setImagePreview(img);
      setContent(existing.content || "");
      reset({
        title: existing.title,
        excerpt: existing.excerpt || "",
        featured_image: img,
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || "",
        published: existing.published ?? true,
      });
    }
  }, [existing, reset]);

  function handleImageInput(raw: string) {
    const normalized = normalizeImgurUrl(raw);
    setImageUrl(normalized);
    setImagePreview(normalized);
    setValue("featured_image", normalized);
  }

  async function handleGeneratePost() {
    if (!title.trim()) {
      toast.error("Enter a title first — AI needs it to write the post");
      return;
    }
    setGeneratingPost(true);
    try {
      const res = await fetch("/api/blog/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (json.html) {
        setContent(json.html);
        toast.success("Blog post generated! Review and edit as needed.");
      } else {
        toast.error(json.error || "AI returned no content");
      }
    } catch {
      toast.error("Failed to generate post — try again");
    } finally {
      setGeneratingPost(false);
    }
  }

  async function handleAutoFillSeo() {
    const plainContent = content.replace(/<[^>]+>/g, "").trim();
    if (!plainContent) {
      toast.error("Write or generate some content first");
      return;
    }
    setGeneratingSeo(true);
    try {
      const res = await fetch("/api/blog/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const json = await res.json();
      if (json.excerpt) {
        setValue("excerpt", json.excerpt, { shouldValidate: true });
        setValue("meta_title", json.meta_title || "", { shouldValidate: true });
        setValue("meta_description", json.meta_description || "", { shouldValidate: true });
        toast.success("SEO fields filled!");
      } else {
        toast.error(json.error || "AI returned no SEO data");
      }
    } catch {
      toast.error("Failed to generate SEO — try again");
    } finally {
      setGeneratingSeo(false);
    }
  }

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      content,
      featured_image: imageUrl || data.featured_image,
    };
    if (isEdit) {
      updatePost.mutate({ slug: slug!, data: payload }, {
        onSuccess: () => { toast.success("Post updated!"); setLocation("/admin/blog"); },
        onError: () => toast.error("Failed to update post"),
      });
    } else {
      createPost.mutate({ data: payload }, {
        onSuccess: () => { toast.success("Post published!"); setLocation("/admin/blog"); },
        onError: () => toast.error("Failed to publish post"),
      });
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black mb-6">{isEdit ? "Edit Post" : "New Blog Post"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Title + Generate AI Post */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold">Title</label>
            <button
              type="button"
              onClick={handleGeneratePost}
              disabled={generatingPost}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50"
              style={{ backgroundColor: `${GOLD}15`, borderColor: `${GOLD}50`, color: GOLD }}
            >
              {generatingPost
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Sparkles className="w-3.5 h-3.5" />}
              {generatingPost ? "Writing…" : "✨ Generate AI Post"}
            </button>
          </div>
          <input
            {...register("title", { required: true })}
            placeholder="e.g. Best TH14 War Base Strategies for 2026"
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Enter the title, then click <span className="font-medium" style={{ color: GOLD }}>Generate AI Post</span> to auto-write the full article.
          </p>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl border border-border p-5">
          <label className="flex items-center gap-1.5 text-sm font-semibold mb-1.5">
            <FileImage className="w-4 h-4 text-muted-foreground" />
            Featured Image
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => handleImageInput(e.target.value)}
            placeholder="Paste an image URL (Imgur, Unsplash, direct link…)"
            className={inputCls}
          />
          {imagePreview && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => setImagePreview("")}
              />
              <button
                type="button"
                onClick={() => { setImageUrl(""); setImagePreview(""); setValue("featured_image", ""); }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1.5">
            Imgur share links are auto-converted to direct image URLs.
          </p>
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-xl border border-border p-5">
          <label className="block text-sm font-semibold mb-2">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
          <p className="text-xs text-muted-foreground mt-1.5">
            Toolbar: <strong>B</strong> bold · <em>I</em> italic · H2/H3 headings · list · link
          </p>
        </div>

        {/* SEO + Excerpt */}
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">SEO &amp; Excerpt</h3>
            <button
              type="button"
              onClick={handleAutoFillSeo}
              disabled={generatingSeo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-colors disabled:opacity-50"
            >
              {generatingSeo
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Wand2 className="w-3.5 h-3.5" />}
              {generatingSeo ? "Analysing…" : "🪄 Auto-fill SEO"}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <span className={`text-xs tabular-nums ${excerpt.length > 220 ? "text-red-500" : excerpt.length > 100 ? "text-green-600" : "text-muted-foreground"}`}>
                {excerpt.length} / 200
              </span>
            </div>
            <textarea
              {...register("excerpt", { required: true })}
              rows={2}
              placeholder="Short summary shown in blog listing cards…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Meta Title</label>
                <span className={`text-xs tabular-nums ${metaTitle.length > 60 ? "text-red-500" : metaTitle.length > 30 ? "text-green-600" : "text-muted-foreground"}`}>
                  {metaTitle.length} / 60
                </span>
              </div>
              <input {...register("meta_title")} placeholder="SEO title (≤60 chars)" className={inputCls} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Meta Description</label>
                <span className={`text-xs tabular-nums ${metaDesc.length > 160 ? "text-red-500" : metaDesc.length > 100 ? "text-green-600" : "text-muted-foreground"}`}>
                  {metaDesc.length} / 160
                </span>
              </div>
              <input {...register("meta_description")} placeholder="SEO description (140–160 chars)" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Publish + Actions */}
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" {...register("published")} id="published" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium">Publish immediately</span>
          </label>
          <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setLocation("/admin/blog")}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPost.isPending || updatePost.isPending}
              className="flex-1 sm:flex-none px-8 py-2.5 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: GOLD }}
            >
              {createPost.isPending || updatePost.isPending
                ? "Saving…"
                : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
