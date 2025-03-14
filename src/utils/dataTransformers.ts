/**
 * Utility functions to transform data between frontend and backend formats
 */
import { Product } from '../types/product.types';
import { Order, OrderItem, OrderStatus } from '../types/order.types';
import { PaginatedResponse } from '../types/api.types';

/**
 * Interface for backend product format
 */
interface BackendProduct {
  id: string | number;
  name: string;
  description: string | null;
  sku: string;
  image: string | null;
  price: number;
  stock_quantity: number;
  category: string | null;
  tags: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for backend order item format
 */
interface BackendOrderItem {
  id: string | number;
  order_id: string | number;
  product_id: string | number;
  quantity: number;
  product_name: string;
  product_sku: string;
  price_at_purchase: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for backend order format
 */
interface BackendOrder {
  id: string | number;
  status: string;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  payment_method: string | null;
  payment_id: string | null;
  notes: string | null;
  items: BackendOrderItem[];
  created_at: string;
  updated_at: string;
}

/**
 * Interface for backend pagination metadata
 */
interface BackendPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * Interface for backend paginated response
 */
interface BackendPaginatedResponse<T> {
  items: T[];
  meta: BackendPaginationMeta;
}

/**
 * Transform a backend product to frontend format
 * @param backendProduct - Product data from the backend API
 * @returns Product in frontend format
 */
export const transformProductFromBackend = (backendProduct: BackendProduct): Product => {
  // Parse tags from comma-separated string to array
  const tags = backendProduct.tags ? backendProduct.tags.split(',').map(tag => tag.trim()) : [];
  
  // Use the image as both mainImage and the first item in images array
  const mainImage = backendProduct.image || '';
  const images = backendProduct.image ? [backendProduct.image] : [];
  
  return {
    id: String(backendProduct.id),
    name: backendProduct.name,
    description: backendProduct.description || '',
    price: Number(backendProduct.price),
    images,
    mainImage,
    categoryId: '', // Backend doesn't provide categoryId directly
    category: backendProduct.category || '',
    rating: 0, // Backend doesn't provide rating directly
    ratingCount: 0, // Backend doesn't provide ratingCount directly
    stock: backendProduct.stock_quantity,
    sku: backendProduct.sku,
    brand: '', // Backend doesn't provide brand directly
    featured: false, // Backend doesn't provide featured directly
    onSale: false, // Backend doesn't provide onSale directly
    tags,
    createdAt: backendProduct.created_at,
    updatedAt: backendProduct.updated_at
  };
};

/**
 * Transform a frontend product to backend format
 * @param frontendProduct - Product data from the frontend
 * @returns Product in backend format
 */
export const transformProductToBackend = (frontendProduct: Partial<Product>): Partial<BackendProduct> => {
  // Join tags array into comma-separated string
  const tags = frontendProduct.tags ? frontendProduct.tags.join(',') : null;
  
  return {
    name: frontendProduct.name,
    description: frontendProduct.description || null,
    sku: frontendProduct.sku,
    image: frontendProduct.mainImage || null,
    price: frontendProduct.price,
    stock_quantity: frontendProduct.stock,
    category: frontendProduct.category || null,
    tags,
    is_active: true // Default to active
  };
};

/**
 * Transform a backend order item to frontend format
 * @param backendOrderItem - Order item data from the backend API
 * @returns OrderItem in frontend format
 */
export const transformOrderItemFromBackend = (backendOrderItem: BackendOrderItem): OrderItem => {
  return {
    id: String(backendOrderItem.id),
    product_id: String(backendOrderItem.product_id),
    order_id: String(backendOrderItem.order_id),
    name: backendOrderItem.product_name,
    price: Number(backendOrderItem.price_at_purchase),
    quantity: backendOrderItem.quantity,
    subtotal: Number(backendOrderItem.price_at_purchase) * backendOrderItem.quantity,
    final_price: Number(backendOrderItem.price_at_purchase) * backendOrderItem.quantity
  };
};

/**
 * Transform a backend order to frontend format
 * @param backendOrder - Order data from the backend API
 * @returns Order in frontend format
 */
export const transformOrderFromBackend = (backendOrder: BackendOrder): Order => {
  // Transform order items
  const items = backendOrder.items.map(transformOrderItemFromBackend);
  
  // Construct shipping address from separate fields
  const shippingAddress = backendOrder.shipping_address || backendOrder.shipping_city || backendOrder.shipping_country
    ? {
        street: backendOrder.shipping_address || '',
        city: backendOrder.shipping_city || '',
        state: '', // Backend doesn't provide state directly
        postal_code: backendOrder.shipping_postal_code || '',
        country: backendOrder.shipping_country || ''
      }
    : undefined;
  
  return {
    id: String(backendOrder.id),
    customer_id: '', // Backend doesn't provide customer_id directly, using email instead
    status: backendOrder.status as OrderStatus,
    total_amount: Number(backendOrder.total_amount),
    items,
    shipping_address: shippingAddress,
    payment_method: backendOrder.payment_method || undefined,
    notes: backendOrder.notes || undefined,
    created_at: backendOrder.created_at,
    updated_at: backendOrder.updated_at
  };
};

/**
 * Transform a frontend order to backend format for creation or update
 * @param frontendOrder - Order data from the frontend
 * @returns Order in backend format
 */
export const transformOrderToBackend = (frontendOrder: Partial<Order>): any => {
  // Extract shipping address fields
  const shippingAddress = frontendOrder.shipping_address
    ? {
        shipping_address: frontendOrder.shipping_address.street,
        shipping_city: frontendOrder.shipping_address.city,
        shipping_country: frontendOrder.shipping_address.country,
        shipping_postal_code: frontendOrder.shipping_address.postal_code
      }
    : {};
  
  // Transform order items if present
  const items = frontendOrder.items
    ? frontendOrder.items.map(item => ({
        product_id: Number(item.product_id),
        quantity: item.quantity
      }))
    : undefined;
  
  return {
    status: frontendOrder.status,
    customer_email: '', // Frontend needs to provide this
    customer_name: '', // Frontend needs to provide this
    ...shippingAddress,
    payment_method: frontendOrder.payment_method,
    payment_id: '', // Frontend needs to provide this if available
    notes: frontendOrder.notes,
    items
  };
};

/**
 * Transform a backend paginated response to frontend format
 * @param backendResponse - Paginated response from the backend API
 * @param transformFn - Function to transform each item in the response
 * @returns PaginatedResponse in frontend format
 */
export const transformPaginatedResponseFromBackend = <T, U>(
  backendResponse: BackendPaginatedResponse<T>,
  transformFn: (item: T) => U
): PaginatedResponse<U> => {
  // Transform each item using the provided transform function
  const transformedItems = backendResponse.items.map(transformFn);
  
  return {
    success: true,
    statusCode: 200,
    data: transformedItems,
    meta: {
      currentPage: backendResponse.meta.page,
      itemsPerPage: backendResponse.meta.per_page,
      total: backendResponse.meta.total,
      totalPages: backendResponse.meta.total_pages,
      hasNextPage: backendResponse.meta.page < backendResponse.meta.total_pages,
      hasPrevPage: backendResponse.meta.page > 1
    }
  };
};

/**
 * Transform a list of backend products to frontend format
 * @param backendProducts - Array of products from the backend API
 * @returns Array of products in frontend format
 */
export const transformProductsFromBackend = (backendProducts: BackendProduct[]): Product[] => {
  return backendProducts.map(transformProductFromBackend);
};

/**
 * Transform a list of backend orders to frontend format
 * @param backendOrders - Array of orders from the backend API
 * @returns Array of orders in frontend format
 */
export const transformOrdersFromBackend = (backendOrders: BackendOrder[]): Order[] => {
  return backendOrders.map(transformOrderFromBackend);
};

/**
 * Transform a paginated product response from backend to frontend format
 * @param backendResponse - Paginated product response from the backend API
 * @returns PaginatedResponse of products in frontend format
 */
export const transformPaginatedProductsFromBackend = (
  backendResponse: BackendPaginatedResponse<BackendProduct>
): PaginatedResponse<Product> => {
  return transformPaginatedResponseFromBackend(backendResponse, transformProductFromBackend);
};

/**
 * Transform a paginated order response from backend to frontend format
 * @param backendResponse - Paginated order response from the backend API
 * @returns PaginatedResponse of orders in frontend format
 */
export const transformPaginatedOrdersFromBackend = (
  backendResponse: BackendPaginatedResponse<BackendOrder>
): PaginatedResponse<Order> => {
  return transformPaginatedResponseFromBackend(backendResponse, transformOrderFromBackend);
};