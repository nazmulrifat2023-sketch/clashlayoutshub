import { useGetDashboardAnalytics, useGetViewsAnalytics, useGetTopCopiedBases, useListSubmissions } from "@workspace/api-client-react";
import { Database, Eye, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
      </div>
      <div className="text-2xl font-black">{typeof value === "number" ? value.toLocaleString() : value}</div>
    </div>
  );
}

export function AdminDashboard() {
  const { data: analytics } = useGetDashboardAnalytics();
  const { data: viewsData } = useGetViewsAnalytics();
  const { data: topBases } = useGetTopCopiedBases();
  const { data: submissions } = useListSubmissions({ status: "pending", page: 1 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bases" value={analytics?.totalBases ?? 0} icon={Database} color="bg-primary" />
        <StatCard title="Total Views" value={analytics?.totalViews ?? 0} icon={Eye} color="bg-secondary" />
        <StatCard title="Pending Submissions" value={analytics?.pendingSubmissions ?? 0} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Active Reports" value={analytics?.activeReports ?? 0} icon={AlertTriangle} color="bg-destructive" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold mb-4 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Views (Last 30 Days)
          </h3>
          {viewsData && viewsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(36 100% 46%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              No view data yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-bold mb-4 text-sm">Bases by Town Hall</h3>
          {analytics?.basesByTownhall && analytics.basesByTownhall.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.basesByTownhall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="townhall" tick={{ fontSize: 10 }} tickFormatter={v => `TH${v}`} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [v, "Bases"]} labelFormatter={l => `TH${l}`} />
                <Bar dataKey="count" fill="hsl(213 100% 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              No bases yet
            </div>
          )}
        </div>
      </div>

      {/* Top Copied + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Top Copied Bases</h3>
            <Link href="/admin/bases" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {topBases && topBases.length > 0 ? (
            <div className="space-y-2">
              {topBases.slice(0, 8).map((base, i) => (
                <div key={base.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{base.title}</p>
                    <p className="text-xs text-muted-foreground">TH{base.townhall} · {base.base_type}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{(base.copies ?? 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Pending Submissions</h3>
            <Link href="/admin/submissions" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {submissions && submissions.submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.submissions.slice(0, 5).map(sub => (
                <div key={sub.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-medium">TH{sub.townhall} · {sub.base_type || "Unknown type"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(sub.submitted_at || "").toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No pending submissions</p>
          )}
        </div>
      </div>
    </div>
  );
}
