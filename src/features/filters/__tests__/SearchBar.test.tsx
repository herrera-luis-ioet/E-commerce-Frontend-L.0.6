import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';
import { setSearchQuery } from '../../../store/slices/filterSlice';
import { Product } from '../../../types/product.types';

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    description: 'Latest iPhone model',
    price: 999.99,
    images: ['image1.jpg'],
    mainImage: 'image1.jpg',
    categoryId: 'smartphones',
    category: 'Smartphones',
    rating: 4.8,
    ratingCount: 120,
    stock: 50,
    sku: 'IP13P-128-GR',
    brand: 'Apple',
    featured: true,
    onSale: false,
    tags: ['smartphone', 'apple', 'ios'],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21',
    description: 'Latest Galaxy model with Android',
    price: 899.99,
    images: ['image2.jpg'],
    mainImage: 'image2.jpg',
    categoryId: 'smartphones',
    category: 'Smartphones',
    rating: 4.6,
    ratingCount: 95,
    stock: 30,
    sku: 'SGS21-128-BK',
    brand: 'Samsung',
    featured: true,
    onSale: true,
    discountPercentage: 10,
    tags: ['smartphone', 'samsung', 'android'],
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-07-05T11:45:00Z'
  },
  {
    id: '3',
    name: 'MacBook Pro 16-inch',
    description: 'Powerful laptop for professionals',
    price: 2399.99,
    images: ['image3.jpg'],
    mainImage: 'image3.jpg',
    categoryId: 'laptops',
    category: 'Laptops',
    rating: 4.9,
    ratingCount: 75,
    stock: 15,
    sku: 'MBP16-512-SG',
    brand: 'Apple',
    featured: true,
    onSale: false,
    tags: ['laptop', 'apple', 'macbook'],
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-08-12T16:10:00Z'
  },
  {
    id: '4',
    name: 'iPad Air',
    description: 'Lightweight tablet for everyday use',
    price: 599.99,
    images: ['image4.jpg'],
    mainImage: 'image4.jpg',
    categoryId: 'tablets',
    category: 'Tablets',
    rating: 4.7,
    ratingCount: 60,
    stock: 25,
    sku: 'IPAD-AIR-64-BL',
    brand: 'Apple',
    featured: false,
    onSale: true,
    discountPercentage: 5,
    tags: ['tablet', 'apple', 'ipad'],
    createdAt: '2023-04-18T08:45:00Z',
    updatedAt: '2023-09-01T10:30:00Z'
  }
];

// Mock Redux hooks
jest.mock('../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useSearchQuery: jest.fn(),
  useProducts: jest.fn()
}));

// Mock Input component
jest.mock('../../../components/ui/Input', () => {
  return ({ 
    value, 
    onChange, 
    placeholder, 
    startAdornment, 
    endAdornment,
    'data-testid': dataTestId
  }: any) => {
    // This ensures the mock input behaves like a controlled component
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <div data-testid="input-container">
        {startAdornment && <div data-testid="start-adornment">{startAdornment}</div>}
        <input
          data-testid={dataTestId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {endAdornment && <div data-testid="end-adornment">{endAdornment}</div>}
      </div>
    );
  };
});

// Import the mocked hooks
import { useAppDispatch, useSearchQuery, useProducts } from '../../../store/hooks';

describe('SearchBar Component', () => {
  // Setup mock functions
  const mockDispatch = jest.fn();
  const mockUseSearchQuery = useSearchQuery as jest.Mock;
  const mockUseAppDispatch = useAppDispatch as jest.Mock;
  const mockUseProducts = useProducts as jest.Mock;
  const mockOnProductsFiltered = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch.mockClear();
    mockOnProductsFiltered.mockClear();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseSearchQuery.mockReturnValue('');
    mockUseProducts.mockReturnValue(mockProducts);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Test rendering
  test('renders search input with correct placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search products...');
  });

  // Test custom placeholder
  test('renders with custom placeholder when provided', () => {
    render(<SearchBar placeholder="Find items..." />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('placeholder', 'Find items...');
  });

  // Test input change with debounce
  test('dispatches action after debounce delay', () => {
    render(<SearchBar debounceDelay={500} />);
    const input = screen.getByTestId('search-input');
    
    // Change input value
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Verify that dispatch is not called immediately
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Fast-forward time to trigger debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now dispatch should be called with the search query
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery('test'));
  });

  // Test clear button
  test('shows clear button when input has value and dispatches clear action on click', () => {
    mockUseSearchQuery.mockReturnValue('existing search');
    
    render(<SearchBar />);
    
    // Clear button should be visible
    const endAdornment = screen.getByTestId('end-adornment');
    expect(endAdornment).toBeInTheDocument();
    
    // Click the clear button (inside the end adornment)
    const clearButton = endAdornment.querySelector('button');
    if (clearButton) {
      fireEvent.click(clearButton);
    }
    
    // Dispatch should be called with empty string
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery(''));
  });

  // Test no clear button when input is empty
  test('does not show clear button when input is empty', () => {
    mockUseSearchQuery.mockReturnValue('');
    
    render(<SearchBar />);
    
    // End adornment (clear button) should not be present
    expect(screen.queryByTestId('end-adornment')).not.toBeInTheDocument();
  });

  // Test search icon is always present
  test('always shows search icon', () => {
    render(<SearchBar />);
    
    // Start adornment (search icon) should be present
    expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
  });

  // Test debounce cancellation
  test('cancels previous debounce when input changes rapidly', () => {
    render(<SearchBar debounceDelay={500} />);
    const input = screen.getByTestId('search-input');
    
    // Change input value multiple times
    fireEvent.change(input, { target: { value: 'a' } });
    
    // Fast-forward time partially
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Change input again before debounce triggers
    fireEvent.change(input, { target: { value: 'ab' } });
    
    // Fast-forward time partially again
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Change input once more
    fireEvent.change(input, { target: { value: 'abc' } });
    
    // Complete the debounce time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Dispatch should only be called once with the final value
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery('abc'));
  });

  // Test with custom className
  test('applies additional className when provided', () => {
    const { container } = render(<SearchBar className="custom-class" />);
    const searchBarContainer = container.firstChild as HTMLElement;
    expect(searchBarContainer).toHaveClass('custom-class');
  });

  // Test synchronization with Redux state
  test('updates local state when Redux state changes', () => {
    const { rerender } = render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    
    // Initial state
    expect(input).toHaveValue('');
    
    // Update Redux state
    mockUseSearchQuery.mockReturnValue('new search');
    
    // Re-render with new Redux state
    rerender(<SearchBar />);
    
    // Input should reflect the new Redux state
    expect(input).toHaveValue('new search');
  });

  // Test client-side filtering with onProductsFiltered callback
  test('filters products and calls onProductsFiltered when search query changes', () => {
    mockOnProductsFiltered.mockClear();
    render(<SearchBar onProductsFiltered={mockOnProductsFiltered} />);
    
    // Initial call with all products
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(mockProducts);
    mockOnProductsFiltered.mockClear();
    
    const input = screen.getByTestId('search-input');
    
    // Change input value to filter for iPhone
    fireEvent.change(input, { target: { value: 'iPhone' } });
    
    // Check that onProductsFiltered was called with filtered products
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'iPhone 13 Pro' })
      ])
    );
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(
      expect.not.arrayContaining([
        expect.objectContaining({ id: '2', name: 'Samsung Galaxy S21' })
      ])
    );
  });

  // Test client-side filtering with empty search query
  test('returns all products when search query is empty', () => {
    render(<SearchBar onProductsFiltered={mockOnProductsFiltered} />);
    
    // With empty search query, all products should be returned
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(mockProducts);
  });

  // Test client-side filtering with no matches
  test('returns empty array when no products match the search query', () => {
    render(<SearchBar onProductsFiltered={mockOnProductsFiltered} />);
    const input = screen.getByTestId('search-input');
    
    // Change input value to something that won't match any products
    fireEvent.change(input, { target: { value: 'nonexistent product' } });
    
    // Check that onProductsFiltered was called with empty array
    expect(mockOnProductsFiltered).toHaveBeenCalledWith([]);
  });

  // Test client-side filtering with external products
  test('uses external products for filtering when provided', () => {
    const externalProducts = [
      {
        id: 'ext1',
        name: 'External Product',
        description: 'This is an external product',
        price: 49.99,
        images: ['ext1.jpg'],
        mainImage: 'ext1.jpg',
        categoryId: 'external',
        category: 'External',
        rating: 4.0,
        ratingCount: 10,
        stock: 5,
        sku: 'EXT-1',
        brand: 'External Brand',
        featured: false,
        onSale: false,
        tags: ['external'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ];
    
    render(
      <SearchBar 
        onProductsFiltered={mockOnProductsFiltered}
        products={externalProducts}
      />
    );
    
    // With empty search query, all external products should be returned
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(externalProducts);
    
    // Change input value to filter
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'External' } });
    
    // Check that onProductsFiltered was called with filtered external products
    expect(mockOnProductsFiltered).toHaveBeenCalledWith(externalProducts);
    
    // Change to a non-matching query
    fireEvent.change(input, { target: { value: 'iPhone' } });
    
    // Should return empty array as no external products match
    expect(mockOnProductsFiltered).toHaveBeenCalledWith([]);
  });
});
