import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { BaseCard } from "@/components/base/BaseCard";
import { BaseFilters } from "@/components/base/BaseFilters";
import { AdUnit } from "@/components/ads/AdUnit";
import { useListBases } from "@workspace/api-client-react";

export function THPage() {
  const { level } = useParams<{ level: string }>();
  const { t } = useTranslation();
  const thLevel = parseInt(level || "9");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ base_type: "", difficulty: "", sort: "latest" });

  const { data, isLoading } = useListBases({
    townhall: thLevel,
    base_type: filters.base_type || undefined,
    difficulty: filters.difficulty || undefined,
    sort: (filters.sort as any) || "latest",
    page,
    limit: 20,
  });

  useEffect(() => {
    setPage(1);
  }, [level, filters]);

  function handleFilterChange(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const prevTH = thLevel > 3 ? thLevel - 1 : null;
  const nextTH = thLevel < 18 ? thLevel + 1 : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">TH{thLevel} Bases</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-3">
          TH{thLevel} Base Layouts 2026
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          Find the best Town Hall {thLevel} base layouts for 2026. These layouts have been tested and verified by our community.
          Whether you need war bases, farming bases, or trophy pushing layouts, we have you covered with {data?.total ?? 0} verified TH{thLevel} bases.
        </p>
      </div>

      {/* Ad above filters */}
      <AdUnit slot="th-above-filters" className="mb-6" />

      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-border">
        <BaseFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Base Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : data && data.bases.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total} bases
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.bases.map((base, idx) => (
              <React.Fragment key={base.id}>
                <div>
                  <BaseCard base={base} />
                </div>
                {/* Ad slot every 9th base - spans full width */}
                {(idx + 1) % 9 === 0 && (
                  <div className="col-span-full">
                    <AdUnit slot={`th-grid-${Math.floor(idx / 9)}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary/50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary/50 transition-colors"
              >
                {t.loadMore}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">{t.noBasesFound}</p>
          <p className="text-sm mt-2">Try adjusting your filters or check back later.</p>
        </div>
      )}

      {/* Related TH navigation */}
      <div className="mt-10 flex gap-4 justify-center">
        {prevTH && (
          <Link href={`/th/${prevTH}`}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            TH{prevTH} Bases
          </Link>
        )}
        {nextTH && (
          <Link href={`/th/${nextTH}`}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors">
            TH{nextTH} Bases
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 p-6 bg-white rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: `What is the best TH${thLevel} base layout for war?`,
              a: `The best TH${thLevel} war base should protect your Town Hall and key defenses while making it difficult for attackers to get 3 stars. Our top-rated TH${thLevel} war bases have been tested in competitive clan wars.`
            },
            {
              q: `How do I copy a TH${thLevel} base layout?`,
              a: `Simply click the "Copy Layout" button on any base. This will open the layout link in Clash of Clans, where you can import it directly to your village.`
            },
            {
              q: `Are these TH${thLevel} base layouts up to date for 2026?`,
              a: `Yes! All our bases are updated for the 2026 meta. Our community regularly tests and updates bases when new updates are released.`
            },
            {
              q: `What's the difference between farming and war bases at TH${thLevel}?`,
              a: `Farming bases protect your resources (especially Dark Elixir and Gold/Elixir storages), while war bases prioritize protecting your Town Hall and maximizing defense against high-level attacks.`
            },
            {
              q: `How is the health score calculated?`,
              a: `The health score is calculated using the win rate minus penalty points for any reports. A score above 70 is excellent, 40-70 is good, and below 40 means the base may need updating.`
            },
          ].map((faq, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer font-medium text-sm py-2 flex items-center justify-between hover:text-primary transition-colors">
                {faq.q}
                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground mt-2 pb-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
