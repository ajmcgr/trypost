import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Zap, BarChart3, ChevronDown, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import postLogo from "@/assets/post-logo.png";
import postIcon from "@/assets/post-icon.png";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
      <header className="bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <a href="https://trypost.ai" className="flex items-center gap-2 shrink-0">
            <img src={postLogo} alt="Post" className="h-6 sm:h-8" />
          </a>
          <nav className="hidden sm:flex flex-1 justify-center items-center gap-6 md:gap-8">
            <Link to="/pricing" className="text-xs sm:text-sm font-medium text-foreground hover:opacity-80 transition-colors">
              Pricing
            </Link>
            <Link to="/resources" className="text-xs sm:text-sm font-medium text-foreground hover:opacity-80 transition-colors">
              Resources
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            {user ? (
              <Link to="/dashboard">
                <Button className="text-xs sm:text-sm">Go to Dashboard →</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-xs sm:text-sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-xs sm:text-sm">Sign Up →</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="font-reckless text-5xl md:text-6xl font-medium mb-6 tracking-tight text-black">
          Create once.
          <br />
          <span>Schedule everywhere.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Post helps creators and brands plan, queue, and publish content across all social platforms from one simple dashboard.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <Link to="/signup">
            <Button size="lg" className="text-lg">
              Start Scheduling Free →
            </Button>
          </Link>
          <div className="senja-embed" data-id="eacf7a79-5b6c-4a80-9f5a-0e6dfe631ec6" data-mode="shadow" data-lazyload="false"></div>
        </div>
        <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl border border-border bg-card p-8">
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/hero-screenshot.png"
              alt="TryPost composer interface showing connected social accounts and a ready-to-publish post"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {/* Cross-posting */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-sans text-4xl md:text-5xl font-medium mb-4 leading-tight text-black">
              Post to all platforms <span>instantly</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Publish everywhere in 30 seconds, not 30 minutes. Manage all your personal and brand
              accounts without switching back and forth. Connect your social media accounts and publish
              your content across all platforms with a single click — no learning curve required.
            </p>
            <div className="flex gap-3">
              <Link to="/signup"><Button>Start posting <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </div>
          <Card className="aspect-square rounded-3xl bg-muted/40 border-0 flex items-center justify-center p-12 relative">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {[
                { x: 340, y: 80, logo: facebookLogo },
                { x: 360, y: 180, logo: instagramLogo },
                { x: 340, y: 280, logo: xLogo },
                { x: 270, y: 340, logo: linkedinLogo },
                { x: 160, y: 340, logo: tiktokLogo },
              ].map((n, i) => (
                <line key={i} x1="120" y1="200" x2={n.x} y2={n.y} stroke="hsl(var(--border))" strokeWidth="1.5" />
              ))}
            </svg>
            <img src={postIcon} alt="" className="absolute left-[22%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card p-2 shadow-md" />
            {[
              { className: "top-[15%] right-[10%]", src: facebookLogo },
              { className: "top-[40%] right-[5%]", src: instagramLogo },
              { className: "top-[65%] right-[10%]", src: xLogo },
              { className: "bottom-[10%] right-[30%]", src: linkedinLogo },
              { className: "bottom-[10%] left-[35%]", src: tiktokLogo },
            ].map((b, i) => (
              <div key={i} className={`absolute ${b.className} w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center`}>
                <img src={b.src} alt="" className="w-6 h-6" />
              </div>
            ))}
          </Card>
        </div>

        {/* Scheduling */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Card className="aspect-square rounded-3xl bg-muted/40 border-0 p-8 flex items-center justify-center order-2 md:order-1">
            <img src="/hero-screenshot.png" alt="" className="w-full rounded-2xl shadow-lg border" />
          </Card>
          <div className="order-1 md:order-2">
            <h2 className="font-sans text-4xl md:text-5xl font-medium mb-4 leading-tight text-black">
              Schedule posts <span>effortlessly</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Plan your content strategy ahead of time. Schedule posts across all platforms. Customize
              your posts perfectly per platform. Queue up your posts and let Post handle the rest.
            </p>
            <div className="flex gap-3">
              <Link to="/signup"><Button>Start scheduling <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </div>
        </div>

        {/* Content management */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-sans text-4xl md:text-5xl font-medium mb-4 leading-tight text-black">
              Manage content <span>efficiently</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              View all your scheduled and published posts in one place. Track what's been posted, edit
              upcoming posts, and stay on top of your content strategy.
            </p>
            <div className="flex gap-3">
              <Link to="/signup"><Button>Get started <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
          </div>
          <Card className="aspect-square rounded-3xl bg-muted/40 border-0 p-8 flex items-center justify-center">
            <img src="/hero-screenshot.png" alt="" className="w-full rounded-2xl shadow-lg border" />
          </Card>
        </div>
      </section>



      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-reckless text-4xl font-medium mb-4 text-black">How it works</h2>
          <p className="text-lg text-muted-foreground">Three simple steps to social media success</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-blue/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-google-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">Connect Accounts</h3>
            <p className="text-muted-foreground">
              Link your Twitter, LinkedIn, Instagram, Facebook, and TikTok accounts in seconds.
            </p>
          </Card>
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-red/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-google-red" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">Schedule Posts</h3>
            <p className="text-muted-foreground">
              Create content once and schedule it across multiple platforms with one click.
            </p>
          </Card>
          <Card className="p-8 text-center rounded-3xl border-2">
            <div className="w-16 h-16 rounded-2xl bg-google-green/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-google-green" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black">Track Results</h3>
            <p className="text-muted-foreground">
              Monitor engagement, reach, and performance across all your social channels.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-reckless text-4xl font-medium mb-4 text-black">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 rounded-3xl border-2 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-black">Free</h3>
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
              <Button className="w-full" variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 rounded-3xl border-2 border-primary shadow-xl scale-105 flex flex-col">
            <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mx-auto mb-4">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-black">Pro</h3>
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
              <Button className="w-full" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </Card>

          {/* Business Plan */}
          <Card className="p-8 rounded-3xl border-2 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-black">Business</h3>
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
              <Button className="w-full" variant="outline" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="container mx-auto px-6 py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="font-reckless text-4xl font-medium mb-4 text-black">Works with all your platforms</h2>
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
          <h2 className="font-reckless text-4xl font-medium mb-4 text-black">Frequently Asked Questions</h2>
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
        <h2 className="font-reckless text-4xl font-medium mb-6 text-black">Ready to simplify your social media?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators who schedule smarter with Post.
        </p>
        <Link to="/signup">
          <Button size="lg" className="text-lg">
            Start Scheduling Free →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-2 rounded-2xl overflow-hidden">
        <CollapsibleTrigger className="w-full text-left p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg pr-4 text-black">{question}</h3>
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
