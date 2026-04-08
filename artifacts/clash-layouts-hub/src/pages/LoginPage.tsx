import { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const GOLD = "#EB8D00";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle oauth_error and msg from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    const oauthErr = params.get("oauth_error");
    if (msg) setError(decodeURIComponent(msg));
    else if (oauthErr === "not_configured") setError("Google OAuth is not configured yet. Please use email login.");
    else if (oauthErr === "cancelled") setError("Google sign-in was cancelled.");
    else if (oauthErr === "failed") setError("Google sign-in failed. Please try again.");
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Login failed"); return; }
      login(json.token, json.user);
      toast.success(`Welcome back, ${json.user.display_name}!`);
      setLocation("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  }

  const inputCls =
    "w-full px-3.5 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md"
              style={{ backgroundColor: GOLD }}>
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Log in to ClashLayoutsHub</p>
          </div>

          {/* Inline error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border
                       bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors
                       disabled:opacity-50 shadow-sm active:scale-[0.98]"
          >
            {googleLoading
              ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              : <GoogleIcon />}
            {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or continue with email / username</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email or Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="you@example.com or YourUsername"
                autoComplete="username"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all
                         disabled:opacity-50 flex items-center justify-center gap-2 mt-1
                         active:scale-[0.98]"
              style={{ backgroundColor: GOLD }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: GOLD }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
