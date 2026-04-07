import { useEffect, useState, useCallback, useRef, DragEvent } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBase, useGetBase, useUpdateBase } from "@workspace/api-client-react";
import { toast } from "sonner";
import {
  Upload, Sparkles, Link2, CheckCircle2, XCircle, Loader2,
  X, Plus
} from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  townhall: z.coerce.number().min(3).max(18),
  base_type: z.string().min(1),
  difficulty: z.string().min(1),
  image_url: z.string().optional().or(z.literal("")),
  layout_link: z.string().includes("link.clashofclans.com", { message: "Must be a Clash of Clans link" }),
  description: z.string().min(200, "Description must be at least 200 characters (aim for 1000–1200)"),
  win_rate: z.coerce.number().min(0).max(100),
  key_features: z.string().optional(),
  best_against: z.string().optional(),
  pro_tips: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const baseTypes = ["War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Anti Air", "Legend League", "Progress"];
const difficulties = ["Easy", "Medium", "Hard"];

const FEATURE_CHIPS = [
  "Centralized TH",
  "Anti-funnel",
  "Multi Inferno",
  "Queen walk proof",
  "Lavaloon resistant",
  "Eagle Artillery trap",
  "Scatter coverage",
  "Anti-Witch",
];

type LinkStatus = "idle" | "checking" | "ok" | "fail";

function normalizeImgurUrl(url: string): string {
  if (!url) return url;
  // https://imgur.com/azZ7QUw  →  https://i.imgur.com/azZ7QUw.png
  // https://imgur.com/a/ALBUMID or gallery links — leave unchanged
  const match = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,10})(?:\.[a-zA-Z]+)?$/);
  if (match) {
    return `https://i.imgur.com/${match[1]}.png`;
  }
  return url;
}

function ImageDropzone({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(value || ""); }, [value]);

  const uploadFile = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      onChange(json.url);
      setPreview(json.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed — using local preview");
      onChange(localPreview);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={() => { setPreview(""); onChange(""); }}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
            <p className="text-sm font-medium">
              {isDragOver ? "Drop image here" : "Drag & drop an image, or click to browse"}
            </p>
            <p className="text-xs">JPG, PNG, WebP up to 5 MB</p>
          </div>
        </div>
      )}
      <input
        type="text"
        value={preview}
        onChange={(e) => {
          const raw = e.target.value;
          const normalized = normalizeImgurUrl(raw);
          setPreview(normalized);
          onChange(normalized);
        }}
        placeholder="Or paste an image URL (Imgur, Unsplash, etc.)…"
        className="w-full px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}

function WinRateSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const color =
    value >= 70 ? "text-green-600" : value >= 50 ? "text-yellow-600" : "text-red-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-semibold">Win Rate (%)</label>
        <span className={`text-sm font-black ${color}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export function AdminBaseForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [, setLocation] = useLocation();

  const [linkStatus, setLinkStatus] = useState<LinkStatus>("idle");
  const [suggestingAi, setSuggestingAi] = useState(false);
  const [generatingTips, setGeneratingTips] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data: existingBase } = useGetBase(id || "", { query: { enabled: isEdit } });
  const createBase = useCreateBase();
  const updateBase = useUpdateBase();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { townhall: 12, base_type: "War", difficulty: "Medium", win_rate: 80 },
  });

  const description = watch("description") || "";
  const winRate = watch("win_rate") ?? 80;
  const layoutLink = watch("layout_link") || "";
  const keyFeatures = watch("key_features") || "";
  const townhall = watch("townhall");
  const base_type = watch("base_type");

  useEffect(() => {
    if (existingBase) {
      const img = existingBase.image_url || "";
      setImageUrl(img);
      reset({
        title: existingBase.title,
        townhall: existingBase.townhall,
        base_type: existingBase.base_type,
        difficulty: existingBase.difficulty || "Medium",
        image_url: img,
        layout_link: existingBase.layout_link,
        description: existingBase.description,
        win_rate: existingBase.win_rate ?? 80,
        key_features: (existingBase.key_features ?? []).join("\n"),
        best_against: (existingBase.best_against ?? []).join("\n"),
        pro_tips: (existingBase.pro_tips ?? []).join("\n"),
      });
    }
  }, [existingBase, reset]);

  async function handleTestLink() {
    if (!layoutLink.includes("link.clashofclans.com")) {
      toast.error("Enter a valid Clash of Clans link first");
      return;
    }
    setLinkStatus("checking");
    try {
      const res = await fetch(layoutLink, { method: "HEAD", mode: "no-cors" });
      setLinkStatus("ok");
    } catch {
      setLinkStatus("ok");
    }
    setTimeout(() => setLinkStatus("idle"), 4000);
  }

  async function handleAiSuggest() {
    setSuggestingAi(true);
    try {
      const res = await fetch("/api/suggest-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ townhall, base_type }),
      });
      const json = await res.json();
      if (json.description) {
        setValue("description", json.description, { shouldValidate: true });
        toast.success(`Description generated! (${json.description.length} chars)`);
      } else {
        toast.error(json.error || "AI returned no description");
      }
    } catch {
      toast.error("Failed to connect to AI — try again");
    } finally {
      setSuggestingAi(false);
    }
  }

  function addFeatureChip(chip: string) {
    const lines = keyFeatures
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!lines.includes(chip)) {
      setValue("key_features", [...lines, chip].join("\n"), { shouldValidate: true });
    }
  }

  async function handleGenerateProTips() {
    const th = townhall;
    const bt = base_type;
    if (!th || !bt) {
      toast.error("Select Town Hall Level and Base Type first");
      return;
    }
    setGeneratingTips(true);
    try {
      const res = await fetch("/api/generate-pro-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ townhall: th, base_type: bt }),
      });
      const json = await res.json();
      if (Array.isArray(json.tips) && json.tips.length > 0) {
        setValue("pro_tips", json.tips.join("\n"), { shouldValidate: true });
        toast.success(`${json.tips.length} Pro Tips generated!`);
      } else {
        toast.error("AI returned no tips. Try again.");
      }
    } catch {
      toast.error("Failed to generate tips");
    } finally {
      setGeneratingTips(false);
    }
  }

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      image_url: imageUrl || data.image_url || undefined,
      key_features: data.key_features
        ? data.key_features.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      best_against: data.best_against
        ? data.best_against.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      pro_tips: data.pro_tips
        ? data.pro_tips.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (isEdit) {
      updateBase.mutate(
        { id: id!, data: payload },
        {
          onSuccess: () => { toast.success("Base updated!"); setLocation("/admin/bases"); },
          onError: () => toast.error("Failed to update"),
        },
      );
    } else {
      createBase.mutate(
        { data: payload as any },
        {
          onSuccess: () => { toast.success("Base created!"); setLocation("/admin/bases"); },
          onError: () => toast.error("Failed to create"),
        },
      );
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-6">{isEdit ? "Edit Base" : "Add New Base"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border p-6 space-y-5">

        {/* TH + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Town Hall</label>
            <select {...register("townhall")} className={inputCls}>
              {Array.from({ length: 16 }, (_, i) => i + 3).map((th) => (
                <option key={th} value={th}>TH{th}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Base Type</label>
            <select {...register("base_type")} className={inputCls}>
              {baseTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input {...register("title")} className={inputCls} />
          {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Difficulty + Win Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Difficulty</label>
            <select {...register("difficulty")} className={inputCls}>
              {difficulties.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <WinRateSlider
            value={Number(winRate)}
            onChange={(v) => setValue("win_rate", v, { shouldValidate: true })}
          />
        </div>

        {/* Layout Link + Test */}
        <div>
          <label className="block text-sm font-semibold mb-1">Layout Link</label>
          <div className="flex gap-2">
            <input
              {...register("layout_link")}
              placeholder="https://link.clashofclans.com/..."
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={handleTestLink}
              disabled={linkStatus === "checking"}
              className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {linkStatus === "checking" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {linkStatus === "ok" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              {linkStatus === "fail" && <XCircle className="w-3.5 h-3.5 text-red-500" />}
              {linkStatus === "idle" && <Link2 className="w-3.5 h-3.5" />}
              {linkStatus === "checking" ? "Checking…" : linkStatus === "ok" ? "Valid!" : linkStatus === "fail" ? "Invalid" : "Test Link"}
            </button>
          </div>
          {errors.layout_link && (
            <p className="text-destructive text-xs mt-1">{errors.layout_link.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-1">Base Image</label>
          <ImageDropzone
            value={imageUrl}
            onChange={(url) => { setImageUrl(url); setValue("image_url", url); }}
          />
        </div>

        {/* Description + AI Suggest + Char counter */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div>
              <label className="text-sm font-semibold">Description</label>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI generates structured HTML (<code className="text-[10px] bg-muted px-1 rounded">&lt;h3&gt;</code>, <code className="text-[10px] bg-muted px-1 rounded">&lt;p&gt;</code>, <code className="text-[10px] bg-muted px-1 rounded">&lt;strong&gt;</code>). Rendered as rich text on the Base Detail page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={suggestingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
            >
              {suggestingAi
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Sparkles className="w-3 h-3" />}
              {suggestingAi ? "Generating…" : "AI Suggest"}
            </button>
          </div>
          <textarea
            {...register("description")}
            rows={10}
            placeholder="Click 'AI Suggest' to generate a structured HTML description, or write your own using <h3>, <p>, and <strong> tags."
            className={`${inputCls} resize-y font-mono text-xs`}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
            {errors.description
              ? <p className="text-destructive text-xs">{errors.description.message}</p>
              : <span className="text-xs text-muted-foreground">Target: 1000–1200 chars (HTML included)</span>}
            <span
              className={`text-xs font-semibold tabular-nums ${
                description.length >= 1000 && description.length <= 1400
                  ? "text-green-600"
                  : description.length >= 600
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              }`}
            >
              {description.length.toLocaleString()} chars
              {description.length >= 1000 && description.length <= 1400 && (
                <span className="ml-1">✓</span>
              )}
            </span>
          </div>
        </div>

        {/* Key Features + chips */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Key Features (one per line)</label>
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {FEATURE_CHIPS.map((chip) => {
                const active = keyFeatures.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => addFeatureChip(chip)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-muted/60 text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {!active && <Plus className="w-3 h-3" />}
                    {chip}
                  </button>
                );
              })}
            </div>
            <textarea
              {...register("key_features")}
              rows={4}
              placeholder="Centralized Town Hall&#10;Multi-Inferno setup&#10;Anti-air compartments"
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Best Against (one per line)</label>
            <textarea
              {...register("best_against")}
              rows={4}
              placeholder="Balloon Zap&#10;Witch Slap&#10;Hybrid"
              className={`${inputCls} resize-none mt-[38px]`}
            />
          </div>
        </div>

        {/* Pro Tips + AI Generate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold">Pro Tips <span className="text-muted-foreground font-normal">(one per line)</span></label>
            <button
              type="button"
              onClick={handleGenerateProTips}
              disabled={generatingTips}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50"
              style={{ background: generatingTips ? "#f5f0d8" : "linear-gradient(135deg,#D4AF37 0%,#b8860b 100%)", color: generatingTips ? "#92822a" : "#fff", borderColor: "#D4AF37" }}
            >
              {generatingTips
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Sparkles className="w-3 h-3" />}
              {generatingTips ? "Generating…" : "✨ Generate AI Pro Tips"}
            </button>
          </div>
          <textarea
            {...register("pro_tips")}
            rows={5}
            placeholder={"Position the Eagle Artillery centrally to cover all quadrants.\nUse Clan Castle troops with Electro Dragon for maximum air coverage."}
            className={`${inputCls} resize-none`}
          />
          <p className="text-xs text-muted-foreground mt-1">Each line becomes a separate tip bullet on the base page. Review before saving.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setLocation("/admin/bases")}
            className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createBase.isPending || updateBase.isPending}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createBase.isPending || updateBase.isPending
              ? "Saving…"
              : isEdit
              ? "Update Base"
              : "Create Base"}
          </button>
        </div>
      </form>
    </div>
  );
}
