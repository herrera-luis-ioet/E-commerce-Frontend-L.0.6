// Product interface for the product catalog
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// Product state interface for Redux
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

// Product filter options
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}

// Product sort options
export enum ProductSortOption {
  PRICE_LOW_TO_HIGH = 'price_asc',
  PRICE_HIGH_TO_LOW = 'price_desc',
  NAME_A_TO_Z = 'name_asc',
  NAME_Z_TO_A = 'name_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}