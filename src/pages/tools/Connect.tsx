import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import postLogo from "@/assets/post-logo.png";

const Connect = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={postLogo} alt="Post" className="h-8" />
          </Link>
          <Link to="/signup">
            <Button>Start Free</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Connect Tool</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Connect all your social media accounts in one place and manage them from a unified dashboard.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <h3 className="text-xl font-semibold mb-4">Connect Your Platforms</h3>
          <ul className="space-y-3 text-muted-foreground mb-6">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Connect Instagram, Twitter, TikTok, and more</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Secure OAuth authentication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Manage multiple accounts per platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Post to all platforms simultaneously</span>
            </li>
          </ul>
          <div className="bg-muted/30 rounded-2xl aspect-video flex items-center justify-center">
            <Link2 className="w-24 h-24 text-muted-foreground/30" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ready to connect your social accounts?</p>
          <Link to="/signup">
            <Button size="lg">Connect Your Accounts</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Connect;
