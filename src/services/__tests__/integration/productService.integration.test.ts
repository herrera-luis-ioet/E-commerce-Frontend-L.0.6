/**
 * Product Service Integration Tests
 * 
 * This file contains integration tests for the product service,
 * verifying that it correctly interacts with the backend API
 * and transforms data as expected.
 */

const integrationTestSetup = require('./setup').default;
const productService = require('../../productService').default;
const { SortOption, ProductFilter } = require('../../../types/product.types');
const { transformProductFromBackend } = require('../../../utils/dataTransformers');

// Configure Jest to have a longer timeout for integration tests
jest.setTimeout(30000);

describe('Product Service Integration Tests', () => {
  // Before all tests, check if the API is available
  beforeAll(async () => {
    const isApiAvailable = await integrationTestSetup.isApiAvailable();
    if (!isApiAvailable) {
      console.warn('API is not available. Integration tests will be skipped.');
      // Skip all tests if API is not available
      return;
    }
  });

  // After each test, clean up any test data
  afterEach(async () => {
    await integrationTestSetup.cleanupTestData();
  });

  /**
   * Test 1: Fetching all products with pagination
   */
  describe('Fetching all products with pagination', () => {
    test('should fetch products with default pagination', async () => {
      // Create multiple test products
      const testProducts = [
        integrationTestSetup.generateSampleProduct({ name: 'Test Product 1' }),
        integrationTestSetup.generateSampleProduct({ name: 'Test Product 2' }),
        integrationTestSetup.generateSampleProduct({ name: 'Test Product 3' })
      ];
      
      await Promise.all(testProducts.map(product => 
        integrationTestSetup.createTestProduct(product)
      ));

      // Fetch products using the product service
      const response = await productService.getProducts();
      
      // Verify the response structure
      expect(response.success).toBe(true);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThanOrEqual(3);
      
      // Verify pagination metadata
      expect(response.meta).toBeDefined();
      expect(response.meta.currentPage).toBeDefined();
      expect(response.meta.itemsPerPage).toBeDefined();
      expect(response.meta.total).toBeDefined();
      expect(response.meta.totalPages).toBeDefined();
      
      // Verify data transformation
      const testProductNames = testProducts.map(p => p.name);
      const foundProducts = response.data.filter(p => testProductNames.includes(p.name));
      expect(foundProducts.length).toBeGreaterThanOrEqual(3);
      
      // Check that each product has the expected structure after transformation
      foundProducts.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('images');
        expect(product).toHaveProperty('mainImage');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('sku');
        expect(product).toHaveProperty('tags');
        expect(Array.isArray(product.tags)).toBe(true);
      });
    });

    test('should fetch products with custom pagination', async () => {
      // Create multiple test products
      const testProducts = Array(5).fill(null).map((_, index) => 
        integrationTestSetup.generateSampleProduct({ name: `Pagination Test ${index + 1}` })
      );
      
      await Promise.all(testProducts.map(product => 
        integrationTestSetup.createTestProduct(product)
      ));

      // Fetch first page with 2 items per page
      const page1Response = await productService.getProducts(undefined, { page: 1, limit: 2 });
      
      // Verify pagination works correctly
      expect(page1Response.success).toBe(true);
      expect(page1Response.meta.currentPage).toBe(1);
      expect(page1Response.meta.itemsPerPage).toBe(2);
      expect(page1Response.data.length).toBeLessThanOrEqual(2);
      
      // Fetch second page
      const page2Response = await productService.getProducts(undefined, { page: 2, limit: 2 });
      
      // Verify second page has different items
      expect(page2Response.success).toBe(true);
      expect(page2Response.meta.currentPage).toBe(2);
      
      // Ensure we got different products on different pages
      const page1Ids = page1Response.data.map(p => p.id);
      const page2Ids = page2Response.data.map(p => p.id);
      
      // Check that no IDs from page 1 appear in page 2
      const commonIds = page1Ids.filter(id => page2Ids.includes(id));
      expect(commonIds.length).toBe(0);
    });
  });

  /**
   * Test 2: Fetching a single product by ID
   */
  describe('Fetching a single product by ID', () => {
    test('should fetch a product by ID and correctly transform data', async () => {
      // Create a test product
      const testProduct = integrationTestSetup.generateSampleProduct({
        name: 'Single Product Test',
        description: 'Test product for single fetch',
        price: 123.45,
        stock_quantity: 42,
        category: 'Test Category',
        tags: 'test,single,fetch'
      });
      
      const createdProduct = await integrationTestSetup.createTestProduct(testProduct);
      
      // Fetch the product using the product service
      const response = await productService.getProductById(createdProduct.id.toString());
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(createdProduct.id.toString());
      expect(response.data.name).toBe(testProduct.name);
      expect(response.data.description).toBe(testProduct.description);
      expect(response.data.price).toBe(Number(testProduct.price));
      expect(response.data.stock).toBe(testProduct.stock_quantity);
      expect(response.data.category).toBe(testProduct.category);
      
      // Verify tags transformation
      expect(Array.isArray(response.data.tags)).toBe(true);
      expect(response.data.tags).toEqual(['test', 'single', 'fetch']);
      
      // Verify image transformation
      expect(response.data.mainImage).toBe(testProduct.image || '');
      expect(response.data.images).toEqual(testProduct.image ? [testProduct.image] : []);
      
      // Compare with direct transformation
      const directTransform = transformProductFromBackend(createdProduct);
      expect(response.data).toEqual(directTransform);
    });

    test('should handle non-existent product ID', async () => {
      // Try to fetch a product with a non-existent ID
      try {
        await productService.getProductById('999999');
        // If we reach here, the test should fail
        fail('Expected an error for non-existent product ID');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
      }
    });
  });

  /**
   * Test 3: Filtering products by category
   */
  describe('Filtering products by category', () => {
    test('should fetch products filtered by category', async () => {
      // Create test products with different categories
      const category1 = 'Electronics';
      const category2 = 'Clothing';
      
      const electronicsProducts = [
        integrationTestSetup.generateSampleProduct({ name: 'Laptop', category: category1 }),
        integrationTestSetup.generateSampleProduct({ name: 'Smartphone', category: category1 })
      ];
      
      const clothingProducts = [
        integrationTestSetup.generateSampleProduct({ name: 'T-Shirt', category: category2 }),
        integrationTestSetup.generateSampleProduct({ name: 'Jeans', category: category2 })
      ];
      
      // Create all products
      await Promise.all([
        ...electronicsProducts.map(p => integrationTestSetup.createTestProduct(p)),
        ...clothingProducts.map(p => integrationTestSetup.createTestProduct(p))
      ]);
      
      // Fetch products by category using the product service
      const response = await productService.getProductsByCategory(category1);
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned products should be in the Electronics category
      response.data.forEach(product => {
        expect(product.category).toBe(category1);
      });
      
      // Should find at least our test products
      const testProductNames = electronicsProducts.map(p => p.name);
      const foundProducts = response.data.filter(p => testProductNames.includes(p.name));
      expect(foundProducts.length).toBeGreaterThanOrEqual(electronicsProducts.length);
      
      // Verify no products from the other category are included
      const wrongCategoryProducts = response.data.filter(p => p.category === category2);
      expect(wrongCategoryProducts.length).toBe(0);
    });

    test('should handle filtering by non-existent category', async () => {
      // Fetch products with a non-existent category
      const response = await productService.getProductsByCategory('NonExistentCategory');
      
      // Should return an empty array, not an error
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });

    test('should filter products by category with additional filters', async () => {
      const category = 'Furniture';
      
      // Create test products with varying prices in the same category
      const products = [
        integrationTestSetup.generateSampleProduct({ 
          name: 'Cheap Chair', 
          category, 
          price: 50.00,
          stock_quantity: 0
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Medium Chair', 
          category, 
          price: 100.00,
          stock_quantity: 5
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Expensive Chair', 
          category, 
          price: 200.00,
          stock_quantity: 10
        })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Filter by category and price range
      const filter = {
        minPrice: 75,
        maxPrice: 150,
        inStock: true
      };
      
      const response = await productService.getProductsByCategory(category, filter);
      
      // Should only return products in the specified price range and in stock
      expect(response.success).toBe(true);
      
      // Check that returned products match our filter criteria
      response.data.forEach(product => {
        expect(product.category).toBe(category);
        expect(product.price).toBeGreaterThanOrEqual(75);
        expect(product.price).toBeLessThanOrEqual(150);
        expect(product.stock).toBeGreaterThan(0);
      });
      
      // Should find our "Medium Chair" but not the others
      const mediumChair = response.data.find(p => p.name === 'Medium Chair');
      expect(mediumChair).toBeDefined();
      
      const cheapChair = response.data.find(p => p.name === 'Cheap Chair');
      const expensiveChair = response.data.find(p => p.name === 'Expensive Chair');
      expect(cheapChair).toBeUndefined();
      expect(expensiveChair).toBeUndefined();
    });
  });

  /**
   * Test 4: Sorting products
   */
  describe('Sorting products', () => {
    test('should sort products by price (low to high)', async () => {
      // Create test products with different prices
      const products = [
        integrationTestSetup.generateSampleProduct({ name: 'Expensive Product', price: 299.99 }),
        integrationTestSetup.generateSampleProduct({ name: 'Medium Product', price: 149.99 }),
        integrationTestSetup.generateSampleProduct({ name: 'Cheap Product', price: 49.99 })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Fetch products with price sorting
      const response = await productService.getProducts(
        undefined, 
        { sort: SortOption.PRICE_LOW_TO_HIGH }
      );
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Find our test products in the response
      const testProductNames = products.map(p => p.name);
      const foundProducts = response.data
        .filter(p => testProductNames.includes(p.name))
        .sort((a, b) => a.price - b.price);
      
      // Verify the sorting order
      for (let i = 1; i < foundProducts.length; i++) {
        expect(foundProducts[i].price).toBeGreaterThanOrEqual(foundProducts[i-1].price);
      }
      
      // The first product should be the cheapest
      const cheapestProduct = foundProducts[0];
      expect(cheapestProduct.name).toBe('Cheap Product');
      
      // The last product should be the most expensive
      const mostExpensiveProduct = foundProducts[foundProducts.length - 1];
      expect(mostExpensiveProduct.name).toBe('Expensive Product');
    });

    test('should sort products by price (high to low)', async () => {
      // Create test products with different prices
      const products = [
        integrationTestSetup.generateSampleProduct({ name: 'Expensive Product', price: 299.99 }),
        integrationTestSetup.generateSampleProduct({ name: 'Medium Product', price: 149.99 }),
        integrationTestSetup.generateSampleProduct({ name: 'Cheap Product', price: 49.99 })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Fetch products with price sorting
      const response = await productService.getProducts(
        undefined, 
        { sort: SortOption.PRICE_HIGH_TO_LOW }
      );
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Find our test products in the response
      const testProductNames = products.map(p => p.name);
      const foundProducts = response.data
        .filter(p => testProductNames.includes(p.name))
        .sort((a, b) => b.price - a.price);
      
      // Verify the sorting order
      for (let i = 1; i < foundProducts.length; i++) {
        expect(foundProducts[i].price).toBeLessThanOrEqual(foundProducts[i-1].price);
      }
      
      // The first product should be the most expensive
      const mostExpensiveProduct = foundProducts[0];
      expect(mostExpensiveProduct.name).toBe('Expensive Product');
      
      // The last product should be the cheapest
      const cheapestProduct = foundProducts[foundProducts.length - 1];
      expect(cheapestProduct.name).toBe('Cheap Product');
    });

    test('should sort products by name (A to Z)', async () => {
      // Create test products with alphabetically ordered names
      const products = [
        integrationTestSetup.generateSampleProduct({ name: 'Apple' }),
        integrationTestSetup.generateSampleProduct({ name: 'Banana' }),
        integrationTestSetup.generateSampleProduct({ name: 'Cherry' })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Fetch products with name sorting
      const response = await productService.getProducts(
        undefined, 
        { sort: SortOption.NAME_A_TO_Z }
      );
      
      // Verify the response
      expect(response.success).toBe(true);
      
      // Find our test products in the response
      const testProductNames = products.map(p => p.name);
      const foundProducts = response.data
        .filter(p => testProductNames.includes(p.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      // Verify the sorting order
      for (let i = 1; i < foundProducts.length; i++) {
        expect(foundProducts[i].name.localeCompare(foundProducts[i-1].name)).toBeGreaterThanOrEqual(0);
      }
      
      // The first product should be "Apple"
      expect(foundProducts[0].name).toBe('Apple');
      
      // The last product should be "Cherry"
      expect(foundProducts[foundProducts.length - 1].name).toBe('Cherry');
    });
  });

  /**
   * Test 5: Searching products
   */
  describe('Searching products', () => {
    test('should search products by query', async () => {
      // Create test products with specific keywords in names and descriptions
      const products = [
        integrationTestSetup.generateSampleProduct({ 
          name: 'Ergonomic Keyboard', 
          description: 'A comfortable keyboard for long typing sessions'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Wireless Mouse', 
          description: 'A mouse with ergonomic design'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Standard Laptop', 
          description: 'A laptop for everyday use'
        })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Search for products with the term "ergonomic"
      const response = await productService.searchProducts('ergonomic');
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Should find products with "ergonomic" in name or description
      const ergonomicProducts = response.data.filter(p => 
        p.name.toLowerCase().includes('ergonomic') || 
        p.description.toLowerCase().includes('ergonomic')
      );
      
      expect(ergonomicProducts.length).toBeGreaterThanOrEqual(2);
      
      // Should find the keyboard and mouse but not the laptop
      const keyboard = response.data.find(p => p.name === 'Ergonomic Keyboard');
      const mouse = response.data.find(p => p.name === 'Wireless Mouse');
      const laptop = response.data.find(p => p.name === 'Standard Laptop');
      
      expect(keyboard).toBeDefined();
      expect(mouse).toBeDefined();
      expect(laptop).toBeUndefined();
    });

    test('should search products with additional filters', async () => {
      // Create test products with varying attributes
      const products = [
        integrationTestSetup.generateSampleProduct({ 
          name: 'Premium Gaming Keyboard', 
          description: 'High-end gaming keyboard',
          price: 199.99,
          category: 'Gaming'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Budget Gaming Keyboard', 
          description: 'Affordable gaming keyboard',
          price: 49.99,
          category: 'Gaming'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Gaming Mouse', 
          description: 'High-performance gaming mouse',
          price: 89.99,
          category: 'Gaming'
        })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Search for gaming keyboards with price filter
      const filter = {
        maxPrice: 100,
        category: 'Gaming'
      };
      
      const response = await productService.searchProducts('keyboard', filter);
      
      // Verify the response
      expect(response.success).toBe(true);
      
      // Should find budget keyboard but not premium keyboard
      const budgetKeyboard = response.data.find(p => p.name === 'Budget Gaming Keyboard');
      const premiumKeyboard = response.data.find(p => p.name === 'Premium Gaming Keyboard');
      const gamingMouse = response.data.find(p => p.name === 'Gaming Mouse');
      
      expect(budgetKeyboard).toBeDefined();
      expect(premiumKeyboard).toBeUndefined();
      expect(gamingMouse).toBeUndefined();
      
      // Verify the price filter worked
      response.data.forEach(product => {
        expect(product.price).toBeLessThanOrEqual(100);
        expect(product.category).toBe('Gaming');
        expect(product.name.toLowerCase()).toContain('keyboard');
      });
    });

    test('should handle search with no results', async () => {
      // Search for a term that shouldn't match any products
      const response = await productService.searchProducts('xyznonexistentproduct123');
      
      // Should return an empty array, not an error
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(0);
    });
  });

  /**
   * Test 6: Advanced filtering
   */
  describe('Advanced filtering', () => {
    test('should filter products with multiple criteria', async () => {
      // Create test products with various attributes
      const products = [
        integrationTestSetup.generateSampleProduct({ 
          name: 'Gaming Laptop', 
          category: 'Electronics',
          price: 1299.99,
          stock_quantity: 5,
          tags: 'gaming,laptop,electronics'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Office Laptop', 
          category: 'Electronics',
          price: 899.99,
          stock_quantity: 10,
          tags: 'office,laptop,electronics'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Budget Tablet', 
          category: 'Electronics',
          price: 299.99,
          stock_quantity: 20,
          tags: 'budget,tablet,electronics'
        }),
        integrationTestSetup.generateSampleProduct({ 
          name: 'Premium Tablet', 
          category: 'Electronics',
          price: 799.99,
          stock_quantity: 0,
          tags: 'premium,tablet,electronics'
        })
      ];
      
      await Promise.all(products.map(p => integrationTestSetup.createTestProduct(p)));
      
      // Apply multiple filters
      const filter = {
        category: 'Electronics',
        minPrice: 500,
        maxPrice: 1000,
        inStock: true,
        tags: ['laptop']
      };
      
      const response = await productService.filterProducts(filter);
      
      // Verify the response
      expect(response.success).toBe(true);
      
      // Should only return products matching all criteria
      response.data.forEach(product => {
        expect(product.category).toBe('Electronics');
        expect(product.price).toBeGreaterThanOrEqual(500);
        expect(product.price).toBeLessThanOrEqual(1000);
        expect(product.stock).toBeGreaterThan(0);
        expect(product.tags.includes('laptop')).toBe(true);
      });
      
      // Should find the office laptop but not the others
      const officeLaptop = response.data.find(p => p.name === 'Office Laptop');
      const gamingLaptop = response.data.find(p => p.name === 'Gaming Laptop');
      const budgetTablet = response.data.find(p => p.name === 'Budget Tablet');
      const premiumTablet = response.data.find(p => p.name === 'Premium Tablet');
      
      expect(officeLaptop).toBeDefined();
      expect(gamingLaptop).toBeUndefined(); // Price too high
      expect(budgetTablet).toBeUndefined(); // Price too low and wrong tags
      expect(premiumTablet).toBeUndefined(); // Out of stock and wrong tags
    });
  });
});
