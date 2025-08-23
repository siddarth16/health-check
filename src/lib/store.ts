"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Sex, ActivityLevel, GoalType, HeightUnit, WeightUnit } from '@/types/health';

export interface HealthCheckState {
  // Step 1: Basics
  sex: Sex;
  age: number;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  
  // Step 2: Activity
  activityLevel: ActivityLevel;
  
  // Step 3: Goal
  goalType: GoalType;
  weeklyRateKg: number;
  
  // Step 4: Navigation
  currentStep: number;
}

export interface HealthCheckActions {
  // Basic setters
  setSex: (sex: Sex) => void;
  setAge: (age: number) => void;
  setHeightUnit: (unit: HeightUnit) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  setHeightCm: (height: number) => void;
  setHeightFeet: (feet: number) => void;
  setHeightInches: (inches: number) => void;
  setWeightKg: (weight: number) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setGoalType: (goal: GoalType) => void;
  setWeeklyRateKg: (rate: number) => void;
  setCurrentStep: (step: number) => void;
  
  // Bulk actions
  hydrateFromParams: (params: URLSearchParams) => void;
  reset: () => void;
}

export type HealthCheckStore = HealthCheckState & HealthCheckActions;

const initialState: HealthCheckState = {
  sex: "male",
  age: 30,
  heightUnit: "cm",
  weightUnit: "kg",
  heightCm: 175,
  heightFeet: 5,
  heightInches: 9,
  weightKg: 70,
  activityLevel: "moderately_active",
  goalType: "maintain",
  weeklyRateKg: 0.5,
  currentStep: 0,
};

export const useHealthCheckStore = create<HealthCheckStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Basic setters
      setSex: (sex) => set({ sex }),
      setAge: (age) => set({ age }),
      setHeightUnit: (heightUnit) => set({ heightUnit }),
      setWeightUnit: (weightUnit) => set({ weightUnit }),
      setHeightCm: (heightCm) => set({ heightCm }),
      setHeightFeet: (heightFeet) => set({ heightFeet }),
      setHeightInches: (heightInches) => set({ heightInches }),
      setWeightKg: (weightKg) => set({ weightKg }),
      setActivityLevel: (activityLevel) => set({ activityLevel }),
      setGoalType: (goalType) => set({ goalType }),
      setWeeklyRateKg: (weeklyRateKg) => set({ weeklyRateKg }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      
      // Bulk actions
      hydrateFromParams: (params) => {
        const updates: Partial<HealthCheckState> = {};
        
        const height = params.get('height');
        if (height) updates.heightCm = Number(height);
        
        const weight = params.get('weight');
        if (weight) updates.weightKg = Number(weight);
        
        const age = params.get('age');
        if (age) updates.age = Number(age);
        
        const sex = params.get('sex');
        if (sex === 'male' || sex === 'female') updates.sex = sex;
        
        const activityLevel = params.get('activityLevel');
        if (activityLevel && ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'].includes(activityLevel)) {
          updates.activityLevel = activityLevel as ActivityLevel;
        }
        
        const goalType = params.get('goalType');
        if (goalType && ['lose', 'maintain', 'gain'].includes(goalType)) {
          updates.goalType = goalType as GoalType;
        }
        
        const weeklyRateKg = params.get('weeklyRateKg');
        if (weeklyRateKg) updates.weeklyRateKg = Number(weeklyRateKg);
        
        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'health-check-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
    }
  )
);