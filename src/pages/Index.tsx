import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Zap, BarChart3, ChevronDown, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import postLogo from "@/assets/post-logo.png";
import facebookLogo from "@/assets/facebook.svg";
import xLogo from "@/assets/x.svg";
import linkedinLogo from "@/assets/linkedin.svg";
import instagramLogo from "@/assets/instagram.svg";
import youtubeLogo from "@/assets/youtube.svg";
import threadsLogo from "@/assets/threads.svg";
import tiktokLogo from "@/assets/tiktok.svg";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <a href="https://trypost.ai" className="flex items-center gap-2 shrink-0">
            <img src={postLogo} alt="Post" className="h-6 sm:h-8" />
          </a>
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-8">
            <Link to="/pricing" className="text-sm sm:text-base font-medium text-foreground hover:text-foreground transition-colors hidden sm:inline">
              Pricing
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button className="text-sm sm:text-base px-3 sm:px-4">Go to Dashboard →</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm sm:text-base px-3 sm:px-4">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-sm sm:text-base px-3 sm:px-4">Sign Up →</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="font-reckless text-5xl md:text-6xl font-medium mb-6 tracking-tight">
          Create once.
          <br />
          <span className="text-primary">Schedule everywhere.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Post helps creators and brands plan, queue, and publish content across all social platforms from one simple dashboard.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <Link to="/signup">
            <Button size="lg" className="text-xl px-10 py-7 rounded-2xl">
              Start Scheduling Free →
            </Button>
          </Link>
          <div className="senja-embed" data-id="eacf7a79-5b6c-4a80-9f5a-0e6dfe631ec6" data-mode="shadow" data-lazyload="false"></div>
        </div>
        <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-border bg-card p-8">
          <div className="bg-muted/30 rounded-2xl aspect-video flex items-center justify-center">
            <Calendar className="w-24 h-24 text-muted-foreground/30" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-reckless text-4xl font-medium mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">Three simple steps to social media success</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-blue/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-google-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Accounts</h3>
            <p className="text-muted-foreground">
              Link your Twitter, LinkedIn, Instagram, Facebook, and TikTok accounts in seconds.
            </p>
          </Card>
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-red/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-google-red" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule Posts</h3>
            <p className="text-muted-foreground">
              Create content once and schedule it across multiple platforms with one click.
            </p>
          </Card>
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-green/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-google-green" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Results</h3>
            <p className="text-muted-foreground">
              Monitor engagement, reach, and performance across all your social channels.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-reckless text-4xl font-medium mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 rounded-3xl border-2 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold">$0</span>
            </div>
            <p className="text-muted-foreground mb-8">Perfect for getting started</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">2 social networks</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">10 scheduled posts per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Basic analytics</span>
              </li>
            </ul>

            <Link to="/signup">
              <Button className="w-full rounded-2xl" variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 rounded-3xl border-2 border-primary shadow-xl scale-105 flex flex-col">
            <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mx-auto mb-4">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-8">For individual creators</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">5 social networks</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited scheduled posts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>

            <Link to="/signup">
              <Button className="w-full rounded-2xl" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </Card>

          {/* Business Plan */}
          <Card className="p-8 rounded-3xl border-2 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Business</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mb-8">For teams and agencies</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">All social networks</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited posts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Team collaboration</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Advanced analytics & reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Dedicated support</span>
              </li>
            </ul>

            <Link to="/signup">
              <Button className="w-full rounded-2xl" variant="outline" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="container mx-auto px-6 py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="font-reckless text-4xl font-medium mb-4">Works with all your platforms</h2>
          <p className="text-lg text-muted-foreground">Connect once, publish everywhere</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={xLogo} alt="X" className="w-6 h-6" />
            <span className="font-medium">Twitter / X</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={linkedinLogo} alt="LinkedIn" className="w-6 h-6" />
            <span className="font-medium">LinkedIn</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={instagramLogo} alt="Instagram" className="w-6 h-6" />
            <span className="font-medium">Instagram</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={facebookLogo} alt="Facebook" className="w-6 h-6" />
            <span className="font-medium">Facebook</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={youtubeLogo} alt="YouTube" className="w-6 h-6" />
            <span className="font-medium">YouTube</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={threadsLogo} alt="Threads" className="w-6 h-6" />
            <span className="font-medium">Threads</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <img src={tiktokLogo} alt="TikTok" className="w-6 h-6" />
            <span className="font-medium">TikTok</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-reckless text-4xl font-medium mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about Post</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem 
            question="How does scheduling work?"
            answer="Simply connect your social accounts, create your content, choose the date and time, and Post will automatically publish it for you. You can schedule weeks or months in advance."
          />
          <FAQItem 
            question="Which platforms are supported?"
            answer="Post supports all major social platforms including Twitter/X, LinkedIn, Instagram, Facebook, YouTube, TikTok, Threads, WhatsApp, Telegram, and Snapchat."
          />
          <FAQItem 
            question="Can I schedule the same post to multiple platforms?"
            answer="Yes! Create your content once and schedule it across all your connected platforms with a single click. Post will optimize the format for each platform."
          />
          <FAQItem 
            question="Is there a free plan?"
            answer="Yes, we offer a free plan that includes 1 social account and 10 scheduled posts per month. Perfect for getting started. Upgrade anytime for unlimited posts and more accounts."
          />
          <FAQItem 
            question="How far in advance can I schedule posts?"
            answer="You can schedule posts as far in advance as you'd like. Many users plan their content months ahead to maintain consistency and save time."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="font-reckless text-4xl font-medium mb-6">Ready to simplify your social media?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators who schedule smarter with Post.
        </p>
        <Link to="/signup">
          <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
            Start Scheduling Free →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><a href="https://blog.works.xyz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="https://discord.gg/vNyMmrRDXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@trypost.ai" className="text-muted-foreground hover:text-foreground">Support</a></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/platforms/instagram" className="text-muted-foreground hover:text-foreground">Instagram</Link></li>
                <li><Link to="/platforms/youtube" className="text-muted-foreground hover:text-foreground">YouTube</Link></li>
                <li><Link to="/platforms/tiktok" className="text-muted-foreground hover:text-foreground">TikTok</Link></li>
                <li><Link to="/platforms/twitter" className="text-muted-foreground hover:text-foreground">X (Twitter)</Link></li>
                <li><Link to="/platforms/facebook" className="text-muted-foreground hover:text-foreground">Facebook</Link></li>
                <li><Link to="/platforms/whatsapp" className="text-muted-foreground hover:text-foreground">WhatsApp</Link></li>
                <li><Link to="/platforms/telegram" className="text-muted-foreground hover:text-foreground">Telegram</Link></li>
                <li><Link to="/platforms/threads" className="text-muted-foreground hover:text-foreground">Threads</Link></li>
                <li><Link to="/platforms/snapchat" className="text-muted-foreground hover:text-foreground">Snapchat</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Free Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/tools/hashtag-generator" className="text-muted-foreground hover:text-foreground">Hashtag Generator</Link></li>
                <li><Link to="/tools/content-planner" className="text-muted-foreground hover:text-foreground">Content Planner</Link></li>
                <li><Link to="/tools/influencer-rate-calculator" className="text-muted-foreground hover:text-foreground">Influencer Rate Calculator</Link></li>
                <li><Link to="/tools/bio-text-generator" className="text-muted-foreground hover:text-foreground">Bio Text Generator</Link></li>
                <li><Link to="/tools/caption-generator" className="text-muted-foreground hover:text-foreground">Caption Generator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://x.com/trypostai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">X</a></li>
                <li><a href="https://discord.gg/vNyMmrRDXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            Copyright © 2026 Works App, Inc. Built with 🫶🏻 by <a href="https://works.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Works</a>.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-2 rounded-2xl overflow-hidden">
        <CollapsibleTrigger className="w-full text-left p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg pr-4">{question}</h3>
          <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6 pb-6">
          <p className="text-muted-foreground">{answer}</p>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default Index;
