import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Macro Calculator",
  description: "Calculate your optimal macronutrient breakdown (protein, carbs, and fats) based on your goals and preferences.",
  path: "/calculators/macros",
});

export default function MacroCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Macro Calculator
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Macronutrients (macros) are the three main nutrients your body needs in large amounts: 
          protein, carbohydrates, and fats. This calculator helps you determine the optimal 
          distribution of these macros based on your caloric needs, fitness goals, and dietary 
          preferences. Proper macro balance supports muscle growth, fat loss, energy levels, 
          and overall health.
        </p>
      </div>
      
      <div id="form-root" className="min-h-[50px] border-2 border-dashed border-muted-foreground/20 rounded-lg"></div>
    </div>
  );
}