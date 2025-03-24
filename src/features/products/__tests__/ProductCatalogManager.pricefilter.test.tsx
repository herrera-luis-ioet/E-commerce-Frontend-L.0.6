import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import ProductCatalogManager from '../ProductCatalogManager';
import { Product } from '../../../types/product.types';

// Mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Budget Phone',
    description: 'Affordable smartphone',
    price: 199.99,
    images: ['image1.jpg'],
    mainImage: 'image1.jpg',
    categoryId: 'electronics',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Mid-range Phone',
    description: 'Good value smartphone',
    price: 499.99,
    images: ['image2.jpg'],
    mainImage: 'image2.jpg',
    categoryId: 'electronics',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Premium Phone',
    description: 'High-end smartphone',
    price: 999.99,
    images: ['image3.jpg'],
    mainImage: 'image3.jpg',
    categoryId: 'electronics',
    category: 'Electronics'
  },
  {
    id: '4',
    name: 'Luxury Phone',
    description: 'Ultra premium smartphone',
    price: 1499.99,
    images: ['image4.jpg'],
    mainImage: 'image4.jpg',
    categoryId: 'electronics',
    category: 'Electronics'
  }
];

// Mock component to avoid router issues
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('ProductCatalogManager with client-side price filter', () => {
  let store: any;

  beforeEach(() => {
    // Initial state with no price filters
    store = mockStore({
      product: {
        products: mockProducts,
        loading: false,
        error: null,
        totalProducts: mockProducts.length,
        totalPages: 1,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {},
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
  });

  it('displays all products when no price filter is applied', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // All products should be displayed
    expect(screen.getByText('Budget Phone')).toBeInTheDocument();
    expect(screen.getByText('Mid-range Phone')).toBeInTheDocument();
    expect(screen.getByText('Premium Phone')).toBeInTheDocument();
    expect(screen.getByText('Luxury Phone')).toBeInTheDocument();
    
    // Product count should show all products
    expect(screen.getByText('4 products')).toBeInTheDocument();
  });

  it('filters products with min price only', () => {
    // Update store with min price filter
    store = mockStore({
      product: {
        products: mockProducts,
        loading: false,
        error: null,
        totalProducts: mockProducts.length,
        totalPages: 1,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {
          minPrice: 500
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // Only products with price >= 500 should be displayed
    expect(screen.queryByText('Budget Phone')).not.toBeInTheDocument();
    expect(screen.getByText('Mid-range Phone')).toBeInTheDocument();
    expect(screen.getByText('Premium Phone')).toBeInTheDocument();
    expect(screen.getByText('Luxury Phone')).toBeInTheDocument();
    
    // Product count should show filtered products
    expect(screen.getByText('3 products')).toBeInTheDocument();
  });

  it('filters products with max price only', () => {
    // Update store with max price filter
    store = mockStore({
      product: {
        products: mockProducts,
        loading: false,
        error: null,
        totalProducts: mockProducts.length,
        totalPages: 1,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {
          maxPrice: 500
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // Only products with price <= 500 should be displayed
    expect(screen.getByText('Budget Phone')).toBeInTheDocument();
    expect(screen.getByText('Mid-range Phone')).toBeInTheDocument();
    expect(screen.queryByText('Premium Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Luxury Phone')).not.toBeInTheDocument();
    
    // Product count should show filtered products
    expect(screen.getByText('2 products')).toBeInTheDocument();
  });

  it('filters products with both min and max price', () => {
    // Update store with min and max price filters
    store = mockStore({
      product: {
        products: mockProducts,
        loading: false,
        error: null,
        totalProducts: mockProducts.length,
        totalPages: 1,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {
          minPrice: 400,
          maxPrice: 1000
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // Only products with 400 <= price <= 1000 should be displayed
    expect(screen.queryByText('Budget Phone')).not.toBeInTheDocument();
    expect(screen.getByText('Mid-range Phone')).toBeInTheDocument();
    expect(screen.getByText('Premium Phone')).toBeInTheDocument();
    expect(screen.queryByText('Luxury Phone')).not.toBeInTheDocument();
    
    // Product count should show filtered products
    expect(screen.getByText('2 products')).toBeInTheDocument();
  });

  it('shows no products message when no products match the price filter', () => {
    // Update store with price filter that matches no products
    store = mockStore({
      product: {
        products: mockProducts,
        loading: false,
        error: null,
        totalProducts: mockProducts.length,
        totalPages: 1,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {
          minPrice: 2000,
          maxPrice: 3000
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // No products should be displayed
    expect(screen.queryByText('Budget Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Mid-range Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Premium Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Luxury Phone')).not.toBeInTheDocument();
    
    // No products message should be displayed
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search or filter to find what you're looking for.")).toBeInTheDocument();
    
    // Product count should show 0 products
    expect(screen.getByText('0 products')).toBeInTheDocument();
  });

  it('shows loading state when products are loading', () => {
    // Update store to show loading state
    store = mockStore({
      product: {
        products: [],
        loading: true,
        error: null,
        totalProducts: 0,
        totalPages: 0,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {},
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // Loading spinner should be displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // No products should be displayed
    expect(screen.queryByText('Budget Phone')).not.toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    // Update store to show error state
    store = mockStore({
      product: {
        products: [],
        loading: false,
        error: 'Failed to fetch products',
        totalProducts: 0,
        totalPages: 0,
        categories: [],
        selectedProduct: null
      },
      filter: {
        filters: {},
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );
    
    // Error message should be displayed
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    
    // No products should be displayed
    expect(screen.queryByText('Budget Phone')).not.toBeInTheDocument();
  });
});