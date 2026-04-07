import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Flame, TrendingUp, Clock, Users, Database } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { BaseCard } from "@/components/base/BaseCard";
import { Link } from "wouter";
import {
  useGetSiteStats,
  useGetTrendingBases,
  useListBases,
  useGetBaseOfDay,
  useGetTownHallSummary,
  useListBlogPosts,
} from "@workspace/api-client-react";

const TH_LEVELS = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

function THCard({ level, count, topType }: { level: number; count: number; topType: string }) {
  return (
    <Link href={`/th/${level}`}
      className="group bg-white rounded-xl border border-border p-4 text-center card-hover hover:border-primary/50 transition-all">
      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
        <span className="font-black text-lg text-primary">{level}</span>
      </div>
      <div className="th-badge inline-block mb-1">TH{level}</div>
      <p className="text-xs text-muted-foreground mt-1">{count} bases</p>
      {topType && <p className="text-xs text-secondary font-medium mt-0.5 truncate">{topType}</p>}
    </Link>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: stats } = useGetSiteStats();
  const { data: trending } = useGetTrendingBases();
  const { data: latestData } = useListBases({ sort: "latest", limit: 12 });
  const { data: baseOfDay } = useGetBaseOfDay();
  const { data: thSummary } = useGetTownHallSummary();
  const { data: blogData } = useListBlogPosts({ limit: 3 });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  const thMap: Record<number, { count: number; topType: string }> = {};
  thSummary?.forEach(s => { thMap[s.townhall] = { count: s.count, topType: s.topType }; });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            Updated for 2026 Meta
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {t.tagline}
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Browse 1,000+ verified base layouts for every Town Hall level. Copy with one click, dominate wars.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-colors">
              Search
            </button>
          </form>

          {/* TH Quick Select */}
          <div className="flex flex-wrap justify-center gap-2">
            {TH_LEVELS.map(th => (
              <Link key={th} href={`/th/${th}`}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105">
                TH{th}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{(stats?.totalBases ?? 1000).toLocaleString()}+</span>
              <span className="text-muted-foreground">{t.stats.bases}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-secondary" />
              <span className="font-bold text-foreground">{(stats?.totalViews ?? 500000).toLocaleString()}+</span>
              <span className="text-muted-foreground">{t.stats.playersHelped}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="font-bold text-foreground">{t.stats.updatedDaily}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Base of the Day */}
      {baseOfDay && (
        <section className="py-10 px-4 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{t.baseOfDay}</h2>
            </div>
            <div className="max-w-xs">
              <BaseCard base={baseOfDay} />
            </div>
          </div>
        </section>
      )}

      {/* Browse by Town Hall */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t.browseByTH}</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-3">
            {TH_LEVELS.map(th => (
              <THCard
                key={th}
                level={th}
                count={thMap[th]?.count ?? 0}
                topType={thMap[th]?.topType ?? ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending This Week */}
      {trending && trending.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-b from-orange-50/50 to-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold">{t.trending}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trending.slice(0, 6).map(base => (
                <BaseCard key={base.id} base={base} showTrending />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Bases */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t.latestBases}</h2>
            <Link href="/th/16" className="text-sm text-primary hover:underline font-medium">
              {t.viewAll} →
            </Link>
          </div>
          {latestData && latestData.bases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {latestData.bases.map(base => (
                <BaseCard key={base.id} base={base} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t.noBasesFound}</p>
              <p className="text-sm mt-2">Seed some bases in the admin panel to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      {blogData && blogData.posts.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">From the Blog</h2>
              <Link href="/blog" className="text-sm text-primary hover:underline font-medium">
                {t.viewAll} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogData.posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl border border-border overflow-hidden card-hover group">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {post.featured_image && (
                      <img src={post.featured_image} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
