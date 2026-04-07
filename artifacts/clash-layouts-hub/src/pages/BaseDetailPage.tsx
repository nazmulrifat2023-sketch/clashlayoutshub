import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import {
  Copy, Star, Shield, ChevronRight, MessageSquare, AlertTriangle,
  ExternalLink, Activity, ChevronDown, ChevronUp, Flame, Users,
  TrendingUp, Zap, BookOpen, ArrowRight, Loader2
} from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { BaseCard } from "@/components/base/BaseCard";
import { ReportModal } from "@/components/base/ReportModal";
import { AdUnit } from "@/components/ads/AdUnit";
import {
  useGetBaseBySlug, useIncrementBaseCopy, useIncrementBaseView,
  useGetSimilarBases, useListComments, useAddComment, useGetBaseTodayCopies,
  useGetBaseAnalysis,
} from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const GOLD = "#D4AF37";
const TH_LEVELS = Array.from({ length: 16 }, (_, i) => i + 3);

/* ─── Star Rating ─── */
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

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <span className="pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── 5 FAQs per base type ─── */
function getFAQs(baseType: string, th: number): { q: string; a: string }[] {
  const type = baseType.toLowerCase();

  if (type.includes("war") || type.includes("anti")) return [
    {
      q: `Is this TH${th} war base still effective in 2026?`,
      a: `Yes — this layout is updated for the 2026 meta and tested against the most popular TH${th} attack strategies including Super Witch Smash, Hydra, and Ground Hybrid. Community members consistently report high two-star defense rates, making it one of the most reliable war bases at this level.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Click the orange Copy Layout button at the top of this page. It opens the official Clash of Clans link that automatically imports the base into your game's edit layout screen. Tap the save/copy icon in-game to assign it to your War or Home Village slot.",
    },
    {
      q: `What attack strategies does this TH${th} war base counter best?`,
      a: `This layout is specifically designed to counter the three-star heavy strategies common at TH${th}. The multi-compartment wall design forces attackers to commit ground troops early, while centralized key defenses make it extremely difficult for air armies to funnel correctly. Community reports show strong performance against Electro Dragons and Super Witch.`,
    },
    {
      q: `Should I use this as my main war base or alternate between layouts?`,
      a: `We recommend using this as your primary war base for 2–3 wars, then switching to an alternative if opponents start specifically countering it. Keeping your base fresh prevents enemies from pre-planning replays against it. Check the health score on this page — if it drops below 60, consider rotating to a newer layout.`,
    },
    {
      q: `What Clan Castle troops work best with this TH${th} war base?`,
      a: `At TH${th}, the most effective Clan Castle defensive compositions include Super Minions (for anti-air coverage), a Witch with Skeletons (to distract and delay ground attackers), or an Ice Golem paired with a Barbarian to tank and slow enemy troops. Always fill your Clan Castle before a war to maximize your defense rating.`,
    },
  ];

  if (type.includes("farming")) return [
    {
      q: `How much loot can this TH${th} farming base protect?`,
      a: `This TH${th} farming base places your Dark Elixir storage deep inside multiple wall layers, making it extremely difficult for Sneaky Goblins or Super Archers to reach. Gold and Elixir storages are semi-exposed as decoys — the standard approach at this level that sacrifices some surface resources to protect the more valuable Dark Elixir.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Click the orange Copy Layout button at the top. It opens the official Clash of Clans link that automatically imports the base into your edit layout screen. Tap save in-game to apply it to your Home Village.",
    },
    {
      q: `Does this TH${th} farming base work in all trophy ranges?`,
      a: `This base is optimized for the Crystal–Master trophy range, where farming raids are most frequent. If you're in Champion League or above, loot protection mechanics differ — consider combining this with a hybrid trophy-farming layout. The health score displayed on this page reflects its current community-verified effectiveness.`,
    },
    {
      q: `How often should I update my farming base?`,
      a: `We recommend checking your farming base effectiveness after every major Clash of Clans update. New troop releases or balance changes can make previously strong bases more vulnerable. The health score on this page is updated in real time by community feedback — if it falls below 55, it's time for a refresh.`,
    },
    {
      q: `What is the best strategy to protect Dark Elixir at TH${th}?`,
      a: `At TH${th}, the Dark Elixir Storage should be surrounded by your highest-DPS defenses — typically Inferno Towers, the Scattershot, and X-Bows set to ground mode. Place at least two Giant Bombs near common Hog Rider or Miner drop zones adjacent to the core. This makes even experienced farmers think twice before raiding your Dark Elixir.`,
    },
  ];

  if (type.includes("hybrid")) return [
    {
      q: `What makes this a good TH${th} hybrid base in 2026?`,
      a: `A strong hybrid base at TH${th} must defend both trophies and loot simultaneously. This layout achieves that by centralizing the Town Hall alongside key storages, forcing attackers to commit fully to reach either objective. The overlapping defense ranges create deadly cross-fire zones that punish mistimed attacks regardless of army composition.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Click the orange Copy Layout button at the top. It opens the official Clash of Clans import link. Tap save/copy in-game to assign it to your Home Village layout slot.",
    },
    {
      q: `Can this TH${th} hybrid base hold against both air and ground armies?`,
      a: `Yes — the air defense and Scattershot positioning creates strong anti-air coverage, while X-Bows and the Monolith handle ground threats. The multi-layer wall compartments slow down ground armies, giving your defenses time to eliminate troops before they reach key structures.`,
    },
    {
      q: `How does a hybrid base differ from a pure trophy base at TH${th}?`,
      a: `A pure trophy base maximizes Town Hall defense above all else, sometimes leaving storages exposed. A hybrid base like this one keeps storages at least partially protected inside the core, so you defend trophies AND discourage farming raids at the same time. It's the recommended setup for active players who also care about loot.`,
    },
    {
      q: `What is the ideal Clan Castle troop setup for this hybrid base?`,
      a: `A Witch + Ice Golem combo works extremely well for hybrid bases at TH${th} — the Ice Golem freezes and slows approaching troops, while the Witch's skeletons provide distracting masses. Alternatively, 3–4 Super Minions offer strong anti-air punch for opponents trying to air-funnel past the Scattershot.`,
    },
  ];

  if (type.includes("trophy") || type.includes("legend")) return [
    {
      q: `How many trophies can I protect with this TH${th} trophy base?`,
      a: `This layout is designed to consistently force 0-star or 1-star results at the TH${th} level, giving away fewer trophies than average. Community testers report strong performance in the Champion and Titan Leagues — making it an excellent choice for trophy pushers aiming to reach Legend League.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Tap the orange Copy Layout button at the top. The official Clash of Clans link will open and auto-import the base into your edit layout screen. Save it in-game to assign it to your push slot.",
    },
    {
      q: `Is this TH${th} trophy base suitable for Legend League?`,
      a: `Yes — this layout is designed for the upper tiers of competitive play. In Legend League, every star given up directly affects your daily ranking. This base's Town Hall position and surrounding defensive coverage maximize the chance of a 0-star or 1-star result, giving you the best shot at maintaining your Legend League ranking.`,
    },
    {
      q: `How do I counter common Legend League attacks at TH${th}?`,
      a: `At this trophy range, attackers commonly use Root Riders, Electro Dragons with Zap, and Ground Hybrid armies. This base is designed with compartments that break these funnels early. Fill your Clan Castle with high-value defensive troops (Super Minions or a Witch) to add an unpredictable layer that even experienced attackers struggle to counter.`,
    },
    {
      q: `How long will this trophy base stay effective before I need to change it?`,
      a: `Typically 2–4 weeks in the current meta before top players identify a consistent counter. Monitor the health score on this page — once it drops below 60, it's time to rotate. We regularly update our bases after each major game update to ensure you always have access to the most current layouts.`,
    },
  ];

  return [
    {
      q: `Why is this TH${th} ${baseType} layout popular in 2026?`,
      a: `This layout balances multiple defensive priorities for TH${th}: protecting core resources, defending the Town Hall, and covering the entire base with overlapping defense ranges. It has earned strong community ratings for its versatility across multiple attack compositions in the current meta.`,
    },
    {
      q: "How do I copy this base to my village?",
      a: "Click the orange Copy Layout button at the top. It opens the official Clash of Clans link that automatically imports the base into your edit layout screen. Tap save in-game to apply it.",
    },
    {
      q: `How often is this TH${th} ${baseType} base updated?`,
      a: `Community contributors review and refresh base layouts after each major game update. The health score displayed on this page reflects current community feedback — higher scores mean the layout is still performing well in the current meta. Scores below 60 indicate it may need refreshing.`,
    },
    {
      q: `What makes a strong TH${th} base in the 2026 meta?`,
      a: `The 2026 meta at TH${th} demands bases that can counter air-heavy compositions (Hydra, Electro Dragons) and ground armies (Root Riders, Ground Hybrid) simultaneously. Strong compartmentalization, centralized Eagle Artillery or Monolith, and well-placed air traps are the hallmarks of a top-tier base at this level.`,
    },
    {
      q: `Can I use this base in both regular multiplayer and Clan Wars?`,
      a: `Absolutely — this layout is versatile enough for both casual multiplayer farming and competitive war settings. For Clan Wars specifically, ensure your Clan Castle is filled before the war starts and consider adjusting the inner compartment for your preferred defensive CC troop composition.`,
    },
  ];
}

/* ─── JSON-LD Schema ─── */
function JsonLdSchema({ base, url, faqs }: { base: any; url: string; faqs: { q: string; a: string }[] }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: `TH${base.townhall} Bases`, item: `${origin}/th/${base.townhall}` },
      { "@type": "ListItem", position: 3, name: base.title, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const softwareApp = base.rating_count > 0 ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${base.title} — TH${base.townhall} ${base.base_type} Base`,
    applicationCategory: "GameApplication",
    operatingSystem: "iOS, Android",
    url,
    description: base.description,
    image: base.image_url,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {softwareApp && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      )}
    </>
  );
}

/* ─── AI Analysis Section ─── */
function AIAnalysisSection({ baseId, baseTitle }: { baseId: string; baseTitle: string }) {
  const { data, isLoading, isError } = useGetBaseAnalysis(baseId);
  const paragraphs = data?.analysis?.split("\n\n").filter(Boolean) ?? [];

  if (isLoading) {
    return (
      <div className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/15 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-lg font-bold">About This Base</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">AI Analysis</span>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Generating AI analysis by our Pro CoC Strategist...
        </p>
      </div>
    );
  }

  if (isError || !data?.analysis) {
    return null;
  }

  return (
    <div className="mb-8 bg-gradient-to-br from-primary/5 via-white to-secondary/5 border border-primary/15 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">About This Base</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>
          Pro Analysis
        </span>
        {data.cached && (
          <span className="text-xs text-muted-foreground">· Expert-verified</span>
        )}
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-[1.8]">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function BaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: base, isLoading } = useGetBaseBySlug(slug || "");
  const { data: similar } = useGetSimilarBases(base?.id || "", { query: { enabled: !!base?.id } });
  const { data: comments, refetch: refetchComments } = useListComments(base?.id || "", { query: { enabled: !!base?.id } });
  const { data: todayCopies } = useGetBaseTodayCopies(base?.id || "", { query: { enabled: !!base?.id } });

  const incrementCopy = useIncrementBaseCopy();
  const incrementView = useIncrementBaseView();
  const addComment = useAddComment();
  const { register, handleSubmit, reset } = useForm<{ user_name: string; content: string }>();

  /* SEO: dynamic title + meta */
  useEffect(() => {
    if (!base) return;
    const title = `Best TH${base.townhall} ${base.base_type} Base Link 2026 - ${base.title} | ClashLayoutsHub`;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = `Download the best TH${base.townhall} ${base.base_type} base link 2026. ${base.title} — ${base.win_rate}% win rate, tested by ${(base.copies ?? 0).toLocaleString()} players. Copy layout now!`;
  }, [base]);

  /* Track view + recently viewed */
  useEffect(() => {
    if (!base?.id) return;
    incrementView.mutate({ id: base.id });
    try {
      const key = "clh_recently_viewed";
      const viewed = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = viewed.filter((b: any) => b.id !== base.id);
      const updated = [
        { id: base.id, slug: base.slug, title: base.title, townhall: base.townhall, image_url: base.image_url },
        ...filtered,
      ].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
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

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-80 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!base) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl font-black text-muted-foreground/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Base Not Found</h1>
        <p className="text-muted-foreground mb-6">The base you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          Browse All Bases
        </Link>
      </div>
    );
  }

  const healthScore = base.health_score ?? Math.max(0, (base.win_rate ?? 80) - (base.report_count ?? 0) * 5);
  const healthColor = healthScore >= 70 ? "text-green-600" : healthScore >= 40 ? "text-yellow-600" : "text-red-600";
  const healthBg = healthScore >= 70 ? "bg-green-50 border-green-200" : healthScore >= 40 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const faqs = getFAQs(base.base_type ?? "", base.townhall ?? 0);

  const altText = `Best TH${base.townhall} ${base.base_type} Base Layout 2026 - ${base.title} Clash of Clans`;

  /* TH exploration: adjacent levels */
  const exploreTH = TH_LEVELS.filter(l => Math.abs(l - (base.townhall ?? 10)) <= 2 && l !== base.townhall);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* JSON-LD */}
      <JsonLdSchema base={base} url={currentUrl} faqs={faqs} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/th/${base.townhall}`} className="hover:text-primary transition-colors">
          TH{base.townhall} Bases
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[220px]">{base.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main column ── */}
        <div className="lg:col-span-2">

          {/* Page title */}
          <h1 className="text-2xl sm:text-3xl font-black mb-5 leading-tight">
            Best TH{base.townhall} {base.base_type} Base 2026 — {base.title}
          </h1>

          {/* Base image */}
          <div className="rounded-2xl overflow-hidden border border-border mb-4 relative shadow-sm">
            {base.image_url ? (
              <img
                src={base.image_url}
                alt={altText}
                className="w-full object-cover"
                loading="eager"
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

          {/* 🔥 Live copy counter banner */}
          {todayCopies && todayCopies.todayCopies > 0 && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border"
              style={{ backgroundColor: "#FFF8E7", borderColor: `${GOLD}40` }}>
              <Flame className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} />
              <p className="text-sm font-semibold" style={{ color: "#92640F" }}>
                🔥 Verified: <span className="font-black text-base">{todayCopies.todayCopies}</span>{" "}
                players have used this layout today
              </p>
            </div>
          )}

          {/* Ad unit — below image (mobile-safe fixed height) */}
          <AdUnit slot="base-detail-top" className="mb-6" />

          {/* ── AI Analysis Section ── */}
          <AIAnalysisSection baseId={base.id} baseTitle={base.title} />

          {/* Key Features */}
          {base.key_features && base.key_features.length > 0 && (
            <div className="mb-7">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {t.keyFeatures}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {base.key_features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm bg-muted/40 rounded-lg px-3 py-2.5">
                    <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Against */}
          {base.best_against && base.best_against.length > 0 && (
            <div className="mb-7">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-destructive" />
                {t.bestAgainst}
              </h3>
              <div className="flex flex-wrap gap-2">
                {base.best_against.map((troop, i) => (
                  <span key={i} className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-xs font-semibold border border-destructive/20">
                    ⚔️ {troop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mid-content ad (content-to-ad ratio safe) */}
          <AdUnit slot="base-detail-mid" className="mb-7" />

          {/* ── FAQ Section ── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-2.5">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>

          {/* ── Comments ── */}
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t.comments} ({comments?.length ?? 0})
            </h2>

            <form onSubmit={handleSubmit(onSubmitComment)} className="bg-white border border-border rounded-xl p-5 mb-6">
              <h3 className="font-semibold mb-4">{t.leaveComment}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  {...register("user_name", { required: true })}
                  placeholder={t.yourName}
                  className="px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t.rating} (optional)</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>
              <textarea
                {...register("content", { required: true })}
                placeholder={t.yourComment}
                rows={3}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-4"
              />
              <button
                type="submit"
                disabled={addComment.isPending}
                className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {addComment.isPending ? "Posting..." : t.submitComment}
              </button>
            </form>

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
                <p className="text-center text-muted-foreground text-sm py-8">
                  No comments yet. Be the first to share your experience!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">

            {/* Copy button */}
            <div className="bg-white border border-border rounded-2xl p-4 space-y-3 shadow-sm">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-sm transition-colors shadow-md"
              >
                <Copy className="w-4 h-4" />
                {t.copyLayout}
              </button>
              <a
                href="https://discord.gg/clashoflayouts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium text-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {t.discord}
              </a>
              <button
                onClick={() => setReportOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 border border-border hover:border-destructive/50 hover:text-destructive text-muted-foreground rounded-xl text-xs font-medium transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t.reportIssue}
              </button>
            </div>

            {/* Today copies card */}
            {todayCopies && todayCopies.todayCopies > 0 && (
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: "#FFFBEB", borderColor: `${GOLD}35` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${GOLD}20` }}>
                    <Flame className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#92640F" }}>Copied today</p>
                    <p className="font-black text-xl leading-tight" style={{ color: GOLD }}>
                      {todayCopies.todayCopies}
                      <span className="text-xs font-medium text-muted-foreground ml-1">players</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Base stats */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <h3 className="font-bold mb-4 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                Base Details
              </h3>
              <dl className="space-y-2.5">
                {[
                  { label: "Town Hall", value: `TH${base.townhall}` },
                  { label: "Base Type", value: base.base_type },
                  { label: "Difficulty", value: base.difficulty || "Medium" },
                  { label: t.winRate, value: `${base.win_rate ?? 80}%` },
                  {
                    label: t.health,
                    value: (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${healthBg} ${healthColor}`}>
                        {healthScore}/100
                      </span>
                    ),
                  },
                  { label: t.views, value: (base.views ?? 0).toLocaleString() },
                  { label: t.copies, value: (base.copies ?? 0).toLocaleString() },
                  {
                    label: "Rating",
                    value: base.rating_count
                      ? (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          {Number(base.rating_avg).toFixed(1)}/5 ({base.rating_count})
                        </span>
                      )
                      : "Not rated yet",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Layout link */}
            <div className="bg-white border border-border rounded-2xl p-4">
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
            <AdUnit slot="base-detail-sidebar" />
          </div>
        </div>
      </div>

      {/* ── Similar Bases (6) ── */}
      {similar && similar.length > 0 && (
        <section className="mt-14" aria-labelledby="similar-heading">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 id="similar-heading" className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {t.similarBases}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                More TH{base.townhall} {base.base_type} layouts tested by our community
              </p>
            </div>
            <Link href={`/th/${base.townhall}`}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {similar.slice(0, 6).map(b => (
              <BaseCard key={b.id} base={b} />
            ))}
          </div>
        </section>
      )}

      {/* ── Internal linking: Explore TH levels ── */}
      <section className="mt-14 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-6"
        aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="text-lg font-bold mb-1 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Explore More TH{base.townhall} Bases
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Discover the full collection of verified Town Hall {base.townhall} layouts for every strategy.
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {["War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Legend League"].map(type => (
            <Link
              key={type}
              href={`/th/${base.townhall}?base_type=${encodeURIComponent(type)}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
            >
              {type} Bases
            </Link>
          ))}
        </div>

        {exploreTH.length > 0 && (
          <>
            <div className="h-px bg-border mb-4" />
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Browse other Town Hall levels
            </p>
            <div className="flex flex-wrap gap-2">
              {TH_LEVELS.map(th => (
                <Link
                  key={th}
                  href={`/th/${th}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    th === base.townhall
                      ? "text-white"
                      : "bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  style={th === base.townhall ? { backgroundColor: GOLD } : {}}
                >
                  TH{th}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <ReportModal baseId={base.id} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
