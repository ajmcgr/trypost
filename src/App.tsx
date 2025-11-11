import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/platforms/instagram" element={<Instagram />} />
          <Route path="/platforms/youtube" element={<YouTube />} />
          <Route path="/platforms/tiktok" element={<TikTok />} />
          <Route path="/platforms/twitter" element={<Twitter />} />
          <Route path="/platforms/facebook" element={<Facebook />} />
          <Route path="/platforms/whatsapp" element={<WhatsApp />} />
          <Route path="/platforms/telegram" element={<Telegram />} />
          <Route path="/platforms/threads" element={<Threads />} />
          <Route path="/platforms/snapchat" element={<Snapchat />} />
          <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
          <Route path="/tools/content-planner" element={<ContentPlanner />} />
          <Route path="/tools/influencer-rate-calculator" element={<InfluencerRateCalculator />} />
          <Route path="/tools/bio-text-generator" element={<BioTextGenerator />} />
          <Route path="/tools/caption-generator" element={<CaptionGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
