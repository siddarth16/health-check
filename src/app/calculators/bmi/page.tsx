import { createMetadata } from "@/lib/seo";
import { BMICalculator } from "@/components/calculators/bmi-calculator";

export const metadata = createMetadata({
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index (BMI) to understand your weight status and health risks.",
  path: "/calculators/bmi",
});

export default function BMICalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          BMI Calculator
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Body Mass Index (BMI) is a simple calculation using a person&apos;s height and weight. 
          The formula is BMI = kg/m² where kg is a person&apos;s weight in kilograms and m² is 
          their height in metres squared. BMI is used to categorize weight status and assess 
          potential health risks associated with being underweight, normal weight, overweight, 
          or obese.
        </p>
      </div>
      
      <BMICalculator />
    </div>
  );
}