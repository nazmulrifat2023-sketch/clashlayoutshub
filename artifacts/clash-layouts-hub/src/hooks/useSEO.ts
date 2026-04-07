import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noSuffix?: boolean;
}

const SITE_NAME = "ClashLayoutsHub";
const DEFAULT_DESC =
  "Browse 1,000+ verified Clash of Clans base layouts for TH3–TH18. Free copy-link, win rates & health scores. Updated for 2026 meta.";

function setMeta(selector: string, value: string): void {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta") as HTMLMetaElement;
    const match = selector.match(/\[(\w[\w:-]*)="([^"]+)"\]/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(url: string): void {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link") as HTMLLinkElement;
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO({
  title,
  description,
  ogImage,
  ogType = "website",
  canonical,
  noSuffix = false,
}: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title
      ? noSuffix
        ? title
        : `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Best Clash of Clans Base Layouts 2026`;

    const desc = description || DEFAULT_DESC;
    const image =
      ogImage ||
      `${window.location.origin}/assets/opengraph.jpg`;
    const url = canonical || window.location.href;

    // Basic
    document.title = fullTitle;
    setMeta('meta[name="description"]', desc);

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:site_name"]', SITE_NAME);

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[name="twitter:image"]', image);

    // Canonical
    setCanonical(url);

    return () => {
      // Restore defaults on unmount
      document.title = `${SITE_NAME} — Best Clash of Clans Base Layouts 2026`;
    };
  }, [title, description, ogImage, ogType, canonical, noSuffix]);
}
