"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { macrosFromCalories } from "@/lib/calculations";

const macrosSchema = z.object({
  calories: z.number().min(800, "Calories must be at least 800").max(5000, "Calories must be less than 5000"),
  carbsPct: z.number().min(0).max(100),
  proteinPct: z.number().min(0).max(100),
  fatPct: z.number().min(0).max(100),
}).refine((data) => {
  const total = data.carbsPct + data.proteinPct + data.fatPct;
  return Math.abs(total - 100) < 0.1;
}, {
  message: "Macro percentages must add up to 100%",
  path: ["total"],
});

export function MacrosCalculator() {
  const [calories, setCalories] = useState<number>(2000);
  const [carbsPct, setCarbsPct] = useState<number>(40);
  const [proteinPct, setProteinPct] = useState<number>(30);
  const [fatPct, setFatPct] = useState<number>(30);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ensure percentages always add up to 100
  const adjustPercentages = (newValue: number, type: 'carbs' | 'protein' | 'fat') => {
    let newCarbs = carbsPct;
    let newProtein = proteinPct;
    let newFat = fatPct;

    if (type === 'carbs') {
      newCarbs = newValue;
      const remaining = 100 - newCarbs;
      const currentOthers = proteinPct + fatPct;
      if (currentOthers > 0) {
        newProtein = Math.round((proteinPct / currentOthers) * remaining);
        newFat = 100 - newCarbs - newProtein;
      } else {
        newProtein = Math.round(remaining / 2);
        newFat = 100 - newCarbs - newProtein;
      }
    } else if (type === 'protein') {
      newProtein = newValue;
      const remaining = 100 - newProtein;
      const currentOthers = carbsPct + fatPct;
      if (currentOthers > 0) {
        newCarbs = Math.round((carbsPct / currentOthers) * remaining);
        newFat = 100 - newProtein - newCarbs;
      } else {
        newCarbs = Math.round(remaining / 2);
        newFat = 100 - newProtein - newCarbs;
      }
    } else { // fat
      newFat = newValue;
      const remaining = 100 - newFat;
      const currentOthers = carbsPct + proteinPct;
      if (currentOthers > 0) {
        newCarbs = Math.round((carbsPct / currentOthers) * remaining);
        newProtein = 100 - newFat - newCarbs;
      } else {
        newCarbs = Math.round(remaining / 2);
        newProtein = 100 - newFat - newCarbs;
      }
    }

    setCarbsPct(Math.max(0, Math.min(100, newCarbs)));
    setProteinPct(Math.max(0, Math.min(100, newProtein)));
    setFatPct(Math.max(0, Math.min(100, newFat)));
  };

  // Preset macro distributions
  const presets = [
    { name: "Balanced", carbs: 40, protein: 30, fat: 30 },
    { name: "Low Carb", carbs: 20, protein: 40, fat: 40 },
    { name: "High Carb", carbs: 60, protein: 20, fat: 20 },
    { name: "Keto", carbs: 5, protein: 25, fat: 70 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setCarbsPct(preset.carbs);
    setProteinPct(preset.protein);
    setFatPct(preset.fat);
  };

  // Calculate macros and validate
  const calculateMacros = () => {
    const validation = macrosSchema.safeParse({
      calories,
      carbsPct,
      proteinPct,
      fatPct,
    });

    if (!validation.success) {
      return { result: null, errors: validation.error.issues };
    }

    return { result: macrosFromCalories(calories, { carbsPct, proteinPct, fatPct }), errors: [] };
  };

  const { result, errors: validationErrors } = calculateMacros();
  
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
          <CardTitle>Macro Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calories Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Calories</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                placeholder="2000"
              />
              <span className="flex items-center text-sm text-muted-foreground">cal/day</span>
            </div>
            {errors.calories && (
              <p className="text-sm text-destructive">{errors.calories}</p>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Presets</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  type="button"
                  className="text-xs"
                >
                  {preset.name}
                  <div className="text-xs opacity-70 ml-1">
                    ({preset.carbs}/{preset.protein}/{preset.fat})
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Macro Sliders */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Macro Distribution</label>
            
            {/* Carbohydrates */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Carbohydrates</span>
                <span className="text-sm font-medium">{carbsPct}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={carbsPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'carbs')}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${carbsPct}%, #e2e8f0 ${carbsPct}%, #e2e8f0 100%)`
                  }}
                />
                <Input
                  type="number"
                  value={carbsPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'carbs')}
                  className="w-16 text-xs"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Protein</span>
                <span className="text-sm font-medium">{proteinPct}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proteinPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'protein')}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${proteinPct}%, #e2e8f0 ${proteinPct}%, #e2e8f0 100%)`
                  }}
                />
                <Input
                  type="number"
                  value={proteinPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'protein')}
                  className="w-16 text-xs"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fat</span>
                <span className="text-sm font-medium">{fatPct}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fatPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'fat')}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${fatPct}%, #e2e8f0 ${fatPct}%, #e2e8f0 100%)`
                  }}
                />
                <Input
                  type="number"
                  value={fatPct}
                  onChange={(e) => adjustPercentages(Number(e.target.value), 'fat')}
                  className="w-16 text-xs"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Total Check */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Total: {carbsPct + proteinPct + fatPct}%
                {Math.abs(carbsPct + proteinPct + fatPct - 100) > 0.1 && (
                  <span className="text-destructive ml-2">
                    (Must equal 100%)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.carbsGrams}g</div>
                  <div className="text-sm text-muted-foreground">Carbohydrates</div>
                  <div className="text-xs text-muted-foreground">{result.carbsCalories} cal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.proteinGrams}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-xs text-muted-foreground">{result.proteinCalories} cal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.fatGrams}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="text-xs text-muted-foreground">{result.fatCalories} cal</div>
                </div>
              </div>
            </div>
          )}

          {errors.total && (
            <p className="text-sm text-destructive text-center">{errors.total}</p>
          )}
        </CardContent>
      </Card>

      {/* SEO Text Block */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Understanding Macronutrients</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Macronutrients are the three main nutrients your body needs in large amounts: 
              carbohydrates, protein, and fat. Each provides energy and serves specific functions in your body.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <strong>Carbohydrates (4 cal/g):</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Primary energy source</li>
                  <li>• Fuel for brain and muscles</li>
                  <li>• Found in grains, fruits, vegetables</li>
                  <li>• 45-65% of total calories (general)</li>
                </ul>
              </div>
              <div>
                <strong>Protein (4 cal/g):</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Builds and repairs tissues</li>
                  <li>• Makes enzymes and hormones</li>
                  <li>• Found in meat, dairy, legumes</li>
                  <li>• 10-35% of total calories (general)</li>
                </ul>
              </div>
              <div>
                <strong>Fat (9 cal/g):</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Energy storage and insulation</li>
                  <li>• Absorbs fat-soluble vitamins</li>
                  <li>• Found in oils, nuts, avocados</li>
                  <li>• 20-35% of total calories (general)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}