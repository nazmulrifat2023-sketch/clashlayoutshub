import { useState } from "react";
import { Link } from "wouter";
import { Copy, Eye, Star, Flame, Shield, AlertTriangle, MessageSquare } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { useGetBaseTodayCopies } from "@workspace/api-client-react";
import type { Base } from "@workspace/api-client-react";
import { ReportModal } from "./ReportModal";

interface BaseCardProps {
  base: Base;
  onCopy?: () => void;
  showTrending?: boolean;
}

function HealthBadge({ score }: { score: number }) {
  const color = score >= 70 ? "text-green-600 bg-green-50" : score >= 40 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      <Shield className="w-3 h-3" />
      {score}
    </span>
  );
}

function TodayCopies({ baseId }: { baseId: string }) {
  const { data } = useGetBaseTodayCopies(baseId);
  const { t } = useTranslation();
  const count = data?.todayCopies ?? 0;
  if (count === 0) return null;
  return (
    <span className="text-xs text-primary font-medium">
      {count} {t.copiedToday}
    </span>
  );
}

export function BaseCard({ base, showTrending }: BaseCardProps) {
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const healthScore = base.health_score ?? Math.max(0, (base.win_rate ?? 80) - (base.report_count ?? 0) * 5);

  return (
    <>
      <div className="group bg-white rounded-xl border border-border overflow-hidden card-hover shadow-sm hover:shadow-md transition-all">
        {/* Image */}
        <Link href={`/base/${base.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
          {base.image_url ? (
            <img
              src={base.image_url}
              alt={base.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-border">
              <Shield className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="th-badge">TH{base.townhall}</span>
            {showTrending && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white">
                <Flame className="w-3 h-3" />
                Hot
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <HealthBadge score={healthScore} />
          </div>

        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/base/${base.slug}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm leading-tight mb-2">
              {base.title}
            </h3>
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(base.views ?? 0).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <Copy className="w-3 h-3" />
              {(base.copies ?? 0).toLocaleString()}
            </span>
            {base.rating_avg && base.rating_count && base.rating_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {Number(base.rating_avg).toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                {base.base_type}
              </span>
              <TodayCopies baseId={base.id} />
            </div>

            <div className="flex items-center gap-1">
              <a
                href="https://discord.gg/clashoflayouts"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                title="Join Discord"
                onClick={e => e.stopPropagation()}
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <button
                onClick={e => { e.preventDefault(); setReportOpen(true); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                title="Report issue"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportModal baseId={base.id} open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
