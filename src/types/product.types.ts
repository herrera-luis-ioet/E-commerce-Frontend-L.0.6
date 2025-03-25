/**
 * Type definitions for the Product Catalog Manager
 */

/**
 * Product interface representing a product in the catalog
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Name of the product */
  name: string;
  /** Detailed description of the product */
  description: string;
  /** Price of the product in the default currency */
  price: number;
  /** 
   * Discounted price of the product (if on sale)
   * This is calculated based on the price and discountPercentage when onSale is true
   */
  discountPrice?: number | null;
  /** Array of image URLs for the product */
  images: string[];
  /** Main product image URL */
  mainImage: string;
  /** Category identifier the product belongs to */
  categoryId: string;
  /** Category name the product belongs to */
  category: string;
  /** Product rating from 0 to 5 */
  rating: number;
  /** Number of ratings submitted */
  ratingCount: number;
  /** Number of items in stock */
  stock: number;
  /** Stock Keeping Unit - unique identifier for inventory management */
  sku: string;
  /** Product brand name */
  brand: string;
  /** Whether the product is featured */
  featured: boolean;
  /** Whether the product is on sale */
  onSale: boolean;
  /** Discount percentage if the product is on sale */
  discountPercentage?: number;
  /** Array of product tags */
  tags: string[];
  /** Product dimensions (if applicable) */
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  /** Product weight (if applicable) */
  weight?: {
    value: number;
    unit: string;
  };
  /** Product creation date */
  createdAt: string;
  /** Product last update date */
  updatedAt: string;
}

/**
 * Category interface representing a product category
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Name of the category */
  name: string;
  /** Description of the category */
  description: string;
  /** Image URL for the category */
  imageUrl?: string;
  /** Parent category ID (if this is a subcategory) */
  parentId?: string;
  /** Number of products in this category */
  productCount?: number;
  /** Whether the category is featured */
  featured?: boolean;
  /** Category creation date */
  createdAt: string;
  /** Category last update date */
  updatedAt: string;
}

/**
 * ProductFilter interface for filtering products
 */
export interface ProductFilter {
  /** Filter by category ID */
  categoryId?: string;
  /** Filter by category name */
  category?: string;
  /** Filter by minimum price */
  minPrice?: number;
  /** Filter by maximum price */
  maxPrice?: number;
  /** Filter by whether the product is in stock */
  inStock?: boolean;
  /** Filter by search query (matches name, description, etc.) */
  searchQuery?: string;
  /** Filter by brand name */
  brand?: string;
  /** Filter by rating (minimum rating) */
  rating?: number;
  /** Filter by featured products */
  featured?: boolean;
  /** Filter by products on sale */
  onSale?: boolean;
  /** Filter by product tags */
  tags?: string[];
}

/**
 * SortOption type for sorting products
 */
export enum SortOption {
  /** Sort by price from low to high */
  PRICE_LOW_TO_HIGH = 'price_asc',
  /** Sort by price from high to low */
  PRICE_HIGH_TO_LOW = 'price_desc',
  /** Sort by name from A to Z */
  NAME_A_TO_Z = 'name_asc',
  /** Sort by name from Z to A */
  NAME_Z_TO_A = 'name_desc',
  /** Sort by newest first (based on creation date) */
  NEWEST = 'newest',
  /** Sort by oldest first (based on creation date) */
  OLDEST = 'oldest',
  /** Sort by highest rated first */
  HIGHEST_RATED = 'rating_desc',
  /** Sort by most popular (based on number of ratings) */
  MOST_POPULAR = 'popularity_desc',
  /** Sort by best selling */
  BEST_SELLING = 'best_selling'
}

/**
 * ProductView type for displaying products
 */
export type ProductView = 'grid' | 'list';

/**
 * ProductState interface for Redux state
 */
export interface ProductState {
  /** Array of products */
  products: Product[];
  /** Currently selected product */
  selectedProduct: Product | null;
  /** Array of categories */
  categories: Category[];
  /** Currently selected category */
  selectedCategory: Category | null;
  /** Current filter settings */
  filters: ProductFilter;
  /** Current sort option */
  sortOption: SortOption;
  /** Current view mode (grid/list) */
  viewMode: ProductView;
  /** Current page for pagination */
  currentPage: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Total number of products matching the current filters */
  totalProducts: number;
  /** Total number of pages based on itemsPerPage and totalProducts */
  totalPages: number;
  /** Whether data is currently being loaded */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the product list has been initialized */
  initialized: boolean;
}

/**
 * ProductAction types for Redux actions
 */
export enum ProductActionTypes {
  FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE',
  SELECT_PRODUCT = 'SELECT_PRODUCT',
  FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST',
  FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE',
  SELECT_CATEGORY = 'SELECT_CATEGORY',
  SET_FILTERS = 'SET_FILTERS',
  SET_SORT_OPTION = 'SET_SORT_OPTION',
  SET_VIEW_MODE = 'SET_VIEW_MODE',
  SET_PAGE = 'SET_PAGE',
  SET_ITEMS_PER_PAGE = 'SET_ITEMS_PER_PAGE'
}
