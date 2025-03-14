/**
 * Type definitions for orders
 */

/**
 * Order status enum
 */
export enum OrderStatus {
  /** Order has been created but not processed */
  PENDING = 'pending',
  /** Order has been processed and payment confirmed */
  PAID = 'paid',
  /** Order is being prepared for shipping */
  PROCESSING = 'processing',
  /** Order has been shipped */
  SHIPPED = 'shipped',
  /** Order has been delivered */
  DELIVERED = 'delivered',
  /** Order has been cancelled */
  CANCELLED = 'cancelled',
  /** Order has been returned */
  RETURNED = 'returned',
  /** Order has been refunded */
  REFUNDED = 'refunded'
}

/**
 * Order item interface representing a product in an order
 */
export interface OrderItem {
  /** Unique identifier for the order item */
  id: string;
  /** Product ID */
  product_id: string;
  /** Order ID this item belongs to */
  order_id: string;
  /** Product name at time of order */
  name: string;
  /** Product price at time of order */
  price: number;
  /** Quantity ordered */
  quantity: number;
  /** Subtotal for this item (price * quantity) */
  subtotal: number;
  /** Discount amount applied to this item */
  discount?: number;
  /** Final price after discounts */
  final_price: number;
}

/**
 * Order interface representing a customer order
 */
export interface Order {
  /** Unique identifier for the order */
  id: string;
  /** Customer ID who placed the order */
  customer_id: string;
  /** Order status */
  status: OrderStatus;
  /** Total amount of the order */
  total_amount: number;
  /** Items in the order */
  items: OrderItem[];
  /** Shipping address */
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Billing address */
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Shipping method */
  shipping_method?: string;
  /** Shipping cost */
  shipping_cost?: number;
  /** Tax amount */
  tax_amount?: number;
  /** Discount amount */
  discount_amount?: number;
  /** Payment method */
  payment_method?: string;
  /** Payment status */
  payment_status?: string;
  /** Order notes */
  notes?: string;
  /** Order creation date */
  created_at: string;
  /** Order last update date */
  updated_at: string;
}

/**
 * Order creation interface
 */
export interface OrderCreate {
  /** Customer ID who placed the order */
  customer_id: string;
  /** Items to be added to the order */
  items: {
    product_id: string;
    quantity: number;
  }[];
  /** Shipping address */
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Billing address */
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Shipping method */
  shipping_method?: string;
  /** Payment method */
  payment_method?: string;
  /** Order notes */
  notes?: string;
}

/**
 * Order update interface
 */
export interface OrderUpdate {
  /** Order status */
  status?: OrderStatus;
  /** Shipping address */
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Billing address */
  billing_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  /** Shipping method */
  shipping_method?: string;
  /** Payment method */
  payment_method?: string;
  /** Order notes */
  notes?: string;
}

/**
 * Order filter interface for filtering orders
 */
export interface OrderFilter {
  /** Filter by customer ID */
  customer_id?: string;
  /** Filter by order status */
  status?: OrderStatus;
  /** Filter by minimum total amount */
  min_total?: number;
  /** Filter by maximum total amount */
  max_total?: number;
  /** Filter by start date */
  start_date?: string;
  /** Filter by end date */
  end_date?: string;
}

/**
 * Order pagination parameters interface
 */
export interface OrderPaginationParams {
  /** Page number */
  page?: number;
  /** Number of items per page */
  limit?: number;
}