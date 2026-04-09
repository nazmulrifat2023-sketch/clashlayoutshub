import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, Globe, LogOut, ChevronDown, User } from "lucide-react";
import { useTranslation, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const GOLD = "#C27400";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/blog", label: t.blog },
    { href: "/submit-base", label: t.submitBase },
    { href: "/about", label: t.about },
  ];

  const langs: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "bn", label: "বাং" },
    { code: "hi", label: "हिं" },
  ];

  const initials = user?.display_name
    ? user.display_name.slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">
              ClashLayouts<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    language === l.code
                      ? "bg-white shadow-sm text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Auth UI */}
            {user ? (
              /* Logged-in: avatar + dropdown */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: GOLD }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm font-medium max-w-[90px] truncate">{user.display_name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-border shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user.display_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Submissions
                    </Link>
                    {/* Admin link — only for admin users */}
                    {user.is_admin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-amber-50"
                        style={{ color: GOLD }}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-border mt-1" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-out: Login + Sign Up */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: GOLD }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 py-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ backgroundColor: GOLD }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user.display_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Submissions
                  </Link>
                  {user.is_admin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 py-2 text-sm font-semibold"
                      style={{ color: GOLD }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 py-2 text-sm text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block py-2 text-sm font-bold"
                    style={{ color: GOLD }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setMobileOpen(false); }}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    language === l.code ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
