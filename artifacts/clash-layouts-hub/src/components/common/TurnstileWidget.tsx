import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface TurnstileRef {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";

function ensureTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.turnstile) { resolve(); return; }
    if (document.getElementById(SCRIPT_ID)) {
      const check = setInterval(() => {
        if (window.turnstile) { clearInterval(check); resolve(); }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(
  ({ siteKey, onSuccess, onExpire, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      let mounted = true;

      ensureTurnstileScript().then(() => {
        if (!mounted || !containerRef.current || !window.turnstile) return;
        // Clear any previous render
        containerRef.current.innerHTML = "";
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onSuccess,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme: "light",
          size: "flexible",
          appearance: "always",
        });
      });

      return () => {
        mounted = false;
        if (window.turnstile && widgetIdRef.current) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
      };
    }, [siteKey]);

    return (
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ minHeight: 65 }}
      />
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
