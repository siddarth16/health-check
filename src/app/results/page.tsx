import { z } from "zod";
import { createMetadata } from "@/lib/seo";
import { calculateHealthMetrics } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareActions } from "@/components/health/ShareActions";
import type { Sex, ActivityLevel, GoalType } from "@/types/health";

export const metadata = createMetadata({
  title: "Health Check Results",
  description: "View your calculated health metrics including BMI, daily calorie needs, and macro recommendations.",
  path: "/results",
});

// Validation schema for search params
const resultsSchema = z.object({
  height: z.string().transform(Number).pipe(z.number().min(50).max(300)),
  weight: z.string().transform(Number).pipe(z.number().min(20).max(300)),
  age: z.string().transform(Number).pipe(z.number().min(10).max(120)),
  sex: z.enum(["male", "female"]),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]),
  goalType: z.enum(["lose", "maintain", "gain"]),
  weeklyRateKg: z.string().transform(Number).pipe(z.number().min(0.25).max(1.0)).optional(),
});

interface ResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  // Parse and validate search params
  const parseResult = resultsSchema.safeParse(searchParams);

  if (!parseResult.success) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Results
          </h1>
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <p className="text-xl text-muted-foreground">
              Invalid or missing health check data.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Please complete the <a href="/health-check" className="text-primary hover:underline">health check form</a> to view your personalized results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const params = parseResult.data;

  // Calculate all health metrics server-side
  const results = calculateHealthMetrics({
    height: params.height,
    heightUnit: "cm",
    weight: params.weight,
    weightUnit: "kg",
    age: params.age,
    sex: params.sex as Sex,
    activityLevel: params.activityLevel as ActivityLevel,
    goalType: params.goalType as GoalType,
    weeklyRateKg: params.weeklyRateKg,
    // Default macro distribution for balanced diet
    macros: {
      carbsPct: 40,
      proteinPct: 30,
      fatPct: 30,
    },
  });

  const getBMICategoryColor = (category: string) => {
    switch (category) {
      case "underweight":
        return "destructive";
      case "normal":
        return "default";
      case "overweight":
        return "secondary";
      case "obese":
        return "destructive";
      default:
        return "default";
    }
  };

  const activityLabels: Record<ActivityLevel, string> = {
    sedentary: "Sedentary",
    lightly_active: "Lightly Active", 
    moderately_active: "Moderately Active",
    very_active: "Very Active",
    extremely_active: "Extremely Active",
  };

  const goalLabels: Record<GoalType, string> = {
    lose: "Lose Weight",
    maintain: "Maintain Weight",
    gain: "Gain Weight",
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Your Health Check Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your information: {params.sex === "male" ? "Male" : "Female"}, {params.age} years old, 
              {activityLabels[params.activityLevel as ActivityLevel].toLowerCase()} lifestyle
            </p>
          </div>
          <ShareActions />
        </div>
      </div>

      <div id="results-content" className="space-y-6">
        {/* Key Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BMI Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Body Mass Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.bmi}</div>
              <Badge variant={getBMICategoryColor(results.category)} className="mt-2">
                {results.category.charAt(0).toUpperCase() + results.category.slice(1)}
              </Badge>
            </CardContent>
          </Card>

          {/* BMR Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Basal Metabolic Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.bmr}</div>
              <p className="text-sm text-muted-foreground">calories/day</p>
            </CardContent>
          </Card>

          {/* TDEE Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily Energy Needs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.tdee}</div>
              <p className="text-sm text-muted-foreground">calories/day (TDEE)</p>
            </CardContent>
          </Card>

          {/* Target Calories Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Target Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{results.targetCalories}</div>
              <p className="text-sm text-muted-foreground">
                {goalLabels[params.goalType as GoalType]}
                {params.weeklyRateKg && params.goalType !== "maintain" && (
                  <span> ({params.weeklyRateKg} kg/week)</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Macro Breakdown */}
        {results.macros && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Macro Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on a balanced 40/30/30 carbs/protein/fat split for your target calories
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{results.macros.carbsGrams}g</div>
                  <div className="text-sm text-muted-foreground">Carbohydrates</div>
                  <div className="text-xs text-muted-foreground">{results.macros.carbsCalories} cal (40%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{results.macros.proteinGrams}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-xs text-muted-foreground">{results.macros.proteinCalories} cal (30%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{results.macros.fatGrams}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="text-xs text-muted-foreground">{results.macros.fatCalories} cal (30%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BMI Information */}
          <Card>
            <CardHeader>
              <CardTitle>BMI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Your BMI of <strong>{results.bmi}</strong> falls into the <strong>{results.category}</strong> category.</p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium">BMI Categories:</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Underweight: Below 18.5</div>
                  <div>• Normal: 18.5 - 24.9</div>
                  <div>• Overweight: 25.0 - 29.9</div>
                  <div>• Obese: 30.0 and above</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calorie Information */}
          <Card>
            <CardHeader>
              <CardTitle>Calorie Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>BMR ({results.bmr} cal):</strong> Calories burned at rest for basic body functions.</p>
                <p><strong>TDEE ({results.tdee} cal):</strong> Total daily calories including activity.</p>
                <p><strong>Target ({results.targetCalories} cal):</strong> Recommended daily intake for your goal.</p>
              </div>
              {params.goalType !== "maintain" && params.weeklyRateKg && (
                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
                  <strong>Goal Analysis:</strong> {params.goalType === "lose" ? "Losing" : "Gaining"} {params.weeklyRateKg} kg per week 
                  requires a daily {params.goalType === "lose" ? "deficit" : "surplus"} of approximately {Math.abs(results.tdee - results.targetCalories)} calories.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Important Disclaimer */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-2">Important Note:</p>
              <p>
                These calculations are estimates based on general formulas and should not replace professional medical advice. 
                Individual needs may vary based on genetics, health conditions, medications, and other factors. 
                Please consult with a healthcare professional or registered dietitian for personalized guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}