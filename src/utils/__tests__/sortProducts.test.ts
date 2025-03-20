import { sortProducts } from '../formatters';
import { Product, SortOption } from '../../types/product.types';

describe('sortProducts', () => {
  // Sample products for testing
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product B',
      description: 'Description B',
      price: 200,
      images: ['image1.jpg'],
      mainImage: 'image1.jpg',
      categoryId: 'cat1',
      category: 'Category 1',
      rating: 4.5,
      ratingCount: 100,
      stock: 10,
      sku: 'SKU-001',
      brand: 'Brand A',
      featured: true,
      onSale: false,
      tags: ['tag1', 'tag2'],
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2023-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Product A',
      description: 'Description A',
      price: 100,
      images: ['image2.jpg'],
      mainImage: 'image2.jpg',
      categoryId: 'cat2',
      category: 'Category 2',
      rating: 3.5,
      ratingCount: 200,
      stock: 5,
      sku: 'SKU-002',
      brand: 'Brand B',
      featured: false,
      onSale: true,
      tags: ['tag2', 'tag3'],
      createdAt: '2023-02-15T00:00:00Z',
      updatedAt: '2023-02-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Product C',
      description: 'Description C',
      price: 150,
      images: ['image3.jpg'],
      mainImage: 'image3.jpg',
      categoryId: 'cat1',
      category: 'Category 1',
      rating: 5.0,
      ratingCount: 50,
      stock: 15,
      sku: 'SKU-003',
      brand: 'Brand C',
      featured: true,
      onSale: true,
      tags: ['tag1', 'tag3'],
      createdAt: '2023-03-15T00:00:00Z',
      updatedAt: '2023-03-15T00:00:00Z'
    }
  ];

  test('sorts products by price low to high', () => {
    const sorted = sortProducts(mockProducts, SortOption.PRICE_LOW_TO_HIGH);
    expect(sorted[0].id).toBe('2'); // Product A (100)
    expect(sorted[1].id).toBe('3'); // Product C (150)
    expect(sorted[2].id).toBe('1'); // Product B (200)
  });

  test('sorts products by price high to low', () => {
    const sorted = sortProducts(mockProducts, SortOption.PRICE_HIGH_TO_LOW);
    expect(sorted[0].id).toBe('1'); // Product B (200)
    expect(sorted[1].id).toBe('3'); // Product C (150)
    expect(sorted[2].id).toBe('2'); // Product A (100)
  });

  test('sorts products by name A to Z', () => {
    const sorted = sortProducts(mockProducts, SortOption.NAME_A_TO_Z);
    expect(sorted[0].id).toBe('2'); // Product A
    expect(sorted[1].id).toBe('1'); // Product B
    expect(sorted[2].id).toBe('3'); // Product C
  });

  test('sorts products by name Z to A', () => {
    const sorted = sortProducts(mockProducts, SortOption.NAME_Z_TO_A);
    expect(sorted[0].id).toBe('3'); // Product C
    expect(sorted[1].id).toBe('1'); // Product B
    expect(sorted[2].id).toBe('2'); // Product A
  });

  test('sorts products by newest first', () => {
    const sorted = sortProducts(mockProducts, SortOption.NEWEST);
    expect(sorted[0].id).toBe('3'); // Created on 2023-03-15
    expect(sorted[1].id).toBe('2'); // Created on 2023-02-15
    expect(sorted[2].id).toBe('1'); // Created on 2023-01-15
  });

  test('sorts products by oldest first', () => {
    const sorted = sortProducts(mockProducts, SortOption.OLDEST);
    expect(sorted[0].id).toBe('1'); // Created on 2023-01-15
    expect(sorted[1].id).toBe('2'); // Created on 2023-02-15
    expect(sorted[2].id).toBe('3'); // Created on 2023-03-15
  });

  test('sorts products by highest rated', () => {
    const sorted = sortProducts(mockProducts, SortOption.HIGHEST_RATED);
    expect(sorted[0].id).toBe('3'); // Rating 5.0
    expect(sorted[1].id).toBe('1'); // Rating 4.5
    expect(sorted[2].id).toBe('2'); // Rating 3.5
  });

  test('sorts products by most popular', () => {
    const sorted = sortProducts(mockProducts, SortOption.MOST_POPULAR);
    expect(sorted[0].id).toBe('2'); // 200 ratings
    expect(sorted[1].id).toBe('1'); // 100 ratings
    expect(sorted[2].id).toBe('3'); // 50 ratings
  });

  test('sorts products by best selling (combination of rating and popularity)', () => {
    const sorted = sortProducts(mockProducts, SortOption.BEST_SELLING);
    // This test depends on the specific algorithm used for best selling
    // The current implementation uses rating * log(ratingCount + 1)
    // Product 2: 3.5 * log(201) ≈ 3.5 * 2.303 ≈ 8.06
    // Product 1: 4.5 * log(101) ≈ 4.5 * 2.004 ≈ 9.02
    // Product 3: 5.0 * log(51) ≈ 5.0 * 1.708 ≈ 8.54
    // So the order should be: Product 1, Product 3, Product 2
    expect(sorted[0].id).toBe('1');
    expect(sorted[1].id).toBe('3');
    expect(sorted[2].id).toBe('2');
  });

  test('does not mutate the original array', () => {
    const original = [...mockProducts];
    sortProducts(mockProducts, SortOption.PRICE_LOW_TO_HIGH);
    
    // Check that the original array is unchanged
    expect(mockProducts[0].id).toBe(original[0].id);
    expect(mockProducts[1].id).toBe(original[1].id);
    expect(mockProducts[2].id).toBe(original[2].id);
  });
});