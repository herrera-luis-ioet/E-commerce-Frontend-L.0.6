import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiService from '../api';
import orderService from '../orderService';
import { Endpoints } from '../../types/api.types';
import { OrderStatus } from '../../types/order.types';

// Mock axios
const mockAxios = new MockAdapter(axios);

describe('OrderService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockAxios.reset();
  });

  // Sample order data for testing
  const mockOrder = {
    id: '1',
    customer_id: '123',
    status: OrderStatus.PENDING,
    total_amount: 99.99,
    items: [
      {
        id: '101',
        product_id: '201',
        order_id: '1',
        name: 'Test Product',
        price: 49.99,
        quantity: 2,
        subtotal: 99.98,
        final_price: 99.98
      }
    ],
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-01T12:00:00Z'
  };

  // Mock response format
  const mockResponse = {
    success: true,
    data: mockOrder,
    statusCode: 200,
    message: 'Success'
  };

  // Mock paginated response format
  const mockPaginatedResponse = {
    success: true,
    data: [mockOrder],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    },
    statusCode: 200,
    message: 'Success'
  };

  test('getOrders should fetch all orders with pagination', async () => {
    // Mock the API response
    mockAxios.onGet(Endpoints.ORDERS).reply(200, mockPaginatedResponse);

    // Call the service method
    const result = await orderService.getOrders();

    // Verify the result
    expect(result).toEqual(mockPaginatedResponse);
  });

  test('getOrdersByStatus should fetch orders by status', async () => {
    const status = OrderStatus.PENDING;
    const endpoint = `${Endpoints.ORDERS_BY_STATUS}${status}`;
    
    // Mock the API response
    mockAxios.onGet(endpoint).reply(200, mockPaginatedResponse);

    // Call the service method
    const result = await orderService.getOrdersByStatus(status);

    // Verify the result
    expect(result).toEqual(mockPaginatedResponse);
  });

  test('getOrderById should fetch a single order by ID', async () => {
    const orderId = '1';
    const endpoint = `${Endpoints.ORDER_BY_ID}${orderId}`;
    
    // Mock the API response
    mockAxios.onGet(endpoint).reply(200, mockResponse);

    // Call the service method
    const result = await orderService.getOrderById(orderId);

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  test('createOrder should create a new order', async () => {
    const orderData = {
      customer_id: '123',
      items: [
        {
          product_id: '201',
          quantity: 2
        }
      ]
    };
    
    // Mock the API response
    mockAxios.onPost(Endpoints.ORDERS).reply(201, mockResponse);

    // Call the service method
    const result = await orderService.createOrder(orderData);

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  test('updateOrder should update an existing order', async () => {
    const orderId = '1';
    const orderData = {
      status: OrderStatus.PROCESSING
    };
    const endpoint = `${Endpoints.ORDER_BY_ID}${orderId}`;
    
    // Mock the API response
    mockAxios.onPut(endpoint).reply(200, mockResponse);

    // Call the service method
    const result = await orderService.updateOrder(orderId, orderData);

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  test('updateOrderStatus should update an order status', async () => {
    const orderId = '1';
    const status = OrderStatus.SHIPPED;
    const endpoint = `${Endpoints.ORDER_BY_ID}${orderId}/status`;
    
    // Mock the API response
    mockAxios.onPatch(endpoint).reply(200, mockResponse);

    // Call the service method
    const result = await orderService.updateOrderStatus(orderId, status);

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  test('deleteOrder should delete an order', async () => {
    const orderId = '1';
    const endpoint = `${Endpoints.ORDER_BY_ID}${orderId}`;
    
    // Mock the API response
    mockAxios.onDelete(endpoint).reply(204);

    // Call the service method
    await orderService.deleteOrder(orderId);

    // Verify that the request was made correctly
    expect(mockAxios.history.delete.length).toBe(1);
    expect(mockAxios.history.delete[0].url).toBe(endpoint);
  });
});