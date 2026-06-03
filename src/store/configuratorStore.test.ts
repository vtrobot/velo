import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration
} from './configuratorStore';

describe('configuratorStore pure helpers', () => {
  describe('calculateTotalPrice', () => {
    it('should return base price for default configuration', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: []
      };
      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it('should add sport wheels price to the total', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: []
      };
      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it('should add precision-park optional feature price', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park']
      };
      expect(calculateTotalPrice(config)).toBe(45500);
    });

    it('should add flux-capacitor optional feature price', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['flux-capacitor']
      };
      expect(calculateTotalPrice(config)).toBe(45000);
    });

    it('should add all optionals and sport wheels together', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: ['precision-park', 'flux-capacitor']
      };
      expect(calculateTotalPrice(config)).toBe(52500);
    });

    it('should handle undefined or null optionals gracefully if passed', () => {
      const config = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
      } as unknown as CarConfiguration;
      expect(calculateTotalPrice(config)).toBe(40000);
    });
  });

  describe('calculateInstallment', () => {
    it('should calculate compound interest installment correctly for standard value', () => {
      // 40000 with 2% monthly rate over 12 months should be 3782.38
      expect(calculateInstallment(40000)).toBe(3782.38);
    });

    it('should calculate installment for 50000 correctly', () => {
      // 50000 * 0.02 * (1.02)^12 / ((1.02)^12 - 1) = 4727.979... -> 4727.98
      expect(calculateInstallment(50000)).toBe(4727.98);
    });

    it('should return 0 for 0 total price', () => {
      expect(calculateInstallment(0)).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('should format the price in BRL format', () => {
      const formatted = formatPrice(40000);
      // Replace any non-breaking spaces, narrow non-breaking spaces, or special spaces with standard space
      const normalized = formatted.replace(/\s/g, ' ');
      // The currency format for pt-BR is "R$ 40.000,00" (or similar depending on local settings, but currency should be R$)
      expect(normalized).toContain('R$');
      expect(normalized).toContain('40.000,00');
    });

    it('should correctly format decimals', () => {
      const formatted = formatPrice(3782.38);
      const normalized = formatted.replace(/\s/g, ' ');
      expect(normalized).toContain('R$');
      expect(normalized).toContain('3.782,38');
    });
  });
});
