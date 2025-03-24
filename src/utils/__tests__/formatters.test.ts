import { formatPrice, formatPercentage, sortProducts, filterProductsByPrice, applyClientSideFilters } from '../formatters';
import { Product, SortOption, ProductFilter } from '../../types/product.types';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats a number with default options', () => {
      expect(formatPrice(123.45)).toBe('$123.45');
    });

    it('formats a number with custom currency symbol', () => {
      expect(formatPrice(123.45, { currencySymbol: '€' })).toBe('€123.45');
    });

    it('formats a number with custom decimal places', () => {
      expect(formatPrice(123.456, { decimalPlaces: 3 })).toBe('$123.456');
      expect(formatPrice(123.45, { decimalPlaces: 0 })).toBe('$123');
    });

    it('formats a number without currency symbol', () => {
      expect(formatPrice(123.45, { showCurrencySymbol: false })).toBe('123.45');
    });

    it('formats a number with grouping separators', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
      expect(formatPrice(1234567.89, { useGrouping: false })).toBe('$1234567.89');
    });

    it('handles string input that can be converted to a number', () => {
      expect(formatPrice('123.45')).toBe('$123.45');
    });

    it('handles undefined input', () => {
      expect(formatPrice(undefined)).toBe('$0.00');
      expect(formatPrice(undefined, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles null input', () => {
      expect(formatPrice(null)).toBe('$0.00');
      expect(formatPrice(null, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles NaN input', () => {
      expect(formatPrice(NaN)).toBe('$0.00');
      expect(formatPrice(NaN, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles non-numeric string input', () => {
      expect(formatPrice('abc')).toBe('$0.00');
      expect(formatPrice('abc', { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles object input', () => {
      expect(formatPrice({})).toBe('$0.00');
      expect(formatPrice({}, { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles array input', () => {
      expect(formatPrice([])).toBe('$0.00');
      expect(formatPrice([1, 2, 3], { fallbackValue: 'N/A' })).toBe('N/A');
    });

    it('handles boolean input', () => {
      expect(formatPrice(true)).toBe('$1.00');
      expect(formatPrice(false)).toBe('$0.00');
    });

    it('handles custom fallback value', () => {
      expect(formatPrice(null, { fallbackValue: 'Price not available' })).toBe('Price not available');
    });
  });

  describe('formatPercentage', () => {
    it('formats a decimal as percentage', () => {
      expect(formatPercentage(0.42)).toBe('42%');
    });

    it('formats a number as percentage', () => {
      expect(formatPercentage(42)).toBe('42%');
    });

    it('formats with decimal places', () => {
      expect(formatPercentage(0.4267, 2)).toBe('42.67%');
    });

    it('handles undefined input', () => {
      expect(formatPercentage(undefined)).toBe('0%');
    });

    it('handles null input', () => {
      expect(formatPercentage(null)).toBe('0%');
    });

    it('handles NaN input', () => {
      expect(formatPercentage(NaN)).toBe('0%');
    });

    it('handles non-numeric string input', () => {
      expect(formatPercentage('abc')).toBe('0%');
    });
  });

  describe('sortProducts', () => {
    // Mock product data for testing
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Apple iPhone',
        description: 'Latest iPhone model',
        price: 999.99,
        images: ['image1.jpg'],
        mainImage: 'image1.jpg',
        categoryId: 'electronics',
        category: 'Electronics',
        rating: 4.5,
        ratingCount: 120,
        stock: 50,
        sku: 'IP-12-64',
        brand: 'Apple',
        featured: true,
        onSale: false,
        tags: ['smartphone', 'apple'],
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2023-02-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'Samsung Galaxy',
        description: 'Latest Galaxy model',
        price: 899.99,
        images: ['image2.jpg'],
        mainImage: 'image2.jpg',
        categoryId: 'electronics',
        category: 'Electronics',
        rating: 4.3,
        ratingCount: 95,
        stock: 30,
        sku: 'SG-21-128',
        brand: 'Samsung',
        featured: false,
        onSale: true,
        discountPercentage: 10,
        tags: ['smartphone', 'samsung'],
        createdAt: '2023-02-10T09:15:00Z',
        updatedAt: '2023-03-05T11:45:00Z'
      },
      {
        id: '3',
        name: 'Dell XPS Laptop',
        description: 'High-performance laptop',
        price: 1299.99,
        images: ['image3.jpg'],
        mainImage: 'image3.jpg',
        categoryId: 'computers',
        category: 'Computers',
        rating: 4.8,
        ratingCount: 65,
        stock: 15,
        sku: 'DL-XPS-15',
        brand: 'Dell',
        featured: true,
        onSale: false,
        tags: ['laptop', 'dell'],
        createdAt: '2022-11-20T14:30:00Z',
        updatedAt: '2023-01-05T16:20:00Z'
      },
      {
        id: '4',
        name: 'Bose Headphones',
        description: 'Noise cancelling headphones',
        price: 349.99,
        images: ['image4.jpg'],
        mainImage: 'image4.jpg',
        categoryId: 'audio',
        category: 'Audio',
        rating: 4.7,
        ratingCount: 200,
        stock: 25,
        sku: 'BS-NC-700',
        brand: 'Bose',
        featured: false,
        onSale: true,
        discountPercentage: 15,
        tags: ['headphones', 'audio'],
        createdAt: '2023-03-05T08:45:00Z',
        updatedAt: '2023-03-25T10:10:00Z'
      }
    ];

    it('sorts products by price from low to high', () => {
      const sorted = sortProducts(mockProducts, SortOption.PRICE_LOW_TO_HIGH);
      expect(sorted[0].name).toBe('Bose Headphones');
      expect(sorted[1].name).toBe('Samsung Galaxy');
      expect(sorted[2].name).toBe('Apple iPhone');
      expect(sorted[3].name).toBe('Dell XPS Laptop');
      
      // Verify prices are in ascending order
      expect(sorted.map(p => p.price)).toEqual([349.99, 899.99, 999.99, 1299.99]);
    });

    it('sorts products by price from high to low', () => {
      const sorted = sortProducts(mockProducts, SortOption.PRICE_HIGH_TO_LOW);
      expect(sorted[0].name).toBe('Dell XPS Laptop');
      expect(sorted[1].name).toBe('Apple iPhone');
      expect(sorted[2].name).toBe('Samsung Galaxy');
      expect(sorted[3].name).toBe('Bose Headphones');
      
      // Verify prices are in descending order
      expect(sorted.map(p => p.price)).toEqual([1299.99, 999.99, 899.99, 349.99]);
    });

    it('sorts products by name from A to Z', () => {
      const sorted = sortProducts(mockProducts, SortOption.NAME_A_TO_Z);
      expect(sorted[0].name).toBe('Apple iPhone');
      expect(sorted[1].name).toBe('Bose Headphones');
      expect(sorted[2].name).toBe('Dell XPS Laptop');
      expect(sorted[3].name).toBe('Samsung Galaxy');
      
      // Verify names are in alphabetical order
      expect(sorted.map(p => p.name)).toEqual([
        'Apple iPhone',
        'Bose Headphones',
        'Dell XPS Laptop',
        'Samsung Galaxy'
      ]);
    });

    it('sorts products by name from Z to A', () => {
      const sorted = sortProducts(mockProducts, SortOption.NAME_Z_TO_A);
      expect(sorted[0].name).toBe('Samsung Galaxy');
      expect(sorted[1].name).toBe('Dell XPS Laptop');
      expect(sorted[2].name).toBe('Bose Headphones');
      expect(sorted[3].name).toBe('Apple iPhone');
      
      // Verify names are in reverse alphabetical order
      expect(sorted.map(p => p.name)).toEqual([
        'Samsung Galaxy',
        'Dell XPS Laptop',
        'Bose Headphones',
        'Apple iPhone'
      ]);
    });

    it('sorts products by newest first', () => {
      const sorted = sortProducts(mockProducts, SortOption.NEWEST);
      expect(sorted[0].name).toBe('Bose Headphones');
      expect(sorted[1].name).toBe('Samsung Galaxy');
      expect(sorted[2].name).toBe('Apple iPhone');
      expect(sorted[3].name).toBe('Dell XPS Laptop');
      
      // Verify dates are in descending order (newest first)
      expect(sorted.map(p => p.createdAt)).toEqual([
        '2023-03-05T08:45:00Z',
        '2023-02-10T09:15:00Z',
        '2023-01-15T10:00:00Z',
        '2022-11-20T14:30:00Z'
      ]);
    });

    it('sorts products by oldest first', () => {
      const sorted = sortProducts(mockProducts, SortOption.OLDEST);
      expect(sorted[0].name).toBe('Dell XPS Laptop');
      expect(sorted[1].name).toBe('Apple iPhone');
      expect(sorted[2].name).toBe('Samsung Galaxy');
      expect(sorted[3].name).toBe('Bose Headphones');
      
      // Verify dates are in ascending order (oldest first)
      expect(sorted.map(p => p.createdAt)).toEqual([
        '2022-11-20T14:30:00Z',
        '2023-01-15T10:00:00Z',
        '2023-02-10T09:15:00Z',
        '2023-03-05T08:45:00Z'
      ]);
    });

    it('sorts products by highest rated first', () => {
      const sorted = sortProducts(mockProducts, SortOption.HIGHEST_RATED);
      expect(sorted[0].name).toBe('Dell XPS Laptop');
      expect(sorted[1].name).toBe('Bose Headphones');
      expect(sorted[2].name).toBe('Apple iPhone');
      expect(sorted[3].name).toBe('Samsung Galaxy');
      
      // Verify ratings are in descending order
      expect(sorted.map(p => p.rating)).toEqual([4.8, 4.7, 4.5, 4.3]);
    });

    it('sorts products by most popular (highest rating count)', () => {
      const sorted = sortProducts(mockProducts, SortOption.MOST_POPULAR);
      expect(sorted[0].name).toBe('Bose Headphones');
      expect(sorted[1].name).toBe('Apple iPhone');
      expect(sorted[2].name).toBe('Samsung Galaxy');
      expect(sorted[3].name).toBe('Dell XPS Laptop');
      
      // Verify rating counts are in descending order
      expect(sorted.map(p => p.ratingCount)).toEqual([200, 120, 95, 65]);
    });

    it('sorts products by best selling (combination of rating and popularity)', () => {
      const sorted = sortProducts(mockProducts, SortOption.BEST_SELLING);
      
      // Best selling uses a score based on rating and rating count
      // We can verify the order is correct based on our knowledge of the algorithm
      expect(sorted[0].name).toBe('Bose Headphones'); // High rating (4.7) and highest rating count (200)
      expect(sorted[1].name).toBe('Apple iPhone');    // Good rating (4.5) and good rating count (120)
      expect(sorted[2].name).toBe('Dell XPS Laptop'); // Highest rating (4.8) but lower rating count (65)
      expect(sorted[3].name).toBe('Samsung Galaxy');  // Lowest rating (4.3) and lower rating count (95)
    });

    it('handles an empty array', () => {
      const emptyArray: Product[] = [];
      const sorted = sortProducts(emptyArray, SortOption.PRICE_LOW_TO_HIGH);
      expect(sorted).toEqual([]);
      expect(sorted.length).toBe(0);
    });

    it('handles an array with a single product', () => {
      const singleProduct = [mockProducts[0]];
      const sorted = sortProducts(singleProduct, SortOption.PRICE_LOW_TO_HIGH);
      expect(sorted).toEqual(singleProduct);
      expect(sorted.length).toBe(1);
    });

    it('returns a new array and does not modify the original array', () => {
      const original = [...mockProducts];
      const sorted = sortProducts(mockProducts, SortOption.PRICE_LOW_TO_HIGH);
      
      // Verify original array is unchanged
      expect(mockProducts).toEqual(original);
      
      // Verify sorted array is different from original
      expect(sorted).not.toBe(mockProducts);
    });

    it('handles products with undefined price values gracefully', () => {
      // Create products with missing price values
      const productsWithMissingPrices: Product[] = [
        {
          ...mockProducts[0],
          price: 100
        },
        {
          ...mockProducts[1],
          price: undefined as any // Force undefined for testing
        },
        {
          ...mockProducts[2],
          price: null as any // Force null for testing
        }
      ];
      
      // Test should not throw errors when sorting by price
      expect(() => {
        sortProducts(productsWithMissingPrices, SortOption.PRICE_LOW_TO_HIGH);
      }).not.toThrow();
    });
    
    it('handles products with undefined name values gracefully', () => {
      // Create products with missing name values
      const productsWithMissingNames: Product[] = [
        {
          ...mockProducts[0],
          name: 'Product A'
        },
        {
          ...mockProducts[1],
          name: '' // Empty string
        },
        {
          ...mockProducts[2],
          name: null as any // Force null for testing
        }
      ];
      
      // Test should not throw errors when sorting by name
      expect(() => {
        sortProducts(productsWithMissingNames, SortOption.NAME_A_TO_Z);
      }).not.toThrow();
    });

    it('handles invalid sort option by returning unsorted array', () => {
      const original = [...mockProducts];
      const sorted = sortProducts(mockProducts, 'invalid_option' as SortOption);
      
      // Should return array in original order
      expect(sorted).toEqual(original);
    });
  });

  describe('filterProductsByPrice', () => {
    // Mock product data for testing
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Budget Phone',
        price: 199.99,
        images: ['image1.jpg'],
        mainImage: 'image1.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '2',
        name: 'Mid-range Phone',
        price: 499.99,
        images: ['image2.jpg'],
        mainImage: 'image2.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '3',
        name: 'Premium Phone',
        price: 999.99,
        images: ['image3.jpg'],
        mainImage: 'image3.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '4',
        name: 'Luxury Phone',
        price: 1499.99,
        images: ['image4.jpg'],
        mainImage: 'image4.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '5',
        name: 'Missing Price Phone',
        price: undefined as any,
        images: ['image5.jpg'],
        mainImage: 'image5.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      }
    ];

    it('returns all products when no price filters are applied', () => {
      const filtered = filterProductsByPrice(mockProducts);
      expect(filtered).toEqual(mockProducts);
      expect(filtered.length).toBe(5);
    });

    it('filters products with min price only', () => {
      const filtered = filterProductsByPrice(mockProducts, 500);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Premium Phone', 'Luxury Phone']);
      expect(filtered.every(p => p.price && p.price >= 500)).toBe(true);
    });

    it('filters products with max price only', () => {
      const filtered = filterProductsByPrice(mockProducts, undefined, 500);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Budget Phone', 'Mid-range Phone']);
      expect(filtered.every(p => p.price && p.price <= 500)).toBe(true);
    });

    it('filters products with both min and max price', () => {
      const filtered = filterProductsByPrice(mockProducts, 400, 1000);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Mid-range Phone', 'Premium Phone']);
      expect(filtered.every(p => p.price && p.price >= 400 && p.price <= 1000)).toBe(true);
    });

    it('returns no products when price range has no matches', () => {
      const filtered = filterProductsByPrice(mockProducts, 2000, 3000);
      expect(filtered.length).toBe(0);
    });

    it('returns all products in range when all match the criteria', () => {
      const filtered = filterProductsByPrice(mockProducts, 100, 2000);
      expect(filtered.length).toBe(4); // Excludes the one with undefined price
      expect(filtered.every(p => p.price !== undefined)).toBe(true);
    });

    it('excludes products with undefined or null price values', () => {
      const productsWithNullPrice = [
        ...mockProducts,
        {
          id: '6',
          name: 'Null Price Phone',
          price: null as any,
          images: ['image6.jpg'],
          mainImage: 'image6.jpg',
          categoryId: 'electronics',
          category: 'Electronics'
        }
      ];
      
      const filtered = filterProductsByPrice(productsWithNullPrice, 100, 2000);
      expect(filtered.length).toBe(4);
      expect(filtered.every(p => p.price !== undefined && p.price !== null)).toBe(true);
    });

    it('returns a new array and does not modify the original array', () => {
      const original = [...mockProducts];
      const filtered = filterProductsByPrice(mockProducts, 500);
      
      // Verify original array is unchanged
      expect(mockProducts).toEqual(original);
      
      // Verify filtered array is different from original
      expect(filtered).not.toBe(mockProducts);
    });

    it('handles edge case where min price equals max price', () => {
      // Add a product with price exactly 500
      const productsWithExactPrice = [
        ...mockProducts,
        {
          id: '6',
          name: 'Exact Price Phone',
          price: 500,
          images: ['image6.jpg'],
          mainImage: 'image6.jpg',
          categoryId: 'electronics',
          category: 'Electronics'
        }
      ];
      
      const filtered = filterProductsByPrice(productsWithExactPrice, 500, 500);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Exact Price Phone');
      expect(filtered[0].price).toBe(500);
    });
  });

  describe('applyClientSideFilters', () => {
    // Mock product data for testing
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Budget Phone',
        price: 199.99,
        images: ['image1.jpg'],
        mainImage: 'image1.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '2',
        name: 'Mid-range Phone',
        price: 499.99,
        images: ['image2.jpg'],
        mainImage: 'image2.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '3',
        name: 'Premium Phone',
        price: 999.99,
        images: ['image3.jpg'],
        mainImage: 'image3.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      },
      {
        id: '4',
        name: 'Luxury Phone',
        price: 1499.99,
        images: ['image4.jpg'],
        mainImage: 'image4.jpg',
        categoryId: 'electronics',
        category: 'Electronics'
      }
    ];

    it('returns all products when no filters are applied', () => {
      const filters: ProductFilter = {};
      const filtered = applyClientSideFilters(mockProducts, filters);
      expect(filtered).toEqual(mockProducts);
      expect(filtered.length).toBe(4);
    });

    it('applies min price filter correctly', () => {
      const filters: ProductFilter = { minPrice: 500 };
      const filtered = applyClientSideFilters(mockProducts, filters);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Premium Phone', 'Luxury Phone']);
    });

    it('applies max price filter correctly', () => {
      const filters: ProductFilter = { maxPrice: 500 };
      const filtered = applyClientSideFilters(mockProducts, filters);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Budget Phone', 'Mid-range Phone']);
    });

    it('applies both min and max price filters correctly', () => {
      const filters: ProductFilter = { minPrice: 400, maxPrice: 1000 };
      const filtered = applyClientSideFilters(mockProducts, filters);
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.name)).toEqual(['Mid-range Phone', 'Premium Phone']);
    });

    it('returns no products when filters have no matches', () => {
      const filters: ProductFilter = { minPrice: 2000, maxPrice: 3000 };
      const filtered = applyClientSideFilters(mockProducts, filters);
      expect(filtered.length).toBe(0);
    });

    it('returns a new array and does not modify the original array', () => {
      const original = [...mockProducts];
      const filters: ProductFilter = { minPrice: 500 };
      const filtered = applyClientSideFilters(mockProducts, filters);
      
      // Verify original array is unchanged
      expect(mockProducts).toEqual(original);
      
      // Verify filtered array is different from original
      expect(filtered).not.toBe(mockProducts);
    });
  });
});
