import { describe, it, expect } from 'vitest';
import {
  toKg,
  fromKg,
  toCm,
  fromCm,
  lbToKg,
  kgToLb,
  inToCm,
  cmToIn,
  feetInchesToCm,
  cmToFeetInches,
} from '@/lib/units';

describe('Unit Conversions', () => {
  describe('Weight conversions', () => {
    it('should convert pounds to kilograms', () => {
      expect(lbToKg(220)).toBeCloseTo(99.79, 2);
      expect(lbToKg(150)).toBeCloseTo(68.04, 2);
      expect(lbToKg(100)).toBeCloseTo(45.36, 2);
    });

    it('should convert kilograms to pounds', () => {
      expect(kgToLb(100)).toBeCloseTo(220.46, 2);
      expect(kgToLb(70)).toBeCloseTo(154.32, 2);
      expect(kgToLb(50)).toBeCloseTo(110.23, 2);
    });

    it('should convert weight using toKg function', () => {
      expect(toKg(100, 'kg')).toBe(100);
      expect(toKg(220, 'lb')).toBeCloseTo(99.79, 2);
    });

    it('should convert weight using fromKg function', () => {
      expect(fromKg(100, 'kg')).toBe(100);
      expect(fromKg(100, 'lb')).toBeCloseTo(220.46, 2);
    });
  });

  describe('Height conversions', () => {
    it('should convert inches to centimeters', () => {
      expect(inToCm(72)).toBeCloseTo(182.88, 2);
      expect(inToCm(60)).toBeCloseTo(152.4, 2);
      expect(inToCm(12)).toBeCloseTo(30.48, 2);
    });

    it('should convert centimeters to inches', () => {
      expect(cmToIn(180)).toBeCloseTo(70.87, 2);
      expect(cmToIn(150)).toBeCloseTo(59.06, 2);
      expect(cmToIn(30.48)).toBeCloseTo(12, 2);
    });

    it('should convert feet and inches to centimeters', () => {
      expect(feetInchesToCm(6, 0)).toBeCloseTo(182.88, 2);
      expect(feetInchesToCm(5, 10)).toBeCloseTo(177.8, 2);
      expect(feetInchesToCm(5, 0)).toBeCloseTo(152.4, 2);
    });

    it('should convert centimeters to feet and inches', () => {
      const result1 = cmToFeetInches(182.88);
      expect(result1.feet).toBe(6);
      expect(result1.inches).toBeCloseTo(0, 0);

      const result2 = cmToFeetInches(177.8);
      expect(result2.feet).toBe(5);
      expect(result2.inches).toBeCloseTo(10, 0);
    });

    it('should convert height using toCm function', () => {
      expect(toCm(180, 'cm')).toBe(180);
      expect(toCm({ feet: 6, inches: 0 }, 'ft_in')).toBeCloseTo(182.88, 2);
    });

    it('should convert height using fromCm function', () => {
      expect(fromCm(180, 'cm')).toBe(180);
      const result = fromCm(182.88, 'ft_in');
      if (typeof result === 'object') {
        expect(result.feet).toBe(6);
        expect(result.inches).toBeCloseTo(0, 0);
      }
    });
  });
});