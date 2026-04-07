import { useState } from "react";
import { useListSubmissions, useUpdateSubmission } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Check, X, ExternalLink } from "lucide-react";

export function AdminSubmissions() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const [page, setPage] = useState(1);
  const { data, refetch } = useListSubmissions({ status, page });
  const updateSub = useUpdateSubmission();

  function handleUpdate(id: string, newStatus: "approved" | "rejected") {
    updateSub.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => { toast.success(`Submission ${newStatus}`); refetch(); },
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black">Submissions</h1>

      <div className="flex gap-2">
        {(["pending", "approved", "rejected", undefined] as const).map(s => (
          <button key={String(s)} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              status === s ? "bg-primary text-white" : "border border-border hover:bg-muted text-muted-foreground"
            }`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Link</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                {status === "pending" && <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.submissions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">No submissions</td></tr>
              ) : data?.submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">TH{sub.townhall} · {sub.base_type || "Unknown"}</p>
                    {sub.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{sub.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <a href={sub.layout_link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1">
                      View Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(sub.submitted_at || "").toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "approved" ? "bg-green-100 text-green-700" :
                      sub.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{sub.status}</span>
                  </td>
                  {status === "pending" && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleUpdate(sub.id, "approved")}
                          className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleUpdate(sub.id, "rejected")}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
