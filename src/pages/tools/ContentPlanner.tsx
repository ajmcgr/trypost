import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContentPlanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Content Planner</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Plan your social media content calendar and organize your posting strategy across all platforms.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <h3 className="text-xl font-semibold mb-4">Content Planning Made Easy</h3>
          <ul className="space-y-3 text-muted-foreground mb-6">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Plan content weeks or months in advance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Visualize your posting schedule across all platforms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Maintain consistency with automated scheduling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Collaborate with team members on content strategy</span>
            </li>
          </ul>
          <div className="bg-muted/30 rounded-2xl aspect-video flex items-center justify-center">
            <Calendar className="w-24 h-24 text-muted-foreground/30" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ready to plan your content strategy?</p>
          <Link to="/signup">
            <Button size="lg">Start Planning Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentPlanner;
