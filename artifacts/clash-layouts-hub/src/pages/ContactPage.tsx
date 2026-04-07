import { useState } from "react";
import { Link } from "wouter";
import {
  Mail,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Users,
  Handshake,
  Bug,
  Star,
  Shield,
} from "lucide-react";

const FAQS = [
  {
    q: "How do I copy a base layout to my Clash of Clans game?",
    a: "Click the orange 'Copy Layout' button on any base detail page. This opens the official Clash of Clans app and automatically imports the layout. Make sure your game is updated to the latest version for the best compatibility.",
  },
  {
    q: "How do I report a broken or outdated base link?",
    a: "On the base detail page, click the 'Report Issue' button in the sidebar. Our moderation team reviews every report within 24–48 hours and updates or removes broken layouts.",
  },
  {
    q: "Can I submit my own base layout?",
    a: "Yes! Click 'Submit a Base' in the navigation menu. After submitting, our team reviews the layout for quality, verifies the link works, and publishes it to the library — usually within 1–3 business days.",
  },
  {
    q: "How do I request a base for a specific Town Hall level?",
    a: "Use the contact form on this page with the subject 'Base Request' and describe the Town Hall level, base type (War, Trophy, Farm, etc.), and any specific requirements. We'll do our best to add it to our library.",
  },
  {
    q: "Do you offer advertising or sponsorship opportunities?",
    a: "Yes! We partner with Clash of Clans content creators, YouTube channels, and gaming brands. Fill out the contact form and select 'Partnership / Advertising' as your topic — our team will respond within 2 business days.",
  },
  {
    q: "Is ClashLayoutsHub officially affiliated with Supercell?",
    a: "No. ClashLayoutsHub is a fan-made, community-driven website. We are not affiliated with, endorsed by, or partnered with Supercell. This content is not official Clash of Clans content.",
  },
];

const CONTACT_CARDS = [
  {
    icon: Mail,
    color: "bg-amber-50 text-amber-600",
    title: "Email Support",
    desc: "Get help with account issues, base reports, or general questions.",
    action: "contact@clashlayoutshub.com",
    href: "mailto:contact@clashlayoutshub.com",
    label: "Send Email",
  },
  {
    icon: MessageSquare,
    color: "bg-indigo-50 text-indigo-600",
    title: "Discord Community",
    desc: "Join thousands of Clash players, share layouts, and get instant help.",
    action: "discord.gg/Z9jpQyKEdw",
    href: "https://discord.gg/Z9jpQyKEdw",
    label: "Join Discord",
  },
  {
    icon: Handshake,
    color: "bg-emerald-50 text-emerald-600",
    title: "Business & Partnership",
    desc: "Sponsorships, content collaborations, and advertising inquiries.",
    action: "partners@clashlayoutshub.com",
    href: "mailto:partners@clashlayoutshub.com",
    label: "Partner With Us",
  },
];

const TOPICS = [
  { value: "general", label: "General Question" },
  { value: "bug", label: "Bug Report" },
  { value: "base-request", label: "Base Request" },
  { value: "submit", label: "Submit a Base" },
  { value: "partnership", label: "Partnership / Advertising" },
  { value: "dmca", label: "DMCA / Copyright" },
  { value: "other", label: "Other" },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your name (at least 2 characters).";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://clashlayoutshub.com/contact",
        url: "https://clashlayoutshub.com/contact",
        name: "Contact ClashLayoutsHub — Support, Feedback & Partnerships",
        description:
          "Contact the ClashLayoutsHub team for support, base requests, bug reports, or partnership inquiries. We respond within 24 hours.",
        inLanguage: "en-US",
        publisher: {
          "@type": "Organization",
          name: "ClashLayoutsHub",
          url: "https://clashlayoutshub.com",
          email: "contact@clashlayoutshub.com",
          sameAs: [
            "https://discord.gg/Z9jpQyKEdw",
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://clashlayoutshub.com/" },
          { "@type": "ListItem", position: 2, name: "Contact Us", item: "https://clashlayoutshub.com/contact" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <title>Contact ClashLayoutsHub — Support, Feedback & Partnerships</title>
      <meta
        name="description"
        content="Have a question about Clash of Clans base layouts? Contact ClashLayoutsHub for support, bug reports, base requests, or business partnerships. We typically respond within 24 hours."
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://clashlayoutshub.com/contact" />
      <meta property="og:title" content="Contact ClashLayoutsHub — Support & Partnerships" />
      <meta
        property="og:description"
        content="Reach out to the ClashLayoutsHub team for help, base requests, bug reports, or partnership opportunities."
      />
      <meta property="og:url" content="https://clashlayoutshub.com/contact" />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ── Hero ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 font-medium">Contact Us</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-xs font-semibold text-amber-700 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  Usually respond within 24 hours
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
                  Get in Touch With<br className="hidden sm:block" />{" "}
                  <span className="text-primary">ClashLayoutsHub</span>
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                  Whether you've found a bug, want to request a base layout, or are interested in partnering with us — we're here and happy to help.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex flex-row md:flex-col gap-3 flex-wrap md:flex-nowrap">
                {[
                  { icon: CheckCircle2, text: "24-hour response time", color: "text-emerald-500" },
                  { icon: Shield, text: "Your data is never sold", color: "text-indigo-500" },
                  { icon: Star, text: "Trusted by 50,000+ players", color: "text-amber-500" },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Icon className={`w-4 h-4 ${color} shrink-0`} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact Cards ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONTACT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col gap-3"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base mb-1">{card.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                    <span>{card.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Form + FAQ ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Send Us a Message</h2>
                    <p className="text-xs text-gray-400">All fields are required</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 text-sm max-w-xs">
                        Thanks, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "general", message: "" }); }}
                      className="mt-2 text-sm text-primary font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. ClashKing99"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                            errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary/30 focus:border-primary"
                          }`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                            errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary/30 focus:border-primary"
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Topic */}
                    <div>
                      <label htmlFor="contact-topic" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Topic
                      </label>
                      <select
                        id="contact-topic"
                        value={form.topic}
                        onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        {TOPICS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message
                        <span className="ml-2 font-normal text-gray-400 text-xs">(min. 20 characters)</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Describe your question, issue, or request in detail..."
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 resize-none transition-all ${
                          errors.message ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary/30 focus:border-primary"
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.message ? (
                          <p className="text-red-500 text-xs">{errors.message}</p>
                        ) : <span />}
                        <span className="text-xs text-gray-400 ml-auto">{form.message.length} chars</span>
                      </div>
                    </div>

                    {/* Privacy note */}
                    <p className="text-xs text-gray-400 leading-relaxed">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                      We never share your email with third parties.
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <h2 className="font-black text-gray-900 text-lg">Frequently Asked</h2>
                </div>

                <div className="space-y-2">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                        aria-expanded={openFaq === i}
                      >
                        <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                            openFaq === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Links</h3>
                  <ul className="space-y-2.5">
                    {[
                      { href: "/submit-base", icon: Star, label: "Submit a Base Layout" },
                      { href: "/blog", icon: MessageSquare, label: "Read the Strategy Blog" },
                      { href: "/privacy-policy", icon: Shield, label: "Privacy Policy" },
                      { href: "/dmca", icon: Bug, label: "DMCA / Copyright" },
                    ].map(({ href, icon: Icon, label }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary font-medium transition-colors group"
                        >
                          <Icon className="w-3.5 h-3.5 text-amber-500 group-hover:text-primary shrink-0" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Community CTA Banner ── */}
        <section className="bg-gradient-to-r from-[#1a1f2e] to-[#12181f] py-10 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-indigo-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-black text-xl mb-1">Join 50,000+ Clash Players</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get instant answers, share your best bases, and connect with top players in our Discord community.
              </p>
            </div>
            <a
              href="https://discord.gg/Z9jpQyKEdw"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-xl text-sm font-bold transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Join Discord
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
