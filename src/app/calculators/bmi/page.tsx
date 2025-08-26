import { createMetadata } from "@/lib/seo";
import { BMICalculator } from "@/components/calculators/bmi-calculator";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export const metadata = createMetadata({
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index (BMI) to understand your weight status and health risks.",
  path: "/calculators/bmi",
});

const bmiFaqs = [
  {
    question: "What is BMI and how is it calculated?",
    answer: "BMI (Body Mass Index) is a measure of body fat based on height and weight. It's calculated by dividing weight in kilograms by height in meters squared (kg/m²). For example, if you weigh 70kg and are 1.75m tall, your BMI would be 70 ÷ (1.75 × 1.75) = 22.9."
  },
  {
    question: "What are the BMI categories and what do they mean?",
    answer: "BMI categories are: Underweight (below 18.5), Normal weight (18.5-24.9), Overweight (25.0-29.9), and Obese (30.0 and above). These categories help assess potential health risks, though BMI doesn't directly measure body fat percentage."
  },
  {
    question: "Is BMI accurate for everyone?",
    answer: "BMI may not be accurate for athletes with high muscle mass, elderly people, pregnant women, or certain ethnic groups. It doesn't distinguish between muscle and fat mass. For a complete health assessment, consult with a healthcare professional."
  },
  {
    question: "How often should I calculate my BMI?",
    answer: "For general health monitoring, calculating BMI monthly or quarterly is sufficient. If you're actively trying to lose or gain weight, weekly or bi-weekly calculations can help track progress alongside other health metrics."
  },
  {
    question: "Can BMI be used for children?",
    answer: "BMI for children and teens is calculated the same way but interpreted differently using age and sex-specific percentiles rather than fixed categories. Consult a pediatrician for proper interpretation of children's BMI results."
  }
];

export default function BMICalculatorPage() {
  return (
    <>
      <FaqJsonLd faqs={bmiFaqs} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">BMI</span>{" "}
              <span className="text-neon">
                Calculator
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Body Mass Index (BMI) is a simple calculation using a person&apos;s height and weight. 
              The formula is BMI = kg/m² where kg is a person&apos;s weight in kilograms and m² is 
              their height in metres squared. BMI is used to categorize weight status and assess 
              potential health risks associated with being underweight, normal weight, overweight, 
              or obese.
            </p>
          </div>
          
          <BMICalculator />
        </div>
      </div>
    </>
  );
}