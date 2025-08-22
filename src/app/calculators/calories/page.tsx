import { createMetadata } from "@/lib/seo";
import { CaloriesCalculator } from "@/components/calculators/calories-calculator";

export const metadata = createMetadata({
  title: "Calorie (TDEE) Calculator",
  description: "Calculate your Total Daily Energy Expenditure (TDEE) to determine how many calories you need per day.",
  path: "/calculators/calories",
});

export default function CalorieCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Calorie (TDEE) Calculator
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Total Daily Energy Expenditure (TDEE) is the total number of calories your body 
          burns in a day, including your Basal Metabolic Rate (BMR) and calories burned 
          through physical activity. Knowing your TDEE helps you understand how many calories 
          you need to maintain, lose, or gain weight based on your specific goals and 
          activity level.
        </p>
      </div>
      
      <CaloriesCalculator />
    </div>
  );
}