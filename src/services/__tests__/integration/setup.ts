/**
 * Integration Test Setup
 * 
 * This module provides utilities for setting up integration tests with the backend API.
 * It configures the API base URL, provides functions for setting up test data,
 * and includes cleanup utilities.
 */

import axios, { AxiosInstance } from 'axios';
import apiService from '../../api';
import { Product } from '../../../types/product.types';
import { Order, OrderCreate, OrderStatus } from '../../../types/order.types';
import { Endpoints } from '../../../types/api.types';

// API configuration for integration tests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Direct axios instance for test data setup and cleanup
// This bypasses the frontend apiService to directly interact with the backend
const testApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Test data interfaces
 */
interface TestProduct {
  name: string;
  description: string;
  sku: string;
  image?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  tags?: string;
  is_active: boolean;
}

interface TestOrder {
  customer_email: string;
  customer_name: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
  shipping_address?: string;
  shipping_city?: string;
  shipping_country?: string;
  shipping_postal_code?: string;
  payment_method?: string;
  payment_id?: string;
  notes?: string;
}

/**
 * Integration test setup class
 */
class IntegrationTestSetup {
  private createdProductIds: number[] = [];
  private createdOrderIds: number[] = [];

  /**
   * Configure the API service for integration tests
   * This method can be used to override the default API configuration
   * @param baseUrl - Custom base URL for the API
   */
  public configureApi(baseUrl: string = API_BASE_URL): void {
    // Override environment variable for API URL
    process.env.REACT_APP_API_URL = baseUrl;
    
    // Log the configuration
    console.log(`Integration tests configured with API URL: ${baseUrl}`);
  }

  /**
   * Create a test product in the backend
   * @param productData - Product data to create
   * @returns The created product
   */
  public async createTestProduct(productData: TestProduct): Promise<Product> {
    try {
      const response = await testApiClient.post('/api/v1/products', productData);
      const createdProduct = response.data.data;
      
      // Store the product ID for cleanup
      this.createdProductIds.push(createdProduct.id);
      
      return createdProduct;
    } catch (error) {
      console.error('Failed to create test product:', error);
      throw error;
    }
  }

  /**
   * Create multiple test products in the backend
   * @param productsData - Array of product data to create
   * @returns Array of created products
   */
  public async createTestProducts(productsData: TestProduct[]): Promise<Product[]> {
    const createdProducts: Product[] = [];
    
    for (const productData of productsData) {
      const product = await this.createTestProduct(productData);
      createdProducts.push(product);
    }
    
    return createdProducts;
  }

  /**
   * Create a test order in the backend
   * @param orderData - Order data to create
   * @returns The created order
   */
  public async createTestOrder(orderData: TestOrder): Promise<Order> {
    try {
      const response = await testApiClient.post('/api/v1/orders', orderData);
      const createdOrder = response.data.data;
      
      // Store the order ID for cleanup
      this.createdOrderIds.push(createdOrder.id);
      
      return createdOrder;
    } catch (error) {
      console.error('Failed to create test order:', error);
      throw error;
    }
  }

  /**
   * Create multiple test orders in the backend
   * @param ordersData - Array of order data to create
   * @returns Array of created orders
   */
  public async createTestOrders(ordersData: TestOrder[]): Promise<Order[]> {
    const createdOrders: Order[] = [];
    
    for (const orderData of ordersData) {
      const order = await this.createTestOrder(orderData);
      createdOrders.push(order);
    }
    
    return createdOrders;
  }

  /**
   * Get a product by ID
   * @param productId - Product ID
   * @returns The product
   */
  public async getProduct(productId: number): Promise<Product> {
    try {
      const response = await testApiClient.get(`/api/v1/products/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get product with ID ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Get an order by ID
   * @param orderId - Order ID
   * @returns The order
   */
  public async getOrder(orderId: number): Promise<Order> {
    try {
      const response = await testApiClient.get(`/api/v1/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get order with ID ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Update a product's stock quantity
   * @param productId - Product ID
   * @param quantityChange - Change in stock quantity (positive for increase, negative for decrease)
   * @returns The updated product
   */
  public async updateProductStock(productId: number, quantityChange: number): Promise<Product> {
    try {
      const response = await testApiClient.patch(
        `/api/v1/products/${productId}/stock?quantity_change=${quantityChange}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update stock for product with ID ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Update an order's status
   * @param orderId - Order ID
   * @param status - New order status
   * @returns The updated order
   */
  public async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    try {
      const response = await testApiClient.patch(
        `/api/v1/orders/${orderId}/status?status=${status}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update status for order with ID ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Clean up all test data created during the test
   * This method should be called after each test to ensure a clean state
   */
  public async cleanupTestData(): Promise<void> {
    // Clean up orders first (to avoid foreign key constraints)
    for (const orderId of this.createdOrderIds) {
      try {
        await testApiClient.delete(`/api/v1/orders/${orderId}`);
      } catch (error) {
        console.warn(`Failed to delete test order with ID ${orderId}:`, error);
      }
    }
    
    // Clean up products
    for (const productId of this.createdProductIds) {
      try {
        await testApiClient.delete(`/api/v1/products/${productId}`);
      } catch (error) {
        console.warn(`Failed to delete test product with ID ${productId}:`, error);
      }
    }
    
    // Reset the arrays
    this.createdOrderIds = [];
    this.createdProductIds = [];
  }

  /**
   * Generate sample product data
   * @param customData - Custom data to override defaults
   * @returns Sample product data
   */
  public generateSampleProduct(customData: Partial<TestProduct> = {}): TestProduct {
    // Generate a unique SKU
    const uniqueSku = `TEST-SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      name: 'Test Product',
      description: 'This is a test product for integration testing',
      sku: uniqueSku,
      image: 'https://example.com/test-image.jpg',
      price: 99.99,
      stock_quantity: 100,
      category: 'Test Category',
      tags: 'test,integration,sample',
      is_active: true,
      ...customData
    };
  }

  /**
   * Generate sample order data
   * @param productIds - Array of product IDs to include in the order
   * @param customData - Custom data to override defaults
   * @returns Sample order data
   */
  public generateSampleOrder(
    productIds: number[],
    customData: Partial<TestOrder> = {}
  ): TestOrder {
    return {
      customer_email: 'test@example.com',
      customer_name: 'Test Customer',
      items: productIds.map(id => ({ product_id: id, quantity: 1 })),
      shipping_address: '123 Test Street',
      shipping_city: 'Test City',
      shipping_country: 'Test Country',
      shipping_postal_code: '12345',
      payment_method: 'test_payment',
      payment_id: `test-payment-${Date.now()}`,
      notes: 'This is a test order for integration testing',
      ...customData
    };
  }

  /**
   * Wait for a specified amount of time
   * Useful for waiting for backend operations to complete
   * @param ms - Milliseconds to wait
   * @returns Promise that resolves after the specified time
   */
  public async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if the backend API is available
   * @returns True if the API is available, false otherwise
   */
  public async isApiAvailable(): Promise<boolean> {
    try {
      const response = await testApiClient.get('/api/v1/health');
      return response.status === 200;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance of the setup class
const integrationTestSetup = new IntegrationTestSetup();
export default integrationTestSetup;