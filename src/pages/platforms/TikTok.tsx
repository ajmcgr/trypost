import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TikTok = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
            </svg>
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">TikTok Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule TikTok videos in advance. Plan your short-form video content and stay consistent on the platform.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Perfect Timing</h3>
            <p className="text-muted-foreground">
              Post at peak hours when your audience is most active to boost your reach and engagement.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bulk Upload</h3>
            <p className="text-muted-foreground">
              Upload and schedule multiple TikTok videos at once to save time and stay organized.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling TikTok Videos
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TikTok;
