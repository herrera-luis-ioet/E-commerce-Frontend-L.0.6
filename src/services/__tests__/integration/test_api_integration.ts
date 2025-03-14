/**
 * API Integration Tests
 * 
 * This file demonstrates how to use the integration test setup script
 * to test the integration between the frontend and backend API.
 */

import integrationTestSetup from './setup';
import apiService from '../../api';
import productService from '../../productService';
import orderService from '../../orderService';
import { OrderStatus } from '../../../types/order.types';

// Configure Jest to have a longer timeout for integration tests
jest.setTimeout(30000);

describe('API Integration Tests', () => {
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

  test('should create a product and retrieve it through the frontend service', async () => {
    // Create a test product in the backend
    const testProduct = integrationTestSetup.generateSampleProduct();
    const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

    // Retrieve the product using the frontend service
    const response = await productService.getProductById(createdProduct.id.toString());
    
    // Verify the response
    expect(response.success).toBe(true);
    expect(response.data.id).toBe(createdProduct.id);
    expect(response.data.name).toBe(testProduct.name);
    expect(response.data.sku).toBe(testProduct.sku);
  });

  test('should create an order and retrieve it through the frontend service', async () => {
    // Create a test product first
    const testProduct = integrationTestSetup.generateSampleProduct();
    const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

    // Create a test order using the product
    const testOrder = integrationTestSetup.generateSampleOrder([createdProduct.id]);
    const createdOrder = await integrationTestSetup.createTestOrder(testOrder);

    // Retrieve the order using the frontend service
    const response = await orderService.getOrderById(createdOrder.id.toString());
    
    // Verify the response
    expect(response.success).toBe(true);
    expect(response.data.id).toBe(createdOrder.id);
    expect(response.data.customer_name).toBe(testOrder.customer_name);
    expect(response.data.customer_email).toBe(testOrder.customer_email);
    expect(response.data.items.length).toBe(1);
    expect(response.data.items[0].product_id).toBe(createdProduct.id.toString());
  });

  test('should update product stock and reflect changes in frontend service', async () => {
    // Create a test product with initial stock
    const initialStock = 100;
    const testProduct = integrationTestSetup.generateSampleProduct({ stock_quantity: initialStock });
    const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

    // Update the stock quantity
    const quantityChange = -10;
    await integrationTestSetup.updateProductStock(createdProduct.id, quantityChange);

    // Retrieve the updated product using the frontend service
    const response = await productService.getProductById(createdProduct.id.toString());
    
    // Verify the stock was updated
    expect(response.success).toBe(true);
    expect(response.data.stock_quantity).toBe(initialStock + quantityChange);
  });

  test('should update order status and reflect changes in frontend service', async () => {
    // Create a test product
    const testProduct = integrationTestSetup.generateSampleProduct();
    const createdProduct = await integrationTestSetup.createTestProduct(testProduct);

    // Create a test order
    const testOrder = integrationTestSetup.generateSampleOrder([createdProduct.id]);
    const createdOrder = await integrationTestSetup.createTestOrder(testOrder);

    // Update the order status
    const newStatus = OrderStatus.PROCESSING;
    await integrationTestSetup.updateOrderStatus(createdOrder.id, newStatus);

    // Retrieve the updated order using the frontend service
    const response = await orderService.getOrderById(createdOrder.id.toString());
    
    // Verify the status was updated
    expect(response.success).toBe(true);
    expect(response.data.status).toBe(newStatus);
  });

  test('should retrieve products by category', async () => {
    // Create test products with the same category
    const category = 'TestCategory';
    const testProduct1 = integrationTestSetup.generateSampleProduct({ category });
    const testProduct2 = integrationTestSetup.generateSampleProduct({ category });
    
    await integrationTestSetup.createTestProduct(testProduct1);
    await integrationTestSetup.createTestProduct(testProduct2);

    // Retrieve products by category using the frontend service
    const response = await productService.getProductsByCategory(category);
    
    // Verify the response
    expect(response.success).toBe(true);
    expect(response.data.length).toBeGreaterThanOrEqual(2);
    
    // Check that all returned products have the correct category
    response.data.forEach(product => {
      expect(product.category).toBe(category);
    });
  });
});