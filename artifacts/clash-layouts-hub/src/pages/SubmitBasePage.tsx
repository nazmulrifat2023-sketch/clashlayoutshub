import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubmission } from "@workspace/api-client-react";
import { toast } from "sonner";
import {
  CheckCircle2, ExternalLink, FileImage, Shield, Swords, X,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

const GOLD = "#C27400";
const DESC_MAX = 500;

function normalizeImgurUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,10})(?:\.[a-zA-Z]+)?$/);
  if (match) return `https://i.imgur.com/${match[1]}.png`;
  return url;
}

const schema = z.object({
  layout_link: z
    .string()
    .min(1, "Layout link is required")
    .refine(
      (v) => v.startsWith("https://link.clashofclans.com"),
      { message: "Must start with https://link.clashofclans.com" }
    ),
  townhall: z.coerce.number().min(3).max(18),
  base_type: z.string().min(1),
  description: z
    .string()
    .min(30, "Please write at least 30 characters")
    .max(DESC_MAX, `Description must be under ${DESC_MAX} characters`),
  image_url: z
    .string()
    .min(1, "Screenshot URL is required")
    .url("Must be a valid image URL"),
});

type FormData = z.infer<typeof schema>;

const baseTypes = [
  "War", "Farming", "Hybrid", "Trophy",
  "Anti 3 Star", "Anti Air", "Legend League", "Progress",
];

const inputCls =
  "w-full px-3 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-colors";

const sectionCls =
  "bg-white rounded-2xl border border-border shadow-sm p-5";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-destructive text-xs mt-1.5 font-medium">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

export function SubmitBasePage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);
  const createSubmission = useCreateSubmission();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { townhall: 12, base_type: "War" },
  });

  const descValue = watch("description") || "";

  function handleImagePaste(raw: string) {
    const normalized = normalizeImgurUrl(raw.trim());
    setImageUrl(normalized);
    setImagePreview(normalized);
    setImageError(false);
    setValue("image_url", normalized, { shouldValidate: true });
  }

  async function onSubmit(data: FormData) {
    createSubmission.mutate(
      { data: { ...data, image_url: data.image_url || undefined } },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => toast.error("Failed to submit. Please try again."),
      }
    );
  }

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Animated checkmark ring */}
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-ping"
              style={{ backgroundColor: GOLD }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${GOLD}18`, border: `2px solid ${GOLD}40` }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: GOLD }} />
            </div>
          </div>

          <h1 className="text-3xl font-black mb-2">Base Submitted!</h1>
          <p className="text-lg font-semibold mb-1" style={{ color: GOLD }}>
            Your base is under review by our experts!
          </p>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            We manually check every submission for quality and uniqueness.
            If approved, your base will appear in the library within 24–48 hours.
            Thank you for contributing to the community!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setImageUrl("");
                setImagePreview("");
              }}
              className="px-8 py-3.5 text-white rounded-xl font-bold text-sm transition-colors"
              style={{ backgroundColor: GOLD }}
            >
              Submit Another Base
            </button>
            <a
              href="/"
              className="px-8 py-3.5 border border-border rounded-xl font-bold text-sm text-center hover:bg-muted transition-colors"
            >
              Browse Bases
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${GOLD}20` }}
          >
            <Shield className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <h1 className="text-3xl font-black">{t.submitBase}</h1>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Share your best base layouts with the Clash community.
          All submissions are reviewed before publishing — quality wins!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* ── Layout Link ── */}
        <div className={sectionCls}>
          <label className="block text-sm font-semibold mb-1.5">
            Layout Link <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              {...register("layout_link")}
              placeholder="https://link.clashofclans.com/en?action=CopyArmy&..."
              className={`${inputCls} pl-9`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
          <FieldError msg={errors.layout_link?.message} />
          {!errors.layout_link && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" />
              Copy the share link from your Clash of Clans village
            </p>
          )}
        </div>

        {/* ── TH Level + Base Type ── */}
        <div className={sectionCls}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Town Hall Level</label>
              <select
                {...register("townhall")}
                className={inputCls}
              >
                {Array.from({ length: 16 }, (_, i) => i + 3).map((th) => (
                  <option key={th} value={th}>TH{th}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Base Type</label>
              <select
                {...register("base_type")}
                className={inputCls}
              >
                {baseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Screenshot URL + Preview ── */}
        <div className={sectionCls}>
          <label className="flex items-center gap-1.5 text-sm font-semibold mb-1.5">
            <FileImage className="w-4 h-4 text-muted-foreground" />
            Base Screenshot URL <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => handleImagePaste(e.target.value)}
            placeholder="https://i.imgur.com/... or paste an Imgur share link"
            className={inputCls}
            autoComplete="off"
          />
          <FieldError msg={errors.image_url?.message} />

          {/* Live preview */}
          {imagePreview && !imageError && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Base screenshot preview"
                className="w-full object-cover max-h-56"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setImagePreview("");
                  setValue("image_url", "", { shouldValidate: true });
                }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                <p className="text-white text-xs font-medium">Preview looks good!</p>
              </div>
            </div>
          )}

          {imagePreview && imageError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-xs">
                Image couldn't load. Double-check the URL or try a different link.
              </p>
            </div>
          )}

          {!imagePreview && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Imgur share links (imgur.com/XXXXX) are auto-converted. Use a direct screenshot for best results.
            </p>
          )}
        </div>

        {/* ── Description ── */}
        <div className={sectionCls}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold">
              Description <span className="text-destructive">*</span>
            </label>
            <span
              className={`text-xs font-mono tabular-nums transition-colors ${
                descValue.length > DESC_MAX
                  ? "text-destructive font-bold"
                  : descValue.length >= 30
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              {descValue.length} / {DESC_MAX}
            </span>
          </div>
          <textarea
            {...register("description")}
            placeholder="Describe your base layout, its strengths, what attacks it defends best against, and any tips for placement..."
            rows={5}
            className={`${inputCls} resize-none`}
          />
          <FieldError msg={errors.description?.message} />
          {!errors.description && descValue.length >= 30 && (
            <p className="text-xs text-green-600 mt-1.5 font-medium">
              Great description!
            </p>
          )}
          {!errors.description && descValue.length < 30 && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Minimum 30 characters — help others understand why this base rocks!
            </p>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={createSubmission.isPending}
          className="w-full py-4 sm:py-3.5 text-white rounded-2xl font-black text-base sm:text-sm transition-all active:scale-95 disabled:opacity-50 shadow-lg"
          style={{ backgroundColor: GOLD, boxShadow: `0 4px 24px ${GOLD}50` }}
        >
          {createSubmission.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            "🛡️ Submit Base for Review"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          All submissions are manually reviewed for quality before publishing.
        </p>
      </form>
    </div>
  );
}
