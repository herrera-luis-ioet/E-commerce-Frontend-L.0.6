/**
 * Type definitions for the Cart functionality
 */
import { Product } from './product.types';

/**
 * CartItem interface representing an item in the shopping cart
 */
export interface CartItem {
  /** The product being added to cart */
  product: Product;
  /** Quantity of the product in cart */
  quantity: number;
  /** Total price for this item (product.price * quantity) */
  price: number;
  /** Whether the item has a discount applied */
  hasDiscount: boolean;
  /** Final price after discount (if applicable) */
  finalPrice: number;
}

/**
 * CartState interface for Redux store
 */
export interface CartState {
  /** Array of items in the cart */
  items: CartItem[];
  /** Total number of items in the cart (sum of quantities) */
  totalItems: number;
  /** Total price of all items in the cart */
  totalPrice: number;
  /** Whether the cart is currently loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the cart is open in the UI */
  isOpen: boolean;
}

/**
 * CartActionTypes enum for Redux actions
 */
export enum CartActionTypes {
  /** Add an item to the cart */
  ADD_TO_CART = 'ADD_TO_CART',
  /** Remove an item from the cart */
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  /** Update the quantity of an item in the cart */
  UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY',
  /** Clear all items from the cart */
  CLEAR_CART = 'CLEAR_CART',
  /** Set the loading state of the cart */
  SET_CART_LOADING = 'SET_CART_LOADING',
  /** Set an error in the cart state */
  SET_CART_ERROR = 'SET_CART_ERROR',
  /** Toggle the cart visibility */
  TOGGLE_CART = 'TOGGLE_CART',
  /** Initialize the cart from storage */
  INITIALIZE_CART = 'INITIALIZE_CART',
  /** Save the cart to storage */
  SAVE_CART = 'SAVE_CART'
}

/**
 * AddToCartPayload interface for adding items to cart
 */
export interface AddToCartPayload {
  /** The product to add to cart */
  product: Product;
  /** Quantity to add (defaults to 1 if not specified) */
  quantity?: number;
}

/**
 * RemoveFromCartPayload interface for removing items from cart
 */
export interface RemoveFromCartPayload {
  /** Product ID to remove from cart */
  productId: string;
}

/**
 * UpdateCartItemPayload interface for updating cart items
 */
export interface UpdateCartItemPayload {
  /** Product ID to update */
  productId: string;
  /** New quantity for the item */
  quantity: number;
}

/**
 * CartItemAction type for cart item operations
 */
export type CartItemAction = 'add' | 'remove' | 'update' | 'clear';
