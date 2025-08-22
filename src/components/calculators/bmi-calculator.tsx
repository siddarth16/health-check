"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bmiAndCategory } from "@/lib/calculations";
import { toKg, toCm, fromKg, fromCm } from "@/lib/units";
import type { HeightFeetInches, WeightUnit, HeightUnit } from "@/types/health";

const bmiSchema = z.object({
  height: z.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
});

export function BMICalculator() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  
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
      // Convert cm to ft/in
      const feetInches = fromCm(currentHeightCm, "ft_in") as HeightFeetInches;
      setHeightFeet(feetInches.feet);
      setHeightInches(Math.round(feetInches.inches * 10) / 10);
      setHeightUnit("ft_in");
    } else {
      // Convert ft/in to cm
      setHeightCm(Math.round(currentHeightCm * 10) / 10);
      setHeightUnit("cm");
    }
  };

  const toggleWeightUnit = () => {
    const currentWeightKg = getWeightInKg();
    
    if (weightUnit === "kg") {
      // Convert kg to lb
      const weightLb = fromKg(currentWeightKg, "lb");
      setWeightKg(Math.round(weightLb * 10) / 10);
      setWeightUnit("lb");
    } else {
      // Convert lb to kg
      setWeightKg(Math.round(currentWeightKg * 10) / 10);
      setWeightUnit("kg");
    }
  };

  // Calculate BMI and validate
  const calculateBMI = () => {
    const heightInCm = getHeightInCm();
    const weightInKg = getWeightInKg();

    const validation = bmiSchema.safeParse({
      height: heightInCm,
      weight: weightInKg,
    });

    if (!validation.success) {
      return { result: null, errors: validation.error.issues };
    }

    return { result: bmiAndCategory(weightInKg, heightInCm), errors: [] };
  };

  const { result, errors: validationErrors } = calculateBMI();
  
  // Update errors only when validation changes
  React.useEffect(() => {
    const newErrors: Record<string, string> = {};
    validationErrors.forEach((issue) => {
      newErrors[issue.path[0] as string] = issue.message;
    });
    setErrors(newErrors);
  }, [validationErrors.length]);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Results */}
          {result && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.bmi}</div>
                  <div className="text-sm text-muted-foreground">BMI</div>
                </div>
                <div className="text-center">
                  <Badge variant={getBMICategoryColor(result.category)} className="text-sm">
                    {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Category</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Text Block */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Understanding BMI</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Body Mass Index (BMI) is a measure of body fat based on height and weight. 
              It&apos;s a useful screening tool but doesn&apos;t directly measure body fat percentage.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <strong>BMI Categories:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Underweight: Below 18.5</li>
                  <li>• Normal: 18.5-24.9</li>
                  <li>• Overweight: 25-29.9</li>
                  <li>• Obese: 30 and above</li>
                </ul>
              </div>
              <div>
                <strong>Important Notes:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• BMI may not reflect muscle mass</li>
                  <li>• Results may vary by age and sex</li>
                  <li>• Consult healthcare providers for guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}