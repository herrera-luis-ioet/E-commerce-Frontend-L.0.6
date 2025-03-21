/**
 * Type definitions for API interactions
 */

/**
 * Generic API response interface
 * @template T - The type of data returned by the API
 */
export interface ApiResponse<T = any> {
  /** Success status of the API call */
  success: boolean;
  /** Response data */
  data: T;
  /** Response message (usually for errors or success confirmations) */
  message?: string;
  /** Response status code */
  statusCode: number;
}

/**
 * Paginated API response interface
 * @template T - The type of data items returned by the API
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  /** Pagination metadata */
  meta: {
    /** Current page number */
    currentPage: number;
    /** Number of items per page */
    itemsPerPage: number;
    /** Total number of items across all pages */
    total: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there is a next page */
    hasNextPage: boolean;
    /** Whether there is a previous page */
    hasPrevPage: boolean;
  };
}

/**
 * Request parameters interface for API calls
 */
export interface RequestParams {
  /** Query parameters as key-value pairs */
  params?: Record<string, string | number | boolean | undefined | string[]>;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document';
}

/**
 * API error interface
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** HTTP status code */
  statusCode: number;
  /** Detailed error information */
  details?: Record<string, any>;
  /** Field-specific validation errors */
  fieldErrors?: Record<string, string[]>;
  /** Request that caused the error */
  request?: {
    /** Request URL */
    url: string;
    /** Request method */
    method: string;
    /** Request data */
    data?: any;
    /** Request headers */
    headers?: Record<string, string>;
  };
}

/**
 * API endpoints
 */
export enum Endpoints {
  /** Base API URL */
  BASE = '/api/v1',
  /** Products endpoint */
  PRODUCTS = '/api/v1/products',
  /** Categories endpoint */
  CATEGORIES = '/api/v1/categories',
  /** Product by ID endpoint (append product ID) */
  PRODUCT_BY_ID = '/api/v1/products/',
  /** Category by ID endpoint (append category ID) */
  CATEGORY_BY_ID = '/api/v1/categories/',
  /** Featured products endpoint */
  FEATURED_PRODUCTS = '/api/v1/products/featured',
  /** Products on sale endpoint */
  SALE_PRODUCTS = '/api/v1/products/sale',
  /** Search products endpoint */
  SEARCH_PRODUCTS = '/api/v1/products/search',
  /** Product reviews endpoint (append product ID) */
  PRODUCT_REVIEWS = '/api/v1/products/reviews/',
}

/**
 * HTTP methods
 */
export enum HttpMethod {
  /** GET method for retrieving data */
  GET = 'GET',
  /** POST method for creating data */
  POST = 'POST',
  /** PUT method for updating data */
  PUT = 'PUT',
  /** PATCH method for partially updating data */
  PATCH = 'PATCH',
  /** DELETE method for deleting data */
  DELETE = 'DELETE'
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  /** Request URL */
  url: string;
  /** HTTP method */
  method: HttpMethod;
  /** Request data */
  data?: any;
  /** Request parameters */
  params?: Record<string, string | number | boolean | undefined | string[]>;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
}

/**
 * API response status codes
 */
export enum ApiStatusCode {
  /** OK (200) */
  OK = 200,
  /** Created (201) */
  CREATED = 201,
  /** Accepted (202) */
  ACCEPTED = 202,
  /** No Content (204) */
  NO_CONTENT = 204,
  /** Bad Request (400) */
  BAD_REQUEST = 400,
  /** Unauthorized (401) */
  UNAUTHORIZED = 401,
  /** Forbidden (403) */
  FORBIDDEN = 403,
  /** Not Found (404) */
  NOT_FOUND = 404,
  /** Method Not Allowed (405) */
  METHOD_NOT_ALLOWED = 405,
  /** Conflict (409) */
  CONFLICT = 409,
  /** Internal Server Error (500) */
  INTERNAL_SERVER_ERROR = 500,
  /** Service Unavailable (503) */
  SERVICE_UNAVAILABLE = 503
}
