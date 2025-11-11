import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send, Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Telegram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-google-blue/10 flex items-center justify-center">
            <Send className="w-8 h-8 text-google-blue" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Telegram Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule Telegram channel posts and messages. Manage your community communication effectively.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Channel Management</h3>
            <p className="text-muted-foreground">
              Schedule posts to your Telegram channels and keep your community engaged consistently.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rich Media</h3>
            <p className="text-muted-foreground">
              Schedule text, images, videos, and documents to your Telegram channels with ease.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling Telegram Posts
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Telegram;
