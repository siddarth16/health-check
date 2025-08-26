import { createMetadata } from "@/lib/seo";
import { CaloriesCalculator } from "@/components/calculators/calories-calculator";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export const metadata = createMetadata({
  title: "Calorie (TDEE) Calculator",
  description: "Calculate your Total Daily Energy Expenditure (TDEE) to determine how many calories you need per day.",
  path: "/calculators/calories",
});

const caloriesFaqs = [
  {
    question: "What is TDEE and how is it different from BMR?",
    answer: "TDEE (Total Daily Energy Expenditure) is the total calories you burn in a day, including BMR plus activity. BMR (Basal Metabolic Rate) is only the calories burned at rest for basic body functions. TDEE = BMR × activity level multiplier (1.2-1.9 depending on how active you are)."
  },
  {
    question: "How accurate are TDEE calculations?",
    answer: "TDEE calculations using the Mifflin-St Jeor equation are accurate within 10-15% for most people. Individual factors like genetics, muscle mass, hormones, and metabolic health can affect accuracy. Use TDEE as a starting point and adjust based on real-world results."
  },
  {
    question: "How do I choose the right activity level?",
    answer: "Activity levels: Sedentary (desk job, little exercise), Lightly Active (light exercise 1-3 days/week), Moderately Active (moderate exercise 3-5 days/week), Very Active (hard exercise 6-7 days/week), Extremely Active (very hard exercise, physical job). Choose based on your average weekly activity."
  },
  {
    question: "How many calories should I eat to lose weight?",
    answer: "For weight loss, eat 300-750 calories below your TDEE (0.25-0.75 kg/week loss). A deficit of 500 calories per day typically results in about 0.5 kg weight loss per week. Avoid going below your BMR for sustainable, healthy weight loss."
  },
  {
    question: "Should I recalculate my TDEE as I lose weight?",
    answer: "Yes, recalculate every 4-5 kg of weight loss or monthly. As you lose weight, your BMR decreases, so your TDEE also decreases. Regular recalculation ensures your calorie targets remain accurate for continued progress."
  }
];

export default function CalorieCalculatorPage() {
  return (
    <>
      <FaqJsonLd faqs={caloriesFaqs} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Calorie</span>{" "}
              <span className="text-transparent bg-gradient-to-r from-neon-secondary to-neon-purple bg-clip-text">
                Calculator
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Total Daily Energy Expenditure (TDEE) is the total number of calories your body 
              burns in a day, including your Basal Metabolic Rate (BMR) and calories burned 
              through physical activity. Knowing your TDEE helps you understand how many calories 
              you need to maintain, lose, or gain weight based on your specific goals and 
              activity level.
            </p>
          </div>
          
          <CaloriesCalculator />
        </div>
      </div>
    </>
  );
}