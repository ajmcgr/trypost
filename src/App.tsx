import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Composer from "./pages/Composer";
import DashboardLayout from "./components/DashboardLayout";
import OAuthCallback from "./pages/oauth/OAuthCallback";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Instagram from "./pages/platforms/Instagram";
import YouTube from "./pages/platforms/YouTube";
import TikTok from "./pages/platforms/TikTok";
import Twitter from "./pages/platforms/Twitter";
import Facebook from "./pages/platforms/Facebook";
import WhatsApp from "./pages/platforms/WhatsApp";
import Telegram from "./pages/platforms/Telegram";
import Threads from "./pages/platforms/Threads";
import Snapchat from "./pages/platforms/Snapchat";
import HashtagGenerator from "./pages/tools/HashtagGenerator";
import ContentPlanner from "./pages/tools/ContentPlanner";
import InfluencerRateCalculator from "./pages/tools/InfluencerRateCalculator";
import BioTextGenerator from "./pages/tools/BioTextGenerator";
import CaptionGenerator from "./pages/tools/CaptionGenerator";
import Calendar from "./pages/dashboard/Calendar";
import Posts from "./pages/dashboard/Posts";
import Scheduled from "./pages/dashboard/Scheduled";
import Posted from "./pages/dashboard/Posted";
import Drafts from "./pages/dashboard/Drafts";
import Studio from "./pages/dashboard/Studio";
import BulkTools from "./pages/dashboard/BulkTools";
import Connections from "./pages/dashboard/Connections";
import Teams from "./pages/dashboard/Teams";
import Settings from "./pages/dashboard/account/Settings";
import Plans from "./pages/dashboard/account/Plans";
import Support from "./pages/dashboard/account/Support";
import APIKeys from "./pages/dashboard/APIKeys";
import Feedback from "./pages/dashboard/Feedback";
import Consultation from "./pages/dashboard/Consultation";
import Referral from "./pages/dashboard/Referral";
import Growth from "./pages/dashboard/Growth";
import Account from "./pages/dashboard/Account";
import Workspaces from "./pages/dashboard/Workspaces";
import Home from "./pages/dashboard/Home";
import ImageComposer from "./pages/dashboard/ImageComposer";
import VideoComposer from "./pages/dashboard/VideoComposer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
          
          {/* Dashboard Routes with Sidebar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="composer" element={<Composer />} />
            <Route path="image-composer" element={<ImageComposer />} />
            <Route path="video-composer" element={<VideoComposer />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="posts" element={<Posts />} />
            <Route path="scheduled" element={<Scheduled />} />
            <Route path="posted" element={<Posted />} />
            <Route path="drafts" element={<Drafts />} />
            <Route path="studio" element={<Studio />} />
            <Route path="bulk-tools" element={<BulkTools />} />
            <Route path="connections" element={<Connections />} />
            <Route path="teams" element={<Teams />} />
            <Route path="workspaces" element={<Workspaces />} />
            <Route path="account/settings" element={<Settings />} />
            <Route path="account/plans" element={<Plans />} />
            <Route path="account/support" element={<Support />} />
            <Route path="api-keys" element={<APIKeys />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="referral" element={<Referral />} />
            <Route path="growth" element={<Growth />} />
            <Route path="account" element={<Account />} />
          </Route>

          {/* Platform Pages */}
          <Route path="/platforms/instagram" element={<Instagram />} />
          <Route path="/platforms/youtube" element={<YouTube />} />
          <Route path="/platforms/tiktok" element={<TikTok />} />
          <Route path="/platforms/twitter" element={<Twitter />} />
          <Route path="/platforms/facebook" element={<Facebook />} />
          <Route path="/platforms/whatsapp" element={<WhatsApp />} />
          <Route path="/platforms/telegram" element={<Telegram />} />
          <Route path="/platforms/threads" element={<Threads />} />
          <Route path="/platforms/snapchat" element={<Snapchat />} />

          {/* Tools Pages */}
          <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
          <Route path="/tools/content-planner" element={<ContentPlanner />} />
          <Route path="/tools/influencer-rate-calculator" element={<InfluencerRateCalculator />} />
          <Route path="/tools/bio-text-generator" element={<BioTextGenerator />} />
          <Route path="/tools/caption-generator" element={<CaptionGenerator />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
