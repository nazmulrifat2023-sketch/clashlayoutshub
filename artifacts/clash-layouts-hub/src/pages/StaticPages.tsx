import { Link } from "wouter";
import { Shield } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-black">About ClashLayoutsHub</h1>
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        <p>ClashLayoutsHub is the most trusted resource for Clash of Clans base layouts. We've been helping players dominate their wars, protect their resources, and climb the trophy ladder since 2024.</p>
        <p>Our community of dedicated Clash players tests and verifies every base layout before it's published. We use a health score system to automatically track which bases are still effective and which ones need updating.</p>
        <h2 className="text-foreground font-bold text-lg mt-6">Our Mission</h2>
        <p>To provide every Clash of Clans player — from beginners to Legend League veterans — with access to high-quality, tested base layouts for every Town Hall level.</p>
        <h2 className="text-foreground font-bold text-lg mt-6">Why ClashLayoutsHub?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Real community-tested bases with win rates</li>
          <li>Automatic broken link detection</li>
          <li>Real-time copy tracking so you know what's popular</li>
          <li>Multilingual support for English, Bengali, and Hindi players</li>
          <li>Free to use, always</li>
        </ul>
      </div>
    </div>
  );
}


export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-muted-foreground/20 mb-4">404</div>
      <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
