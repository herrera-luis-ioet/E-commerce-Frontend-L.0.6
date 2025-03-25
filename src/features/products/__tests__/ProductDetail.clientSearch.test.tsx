import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ProductDetail from '../components/ProductDetail';
import { Product } from '../../../types/product.types';
import { fetchProductById, fetchProducts } from '../../../store/slices/productSlice';

// Mock the RelatedProducts component
jest.mock('../components/RelatedProducts', () => {
  return ({ products, error }: any) => (
    <div data-testid="related-products-container">
      <h2 data-testid="related-products-title">Related Products</h2>
      {error && <div data-testid="related-products-error">{error}</div>}
      {products && products.length === 0 && !error && (
        <div data-testid="related-products-no-results">No related products found</div>
      )}
      <div data-testid="related-products-list">
        {products && products.map((product: Product) => (
          <div key={product.id} data-testid={`related-product-item-${product.id}`} className="related-product-item">
            <span data-testid={`related-product-name-${product.id}`}>{product.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Mock the ProductGallery component
jest.mock('../components/ProductGallery', () => {
  return ({ product }: any) => (
    <div data-testid="product-gallery-container">
      <img src={product.mainImage} alt={product.name} data-testid="product-main-image" />
    </div>
  );
});

// Mock the ProductInfo component
jest.mock('../components/ProductInfo', () => {
  return ({ product }: any) => (
    <div data-testid="product-info-container">
      <h1 data-testid="product-name">{product.name}</h1>
      <p data-testid="product-description">{product.description}</p>
      <p data-testid="product-price">${product.price}</p>
    </div>
  );
});

// Mock Redux store
const mockStore = configureStore([thunk]);

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'iPhone 13 Pro',
  description: 'Latest iPhone model with advanced features',
  price: 999.99,
  images: ['iphone13-1.jpg', 'iphone13-2.jpg'],
  mainImage: 'iphone13-1.jpg',
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
};

// Mock related products
const mockRelatedProducts: Product[] = [
  {
    id: '2',
    name: 'iPhone 13',
    description: 'Standard iPhone 13 model',
    price: 799.99,
    images: ['iphone13-std-1.jpg'],
    mainImage: 'iphone13-std-1.jpg',
    categoryId: 'smartphones',
    category: 'Smartphones',
    rating: 4.7,
    ratingCount: 95,
    stock: 75,
    sku: 'IP13-128-BL',
    brand: 'Apple',
    featured: false,
    onSale: false,
    tags: ['smartphone', 'apple', 'ios'],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Samsung Galaxy S21',
    description: 'Samsung flagship smartphone',
    price: 899.99,
    images: ['galaxy-s21-1.jpg'],
    mainImage: 'galaxy-s21-1.jpg',
    categoryId: 'smartphones',
    category: 'Smartphones',
    rating: 4.6,
    ratingCount: 88,
    stock: 60,
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
    id: '4',
    name: 'Google Pixel 6',
    description: 'Google Pixel smartphone with advanced camera',
    price: 699.99,
    images: ['pixel-6-1.jpg'],
    mainImage: 'pixel-6-1.jpg',
    categoryId: 'smartphones',
    category: 'Smartphones',
    rating: 4.5,
    ratingCount: 72,
    stock: 45,
    sku: 'GP6-128-BK',
    brand: 'Google',
    featured: false,
    onSale: false,
    tags: ['smartphone', 'google', 'android'],
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-08-12T16:10:00Z'
  }
];

// Mock Redux actions
jest.mock('../../../store/slices/productSlice', () => ({
  fetchProductById: jest.fn(() => ({
    type: 'products/fetchProductById/fulfilled',
    payload: {
      id: '1',
      name: 'iPhone 13 Pro',
      description: 'Latest iPhone model with advanced features',
      price: 999.99,
      images: ['iphone13-1.jpg', 'iphone13-2.jpg'],
      mainImage: 'iphone13-1.jpg',
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
    }
  })),
  fetchProducts: jest.fn(),
  selectProductById: (state: any, id: string) => state.products.entities[id],
  selectAllProducts: (state: any) => Object.values(state.products.entities),
  selectProductsLoading: (state: any) => state.products.loading,
  selectProductsError: (state: any) => state.products.error,
  fulfilled: {
    match: () => true
  }
}));

describe('ProductDetail Component with Client-Side Search', () => {
  let store: any;
  
  beforeEach(() => {
    // Reset mocks
    (fetchProductById as jest.Mock).mockClear();
    (fetchProducts as jest.Mock).mockClear();
    
    // Setup mock store
    store = mockStore({
      products: {
        products: [
          mockProduct,
          mockRelatedProducts[0],
          mockRelatedProducts[1],
          mockRelatedProducts[2]
        ],
        selectedProduct: mockProduct,
        loading: false,
        error: null,
        initialized: true,
        categories: ['smartphones', 'tablets', 'laptops'],
        selectedCategory: null,
        totalProducts: 4,
        totalPages: 1
      },
      filter: {
        searchQuery: '',
        filters: {
          categoryId: null,
          minPrice: null,
          maxPrice: null
        },
        sortOption: 'featured',
        viewMode: 'grid',
        currentPage: 1,
        itemsPerPage: 10
      }
    });
  });

  test('renders product detail with related products', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ProductDetail productId="1" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toBeInTheDocument();
    });

    // Check if related products are displayed
    expect(screen.getByTestId('related-products-title')).toBeInTheDocument();
    expect(screen.getByTestId('related-product-name-2')).toBeInTheDocument(); // iPhone 13
    expect(screen.getByTestId('related-product-name-3')).toBeInTheDocument(); // Samsung Galaxy S21
    expect(screen.getByTestId('related-product-name-4')).toBeInTheDocument(); // Google Pixel 6
  });

  test('filters related products with client-side search', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ProductDetail productId="1" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toBeInTheDocument();
    });

    // Find search input in related products section
    const searchInput = screen.getByPlaceholderText('Search related products...');
    // Add data-testid attribute to the search input for future reference
    Object.defineProperty(searchInput, 'dataset', {
      value: { ...searchInput.dataset, testid: 'related-products-search-input' }
    });
    expect(searchInput).toBeInTheDocument();

    // Search for "Samsung"
    fireEvent.change(searchInput, { target: { value: 'Samsung' } });

    // Only Samsung product should be visible
    await waitFor(() => {
      expect(screen.getByTestId('related-product-name-3')).toBeInTheDocument(); // Samsung Galaxy S21
      expect(screen.queryByTestId('related-product-name-2')).not.toBeInTheDocument(); // iPhone 13
      expect(screen.queryByTestId('related-product-name-4')).not.toBeInTheDocument(); // Google Pixel 6
    });
  });

  test('shows "no results" message when search has no matches', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ProductDetail productId="1" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toBeInTheDocument();
    });

    // Find search input in related products section
    const searchInput = screen.getByPlaceholderText('Search related products...');
    Object.defineProperty(searchInput, 'dataset', {
      value: { ...searchInput.dataset, testid: 'related-products-search-input' }
    });

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'nonexistent product' } });

    // Should show no results message
    await waitFor(() => {
      expect(screen.getByTestId('related-products-no-results')).toBeInTheDocument();
    });
  });

  test('resets search when clear button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ProductDetail productId="1" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toBeInTheDocument();
    });

    // Find search input in related products section
    const searchInput = screen.getByPlaceholderText('Search related products...');
    Object.defineProperty(searchInput, 'dataset', {
      value: { ...searchInput.dataset, testid: 'related-products-search-input' }
    });

    // Search for "Samsung"
    fireEvent.change(searchInput, { target: { value: 'Samsung' } });

    // Only Samsung product should be visible
    await waitFor(() => {
      expect(screen.getByTestId('related-product-name-3')).toBeInTheDocument(); // Samsung Galaxy S21
      expect(screen.queryByTestId('related-product-name-2')).not.toBeInTheDocument(); // iPhone 13
    });

    // Find and click clear button
    const clearButton = screen.getByLabelText('Clear search');
    Object.defineProperty(clearButton, 'dataset', {
      value: { ...clearButton.dataset, testid: 'related-products-clear-button' }
    });
    fireEvent.click(clearButton);

    // All products should be visible again
    await waitFor(() => {
      expect(screen.getByTestId('related-product-name-3')).toBeInTheDocument(); // Samsung Galaxy S21
      expect(screen.getByTestId('related-product-name-2')).toBeInTheDocument(); // iPhone 13
      expect(screen.getByTestId('related-product-name-4')).toBeInTheDocument(); // Google Pixel 6
    });
  });

  test('search is case-insensitive', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <ProductDetail productId="1" />
        </BrowserRouter>
      </Provider>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toBeInTheDocument();
    });

    // Find search input in related products section
    const searchInput = screen.getByPlaceholderText('Search related products...');
    Object.defineProperty(searchInput, 'dataset', {
      value: { ...searchInput.dataset, testid: 'related-products-search-input' }
    });

    // Search with mixed case
    fireEvent.change(searchInput, { target: { value: 'sAmSuNg' } });

    // Samsung product should still be found
    await waitFor(() => {
      expect(screen.getByTestId('related-product-name-3')).toBeInTheDocument(); // Samsung Galaxy S21
    });
  });
});
