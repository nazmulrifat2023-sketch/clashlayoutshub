import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecentlyViewedBar } from "@/components/base/RecentlyViewed";
import { ConsentBanner } from "@/components/ads/ConsentBanner";

const HomePage           = lazy(() => import("@/pages/HomePage").then(m => ({ default: m.HomePage })));
const THPage             = lazy(() => import("@/pages/THPage").then(m => ({ default: m.THPage })));
const BaseDetailPage     = lazy(() => import("@/pages/BaseDetailPage").then(m => ({ default: m.BaseDetailPage })));
const BlogPage           = lazy(() => import("@/pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogDetailPage     = lazy(() => import("@/pages/BlogDetailPage").then(m => ({ default: m.BlogDetailPage })));
const SubmitBasePage     = lazy(() => import("@/pages/SubmitBasePage").then(m => ({ default: m.SubmitBasePage })));
const ContactPage        = lazy(() => import("@/pages/ContactPage").then(m => ({ default: m.ContactPage })));
const LoginPage          = lazy(() => import("@/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage         = lazy(() => import("@/pages/SignupPage").then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage  = lazy(() => import("@/pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const AuthCallbackPage   = lazy(() => import("@/pages/AuthCallbackPage").then(m => ({ default: m.AuthCallbackPage })));
const ProfilePage        = lazy(() => import("@/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminLayout        = lazy(() => import("@/pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard     = lazy(() => import("@/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminBases         = lazy(() => import("@/pages/admin/AdminBases").then(m => ({ default: m.AdminBases })));
const AdminBaseForm      = lazy(() => import("@/pages/admin/AdminBaseForm").then(m => ({ default: m.AdminBaseForm })));
const AdminBlog          = lazy(() => import("@/pages/admin/AdminBlog").then(m => ({ default: m.AdminBlog })));
const AdminBlogForm      = lazy(() => import("@/pages/admin/AdminBlogForm").then(m => ({ default: m.AdminBlogForm })));
const AdminSubmissions   = lazy(() => import("@/pages/admin/AdminSubmissions").then(m => ({ default: m.AdminSubmissions })));
const AdminReports       = lazy(() => import("@/pages/admin/AdminReports").then(m => ({ default: m.AdminReports })));
const AdminAnalytics     = lazy(() => import("@/pages/admin/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })));
const AboutPage          = lazy(() => import("@/pages/StaticPages").then(m => ({ default: m.AboutPage })));
const NotFoundPage       = lazy(() => import("@/pages/StaticPages").then(m => ({ default: m.NotFoundPage })));
const PrivacyPolicyPage  = lazy(() => import("@/pages/LegalPages").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage          = lazy(() => import("@/pages/LegalPages").then(m => ({ default: m.TermsPage })));
const CookiePolicyPage   = lazy(() => import("@/pages/LegalPages").then(m => ({ default: m.CookiePolicyPage })));
const DmcaPage           = lazy(() => import("@/pages/LegalPages").then(m => ({ default: m.DmcaPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000 },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" aria-live="polite">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <RecentlyViewedBar />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PublicLayout><PageLoader /></PublicLayout>}>
      <Switch>
        <Route path="/">
          <PublicLayout><HomePage /></PublicLayout>
        </Route>
        <Route path="/th/:level">
          <PublicLayout><THPage /></PublicLayout>
        </Route>
        <Route path="/base/:slug">
          <PublicLayout><BaseDetailPage /></PublicLayout>
        </Route>
        <Route path="/blog">
          <PublicLayout><BlogPage /></PublicLayout>
        </Route>
        <Route path="/blog/:slug">
          <PublicLayout><BlogDetailPage /></PublicLayout>
        </Route>
        <Route path="/submit-base">
          <PublicLayout><SubmitBasePage /></PublicLayout>
        </Route>
        <Route path="/about">
          <PublicLayout><AboutPage /></PublicLayout>
        </Route>
        <Route path="/contact">
          <PublicLayout><ContactPage /></PublicLayout>
        </Route>

        <Route path="/privacy-policy">
          <PublicLayout><PrivacyPolicyPage /></PublicLayout>
        </Route>
        <Route path="/terms">
          <PublicLayout><TermsPage /></PublicLayout>
        </Route>
        <Route path="/cookie-policy">
          <PublicLayout><CookiePolicyPage /></PublicLayout>
        </Route>
        <Route path="/dmca">
          <PublicLayout><DmcaPage /></PublicLayout>
        </Route>

        <Route path="/login">
          <PublicLayout><LoginPage /></PublicLayout>
        </Route>
        <Route path="/signup">
          <PublicLayout><SignupPage /></PublicLayout>
        </Route>
        <Route path="/forgot-password">
          <PublicLayout><ForgotPasswordPage /></PublicLayout>
        </Route>
        <Route path="/reset-password">
          <PublicLayout><ResetPasswordPage /></PublicLayout>
        </Route>
        <Route path="/auth/callback">
          <AuthCallbackPage />
        </Route>
        <Route path="/profile">
          <PublicLayout><ProfilePage /></PublicLayout>
        </Route>

        <Route path="/admin">
          <AdminLayout><AdminDashboard /></AdminLayout>
        </Route>
        <Route path="/admin/bases">
          <AdminLayout><AdminBases /></AdminLayout>
        </Route>
        <Route path="/admin/bases/add">
          <AdminLayout><AdminBaseForm /></AdminLayout>
        </Route>
        <Route path="/admin/bases/:id/edit">
          <AdminLayout><AdminBaseForm /></AdminLayout>
        </Route>
        <Route path="/admin/blog">
          <AdminLayout><AdminBlog /></AdminLayout>
        </Route>
        <Route path="/admin/blog/add">
          <AdminLayout><AdminBlogForm /></AdminLayout>
        </Route>
        <Route path="/admin/blog/:slug/edit">
          <AdminLayout><AdminBlogForm /></AdminLayout>
        </Route>
        <Route path="/admin/submissions">
          <AdminLayout><AdminSubmissions /></AdminLayout>
        </Route>
        <Route path="/admin/reports">
          <AdminLayout><AdminReports /></AdminLayout>
        </Route>
        <Route path="/admin/analytics">
          <AdminLayout><AdminAnalytics /></AdminLayout>
        </Route>

        <Route>
          <PublicLayout><NotFoundPage /></PublicLayout>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster richColors position="top-right" />
          <ConsentBanner />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
