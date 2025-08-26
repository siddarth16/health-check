"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calculator, Flame, Scale, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const scrollToCalculators = () => {
    document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 md:px-8 lg:px-16 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-neon/5 via-transparent to-neon-secondary/5 pointer-events-none" />
        
        <div className="relative text-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-foreground">Know your numbers.</span>
              <span className="block text-transparent bg-gradient-to-r from-neon via-neon-secondary to-neon bg-clip-text text-glow-lg animate-glow">
                Plan your goal.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Calculate your BMI, daily calories, and macro needs with our 
              science-based health calculators. Get the data you need to reach 
              your wellness goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/health-check">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-neon to-neon-green hover:from-neon-green hover:to-neon text-background font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-neon-lg group"
                  aria-label="Start your health assessment"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToCalculators}
                className="border-neon/50 text-neon hover:bg-neon/10 hover:border-neon font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-neon group"
                aria-label="View available calculators"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Calculators
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calculator Cards Section */}
      <section id="calculators" className="px-4 md:px-8 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade health calculators designed by nutrition experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BMI Calculator Card */}
            <Link href="/calculators/bmi" className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full transition-all duration-300 hover:border-neon/50 hover:shadow-neon hover:scale-105 hover:bg-card/80">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon/20 to-neon-green/20 rounded-xl flex items-center justify-center border border-neon/30 group-hover:border-neon/70 transition-colors">
                    <Calculator className="w-8 h-8 text-neon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon transition-colors">
                      BMI Calculator
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Calculate your Body Mass Index and understand your health status with personalized insights.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Calorie Calculator Card */}
            <Link href="/calculators/calories" className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full transition-all duration-300 hover:border-neon-secondary/50 hover:shadow-[0_0_30px_oklch(0.55_0.30_280_/_0.3)] hover:scale-105 hover:bg-card/80">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-secondary/20 to-neon-purple/20 rounded-xl flex items-center justify-center border border-neon-secondary/30 group-hover:border-neon-secondary/70 transition-colors">
                    <Flame className="w-8 h-8 text-neon-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon-secondary transition-colors">
                      Calorie Calculator
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Determine your daily caloric needs based on your goals and activity level.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Macro Calculator Card */}
            <Link href="/calculators/macros" className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full transition-all duration-300 hover:border-neon-green/50 hover:shadow-[0_0_30px_oklch(0.65_0.25_160_/_0.3)] hover:scale-105 hover:bg-card/80">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-green/20 to-neon/20 rounded-xl flex items-center justify-center border border-neon-green/30 group-hover:border-neon-green/70 transition-colors">
                    <Scale className="w-8 h-8 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon-green transition-colors">
                      Macro Calculator
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Plan your protein, carbs, and fat intake for optimal nutrition and performance.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
