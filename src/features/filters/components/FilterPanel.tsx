import React, { useState } from 'react';
import { useAppDispatch, useFilters } from '../../../store/hooks';
import { clearFilters } from '../../../store/slices/filterSlice';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortOptions from './SortOptions';

/**
 * Props for the FilterPanel component
 */
interface FilterPanelProps {
  /** Title for the filter panel */
  title?: string;
  /** Whether the filter panel is collapsible on mobile */
  collapsible?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * FilterPanel component as a container for all filter components
 * 
 * This component renders a panel containing all filter components
 * with a responsive design and a button to clear all filters.
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  title = 'Filters',
  collapsible = true,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const filters = useFilters();
  
  // State for mobile collapse
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Check if any filters are applied
  const hasActiveFilters = Object.keys(filters).length > 0;
  
  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      {/* Header with title and toggle button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        
        {collapsible && (
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleCollapse}
            aria-expanded={!isCollapsed}
            aria-controls="filter-panel-content"
          >
            <span className="sr-only">
              {isCollapsed ? 'Expand filters' : 'Collapse filters'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${isCollapsed ? '' : 'transform rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Filter content */}
      <div
        id="filter-panel-content"
        className={`space-y-6 ${collapsible && isCollapsed ? 'hidden md:block' : 'block'}`}
      >
        {/* Category filter */}
        <CategoryFilter />
        
        {/* Price range filter */}
        <PriceRangeFilter />
        
        {/* Sort options */}
        <SortOptions />
        
        {/* Additional filters can be added here */}
        
        {/* Clear filters button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              hasActiveFilters
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="clear-filters-button"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;