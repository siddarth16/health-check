import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo";
import { Check } from "lucide-react";

export const metadata = createMetadata({
  title: "Pricing",
  description: "Choose the plan that works best for your health goals.",
  path: "/pricing",
});

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic health calculations",
      features: [
        "BMI Calculator",
        "Basic Calorie Calculator", 
        "Simple Macro Calculator",
        "Health tips and guides",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "Advanced tools and personalized recommendations",
      features: [
        "All Free features",
        "Advanced Calorie Calculator with activity tracking",
        "Personalized Macro recommendations",
        "Meal planning suggestions",
        "Progress tracking and charts",
        "Export data to PDF",
        "Priority support",
      ],
      buttonText: "Coming Soon",
      popular: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with our free calculators or unlock advanced features with Pro
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                disabled
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-16">
        <p className="text-muted-foreground">
          All plans include access to our health calculators and educational content.
        </p>
      </div>
    </div>
  );
}