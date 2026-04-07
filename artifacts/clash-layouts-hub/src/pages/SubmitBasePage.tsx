import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubmission } from "@workspace/api-client-react";
import { toast } from "sonner";
import { CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

const schema = z.object({
  layout_link: z.string().includes("link.clashofclans.com", { message: "Must be a valid Clash of Clans link" }),
  townhall: z.coerce.number().min(3).max(18),
  base_type: z.string().min(1),
  description: z.string().min(30, "Please write at least 30 characters"),
  image_url: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const baseTypes = ["War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Anti Air", "Legend League", "Progress"];

export function SubmitBasePage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const createSubmission = useCreateSubmission();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { townhall: 12, base_type: "War" },
  });

  async function onSubmit(data: FormData) {
    createSubmission.mutate(
      { data: { ...data, image_url: data.image_url || undefined } },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => toast.error("Failed to submit. Please try again."),
      }
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Submission Received!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for contributing to ClashLayoutsHub! Our team will review your submission and add it to the library if it meets our quality standards.
        </p>
        <button onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Submit Another Base
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-2">{t.submitBase}</h1>
      <p className="text-muted-foreground mb-8">
        Share your best base layouts with the Clash community. All submissions are reviewed before publishing.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-border p-6">
        {/* Layout Link */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Layout Link <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              {...register("layout_link")}
              placeholder="https://link.clashofclans.com/..."
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          {errors.layout_link && <p className="text-destructive text-xs mt-1">{errors.layout_link.message}</p>}
          <p className="text-xs text-muted-foreground mt-1">Must be a valid link.clashofclans.com URL</p>
        </div>

        {/* TH Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Town Hall Level</label>
            <select
              {...register("townhall")}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Array.from({ length: 16 }, (_, i) => i + 3).map(th => (
                <option key={th} value={th}>TH{th}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Base Type</label>
            <select
              {...register("base_type")}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {baseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Base Screenshot URL (optional)</label>
          <input
            {...register("image_url")}
            placeholder="https://i.imgur.com/..."
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {errors.image_url && <p className="text-destructive text-xs mt-1">{errors.image_url.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe your base layout, its strengths, and what attacks it defends against..."
            rows={5}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
          {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={createSubmission.isPending}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {createSubmission.isPending ? "Submitting..." : "Submit Base for Review"}
        </button>
      </form>
    </div>
  );
}
