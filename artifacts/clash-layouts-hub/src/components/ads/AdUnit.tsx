import { useLocation } from "wouter";

interface AdUnitProps {
  slot?: string;
  className?: string;
}

const EXCLUDED_PATHS = [
  "/admin",
  "/login",
  "/signup",
  "/privacy-policy",
  "/terms",
  "/about",
  "/contact",
  "/dmca",
];

function hasConsent(): boolean {
  try {
    const raw = localStorage.getItem("consentMode");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.ads;
  } catch {
    return false;
  }
}

export function AdUnit({ slot = "default", className = "" }: AdUnitProps) {
  const [location] = useLocation();

  const isExcluded = EXCLUDED_PATHS.some(
    (path) => location === path || location.startsWith(path + "/")
  );
  if (isExcluded) return null;

  if (!hasConsent()) return null;

  return (
    <div className={`w-full ${className}`}>
      <p className="text-xs text-muted-foreground mb-1">Advertisement</p>
      <div
        className="flex items-center justify-center bg-muted/40 border border-dashed border-border rounded-lg text-muted-foreground/50 text-xs font-medium min-h-[90px] md:min-h-[250px] w-full"
        aria-label="Advertisement"
        data-ad-slot={slot}
      >
        <span>Ad Placeholder</span>
      </div>
    </div>
  );
}
