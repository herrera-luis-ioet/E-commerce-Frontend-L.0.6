import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProducts } from '../productSlice';
import productService from '../../../services/productService';
import { Product } from '../../../types/product.types';

// Mock the product service
jest.mock('../../../services/productService');
const mockedProductService = productService as jest.Mocked<typeof productService>;

// Sample product data
const mockProducts: Product[] = [
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

describe('Product Slice Pagination Handling', () => {
  let store: ReturnType<typeof configureStore<{
    products: ReturnType<typeof productReducer>;
  }>>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        products: productReducer
      }
    });
  });

  test('should handle API response without pagination metadata', async () => {
    // Mock the API response without meta property
    mockedProductService.getProducts.mockResolvedValueOnce({
      success: true,
      statusCode: 200,
      data: mockProducts,
      message: 'Products retrieved successfully'
    });
    
    // Dispatch the action
    await store.dispatch(fetchProducts({}));
    
    // Check that the state was updated correctly
    const state = store.getState().products;
    expect(state.products).toEqual(mockProducts);
    expect(state.totalProducts).toBe(2); // Should be the length of the products array
    expect(state.totalPages).toBe(1); // Should default to 1
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.initialized).toBe(true);
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
    
    // Dispatch the action
    await store.dispatch(fetchProducts({}));
    
    // Check that the state was updated correctly
    const state = store.getState().products;
    expect(state.products).toEqual(mockProducts);
    expect(state.totalProducts).toBe(10); // Should be from meta.total
    expect(state.totalPages).toBe(5); // Should be from meta.totalPages
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.initialized).toBe(true);
  });
});