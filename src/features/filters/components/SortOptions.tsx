import React from 'react';
import { useAppDispatch, useSortOption } from '../../../store/hooks';
import { setSortOption } from '../../../store/slices/filterSlice';
import Select, { SelectOption } from '../../../components/ui/Select';
import { SortOption } from '../../../types/product.types';

/**
 * Props for the SortOptions component
 */
interface SortOptionsProps {
  /** Label for the sort options */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * SortOptions component for sorting products
 * 
 * This component renders a dropdown for selecting sort options
 * and updates the Redux store when a sort option is selected.
 */
const SortOptions: React.FC<SortOptionsProps> = ({
  label = 'Sort By',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const currentSortOption = useSortOption();
  
  // Define sort options
  const sortOptions: SelectOption[] = [
    { value: SortOption.NEWEST, label: 'Newest' },
    { value: SortOption.PRICE_LOW_TO_HIGH, label: 'Price: Low to High' },
    { value: SortOption.PRICE_HIGH_TO_LOW, label: 'Price: High to Low' },
    { value: SortOption.NAME_A_TO_Z, label: 'Name: A to Z' },
    { value: SortOption.NAME_Z_TO_A, label: 'Name: Z to A' },
    { value: SortOption.HIGHEST_RATED, label: 'Highest Rated' },
    { value: SortOption.MOST_POPULAR, label: 'Most Popular' },
    { value: SortOption.BEST_SELLING, label: 'Best Selling' },
  ];
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortOption(e.target.value as SortOption));
  };

  return (
    <div className={`w-full ${className}`}>
      <Select
        label={label}
        options={sortOptions}
        value={currentSortOption}
        onChange={handleSortChange}
        fullWidth
        data-testid="sort-options"
      />
    </div>
  );
};

export default SortOptions;