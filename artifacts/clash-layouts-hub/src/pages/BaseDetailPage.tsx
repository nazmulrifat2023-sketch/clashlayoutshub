import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Copy, Eye, Star, Shield, ChevronRight, MessageSquare, AlertTriangle,
  Bookmark, ExternalLink, Heart, Activity, ChevronDown, ChevronUp
} from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { BaseCard } from "@/components/base/BaseCard";
import { ReportModal } from "@/components/base/ReportModal";
import { AdUnit } from "@/components/base/AdUnit";
import {
  useGetBaseBySlug, useIncrementBaseCopy, useIncrementBaseView,
  useGetSimilarBases, useListComments, useAddComment, useGetBaseTodayCopies,
} from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110">
          <Star className={`w-6 h-6 ${star <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          {a}
        </div>
      )}
    </div>
  );
}

function getFAQs(baseType: string, th: number): { q: string; a: string }[] {
  const type = baseType.toLowerCase();
  if (type.includes("war") || type.includes("anti")) {
    return [
      {
        q: `Is this TH${th} war base still effective in 2026?`,
        a: `Yes — this layout is updated for the 2026 meta and tested against the most popular TH${th} attack strategies including Super Witch, Hybrid, and Yeti Smash. Community members report high three-star defense rates.`,
      },
      {
        q: "How do I copy this base to my village?",
        a: "Click the orange Copy Layout button above. It opens the official Clash of Clans link that automatically imports the base into your game's edit layout screen. Tap the copy icon in-game to save it.",
      },
      {
        q: `What attacks does this TH${th} ${baseType} base counter best?`,
        a: `This layout is optimized to counter the three-star heavy strategies common at TH${th}. The compartmentalized design forces attackers to commit troops early while the centralized Town Hall ensures maximum time pressure.`,
      },
    ];
  }
  if (type.includes("farming")) {
    return [
      {
        q: `How much loot can this TH${th} farming base protect?`,
        a: `This TH${th} farming base places your Dark Elixir storage deep inside multiple wall layers, making it extremely difficult for Sneaky Goblins or Super Archers to reach. Gold and Elixir are semi-exposed as a decoy, which is the standard approach at this level.`,
      },
      {
        q: "How do I copy this base to my village?",
        a: "Click the orange Copy Layout button above. It opens the official Clash of Clans link that automatically imports the base into your game's edit layout screen. Tap the copy icon in-game to save it.",
      },
      {
        q: `Does this layout work for both regular and Legend League farming at TH${th}?`,
        a: `This layout is designed for regular farming. If you are in Legend League, consider pairing it with a strong trophy defense design since loot protection mechanics differ slightly at that level.`,
      },
    ];
  }
  if (type.includes("trophy") || type.includes("legend")) {
    return [
      {
        q: `How many trophies can I expect to protect with this TH${th} base?`,
        a: `Trophy protection varies by opponent skill level, but this layout consistently gives away fewer than 2-star results, helping you maintain or grow your trophy count. It has been tested across multiple seasons at TH${th}.`,
      },
      {
        q: "How do I copy this base to my village?",
        a: "Click the orange Copy Layout button above. It opens the official Clash of Clans link that automatically imports the base into your game's edit layout screen. Tap the copy icon in-game to save it.",
      },
      {
        q: `Is this base suitable for pushing to Champions or Titan at TH${th}?`,
        a: `Yes — this layout is designed for high-level trophy pushing. The Town Hall placement and surrounding defenses maximize the chance of a 0-star or 1-star defense result in competitive trophy tiers.`,
      },
    ];
  }
  return [
    {
      q: `Why is this TH${th} ${baseType} layout popular in 2026?`,
      a: `This layout balances multiple defensive priorities for TH${th}: protecting core resources, defending the Town Hall, and covering the entire base with overlapping defense ranges. It has earned high community ratings for its versatility.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Click the orange Copy Layout button above. It opens the official Clash of Clans link that automatically imports the base into your game's edit layout screen. Tap the copy icon in-game to save it.",
    },
    {
      q: `How often is this TH${th} ${baseType} base updated?`,
      a: `Community contributors review and refresh base layouts after each major game update. The health score displayed on this page reflects current community feedback — higher scores mean the layout is still performing well in the current meta.`,
    },
  ];
}

function JsonLdSchema({ base, url }: { base: any; url: string }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}/` },
      { "@type": "ListItem", position: 2, name: `TH${base.townhall} Bases`, item: `${window.location.origin}/th/${base.townhall}` },
      { "@type": "ListItem", position: 3, name: base.title, item: url },
    ],
  };

  const aggregateRating = base.rating_count > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: base.title,
    description: base.description,
    image: base.image_url,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(base.rating_avg).toFixed(1),
      reviewCount: base.rating_count,
      bestRating: 5,
      worstRating: 1,
    },
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {aggregateRating && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
        />
      )}
    </>
  );
}

export function BaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: base, isLoading } = useGetBaseBySlug(slug || "");
  const { data: similar } = useGetSimilarBases(base?.id || "", {
    query: { enabled: !!base?.id }
  });
  const { data: comments, refetch: refetchComments } = useListComments(base?.id || "", {
    query: { enabled: !!base?.id }
  });
  const { data: todayCopies } = useGetBaseTodayCopies(base?.id || "", {
    query: { enabled: !!base?.id }
  });

  const incrementCopy = useIncrementBaseCopy();
  const incrementView = useIncrementBaseView();
  const addComment = useAddComment();

  const { register, handleSubmit, reset } = useForm<{ user_name: string; content: string }>();

  useEffect(() => {
    if (base?.id) {
      incrementView.mutate({ id: base.id });
      const key = "clh_recently_viewed";
      try {
        const viewed = JSON.parse(localStorage.getItem(key) || "[]");
        const filtered = viewed.filter((b: any) => b.id !== base.id);
        const updated = [
          { id: base.id, slug: base.slug, title: base.title, townhall: base.townhall, image_url: base.image_url },
          ...filtered,
        ].slice(0, 5);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
    }
  }, [base?.id]);

  function handleCopy() {
    if (!base) return;
    incrementCopy.mutate({ id: base.id });
    window.open(base.layout_link, "_blank", "noopener,noreferrer");
    toast.success("Layout copied! Opening in Clash of Clans...");
  }

  async function onSubmitComment(data: { user_name: string; content: string }) {
    if (!base) return;
    addComment.mutate(
      { baseId: base.id, data: { ...data, rating: rating || undefined } },
      {
        onSuccess: () => {
          toast.success("Comment added!");
          reset();
          setRating(0);
          refetchComments();
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-80 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!base) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Base Not Found</h1>
        <p className="text-muted-foreground mb-6">The base you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  const healthScore = base.health_score ?? Math.max(0, (base.win_rate ?? 80) - (base.report_count ?? 0) * 5);
  const healthColor = healthScore >= 70 ? "text-green-600" : healthScore >= 40 ? "text-yellow-600" : "text-red-600";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const faqs = getFAQs(base.base_type ?? "", base.townhall ?? 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* JSON-LD structured data */}
      <JsonLdSchema base={base} url={currentUrl} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/th/${base.townhall}`} className="hover:text-primary transition-colors">
          TH{base.townhall} Bases
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{base.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-black mb-4">{base.title}</h1>

          {/* Base image */}
          <div className="rounded-xl overflow-hidden border border-border mb-4 relative">
            {base.image_url ? (
              <img
                src={base.image_url}
                alt={base.title}
                className="w-full object-cover"
                style={{ touchAction: "pinch-zoom" }}
              />
            ) : (
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <Shield className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="th-badge">TH{base.townhall}</span>
              <span className="px-2 py-0.5 bg-secondary text-white rounded-full text-xs font-semibold">
                {base.base_type}
              </span>
            </div>
          </div>

          {/* Ad unit below image */}
          <AdUnit slot="base-detail-below-image" size="banner" className="mb-5" />

          {/* Today copies callout */}
          {todayCopies && todayCopies.todayCopies > 0 && (
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mb-6 text-sm">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">{todayCopies.todayCopies}</span>
              <span className="text-muted-foreground">{t.copiedToday}</span>
            </div>
          )}

          {/* Description */}
          <div className="prose prose-sm max-w-none mb-8">
            <h2 className="text-lg font-bold mb-3">About This Base</h2>
            <p className="text-muted-foreground leading-relaxed">{base.description}</p>
          </div>

          {/* Key Features */}
          {base.key_features && base.key_features.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3">{t.keyFeatures}</h3>
              <ul className="space-y-2">
                {base.key_features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Against */}
          {base.best_against && base.best_against.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3">{t.bestAgainst}</h3>
              <div className="flex flex-wrap gap-2">
                {base.best_against.map((troop, i) => (
                  <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
                    {troop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t.comments} ({comments?.length ?? 0})
            </h2>

            {/* Add comment form */}
            <form onSubmit={handleSubmit(onSubmitComment)} className="bg-white border border-border rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-4">{t.leaveComment}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  {...register("user_name", { required: true })}
                  placeholder={t.yourName}
                  className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">{t.rating} (optional)</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>
              <textarea
                {...register("content", { required: true })}
                placeholder={t.yourComment}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-4"
              />
              <button
                type="submit"
                disabled={addComment.isPending}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {addComment.isPending ? "Posting..." : t.submitComment}
              </button>
            </form>

            {/* Comments list */}
            <div className="space-y-4">
              {comments?.map(comment => (
                <div key={comment.id} className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(comment.created_at || "").toLocaleDateString()}
                      </span>
                    </div>
                    {comment.rating && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (comment.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              ))}
              {!comments?.length && (
                <p className="text-center text-muted-foreground text-sm py-8">No comments yet. Be the first to share your experience!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Action buttons */}
            <div className="bg-white border border-border rounded-xl p-4 space-y-3">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-colors"
              >
                <Copy className="w-4 h-4" />
                {t.copyLayout}
              </button>

              <a
                href="https://discord.gg/clashoflayouts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {t.discord}
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border hover:border-destructive/50 hover:text-destructive text-muted-foreground rounded-xl text-xs font-medium transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t.reportIssue}
                </button>
              </div>
            </div>

            {/* Today copies counter */}
            {todayCopies && todayCopies.todayCopies > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Copied today</p>
                  <p className="text-lg font-black text-primary leading-tight">{todayCopies.todayCopies} <span className="text-xs font-medium text-muted-foreground">players</span></p>
                </div>
              </div>
            )}

            {/* Base Stats */}
            <div className="bg-white border border-border rounded-xl p-4">
              <h3 className="font-bold mb-4 text-sm">Base Details</h3>
              <dl className="space-y-3">
                {[
                  { label: "Town Hall", value: `TH${base.townhall}` },
                  { label: "Type", value: base.base_type },
                  { label: "Difficulty", value: base.difficulty || "Medium" },
                  { label: t.winRate, value: `${base.win_rate ?? 80}%` },
                  { label: t.health, value: <span className={`font-bold ${healthColor}`}>{healthScore}/100</span> },
                  { label: t.views, value: (base.views ?? 0).toLocaleString() },
                  { label: t.copies, value: (base.copies ?? 0).toLocaleString() },
                  { label: "Rating", value: base.rating_count ? `${Number(base.rating_avg).toFixed(1)}/5 (${base.rating_count})` : "Not rated" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Layout Link */}
            <div className="bg-white border border-border rounded-xl p-4">
              <h3 className="font-bold mb-2 text-sm">Layout Link</h3>
              <a
                href={base.layout_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary break-all flex items-start gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {base.layout_link.substring(0, 50)}...
              </a>
            </div>

            {/* Sidebar ad */}
            <AdUnit slot="base-detail-sidebar" size="rectangle" className="mx-auto" />
          </div>
        </div>
      </div>

      {/* Similar Bases */}
      {similar && similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-2">{t.similarBases}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            More TH{base.townhall} {base.base_type} layouts you might like
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similar.slice(0, 6).map(b => (
              <BaseCard key={b.id} base={b} />
            ))}
          </div>
        </section>
      )}

      <ReportModal baseId={base.id} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
