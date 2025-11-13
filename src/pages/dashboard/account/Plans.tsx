import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Plans = () => {
  const { canAccessBilling, userRole } = useWorkspace();

  const plans = [
    {
      name: "Creator",
      price: "$29",
      period: "/month",
      description: "Perfect for individual creators",
      features: [
        "5 social accounts",
        "Unlimited posts",
        "Basic analytics",
        "Content calendar",
        "AI caption generator",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      description: "For growing businesses",
      features: [
        "15 social accounts",
        "Unlimited posts",
        "Advanced analytics",
        "Content calendar",
        "AI caption generator",
        "Team collaboration",
        "Priority support",
      ],
      current: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited accounts",
        "Unlimited posts",
        "Advanced analytics",
        "Content calendar",
        "AI caption generator",
        "Team collaboration",
        "Dedicated support",
        "Custom integrations",
      ],
      current: false,
    },
  ];

  if (!canAccessBilling) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plans & Pricing</h1>
          <p className="text-muted-foreground">Workspace billing information</p>
        </div>

        <Alert className="max-w-2xl">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Only the workspace owner can view and manage billing. You are currently a {userRole} of this workspace.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plans & Pricing</h1>
        <p className="text-muted-foreground">Choose the plan that works best for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardHeader>
              {plan.current && (
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    Your Plan
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Plans;