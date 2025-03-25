/**
 * Mock data for testing cart functionality
 */
import { Product, Category, SortOption } from '../types/product.types';

/**
 * Mock products data
 */
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
    price: 199.99,
    discountPrice: 159.99,
    images: [
      'https://example.com/headphones-1.jpg',
      'https://example.com/headphones-2.jpg'
    ],
    mainImage: 'https://example.com/headphones-1.jpg',
    categoryId: 'c1',
    category: 'Electronics',
    rating: 4.5,
    ratingCount: 128,
    stock: 50,
    sku: 'WBH-001',
    brand: 'AudioTech',
    featured: true,
    onSale: true,
    discountPercentage: 20,
    tags: ['wireless', 'bluetooth', 'audio'],
    dimensions: {
      width: 18,
      height: 20,
      depth: 8,
      unit: 'cm'
    },
    weight: {
      value: 280,
      unit: 'g'
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T15:30:00Z'
  },
  {
    id: 'p2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    price: 299.99,
    discountPrice: null,
    images: [
      'https://example.com/watch-1.jpg',
      'https://example.com/watch-2.jpg'
    ],
    mainImage: 'https://example.com/watch-1.jpg',
    categoryId: 'c2',
    category: 'Wearables',
    rating: 4.8,
    ratingCount: 256,
    stock: 75,
    sku: 'SFW-002',
    brand: 'FitTech',
    featured: true,
    onSale: false,
    tags: ['smartwatch', 'fitness', 'health'],
    dimensions: {
      width: 4.5,
      height: 4.5,
      depth: 1.2,
      unit: 'cm'
    },
    weight: {
      value: 45,
      unit: 'g'
    },
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-06-15T14:20:00Z'
  }
];

/**
 * Mock categories data
 */
export const mockCategories: Category[] = [
  {
    id: 'c1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    imageUrl: 'https://example.com/electronics.jpg',
    productCount: 150,
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z'
  },
  {
    id: 'c2',
    name: 'Wearables',
    description: 'Smart wearable devices',
    imageUrl: 'https://example.com/wearables.jpg',
    productCount: 75,
    featured: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z'
  }
];

/**
 * Helper function to filter products based on criteria
 */
export const filterProducts = (products: Product[], params: any) => {
  let filtered = [...products];
  
  if (params?.categoryId) {
    filtered = filtered.filter(p => p.categoryId === params.categoryId);
  }
  
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= params.minPrice);
  }
  
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= params.maxPrice);
  }
  
  if (params?.searchQuery) {
    const query = params.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }
  
  // Sort products
  if (params?.sort) {
    switch (params.sort) {
      case SortOption.PRICE_LOW_TO_HIGH:
        filtered.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_HIGH_TO_LOW:
        filtered.sort((a, b) => b.price - a.price);
        break;
      case SortOption.NAME_A_TO_Z:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortOption.NAME_Z_TO_A:
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortOption.HIGHEST_RATED:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
  
  return filtered;
};

/**
 * Helper function to paginate results
 */
export const paginateResults = <T>(items: T[], page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    meta: {
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: endIndex < items.length,
      hasPrevPage: page > 1
    }
  };
};