import { Link } from "wouter";
import { Shield, Lock, FileText, AlertTriangle, Cookie } from "lucide-react";

const EMAIL = "contact@clashlayoutshub.com";
const DOMAIN = "clashlayoutshub.com";
const SITE = "ClashLayoutsHub";

function LegalLayout({
  icon: Icon,
  color,
  title,
  updated,
  children,
}: {
  icon: typeof Shield;
  color: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{title}</h1>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {updated}</p>
        </div>
      </div>
      <div className="h-px w-full bg-border mb-8" />
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
      <div className="mt-10 p-4 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground">
        Questions? Email{" "}
        <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
        {" "}or visit our{" "}
        <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
      </div>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mt-7 mb-2">{children}</h2>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 pl-2">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

/* ──────────────────────────── PRIVACY POLICY ─── */
export function PrivacyPolicyPage() {
  return (
    <LegalLayout icon={Lock} color="#6366F1" title="Privacy Policy" updated="January 1, 2025">
      <p>{SITE} ("we," "us," or "our") operates {DOMAIN}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

      <H2>1. Information We Collect</H2>
      <Ul items={[
        "Account data: email address and display name when you create an account.",
        "Usage data: pages visited, time spent, base layouts viewed and copied.",
        "Device data: browser type, IP address, and operating system (via server logs).",
        "Cookie data: stored preferences, session tokens, and advertising consent status.",
      ]} />

      <H2>2. How We Use Your Information</H2>
      <Ul items={[
        "To provide and maintain our service, including personalizing your experience.",
        "To analyse site traffic and improve content relevance.",
        "To serve personalized advertisements via Google AdSense (only with your consent).",
        "To send transactional emails such as account creation confirmation.",
        "To detect and prevent fraudulent activity or policy violations.",
      ]} />

      <H2>3. Google AdSense & Google Consent Mode v2</H2>
      <p>We use Google AdSense to display advertisements. Google may use cookies and device identifiers to serve ads based on your prior visits. You can opt out via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a>.</p>
      <p>We implement Google Consent Mode v2. If you decline consent, ad_storage and analytics_storage are set to "denied" and no personalized data is sent to Google.</p>

      <H2>4. Cookies</H2>
      <p>We use essential cookies (required for the site to function), analytics cookies (with consent), and advertising cookies (with consent). See our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> for full details.</p>

      <H2>5. Third-Party Services</H2>
      <Ul items={[
        "Google Analytics — website traffic analysis (consent-gated).",
        "Google AdSense — contextual and personalized advertising (consent-gated).",
        "Supercell — Clash of Clans is owned by Supercell Oy; this site is not affiliated with them.",
      ]} />

      <H2>6. Data Retention</H2>
      <p>We retain account data while your account is active. Server logs are kept for up to 90 days. You may request data deletion by emailing {EMAIL}.</p>

      <H2>7. Your Rights (GDPR & CCPA)</H2>
      <p>If you are in the EEA, UK, or California, you have the right to access, correct, delete, or restrict processing of your personal data. Contact {EMAIL} — we respond within 30 days.</p>

      <H2>8. Children's Privacy</H2>
      <p>Our service is not directed to children under 13. We do not knowingly collect personal information from minors. Contact us immediately if you believe this has occurred.</p>

      <H2>9. Changes to This Policy</H2>
      <p>We may update this Privacy Policy periodically. Changes are posted here with a new revision date. Continued use constitutes acceptance.</p>
    </LegalLayout>
  );
}

/* ──────────────────────────── TERMS OF SERVICE ─── */
export function TermsPage() {
  return (
    <LegalLayout icon={FileText} color="#0EA5E9" title="Terms of Service" updated="January 1, 2025">
      <p>By accessing or using {SITE} at {DOMAIN}, you agree to these Terms of Service. If you do not agree, do not use our service.</p>

      <H2>1. Use of Service</H2>
      <p>{SITE} provides a library of Clash of Clans base layout links, blog content, and community tools. You agree to use the service only for lawful purposes that do not infringe the rights of others.</p>

      <H2>2. User Accounts</H2>
      <Ul items={[
        "You must provide accurate information when creating an account.",
        "You are responsible for maintaining the security of your account credentials.",
        "We reserve the right to terminate accounts that violate these terms.",
        "You must be at least 13 years old to create an account.",
      ]} />

      <H2>3. User Submissions</H2>
      <p>When you submit a base layout link, you confirm you have the right to share it and that it complies with Supercell's Fan Content Policy. We reserve the right to approve, reject, or remove any submission.</p>

      <H2>4. Intellectual Property</H2>
      <p>All original content on {SITE} — including blog posts, design, and code — is the property of {SITE} and protected by copyright. Clash of Clans game assets are the property of Supercell Oy. This is a fan site not affiliated with or endorsed by Supercell.</p>

      <H2>5. Prohibited Activities</H2>
      <Ul items={[
        "Automated scraping or data collection without written permission.",
        "Submitting malicious, spam, or misleading base layout links.",
        "Attempting to breach or circumvent site security measures.",
        "Impersonating other users, administrators, or Supercell.",
        "Uploading content that infringes copyrights or trademarks.",
      ]} />

      <H2>6. Disclaimer of Warranties</H2>
      <p>The service is provided "as is" without warranties of any kind. We do not guarantee that base layouts will work in all situations or that the site will be continuously available.</p>

      <H2>7. Limitation of Liability</H2>
      <p>To the maximum extent permitted by law, {SITE} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>

      <H2>8. Governing Law</H2>
      <p>These Terms are governed by applicable law without regard to conflict of law provisions.</p>

      <H2>9. Changes to Terms</H2>
      <p>We may revise these Terms at any time. Continued use after changes constitutes acceptance of the revised Terms.</p>
    </LegalLayout>
  );
}

/* ──────────────────────────── COOKIE POLICY ─── */
export function CookiePolicyPage() {
  return (
    <LegalLayout icon={Cookie} color="#D4AF37" title="Cookie Policy" updated="January 1, 2025">
      <p>This Cookie Policy explains how {SITE} uses cookies and similar technologies on {DOMAIN}. By using our site you agree to cookies as described here.</p>

      <H2>1. What Are Cookies?</H2>
      <p>Cookies are small text files stored on your device when you visit a website. They allow the site to remember your preferences and actions over a period of time.</p>

      <H2>2. Strictly Necessary Cookies</H2>
      <p>These cookies are essential for the website to function and cannot be disabled.</p>
      <Ul items={[
        "Session authentication token — keeps you securely logged in.",
        "Consent preference record — stores your cookie consent choice for 180 days.",
        "CSRF protection token — prevents cross-site request forgery attacks.",
      ]} />

      <H2>3. Analytics Cookies (Consent Required)</H2>
      <Ul items={[
        "Google Analytics (_ga, _gid, _gat) — tracks page views, session duration, and traffic sources.",
        "Only activated when you click 'Accept All' on the consent banner.",
      ]} />

      <H2>4. Advertising Cookies (Consent Required)</H2>
      <Ul items={[
        "Google AdSense (IDE, DSID, test_cookie) — serves personalized advertisements.",
        "Only activated when you click 'Accept All' on the consent banner.",
      ]} />

      <H2>5. Managing Your Preferences</H2>
      <Ul items={[
        "Use the Cookie Preferences banner (appears on first visit) to accept or reject non-essential cookies.",
        "Clear browser localStorage and cookies to reset consent at any time.",
        "Adjust browser settings to block or delete cookies globally.",
        "Opt out of Google advertising at https://adssettings.google.com.",
      ]} />

      <H2>6. Consent Expiry</H2>
      <p>Your consent is stored locally for 180 days. After this period, the banner reappears to request fresh consent in compliance with GDPR requirements.</p>

      <H2>7. Third-Party Cookies</H2>
      <p>Third-party services such as Google may independently set their own cookies. We have no control over these. Please refer to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a> for details.</p>
    </LegalLayout>
  );
}

/* ──────────────────────────── DMCA ─── */
export function DmcaPage() {
  return (
    <LegalLayout icon={AlertTriangle} color="#EF4444" title="DMCA Policy" updated="January 1, 2025">
      <p>{SITE} respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe content on this site infringes your copyright, follow the procedure below.</p>

      <H2>1. Filing a Takedown Notice</H2>
      <p>Send a written DMCA notice to <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a> with subject "DMCA Takedown Request" including:</p>
      <Ul items={[
        "Your full legal name and contact information (email, address, phone).",
        "A description of the copyrighted work you claim has been infringed.",
        "The URL(s) on our site where the allegedly infringing content appears.",
        "A good faith statement that you believe the use is unauthorized.",
        "A statement under penalty of perjury that you are the rights owner or authorized agent.",
        "Your physical or electronic signature.",
      ]} />

      <H2>2. Our Response</H2>
      <p>Upon receipt of a valid DMCA notice, we will investigate and, if appropriate, promptly remove or disable access to the allegedly infringing content. We will notify the relevant user who may then file a counter-notice.</p>

      <H2>3. Counter-Notice</H2>
      <p>If your content was removed and you believe this was a mistake, you may file a counter-notice to the same email address, including your contact details, identification of the removed content, a good faith statement, and your signature.</p>

      <H2>4. Repeat Infringers</H2>
      <p>It is our policy to terminate accounts of users who are found to be repeat infringers of intellectual property rights in accordance with the DMCA.</p>

      <H2>5. Supercell Fan Content</H2>
      <p>{SITE} is an independent fan site for Clash of Clans. All game content belongs to Supercell Oy. We operate under Supercell's Fan Content Policy. If any content violates Supercell's rights, notify us and we will address it promptly.</p>

      <H2>6. Disclaimer</H2>
      <p>This page is informational only and does not constitute legal advice. For complex copyright matters, please consult a qualified attorney.</p>
    </LegalLayout>
  );
}
