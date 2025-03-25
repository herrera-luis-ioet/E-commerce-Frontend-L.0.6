import { filterProductsBySearchQuery } from '../formatters';
import { Product } from '../../types/product.types';

describe('filterProductsBySearchQuery', () => {
  // Mock product data for testing
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 13 Pro',
      description: 'Latest iPhone model',
      price: 999.99,
      images: ['image1.jpg'],
      mainImage: 'image1.jpg',
      categoryId: 'smartphones',
      category: 'Smartphones'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S21',
      description: 'Latest Galaxy model',
      price: 899.99,
      images: ['image2.jpg'],
      mainImage: 'image2.jpg',
      categoryId: 'smartphones',
      category: 'Smartphones'
    },
    {
      id: '3',
      name: 'MacBook Pro 16-inch',
      description: 'Powerful laptop for professionals',
      price: 2399.99,
      images: ['image3.jpg'],
      mainImage: 'image3.jpg',
      categoryId: 'laptops',
      category: 'Laptops'
    },
    {
      id: '4',
      name: 'iPad Air',
      description: 'Lightweight tablet',
      price: 599.99,
      images: ['image4.jpg'],
      mainImage: 'image4.jpg',
      categoryId: 'tablets',
      category: 'Tablets'
    },
    {
      id: '5',
      name: 'Apple Watch Series 7',
      description: 'Latest Apple Watch',
      price: 399.99,
      images: ['image5.jpg'],
      mainImage: 'image5.jpg',
      categoryId: 'wearables',
      category: 'Wearables'
    }
  ];

  it('returns all products when search query is empty', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, '');
    expect(filtered).toEqual(mockProducts);
    expect(filtered.length).toBe(5);
  });

  it('returns all products when search query is only whitespace', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, '   ');
    expect(filtered).toEqual(mockProducts);
    expect(filtered.length).toBe(5);
  });

  it('filters products by exact name match', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, 'iPad Air');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('iPad Air');
  });

  it('filters products by partial name match', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, 'iPhone');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('iPhone 13 Pro');
  });

  it('filters products case-insensitively', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, 'iphone');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('iPhone 13 Pro');
  });

  it('filters products with multiple matches', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, 'Apple');
    expect(filtered.length).toBe(1);
    expect(filtered.map(p => p.name)).toEqual(['Apple Watch Series 7']);
  });

  it('returns empty array when no products match the search query', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, 'nonexistent');
    expect(filtered.length).toBe(0);
  });

  it('handles search query with leading/trailing whitespace', () => {
    const filtered = filterProductsBySearchQuery(mockProducts, '  iPhone  ');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('iPhone 13 Pro');
  });

  it('returns a new array and does not modify the original array', () => {
    const original = [...mockProducts];
    const filtered = filterProductsBySearchQuery(mockProducts, 'Apple');
    
    // Verify original array is unchanged
    expect(mockProducts).toEqual(original);
    
    // Verify filtered array is different from original
    expect(filtered).not.toBe(mockProducts);
  });

  it('handles products with undefined or null name values', () => {
    const productsWithMissingNames: Product[] = [
      {
        id: '1',
        name: 'Valid Product',
        price: 99.99,
        images: ['image1.jpg'],
        mainImage: 'image1.jpg',
        categoryId: 'category1',
        category: 'Category 1'
      },
      {
        id: '2',
        name: undefined as any, // Force undefined for testing
        price: 199.99,
        images: ['image2.jpg'],
        mainImage: 'image2.jpg',
        categoryId: 'category2',
        category: 'Category 2'
      },
      {
        id: '3',
        name: null as any, // Force null for testing
        price: 299.99,
        images: ['image3.jpg'],
        mainImage: 'image3.jpg',
        categoryId: 'category3',
        category: 'Category 3'
      }
    ];
    
    // Test should not throw errors when filtering products with missing names
    expect(() => {
      filterProductsBySearchQuery(productsWithMissingNames, 'Valid');
    }).not.toThrow();
    
    // Should only return the product with a valid name that matches
    const filtered = filterProductsBySearchQuery(productsWithMissingNames, 'Valid');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Valid Product');
  });

  it('handles an empty array of products', () => {
    const emptyArray: Product[] = [];
    const filtered = filterProductsBySearchQuery(emptyArray, 'test');
    expect(filtered).toEqual([]);
    expect(filtered.length).toBe(0);
  });
});
