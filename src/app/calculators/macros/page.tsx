import { createMetadata } from "@/lib/seo";
import { MacrosCalculator } from "@/components/calculators/macros-calculator";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export const metadata = createMetadata({
  title: "Macro Calculator",
  description: "Calculate your optimal macronutrient breakdown (protein, carbs, and fats) based on your goals and preferences.",
  path: "/calculators/macros",
});

const macrosFaqs = [
  {
    question: "What are macronutrients and why are they important?",
    answer: "Macronutrients are the three main nutrients your body needs in large amounts: carbohydrates (4 cal/g), protein (4 cal/g), and fats (9 cal/g). They provide energy and support essential body functions like muscle building, hormone production, and cellular repair."
  },
  {
    question: "What's a good macro split for weight loss?",
    answer: "For weight loss, try 40% carbs, 30% protein, 30% fat. Higher protein (1.6-2.2g per kg body weight) helps preserve muscle mass during calorie restriction. Adjust carbs and fats based on your activity level and personal preferences."
  },
  {
    question: "How much protein do I need for muscle building?",
    answer: "For muscle building, aim for 1.6-2.2g protein per kg of body weight (or 0.7-1g per pound). Spread protein intake throughout the day, consuming 20-40g per meal. Combine with resistance training for optimal muscle protein synthesis."
  },
  {
    question: "Should I track macros or just calories?",
    answer: "Start with calories for weight management, then add macro tracking for body composition goals. Macros matter more for athletes, bodybuilders, or those with specific health conditions. For general health, focus on whole foods and adequate protein."
  },
  {
    question: "What's the difference between simple and complex carbs?",
    answer: "Simple carbs (sugar, white bread) are quickly digested and cause rapid blood sugar spikes. Complex carbs (oats, vegetables, legumes) digest slowly, providing steady energy and more nutrients. Focus on complex carbs for better health and satiety."
  }
];

export default function MacroCalculatorPage() {
  return (
    <>
      <FaqJsonLd faqs={macrosFaqs} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Macro</span>{" "}
              <span className="text-transparent bg-gradient-to-r from-neon-green to-neon bg-clip-text">
                Calculator
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Macronutrients (macros) are the three main nutrients your body needs in large amounts: 
              protein, carbohydrates, and fats. This calculator helps you determine the optimal 
              distribution of these macros based on your caloric needs, fitness goals, and dietary 
              preferences. Proper macro balance supports muscle growth, fat loss, energy levels, 
              and overall health.
            </p>
          </div>
          
          <MacrosCalculator />
        </div>
      </div>
    </>
  );
}