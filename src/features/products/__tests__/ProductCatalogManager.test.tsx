import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCatalogManager from '../ProductCatalogManager';
import productReducer, { fetchProducts } from '../../../store/slices/productSlice';
import filterReducer from '../../../store/slices/filterSlice';
import productService from '../../../services/productService';
import { BrowserRouter } from 'react-router-dom';

// Mock the product service
jest.mock('../../../services/productService');
const mockedProductService = productService as jest.Mocked<typeof productService>;

// Mock the components that are not relevant for this test
jest.mock('../components/ProductGrid', () => ({
  __esModule: true,
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-grid">
      {products.map(product => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          {product.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../components/ProductList', () => ({
  __esModule: true,
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-list">
      {products.map(product => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          {product.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../../filters/components/FilterPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="filter-panel">Filter Panel</div>,
}));

jest.mock('../../filters/components/SearchBar', () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar">Search Bar</div>,
}));

jest.mock('../../filters/components/SortOptions', () => ({
  __esModule: true,
  default: () => <div data-testid="sort-options">Sort Options</div>,
}));

jest.mock('../../../components/ui/Pagination', () => ({
  __esModule: true,
  default: () => <div data-testid="pagination">Pagination</div>,
}));

jest.mock('../../../components/ui/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner">Loading...</div>,
}));

// Sample product data
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'This is test product 1',
    price: 99.99,
    images: ['image1.jpg'],
    mainImage: 'main-image1.jpg',
    categoryId: 'cat1',
    category: 'Electronics',
    rating: 4.5,
    ratingCount: 120,
    stock: 10,
    sku: 'TEST-SKU-123',
    brand: 'Test Brand',
    featured: true,
    onSale: true,
    discountPercentage: 20,
    tags: ['electronics'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-10'
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'This is test product 2',
    price: 149.99,
    images: ['image2.jpg'],
    mainImage: 'main-image2.jpg',
    categoryId: 'cat2',
    category: 'Clothing',
    rating: 3.8,
    ratingCount: 85,
    stock: 5,
    sku: 'TEST-SKU-456',
    brand: 'Another Brand',
    featured: false,
    onSale: false,
    tags: ['clothing'],
    createdAt: '2023-02-01',
    updatedAt: '2023-02-10'
  }
];

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      filter: filterReducer
    }
  });
};

describe('ProductCatalogManager Component', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a fresh store for each test
    store = createMockStore();
  });

  test('should handle API response without pagination metadata', async () => {
    // Mock the API response without meta property
    mockedProductService.getProducts.mockResolvedValueOnce({
      success: true,
      statusCode: 200,
      data: mockProducts,
      message: 'Products retrieved successfully'
    });

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Initially, it should show a loading spinner
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the products to load
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Check that the products are displayed
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();

    // Check that the product count is displayed correctly
    expect(screen.getByText('2 products')).toBeInTheDocument();

    // Verify that no error message is displayed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('should handle API response with pagination metadata', async () => {
    // Mock the API response with meta property
    mockedProductService.getProducts.mockResolvedValueOnce({
      success: true,
      statusCode: 200,
      data: mockProducts,
      meta: {
        total: 10,
        totalPages: 5,
        currentPage: 1,
        itemsPerPage: 2,
        hasNextPage: true,
        hasPrevPage: false
      },
      message: 'Products retrieved successfully'
    });

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Initially, it should show a loading spinner
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the products to load
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Check that the products are displayed
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();

    // Check that the product count is displayed correctly (should show total from meta)
    expect(screen.getByText('10 products')).toBeInTheDocument();

    // Verify that no error message is displayed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('should handle API error gracefully', async () => {
    // Mock the API error
    const errorMessage = 'Failed to fetch products';
    mockedProductService.getProducts.mockRejectedValueOnce(new Error(errorMessage));

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Initially, it should show a loading spinner
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Check that the error message is displayed
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});