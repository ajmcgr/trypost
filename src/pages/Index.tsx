import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Zap, BarChart3, Twitter, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import postLogo from "@/assets/post-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={postLogo} alt="Post" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link to="/signup">
              <Button>Start Free</Button>
            </Link>
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
        <div className="flex items-center justify-center gap-3">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
              Start Scheduling Free
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

      {/* Supported Platforms */}
      <section className="container mx-auto px-6 py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="font-reckless text-4xl font-medium mb-4">Works with all your platforms</h2>
          <p className="text-lg text-muted-foreground">Connect once, publish everywhere</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <Twitter className="w-6 h-6 text-google-blue" />
            <span className="font-medium">Twitter / X</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <Linkedin className="w-6 h-6 text-google-blue" />
            <span className="font-medium">LinkedIn</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <Instagram className="w-6 h-6 text-google-red" />
            <span className="font-medium">Instagram</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <Facebook className="w-6 h-6 text-google-blue" />
            <span className="font-medium">Facebook</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <Youtube className="w-6 h-6 text-google-red" />
            <span className="font-medium">YouTube</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <svg className="w-6 h-6" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z" fill="url(#a)"/>
              <path d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z" fill="url(#b)"/>
              <path d="M96 162c-14.152 0-24.336-.007-32.276-.777-7.849-.761-12.87-2.223-16.877-4.741a36 36 0 0 1-11.33-11.329c-2.517-4.007-3.98-9.028-4.74-16.877C30.007 120.336 30 110.152 30 96c0-14.152.007-24.336.777-32.276.76-7.849 2.223-12.87 4.74-16.877a36 36 0 0 1 11.33-11.33c4.007-2.517 9.028-3.98 16.877-4.74C71.663 30.007 81.847 30 96 30c14.152 0 24.336.007 32.276.777 7.849.76 12.87 2.223 16.877 4.74a36 36 0 0 1 11.329 11.33c2.518 4.007 3.98 9.028 4.741 16.877.77 7.94.777 18.124.777 32.276 0 14.152-.007 24.336-.777 32.276-.761 7.849-2.223 12.87-4.741 16.877a36 36 0 0 1-11.329 11.329c-4.007 2.518-9.028 3.98-16.877 4.741-7.94.77-18.124.777-32.276.777Z" fill="url(#c)"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M96 30c-14.152 0-24.336.007-32.276.777-7.849.76-12.87 2.223-16.877 4.74a36 36 0 0 0-11.33 11.33c-2.517 4.007-3.98 9.028-4.74 16.877C30.007 71.663 30 81.847 30 96v-.054l32.284-32.284a6 6 0 0 1 8.486 0l13.526 13.526 44.758-44.757A6 6 0 0 1 133.296 30H96Z" fill="#000" fill-opacity=".4"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M96 162c14.152 0 24.336-.007 32.276-.777 7.849-.761 12.87-2.223 16.877-4.741a36 36 0 0 0 11.329-11.329c2.518-4.007 3.98-9.028 4.741-16.877.77-7.94.777-18.124.777-32.276v-5.59l-8.122 8.121a6 6 0 0 1-8.485 0l-22.269-22.269-44.758 44.758a6 6 0 0 1-8.485 0l-13.526-13.526L30 134.024C30.653 146.927 32.284 155.052 38.153 162H96Z" fill="#000" fill-opacity=".4"/>
              <defs>
                <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(45 -10.339 113.339) scale(175.388)">
                  <stop stop-color="#FFF478"/>
                  <stop offset=".474" stop-color="#FFB02E"/>
                  <stop offset="1" stop-color="#F70A8D"/>
                </radialGradient>
                <radialGradient id="b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(45 -10.339 113.339) scale(175.388)">
                  <stop stop-color="#FFF478"/>
                  <stop offset=".474" stop-color="#FFB02E"/>
                  <stop offset="1" stop-color="#F70A8D"/>
                </radialGradient>
                <radialGradient id="c" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(38.66608 0 0 39.02743 30.688 160.832)">
                  <stop stop-color="#3771C8"/>
                  <stop offset="1" stop-color="#3771C8" stop-opacity="0"/>
                </radialGradient>
              </defs>
            </svg>
            <span className="font-medium">Threads</span>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border border-border">
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
            </svg>
            <span className="font-medium">TikTok</span>
          </div>
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
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={postLogo} alt="Post" className="h-8" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Works</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://trybio.ai" className="text-muted-foreground hover:text-foreground">trybio.ai</a></li>
                <li><a href="https://trycreators.ai" className="text-muted-foreground hover:text-foreground">trycreators.ai</a></li>
                <li><a href="https://trymedia.ai" className="text-muted-foreground hover:text-foreground">trymedia.ai</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            Copyright © 2025 Works App, Inc. Built with ♥️ by <a href="https://works.xyz" className="hover:text-foreground transition-colors">Works</a>.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
