import { Link } from "wouter";
import { Shield } from "lucide-react";

const GOLD = "#EB8D00";

const TH_LEVELS = Array.from({ length: 16 }, (_, i) => i + 3);

const BASE_TYPES = [
  "War",
  "Farming",
  "Hybrid",
  "Trophy",
  "Anti 3 Star",
  "Legend League",
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/dmca", label: "DMCA" },
  { href: "/contact", label: "Contact Us" },
];

const INFO_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/submit-base", label: "Submit a Base" },
];

/* ---------- Social Icons (inline SVG for Discord + Lucide-compatible shapes) ---------- */
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.3 4.4A19.7 19.7 0 0 0 15.5 3a.1.1 0 0 0-.1.1 13.7 13.7 0 0 0-.6 1.2 18.2 18.2 0 0 0-5.5 0A12.5 12.5 0 0 0 8.7 3a.1.1 0 0 0-.1.1 19.7 19.7 0 0 0-4.8 1.3A20.2 20.2 0 0 0 .4 18.1a19.8 19.8 0 0 0 6 3 .1.1 0 0 0 .1-.1 14 14 0 0 0 1.2-2 .1.1 0 0 0-.1-.1 13 13 0 0 1-1.9-.9.1.1 0 0 1 0-.2l.4-.3a.1.1 0 0 1 .1 0 14.1 14.1 0 0 0 12 0 .1.1 0 0 1 .1 0l.4.3a.1.1 0 0 1 0 .2 12.7 12.7 0 0 1-1.9.9.1.1 0 0 0-.1.1 15.6 15.6 0 0 0 1.2 2 .1.1 0 0 0 .1.1 19.7 19.7 0 0 0 6-3A20.2 20.2 0 0 0 20.3 4.4zM8 15.1c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.3 8 10.3s2.2 1.1 2.2 2.4S9.2 15.1 8 15.1zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://discord.gg/Z9jpQyKEdw",
    label: "Discord",
    Icon: DiscordIcon,
    color: "#5865F2",
  },
  {
    href: "https://x.com/ClashLayoutsHub",
    label: "X",
    Icon: XIcon,
    color: "#FFFFFF",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand — spans 2 cols on md */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg leading-none">
                ClashLayouts<span style={{ color: GOLD }}>Hub</span>
              </span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed mb-5">
              The most trusted source for Clash of Clans base layouts — tested,
              verified, and updated for the 2026 meta.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${color}25`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "")
                  }
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Browse — compact TH grid */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-widest text-white/40">
              Browse
            </h4>
            <div className="grid grid-cols-4 gap-1.5">
              {TH_LEVELS.map((th) => (
                <Link
                  key={th}
                  href={`/th/${th}`}
                  className="text-center py-1.5 rounded-lg text-xs font-bold transition-all text-white/60 hover:text-white bg-white/5 hover:bg-white/15"
                  style={{ borderBottom: `2px solid transparent` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderBottomColor = GOLD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderBottomColor = "transparent")
                  }
                >
                  {th}
                </Link>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-2">TH3 — TH18 layouts</p>
          </div>

          {/* Base Types */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-widest text-white/40">
              Base Types
            </h4>
            <ul className="space-y-2">
              {BASE_TYPES.map((type) => (
                <li key={type}>
                  <Link
                    href={`/?base_type=${encodeURIComponent(type)}`}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {type} Bases
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-widest text-white/40">
              Info
            </h4>
            <ul className="space-y-2">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-widest text-white/40">
              Legal
            </h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40 text-center sm:text-left">
              © {year} ClashLayoutsHub. All rights reserved. Not affiliated
              with Supercell.
            </p>
            <p className="text-xs text-white/25 text-center sm:text-right">
              Clash of Clans™ is a trademark of Supercell Oy. This site is not
              endorsed by or affiliated with Supercell.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
