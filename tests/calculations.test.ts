import { describe, it, expect } from 'vitest';
import {
  bmiAndCategory,
  bmrMifflinStJeor,
  tdeeFromBmr,
  targetCaloriesFromGoal,
  macrosFromCalories,
  calculateBasics,
  calculateGoals,
  calculateHealthMetrics,
} from '@/lib/calculations';

describe('Health Calculations', () => {
  describe('BMI calculations', () => {
    it('should calculate BMI and category correctly', () => {
      // Normal weight
      const result1 = bmiAndCategory(70, 175);
      expect(result1.bmi).toBeCloseTo(22.9, 1);
      expect(result1.category).toBe('normal');

      // Underweight
      const result2 = bmiAndCategory(45, 175);
      expect(result2.bmi).toBeCloseTo(14.7, 1);
      expect(result2.category).toBe('underweight');

      // Overweight
      const result3 = bmiAndCategory(85, 175);
      expect(result3.bmi).toBeCloseTo(27.8, 1);
      expect(result3.category).toBe('overweight');

      // Obese
      const result4 = bmiAndCategory(95, 175);
      expect(result4.bmi).toBeCloseTo(31.0, 1);
      expect(result4.category).toBe('obese');
    });
  });

  describe('BMR calculations', () => {
    it('should calculate BMR for males correctly', () => {
      const bmr = bmrMifflinStJeor(80, 180, 30, 'male');
      expect(bmr).toBe(1780);
    });

    it('should calculate BMR for females correctly', () => {
      const bmr = bmrMifflinStJeor(60, 165, 25, 'female');
      expect(bmr).toBe(1345);
    });
  });

  describe('TDEE calculations', () => {
    it('should calculate TDEE from BMR and activity level', () => {
      const bmr = 1800;
      
      expect(tdeeFromBmr(bmr, 'sedentary')).toBe(2160);
      expect(tdeeFromBmr(bmr, 'lightly_active')).toBe(2475);
      expect(tdeeFromBmr(bmr, 'moderately_active')).toBe(2790);
      expect(tdeeFromBmr(bmr, 'very_active')).toBe(3105);
      expect(tdeeFromBmr(bmr, 'extremely_active')).toBe(3420);
    });
  });

  describe('Target calories calculations', () => {
    const tdee = 2500;

    it('should maintain calories for maintain goal', () => {
      const result = targetCaloriesFromGoal(tdee, { type: 'maintain' });
      expect(result).toBe(2500);
    });

    it('should reduce calories for lose goal', () => {
      const result = targetCaloriesFromGoal(tdee, { 
        type: 'lose', 
        weeklyRateKg: 0.5 
      });
      // 0.5 kg/week * 7700 cal/kg / 7 days = 550 cal/day deficit
      expect(result).toBe(1950);
    });

    it('should increase calories for gain goal', () => {
      const result = targetCaloriesFromGoal(tdee, { 
        type: 'gain', 
        weeklyRateKg: 0.5 
      });
      // 0.5 kg/week * 7700 cal/kg / 7 days = 550 cal/day surplus
      expect(result).toBe(3050);
    });

    it('should use default rate when not specified', () => {
      const loseResult = targetCaloriesFromGoal(tdee, { type: 'lose' });
      const gainResult = targetCaloriesFromGoal(tdee, { type: 'gain' });
      
      expect(loseResult).toBe(1950); // Default 0.5 kg/week
      expect(gainResult).toBe(3050); // Default 0.5 kg/week
    });
  });

  describe('Macros calculations', () => {
    it('should calculate macros from calories and percentages', () => {
      const result = macrosFromCalories(2000, {
        carbsPct: 50,
        proteinPct: 30,
        fatPct: 20,
      });

      expect(result.carbsCalories).toBe(1000);
      expect(result.proteinCalories).toBe(600);
      expect(result.fatCalories).toBe(400);
      
      expect(result.carbsGrams).toBe(250); // 1000 cal / 4 cal/g
      expect(result.proteinGrams).toBe(150); // 600 cal / 4 cal/g
      expect(result.fatGrams).toBe(44); // 400 cal / 9 cal/g
    });

    it('should throw error for invalid percentages', () => {
      expect(() => {
        macrosFromCalories(2000, {
          carbsPct: 50,
          proteinPct: 30,
          fatPct: 25, // Totals 105%
        });
      }).toThrow('Macro percentages must add up to 100%');
    });
  });

  describe('Comprehensive calculations', () => {
    it('should calculate basic health metrics', () => {
      const result = calculateBasics(70, 'kg', 175, 'cm', 30, 'male');
      
      expect(result.weightKg).toBe(70);
      expect(result.heightCm).toBe(175);
      expect(result.bmi).toBeCloseTo(22.9, 1);
      expect(result.category).toBe('normal');
      expect(result.bmr).toBe(1649);
    });

    it('should calculate goal-based metrics', () => {
      const result = calculateGoals(1800, 'moderately_active', 'lose', 0.5);
      
      expect(result.tdee).toBe(2790);
      expect(result.targetCalories).toBe(2240);
    });

    it('should calculate comprehensive health metrics', () => {
      const result = calculateHealthMetrics({
        weight: 70,
        weightUnit: 'kg',
        height: 175,
        heightUnit: 'cm',
        age: 30,
        sex: 'male',
        activityLevel: 'moderately_active',
        goalType: 'maintain',
        macros: {
          carbsPct: 50,
          proteinPct: 25,
          fatPct: 25,
        },
      });

      expect(result.bmi).toBeCloseTo(22.9, 1);
      expect(result.category).toBe('normal');
      expect(result.bmr).toBe(1649);
      expect(result.tdee).toBe(2556);
      expect(result.targetCalories).toBe(2556);
      expect(result.macros).toBeDefined();
      expect(result.macros?.carbsGrams).toBe(320);
    });

    it('should handle unit conversions in comprehensive calculation', () => {
      const result = calculateHealthMetrics({
        weight: 154,
        weightUnit: 'lb',
        height: { feet: 5, inches: 9 },
        heightUnit: 'ft_in',
        age: 25,
        sex: 'female',
        activityLevel: 'lightly_active',
        goalType: 'lose',
        weeklyRateKg: 0.25,
      });

      expect(result.weightKg).toBeCloseTo(69.85, 1);
      expect(result.heightCm).toBeCloseTo(175.26, 1);
      expect(result.bmi).toBeCloseTo(22.7, 1);
      expect(result.category).toBe('normal');
    });
  });
});