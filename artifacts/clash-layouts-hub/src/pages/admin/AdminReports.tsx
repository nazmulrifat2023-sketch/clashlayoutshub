import { useState } from "react";
import { useListReports } from "@workspace/api-client-react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const reasonLabels: Record<string, string> = {
  broken_link: "Broken Link",
  outdated: "Outdated",
  wrong_th: "Wrong TH Level",
  spam: "Spam",
  other: "Other",
};

export function AdminReports() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListReports({ page });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h1 className="text-2xl font-black">Reports</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Bases with 5+ reports are automatically disabled. Review reports here and take action on affected bases.
      </p>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Base</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">IP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">Loading...</td></tr>
              ) : data?.reports.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">No reports yet</td></tr>
              ) : data?.reports.map(report => (
                <tr key={report.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{report.base_title || "Unknown Base"}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{report.base_id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {reasonLabels[report.reason] || report.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                    {report.reporter_ip?.substring(0, 12) || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(report.created_at || "").toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/bases/${report.base_id}/edit`}
                      className="text-xs text-primary hover:underline flex items-center justify-end gap-1">
                      Review Base <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
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
