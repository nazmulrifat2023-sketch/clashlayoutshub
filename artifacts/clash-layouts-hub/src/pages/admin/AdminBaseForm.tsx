import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBase, useGetBase, useUpdateBase } from "@workspace/api-client-react";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1),
  townhall: z.coerce.number().min(3).max(18),
  base_type: z.string().min(1),
  difficulty: z.string().min(1),
  image_url: z.string().url().optional().or(z.literal("")),
  layout_link: z.string().includes("link.clashofclans.com", { message: "Must be a Clash of Clans link" }),
  description: z.string().min(100, "Description must be at least 100 characters"),
  win_rate: z.coerce.number().min(0).max(100),
  key_features: z.string().optional(),
  best_against: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const baseTypes = ["War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Anti Air", "Legend League", "Progress"];
const difficulties = ["Easy", "Medium", "Hard"];

export function AdminBaseForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [, setLocation] = useLocation();

  const { data: existingBase } = useGetBase(id || "", { query: { enabled: isEdit } });
  const createBase = useCreateBase();
  const updateBase = useUpdateBase();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { townhall: 12, base_type: "War", difficulty: "Medium", win_rate: 80 },
  });

  useEffect(() => {
    if (existingBase) {
      reset({
        title: existingBase.title,
        townhall: existingBase.townhall,
        base_type: existingBase.base_type,
        difficulty: existingBase.difficulty || "Medium",
        image_url: existingBase.image_url,
        layout_link: existingBase.layout_link,
        description: existingBase.description,
        win_rate: existingBase.win_rate ?? 80,
        key_features: (existingBase.key_features ?? []).join("\n"),
        best_against: (existingBase.best_against ?? []).join("\n"),
      });
    }
  }, [existingBase, reset]);

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      image_url: data.image_url || undefined,
      key_features: data.key_features ? data.key_features.split("\n").map(s => s.trim()).filter(Boolean) : [],
      best_against: data.best_against ? data.best_against.split("\n").map(s => s.trim()).filter(Boolean) : [],
    };

    if (isEdit) {
      updateBase.mutate({ id: id!, data: payload }, {
        onSuccess: () => { toast.success("Base updated!"); setLocation("/admin/bases"); },
        onError: () => toast.error("Failed to update"),
      });
    } else {
      createBase.mutate({ data: payload as any }, {
        onSuccess: () => { toast.success("Base created!"); setLocation("/admin/bases"); },
        onError: () => toast.error("Failed to create"),
      });
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-6">{isEdit ? "Edit Base" : "Add New Base"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Town Hall</label>
            <select {...register("townhall")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {Array.from({ length: 16 }, (_, i) => i + 3).map(th => (
                <option key={th} value={th}>TH{th}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Base Type</label>
            <select {...register("base_type")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {baseTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input {...register("title")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Difficulty</label>
            <select {...register("difficulty")} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {difficulties.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Win Rate (%)</label>
            <input {...register("win_rate")} type="number" min={0} max={100} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Layout Link</label>
          <input {...register("layout_link")} placeholder="https://link.clashofclans.com/..." className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          {errors.layout_link && <p className="text-destructive text-xs mt-1">{errors.layout_link.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Image URL</label>
          <input {...register("image_url")} placeholder="https://..." className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          {errors.image_url && <p className="text-destructive text-xs mt-1">{errors.image_url.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description (100+ chars)</label>
          <textarea {...register("description")} rows={6} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Key Features (one per line)</label>
            <textarea {...register("key_features")} rows={4} placeholder="Centralized Town Hall&#10;Multi-Inferno setup&#10;Anti-air compartments" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Best Against (one per line)</label>
            <textarea {...register("best_against")} rows={4} placeholder="Balloon Zap&#10;Witch Slap&#10;Hybrid" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => setLocation("/admin/bases")}
            className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={createBase.isPending || updateBase.isPending}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {createBase.isPending || updateBase.isPending ? "Saving..." : (isEdit ? "Update Base" : "Create Base")}
          </button>
        </div>
      </form>
    </div>
  );
}
