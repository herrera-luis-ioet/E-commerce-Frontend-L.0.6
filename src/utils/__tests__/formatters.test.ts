import { formatPrice, formatPercentage } from '../formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats a number with default options', () => {
      expect(formatPrice(123.45)).toBe('$123.45');
    });

    it('formats a number with custom currency symbol', () => {
      expect(formatPrice(123.45, { currencySymbol: '€' })).toBe('€123.45');
    });

    it('formats a number with custom decimal places', () => {
      expect(formatPrice(123.456, { decimalPlaces: 3 })).toBe('$123.456');
      expect(formatPrice(123.45, { decimalPlaces: 0 })).toBe('$123');
    });

    it('formats a number without currency symbol', () => {
      expect(formatPrice(123.45, { showCurrencySymbol: false })).toBe('123.45');
    });

    it('formats a number with grouping separators', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
      expect(formatPrice(1234567.89, { useGrouping: false })).toBe('$1234567.89');
    });

    it('handles string input that can be converted to a number', () => {
      expect(formatPrice('123.45')).toBe('$123.45');
    });

    it('handles undefined input', () => {
      expect(formatPrice(undefined)).toBe('$0.00');
      expect(formatPrice(undefined, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles null input', () => {
      expect(formatPrice(null)).toBe('$0.00');
      expect(formatPrice(null, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles NaN input', () => {
      expect(formatPrice(NaN)).toBe('$0.00');
      expect(formatPrice(NaN, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles non-numeric string input', () => {
      expect(formatPrice('abc')).toBe('$0.00');
      expect(formatPrice('abc', { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles object input', () => {
      expect(formatPrice({})).toBe('$0.00');
      expect(formatPrice({}, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles array input', () => {
      expect(formatPrice([])).toBe('$0.00');
      expect(formatPrice([1, 2, 3], { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles boolean input', () => {
      expect(formatPrice(true)).toBe('$1.00');
      expect(formatPrice(false)).toBe('$0.00');
    });

    it('handles custom fallback value', () => {
      expect(formatPrice(null, { fallbackValue: 'Price not available' })).toBe('Price not available');
    });
  });

  describe('formatPercentage', () => {
    it('formats a decimal as percentage', () => {
      expect(formatPercentage(0.42)).toBe('42%');
    });

    it('formats a number as percentage', () => {
      expect(formatPercentage(42)).toBe('42%');
    });

    it('formats with decimal places', () => {
      expect(formatPercentage(0.4267, 2)).toBe('42.67%');
    });

    it('handles undefined input', () => {
      expect(formatPercentage(undefined)).toBe('0%');
    });

    it('handles null input', () => {
      expect(formatPercentage(null)).toBe('0%');
    });

    it('handles NaN input', () => {
      expect(formatPercentage(NaN)).toBe('0%');
    });

    it('handles non-numeric string input', () => {
      expect(formatPercentage('abc')).toBe('0%');
    });
  });
});