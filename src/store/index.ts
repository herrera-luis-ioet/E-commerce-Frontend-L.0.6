import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import filterReducer from './slices/filterSlice';
import cartReducer from './slices/cartSlice';

// Configure the Redux store with product, filter, and cart reducers
const store = configureStore({
  reducer: {
    products: productReducer,
    filter: filterReducer,
    cart: cartReducer,
  },
  // Add middleware as needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
