import { useState } from "react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Shield } from "lucide-react";
import { useListBases, useDeleteBase, useUpdateBase } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBasesQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";

export function AdminBases() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [townhallFilter, setTownhallFilter] = useState<number | undefined>();
  const queryClient = useQueryClient();

  const params = {
    page,
    limit: 50,
    search: search || undefined,
    townhall: townhallFilter,
  };

  const { data, isLoading, refetch } = useListBases(params);
  const deleteBase = useDeleteBase();
  const updateBase = useUpdateBase();

  async function handleDelete(id: string) {
    if (!confirm("Delete this base?")) return;
    deleteBase.mutate({ id }, {
      onSuccess: () => { toast.success("Base deleted"); refetch(); },
    });
  }

  async function handleToggleActive(id: string, current: boolean) {
    updateBase.mutate({ id, data: { is_active: !current } }, {
      onSuccess: () => { toast.success(`Base ${current ? "disabled" : "enabled"}`); refetch(); },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Base Manager</h1>
        <Link href="/admin/bases/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Base
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search bases..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={townhallFilter ?? ""}
          onChange={e => { setTownhallFilter(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
          className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All TH Levels</option>
          {Array.from({ length: 16 }, (_, i) => i + 3).map(th => (
            <option key={th} value={th}>TH{th}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Base</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">TH</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Copies</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Health</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">Loading...</td></tr>
              ) : data?.bases.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No bases found</td></tr>
              ) : data?.bases.map(base => {
                const health = base.health_score ?? Math.max(0, (base.win_rate ?? 80) - (base.report_count ?? 0) * 5);
                return (
                  <tr key={base.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {base.image_url ? (
                          <img src={base.image_url} alt="" className="w-8 h-8 rounded-md object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium line-clamp-1 max-w-[160px]">{base.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="th-badge">TH{base.townhall}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{base.base_type}</td>
                    <td className="px-4 py-3 text-xs">{(base.views ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{(base.copies ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${health >= 70 ? "text-green-600" : health >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                        {health}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        base.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {base.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/bases/${base.id}/edit`}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleToggleActive(base.id, base.is_active ?? true)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          {base.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleDelete(base.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex justify-center gap-3 p-4 border-t border-border">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-border rounded-lg disabled:opacity-40">Previous</button>
            <span className="text-xs text-muted-foreground px-2 py-1.5">Page {page}/{data.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}
              className="px-3 py-1.5 text-xs border border-border rounded-lg disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
