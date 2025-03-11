import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useSearchQuery } from '../../../store/hooks';
import { setSearchQuery } from '../../../store/slices/filterSlice';
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
}

/**
 * PUBLIC_INTERFACE
 * SearchBar component with debounce functionality
 * 
 * This component renders a search input that updates the Redux store
 * with a debounce to prevent excessive API calls.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products...',
  debounceDelay = 500,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const storeSearchQuery = useSearchQuery();
  
  // Local state for the input value
  const [inputValue, setInputValue] = useState(storeSearchQuery);
  
  // Update local state when store value changes
  useEffect(() => {
    setInputValue(storeSearchQuery);
  }, [storeSearchQuery]);
  
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearchQuery(value));
    }, debounceDelay),
    [dispatch, debounceDelay]
  );
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };
  
  // Handle clear button click
  const handleClear = () => {
    setInputValue('');
    dispatch(setSearchQuery(''));
  };
  
  // Render search icon
  const searchIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
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
    </div>
  );
};

/**
 * Debounce function to limit how often a function is called
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchBar;