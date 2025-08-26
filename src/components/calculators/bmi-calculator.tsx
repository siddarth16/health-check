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
    <div className="space-y-8">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-neon/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-foreground">BMI Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Height Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-foreground">Height</label>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHeightUnit}
                type="button"
                className="border-border hover:border-neon hover:text-neon transition-all duration-200"
              >
                {heightUnit === "cm" ? "Switch to ft/in" : "Switch to cm"}
              </Button>
            </div>
            
            {heightUnit === "cm" ? (
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  placeholder="175"
                  step="0.1"
                  className="bg-input border-border focus:border-neon focus:ring-neon/20 text-foreground"
                />
                <span className="flex items-center text-base text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Number(e.target.value))}
                  placeholder="5"
                  className="flex-1 bg-input border-border focus:border-neon focus:ring-neon/20 text-foreground"
                />
                <span className="flex items-center text-base text-muted-foreground">ft</span>
                <Input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  placeholder="9"
                  step="0.1"
                  className="flex-1 bg-input border-border focus:border-neon focus:ring-neon/20 text-foreground"
                />
                <span className="flex items-center text-base text-muted-foreground">in</span>
              </div>
            )}
            {errors.height && (
              <p className="text-sm text-destructive font-medium">{errors.height}</p>
            )}
          </div>

          {/* Weight Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-foreground">Weight</label>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWeightUnit}
                type="button"
                className="border-border hover:border-neon hover:text-neon transition-all duration-200"
              >
                {weightUnit === "kg" ? "Switch to lb" : "Switch to kg"}
              </Button>
            </div>
            <div className="flex gap-3">
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                placeholder={weightUnit === "kg" ? "70" : "154"}
                step="0.1"
                className="bg-input border-border focus:border-neon focus:ring-neon/20 text-foreground"
              />
              <span className="flex items-center text-base text-muted-foreground min-w-[3rem]">{weightUnit}</span>
            </div>
            {errors.weight && (
              <p className="text-sm text-destructive font-medium">{errors.weight}</p>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="pt-6 border-t border-border/30">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-neon/10 to-neon-green/5 border border-neon/20">
                  <div className="text-4xl font-bold text-neon text-glow">{result.bmi}</div>
                  <div className="text-sm text-muted-foreground mt-2">Your BMI</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <Badge variant={getBMICategoryColor(result.category)} className="text-base px-4 py-2 font-semibold">
                    {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2">Category</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Text Block */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Understanding BMI</h3>
          <div className="space-y-4 text-base text-muted-foreground">
            <p className="leading-relaxed">
              Body Mass Index (BMI) is a measure of body fat based on height and weight. 
              It&apos;s a useful screening tool but doesn&apos;t directly measure body fat percentage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-neon-secondary/10 to-neon-purple/5 border border-neon-secondary/20">
                <strong className="text-foreground text-lg block mb-3">BMI Categories:</strong>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-destructive mr-3"></span>Underweight: Below 18.5</li>
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon mr-3"></span>Normal: 18.5-24.9</li>
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-secondary mr-3"></span>Overweight: 25-29.9</li>
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-destructive mr-3"></span>Obese: 30 and above</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-neon-green/10 to-neon/5 border border-neon-green/20">
                <strong className="text-foreground text-lg block mb-3">Important Notes:</strong>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon-green mr-3"></span>BMI may not reflect muscle mass</li>
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon-green mr-3"></span>Results may vary by age and sex</li>
                  <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon-green mr-3"></span>Consult healthcare providers for guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}