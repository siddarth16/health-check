import type {
  Sex,
  BMICategory,
  ActivityLevel,
  GoalType,
  MacrosInput,
  MacrosResponse,
  HeightFeetInches,
} from '@/types/health';
import { ACTIVITY_MULTIPLIERS, CALORIES_PER_GRAM } from '@/types/health';
import { toKg, toCm } from '@/lib/units';

/**
 * Calculate BMI and return category
 */
export function bmiAndCategory(
  weightKg: number,
  heightCm: number
): { bmi: number; category: BMICategory } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  
  let category: BMICategory;
  if (bmi < 18.5) {
    category = 'underweight';
  } else if (bmi < 25) {
    category = 'normal';
  } else if (bmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }
  
  return { bmi: Number(bmi.toFixed(1)), category };
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 * BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
 * BMR (women) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
 */
export function bmrMifflinStJeor(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex
): number {
  const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? baseBmr + 5 : baseBmr - 161;
  
  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure from BMR and activity level
 */
export function tdeeFromBmr(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Calculate target calories based on goal type and weekly rate
 */
export function targetCaloriesFromGoal(
  tdee: number,
  goal: { type: GoalType; weeklyRateKg?: number }
): number {
  if (goal.type === 'maintain') {
    return tdee;
  }
  
  // Default rates if not specified
  const defaultWeeklyRate = 0.5; // 0.5 kg per week
  const weeklyRateKg = goal.weeklyRateKg ?? defaultWeeklyRate;
  
  // 1 kg of fat ≈ 7700 calories
  const caloriesPerKg = 7700;
  const dailyCalorieChange = (weeklyRateKg * caloriesPerKg) / 7;
  
  if (goal.type === 'lose') {
    return Math.round(tdee - dailyCalorieChange);
  } else { // gain
    return Math.round(tdee + dailyCalorieChange);
  }
}

/**
 * Calculate macronutrient distribution from calories and percentages
 */
export function macrosFromCalories(
  totalCalories: number,
  macros: MacrosInput
): MacrosResponse {
  // Validate percentages add up to 100
  const totalPct = macros.carbsPct + macros.proteinPct + macros.fatPct;
  if (Math.abs(totalPct - 100) > 0.1) {
    throw new Error('Macro percentages must add up to 100%');
  }
  
  // Calculate calories for each macro
  const carbsCalories = Math.round((totalCalories * macros.carbsPct) / 100);
  const proteinCalories = Math.round((totalCalories * macros.proteinPct) / 100);
  const fatCalories = Math.round((totalCalories * macros.fatPct) / 100);
  
  // Calculate grams for each macro
  const carbsGrams = Math.round(carbsCalories / CALORIES_PER_GRAM.carbs);
  const proteinGrams = Math.round(proteinCalories / CALORIES_PER_GRAM.protein);
  const fatGrams = Math.round(fatCalories / CALORIES_PER_GRAM.fat);
  
  return {
    carbsGrams,
    proteinGrams,
    fatGrams,
    carbsCalories,
    proteinCalories,
    fatCalories,
  };
}

/**
 * Calculate all basic health metrics from input
 */
export function calculateBasics(
  weight: number,
  weightUnit: 'kg' | 'lb',
  height: number | HeightFeetInches,
  heightUnit: 'cm' | 'ft_in',
  age: number,
  sex: Sex
) {
  const weightKg = toKg(weight, weightUnit);
  const heightCm = toCm(height, heightUnit);
  
  const { bmi, category } = bmiAndCategory(weightKg, heightCm);
  const bmr = bmrMifflinStJeor(weightKg, heightCm, age, sex);
  
  return {
    bmi,
    category,
    bmr,
    weightKg,
    heightCm,
  };
}

/**
 * Calculate goal-based metrics
 */
export function calculateGoals(
  bmr: number,
  activityLevel: ActivityLevel,
  goalType: GoalType,
  weeklyRateKg?: number
) {
  const tdee = tdeeFromBmr(bmr, activityLevel);
  const targetCalories = targetCaloriesFromGoal(tdee, {
    type: goalType,
    weeklyRateKg,
  });
  
  return {
    tdee,
    targetCalories,
  };
}

/**
 * Comprehensive health calculation combining all metrics
 */
export function calculateHealthMetrics(input: {
  weight: number;
  weightUnit: 'kg' | 'lb';
  height: number | HeightFeetInches;
  heightUnit: 'cm' | 'ft_in';
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  weeklyRateKg?: number;
  macros?: MacrosInput;
}) {
  const basics = calculateBasics(
    input.weight,
    input.weightUnit,
    input.height,
    input.heightUnit,
    input.age,
    input.sex
  );
  
  const goals = calculateGoals(
    basics.bmr,
    input.activityLevel,
    input.goalType,
    input.weeklyRateKg
  );
  
  const macroData = input.macros
    ? macrosFromCalories(goals.targetCalories, input.macros)
    : null;
  
  return {
    ...basics,
    ...goals,
    macros: macroData,
  };
}