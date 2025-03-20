/**
 * Utility functions for formatting values in the application
 */

import { Product } from '../types/product.types';
import { SortOption } from '../types/product.types';

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

/**
 * PUBLIC_INTERFACE
 * Sorts an array of products based on the specified sort option
 * 
 * This function takes an array of products and a sort option, and returns a new sorted array.
 * It handles all sort options defined in the SortOption enum including price, name, date, rating, and popularity.
 * 
 * @param products - Array of products to sort
 * @param sortOption - Sort option from SortOption enum
 * @returns New sorted array of products
 * 
 * @example
 * // Returns products sorted by price from low to high
 * sortProducts(products, SortOption.PRICE_LOW_TO_HIGH);
 * 
 * @example
 * // Returns products sorted by name alphabetically
 * sortProducts(products, SortOption.NAME_A_TO_Z);
 */
export const sortProducts = (
  products: Product[],
  sortOption: SortOption
): Product[] => {
  // Create a copy of the array to avoid mutating the original
  const sortedProducts = [...products];

  switch (sortOption) {
    case SortOption.PRICE_LOW_TO_HIGH:
      return sortedProducts.sort((a, b) => a.price - b.price);

    case SortOption.PRICE_HIGH_TO_LOW:
      return sortedProducts.sort((a, b) => b.price - a.price);

    case SortOption.NAME_A_TO_Z:
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

    case SortOption.NAME_Z_TO_A:
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));

    case SortOption.NEWEST:
      return sortedProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case SortOption.OLDEST:
      return sortedProducts.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case SortOption.HIGHEST_RATED:
      return sortedProducts.sort((a, b) => b.rating - a.rating);

    case SortOption.MOST_POPULAR:
      return sortedProducts.sort((a, b) => b.ratingCount - a.ratingCount);

    case SortOption.BEST_SELLING:
      // For best selling, we would typically need sales data
      // As a fallback, we can use a combination of rating and popularity
      return sortedProducts.sort((a, b) => {
        // Calculate a score based on rating and rating count
        const scoreA = a.rating * Math.log(a.ratingCount + 1);
        const scoreB = b.rating * Math.log(b.ratingCount + 1);
        return scoreB - scoreA;
      });

    default:
      // Return unsorted array if sort option is not recognized
      return sortedProducts;
  }
};
