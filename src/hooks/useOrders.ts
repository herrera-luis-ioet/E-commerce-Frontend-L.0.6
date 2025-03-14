/**
 * Custom hook for working with orders in the Redux store
 */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchOrders, 
  fetchOrderById, 
  fetchOrdersByStatus,
  fetchOrdersByDateRange,
  createOrder, 
  updateOrder, 
  updateOrderStatus,
  deleteOrder,
  filterOrders,
  selectOrder,
  resetOrderState
} from '../store/slices/orderSlice';
import { 
  OrderStatus, 
  OrderCreate, 
  OrderUpdate,
  OrderFilter,
  OrderPaginationParams
} from '../types/order.types';

/**
 * Custom hook for working with orders
 */
export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { 
    orders, 
    selectedOrder, 
    currentPage, 
    itemsPerPage, 
    totalOrders, 
    totalPages, 
    loading, 
    error,
    initialized
  } = useAppSelector(state => state.orders);

  /**
   * Fetch all orders with optional pagination
   */
  const getOrders = useCallback((pagination?: OrderPaginationParams) => {
    return dispatch(fetchOrders({
      page: pagination?.page || currentPage,
      limit: pagination?.limit || itemsPerPage
    }));
  }, [dispatch, currentPage, itemsPerPage]);

  /**
   * Fetch orders by status with optional pagination
   */
  const getOrdersByStatus = useCallback((status: OrderStatus, pagination?: OrderPaginationParams) => {
    return dispatch(fetchOrdersByStatus({
      status,
      page: pagination?.page || currentPage,
      limit: pagination?.limit || itemsPerPage
    }));
  }, [dispatch, currentPage, itemsPerPage]);

  /**
   * Fetch orders by date range with optional pagination
   */
  const getOrdersByDateRange = useCallback((startDate: string, endDate: string, pagination?: OrderPaginationParams) => {
    return dispatch(fetchOrdersByDateRange({
      startDate,
      endDate,
      page: pagination?.page || currentPage,
      limit: pagination?.limit || itemsPerPage
    }));
  }, [dispatch, currentPage, itemsPerPage]);

  /**
   * Fetch a single order by ID
   */
  const getOrderById = useCallback((id: string) => {
    return dispatch(fetchOrderById(id));
  }, [dispatch]);

  /**
   * Create a new order
   */
  const addOrder = useCallback((orderData: OrderCreate) => {
    return dispatch(createOrder(orderData));
  }, [dispatch]);

  /**
   * Update an existing order
   */
  const editOrder = useCallback((id: string, orderData: OrderUpdate) => {
    return dispatch(updateOrder({ id, orderData }));
  }, [dispatch]);

  /**
   * Update an order's status
   */
  const changeOrderStatus = useCallback((id: string, status: OrderStatus) => {
    return dispatch(updateOrderStatus({ id, status }));
  }, [dispatch]);

  /**
   * Delete an order
   */
  const removeOrder = useCallback((id: string) => {
    return dispatch(deleteOrder(id));
  }, [dispatch]);

  /**
   * Filter orders with optional pagination
   */
  const applyOrderFilters = useCallback((filter: OrderFilter, pagination?: OrderPaginationParams) => {
    return dispatch(filterOrders({
      filter,
      page: pagination?.page || currentPage,
      limit: pagination?.limit || itemsPerPage
    }));
  }, [dispatch, currentPage, itemsPerPage]);

  /**
   * Select an order for detailed view/edit
   */
  const setSelectedOrder = useCallback((order: typeof selectedOrder) => {
    dispatch(selectOrder(order));
  }, [dispatch]);

  /**
   * Reset the order state
   */
  const resetOrders = useCallback(() => {
    dispatch(resetOrderState());
  }, [dispatch]);

  return {
    // State
    orders,
    selectedOrder,
    currentPage,
    itemsPerPage,
    totalOrders,
    totalPages,
    loading,
    error,
    initialized,
    
    // Actions
    getOrders,
    getOrdersByStatus,
    getOrdersByDateRange,
    getOrderById,
    addOrder,
    editOrder,
    changeOrderStatus,
    removeOrder,
    applyOrderFilters,
    setSelectedOrder,
    resetOrders
  };
};

export default useOrders;