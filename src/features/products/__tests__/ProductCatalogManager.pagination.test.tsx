import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../../../store/slices/productSlice';
import filterReducer from '../../../store/slices/filterSlice';
import { ProductState } from '../../../types/product.types';
import ProductCatalogManager from '../ProductCatalogManager';
import { BrowserRouter } from 'react-router-dom';
import { sortProducts } from '../../../utils/formatters';

// Mock the sortProducts utility function
jest.mock('../../../utils/formatters', () => ({
  sortProducts: jest.fn().mockImplementation((products) => products),
  formatPrice: jest.fn(),
  formatPercentage: jest.fn()
}));

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

describe('ProductCatalogManager Component Pagination Handling', () => {
  test('should display correct product count when totalProducts is undefined', () => {
    // Create a store with initial state where totalProducts is undefined
    const initialState: ProductState = {
      products: mockProducts,
      selectedProduct: null,
      categories: [],
      selectedCategory: null,
      filters: {},
      sortOption: 'newest',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 12,
      totalProducts: undefined as any, // Simulate the undefined case
      totalPages: undefined as any, // Simulate the undefined case
      loading: false,
      error: null,
      initialized: true
    };

    const store = configureStore({
      reducer: {
        products: (state = initialState) => state,
        filter: filterReducer
      }
    });

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Check that the product count is displayed correctly (should use products.length)
    expect(screen.getByText('2 products')).toBeInTheDocument();
  });

  test('should display correct product count when totalProducts is defined', () => {
    // Create a store with initial state where totalProducts is defined
    const initialState: ProductState = {
      products: mockProducts,
      selectedProduct: null,
      categories: [],
      selectedCategory: null,
      filters: {},
      sortOption: 'newest',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 12,
      totalProducts: 10, // Total products from API
      totalPages: 5, // Total pages from API
      loading: false,
      error: null,
      initialized: true
    };

    const store = configureStore({
      reducer: {
        products: (state = initialState) => state,
        filter: filterReducer
      }
    });

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Check that the product count is displayed correctly (should use totalProducts)
    expect(screen.getByText('10 products')).toBeInTheDocument();
  });

  test('should handle pagination correctly when totalPages is undefined', () => {
    // Create a store with initial state where totalPages is undefined
    const initialState: ProductState = {
      products: mockProducts,
      selectedProduct: null,
      categories: [],
      selectedCategory: null,
      filters: {},
      sortOption: 'newest',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 1, // Set to 1 to ensure multiple pages
      totalProducts: 2,
      totalPages: undefined as any, // Simulate the undefined case
      loading: false,
      error: null,
      initialized: true
    };

    const store = configureStore({
      reducer: {
        products: (state = initialState) => state,
        filter: filterReducer
      }
    });

    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Check that pagination is displayed (should calculate pages based on products.length and itemsPerPage)
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
