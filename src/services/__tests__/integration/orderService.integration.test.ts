/**
 * Order Service Integration Tests
 * 
 * This file contains integration tests for the order service,
 * verifying that it correctly interacts with the backend API
 * and transforms data between frontend and backend formats.
 */

const integrationTestSetup = require('./setup').default;
const orderService = require('../../orderService').default;
const { OrderStatus, OrderCreate, OrderUpdate } = require('../../../types/order.types');
const { 
  transformOrderFromBackend, 
  transformOrderToBackend 
} = require('../../../utils/dataTransformers');
const { PerformanceTracker } = require('./report-generator');

// Configure Jest to have a longer timeout for integration tests
jest.setTimeout(30000);

describe('Order Service Integration Tests', () => {
  // Sample test data
  let testProducts: any[] = [];
  let testOrder: any;

  // Before all tests, check if the API is available and create test products
  beforeAll(async () => {
    const isApiAvailable = await integrationTestSetup.isApiAvailable();
    if (!isApiAvailable) {
      console.warn('API is not available. Integration tests will be skipped.');
      return;
    }

    // Create test products to use in orders
    const productData = [
      integrationTestSetup.generateSampleProduct({ name: 'Test Product 1', price: 29.99 }),
      integrationTestSetup.generateSampleProduct({ name: 'Test Product 2', price: 39.99 })
    ];
    
    testProducts = await Promise.all(productData.map(product => 
      integrationTestSetup.createTestProduct(product)
    ));
  });

  // After each test, clean up any test data
  afterEach(async () => {
    await integrationTestSetup.cleanupTestData();
  });

  /**
   * Test 1: Fetching all orders with pagination
   */
  describe('Fetching all orders with pagination', () => {
    beforeEach(async () => {
      // Create multiple test orders
      const orderData1 = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Test Customer 1' }
      );
      
      const orderData2 = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Test Customer 2' }
      );
      
      const orderData3 = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Test Customer 3' }
      );
      
      await Promise.all([
        integrationTestSetup.createTestOrder(orderData1),
        integrationTestSetup.createTestOrder(orderData2),
        integrationTestSetup.createTestOrder(orderData3)
      ]);
    });

    test('should fetch orders with default pagination', async () => {
      // Fetch orders using the order service
      const response = await orderService.getOrders();
      
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
      const testCustomerNames = ['Test Customer 1', 'Test Customer 2', 'Test Customer 3'];
      const foundOrders = response.data.filter(o => testCustomerNames.includes(o.customer_id));
      expect(foundOrders.length).toBeGreaterThanOrEqual(3);
      
      // Check that each order has the expected structure after transformation
      foundOrders.forEach(order => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('total_amount');
        expect(order).toHaveProperty('items');
        expect(Array.isArray(order.items)).toBe(true);
        
        // Check order items structure
        if (order.items.length > 0) {
          const item = order.items[0];
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('product_id');
          expect(item).toHaveProperty('order_id');
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('price');
          expect(item).toHaveProperty('quantity');
          expect(item).toHaveProperty('subtotal');
        }
      });
    });

    test('should fetch orders with custom pagination', async () => {
      // Fetch first page with 2 items per page
      const page1Response = await orderService.getOrders({ page: 1, limit: 2 });
      
      // Verify pagination works correctly
      expect(page1Response.success).toBe(true);
      expect(page1Response.meta.currentPage).toBe(1);
      expect(page1Response.meta.itemsPerPage).toBe(2);
      expect(page1Response.data.length).toBeLessThanOrEqual(2);
      
      // Fetch second page
      const page2Response = await orderService.getOrders({ page: 2, limit: 2 });
      
      // Verify second page has different items
      expect(page2Response.success).toBe(true);
      expect(page2Response.meta.currentPage).toBe(2);
      
      // Ensure we got different orders on different pages
      const page1Ids = page1Response.data.map(o => o.id);
      const page2Ids = page2Response.data.map(o => o.id);
      
      // Check that no IDs from page 1 appear in page 2
      const commonIds = page1Ids.filter(id => page2Ids.includes(id));
      expect(commonIds.length).toBe(0);
    });
  });

  /**
   * Test 2: Fetching a single order by ID
   */
  describe('Fetching a single order by ID', () => {
    beforeEach(async () => {
      // Create a test order
      const orderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        {
          customer_name: 'Single Order Test',
          customer_email: 'single@test.com',
          notes: 'Test order for single fetch'
        }
      );
      
      testOrder = await integrationTestSetup.createTestOrder(orderData);
    });

    test('should fetch an order by ID and correctly transform data', async () => {
      // Fetch the order using the order service
      const response = await orderService.getOrderById(testOrder.id.toString());
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(testOrder.id.toString());
      expect(response.data.status).toBe(OrderStatus.PENDING);
      expect(response.data.items.length).toBe(testProducts.length);
      
      // Verify shipping address transformation
      if (response.data.shipping_address) {
        expect(response.data.shipping_address.street).toBe(testOrder.shipping_address);
        expect(response.data.shipping_address.city).toBe(testOrder.shipping_city);
        expect(response.data.shipping_address.country).toBe(testOrder.shipping_country);
        expect(response.data.shipping_address.postal_code).toBe(testOrder.shipping_postal_code);
      }
      
      // Verify order items transformation
      response.data.items.forEach((item, index) => {
        expect(item.product_id).toBe(testProducts[index].id.toString());
        expect(item.quantity).toBe(1); // Default quantity in sample order
        expect(item.order_id).toBe(testOrder.id.toString());
      });
    });

    test('should handle non-existent order ID', async () => {
      // Try to fetch an order with a non-existent ID
      try {
        await orderService.getOrderById('999999');
        // If we reach here, the test should fail
        fail('Expected an error for non-existent order ID');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
      }
    });
  });

  /**
   * Test 3: Creating a new order
   */
  describe('Creating a new order', () => {
    test('should create a new order and correctly transform data', async () => {
      // Create order data
      const orderCreateData: OrderCreate = {
        customer_id: 'test-customer-id',
        items: testProducts.map(p => ({
          product_id: p.id.toString(),
          quantity: 2
        })),
        shipping_address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postal_code: '12345',
          country: 'Test Country'
        },
        payment_method: 'test_payment',
        notes: 'Test order creation'
      };
      
      // Start performance tracking
      PerformanceTracker.startTest('Create New Order');
      
      // Create the order using the order service
      const response = await orderService.createOrder(orderCreateData);
      
      // End performance tracking
      PerformanceTracker.endTest('Create New Order', '/api/v1/orders');
      
      // Record API call performance
      PerformanceTracker.recordApiCall('/api/v1/orders', response.meta?.responseTime || 0);
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.status).toBe(OrderStatus.PENDING);
      expect(response.data.items.length).toBe(testProducts.length);
      
      // Verify shipping address transformation
      if (response.data.shipping_address) {
        expect(response.data.shipping_address.street).toBe(orderCreateData.shipping_address?.street);
        expect(response.data.shipping_address.city).toBe(orderCreateData.shipping_address?.city);
        expect(response.data.shipping_address.country).toBe(orderCreateData.shipping_address?.country);
        expect(response.data.shipping_address.postal_code).toBe(orderCreateData.shipping_address?.postal_code);
      }
      
      // Verify order items transformation
      response.data.items.forEach((item, index) => {
        expect(item.product_id).toBe(testProducts[index].id.toString());
        expect(item.quantity).toBe(2); // As specified in orderCreateData
      });
      
      // Add the created order ID to the list of orders to clean up
      // We don't need to manually track this as the setup will handle it
    });

    test('should handle validation errors when creating an order', async () => {
      // Create invalid order data (missing required fields)
      const invalidOrderData: any = {
        customer_id: 'test-customer-id',
        items: [] // Empty items array should fail validation
      };
      
      // Try to create the order
      try {
        await orderService.createOrder(invalidOrderData);
        // If we reach here, the test should fail
        fail('Expected an error for invalid order data');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
      }
    });
  });

  /**
   * Test 4: Updating an order
   */
  describe('Updating an order', () => {
    beforeEach(async () => {
      // Create a test order
      const orderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        {
          customer_name: 'Update Order Test',
          customer_email: 'update@test.com',
          notes: 'Test order for update'
        }
      );
      
      testOrder = await integrationTestSetup.createTestOrder(orderData);
    });

    test('should update an order and correctly transform data', async () => {
      // Create update data
      const orderUpdateData: OrderUpdate = {
        status: OrderStatus.PROCESSING,
        shipping_address: {
          street: '456 Updated Street',
          city: 'Updated City',
          state: 'Updated State',
          postal_code: '54321',
          country: 'Updated Country'
        },
        notes: 'Updated test order'
      };
      
      // Update the order using the order service
      const response = await orderService.updateOrder(testOrder.id.toString(), orderUpdateData);
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(testOrder.id.toString());
      expect(response.data.status).toBe(OrderStatus.PROCESSING);
      expect(response.data.notes).toBe(orderUpdateData.notes);
      
      // Verify shipping address transformation
      if (response.data.shipping_address) {
        expect(response.data.shipping_address.street).toBe(orderUpdateData.shipping_address?.street);
        expect(response.data.shipping_address.city).toBe(orderUpdateData.shipping_address?.city);
        expect(response.data.shipping_address.country).toBe(orderUpdateData.shipping_address?.country);
        expect(response.data.shipping_address.postal_code).toBe(orderUpdateData.shipping_address?.postal_code);
      }
    });

    test('should handle non-existent order ID when updating', async () => {
      // Try to update an order with a non-existent ID
      const orderUpdateData: OrderUpdate = {
        status: OrderStatus.PROCESSING
      };
      
      try {
        await orderService.updateOrder('999999', orderUpdateData);
        // If we reach here, the test should fail
        fail('Expected an error for non-existent order ID');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
      }
    });
  });

  /**
   * Test 5: Deleting an order
   */
  describe('Deleting an order', () => {
    beforeEach(async () => {
      // Create a test order
      const orderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        {
          customer_name: 'Delete Order Test',
          customer_email: 'delete@test.com',
          notes: 'Test order for deletion'
        }
      );
      
      testOrder = await integrationTestSetup.createTestOrder(orderData);
    });

    test('should delete an order', async () => {
      // Delete the order using the order service
      const response = await orderService.deleteOrder(testOrder.id.toString());
      
      // Verify the response
      expect(response.success).toBe(true);
      
      // Try to fetch the deleted order
      try {
        await orderService.getOrderById(testOrder.id.toString());
        // If we reach here, the test should fail
        fail('Expected an error for deleted order ID');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
      }
    });

    test('should handle non-existent order ID when deleting', async () => {
      // Try to delete an order with a non-existent ID
      try {
        await orderService.deleteOrder('999999');
        // If we reach here, the test should fail
        fail('Expected an error for non-existent order ID');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(404);
      }
    });
  });

  /**
   * Test 6: Filtering orders by status
   */
  describe('Filtering orders by status', () => {
    beforeEach(async () => {
      // Create orders with different statuses
      const pendingOrderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Pending Order' }
      );
      
      const processingOrderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Processing Order' }
      );
      
      const shippedOrderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Shipped Order' }
      );
      
      // Create the orders
      const pendingOrder = await integrationTestSetup.createTestOrder(pendingOrderData);
      const processingOrder = await integrationTestSetup.createTestOrder(processingOrderData);
      const shippedOrder = await integrationTestSetup.createTestOrder(shippedOrderData);
      
      // Update the statuses
      await integrationTestSetup.updateOrderStatus(processingOrder.id, OrderStatus.PROCESSING);
      await integrationTestSetup.updateOrderStatus(shippedOrder.id, OrderStatus.SHIPPED);
    });

    test('should fetch orders filtered by status', async () => {
      // Fetch orders with PROCESSING status
      const response = await orderService.getOrdersByStatus(OrderStatus.PROCESSING);
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // All returned orders should have PROCESSING status
      response.data.forEach(order => {
        expect(order.status).toBe(OrderStatus.PROCESSING);
      });
      
      // Should find at least one order with "Processing Order" customer name
      const processingOrder = response.data.find(o => o.customer_id === 'Processing Order');
      expect(processingOrder).toBeDefined();
    });

    test('should handle filtering by status with pagination', async () => {
      // Create multiple orders with the same status
      const orderData = Array(5).fill(null).map((_, index) => 
        integrationTestSetup.generateSampleOrder(
          testProducts.map(p => p.id),
          { customer_name: `Pending Order ${index + 1}` }
        )
      );
      
      await Promise.all(orderData.map(data => integrationTestSetup.createTestOrder(data)));
      
      // Fetch first page with 2 items per page
      const page1Response = await orderService.getOrdersByStatus(
        OrderStatus.PENDING, 
        { page: 1, limit: 2 }
      );
      
      // Verify pagination works correctly
      expect(page1Response.success).toBe(true);
      expect(page1Response.meta.currentPage).toBe(1);
      expect(page1Response.meta.itemsPerPage).toBe(2);
      expect(page1Response.data.length).toBeLessThanOrEqual(2);
      
      // All returned orders should have PENDING status
      page1Response.data.forEach(order => {
        expect(order.status).toBe(OrderStatus.PENDING);
      });
    });
  });

  /**
   * Test 7: Fetching orders by date range
   */
  describe('Fetching orders by date range', () => {
    beforeEach(async () => {
      // Create test orders
      const orderData = integrationTestSetup.generateSampleOrder(
        testProducts.map(p => p.id),
        { customer_name: 'Date Range Test Order' }
      );
      
      testOrder = await integrationTestSetup.createTestOrder(orderData);
    });

    test('should fetch orders by date range', async () => {
      // Get current date
      const now = new Date();
      
      // Set date range to include today
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1); // Yesterday
      
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 1); // Tomorrow
      
      // Fetch orders by date range
      const response = await orderService.getOrdersByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      // Verify the response
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      
      // Should find our test order
      const foundOrder = response.data.find(o => o.id === testOrder.id.toString());
      expect(foundOrder).toBeDefined();
    });

    test('should handle invalid date range', async () => {
      // Set invalid date range (end date before start date)
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      startDate.setDate(startDate.getDate() + 1); // Tomorrow
      endDate.setDate(endDate.getDate() - 1); // Yesterday
      
      // Try to fetch orders with invalid date range
      try {
        await orderService.getOrdersByDateRange(
          startDate.toISOString(),
          endDate.toISOString()
        );
        // If we reach here, the test should fail
        fail('Expected an error for invalid date range');
      } catch (error) {
        // Verify the error response
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
