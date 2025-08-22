import type { HeightFeetInches } from '@/types/health';

// Precise conversion factors
const KG_TO_LB = 2.20462262185;
const LB_TO_KG = 1 / KG_TO_LB;
const CM_TO_IN = 0.393700787402;
const IN_TO_CM = 1 / CM_TO_IN;
const FT_TO_IN = 12;

/**
 * Convert weight to kilograms
 */
export function toKg(weight: number, unit: 'kg' | 'lb'): number {
  if (unit === 'kg') return weight;
  return weight * LB_TO_KG;
}

/**
 * Convert weight from kilograms to specified unit
 */
export function fromKg(weightKg: number, targetUnit: 'kg' | 'lb'): number {
  if (targetUnit === 'kg') return weightKg;
  return weightKg * KG_TO_LB;
}

/**
 * Convert height to centimeters
 */
export function toCm(height: number | HeightFeetInches, unit: 'cm' | 'ft_in'): number {
  if (unit === 'cm') {
    if (typeof height !== 'number') {
      throw new Error('Height must be a number when unit is cm');
    }
    return height;
  }
  
  if (typeof height === 'number') {
    throw new Error('Height must be HeightFeetInches object when unit is ft_in');
  }
  
  const totalInches = (height.feet * FT_TO_IN) + height.inches;
  return totalInches * IN_TO_CM;
}

/**
 * Convert height from centimeters to specified unit
 */
export function fromCm(heightCm: number, targetUnit: 'cm' | 'ft_in'): number | HeightFeetInches {
  if (targetUnit === 'cm') return heightCm;
  
  const totalInches = heightCm * CM_TO_IN;
  const feet = Math.floor(totalInches / FT_TO_IN);
  const inches = totalInches % FT_TO_IN;
  
  return { feet, inches };
}

/**
 * Convert pounds to kilograms
 */
export function lbToKg(pounds: number): number {
  return pounds * LB_TO_KG;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLb(kilograms: number): number {
  return kilograms * KG_TO_LB;
}

/**
 * Convert inches to centimeters
 */
export function inToCm(inches: number): number {
  return inches * IN_TO_CM;
}

/**
 * Convert centimeters to inches
 */
export function cmToIn(centimeters: number): number {
  return centimeters * CM_TO_IN;
}

/**
 * Convert feet and inches to total centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = (feet * FT_TO_IN) + inches;
  return totalInches * IN_TO_CM;
}

/**
 * Convert centimeters to feet and inches
 */
export function cmToFeetInches(centimeters: number): HeightFeetInches {
  const totalInches = centimeters * CM_TO_IN;
  const feet = Math.floor(totalInches / FT_TO_IN);
  const inches = totalInches % FT_TO_IN;
  
  return { feet, inches };
}