import { Link } from "wouter";
import {
  Shield, Target, Users, BookOpen, CheckCircle2, Star,
  Globe, Mail, FileText, Lock, ClipboardList, Flame,
} from "lucide-react";

const GOLD = "#D4AF37";

const stats = [
  { value: "1,000+", label: "Verified Base Layouts" },
  { value: "TH3–TH18", label: "All Town Hall Levels" },
  { value: "3", label: "Languages Supported" },
  { value: "100%", label: "Free, Forever" },
];

const values = [
  {
    icon: CheckCircle2,
    title: "Quality First",
    desc: "Every base is manually reviewed for effectiveness before going live. We reject spam, duplicates, and outdated layouts without exception.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Real players submit, test, and rate every layout. Our win-rate tracking and copy counters reflect genuine community usage — not artificial numbers.",
  },
  {
    icon: Target,
    title: "Accuracy & Transparency",
    desc: "Our health score system surfaces declining bases automatically. If a layout starts getting beaten regularly, its score drops and we flag it for review.",
  },
  {
    icon: Globe,
    title: "Inclusive & Multilingual",
    desc: "Clash of Clans is a global game. ClashLayoutsHub is fully available in English, Bengali, and Hindi so every player can benefit, regardless of language.",
  },
];

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12 pb-20">

      {/* Hero */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${GOLD}20` }}>
          <Shield className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">About ClashLayoutsHub</h1>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-10 text-base sm:text-lg">
        The internet's most trusted, community-verified library of Clash of Clans base layouts —
        built by players, for players. Free to use. Always.
      </p>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <div className="text-2xl font-black" style={{ color: GOLD }}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Who we are */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: GOLD }} />
          Who We Are
        </h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
          <p>
            ClashLayoutsHub was founded in 2024 by a group of passionate Clash of Clans players
            frustrated by the lack of a reliable, up-to-date source for base layouts. Most other
            sites posted layouts without testing them, flooded pages with outdated TH designs, and
            offered no way to tell whether a base was actually working in the current meta.
          </p>
          <p>
            We built ClashLayoutsHub to fix that. Every base in our library is submitted through a
            structured process, reviewed by experienced players, and monitored after publication
            using real community feedback. If a base stops working, our health score system catches
            it — and we pull or update it before it wastes your time.
          </p>
          <p>
            Today, ClashLayoutsHub serves players across all Town Hall levels, from TH3 beginners
            learning the basics of War Bases to TH18 veterans pushing for Legend League trophies.
            We cover War, Farming, Hybrid, Trophy, and Anti-3-Star layouts for every level,
            updated regularly to reflect the latest Clash of Clans patches and troop releases.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-10 bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-xl font-black mb-2 flex items-center gap-2">
          <Target className="w-5 h-5" style={{ color: GOLD }} />
          Our Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          To give every Clash of Clans player — from a first-time TH3 to a seasoned Legend League
          competitor — free, instant access to the best, most current base layouts in the game.
          We believe strong defenses shouldn't require hours of research or paying for private
          Discord servers. Quality strategy resources should be open, accurate, and accessible to all.
        </p>
      </section>

      {/* Core values */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-5 flex items-center gap-2">
          <Star className="w-5 h-5" style={{ color: GOLD }} />
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <v.icon className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                <h3 className="font-bold text-sm">{v.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" style={{ color: GOLD }} />
          How Our Review Process Works
        </h2>
        <ol className="space-y-4">
          {[
            { step: "1", title: "Community Submission", desc: "Players submit base layouts through our public submission form, providing the official Clash of Clans share link, a screenshot, and a description of the base's strengths." },
            { step: "2", title: "Expert Review", desc: "Our editorial team of experienced players reviews each submission. We check whether the layout is original, well-designed for its Town Hall level, and suited to the claimed base type." },
            { step: "3", title: "Live Monitoring", desc: "After publishing, every base is tracked using copy counts, community reports, and win-rate signals. A health score (0–100) is calculated and displayed on every card." },
            { step: "4", title: "Ongoing Curation", desc: "Bases with declining health scores are flagged for re-evaluation. If a layout has been broken by a game update or is consistently reported, we remove or update it immediately." },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Content policy */}
      <section className="mb-10 bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-xl font-black mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: GOLD }} />
          Editorial &amp; Content Policy
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            ClashLayoutsHub publishes only original base layouts submitted directly by players or
            verified by our editorial team. We do not scrape or republish layouts without permission.
            All blog content is written or reviewed by experienced Clash of Clans players and edited
            for accuracy before publication.
          </p>
          <p>
            We do not accept paid placements, sponsored "best base" rankings, or affiliate
            arrangements that could bias our recommendations. Our health scores and popularity rankings
            are calculated purely from community usage data.
          </p>
          <p>
            If you believe any content on ClashLayoutsHub is inaccurate, outdated, or violates these
            standards, please use our <Link href="/contact" className="underline underline-offset-2 font-medium" style={{ color: GOLD }}>Contact page</Link> to report it.
            We take all feedback seriously and aim to respond within 48 hours.
          </p>
        </div>
      </section>

      {/* What's coming */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5" style={{ color: GOLD }} />
          What's Coming Next
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          We're continuously improving ClashLayoutsHub. Features actively in development include:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            "Village Builder (drag-and-drop base editor directly in browser)",
            "Attack strategy guides paired with each base layout",
            "War performance tracking for clans who use our bases",
            "Push notifications for new bases in your Town Hall level",
            "Expanded language support (Spanish, Arabic, Indonesian)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact + legal links */}
      <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" style={{ color: GOLD }} />
          Get in Touch
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Have a question, a base submission, a partnership inquiry, or feedback about the site?
          We'd love to hear from you. Our team reviews all messages within 1–2 business days.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: GOLD }}>
            Contact Us
          </Link>
          <Link href="/blog"
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors">
            Read Our Blog
          </Link>
          <Link href="/submit-base"
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-colors">
            Submit a Base
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-6 pt-5 border-t border-border">
          {[
            { href: "/privacy-policy", icon: Lock, label: "Privacy Policy" },
            { href: "/terms", icon: FileText, label: "Terms of Service" },
            { href: "/contact", icon: Mail, label: "Contact" },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}


export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center py-16 bg-gradient-to-b from-background to-muted/30">

      {/* Broken Shield / Skull illustration */}
      <div className="relative mb-6 select-none">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: GOLD }}
        />
        {/* Shield wrapper */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Large shield background */}
          <div
            className="absolute inset-0 rounded-full opacity-10"
            style={{ backgroundColor: GOLD }}
          />
          <div
            className="relative flex items-center justify-center w-24 h-24 rounded-full"
            style={{ background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`, border: `3px solid ${GOLD}40` }}
          >
            {/* Crossed swords + skull */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl leading-none" role="img" aria-label="skull">💀</span>
              <span className="text-xs font-black tracking-widest" style={{ color: GOLD, fontSize: 10 }}>DESTROYED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 404 badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest mb-5"
        style={{ backgroundColor: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}
      >
        <Flame className="w-3.5 h-3.5" />
        ERROR 404 — BASE DESTROYED
        <Flame className="w-3.5 h-3.5" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
        Village Not Found!
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-2 max-w-md leading-relaxed">
        This base was <strong>3-starred</strong> and wiped off the map.
        The page you're looking for doesn't exist or has been moved.
      </p>
      <p className="text-sm text-muted-foreground/60 mb-8">
        Even your Eagle Artillery couldn't save it. 🏹
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 text-white rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-md"
          style={{ backgroundColor: GOLD }}
        >
          🏠 Return to Base Camp
        </Link>
        <Link
          href="/blog"
          className="px-6 py-3 border border-border rounded-xl font-semibold text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          📖 Read the Blog
        </Link>
      </div>

      {/* Quick TH links */}
      <div className="mt-12 text-center">
        <p className="text-xs text-muted-foreground/60 mb-3 uppercase tracking-widest font-medium">
          Quick access
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[9, 10, 11, 12, 13, 14, 15, 16].map(th => (
            <Link
              key={th}
              href={`/th/${th}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
            >
              TH{th}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
