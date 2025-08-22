export type Sex = 'male' | 'female';

export type HeightUnit = 'cm' | 'ft_in';

export type WeightUnit = 'kg' | 'lb';

export type ActivityLevel = 
  | 'sedentary'      // Little to no exercise
  | 'lightly_active' // Light exercise 1-3 days/week
  | 'moderately_active' // Moderate exercise 3-5 days/week
  | 'very_active'    // Hard exercise 6-7 days/week
  | 'extremely_active'; // Very hard exercise, physical job

export type GoalType = 'lose' | 'maintain' | 'gain';

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BasicsInput {
  height: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: WeightUnit;
  age: number;
  sex: Sex;
}

export interface BasicsResponse {
  bmi: number;
  category: BMICategory;
  bmr: number; // Basal Metabolic Rate
}

export interface GoalInput {
  activityLevel: ActivityLevel;
  goalType: GoalType;
  weeklyRateKg?: number; // For lose/gain goals, kg per week
}

export interface GoalResponse {
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number;
}

export interface MacrosInput {
  carbsPct: number;   // 0-100
  proteinPct: number; // 0-100
  fatPct: number;     // 0-100
}

export interface MacrosResponse {
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  carbsCalories: number;
  proteinCalories: number;
  fatCalories: number;
}

export interface HeightFeetInches {
  feet: number;
  inches: number;
}

// Activity level multipliers for TDEE calculation
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

// Calorie content per gram of macronutrients
export const CALORIES_PER_GRAM = {
  carbs: 4,
  protein: 4,
  fat: 9,
} as const;