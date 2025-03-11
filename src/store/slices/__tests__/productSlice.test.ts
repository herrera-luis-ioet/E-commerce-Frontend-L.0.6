import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchProductsByCategory,
  fetchFeaturedProducts,
  searchProducts,
  selectProduct,
  selectCategory,
  setViewMode,
  resetProductState
} from '../productSlice';
import { Product, Category, SortOption, ProductView } from '../../../types/product.types';
import productService from '../../../services/productService';

// Mock the product service
jest.mock('../../../services/productService');
const mockedProductService = productService as jest.Mocked<typeof productService>;

// Sample data for tests
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

const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    imageUrl: 'electronics.jpg',
    productCount: 100,
    featured: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-10'
  },
  {
    id: 'cat2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    imageUrl: 'clothing.jpg',
    productCount: 200,
    featured: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-10'
  }
];

// Mock API response format
const createMockApiResponse = (data: any, total = 0, totalPages = 0) => ({
  data,
  meta: {
    total,
    totalPages
  }
});

describe('Product Slice', () => {
  let store: ReturnType<typeof configureStore>;

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

  // Test initial state
  test('should return the initial state', () => {
    const state = store.getState().products;
    
    expect(state.products).toEqual([]);
    expect(state.selectedProduct).toBeNull();
    expect(state.categories).toEqual([]);
    expect(state.selectedCategory).toBeNull();
    expect(state.filters).toEqual({});
    expect(state.sortOption).toBe(SortOption.NEWEST);
    expect(state.viewMode).toBe('grid');
    expect(state.currentPage).toBe(1);
    expect(state.itemsPerPage).toBe(12);
    expect(state.totalProducts).toBe(0);
    expect(state.totalPages).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.initialized).toBe(false);
  });

  // Test synchronous actions
  describe('Synchronous Actions', () => {
    test('should handle selectProduct', () => {
      store.dispatch(selectProduct(mockProducts[0]));
      expect(store.getState().products.selectedProduct).toEqual(mockProducts[0]);
      
      // Test with null
      store.dispatch(selectProduct(null));
      expect(store.getState().products.selectedProduct).toBeNull();
    });

    test('should handle selectCategory', () => {
      store.dispatch(selectCategory(mockCategories[0]));
      expect(store.getState().products.selectedCategory).toEqual(mockCategories[0]);
      
      // Test with null
      store.dispatch(selectCategory(null));
      expect(store.getState().products.selectedCategory).toBeNull();
    });

    test('should handle setViewMode', () => {
      // Test grid view
      store.dispatch(setViewMode('grid' as ProductView));
      expect(store.getState().products.viewMode).toBe('grid');
      
      // Test list view
      store.dispatch(setViewMode('list' as ProductView));
      expect(store.getState().products.viewMode).toBe('list');
    });

    test('should handle resetProductState', () => {
      // First set some state
      store.dispatch(selectProduct(mockProducts[0]));
      store.dispatch(selectCategory(mockCategories[0]));
      
      // Then reset
      store.dispatch(resetProductState());
      
      // Check that state is reset to initial values
      const state = store.getState().products;
      expect(state.products).toEqual([]);
      expect(state.selectedProduct).toBeNull();
      expect(state.categories).toEqual([]);
      expect(state.selectedCategory).toBeNull();
    });
  });

  // Test async thunks
  describe('Async Thunks', () => {
    test('fetchProducts should fetch products successfully', async () => {
      // Mock the API response
      mockedProductService.getProducts.mockResolvedValueOnce(
        createMockApiResponse(mockProducts, 2, 1)
      );
      
      // Dispatch the action
      await store.dispatch(fetchProducts({}));
      
      // Check that the API was called with correct parameters
      expect(mockedProductService.getProducts).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 12, sort: SortOption.NEWEST }
      );
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.products).toEqual(mockProducts);
      expect(state.totalProducts).toBe(2);
      expect(state.totalPages).toBe(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.initialized).toBe(true);
    });

    test('fetchProducts should handle errors', async () => {
      // Mock the API error
      const errorMessage = 'Network error';
      mockedProductService.getProducts.mockRejectedValueOnce(new Error(errorMessage));
      
      // Dispatch the action
      await store.dispatch(fetchProducts({}));
      
      // Check that the state reflects the error
      const state = store.getState().products;
      expect(state.products).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('fetchProductById should fetch a product successfully', async () => {
      // Mock the API response
      mockedProductService.getProductById.mockResolvedValueOnce({
        data: mockProducts[0]
      });
      
      // Dispatch the action
      await store.dispatch(fetchProductById('1'));
      
      // Check that the API was called with correct parameters
      expect(mockedProductService.getProductById).toHaveBeenCalledWith('1');
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.selectedProduct).toEqual(mockProducts[0]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('fetchProductById should handle errors', async () => {
      // Mock the API error
      const errorMessage = 'Product not found';
      mockedProductService.getProductById.mockRejectedValueOnce(new Error(errorMessage));
      
      // Dispatch the action
      await store.dispatch(fetchProductById('999'));
      
      // Check that the state reflects the error
      const state = store.getState().products;
      expect(state.selectedProduct).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('fetchCategories should fetch categories successfully', async () => {
      // Mock the API response
      mockedProductService.getCategories.mockResolvedValueOnce({
        data: mockCategories
      });
      
      // Dispatch the action
      await store.dispatch(fetchCategories());
      
      // Check that the API was called
      expect(mockedProductService.getCategories).toHaveBeenCalled();
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.categories).toEqual(mockCategories);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('fetchProductsByCategory should fetch products by category successfully', async () => {
      // Mock the API response
      mockedProductService.getProductsByCategory.mockResolvedValueOnce(
        createMockApiResponse([mockProducts[0]], 1, 1)
      );
      
      // Dispatch the action
      await store.dispatch(fetchProductsByCategory({ categoryId: 'cat1' }));
      
      // Check that the API was called with correct parameters
      expect(mockedProductService.getProductsByCategory).toHaveBeenCalledWith(
        'cat1',
        undefined,
        { page: 1, limit: 12, sort: SortOption.NEWEST }
      );
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.products).toEqual([mockProducts[0]]);
      expect(state.totalProducts).toBe(1);
      expect(state.totalPages).toBe(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('fetchFeaturedProducts should fetch featured products successfully', async () => {
      // Mock the API response
      mockedProductService.getFeaturedProducts.mockResolvedValueOnce(
        createMockApiResponse([mockProducts[0]], 1, 1)
      );
      
      // Dispatch the action
      await store.dispatch(fetchFeaturedProducts({}));
      
      // Check that the API was called with correct parameters
      expect(mockedProductService.getFeaturedProducts).toHaveBeenCalledWith(
        { page: 1, limit: 12, sort: SortOption.NEWEST }
      );
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.products).toEqual([mockProducts[0]]);
      expect(state.totalProducts).toBe(1);
      expect(state.totalPages).toBe(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('searchProducts should search products successfully', async () => {
      // Mock the API response
      mockedProductService.searchProducts.mockResolvedValueOnce(
        createMockApiResponse(mockProducts, 2, 1)
      );
      
      // Dispatch the action
      await store.dispatch(searchProducts({ query: 'test' }));
      
      // Check that the API was called with correct parameters
      expect(mockedProductService.searchProducts).toHaveBeenCalledWith(
        'test',
        undefined,
        { page: 1, limit: 12, sort: SortOption.NEWEST }
      );
      
      // Check that the state was updated correctly
      const state = store.getState().products;
      expect(state.products).toEqual(mockProducts);
      expect(state.totalProducts).toBe(2);
      expect(state.totalPages).toBe(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // Test loading states
  describe('Loading States', () => {
    test('should set loading to true when fetching products', () => {
      store.dispatch(fetchProducts.pending('', {}));
      expect(store.getState().products.loading).toBe(true);
      expect(store.getState().products.error).toBeNull();
    });

    test('should set loading to true when fetching a product by ID', () => {
      store.dispatch(fetchProductById.pending('', '1'));
      expect(store.getState().products.loading).toBe(true);
      expect(store.getState().products.error).toBeNull();
    });

    test('should set loading to true when fetching categories', () => {
      store.dispatch(fetchCategories.pending('', undefined));
      expect(store.getState().products.loading).toBe(true);
      expect(store.getState().products.error).toBeNull();
    });
  });
});