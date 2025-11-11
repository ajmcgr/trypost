import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 social account",
        "10 scheduled posts per month",
        "Basic analytics",
        "Calendar view",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Creator",
      price: "$9",
      description: "For individual creators",
      features: [
        "5 social accounts",
        "Unlimited scheduled posts",
        "Advanced analytics",
        "Calendar & queue views",
        "Priority support",
      ],
      cta: "Start 14-Day Trial",
      highlighted: true,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For teams and agencies",
      features: [
        "Unlimited social accounts",
        "Unlimited posts",
        "Team collaboration",
        "Advanced analytics & reporting",
        "API access",
        "Dedicated support",
      ],
      cta: "Start 14-Day Trial",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Post</span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link to="/signup">
              <Button>Start Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Pricing Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include a 14-day free trial.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 rounded-3xl border-2 flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-105"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mx-auto mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <p className="text-muted-foreground mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-grow text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className="w-full rounded-2xl"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30 rounded-3xl">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards and debit cards through Stripe.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes! All paid plans include a 14-day free trial. No credit card required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-muted-foreground">
              Absolutely. Cancel your subscription anytime with no questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">Post</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Part of the Works.xyz ecosystem
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
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
            © 2024 Post by Works.xyz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
