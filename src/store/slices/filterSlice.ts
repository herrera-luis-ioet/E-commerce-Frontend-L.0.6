/**
 * Filter slice for Redux state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFilter, SortOption, ProductView } from '../../types/product.types';

/**
 * Interface for the filter state
 */
interface FilterState {
  filters: ProductFilter;
  sortOption: SortOption;
  viewMode: ProductView;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Initial state for the filter slice
 */
const initialState: FilterState = {
  filters: {},
  sortOption: SortOption.NEWEST,
  viewMode: 'grid',
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 12
};

/**
 * Filter slice definition
 */
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /**
     * Set filter criteria
     */
    setFilters: (state, action: PayloadAction<ProductFilter>) => {
      state.filters = action.payload;
      // Reset to first page when filters change
      state.currentPage = 1;
    },
    
    /**
     * Update a specific filter property
     */
    updateFilter: (state, action: PayloadAction<{ key: keyof ProductFilter; value: any }>) => {
      const { key, value } = action.payload;
      state.filters = {
        ...state.filters,
        [key]: value
      };
      // Reset to first page when filters change
      state.currentPage = 1;
    },
    
    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    
    /**
     * Set sort option
     */
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
    },
    
    /**
     * Set view mode (grid or list)
     */
    setViewMode: (state, action: PayloadAction<ProductView>) => {
      state.viewMode = action.payload;
    },
    
    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Reset to first page when search query changes
      state.currentPage = 1;
    },
    
    /**
     * Set current page for pagination
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    /**
     * Set items per page
     */
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      // Reset to first page when items per page changes
      state.currentPage = 1;
    },
    
    /**
     * Reset filter state
     */
    resetFilterState: () => initialState
  }
});

// Export actions
export const {
  setFilters,
  updateFilter,
  clearFilters,
  setSortOption,
  setViewMode,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  resetFilterState
} = filterSlice.actions;

// Export reducer
export default filterSlice.reducer;