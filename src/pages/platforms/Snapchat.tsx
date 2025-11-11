import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Calendar, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Snapchat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-google-yellow/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-google-yellow" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Snapchat Scheduling</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Schedule Snapchat Stories and Spotlight content. Reach younger audiences with timely, engaging content.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Story Planning</h3>
            <p className="text-muted-foreground">
              Plan and schedule your Snapchat Stories to maintain consistent visibility with your audience.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border bg-card">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spotlight Ready</h3>
            <p className="text-muted-foreground">
              Schedule Spotlight content to maximize your reach and potential for viral moments.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling Snapchat Stories
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Snapchat;
