import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Know your numbers. Plan your goal.",
  description: "Health calculators and tools for better wellness planning.",
  path: "/",
});

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Know your numbers.{" "}
          <span className="text-primary">Plan your goal.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Calculate your BMI, daily calories, and macro needs with our 
          science-based health calculators. Get the data you need to reach 
          your wellness goals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" disabled>
            Get Started
          </Button>
          <Button variant="outline" size="lg" disabled>
            View Calculators
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">BMI Calculator</h3>
            <p className="text-muted-foreground">
              Calculate your Body Mass Index and understand your health status.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Calorie Calculator</h3>
            <p className="text-muted-foreground">
              Determine your daily caloric needs based on your goals and activity level.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Macro Calculator</h3>
            <p className="text-muted-foreground">
              Plan your protein, carbs, and fat intake for optimal nutrition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
