import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  User, Bookmark, FileText, Settings, LogOut,
  Shield, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const GOLD = "#EB8D00";

type Tab = "saved" | "submissions" | "settings";

interface SavedBase {
  id: string;
  title: string;
  townhall: number;
  base_type: string;
  image_url?: string;
  win_rate?: number;
  copy_count?: number;
  slug: string;
}

interface Submission {
  id: string;
  townhall?: number;
  base_type?: string;
  layout_link: string;
  status: string;
  submitted_at: string;
  admin_notes?: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
    pending:  { label: "Pending",  icon: Clock,         cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    approved: { label: "Approved", icon: CheckCircle2,  cls: "bg-green-50 text-green-700 border-green-200" },
    rejected: { label: "Rejected", icon: AlertCircle,   cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const cfg = map[status] ?? map["pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export function ProfilePage() {
  const { user, token, logout, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("saved");

  const [savedBases, setSavedBases] = useState<SavedBase[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);


  useEffect(() => {
    if (!user) { setLocation("/login"); }
  }, [user]);

  useEffect(() => {
    if (tab === "saved" && token) {
      setLoadingSaved(true);
      fetch("/api/user/saved-bases", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(setSavedBases)
        .catch(() => toast.error("Failed to load saved bases"))
        .finally(() => setLoadingSaved(false));
    }
    if (tab === "submissions" && token) {
      setLoadingSubs(true);
      fetch("/api/user/submissions", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(setSubmissions)
        .catch(() => toast.error("Failed to load submissions"))
        .finally(() => setLoadingSubs(false));
    }
  }, [tab, token]);

  if (!user) return null;

  const initials = user.display_name.slice(0, 2).toUpperCase();

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "saved",       label: "Saved Bases",    icon: Bookmark },
    { id: "submissions", label: "My Submissions",  icon: FileText },
    { id: "settings",   label: "Settings",         icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md shrink-0"
            style={{ backgroundColor: GOLD }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 truncate">{user.display_name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            {user.is_admin && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: GOLD }} />
                <span className="text-xs font-bold" style={{ color: GOLD }}>Administrator</span>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {user.is_admin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors hover:bg-amber-50"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-border text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-white shadow text-gray-900"
                  : "text-muted-foreground hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Saved Bases tab */}
      {tab === "saved" && (
        <div>
          {loadingSaved ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : savedBases.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <Bookmark className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No saved bases yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Tap the bookmark icon on any base to save it here</p>
              <Link href="/" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                Browse Bases
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedBases.map(base => (
                <Link key={base.id} href={`/base/${base.slug}`}>
                  <div className="bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all overflow-hidden group">
                    {base.image_url ? (
                      <img src={base.image_url} alt={base.title} className="w-full h-32 object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-32 bg-muted/40 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">TH{base.townhall}</span>
                        <span className="text-xs text-muted-foreground">{base.base_type}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{base.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        {base.win_rate != null && (
                          <span className="text-xs text-muted-foreground">{base.win_rate}% win rate</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Submissions tab */}
      {tab === "submissions" && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loadingSubs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No submissions yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Submit a base to help the community grow</p>
              <Link href="/submit-base" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                Submit a Base
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {submissions.map(sub => (
                <div key={sub.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {sub.townhall && (
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">TH{sub.townhall}</span>
                      )}
                      {sub.base_type && (
                        <span className="text-xs text-muted-foreground">{sub.base_type}</span>
                      )}
                      <StatusBadge status={sub.status} />
                    </div>
                    <a
                      href={sub.layout_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block max-w-sm"
                    >
                      {sub.layout_link}
                    </a>
                    {sub.admin_notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">Note: {sub.admin_notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings tab */}
      {tab === "settings" && (
        <div className="space-y-4">
          {/* Display name */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
                <div className="px-3 py-2.5 bg-muted/40 rounded-xl text-sm text-muted-foreground border border-border">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Username</label>
                <div className="px-3 py-2.5 bg-muted/40 rounded-xl text-sm text-muted-foreground border border-border">
                  {user.display_name}
                </div>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Account Actions</h3>
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out of all devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
