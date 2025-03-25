/**
 * Cart slice for Redux state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CartState,
  CartItem,
  AddToCartPayload,
  RemoveFromCartPayload,
  UpdateCartItemPayload
} from '../../types/cart.types';
import { Product } from '../../types/product.types';

/**
 * Initial state for the cart slice
 */
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  isOpen: false
};

/**
 * Helper function to calculate cart totals
 */
const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.finalPrice, 0);
  return { totalItems, totalPrice };
};

/**
 * Cart slice definition
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add an item to the cart
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item already exists, update quantity
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].price = product.price * state.items[existingItemIndex].quantity;
        state.items[existingItemIndex].finalPrice = product.discountPrice 
          ? product.discountPrice * state.items[existingItemIndex].quantity 
          : state.items[existingItemIndex].price;
      } else {
        // Add new item
        const price = product.price * quantity;
        const finalPrice = product.discountPrice ? product.discountPrice * quantity : price;
        const hasDiscount = !!product.discountPrice;
        
        state.items.push({
          product,
          quantity,
          price,
          finalPrice,
          hasDiscount
        });
      }
      
      // Update totals
      const { totalItems, totalPrice } = calculateCartTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
    
    /**
     * Remove an item from the cart
     */
    removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
      
      // Update totals
      const { totalItems, totalPrice } = calculateCartTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
    
    /**
     * Update the quantity of an item in the cart
     */
    updateCartItemQuantity: (state, action: PayloadAction<UpdateCartItemPayload>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
          state.items[itemIndex].price = state.items[itemIndex].product.price * quantity;
          state.items[itemIndex].finalPrice = state.items[itemIndex].product.discountPrice 
            ? state.items[itemIndex].product.discountPrice * quantity 
            : state.items[itemIndex].price;
        }
        
        // Update totals
        const { totalItems, totalPrice } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      }
    },
    
    /**
     * Clear all items from the cart
     */
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    
    /**
     * Set the loading state of the cart
     */
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Set an error in the cart state
     */
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    /**
     * Toggle the cart visibility
     */
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    /**
     * Set the cart open state
     */
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    
    /**
     * Initialize the cart from storage
     */
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const { totalItems, totalPrice } = calculateCartTotals(action.payload);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
    
    /**
     * Reset cart state
     */
    resetCartState: () => initialState
  }
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  toggleCart,
  setCartOpen,
  initializeCart,
  resetCartState
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
