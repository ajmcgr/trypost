import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Threads = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Threads Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule posts on Threads by Meta. Connect with your audience on this text-based social platform.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Conversation Threading</h3>
            <p className="text-muted-foreground">
              Schedule individual posts or conversation threads to maintain engagement on Threads.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
            <p className="text-muted-foreground">
              Easily repurpose content from other platforms to Threads with smart formatting.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling Threads Posts
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Threads;
