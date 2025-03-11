import React from 'react';
import { useAppDispatch, useCategories, useFilters } from '../../../store/hooks';
import { updateFilter } from '../../../store/slices/filterSlice';
import Select, { SelectOption } from '../../../components/ui/Select';
import { Category } from '../../../types/product.types';

/**
 * Props for the CategoryFilter component
 */
interface CategoryFilterProps {
  /** Label for the category filter */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * CategoryFilter component for filtering products by category
 * 
 * This component renders a dropdown for selecting product categories
 * and updates the Redux store when a category is selected.
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  label = 'Category',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const categories = useCategories();
  const filters = useFilters();
  
  // Convert categories to select options
  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    ...categories.map((category: Category) => ({
      value: category.id,
      label: category.name,
    })),
  ];
  
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    dispatch(updateFilter({ 
      key: 'categoryId', 
      value: categoryId || undefined 
    }));
  };
  
  // If there are no categories, don't render the component
  if (!categories.length) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <Select
        label={label}
        options={categoryOptions}
        value={filters.categoryId || ''}
        onChange={handleCategoryChange}
        placeholder="Select a category"
        fullWidth
        data-testid="category-filter"
      />
    </div>
  );
};

export default CategoryFilter;