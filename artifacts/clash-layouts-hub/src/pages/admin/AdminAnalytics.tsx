import {
  useGetDashboardAnalytics,
  useGetViewsAnalytics,
  useGetTopCopiedBases,
} from "@workspace/api-client-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Eye, Copy, Database, TrendingUp, Trophy, Shield } from "lucide-react";
import { Link } from "wouter";

function StatCard({
  title, value, sub, icon: Icon, color,
}: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
      </div>
      <div className="text-3xl font-black">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export function AdminAnalytics() {
  const { data: analytics, isLoading: statsLoading } = useGetDashboardAnalytics();
  const { data: viewsData, isLoading: viewsLoading } = useGetViewsAnalytics();
  const { data: topBases, isLoading: basesLoading } = useGetTopCopiedBases();

  const totalCopies = topBases?.reduce((sum, b) => sum + (b.copies ?? 0), 0) ?? 0;
  const totalViewsFromChart = viewsData?.reduce((sum, d) => sum + d.views, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Site-wide performance overview — last 30 days
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bases"
          value={statsLoading ? "—" : (analytics?.totalBases ?? 0)}
          sub="All active bases"
          icon={Database}
          color="bg-primary"
        />
        <StatCard
          title="Total Views"
          value={statsLoading ? "—" : (analytics?.totalViews ?? 0)}
          sub="All-time base views"
          icon={Eye}
          color="bg-secondary"
        />
        <StatCard
          title="Views (30d)"
          value={viewsLoading ? "—" : totalViewsFromChart}
          sub="Last 30 days"
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="Top-10 Copies"
          value={basesLoading ? "—" : totalCopies}
          sub="From top 10 bases"
          icon={Copy}
          color="bg-orange-500"
        />
      </div>

      {/* Views over time */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Daily Views — Last 30 Days
        </h2>
        {viewsLoading ? (
          <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : viewsData && viewsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={viewsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={d => d.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip labelFormatter={l => `Date: ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="hsl(36 100% 46%)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
            No view data recorded yet. Views are tracked when users visit base pages.
          </div>
        )}
      </div>

      {/* Bases by TH + Top copied side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bases by TH */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-secondary" />
            Bases by Town Hall Level
          </h2>
          {statsLoading ? (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
          ) : analytics?.basesByTownhall && analytics.basesByTownhall.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.basesByTownhall} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="townhall" tick={{ fontSize: 10 }} tickFormatter={v => `TH${v}`} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, "Bases"]} labelFormatter={l => `TH${l}`} />
                <Bar dataKey="count" name="Bases" fill="hsl(213 100% 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No bases yet
            </div>
          )}
        </div>

        {/* Top 10 most copied */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Top 10 Most Copied Bases
            </h2>
            <Link href="/admin/bases" className="text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>
          {basesLoading ? (
            <div className="py-10 text-center text-muted-foreground text-sm">Loading…</div>
          ) : topBases && topBases.length > 0 ? (
            <div className="space-y-2">
              {topBases.map((base, i) => (
                <div key={base.id} className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0">
                  <span
                    className="text-xs font-black w-6 text-center shrink-0"
                    style={{ color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "inherit" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-tight">{base.title}</p>
                    <p className="text-xs text-muted-foreground">TH{base.townhall} · {base.base_type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{(base.copies ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{(base.views ?? 0).toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No base copy data yet</p>
          )}
        </div>
      </div>

      {/* Copies bar chart for top bases */}
      {topBases && topBases.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Copy className="w-4 h-4 text-orange-500" />
            Top Base Copy Counts
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topBases.map(b => ({ name: `TH${b.townhall} ${b.base_type}`, copies: b.copies ?? 0 }))}
              margin={{ top: 5, right: 10, bottom: 40, left: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10 }}
                width={100}
              />
              <Tooltip formatter={(v) => [v, "Copies"]} />
              <Bar dataKey="copies" name="Copies" fill="hsl(36 100% 46%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
