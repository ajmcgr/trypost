import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Youtube, Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const YouTube = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-google-red/10 flex items-center justify-center">
            <Youtube className="w-8 h-8 text-google-red" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">YouTube Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule YouTube videos, Shorts, and community posts. Plan your video releases and maintain a consistent upload schedule.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Timed Releases</h3>
            <p className="text-muted-foreground">
              Schedule your video uploads for optimal viewing times to maximize your audience reach.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Shorts & Community</h3>
            <p className="text-muted-foreground">
              Manage YouTube Shorts and community posts alongside your regular video content.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling YouTube Content
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YouTube;
