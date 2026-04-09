import { useState, useEffect } from "react";
import { X, Cookie, ShieldCheck, BarChart3 } from "lucide-react";

const CONSENT_KEY = "consentMode";
const CONSENT_VERSION = "v1";
const CONSENT_TTL_DAYS = 180;

interface ConsentData {
  ads: boolean;
  analytics: boolean;
  version: string;
  timestamp: number;
}

function getStoredConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentData;
    if (parsed.version !== CONSENT_VERSION) return null;
    const ageMs = Date.now() - (parsed.timestamp || 0);
    if (ageMs > CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(ads: boolean, analytics: boolean) {
  const data: ConsentData = {
    ads,
    analytics,
    version: CONSENT_VERSION,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(data));

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: ads ? "granted" : "denied",
      analytics_storage: analytics ? "granted" : "denied",
      ad_user_data: ads ? "granted" : "denied",
      ad_personalization: ads ? "granted" : "denied",
    });
  }

  if (ads && typeof window !== "undefined") {
    injectAdSense();
  }
}

function injectAdSense() {
  if (document.getElementById("adsense-script")) return;
  const script = document.createElement("script");
  script.id = "adsense-script";
  script.async = true;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  script.setAttribute("data-ad-client", "ca-pub-XXXXXXXXXXXXXXXX");
  document.head.appendChild(script);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GOLD = "#C27400";
const GOLD_DARK = "#b8960f";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
  }, []);

  function handleAcceptAll() {
    saveConsent(true, true);
    setVisible(false);
  }

  function handleRejectAll() {
    saveConsent(false, false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] md:bottom-4 md:left-4 md:right-auto md:max-w-sm"
    >
      <div className="bg-white border border-gray-200 shadow-2xl rounded-none md:rounded-2xl overflow-hidden">
        {/* Gold top accent strip */}
        <div style={{ backgroundColor: GOLD }} className="h-1 w-full" />

        <div className="p-4 sm:p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                Cookie Preferences
              </h2>
            </div>
            <button
              onClick={handleRejectAll}
              aria-label="Dismiss and reject all"
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            We use cookies to improve your experience and show personalized ads.
            By continuing, you agree to our use of cookies.{" "}
            <button
              onClick={() => setExpanded(!expanded)}
              className="underline hover:no-underline font-medium"
              style={{ color: GOLD_DARK }}
            >
              {expanded ? "Hide details" : "Learn more"}
            </button>
          </p>

          {/* Expanded detail panel */}
          {expanded && (
            <div className="mb-3 space-y-2 text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-green-500 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-700">Essential cookies</span>
                  <p className="text-gray-500">Always active. Required for the site to function correctly.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <span className="font-semibold text-gray-700">Analytics &amp; Advertising</span>
                  <p className="text-gray-500">Help us understand traffic and show relevant ads. Requires your consent.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRejectAll}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-white transition-colors"
              style={{ backgroundColor: GOLD }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD_DARK)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD)}
            >
              Accept All
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-2">
            Consent expires after {CONSENT_TTL_DAYS} days · GDPR compliant
          </p>
        </div>
      </div>
    </div>
  );
}
