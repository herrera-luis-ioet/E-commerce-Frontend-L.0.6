import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useSearchQuery, useProducts } from '../../../store/hooks';
import { setSearchQuery } from '../../../store/slices/filterSlice';
import { filterProductsBySearchQuery } from '../../../utils/formatters';
import { Product } from '../../../types/product.types';
import Input from '../../../components/ui/Input';

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Callback function when products are filtered */
  onProductsFiltered?: (filteredProducts: Product[]) => void;
  /** Products to filter (if not provided, will use products from Redux store) */
  products?: Product[];
  /** Initial search query (if not provided, will use query from Redux store) */
  initialQuery?: string;
  /** Whether to update the Redux store with the search query */
  updateReduxStore?: boolean;
}

/**
 * PUBLIC_INTERFACE
 * SearchBar component with debounce functionality and client-side filtering
 * 
 * This component renders a search input that updates the Redux store
 * with a debounce and performs client-side filtering of products using the
 * filterProductsBySearchQuery utility function. It retrieves products from
 * the Redux store using the useProducts hook or accepts external products via props.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products...',
  debounceDelay = 500,
  className = '',
  onProductsFiltered,
  products: externalProducts,
  initialQuery,
  updateReduxStore = true,
}) => {
  const dispatch = useAppDispatch();
  const storeSearchQuery = useSearchQuery();
  
  // Get products from Redux store
  const storeProducts = useProducts();
  
  // Create a ref to store the debounce timeout
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine initial input value - use prop if provided, otherwise use Redux store
  const initialInputValue = initialQuery !== undefined ? initialQuery : storeSearchQuery;
  
  // Local state for the input value
  const [inputValue, setInputValue] = useState<string>(initialInputValue);
  // State for tracking if there was an error during filtering
  const [filterError, setFilterError] = useState<string | null>(null);
  
  // Use external products if provided, otherwise use products from Redux store
  const productsToFilter = useMemo(() => {
    try {
      // If external products are provided, use them
      if (externalProducts) {
        return externalProducts;
      }
      
      // Otherwise, use products from Redux store
      return storeProducts || [];
    } catch (error) {
      console.error('Error determining products to filter:', error);
      setFilterError('Error loading products');
      return [];
    }
  }, [externalProducts, storeProducts]);
  
  // Update local state when store value changes, but only if we're not using initialQuery
  useEffect(() => {
    if (initialQuery === undefined && storeSearchQuery !== inputValue) {
      setInputValue(storeSearchQuery);
    }
  }, [storeSearchQuery, initialQuery, inputValue]);
  
  // Filter products based on search query for client-side filtering
  const filteredProducts = useMemo(() => {
    try {
      setFilterError(null);
      
      // Only perform filtering if we have products
      if (!productsToFilter || productsToFilter.length === 0) {
        return [];
      }
      
      // Perform client-side filtering using the filterProductsBySearchQuery utility
      return filterProductsBySearchQuery(productsToFilter, inputValue);
    } catch (error) {
      console.error('Error filtering products:', error);
      setFilterError('Error filtering products');
      return [];
    }
  }, [inputValue, productsToFilter]);
  
  // Call the callback with filtered products if provided
  useEffect(() => {
    if (onProductsFiltered) {
      try {
        onProductsFiltered(filteredProducts);
      } catch (error) {
        console.error('Error in onProductsFiltered callback:', error);
      }
    }
  }, [filteredProducts, onProductsFiltered]);
  
  // Cleanup the debounce timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Debounced search handler to update Redux store
  const debouncedSearch = useCallback((value: string) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        // Only update Redux store if updateReduxStore is true
        if (updateReduxStore) {
          dispatch(setSearchQuery(value));
        }
      } catch (error) {
        console.error('Error updating search query in Redux store:', error);
      }
    }, debounceDelay);
  }, [dispatch, debounceDelay, updateReduxStore]);
  
  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      // Update local state immediately to reflect in the UI
      setInputValue(value);
      // Trigger debounced search for Redux update
      debouncedSearch(value);
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  }, [debouncedSearch]);
  
  // Handle clear button click
  const handleClear = useCallback(() => {
    try {
      // Update local state immediately to clear the input
      setInputValue('');
      
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      
      // Only update Redux store if updateReduxStore is true
      if (updateReduxStore) {
        // Update Redux store immediately without debounce when clearing
        dispatch(setSearchQuery(''));
      }
      
      // If onProductsFiltered is provided, call it with all products
      if (onProductsFiltered) {
        onProductsFiltered(productsToFilter);
      }
    } catch (error) {
      console.error('Error clearing search:', error);
    }
  }, [dispatch, onProductsFiltered, productsToFilter, updateReduxStore]);
  
  // Render search icon
  const searchIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      />
    </svg>
  );
  
  // Render clear button if there's input
  const clearButton = inputValue ? (
    <button 
      type="button" 
      onClick={handleClear}
      className="text-gray-400 hover:text-gray-600 focus:outline-none"
      aria-label="Clear search"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    </button>
  ) : null;

  return (
    <div className={`w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        startAdornment={searchIcon}
        endAdornment={clearButton}
        fullWidth
        aria-label="Search products"
        data-testid="search-input"
      />
      {filterError && (
        <div className="text-red-500 text-sm mt-1" role="alert">
          {filterError}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
