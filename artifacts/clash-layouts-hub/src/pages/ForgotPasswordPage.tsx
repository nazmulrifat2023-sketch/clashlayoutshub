import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Shield, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const GOLD = "#EB8D00";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: `${GOLD}15` }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: GOLD }} />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Check your email</h1>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If <span className="font-semibold text-gray-700">{email}</span> is registered, we've sent a password reset link. Check your inbox (and spam folder).
                </p>
              </div>
              <p className="text-xs text-muted-foreground">The link expires in 1 hour.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: GOLD }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to log in
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: GOLD }}>
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Forgot password?</h1>
                <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                  style={{ backgroundColor: GOLD }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Remember it?{" "}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: GOLD }}>
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
