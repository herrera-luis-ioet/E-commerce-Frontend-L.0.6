import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import filterReducer from './slices/filterSlice';
import orderReducer from './slices/orderSlice';

// Configure the Redux store with product, filter, and order reducers
const store = configureStore({
  reducer: {
    products: productReducer,
    filter: filterReducer,
    orders: orderReducer,
  },
  // Add middleware as needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
