import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecentlyViewedBar } from "@/components/base/RecentlyViewed";
import { HomePage } from "@/pages/HomePage";
import { THPage } from "@/pages/THPage";
import { BaseDetailPage } from "@/pages/BaseDetailPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogDetailPage } from "@/pages/BlogDetailPage";
import { SubmitBasePage } from "@/pages/SubmitBasePage";
import { AboutPage, NotFoundPage } from "@/pages/StaticPages";
import { ContactPage } from "@/pages/ContactPage";
import { PrivacyPolicyPage, TermsPage, CookiePolicyPage, DmcaPage } from "@/pages/LegalPages";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminBases } from "@/pages/admin/AdminBases";
import { AdminBaseForm } from "@/pages/admin/AdminBaseForm";
import { AdminBlog } from "@/pages/admin/AdminBlog";
import { AdminBlogForm } from "@/pages/admin/AdminBlogForm";
import { AdminSubmissions } from "@/pages/admin/AdminSubmissions";
import { AdminReports } from "@/pages/admin/AdminReports";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000 },
  },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <RecentlyViewedBar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
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

      {/* Legal routes */}
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

      {/* Auth routes */}
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

      {/* Admin routes */}
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

      {/* Catch-all */}
      <Route>
        <PublicLayout><NotFoundPage /></PublicLayout>
      </Route>
    </Switch>
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
