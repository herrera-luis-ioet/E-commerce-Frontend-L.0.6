/**
 * Base API service using Axios for making HTTP requests
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  ApiError,
  ApiRequestConfig,
  ApiResponse,
  HttpMethod,
  PaginatedResponse,
  RequestParams,
  ApiStatusCode,
} from '../types/api.types';

/**
 * Default API configuration
 */
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://8000_172_31_37_95.workspace.develop.kavia.ai',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * API Service class for handling HTTP requests
 */
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors for the Axios instance
   * @private
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get auth token from localStorage if it exists
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Transform API response to standardized format
   * @param response - Axios response object
   * @returns Standardized API response
   * @private
   */
  private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
    // If the API already returns data in our expected format, just return it
    if (response.data && 'success' in response.data && 'data' in response.data) {
      return response.data as ApiResponse<T>;
    }

    // Otherwise, transform the response to our format
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      statusCode: response.status,
      message: response.statusText,
    };
  }

  /**
   * Handle API errors and transform them to a standardized format
   * @param error - Error object from Axios
   * @returns Standardized API error
   * @private
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const response = axiosError.response;
      
      // If the API already returns errors in our expected format, just return it
      if (response?.data && typeof response.data === 'object' && 'message' in response.data) {
        return response.data as ApiError;
      }

      // Otherwise, transform the error to our format
      return {
        message: axiosError.message || 'An error occurred during the request',
        statusCode: response?.status || ApiStatusCode.INTERNAL_SERVER_ERROR,
        code: axiosError.code,
        request: {
          url: axiosError.config?.url || '',
          method: axiosError.config?.method?.toUpperCase() || 'UNKNOWN',
          data: axiosError.config?.data,
          headers: axiosError.config?.headers as Record<string, string> | undefined,
        },
      };
    }

    // For non-Axios errors
    return {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: ApiStatusCode.INTERNAL_SERVER_ERROR,
    };
  }

  /**
   * Make an HTTP request to the API
   * @param config - API request configuration
   * @returns Promise resolving to the API response
   * @private
   */
  private async request<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
        headers: config.headers,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
      };

      const response = await this.axiosInstance.request<T>(axiosConfig);
      return this.transformResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Make a GET request to the API
   * @param url - API endpoint URL
   * @param params - Request parameters
   * @returns Promise resolving to the API response
   */
  public async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.GET,
      params: params?.params,
      headers: params?.headers,
      timeout: params?.timeout,
      withCredentials: params?.withCredentials,
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Make a POST request to the API
   * @param url - API endpoint URL
   * @param data - Request data
   * @param params - Request parameters
   * @returns Promise resolving to the API response
   */
  public async post<T>(url: string, data?: any, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.POST,
      data,
      params: params?.params,
      headers: params?.headers,
      timeout: params?.timeout,
      withCredentials: params?.withCredentials,
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Make a PUT request to the API
   * @param url - API endpoint URL
   * @param data - Request data
   * @param params - Request parameters
   * @returns Promise resolving to the API response
   */
  public async put<T>(url: string, data?: any, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.PUT,
      data,
      params: params?.params,
      headers: params?.headers,
      timeout: params?.timeout,
      withCredentials: params?.withCredentials,
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Make a PATCH request to the API
   * @param url - API endpoint URL
   * @param data - Request data
   * @param params - Request parameters
   * @returns Promise resolving to the API response
   */
  public async patch<T>(url: string, data?: any, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.PATCH,
      data,
      params: params?.params,
      headers: params?.headers,
      timeout: params?.timeout,
      withCredentials: params?.withCredentials,
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Make a DELETE request to the API
   * @param url - API endpoint URL
   * @param params - Request parameters
   * @returns Promise resolving to the API response
   */
  public async delete<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: HttpMethod.DELETE,
      params: params?.params,
      headers: params?.headers,
      timeout: params?.timeout,
      withCredentials: params?.withCredentials,
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Make a GET request for paginated data
   * @param url - API endpoint URL
   * @param params - Request parameters
   * @returns Promise resolving to the paginated API response
   */
  public async getPaginated<T>(url: string, params?: RequestParams): Promise<PaginatedResponse<T>> {
    const response = await this.get<T[]>(url, params);
    
    // Create a properly typed PaginatedResponse object by extending the ApiResponse
    const paginatedResponse: PaginatedResponse<T> = {
      ...response,
      meta: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
    
    // Check if we need to populate the meta property with default values
    // based on the array length and provided pagination parameters
    const dataArray = Array.isArray(response.data) ? response.data : [];
    const currentPage = params?.params?.page ? Number(params.params.page) : 1;
    const itemsPerPage = params?.params?.limit ? Number(params.params.limit) : dataArray.length;
    
    // Update the meta property with calculated values
    paginatedResponse.meta = {
      total: dataArray.length,
      totalPages: dataArray.length > 0 ? Math.ceil(dataArray.length / itemsPerPage) : 0,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
      hasNextPage: currentPage * itemsPerPage < dataArray.length,
      hasPrevPage: currentPage > 1
    };
    
    return paginatedResponse;
  }
}

// Create and export a singleton instance of the API service
const apiService = new ApiService();
export default apiService;
