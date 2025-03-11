import React, { useState, useEffect } from 'react';
import { useAppDispatch, useFilters } from '../../../store/hooks';
import { updateFilter } from '../../../store/slices/filterSlice';
import Input from '../../../components/ui/Input';

/**
 * Props for the PriceRangeFilter component
 */
interface PriceRangeFilterProps {
  /** Label for the price range filter */
  label?: string;
  /** Currency symbol */
  currencySymbol?: string;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * PriceRangeFilter component for filtering products by price range
 * 
 * This component renders min and max price inputs and updates
 * the Redux store when the price range changes.
 */
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  label = 'Price Range',
  currencySymbol = '$',
  debounceDelay = 500,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const filters = useFilters();
  
  // Local state for min and max price
  const [minPrice, setMinPrice] = useState<string>(
    filters.minPrice !== undefined ? filters.minPrice.toString() : ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    filters.maxPrice !== undefined ? filters.maxPrice.toString() : ''
  );
  
  // Update local state when filters change
  useEffect(() => {
    setMinPrice(filters.minPrice !== undefined ? filters.minPrice.toString() : '');
    setMaxPrice(filters.maxPrice !== undefined ? filters.maxPrice.toString() : '');
  }, [filters.minPrice, filters.maxPrice]);
  
  // Debounce function to limit how often the filter is updated
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  // Update min price in Redux store
  const updateMinPrice = debounce((value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    dispatch(updateFilter({ key: 'minPrice', value: numValue }));
  }, debounceDelay);
  
  // Update max price in Redux store
  const updateMaxPrice = debounce((value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    dispatch(updateFilter({ key: 'maxPrice', value: numValue }));
  }, debounceDelay);
  
  // Handle min price change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinPrice(value);
      updateMinPrice(value);
    }
  };
  
  // Handle max price change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMaxPrice(value);
      updateMaxPrice(value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder={`Min ${currencySymbol}`}
          value={minPrice}
          onChange={handleMinPriceChange}
          startAdornment={<span className="text-gray-500">{currencySymbol}</span>}
          aria-label="Minimum price"
          data-testid="min-price-input"
          fullWidth
        />
        <Input
          type="text"
          placeholder={`Max ${currencySymbol}`}
          value={maxPrice}
          onChange={handleMaxPriceChange}
          startAdornment={<span className="text-gray-500">{currencySymbol}</span>}
          aria-label="Maximum price"
          data-testid="max-price-input"
          fullWidth
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;