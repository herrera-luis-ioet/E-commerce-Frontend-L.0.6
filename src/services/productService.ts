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
    const params = {
      params: {
        ...filter,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.NEWEST,
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
    const params = {
      params: {
        ...filter,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.NEWEST,
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
    const params = {
      params: {
        featured: true,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.NEWEST,
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
    const params = {
      params: {
        onSale: true,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.PRICE_LOW_TO_HIGH,
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
    const params = {
      params: {
        ...filter,
        searchQuery: query,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.NEWEST,
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
    // Convert filter object to query parameters
    const filterParams: Record<string, string | number | boolean | undefined> = {};
    
    // Process each filter property
    if (filter.categoryId) filterParams.categoryId = filter.categoryId;
    if (filter.category) filterParams.category = filter.category;
    if (filter.minPrice !== undefined) filterParams.minPrice = filter.minPrice;
    if (filter.maxPrice !== undefined) filterParams.maxPrice = filter.maxPrice;
    if (filter.inStock !== undefined) filterParams.inStock = filter.inStock;
    if (filter.searchQuery) filterParams.searchQuery = filter.searchQuery;
    if (filter.brand) filterParams.brand = filter.brand;
    if (filter.rating !== undefined) filterParams.rating = filter.rating;
    if (filter.featured !== undefined) filterParams.featured = filter.featured;
    if (filter.onSale !== undefined) filterParams.onSale = filter.onSale;
    if (filter.tags && filter.tags.length > 0) filterParams.tags = filter.tags.join(',');

    const params = {
      params: {
        ...filterParams,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        sort: pagination?.sort || SortOption.NEWEST,
      },
    };

    return apiService.getPaginated<Product>(Endpoints.PRODUCTS, params);
  }
}

// Create and export a singleton instance of the ProductService
const productService = new ProductService();
export default productService;
