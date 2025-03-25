/**
 * Cart service for handling cart data persistence using localStorage
 */
import { CartItem } from '../types/cart.types';

// Key used for storing cart data in localStorage
const CART_STORAGE_KEY = 'ecommerce_cart';

/**
 * CartService class for handling cart data persistence
 */
class CartService {
  /**
   * PUBLIC_INTERFACE
   * Save cart items to localStorage
   * @param items - Array of cart items to save
   * @returns boolean indicating success or failure
   */
  public saveCart(items: CartItem[]): boolean {
    try {
      // Serialize cart items to JSON string
      const serializedCart = JSON.stringify(items);
      
      // Store in localStorage
      localStorage.setItem(CART_STORAGE_KEY, serializedCart);
      
      return true;
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      return false;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Load cart items from localStorage
   * @returns Array of cart items or empty array if none found
   */
  public loadCart(): CartItem[] {
    try {
      // Get serialized cart data from localStorage
      const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
      
      // If no data found, return empty array
      if (!serializedCart) {
        return [];
      }
      
      // Parse JSON string back to array of cart items
      const cartItems: CartItem[] = JSON.parse(serializedCart);
      
      // Validate that the parsed data is an array
      if (!Array.isArray(cartItems)) {
        console.warn('Invalid cart data format in localStorage');
        return [];
      }
      
      return cartItems;
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Clear cart data from localStorage
   * @returns boolean indicating success or failure
   */
  public clearCart(): boolean {
    try {
      // Remove cart data from localStorage
      localStorage.removeItem(CART_STORAGE_KEY);
      
      return true;
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
      return false;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Check if cart data exists in localStorage
   * @returns boolean indicating if cart data exists
   */
  public hasCartData(): boolean {
    try {
      return localStorage.getItem(CART_STORAGE_KEY) !== null;
    } catch (error) {
      console.error('Failed to check cart data in localStorage:', error);
      return false;
    }
  }
}

// Create and export a singleton instance of the CartService
const cartService = new CartService();
export default cartService;