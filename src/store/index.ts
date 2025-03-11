import { configureStore } from '@reduxjs/toolkit';

// This will be expanded with reducers for the product catalog
const store = configureStore({
  reducer: {
    // Add reducers here as they are created
    // Example: products: productsReducer,
  },
  // Add middleware as needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;