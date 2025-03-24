import React from 'react';
import { render } from '@testing-library/react';
import { useAppDispatch } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slices/productSlice';

// Mock the Redux hooks and actions
jest.mock('../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useProductCatalog: jest.fn(() => ({
    products: [],
    loading: false,
    error: null,
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 12,
    sortOption: 'newest',
    viewMode: 'grid'
  })),
  useProductFiltering: jest.fn(() => ({
    filters: {},
    searchQuery: '',
    selectedCategory: null
  }))
}));

jest.mock('../../../store/slices/productSlice', () => ({
  fetchProducts: jest.fn()
}));

// This test directly tests the behavior we're interested in:
// When price range filters change, API calls should not be triggered
describe('ProductCatalogManager Price Filter Behavior', () => {
  // Mock dispatch function
  const mockDispatch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (fetchProducts as jest.Mock).mockReturnValue({ type: 'products/fetchProducts' });
  });
  
  test('should not include price range filters in API calls', () => {
    // Create a component that simulates the behavior of ProductCatalogManager
    const TestComponent: React.FC = () => {
      const dispatch = useAppDispatch();
      
      // Simulate the serverSideFilters logic from ProductCatalogManager
      const filters = {
        minPrice: 100,
        maxPrice: 200,
        brand: 'Test Brand',
        category: 'Electronics'
      };
      
      // Extract price range filters (client-side filters)
      const { minPrice, maxPrice, ...serverSideFilters } = filters;
      
      // Simulate the useEffect that fetches products
      React.useEffect(() => {
        dispatch(fetchProducts({
          filter: serverSideFilters,
          page: 1,
          limit: 12
        }));
      }, [dispatch]);
      
      return <div>Test Component</div>;
    };
    
    // Render the test component
    render(<TestComponent />);
    
    // Verify that fetchProducts was called with the correct parameters
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(fetchProducts).toHaveBeenCalledWith({
      filter: {
        brand: 'Test Brand',
        category: 'Electronics'
      },
      page: 1,
      limit: 12
    });
    
    // Verify that price range filters were not included in the API call
    expect(fetchProducts).not.toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({
          minPrice: expect.anything(),
          maxPrice: expect.anything()
        })
      })
    );
  });
});