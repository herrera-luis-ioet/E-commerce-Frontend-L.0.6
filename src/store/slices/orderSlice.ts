/**
 * Order slice for Redux state management
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Order, 
  OrderStatus, 
  OrderCreate, 
  OrderUpdate,
  OrderFilter,
  OrderPaginationParams
} from '../../types/order.types';
import orderService from '../../services/orderService';
import { 
  transformOrderFromBackend, 
  transformPaginatedOrdersFromBackend 
} from '../../utils/dataTransformers';

/**
 * Interface for the order state in Redux
 */
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  currentPage: number;
  itemsPerPage: number;
  totalOrders: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

/**
 * Initial state for the order slice
 */
const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalOrders: 0,
  totalPages: 0,
  loading: false,
  error: null,
  initialized: false
};

/**
 * Async thunk for fetching all orders with pagination
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ 
    page = 1, 
    limit = 10 
  }: { 
    page?: number; 
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders({ page, limit });
      const transformedResponse = transformPaginatedOrdersFromBackend(response);
      
      return {
        orders: transformedResponse.data,
        totalOrders: transformedResponse.meta.total,
        totalPages: transformedResponse.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  }
);

/**
 * Async thunk for fetching orders by status
 */
export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchOrdersByStatus',
  async ({ 
    status,
    page = 1, 
    limit = 10 
  }: { 
    status: OrderStatus;
    page?: number; 
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrdersByStatus(status, { page, limit });
      const transformedResponse = transformPaginatedOrdersFromBackend(response);
      
      return {
        orders: transformedResponse.data,
        totalOrders: transformedResponse.meta.total,
        totalPages: transformedResponse.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders by status');
    }
  }
);

/**
 * Async thunk for fetching orders by date range
 */
export const fetchOrdersByDateRange = createAsyncThunk(
  'orders/fetchOrdersByDateRange',
  async ({ 
    startDate,
    endDate,
    page = 1, 
    limit = 10 
  }: { 
    startDate: string;
    endDate: string;
    page?: number; 
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrdersByDateRange(startDate, endDate, { page, limit });
      const transformedResponse = transformPaginatedOrdersFromBackend(response);
      
      return {
        orders: transformedResponse.data,
        totalOrders: transformedResponse.meta.total,
        totalPages: transformedResponse.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders by date range');
    }
  }
);

/**
 * Async thunk for fetching a single order by ID
 */
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return transformOrderFromBackend(response.data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch order');
    }
  }
);

/**
 * Async thunk for creating a new order
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: OrderCreate, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return transformOrderFromBackend(response.data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create order');
    }
  }
);

/**
 * Async thunk for updating an order
 */
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ 
    id, 
    orderData 
  }: { 
    id: string; 
    orderData: OrderUpdate;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrder(id, orderData);
      return transformOrderFromBackend(response.data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order');
    }
  }
);

/**
 * Async thunk for updating an order's status
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ 
    id, 
    status 
  }: { 
    id: string; 
    status: OrderStatus;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      return transformOrderFromBackend(response.data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order status');
    }
  }
);

/**
 * Async thunk for deleting an order
 */
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      await orderService.deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete order');
    }
  }
);

/**
 * Async thunk for filtering orders
 */
export const filterOrders = createAsyncThunk(
  'orders/filterOrders',
  async ({ 
    filter, 
    page = 1, 
    limit = 10 
  }: { 
    filter: OrderFilter; 
    page?: number; 
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await orderService.filterOrders(filter, { page, limit });
      const transformedResponse = transformPaginatedOrdersFromBackend(response);
      
      return {
        orders: transformedResponse.data,
        totalOrders: transformedResponse.meta.total,
        totalPages: transformedResponse.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to filter orders');
    }
  }
);

/**
 * Order slice definition
 */
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /**
     * Select an order
     */
    selectOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    
    /**
     * Reset order state
     */
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    // Handle fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.initialized = true;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch orders';
      });

    // Handle fetchOrdersByStatus
    builder
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch orders by status';
      });

    // Handle fetchOrdersByDateRange
    builder
      .addCase(fetchOrdersByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrdersByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch orders by date range';
      });

    // Handle fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch order';
      });

    // Handle createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [...state.orders, action.payload];
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create order';
      });

    // Handle updateOrder
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update order';
      });

    // Handle updateOrderStatus
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
        if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update order status';
      });

    // Handle deleteOrder
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        if (state.selectedOrder && state.selectedOrder.id === action.payload) {
          state.selectedOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete order';
      });

    // Handle filterOrders
    builder
      .addCase(filterOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(filterOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to filter orders';
      });
  }
});

// Export actions
export const { 
  selectOrder, 
  resetOrderState 
} = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;