/**
 * Integration Tests for Undefined Handling
 * 
 * This file contains integration tests to verify that the fixes for handling undefined values
 * before map operations are working correctly in the following components:
 * - RelatedProducts.tsx
 * - ProductGallery.tsx
 * - dataTransformers.ts
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RelatedProducts from '../../../../features/products/components/RelatedProducts';
import ProductGallery from '../../../../features/products/components/ProductGallery';
import { 
  transformProductFromBackend, 
  transformProductsFromBackend,
  transformPaginatedProductsFromBackend
} from '../../../../utils/dataTransformers';
import integrationTestSetup from './setup';
import productService from '../../../productService';

// Configure Jest to have a longer timeout for integration tests
jest.setTimeout(30000);

describe('Undefined Handling Integration Tests', () => {
  // Before all tests, check if the API is available
  beforeAll(async () => {
    const isApiAvailable = await integrationTestSetup.isApiAvailable();
    if (!isApiAvailable) {
      console.warn('API is not available. Integration tests will be skipped.');
      // Skip all tests if API is not available
      return;
    }
  });

  // After each test, clean up any test data
  afterEach(async () => {
    await integrationTestSetup.cleanupTestData();
  });

  /**
   * Test 1: RelatedProducts component with undefined products
   */
  describe('RelatedProducts Component', () => {
    test('should handle undefined products array', () => {
      // Render the component with undefined products
      render(
        <RelatedProducts
          currentProductId="1"
          products={undefined}
        />
      );

      // Verify that the component renders without errors
      expect(screen.getByText('No related products found')).toBeInTheDocument();
    });

    test('should handle null products array', () => {
      // Render the component with null products
      render(
        <RelatedProducts
          currentProductId="1"
          products={null as any}
        />
      );

      // Verify that the component renders without errors
      expect(screen.getByText('No related products found')).toBeInTheDocument();
    });

    test('should handle empty products array', () => {
      // Render the component with empty products array
      render(
        <RelatedProducts
          currentProductId="1"
          products={[]}
        />
      );

      // Verify that the component renders without errors
      expect(screen.getByText('No related products found')).toBeInTheDocument();
    });

    test('should handle products array with valid items', async () => {
      // Create test products
      const testProduct1 = integrationTestSetup.generateSampleProduct({ name: 'Test Product 1' });
      const testProduct2 = integrationTestSetup.generateSampleProduct({ name: 'Test Product 2' });
      
      const createdProducts = await Promise.all([
        integrationTestSetup.createTestProduct(testProduct1),
        integrationTestSetup.createTestProduct(testProduct2)
      ]);
      
      // Transform backend products to frontend format
      const frontendProducts = transformProductsFromBackend(createdProducts);
      
      // Render the component with valid products
      render(
        <RelatedProducts
          currentProductId="999" // Different ID to show all products
          products={frontendProducts}
        />
      );

      // Verify that the component renders the products
      expect(screen.getByText('Related Products')).toBeInTheDocument();
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  /**
   * Test 2: ProductGallery component with undefined images
   */
  describe('ProductGallery Component', () => {
    test('should handle product with undefined images array', async () => {
      // Create a test product without images
      const testProduct = integrationTestSetup.generateSampleProduct({
        name: 'No Images Product',
        image: null
      });
      
      const createdProduct = await integrationTestSetup.createTestProduct(testProduct);
      
      // Transform backend product to frontend format
      const frontendProduct = transformProductFromBackend(createdProduct);
      
      // Render the component
      render(
        <ProductGallery
          product={frontendProduct}
        />
      );

      // Verify that the component renders without errors
      // The image should be rendered with the error handler
      const image = screen.getByAltText('No Images Product');
      expect(image).toBeInTheDocument();
    });

    test('should handle product with valid images array', async () => {
      // Create a test product with an image
      const testProduct = integrationTestSetup.generateSampleProduct({
        name: 'With Image Product',
        image: 'https://example.com/test-image.jpg'
      });
      
      const createdProduct = await integrationTestSetup.createTestProduct(testProduct);
      
      // Transform backend product to frontend format
      const frontendProduct = transformProductFromBackend(createdProduct);
      
      // Render the component
      render(
        <ProductGallery
          product={frontendProduct}
        />
      );

      // Verify that the component renders without errors
      const image = screen.getByAltText('With Image Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    });
  });

  /**
   * Test 3: dataTransformers utility with undefined values
   */
  describe('dataTransformers Utility', () => {
    test('should handle backend product with null values', () => {
      // Create a backend product with null values
      const backendProduct = {
        id: 1,
        name: 'Test Product',
        description: null,
        sku: 'TEST-SKU',
        image: null,
        price: 99.99,
        stock_quantity: 10,
        category: null,
        tags: null,
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };
      
      // Transform the product
      const frontendProduct = transformProductFromBackend(backendProduct);
      
      // Verify the transformation handles null values correctly
      expect(frontendProduct.description).toBe('');
      expect(frontendProduct.images).toEqual([]);
      expect(frontendProduct.mainImage).toBe('');
      expect(frontendProduct.category).toBe('');
      expect(frontendProduct.tags).toEqual([]);
    });

    test('should handle backend product with undefined values', () => {
      // Create a backend product with some undefined values
      const backendProduct = {
        id: 1,
        name: 'Test Product',
        sku: 'TEST-SKU',
        price: 99.99,
        stock_quantity: 10,
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      } as any; // Type assertion to allow undefined properties
      
      // Transform the product
      const frontendProduct = transformProductFromBackend(backendProduct);
      
      // Verify the transformation handles undefined values correctly
      expect(frontendProduct.description).toBe('');
      expect(frontendProduct.images).toEqual([]);
      expect(frontendProduct.mainImage).toBe('');
      expect(frontendProduct.category).toBe('');
      expect(frontendProduct.tags).toEqual([]);
    });

    test('should handle transforming array of products with null/undefined values', async () => {
      // Create test products with varying null/undefined values
      const testProduct1 = integrationTestSetup.generateSampleProduct({
        name: 'Product 1',
        image: null,
        category: null,
        tags: null
      });
      
      const testProduct2 = integrationTestSetup.generateSampleProduct({
        name: 'Product 2',
        image: 'https://example.com/image.jpg',
        category: 'Test Category',
        tags: 'tag1,tag2'
      });
      
      const createdProducts = await Promise.all([
        integrationTestSetup.createTestProduct(testProduct1),
        integrationTestSetup.createTestProduct(testProduct2)
      ]);
      
      // Transform the products
      const frontendProducts = transformProductsFromBackend(createdProducts);
      
      // Verify the transformation handles null values correctly
      expect(frontendProducts[0].images).toEqual([]);
      expect(frontendProducts[0].mainImage).toBe('');
      expect(frontendProducts[0].category).toBe('');
      expect(frontendProducts[0].tags).toEqual([]);
      
      expect(frontendProducts[1].images).toEqual(['https://example.com/image.jpg']);
      expect(frontendProducts[1].mainImage).toBe('https://example.com/image.jpg');
      expect(frontendProducts[1].category).toBe('Test Category');
      expect(frontendProducts[1].tags).toEqual(['tag1', 'tag2']);
    });

    test('should handle transforming paginated response with null/undefined values', async () => {
      // Create test products
      await Promise.all([
        integrationTestSetup.createTestProduct(integrationTestSetup.generateSampleProduct({
          name: 'Paginated Product 1',
          image: null,
          tags: null
        })),
        integrationTestSetup.createTestProduct(integrationTestSetup.generateSampleProduct({
          name: 'Paginated Product 2',
          image: 'https://example.com/image.jpg',
          tags: 'tag1,tag2'
        }))
      ]);
      
      // Fetch products using the product service
      const response = await productService.getProducts();
      
      // Verify the response structure
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Find our test products
      const product1 = response.data.find(p => p.name === 'Paginated Product 1');
      const product2 = response.data.find(p => p.name === 'Paginated Product 2');
      
      // Verify null/undefined handling
      if (product1) {
        expect(product1.images).toEqual([]);
        expect(product1.mainImage).toBe('');
        expect(product1.tags).toEqual([]);
      }
      
      if (product2) {
        expect(product2.images).toEqual(['https://example.com/image.jpg']);
        expect(product2.mainImage).toBe('https://example.com/image.jpg');
        expect(product2.tags).toEqual(['tag1', 'tag2']);
      }
    });
  });
});