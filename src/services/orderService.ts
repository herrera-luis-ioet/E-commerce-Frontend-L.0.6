/**
 * Order service for handling order-related API requests
 */
import apiService from './api';
import { Endpoints } from '../types/api.types';
import { 
  Order, 
  OrderStatus, 
  OrderCreate, 
  OrderUpdate,
  OrderFilter,
  OrderPaginationParams
} from '../types/order.types';
import { transformPaginatedOrdersFromBackend } from '../utils/dataTransformers';

/**
 * Convert frontend pagination parameters to backend format
 * @param pagination - Frontend pagination parameters
 * @returns Backend pagination parameters
 */
const convertPaginationParams = (pagination?: OrderPaginationParams) => {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  // Backend uses skip/limit instead of page/limit
  const skip = (page - 1) * limit;
  
  return {
    skip,
    limit
  };
};

/**
 * OrderService class for handling order-related API requests
 */
class OrderService {
  /**
   * PUBLIC_INTERFACE
   * Fetch all orders with optional pagination
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of orders with pagination metadata
   */
  public async getOrders(pagination?: OrderPaginationParams) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Order>(
      Endpoints.ORDERS, 
      params,
      transformPaginatedOrdersFromBackend
    );
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch orders by status with optional pagination
   * @param status - Order status
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of orders with pagination metadata
   */
  public async getOrdersByStatus(status: OrderStatus, pagination?: OrderPaginationParams) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Order>(
      `${Endpoints.ORDERS_BY_STATUS}${status}`, 
      params,
      transformPaginatedOrdersFromBackend
    );
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch orders by date range with optional pagination
   * @param startDate - Start date (ISO format string)
   * @param endDate - End date (ISO format string)
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of orders with pagination metadata
   */
  public async getOrdersByDateRange(
    startDate: string, 
    endDate: string, 
    pagination?: OrderPaginationParams
  ) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        start_date: startDate,
        end_date: endDate,
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Order>(
      Endpoints.ORDERS_BY_DATE_RANGE, 
      params,
      transformPaginatedOrdersFromBackend
    );
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch a single order by ID
   * @param id - Order ID
   * @returns Promise resolving to an order
   */
  public async getOrderById(id: string) {
    return apiService.get<Order>(`${Endpoints.ORDER_BY_ID}${id}`);
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new order
   * @param orderData - Order data
   * @returns Promise resolving to the created order
   */
  public async createOrder(orderData: OrderCreate) {
    return apiService.post<Order>(Endpoints.ORDERS, orderData);
  }

  /**
   * PUBLIC_INTERFACE
   * Update an order
   * @param id - Order ID
   * @param orderData - Order data to update
   * @returns Promise resolving to the updated order
   */
  public async updateOrder(id: string, orderData: OrderUpdate) {
    return apiService.put<Order>(`${Endpoints.ORDER_BY_ID}${id}`, orderData);
  }

  /**
   * PUBLIC_INTERFACE
   * Update an order's status
   * @param id - Order ID
   * @param status - New order status
   * @returns Promise resolving to the updated order
   */
  public async updateOrderStatus(id: string, status: OrderStatus) {
    return apiService.patch<Order>(`${Endpoints.ORDER_BY_ID}${id}/status`, { status });
  }

  /**
   * PUBLIC_INTERFACE
   * Delete an order
   * @param id - Order ID
   * @returns Promise resolving to void
   */
  public async deleteOrder(id: string) {
    return apiService.delete(`${Endpoints.ORDER_BY_ID}${id}`);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch orders with advanced filtering options
   * @param filter - Order filter options
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of orders with pagination metadata
   */
  public async filterOrders(filter: OrderFilter, pagination?: OrderPaginationParams) {
    const paginationParams = convertPaginationParams(pagination);
    
    // Convert filter object to query parameters
    const filterParams: Record<string, string | number | boolean | undefined> = {};
    
    // Process each filter property and map to backend parameters
    if (filter.customer_id) filterParams.customer_id = filter.customer_id;
    if (filter.status) filterParams.status = filter.status;
    if (filter.min_total !== undefined) filterParams.min_total = filter.min_total;
    if (filter.max_total !== undefined) filterParams.max_total = filter.max_total;
    if (filter.start_date) filterParams.start_date = filter.start_date;
    if (filter.end_date) filterParams.end_date = filter.end_date;

    const params = {
      params: {
        ...filterParams,
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Order>(
      Endpoints.ORDERS, 
      params,
      transformPaginatedOrdersFromBackend
    );
  }
}

// Create and export a singleton instance of the OrderService
const orderService = new OrderService();
export default orderService;
