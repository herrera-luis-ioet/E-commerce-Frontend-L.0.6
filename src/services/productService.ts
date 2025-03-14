/**
 * Product service for handling product-related API requests
 */
import apiService from './api';
import { Endpoints } from '../types/api.types';
import { 
  Product, 
  Category, 
  ProductFilter, 
  SortOption 
} from '../types/product.types';

/**
 * Interface for product pagination parameters
 */
interface ProductPaginationParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
}

/**
 * Convert frontend pagination parameters to backend format
 * @param pagination - Frontend pagination parameters
 * @returns Backend pagination parameters
 */
const convertPaginationParams = (pagination?: ProductPaginationParams) => {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  // Backend uses skip/limit instead of page/limit
  const skip = (page - 1) * limit;
  
  return {
    skip,
    limit
  };
};

/**
 * ProductService class for handling product-related API requests
 */
class ProductService {
  /**
   * PUBLIC_INTERFACE
   * Fetch products with optional filtering, sorting, and pagination
   * @param filter - Product filter options
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of products with pagination metadata
   */
  public async getProducts(
    filter?: ProductFilter,
    pagination?: ProductPaginationParams
  ) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        ...filter,
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch a single product by ID
   * @param id - Product ID
   * @returns Promise resolving to a product
   */
  public async getProductById(id: string) {
    return apiService.get<Product>(`${Endpoints.PRODUCT_BY_ID}${id}`);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch a single product by SKU
   * @param sku - Product SKU
   * @returns Promise resolving to a product
   */
  public async getProductBySku(sku: string) {
    return apiService.get<Product>(`${Endpoints.PRODUCT_BY_SKU}${sku}`);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch active products with optional pagination
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of active products with pagination metadata
   */
  public async getActiveProducts(pagination?: ProductPaginationParams) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Product>(Endpoints.ACTIVE_PRODUCTS, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch all categories
   * @returns Promise resolving to an array of categories
   * @deprecated The backend API doesn't have a dedicated categories endpoint
   */
  public async getCategories() {
    // This is a placeholder since the backend API doesn't have a dedicated categories endpoint
    // In a real implementation, we would need to extract unique categories from products
    console.warn('Categories endpoint is not implemented in the backend API');
    
    // Return an empty response with the expected structure
    return {
      success: true,
      statusCode: 200,
      data: [],
      message: 'Categories are not available as a dedicated endpoint'
    };
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch a single category by ID
   * @param id - Category ID
   * @returns Promise resolving to a category
   * @deprecated The backend API doesn't have a dedicated categories endpoint
   */
  public async getCategoryById(id: string) {
    // This is a placeholder since the backend API doesn't have a dedicated categories endpoint
    console.warn('Category by ID endpoint is not implemented in the backend API');
    
    // Return an empty response with the expected structure
    return {
      success: true,
      statusCode: 200,
      data: null,
      message: 'Category by ID is not available as a dedicated endpoint'
    };
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch products by category with optional filtering, sorting, and pagination
   * @param category - Category name
   * @param filter - Additional product filter options
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of products with pagination metadata
   */
  public async getProductsByCategory(
    category: string,
    filter?: Omit<ProductFilter, 'category'>,
    pagination?: ProductPaginationParams
  ) {
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        ...filter,
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Product>(`${Endpoints.PRODUCTS_BY_CATEGORY}${category}`, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch featured products with optional pagination
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of featured products with pagination metadata
   */
  public async getFeaturedProducts(pagination?: ProductPaginationParams) {
    // Since the backend doesn't have a dedicated featured products endpoint,
    // we'll use the filter parameter with the main products endpoint
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        is_active: true, // Only get active products
        skip: paginationParams.skip,
        limit: paginationParams.limit,
        // Note: Backend doesn't support 'featured' filter directly
        // This is a placeholder that would need backend support
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch products on sale with optional pagination
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of products on sale with pagination metadata
   */
  public async getProductsOnSale(pagination?: ProductPaginationParams) {
    // Since the backend doesn't have a dedicated on-sale products endpoint,
    // we'll use the filter parameter with the main products endpoint
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        is_active: true, // Only get active products
        skip: paginationParams.skip,
        limit: paginationParams.limit,
        // Note: Backend doesn't support 'onSale' filter directly
        // This is a placeholder that would need backend support
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Search products by query with optional filtering, sorting, and pagination
   * @param query - Search query
   * @param filter - Additional product filter options
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of products with pagination metadata
   */
  public async searchProducts(
    query: string,
    filter?: Omit<ProductFilter, 'searchQuery'>,
    pagination?: ProductPaginationParams
  ) {
    // Since the backend doesn't have a dedicated search endpoint,
    // we'll use the filter parameter with the main products endpoint
    const paginationParams = convertPaginationParams(pagination);
    
    const params = {
      params: {
        ...filter,
        // Note: Backend doesn't support 'searchQuery' filter directly
        // This is a placeholder that would need backend support
        skip: paginationParams.skip,
        limit: paginationParams.limit,
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch product reviews by product ID
   * @param productId - Product ID
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of reviews with pagination metadata
   * @deprecated The backend API doesn't currently support product reviews
   */
  public async getProductReviews(productId: string, pagination?: ProductPaginationParams) {
    // This is a placeholder since the backend API doesn't currently support product reviews
    // In a real implementation, this would call an appropriate endpoint
    console.warn('Product reviews endpoint is not implemented in the backend API');
    
    // Return an empty response with the expected structure
    return {
      success: true,
      statusCode: 200,
      data: [],
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      message: 'Product reviews are not available'
    };
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch products with advanced filtering options
   * @param filter - Product filter options
   * @param pagination - Pagination parameters
   * @returns Promise resolving to an array of products with pagination metadata
   */
  public async filterProducts(
    filter: ProductFilter,
    pagination?: ProductPaginationParams
  ) {
    const paginationParams = convertPaginationParams(pagination);
    
    // Convert filter object to query parameters
    const filterParams: Record<string, string | number | boolean | undefined> = {};
    
    // Process each filter property and map to backend parameters
    if (filter.category) filterParams.category = filter.category;
    // Note: Backend doesn't directly support these filters
    // These are placeholders that would need backend support
    if (filter.minPrice !== undefined) filterParams.minPrice = filter.minPrice;
    if (filter.maxPrice !== undefined) filterParams.maxPrice = filter.maxPrice;
    if (filter.inStock !== undefined) filterParams.stock_quantity = filter.inStock ? 1 : 0;
    if (filter.searchQuery) filterParams.search = filter.searchQuery;
    if (filter.tags && filter.tags.length > 0) filterParams.tags = filter.tags.join(',');

    const params = {
      params: {
        ...filterParams,
        skip: paginationParams.skip,
        limit: paginationParams.limit,
        is_active: true, // Only get active products by default
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }
}

// Create and export a singleton instance of the ProductService
const productService = new ProductService();
export default productService;
