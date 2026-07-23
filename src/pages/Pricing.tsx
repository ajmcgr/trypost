import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Billing = "monthly" | "yearly";

const Pricing = () => {
  const [billing, setBilling] = useState<Billing>("monthly");

  const plans = [
    {
      name: "Free",
      monthly: 0,
      yearly: 0,
      description: "Perfect for getting started",
      features: [
        "2 social networks",
        "10 scheduled posts per month",
        "Basic analytics",
        "Calendar view",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      monthly: 19,
      yearly: 190,
      description: "For individual creators",
      features: [
        "5 social networks",
        "Unlimited scheduled posts",
        "Advanced analytics",
        "Calendar & queue views",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      monthly: 49,
      yearly: 490,
      description: "For teams and agencies",
      features: [
        "All social networks",
        "Unlimited posts",
        "Team collaboration",
        "Advanced analytics & reporting",
        "API access",
        "Dedicated support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      {/* Pricing Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include a 14-day free trial.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              billing === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              billing === "yearly" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            Yearly
            <span className="text-xs text-primary font-semibold">Save ~17%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isFree = plan.monthly === 0;
            const amount = billing === "monthly" ? plan.monthly : plan.yearly;
            return (
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
                  <span className="text-5xl font-bold">${amount}</span>
                  {!isFree && (
                    <span className="text-muted-foreground">
                      /{billing === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                {!isFree && billing === "yearly" && (
                  <p className="text-sm text-primary font-medium mb-2">
                    ~17% off vs monthly
                  </p>
                )}
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
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            );
          })}
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

      <Footer />
    </div>
  );
};

export default Pricing;
