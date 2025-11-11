import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram as InstagramIcon, Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Instagram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-google-red/10 flex items-center justify-center">
            <InstagramIcon className="w-8 h-8 text-google-red" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Instagram Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule and publish Instagram posts, Stories, and Reels with ease. Plan your content calendar and maintain a consistent presence on Instagram.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Auto-Scheduling</h3>
            <p className="text-muted-foreground">
              Set your optimal posting times and let Post automatically schedule your content for maximum engagement.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-Format Support</h3>
            <p className="text-muted-foreground">
              Schedule feed posts, Stories, Reels, and carousel posts all from one unified dashboard.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling Instagram Posts
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Instagram;
