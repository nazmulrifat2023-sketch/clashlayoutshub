import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthUser } from "@/contexts/AuthContext";

export function AuthCallbackPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userRaw = params.get("user");
    const oauthError = params.get("oauth_error");

    if (oauthError || !token || !userRaw) {
      const msg = oauthError === "not_configured"
        ? "Google OAuth is not yet configured on this server."
        : oauthError === "cancelled"
        ? "Google sign-in was cancelled."
        : "Google sign-in failed. Please try again.";
      setLocation(`/login?msg=${encodeURIComponent(msg)}`);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw)) as AuthUser;
      login(token, user);
      setLocation("/");
    } catch {
      setLocation("/login?msg=" + encodeURIComponent("Sign-in failed. Please try again."));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Signing you in…</p>
      </div>
    </div>
  );
}
