/**
 * Unit Tests for Undefined Handling
 * 
 * This file contains unit tests to verify that the fixes for handling undefined values
 * before map operations are working correctly in the following components:
 * - RelatedProducts.tsx
 * - ProductGallery.tsx
 * - dataTransformers.ts
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RelatedProducts from '../components/RelatedProducts';
import ProductGallery from '../components/ProductGallery';
import { 
  transformProductFromBackend, 
  transformProductsFromBackend,
  transformPaginatedProductsFromBackend
} from '../../../utils/dataTransformers';

describe('Undefined Handling Tests', () => {
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

    test('should handle products array with valid items', () => {
      // Create mock products
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Description 1',
          price: 99.99,
          images: ['image1.jpg'],
          mainImage: 'image1.jpg',
          categoryId: '1',
          category: 'Category 1',
          rating: 4.5,
          ratingCount: 10,
          stock: 100,
          sku: 'SKU1',
          brand: 'Brand 1',
          featured: false,
          onSale: false,
          tags: ['tag1', 'tag2'],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        },
        {
          id: '2',
          name: 'Test Product 2',
          description: 'Description 2',
          price: 149.99,
          images: ['image2.jpg'],
          mainImage: 'image2.jpg',
          categoryId: '1',
          category: 'Category 1',
          rating: 4.0,
          ratingCount: 5,
          stock: 50,
          sku: 'SKU2',
          brand: 'Brand 2',
          featured: true,
          onSale: true,
          tags: ['tag2', 'tag3'],
          createdAt: '2023-01-02',
          updatedAt: '2023-01-02'
        }
      ];
      
      // Render the component with valid products
      render(
        <RelatedProducts
          currentProductId="999" // Different ID to show all products
          products={mockProducts}
        />
      );

      // Verify that the component renders the products
      expect(screen.getByText('Related Products')).toBeInTheDocument();
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    test('should filter out current product from related products', () => {
      // Create mock products
      const mockProducts = [
        {
          id: '1',
          name: 'Current Product',
          description: 'Description 1',
          price: 99.99,
          images: ['image1.jpg'],
          mainImage: 'image1.jpg',
          categoryId: '1',
          category: 'Category 1',
          rating: 4.5,
          ratingCount: 10,
          stock: 100,
          sku: 'SKU1',
          brand: 'Brand 1',
          featured: false,
          onSale: false,
          tags: ['tag1', 'tag2'],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01'
        },
        {
          id: '2',
          name: 'Related Product',
          description: 'Description 2',
          price: 149.99,
          images: ['image2.jpg'],
          mainImage: 'image2.jpg',
          categoryId: '1',
          category: 'Category 1',
          rating: 4.0,
          ratingCount: 5,
          stock: 50,
          sku: 'SKU2',
          brand: 'Brand 2',
          featured: true,
          onSale: true,
          tags: ['tag2', 'tag3'],
          createdAt: '2023-01-02',
          updatedAt: '2023-01-02'
        }
      ];
      
      // Render the component with the current product ID
      render(
        <RelatedProducts
          currentProductId="1"
          products={mockProducts}
        />
      );

      // Verify that the current product is filtered out
      expect(screen.getByText('Related Products')).toBeInTheDocument();
      expect(screen.getByText('Related Product')).toBeInTheDocument();
      expect(screen.queryByText('Current Product')).not.toBeInTheDocument();
    });

    test('should handle non-array products safely', () => {
      // Render the component with a non-array value
      render(
        <RelatedProducts
          currentProductId="1"
          products={{ id: '1', name: 'Invalid Product' } as any}
        />
      );

      // Verify that the component renders without errors
      expect(screen.getByText('No related products found')).toBeInTheDocument();
    });
  });

  /**
   * Test 2: ProductGallery component with undefined images
   */
  describe('ProductGallery Component', () => {
    test('should handle product with undefined images array', () => {
      // Create a mock product without images
      const mockProduct = {
        id: '1',
        name: 'No Images Product',
        description: 'Description',
        price: 99.99,
        images: undefined,
        mainImage: '',
        categoryId: '1',
        category: 'Category 1',
        rating: 4.5,
        ratingCount: 10,
        stock: 100,
        sku: 'SKU1',
        brand: 'Brand 1',
        featured: false,
        onSale: false,
        tags: ['tag1', 'tag2'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      } as any;
      
      // Render the component
      render(
        <ProductGallery
          product={mockProduct}
        />
      );

      // Verify that the component renders without errors
      const image = screen.getByAltText('No Images Product');
      expect(image).toBeInTheDocument();
    });

    test('should handle product with null images array', () => {
      // Create a mock product with null images
      const mockProduct = {
        id: '1',
        name: 'Null Images Product',
        description: 'Description',
        price: 99.99,
        images: null,
        mainImage: '',
        categoryId: '1',
        category: 'Category 1',
        rating: 4.5,
        ratingCount: 10,
        stock: 100,
        sku: 'SKU1',
        brand: 'Brand 1',
        featured: false,
        onSale: false,
        tags: ['tag1', 'tag2'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      } as any;
      
      // Render the component
      render(
        <ProductGallery
          product={mockProduct}
        />
      );

      // Verify that the component renders without errors
      const image = screen.getByAltText('Null Images Product');
      expect(image).toBeInTheDocument();
    });

    test('should handle product with empty images array', () => {
      // Create a mock product with empty images array
      const mockProduct = {
        id: '1',
        name: 'Empty Images Product',
        description: 'Description',
        price: 99.99,
        images: [],
        mainImage: '',
        categoryId: '1',
        category: 'Category 1',
        rating: 4.5,
        ratingCount: 10,
        stock: 100,
        sku: 'SKU1',
        brand: 'Brand 1',
        featured: false,
        onSale: false,
        tags: ['tag1', 'tag2'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };
      
      // Render the component
      render(
        <ProductGallery
          product={mockProduct}
        />
      );

      // Verify that the component renders without errors
      const image = screen.getByAltText('Empty Images Product');
      expect(image).toBeInTheDocument();
    });

    test('should handle product with valid images array', () => {
      // Create a mock product with valid images
      const mockProduct = {
        id: '1',
        name: 'With Images Product',
        description: 'Description',
        price: 99.99,
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        mainImage: 'image1.jpg',
        categoryId: '1',
        category: 'Category 1',
        rating: 4.5,
        ratingCount: 10,
        stock: 100,
        sku: 'SKU1',
        brand: 'Brand 1',
        featured: false,
        onSale: false,
        tags: ['tag1', 'tag2'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };
      
      // Render the component
      render(
        <ProductGallery
          product={mockProduct}
        />
      );

      // Verify that the component renders without errors
      const image = screen.getByAltText('With Images Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'image1.jpg');
      
      // Verify thumbnails are rendered
      const thumbnails = screen.getAllByRole('button');
      expect(thumbnails.length).toBeGreaterThanOrEqual(3); // At least 3 thumbnails
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

    test('should handle transforming array of products with null/undefined values', () => {
      // Create test products with varying null/undefined values
      const backendProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: null,
          sku: 'SKU1',
          image: null,
          price: 99.99,
          stock_quantity: 10,
          category: null,
          tags: null,
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          sku: 'SKU2',
          image: 'image2.jpg',
          price: 149.99,
          stock_quantity: 20,
          category: 'Category 2',
          tags: 'tag1,tag2',
          is_active: true,
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        }
      ];
      
      // Transform the products
      const frontendProducts = transformProductsFromBackend(backendProducts);
      
      // Verify the transformation handles null values correctly
      expect(frontendProducts[0].images).toEqual([]);
      expect(frontendProducts[0].mainImage).toBe('');
      expect(frontendProducts[0].category).toBe('');
      expect(frontendProducts[0].tags).toEqual([]);
      
      expect(frontendProducts[1].images).toEqual(['image2.jpg']);
      expect(frontendProducts[1].mainImage).toBe('image2.jpg');
      expect(frontendProducts[1].category).toBe('Category 2');
      expect(frontendProducts[1].tags).toEqual(['tag1', 'tag2']);
    });

    test('should handle transforming paginated response with null/undefined values', () => {
      // Create a mock paginated response with products having null/undefined values
      const backendResponse = {
        items: [
          {
            id: 1,
            name: 'Product 1',
            description: null,
            sku: 'SKU1',
            image: null,
            price: 99.99,
            stock_quantity: 10,
            category: null,
            tags: null,
            is_active: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Product 2',
            description: 'Description 2',
            sku: 'SKU2',
            image: 'image2.jpg',
            price: 149.99,
            stock_quantity: 20,
            category: 'Category 2',
            tags: 'tag1,tag2',
            is_active: true,
            created_at: '2023-01-02T00:00:00Z',
            updated_at: '2023-01-02T00:00:00Z'
          }
        ],
        meta: {
          page: 1,
          per_page: 10,
          total: 2,
          total_pages: 1
        }
      };
      
      // Transform the paginated response
      const frontendResponse = transformPaginatedProductsFromBackend(backendResponse);
      
      // Verify the response structure
      expect(frontendResponse.success).toBe(true);
      expect(frontendResponse.statusCode).toBe(200);
      expect(Array.isArray(frontendResponse.data)).toBe(true);
      expect(frontendResponse.data.length).toBe(2);
      
      // Verify null/undefined handling
      expect(frontendResponse.data[0].images).toEqual([]);
      expect(frontendResponse.data[0].mainImage).toBe('');
      expect(frontendResponse.data[0].category).toBe('');
      expect(frontendResponse.data[0].tags).toEqual([]);
      
      expect(frontendResponse.data[1].images).toEqual(['image2.jpg']);
      expect(frontendResponse.data[1].mainImage).toBe('image2.jpg');
      expect(frontendResponse.data[1].category).toBe('Category 2');
      expect(frontendResponse.data[1].tags).toEqual(['tag1', 'tag2']);
    });
  });
});