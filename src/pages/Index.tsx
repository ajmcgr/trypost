import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Zap, BarChart3, ChevronDown, Check, Sparkles, Clock3, PanelsTopLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  const featureSections = [
    {
      eyebrow: "CROSS-POSTING",
      title: "Post to all platforms instantly",
      emphasis: "instantly",
      description:
        "Publish everywhere in 30 seconds, not 30 minutes. Connect your social media accounts and publish your content across all platforms without the tab chaos.",
      primaryLabel: "Start posting",
      secondaryLabel: "View platforms",
      reverse: false,
      icon: Sparkles,
      visual: (
        <div className="relative flex h-full min-h-[340px] items-center justify-center rounded-[2rem] border bg-background/80 shadow-[0_10px_60px_rgba(0,0,0,0.06)]">
          <div className="absolute left-[14%] top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-sm">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30" />
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border bg-card shadow-md">
            <img src={postLogo} alt="Post" className="h-8 w-8 object-contain" />
          </div>
          <div className="absolute right-[18%] top-[18%] flex h-14 w-14 items-center justify-center rounded-full border bg-card shadow-sm">
            <img src={facebookLogo} alt="Facebook" className="h-7 w-7" />
          </div>
          <div className="absolute right-[18%] top-[36%] flex h-14 w-14 items-center justify-center rounded-full border bg-card shadow-sm">
            <img src={instagramLogo} alt="Instagram" className="h-7 w-7" />
          </div>
          <div className="absolute right-[18%] top-[54%] flex h-14 w-14 items-center justify-center rounded-full border bg-card shadow-sm">
            <img src={xLogo} alt="X" className="h-7 w-7" />
          </div>
          <div className="absolute right-[18%] top-[72%] flex h-14 w-14 items-center justify-center rounded-full border bg-card shadow-sm">
            <img src={linkedinLogo} alt="LinkedIn" className="h-7 w-7" />
          </div>
          <div className="absolute left-[24%] top-1/2 right-[26%] h-px bg-border" />
          <div className="absolute right-[24%] top-[25%] h-[50%] w-px bg-transparent" />
          <div className="absolute right-[29%] top-1/2 h-px w-[11%] -rotate-45 bg-border" />
          <div className="absolute right-[29%] top-1/2 h-px w-[11%] -translate-y-1/2 bg-border" />
          <div className="absolute right-[29%] top-1/2 h-px w-[11%] rotate-45 bg-border" />
          <div className="absolute right-[29%] top-[62%] h-px w-[11%] rotate-[35deg] bg-border" />
        </div>
      ),
    },
    {
      eyebrow: "SCHEDULING",
      title: "Schedule posts effortlessly",
      emphasis: "effortlessly",
      description:
        "Plan your content strategy ahead of time. Pick a date, choose the best posting hour, or add content to your queue without leaving the composer.",
      primaryLabel: "Start scheduling",
      secondaryLabel: "View demo",
      reverse: true,
      icon: Clock3,
      visual: (
        <div className="flex min-h-[340px] items-center justify-center rounded-[2rem] border bg-background/80 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.06)]">
          <div className="w-full max-w-md rounded-[2rem] border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-xl font-semibold">Schedule post</div>
              <div className="h-10 w-20 rounded-full border-2 border-primary/60 bg-primary/10 p-1">
                <div className="ml-auto h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
            <div className="mb-4 inline-flex rounded-2xl bg-muted p-1">
              <div className="rounded-xl bg-card px-5 py-3 text-sm font-medium shadow-sm">Pick a time</div>
              <div className="px-5 py-3 text-sm text-muted-foreground">Add to queue</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border px-4 py-4 text-sm">Select date</div>
              <div className="rounded-2xl border px-4 py-4 text-sm">12:00 PM</div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Quick set:</span>
              <span className="rounded-xl border px-3 py-2 font-medium">11:00 AM</span>
              <span className="rounded-xl border px-3 py-2 font-medium">3:00 PM</span>
              <span className="rounded-xl border px-3 py-2 font-medium">7:00 PM</span>
            </div>
            <div className="mt-5 rounded-2xl bg-muted px-4 py-5 text-center text-lg font-semibold text-muted-foreground">
              Schedule
            </div>
          </div>
        </div>
      ),
    },
    {
      eyebrow: "CONTENT MANAGEMENT",
      title: "Manage content efficiently",
      emphasis: "efficiently",
      description:
        "See upcoming and published posts in one place. Search by platform, filter by account, and keep your content pipeline tidy as your calendar fills up.",
      primaryLabel: "Get started",
      secondaryLabel: "See pricing",
      reverse: false,
      icon: PanelsTopLeft,
      visual: (
        <div className="flex min-h-[340px] items-center justify-center rounded-[2rem] border bg-background/80 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.06)]">
          <div className="grid w-full max-w-lg grid-cols-2 gap-3 rounded-[1.75rem] border bg-card p-4 shadow-sm">
            {[
              "TikTok",
              "Instagram",
              "Threads",
              "YouTube",
              "Pinterest",
              "Twitter / X",
              "LinkedIn",
              "Facebook",
            ].map((label, index) => (
              <div
                key={label}
                className={`rounded-2xl border p-3 text-sm ${index % 3 === 0 ? "bg-primary/10 border-primary/20" : "bg-background"}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="font-medium">{label}</div>
                </div>
                <div className="h-2 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup={!user} showPricing />

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

      <section className="container mx-auto px-6 py-8 md:py-14">
        <div className="space-y-20">
          {featureSections.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.eyebrow}
                className={`grid items-center gap-10 lg:grid-cols-2 ${feature.reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}
              >
                <div className="max-w-xl">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                    <Icon className="h-4 w-4" />
                    <span>{feature.eyebrow}</span>
                  </div>
                  <h2 className="mb-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                    {feature.title.replace(feature.emphasis, "")}
                    <span className="text-primary">{feature.emphasis}</span>
                  </h2>
                  <p className="mb-8 text-lg leading-8 text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to="/signup">
                      <Button size="lg" className="rounded-2xl px-6">
                        {feature.primaryLabel} →
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button size="lg" variant="outline" className="rounded-2xl px-6">
                        {feature.secondaryLabel}
                      </Button>
                    </Link>
                  </div>
                </div>
                {feature.visual}
              </div>
            );
          })}
        </div>
      </section>

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

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-reckless text-4xl font-medium mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
