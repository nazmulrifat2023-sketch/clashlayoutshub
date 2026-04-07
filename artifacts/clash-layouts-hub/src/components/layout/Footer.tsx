import { Link } from "wouter";
import { Shield, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                ClashLayouts<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              The most trusted source for Clash of Clans base layouts. Find, copy, and share the best bases for every Town Hall level.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/40">Browse</h4>
            <ul className="space-y-2 text-sm">
              {[3,6,9,12,15,18].map(th => (
                <li key={th}>
                  <Link href={`/th/${th}`} className="text-white/60 hover:text-primary transition-colors">
                    TH{th} Bases
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Base Types */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/40">Base Types</h4>
            <ul className="space-y-2 text-sm">
              {["War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Legend League"].map(type => (
                <li key={type}>
                  <Link href={`/?base_type=${encodeURIComponent(type)}`} className="text-white/60 hover:text-primary transition-colors">
                    {type} Bases
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/40">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-white/60 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-white/60 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/submit-base" className="text-white/60 hover:text-primary transition-colors">Submit a Base</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-primary transition-colors">Contact</Link></li>
              <li>
                <a href="https://discord.gg/clashoflayouts" target="_blank" rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                  Discord Community <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {new Date().getFullYear()} ClashLayoutsHub. Not affiliated with Supercell.
          </p>
          <p className="text-xs text-white/30">
            Clash of Clans is a trademark of Supercell Oy.
          </p>
        </div>
      </div>
    </footer>
  );
}
