import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo";
import { Check, Star, Zap } from "lucide-react";

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
      icon: <Zap className="h-6 w-6" />,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      description: "Advanced tools and personalized insights (launching October 2025)",
      features: [
        "All Free features",
        "Advanced progress tracking & analytics",
        "Personalized meal planning",
        "Custom macro targets for specific goals",
        "Body composition tracking",
        "Export reports to PDF",
        "Priority email support",
      ],
      buttonText: "Join Waitlist (Oct 2025)",
      popular: true,
      icon: <Star className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Choose Your</span>{" "}
            <span className="text-neon">
              Plan
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free calculators today. Pro features launching October 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-neon/50 bg-gradient-to-br from-neon/5 to-neon-secondary/5 hover:border-neon hover:shadow-neon-lg scale-105' 
                  : 'border-border/50 bg-card/80 hover:border-neon/30 hover:shadow-neon'
              } backdrop-blur-sm`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-neon to-neon-secondary text-background font-semibold px-4 py-1.5 shadow-neon">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-neon/20 to-neon-secondary/20 border border-neon/30' 
                    : 'bg-gradient-to-br from-neon-green/20 to-neon/10 border border-neon-green/30'
                }`}>
                  <span className={plan.popular ? 'text-neon' : 'text-neon-green'}>
                    {plan.icon}
                  </span>
                </div>
                
                <CardTitle className="text-3xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 my-4">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-neon text-glow' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-lg">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-neon' : 'text-neon-green'}`} />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-neon to-neon-secondary hover:from-neon-secondary hover:to-neon text-background hover:scale-105 hover:shadow-neon-lg' 
                      : 'border-neon-green/50 text-neon-green hover:bg-neon-green/10 hover:border-neon-green hover:scale-105'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  disabled
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16 space-y-4">
          <div className="max-w-2xl mx-auto p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <p className="text-foreground text-lg font-medium mb-2">
              All calculators are free forever.
            </p>
            <p className="text-muted-foreground">
              Pro features will add advanced tracking and personalization.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Want early access to Pro features? Join our waitlist when it opens in mid-2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}