/**
 * Utility functions for formatting values in the application
 */

/**
 * Options for price formatting
 */
export interface FormatPriceOptions {
  /** Currency symbol to use (default: '$') */
  currencySymbol?: string;
  /** Number of decimal places (default: 2) */
  decimalPlaces?: number;
  /** Value to return for invalid prices (default: '$0.00') */
  fallbackValue?: string;
  /** Whether to show currency symbol (default: true) */
  showCurrencySymbol?: boolean;
  /** Whether to use grouping separators for thousands (default: true) */
  useGrouping?: boolean;
}

/**
 * PUBLIC_INTERFACE
 * Formats a price value with proper currency formatting
 * 
 * This function safely handles any input type and returns a properly formatted price string.
 * It converts the input to a number, handles undefined/null/NaN values, and applies formatting.
 * 
 * @param price - The price value to format (can be any type)
 * @param options - Formatting options
 * @returns Formatted price string
 * 
 * @example
 * // Returns "$123.45"
 * formatPrice(123.45);
 * 
 * @example
 * // Returns "123,45 €"
 * formatPrice(123.45, { currencySymbol: '€', decimalPlaces: 2, showCurrencySymbol: true });
 * 
 * @example
 * // Returns "N/A" for invalid input
 * formatPrice(null, { fallbackValue: 'N/A' });
 */
export const formatPrice = (
  price: any,
  options: FormatPriceOptions = {}
): string => {
  // Default options
  const {
    currencySymbol = '$',
    decimalPlaces = 2,
    fallbackValue = `${currencySymbol}0.${'0'.repeat(decimalPlaces)}`,
    showCurrencySymbol = true,
    useGrouping = true,
  } = options;

  // Handle undefined, null, or invalid input
  if (price === undefined || price === null) {
    return fallbackValue;
  }

  // Convert to number
  const numericPrice = Number(price);

  // Check if conversion resulted in a valid number
  if (isNaN(numericPrice)) {
    return fallbackValue;
  }

  try {
    // Format the number using Intl.NumberFormat for localization support
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: useGrouping,
    });

    const formattedNumber = formatter.format(numericPrice);

    // Add currency symbol if needed
    if (showCurrencySymbol) {
      return `${currencySymbol}${formattedNumber}`;
    }

    return formattedNumber;
  } catch (error) {
    // Fallback in case of any error during formatting
    console.error('Error formatting price:', error);
    return fallbackValue;
  }
};

/**
 * PUBLIC_INTERFACE
 * Formats a number as a percentage
 * 
 * @param value - The value to format as percentage
 * @param decimalPlaces - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * // Returns "42%"
 * formatPercentage(0.42);
 */
export const formatPercentage = (
  value: any,
  decimalPlaces: number = 0
): string => {
  // Handle undefined, null, or invalid input
  if (value === undefined || value === null) {
    return '0%';
  }

  // Convert to number
  const numericValue = Number(value);

  // Check if conversion resulted in a valid number
  if (isNaN(numericValue)) {
    return '0%';
  }

  try {
    // Multiply by 100 to convert to percentage
    const percentValue = numericValue < 1 ? numericValue * 100 : numericValue;
    
    // Format with specified decimal places
    return `${percentValue.toFixed(decimalPlaces)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
};