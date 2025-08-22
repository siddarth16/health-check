"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateBasics, calculateGoals } from "@/lib/calculations";
import { toKg, toCm, fromKg, fromCm } from "@/lib/units";
import type { HeightFeetInches, WeightUnit, HeightUnit, Sex, ActivityLevel } from "@/types/health";

const calorieSchema = z.object({
  height: z.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
  age: z.number().min(10, "Age must be at least 10").max(120, "Age must be less than 120"),
  sex: z.enum(["male", "female"]),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]),
});

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: "extremely_active", label: "Extremely Active", description: "Very hard exercise, physical job" },
];

export function CaloriesCalculator() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  
  // Basic inputs
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(30);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderately_active");
  
  // Height inputs
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  
  // Weight input
  const [weightKg, setWeightKg] = useState<number>(70);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert display values to consistent units for calculation
  const getHeightInCm = (): number => {
    if (heightUnit === "cm") {
      return heightCm;
    } else {
      return toCm({ feet: heightFeet, inches: heightInches }, "ft_in");
    }
  };

  const getWeightInKg = (): number => {
    if (weightUnit === "kg") {
      return weightKg;
    } else {
      return toKg(weightKg, "lb");
    }
  };

  // Handle unit conversions
  const toggleHeightUnit = () => {
    const currentHeightCm = getHeightInCm();
    
    if (heightUnit === "cm") {
      const feetInches = fromCm(currentHeightCm, "ft_in") as HeightFeetInches;
      setHeightFeet(feetInches.feet);
      setHeightInches(Math.round(feetInches.inches * 10) / 10);
      setHeightUnit("ft_in");
    } else {
      setHeightCm(Math.round(currentHeightCm * 10) / 10);
      setHeightUnit("cm");
    }
  };

  const toggleWeightUnit = () => {
    const currentWeightKg = getWeightInKg();
    
    if (weightUnit === "kg") {
      const weightLb = fromKg(currentWeightKg, "lb");
      setWeightKg(Math.round(weightLb * 10) / 10);
      setWeightUnit("lb");
    } else {
      setWeightKg(Math.round(currentWeightKg * 10) / 10);
      setWeightUnit("kg");
    }
  };

  // Calculate calories and validate
  const calculateCalories = () => {
    const heightInCm = getHeightInCm();
    const weightInKg = getWeightInKg();

    const validation = calorieSchema.safeParse({
      height: heightInCm,
      weight: weightInKg,
      age,
      sex,
      activityLevel,
    });

    if (!validation.success) {
      return { result: null, errors: validation.error.issues };
    }

    const basics = calculateBasics(weightInKg, "kg", heightInCm, "cm", age, sex);
    const goals = calculateGoals(basics.bmr, activityLevel, "maintain");
    
    return {
      result: {
        bmr: basics.bmr,
        tdee: goals.tdee,
      },
      errors: []
    };
  };

  const { result, errors: validationErrors } = calculateCalories();
  
  // Update errors only when validation changes
  React.useEffect(() => {
    const newErrors: Record<string, string> = {};
    validationErrors.forEach((issue) => {
      newErrors[issue.path[0] as string] = issue.message;
    });
    setErrors(newErrors);
  }, [validationErrors.length]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calorie (TDEE) Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sex Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sex</label>
            <div className="flex gap-2">
              <Button
                variant={sex === "male" ? "default" : "outline"}
                onClick={() => setSex("male")}
                type="button"
                className="flex-1"
              >
                Male
              </Button>
              <Button
                variant={sex === "female" ? "default" : "outline"}
                onClick={() => setSex("female")}
                type="button"
                className="flex-1"
              >
                Female
              </Button>
            </div>
            {errors.sex && (
              <p className="text-sm text-destructive">{errors.sex}</p>
            )}
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="30"
              />
              <span className="flex items-center text-sm text-muted-foreground">years</span>
            </div>
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age}</p>
            )}
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Height</label>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHeightUnit}
                type="button"
              >
                {heightUnit === "cm" ? "Switch to ft/in" : "Switch to cm"}
              </Button>
            </div>
            
            {heightUnit === "cm" ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  placeholder="175"
                  step="0.1"
                />
                <span className="flex items-center text-sm text-muted-foreground">cm</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Number(e.target.value))}
                  placeholder="5"
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">ft</span>
                <Input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  placeholder="9"
                  step="0.1"
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">in</span>
              </div>
            )}
            {errors.height && (
              <p className="text-sm text-destructive">{errors.height}</p>
            )}
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Weight</label>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWeightUnit}
                type="button"
              >
                {weightUnit === "kg" ? "Switch to lb" : "Switch to kg"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                placeholder={weightUnit === "kg" ? "70" : "154"}
                step="0.1"
              />
              <span className="flex items-center text-sm text-muted-foreground">{weightUnit}</span>
            </div>
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight}</p>
            )}
          </div>

          {/* Activity Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {activityLevels.map((activity) => (
                <Button
                  key={activity.value}
                  variant={activityLevel === activity.value ? "default" : "outline"}
                  onClick={() => setActivityLevel(activity.value)}
                  type="button"
                  className="h-auto p-3 text-left flex flex-col items-start"
                >
                  <span className="font-medium text-sm">{activity.label}</span>
                  <span className="text-xs opacity-70">{activity.description}</span>
                </Button>
              ))}
            </div>
            {errors.activityLevel && (
              <p className="text-sm text-destructive">{errors.activityLevel}</p>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.bmr}</div>
                  <div className="text-sm text-muted-foreground">BMR (calories/day)</div>
                  <div className="text-xs text-muted-foreground mt-1">Basal Metabolic Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.tdee}</div>
                  <div className="text-sm text-muted-foreground">TDEE (calories/day)</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Daily Energy Expenditure</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Text Block */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Understanding Your Calorie Needs</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your Total Daily Energy Expenditure (TDEE) represents the total calories you burn in a day, 
              including your Basal Metabolic Rate (BMR) plus calories burned through physical activity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <strong>BMR (Basal Metabolic Rate):</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Calories burned at rest</li>
                  <li>• Used for basic body functions</li>
                  <li>• Calculated using Mifflin-St Jeor equation</li>
                  <li>• Varies by age, sex, height, and weight</li>
                </ul>
              </div>
              <div>
                <strong>TDEE Applications:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Maintain weight: Eat TDEE calories</li>
                  <li>• Lose weight: Eat below TDEE</li>
                  <li>• Gain weight: Eat above TDEE</li>
                  <li>• Activity level greatly affects TDEE</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}