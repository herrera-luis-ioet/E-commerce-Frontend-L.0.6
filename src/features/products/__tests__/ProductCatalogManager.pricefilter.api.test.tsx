import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCatalogManager from '../ProductCatalogManager';
import productReducer from '../../../store/slices/productSlice';
import filterReducer, { updateFilter } from '../../../store/slices/filterSlice';
import productService from '../../../services/productService';
import { BrowserRouter } from 'react-router-dom';

// Mock the product service
jest.mock('../../../services/productService');
const mockedProductService = productService as jest.Mocked<typeof productService>;

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
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'This is test product 2',
    price: 149.99,
    images: ['image2.jpg'],
    mainImage: 'main-image2.jpg',
    categoryId: 'cat2',
    category: 'Clothing'
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

describe('ProductCatalogManager Price Filter API Tests', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a fresh store for each test
    store = createMockStore();
    
    // Mock the API response
    mockedProductService.getProducts.mockResolvedValue({
      success: true,
      statusCode: 200,
      data: mockProducts,
      message: 'Products retrieved successfully'
    });
  });

  test('should not trigger API calls when price range filters change', async () => {
    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Wait for the initial API call to complete
    await waitFor(() => {
      expect(mockedProductService.getProducts).toHaveBeenCalled();
    });

    // Reset the mock to verify no additional API calls are made when price filters change
    mockedProductService.getProducts.mockClear();
    
    // Dispatch a price filter change (minPrice)
    await act(async () => {
      store.dispatch(updateFilter({ key: 'minPrice', value: 100 }));
      // Wait for any potential async operations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Verify that no API calls were made after changing minPrice
    expect(mockedProductService.getProducts).not.toHaveBeenCalled();

    // Dispatch another price filter change (maxPrice)
    await act(async () => {
      store.dispatch(updateFilter({ key: 'maxPrice', value: 200 }));
      // Wait for any potential async operations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Verify that no API calls were made after changing maxPrice
    expect(mockedProductService.getProducts).not.toHaveBeenCalled();
  });

  test('should trigger API calls when non-price filters change', async () => {
    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Wait for the initial API call to complete
    await waitFor(() => {
      expect(mockedProductService.getProducts).toHaveBeenCalled();
    });

    // Reset the mock to verify additional API calls are made when non-price filters change
    mockedProductService.getProducts.mockClear();

    // Dispatch a non-price filter change (e.g., brand)
    await act(async () => {
      store.dispatch(updateFilter({ key: 'brand', value: 'Test Brand' }));
      // Wait for any potential async operations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Verify that an API call was made after changing a non-price filter
    expect(mockedProductService.getProducts).toHaveBeenCalled();
  });
});