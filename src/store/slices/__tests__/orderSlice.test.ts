import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { 
  selectOrder, 
  resetOrderState,
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} from '../orderSlice';
import { OrderStatus } from '../../../types/order.types';

// Mock the orderService
jest.mock('../../../services/orderService', () => ({
  __esModule: true,
  default: {
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    deleteOrder: jest.fn()
  }
}));

// Mock the data transformers
jest.mock('../../../utils/dataTransformers', () => ({
  transformOrderFromBackend: jest.fn(data => data),
  transformPaginatedOrdersFromBackend: jest.fn(data => ({
    success: true,
    statusCode: 200,
    data: data.items,
    meta: {
      currentPage: data.meta.page,
      itemsPerPage: data.meta.per_page,
      total: data.meta.total,
      totalPages: data.meta.total_pages,
      hasNextPage: data.meta.page < data.meta.total_pages,
      hasPrevPage: data.meta.page > 1
    }
  }))
}));

describe('Order Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: orderReducer
      }
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().orders).toEqual({
      orders: [],
      selectedOrder: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalOrders: 0,
      totalPages: 0,
      loading: false,
      error: null,
      initialized: false
    });
  });

  it('should handle selectOrder', () => {
    const mockOrder = {
      id: '1',
      customer_id: '123',
      status: OrderStatus.PENDING,
      total_amount: 100,
      items: [],
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    store.dispatch(selectOrder(mockOrder));
    expect(store.getState().orders.selectedOrder).toEqual(mockOrder);
  });

  it('should handle resetOrderState', () => {
    // First set some state
    const mockOrder = {
      id: '1',
      customer_id: '123',
      status: OrderStatus.PENDING,
      total_amount: 100,
      items: [],
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };

    store.dispatch(selectOrder(mockOrder));
    expect(store.getState().orders.selectedOrder).toEqual(mockOrder);

    // Then reset it
    store.dispatch(resetOrderState());
    expect(store.getState().orders).toEqual({
      orders: [],
      selectedOrder: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalOrders: 0,
      totalPages: 0,
      loading: false,
      error: null,
      initialized: false
    });
  });
});