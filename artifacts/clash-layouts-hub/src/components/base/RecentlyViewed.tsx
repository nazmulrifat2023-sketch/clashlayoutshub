import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Clock } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

interface ViewedBase {
  id: string;
  slug: string;
  title: string;
  townhall: number;
  image_url?: string;
}

const STORAGE_KEY = "clh_recently_viewed";

export function useRecentlyViewed() {
  const [viewed, setViewed] = useState<ViewedBase[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  function addViewed(base: ViewedBase) {
    setViewed(prev => {
      const filtered = prev.filter(b => b.id !== base.id);
      const updated = [base, ...filtered].slice(0, 5);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return { viewed, addViewed };
}

export function RecentlyViewedBar() {
  const { t } = useTranslation();
  const [viewed, setViewed] = useState<ViewedBase[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setViewed(JSON.parse(stored));
      } catch {}
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || viewed.length === 0 || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg md:hidden">
      <div className="flex items-center gap-2 px-4 py-2">
        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex-shrink-0">
          {t.recentlyViewed}
        </span>
        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-none">
          {viewed.map(base => (
            <Link key={base.id} href={`/base/${base.slug}`}
              className="flex-shrink-0 flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1">
              <span className="th-badge text-[10px]">TH{base.townhall}</span>
              <span className="text-xs font-medium line-clamp-1 max-w-[80px]">{base.title}</span>
            </Link>
          ))}
        </div>
        <button onClick={() => setDismissed(true)} className="flex-shrink-0 p-1 hover:bg-muted rounded-lg transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
