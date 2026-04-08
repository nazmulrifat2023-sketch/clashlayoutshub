import { Link } from "wouter";
import { Shield, Lock, FileText, AlertTriangle, Cookie, ChevronRight, Mail } from "lucide-react";

const EMAIL = "contact@clashlayoutshub.com";
const DOMAIN = "clashlayoutshub.com";
const SITE = "ClashLayoutsHub";
const UPDATED = "April 7, 2026";
const GOLD = "#EB8D00";

/* ─── Shared layout ─── */
function LegalLayout({
  icon: Icon,
  color,
  title,
  subtitle,
  updated,
  toc,
  children,
}: {
  icon: typeof Shield;
  color: string;
  title: string;
  subtitle: string;
  updated: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-20">
      {/* Header */}
      <div className="flex items-start gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: <time dateTime={updated}>{updated}</time>
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-border mt-6 mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents — sidebar on desktop, compact card on mobile */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-border p-4 lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              On This Page
            </p>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary
                             transition-colors py-1 rounded group"
                >
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact card */}
          <div className="mt-4 bg-white rounded-2xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Questions?
            </p>
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color }}>
              <Mail className="w-4 h-4" />
              {EMAIL}
            </a>
            <Link href="/contact"
              className="mt-2 block text-xs text-muted-foreground hover:text-primary transition-colors">
              Or use our contact form →
            </Link>
          </div>
        </aside>

        {/* Body */}
        <article className="flex-1 min-w-0 space-y-2 text-sm text-muted-foreground leading-relaxed">
          {children}

          {/* Legal links footer */}
          <div className="pt-6 mt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Related Policies</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/cookie-policy", label: "Cookie Policy" },
                { href: "/dmca", label: "DMCA Policy" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted
                             transition-colors text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

/* Shared sub-components */
function Section({ id, num, title, children }: {
  id: string; num: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="flex items-baseline gap-2 text-base font-black text-foreground mt-8 mb-3">
        <span className="text-xs font-bold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed">{children}</p>;
}

function Ul({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 text-xs leading-relaxed">
      {children}
    </div>
  );
}

/* ═══════════════════════════════════ PRIVACY POLICY ═══ */
export function PrivacyPolicyPage() {
  const toc = [
    { id: "overview", label: "Overview" },
    { id: "collect", label: "1. Information We Collect" },
    { id: "use", label: "2. How We Use Your Data" },
    { id: "adsense", label: "3. Google AdSense & Consent" },
    { id: "cookies", label: "4. Cookies" },
    { id: "third-party", label: "5. Third-Party Services" },
    { id: "retention", label: "6. Data Retention" },
    { id: "rights", label: "7. Your Rights (GDPR/CCPA)" },
    { id: "children", label: "8. Children's Privacy" },
    { id: "security", label: "9. Data Security" },
    { id: "transfers", label: "10. International Transfers" },
    { id: "changes-pp", label: "11. Policy Changes" },
  ];

  return (
    <LegalLayout icon={Lock} color="#6366F1" title="Privacy Policy"
      subtitle="How ClashLayoutsHub collects, uses, and protects your personal information."
      updated={UPDATED} toc={toc}>

      <section id="overview" className="scroll-mt-6">
        <InfoBox>
          <strong className="text-foreground">{SITE}</strong> ("we," "us," or "our") operates{" "}
          <strong>{DOMAIN}</strong>. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website. Please read this policy carefully. If
          you disagree with its terms, please discontinue use of the site.
        </InfoBox>
      </section>

      <Section id="collect" num="§1" title="Information We Collect">
        <P>We collect the following categories of information:</P>
        <h3 className="text-sm font-bold text-foreground mt-3 mb-1">A. Information You Provide Directly</h3>
        <Ul items={[
          "Account registration data: email address, username, and password hash.",
          "Base submission data: Clash of Clans share links, screenshots, and descriptions you submit.",
          "Contact form messages: your name, email, and message content.",
          "Comments and ratings: any text reviews or star ratings you leave on base layouts.",
        ]} />
        <h3 className="text-sm font-bold text-foreground mt-3 mb-1">B. Information Collected Automatically</h3>
        <Ul items={[
          "Log data: IP address, browser type and version, operating system, referring URL, pages visited, and timestamps.",
          "Device identifiers: unique identifiers sent by your browser for analytics and ad targeting (with consent).",
          "Usage data: base layouts viewed, copied, and rated; search queries; time spent on pages.",
          "Cookie data: stored preferences, session tokens, consent records — see Section 4.",
        ]} />
        <h3 className="text-sm font-bold text-foreground mt-3 mb-1">C. Information from Third Parties</h3>
        <Ul items={[
          "Google Analytics: aggregated traffic and behavior data (consent-gated).",
          "Google AdSense: advertising interaction data (consent-gated).",
        ]} />
      </Section>

      <Section id="use" num="§2" title="How We Use Your Information">
        <P>We use collected information for the following lawful purposes:</P>
        <Ul items={[
          "Service operation: to create and manage your account, authenticate sessions, and display content.",
          "Personalization: to remember your TH level preferences and recently viewed bases.",
          "Analytics: to understand which content is valuable and improve the site experience.",
          "Advertising: to serve contextual and (with consent) personalized ads via Google AdSense.",
          "Communications: to send account-related emails such as password resets and submission status updates.",
          "Security: to detect, investigate, and prevent fraud, spam submissions, and policy violations.",
          "Legal compliance: to respond to legal requests and enforce our Terms of Service.",
        ]} />
        <P>
          Our legal basis for processing under GDPR is: (a) contract performance for account management;
          (b) legitimate interests for analytics and security; (c) consent for advertising and optional analytics.
        </P>
      </Section>

      <Section id="adsense" num="§3" title="Google AdSense & Google Consent Mode v2">
        <P>
          {SITE} uses Google AdSense to display advertisements. Google may use cookies, device
          identifiers, and browsing data to serve ads based on your interests and prior visits to
          this or other websites.
        </P>
        <P>
          We implement <strong className="text-foreground">Google Consent Mode v2</strong>. When you
          decline consent via our cookie banner, <code className="text-xs bg-muted px-1 rounded">ad_storage</code>,{" "}
          <code className="text-xs bg-muted px-1 rounded">analytics_storage</code>, and{" "}
          <code className="text-xs bg-muted px-1 rounded">personalization_storage</code> are set to{" "}
          <code className="text-xs bg-muted px-1 rounded">"denied"</code>. No personally identifiable
          data is sent to Google in this case. Only non-personalized ads may be shown.
        </P>
        <Ul items={[
          <>Opt out of personalized ads: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">adssettings.google.com</a></>,
          <>Google's Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></>,
          "You can withdraw consent at any time by clearing your browser localStorage and cookies.",
        ]} />
      </Section>

      <Section id="cookies" num="§4" title="Cookies">
        <P>
          We use cookies and similar localStorage entries. See our full{" "}
          <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>{" "}
          for a complete list of cookies, their purpose, and duration. In summary:
        </P>
        <Ul items={[
          "Strictly necessary cookies: session authentication and CSRF protection — always active.",
          "Preference cookies: language and consent status — always active.",
          "Analytics cookies (Google Analytics): only active after you click 'Accept All'.",
          "Advertising cookies (Google AdSense): only active after you click 'Accept All'.",
        ]} />
      </Section>

      <Section id="third-party" num="§5" title="Third-Party Services">
        <P>We share data with the following third parties as needed to operate the service:</P>
        <Ul items={[
          "Google LLC (Analytics, AdSense) — United States. Governed by Google's Privacy Policy and EU Standard Contractual Clauses.",
          "Replit Inc. (hosting infrastructure) — United States. Processes server request data under their DPA.",
          "Supercell Oy — Clash of Clans is their property. Layout links open the official Clash of Clans app. We are not affiliated with or endorsed by Supercell.",
        ]} />
        <P>We do not sell, trade, or rent your personal data to third parties for marketing purposes.</P>
      </Section>

      <Section id="retention" num="§6" title="Data Retention">
        <Ul items={[
          "Account data: retained while your account is active. Deleted within 30 days of account closure request.",
          "Server logs: retained for 90 days then automatically purged.",
          "Analytics data: retained per Google Analytics' default retention period (up to 26 months).",
          "Consent records: retained for 180 days to comply with GDPR accountability requirements.",
          "Base submissions: retained indefinitely unless you request removal or the content violates our policies.",
        ]} />
        <P>To request deletion of your data, email <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>. We respond within 30 days.</P>
      </Section>

      <Section id="rights" num="§7" title="Your Rights (GDPR & CCPA)">
        <P>Depending on your jurisdiction, you have the following rights regarding your personal data:</P>
        <Ul items={[
          "Right to access: request a copy of all personal data we hold about you.",
          "Right to rectification: request correction of inaccurate or incomplete data.",
          "Right to erasure ('right to be forgotten'): request deletion of your personal data.",
          "Right to restriction: request that we limit how we process your data.",
          "Right to data portability: receive your data in a structured, machine-readable format.",
          "Right to object: object to processing based on legitimate interests or for direct marketing.",
          "Right to withdraw consent: withdraw consent for analytics and advertising at any time without affecting prior processing.",
          "CCPA rights (California residents): right to know, right to delete, right to opt out of sale (we do not sell data).",
        ]} />
        <P>
          To exercise any right, contact us at <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>.
          We will respond within 30 days. If you are unsatisfied, you may lodge a complaint with your
          national data protection authority (e.g., the ICO in the UK, or the supervisory authority in your EU member state).
        </P>
      </Section>

      <Section id="children" num="§8" title="Children's Privacy">
        <P>
          {SITE} is not directed to children under the age of 13 (or 16 in the EEA). We do not
          knowingly collect personal information from minors. If you believe a child has provided us
          with personal data without parental consent, contact us immediately at{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a> and we
          will delete that information as soon as possible.
        </P>
      </Section>

      <Section id="security" num="§9" title="Data Security">
        <P>
          We implement industry-standard security measures including HTTPS encryption in transit,
          hashed passwords using bcrypt, JWT-based session management with expiry, and server-side
          input validation. No method of electronic transmission is 100% secure; we cannot guarantee
          absolute security but commit to prompt notification in the event of a breach affecting your data.
        </P>
      </Section>

      <Section id="transfers" num="§10" title="International Data Transfers">
        <P>
          {SITE} is hosted in the United States. If you access the site from the EEA, UK, or other
          regions with data protection laws, your data may be transferred to and processed in countries
          where different data protection standards apply. We rely on Standard Contractual Clauses (SCCs)
          approved by the European Commission where applicable.
        </P>
      </Section>

      <Section id="changes-pp" num="§11" title="Changes to This Privacy Policy">
        <P>
          We may update this Privacy Policy periodically to reflect changes in our practices, technology,
          legal requirements, or other factors. When we do, we update the "Last Updated" date at the top
          of this page. Material changes will be communicated via a notice on the homepage for 30 days.
          Continued use of the site after changes constitutes your acceptance of the updated policy.
        </P>
      </Section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════ TERMS OF SERVICE ═══ */
export function TermsPage() {
  const toc = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "description", label: "2. Service Description" },
    { id: "accounts", label: "3. User Accounts" },
    { id: "submissions", label: "4. User Submissions" },
    { id: "ip", label: "5. Intellectual Property" },
    { id: "prohibited", label: "6. Prohibited Activities" },
    { id: "disclaimer", label: "7. Disclaimer of Warranties" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "indemnification", label: "9. Indemnification" },
    { id: "termination", label: "10. Termination" },
    { id: "disputes", label: "11. Dispute Resolution" },
    { id: "governing", label: "12. Governing Law" },
    { id: "changes-tos", label: "13. Changes to Terms" },
  ];

  return (
    <LegalLayout icon={FileText} color="#0EA5E9" title="Terms of Service"
      subtitle="The rules and conditions that govern your use of ClashLayoutsHub."
      updated={UPDATED} toc={toc}>

      <Section id="acceptance" num="§1" title="Acceptance of Terms">
        <P>
          By accessing or using {SITE} at <strong>{DOMAIN}</strong>, you confirm that you are at least
          13 years of age and that you have read, understood, and agree to be bound by these Terms of
          Service and our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          If you do not agree with any part of these terms, you must not use our service.
        </P>
      </Section>

      <Section id="description" num="§2" title="Service Description">
        <P>
          {SITE} is a free community platform that provides a curated library of Clash of Clans base
          layout share links, strategy blog content, a base submission system, and community tools
          including ratings and copy-tracking. We are an independent fan site and are not affiliated
          with, endorsed by, or sponsored by Supercell Oy, the developer of Clash of Clans.
        </P>
        <P>
          We reserve the right to modify, suspend, or discontinue any part of the service at any time
          with or without notice. We are not liable to you or any third party for any modification,
          suspension, or discontinuation.
        </P>
      </Section>

      <Section id="accounts" num="§3" title="User Accounts">
        <Ul items={[
          "You must provide accurate, current, and complete information when registering an account.",
          "You are solely responsible for maintaining the confidentiality of your login credentials.",
          "You are responsible for all activities that occur under your account.",
          "You must notify us immediately of any unauthorized access at " + EMAIL + ".",
          "You must be at least 13 years old (or 16 in the EEA) to create an account.",
          "You may not create accounts for others without their explicit permission.",
          "We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.",
        ]} />
      </Section>

      <Section id="submissions" num="§4" title="User Submissions">
        <P>
          When you submit a base layout link, blog comment, or any other content ("Submission"), you
          represent and warrant that:
        </P>
        <Ul items={[
          "You have the right to share the content and it does not violate any third party's rights.",
          "The Clash of Clans share link is genuine, functional, and accurately described.",
          "The submission complies with Supercell's Fan Content Policy.",
          "The content does not contain malware, phishing links, or deceptive URLs.",
          "You grant us a non-exclusive, royalty-free, worldwide licence to display and distribute the submission on our platform.",
        ]} />
        <P>
          We reserve the right to approve, reject, edit, or remove any Submission at any time without
          prior notice or liability. Approved submissions may be edited by our editorial team for
          grammar, clarity, or policy compliance.
        </P>
      </Section>

      <Section id="ip" num="§5" title="Intellectual Property">
        <P>
          All original content on {SITE} — including but not limited to blog articles, page text,
          design elements, UI components, and code — is the intellectual property of {SITE} and
          protected by applicable copyright, trademark, and other intellectual property laws.
        </P>
        <P>
          Clash of Clans, the Clash of Clans logo, and all in-game assets are the exclusive property
          of Supercell Oy. We use these for fan commentary and reference purposes under Supercell's
          Fan Content Policy. This site is not affiliated with or endorsed by Supercell.
        </P>
        <P>
          You may not reproduce, distribute, or create derivative works of our original content without
          our express written permission.
        </P>
      </Section>

      <Section id="prohibited" num="§6" title="Prohibited Activities">
        <P>You agree not to engage in any of the following:</P>
        <Ul items={[
          "Automated scraping, crawling, or data harvesting of our site without written permission.",
          "Submitting spam, duplicate, broken, or deliberately misleading base layout links.",
          "Attempting to gain unauthorized access to any part of our systems or another user's account.",
          "Distributing malware, viruses, or any code designed to harm the site or its users.",
          "Impersonating ClashLayoutsHub staff, other users, or Supercell employees.",
          "Using the service to infringe any patent, trademark, trade secret, copyright, or other intellectual property right.",
          "Engaging in any conduct that restricts or inhibits anyone's use or enjoyment of the service.",
          "Artificially inflating copy counts, views, or ratings through scripts or repeated manual actions.",
          "Posting content that is defamatory, obscene, threatening, or otherwise objectionable.",
        ]} />
      </Section>

      <Section id="disclaimer" num="§7" title="Disclaimer of Warranties">
        <P>
          THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY
          KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT
          THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </P>
        <P>
          We make no guarantees that any base layout will perform as described, remain functional after
          Clash of Clans updates, or result in any particular in-game outcome.
        </P>
      </Section>

      <Section id="liability" num="§8" title="Limitation of Liability">
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {SITE.toUpperCase()} AND ITS OPERATORS,
          DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL —
          ARISING OUT OF OR RELATED TO YOUR USE OF, OR INABILITY TO USE, THE SERVICE, EVEN IF WE HAVE
          BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </P>
        <P>
          Our total aggregate liability for any claims relating to the service shall not exceed the
          greater of USD $10 or the amount you paid us in the twelve months preceding the claim.
        </P>
      </Section>

      <Section id="indemnification" num="§9" title="Indemnification">
        <P>
          You agree to defend, indemnify, and hold harmless {SITE} and its operators from and against
          any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees
          (including reasonable legal fees) arising out of or relating to your violation of these Terms
          or your use of the service, including any content you submit, post, or transmit.
        </P>
      </Section>

      <Section id="termination" num="§10" title="Termination">
        <P>
          We may terminate or suspend your account and access to the service immediately, without prior
          notice or liability, for any reason, including if you breach these Terms. Upon termination,
          your right to use the service ceases immediately. Sections 5, 7, 8, and 9 survive termination.
        </P>
        <P>
          You may delete your account at any time by contacting us at{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>.
        </P>
      </Section>

      <Section id="disputes" num="§11" title="Dispute Resolution">
        <P>
          Before filing a formal dispute, you agree to first contact us at {EMAIL} and attempt to
          resolve the matter informally. If we cannot reach an informal resolution within 30 days,
          either party may pursue formal remedies as described below.
        </P>
        <P>
          Any dispute arising out of or relating to these Terms shall first be subject to non-binding
          mediation. Class action lawsuits and class-wide arbitration are not permitted to the extent
          allowed by applicable law.
        </P>
      </Section>

      <Section id="governing" num="§12" title="Governing Law">
        <P>
          These Terms are governed by and construed in accordance with applicable law. For users in
          the European Union, mandatory consumer protection laws of your country of residence apply
          regardless of any choice-of-law provision.
        </P>
      </Section>

      <Section id="changes-tos" num="§13" title="Changes to Terms">
        <P>
          We reserve the right to modify these Terms at any time. We will update the "Last Updated"
          date and, for material changes, provide 30 days' notice on the homepage. Your continued use
          of the service after the effective date of any changes constitutes acceptance of the new Terms.
        </P>
      </Section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════ COOKIE POLICY ═══ */
export function CookiePolicyPage() {
  const toc = [
    { id: "what", label: "1. What Are Cookies?" },
    { id: "necessary", label: "2. Strictly Necessary Cookies" },
    { id: "analytics", label: "3. Analytics Cookies" },
    { id: "advertising", label: "4. Advertising Cookies" },
    { id: "managing", label: "5. Managing Preferences" },
    { id: "expiry", label: "6. Consent Expiry" },
    { id: "third-party-cookies", label: "7. Third-Party Cookies" },
    { id: "changes-cp", label: "8. Policy Updates" },
  ];

  return (
    <LegalLayout icon={Cookie} color={GOLD} title="Cookie Policy"
      subtitle="What cookies ClashLayoutsHub uses, why, and how to control them."
      updated={UPDATED} toc={toc}>

      <InfoBox>
        This Cookie Policy explains how <strong className="text-foreground">{SITE}</strong> uses cookies
        and similar browser storage technologies on <strong>{DOMAIN}</strong>. By clicking "Accept All"
        on our consent banner, you agree to the use of non-essential cookies. You may withdraw consent
        at any time by clearing browser storage and cookies.
      </InfoBox>

      <Section id="what" num="§1" title="What Are Cookies?">
        <P>
          Cookies are small text files placed on your device by websites you visit. They are widely used
          to make websites work efficiently and to provide information to site owners. {SITE} also uses
          browser <code className="text-xs bg-muted px-1 rounded">localStorage</code> entries to store
          your consent record and preferences, which function similarly to cookies but are not transmitted
          with HTTP requests.
        </P>
      </Section>

      <Section id="necessary" num="§2" title="Strictly Necessary Cookies">
        <P>
          These cookies are essential for the website to function correctly. They cannot be disabled.
          No consent is required for their use.
        </P>
        <div className="overflow-x-auto rounded-xl border border-border mt-3">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                {["Name / Key", "Purpose", "Duration", "Type"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["clh_token", "JWT user authentication session", "30 days", "localStorage"],
                ["clh_user", "Cached user profile data", "Session", "localStorage"],
                ["clh_consent", "Stores your cookie consent decision", "180 days", "localStorage"],
                ["admin_token", "Admin panel authentication", "Session", "localStorage"],
                ["XSRF-TOKEN", "CSRF attack prevention", "Session", "Cookie"],
              ].map(([name, purpose, duration, type]) => (
                <tr key={name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-foreground">{name}</td>
                  <td className="px-3 py-2">{purpose}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{duration}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="analytics" num="§3" title="Analytics Cookies (Consent Required)">
        <P>
          These cookies are only activated when you click <strong className="text-foreground">"Accept All"</strong>{" "}
          on the consent banner. They help us understand how visitors interact with our site so we can
          improve content and user experience.
        </P>
        <div className="overflow-x-auto rounded-xl border border-border mt-3">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                {["Name", "Provider", "Purpose", "Duration"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["_ga", "Google Analytics", "Distinguishes unique visitors", "2 years"],
                ["_gid", "Google Analytics", "Identifies session", "24 hours"],
                ["_gat", "Google Analytics", "Rate-limits tracking requests", "1 minute"],
              ].map(([name, provider, purpose, duration]) => (
                <tr key={name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-foreground">{name}</td>
                  <td className="px-3 py-2">{provider}</td>
                  <td className="px-3 py-2">{purpose}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="advertising" num="§4" title="Advertising Cookies (Consent Required)">
        <P>
          These cookies are only activated when you click <strong className="text-foreground">"Accept All"</strong>.
          They are used by Google AdSense to serve personalized advertisements based on your interests.
          If you decline consent, only non-personalized ads may be shown (or no ads at all, depending
          on your region).
        </P>
        <div className="overflow-x-auto rounded-xl border border-border mt-3">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                {["Name", "Provider", "Purpose", "Duration"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["IDE", "Google (doubleclick.net)", "Personalized ad targeting", "13 months"],
                ["DSID", "Google", "User identification for ad targeting", "2 weeks"],
                ["test_cookie", "Google", "Checks if browser accepts cookies", "Session"],
                ["NID", "Google", "Ad preference and session ID", "6 months"],
              ].map(([name, provider, purpose, duration]) => (
                <tr key={name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-foreground">{name}</td>
                  <td className="px-3 py-2">{provider}</td>
                  <td className="px-3 py-2">{purpose}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="managing" num="§5" title="Managing Your Cookie Preferences">
        <P>You have several ways to manage or withdraw your cookie consent:</P>
        <Ul items={[
          <>Use our <strong className="text-foreground">Cookie Preferences banner</strong> — it appears on your first visit and can be recalled by clearing your localStorage.</>,
          "Clear your browser's cookies and localStorage to reset all preferences. The consent banner will reappear on your next visit.",
          <>Adjust your browser settings to block all cookies. Note: disabling strictly necessary cookies will break site functionality.</>,
          <>Opt out of Google personalized advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">adssettings.google.com</a>.</>,
          <>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a> to prevent Google Analytics from collecting your data.</>,
        ]} />
      </Section>

      <Section id="expiry" num="§6" title="Consent Expiry & Renewal">
        <P>
          Your cookie consent is stored in <code className="text-xs bg-muted px-1 rounded">localStorage</code>{" "}
          for <strong className="text-foreground">180 days</strong>. After this period, the consent
          banner automatically reappears to request fresh consent, in line with GDPR accountability
          requirements and Google's Consent Mode v2 specifications.
        </P>
      </Section>

      <Section id="third-party-cookies" num="§7" title="Third-Party Cookies">
        <P>
          Some content and features on our site may be delivered by third parties who set their own
          cookies independently. We have no direct control over these cookies. The main third-party
          cookie providers you may encounter on {SITE} are:
        </P>
        <Ul items={[
          <>Google LLC — Analytics and advertising. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.</>,
          "Replit Inc. — Infrastructure provider. May set technical session cookies for load balancing.",
        ]} />
      </Section>

      <Section id="changes-cp" num="§8" title="Updates to This Cookie Policy">
        <P>
          We may update this Cookie Policy when we add new features, third-party services, or in response
          to changes in applicable law. The "Last Updated" date at the top reflects the most recent
          revision. We encourage you to review this page periodically.
        </P>
      </Section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════ DMCA ═══ */
export function DmcaPage() {
  const toc = [
    { id: "overview-dmca", label: "Overview" },
    { id: "notice", label: "1. Filing a Takedown Notice" },
    { id: "requirements", label: "2. Notice Requirements" },
    { id: "response", label: "3. Our Response Process" },
    { id: "counter", label: "4. Counter-Notice Procedure" },
    { id: "repeat", label: "5. Repeat Infringers" },
    { id: "supercell", label: "6. Supercell Fan Content" },
    { id: "no-legal", label: "7. Disclaimer" },
  ];

  return (
    <LegalLayout icon={AlertTriangle} color="#EF4444" title="DMCA Policy"
      subtitle="How to report copyright infringement and what happens after you do."
      updated={UPDATED} toc={toc}>

      <section id="overview-dmca" className="scroll-mt-6">
        <InfoBox>
          <strong className="text-foreground">{SITE}</strong> respects intellectual property rights
          and complies with the Digital Millennium Copyright Act (17 U.S.C. § 512) and equivalent
          copyright laws in other jurisdictions. If you believe content on this site infringes your
          copyright, please follow the procedure outlined below.
        </InfoBox>
      </section>

      <Section id="notice" num="§1" title="Filing a Takedown Notice">
        <P>
          Send your written DMCA takedown notice to our designated copyright agent via email:
        </P>
        <div className="bg-white rounded-xl border border-border p-4 text-sm my-3">
          <p className="font-bold text-foreground mb-1">DMCA Agent — {SITE}</p>
          <p>Email: <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a></p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use subject line: <strong>"DMCA Takedown Request — [URL of content]"</strong>
          </p>
        </div>
        <P>
          We typically acknowledge valid notices within <strong className="text-foreground">2 business days</strong>{" "}
          and action them within <strong className="text-foreground">10 business days</strong> of receipt.
        </P>
      </Section>

      <Section id="requirements" num="§2" title="Notice Requirements">
        <P>
          To be valid under the DMCA (17 U.S.C. § 512(c)(3)), your notice must include ALL of the following:
        </P>
        <Ul items={[
          "Your full legal name, mailing address, telephone number, and email address.",
          "A description of the copyrighted work you claim has been infringed. If multiple works are at issue, provide a representative list.",
          "The exact URL(s) on our site where the allegedly infringing content appears (not just the domain — the specific page URL).",
          "A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.",
          <>A statement made under penalty of perjury that the information in the notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</>,
          "Your physical or electronic signature.",
        ]} />
        <P>
          Notices that are materially incomplete, factually incorrect, or submitted in bad faith may be
          disregarded. Knowingly submitting a false DMCA notice may expose you to liability under
          17 U.S.C. § 512(f).
        </P>
      </Section>

      <Section id="response" num="§3" title="Our Response Process">
        <P>Upon receipt of a compliant DMCA notice, we will:</P>
        <Ul items={[
          "Acknowledge receipt within 2 business days via email.",
          "Review the notice to confirm it meets the requirements of 17 U.S.C. § 512(c)(3).",
          "If valid, promptly remove or disable access to the allegedly infringing content.",
          "Notify the user who submitted the content that their submission has been removed and why.",
          "Provide the user with information about the counter-notice procedure.",
          "Record the takedown as required by our repeat infringer policy.",
        ]} />
        <P>
          We may reach out for additional information if the notice is unclear or incomplete before
          taking action. Incomplete notices may delay processing.
        </P>
      </Section>

      <Section id="counter" num="§4" title="Counter-Notice Procedure">
        <P>
          If you are a user whose content was removed and you believe the removal was a mistake or
          misidentification, you may file a counter-notice under 17 U.S.C. § 512(g)(3). Your
          counter-notice must include:
        </P>
        <Ul items={[
          "Your full legal name, address, telephone number, and email address.",
          "Identification of the material that was removed and the URL where it appeared before removal.",
          "A statement under penalty of perjury that you have a good faith belief the material was removed due to mistake or misidentification.",
          "A statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or any judicial district if outside the U.S.).",
          "A statement that you will accept service of process from the person who filed the original DMCA notice.",
          "Your physical or electronic signature.",
        ]} />
        <P>
          Upon receipt of a valid counter-notice, we will provide a copy to the original complainant
          and may restore the content within 10–14 business days unless the complainant files a court
          action to restrain the restoration.
        </P>
      </Section>

      <Section id="repeat" num="§5" title="Repeat Infringer Policy">
        <P>
          In accordance with the DMCA and our commitment to protecting intellectual property, it is
          the policy of {SITE} to terminate, in appropriate circumstances, the accounts of users who
          are repeat infringers. We define a "repeat infringer" as any user who has received two or more
          valid DMCA takedown notices within a 12-month period.
        </P>
        <P>
          We track DMCA notices and maintain records of removed content. Users whose accounts are
          terminated for repeat infringement will not be permitted to re-register.
        </P>
      </Section>

      <Section id="supercell" num="§6" title="Supercell Fan Content">
        <P>
          {SITE} is an independent fan site for Clash of Clans. All Clash of Clans game assets,
          including but not limited to game graphics, characters, building designs, and the Clash of
          Clans name and logo, are the exclusive intellectual property of Supercell Oy.
        </P>
        <P>
          We operate under Supercell's Fan Content Policy, which permits fan-created content for
          non-commercial, informational purposes. We do not claim ownership of any Supercell assets.
          If you believe any content on this site violates Supercell's rights, please notify us and
          we will address it promptly.
        </P>
        <P>
          Supercell's Fan Content Policy is available at:{" "}
          <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline">
            supercell.com/en/fan-content-policy
          </a>
        </P>
      </Section>

      <Section id="no-legal" num="§7" title="Disclaimer">
        <P>
          This DMCA Policy is provided for informational purposes only and does not constitute legal
          advice. The information on this page reflects our good-faith interpretation of the DMCA and
          related laws. For complex copyright matters, we strongly recommend consulting a qualified
          intellectual property attorney.
        </P>
      </Section>
    </LegalLayout>
  );
}
