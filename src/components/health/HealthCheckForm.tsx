"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toKg, toCm, fromKg, fromCm } from "@/lib/units";
import { useHealthCheckStore } from "@/lib/store";
import type { 
  ActivityLevel, 
  GoalType, 
  HeightFeetInches 
} from "@/types/health";

// Validation schemas for each step
const basicsSchema = z.object({
  height: z.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
  age: z.number().min(10, "Age must be at least 10").max(120, "Age must be less than 120"),
  sex: z.enum(["male", "female"]),
});

const activitySchema = z.object({
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]),
});

const goalSchema = z.object({
  goalType: z.enum(["lose", "maintain", "gain"]),
  weeklyRateKg: z.number().min(0.25).max(1.0).optional(),
});

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: "extremely_active", label: "Extremely Active", description: "Very hard exercise, physical job" },
];

const goalTypes: { value: GoalType; label: string; description: string }[] = [
  { value: "lose", label: "Lose Weight", description: "Create a calorie deficit" },
  { value: "maintain", label: "Maintain Weight", description: "Stay at current weight" },
  { value: "gain", label: "Gain Weight", description: "Create a calorie surplus" },
];

export function HealthCheckForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasHydratedFromParams, setHasHydratedFromParams] = useState(false);

  // Zustand store
  const {
    // State
    sex, age, heightUnit, weightUnit, heightCm, heightFeet, heightInches, weightKg,
    activityLevel, goalType, weeklyRateKg, currentStep,
    // Actions
    setSex, setAge, setHeightUnit, setWeightUnit, setHeightCm, setHeightFeet, 
    setHeightInches, setWeightKg, setActivityLevel, setGoalType, setWeeklyRateKg, 
    setCurrentStep, hydrateFromParams
  } = useHealthCheckStore();

  // Hydrate from URL params on mount (only once)
  useEffect(() => {
    if (!hasHydratedFromParams && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check if we have any relevant params
      const hasRelevantParams = urlParams.has('height') || urlParams.has('weight') || 
                                urlParams.has('age') || urlParams.has('sex') || 
                                urlParams.has('activityLevel') || urlParams.has('goalType');
      
      if (hasRelevantParams) {
        hydrateFromParams(urlParams);
        // If we came from results, start at review step
        setCurrentStep(3);
      }
      setHasHydratedFromParams(true);
    }
  }, [hasHydratedFromParams, hydrateFromParams, setCurrentStep]);

  // Helper functions
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

  // Clear validation errors when values become valid
  useEffect(() => {
    const newErrors = { ...errors };
    
    // Clear age error if age becomes valid
    if (age >= 10 && age <= 120 && errors.age) {
      delete newErrors.age;
    }
    
    // Clear height error if height becomes valid
    const heightInCm = getHeightInCm();
    if (heightInCm >= 50 && heightInCm <= 300 && errors.height) {
      delete newErrors.height;
    }
    
    // Clear weight error if weight becomes valid
    const weightInKg = getWeightInKg();
    if (weightInKg >= 20 && weightInKg <= 300 && errors.weight) {
      delete newErrors.weight;
    }
    
    // Clear sex error if sex is selected
    if (sex && errors.sex) {
      delete newErrors.sex;
    }
    
    // Only update if errors actually changed
    if (Object.keys(newErrors).length !== Object.keys(errors).length || 
        Object.keys(newErrors).some(key => newErrors[key] !== errors[key])) {
      setErrors(newErrors);
    }
  }, [age, heightCm, heightFeet, heightInches, weightKg, sex, errors, heightUnit, weightUnit]);

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

  // Validation functions
  const validateCurrentStep = (): boolean => {
    setErrors({});
    
    try {
      if (currentStep === 0) {
        basicsSchema.parse({
          height: getHeightInCm(),
          weight: getWeightInKg(),
          age,
          sex,
        });
      } else if (currentStep === 1) {
        activitySchema.parse({ activityLevel });
      } else if (currentStep === 2) {
        const goalData = {
          goalType,
          ...(goalType !== "maintain" && { weeklyRateKg }),
        };
        goalSchema.parse(goalData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;

    // Serialize all data to query params
    const params = new URLSearchParams({
      height: getHeightInCm().toString(),
      weight: getWeightInKg().toString(),
      age: age.toString(),
      sex,
      activityLevel,
      goalType,
      ...(goalType !== "maintain" && { weeklyRateKg: weeklyRateKg.toString() }),
    });

    router.push(`/results?${params.toString()}`);
  };

  const steps = ["Basics", "Activity", "Goal", "Review"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Health Check Assessment</span>
          <span className="text-sm font-normal text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 0: Basics */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
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
              {errors.sex && <p className="text-sm text-destructive">{errors.sex}</p>}
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
              {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
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
              {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
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
              {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Activity */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Activity Level</h3>
            <p className="text-sm text-muted-foreground">
              Select your typical weekly physical activity level
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {activityLevels.map((activity) => (
                <Button
                  key={activity.value}
                  variant={activityLevel === activity.value ? "default" : "outline"}
                  onClick={() => setActivityLevel(activity.value)}
                  type="button"
                  className="h-auto p-4 text-left flex flex-col items-start"
                >
                  <span className="font-medium">{activity.label}</span>
                  <span className="text-sm opacity-70">{activity.description}</span>
                </Button>
              ))}
            </div>
            {errors.activityLevel && <p className="text-sm text-destructive">{errors.activityLevel}</p>}
          </div>
        )}

        {/* Step 2: Goal */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weight Goal</h3>
            <p className="text-sm text-muted-foreground">
              What is your weight management goal?
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {goalTypes.map((goal) => (
                <Button
                  key={goal.value}
                  variant={goalType === goal.value ? "default" : "outline"}
                  onClick={() => setGoalType(goal.value)}
                  type="button"
                  className="h-auto p-4 text-left flex flex-col items-start"
                >
                  <span className="font-medium">{goal.label}</span>
                  <span className="text-sm opacity-70">{goal.description}</span>
                </Button>
              ))}
            </div>

            {/* Weekly Rate Slider for lose/gain */}
            {goalType !== "maintain" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Weekly Rate ({goalType === "lose" ? "Loss" : "Gain"})
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.25"
                    max="1.0"
                    step="0.25"
                    value={weeklyRateKg}
                    onChange={(e) => setWeeklyRateKg(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.25 kg/week</span>
                    <span className="font-medium">{weeklyRateKg} kg/week</span>
                    <span>1.0 kg/week</span>
                  </div>
                </div>
                {errors.weeklyRateKg && <p className="text-sm text-destructive">{errors.weeklyRateKg}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Basic Info</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Sex: {sex === "male" ? "Male" : "Female"}</li>
                  <li>Age: {age} years</li>
                  <li>Height: {heightUnit === "cm" ? `${heightCm} cm` : `${heightFeet}'${heightInches}"`}</li>
                  <li>Weight: {weightUnit === "kg" ? `${weightKg} kg` : `${weightKg} lb`}</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Goals</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Activity: {activityLevels.find(a => a.value === activityLevel)?.label}</li>
                  <li>Goal: {goalTypes.find(g => g.value === goalType)?.label}</li>
                  <li>Rate: {goalType === "maintain" ? "Maintain weight" : `${weeklyRateKg} kg/week`}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            type="button"
          >
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              type="button"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              type="button"
              className="bg-green-600 hover:bg-green-700"
            >
              Calculate Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}