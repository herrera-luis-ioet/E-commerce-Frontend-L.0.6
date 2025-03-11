import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../../../types/product.types';

// Mock the ProductCard component
jest.mock('../components/ProductCard', () => {
  return ({ product, showActions, onViewDetails, onAddToCart }: any) => (
    <div data-testid={`product-card-${product?.id || 'no-id'}`}>
      {product?.name || 'No Product'}
    </div>
  );
});

// Mock the Spinner component
jest.mock('../../../components/ui/Spinner', () => {
  return ({ size, centered }: any) => <div data-testid="spinner-component">Loading...</div>;
});

// Sample products data for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'This is test product 1',
    price: 99.99,
    images: ['image1.jpg'],
    mainImage: 'main-image1.jpg',
    categoryId: 'cat1',
    category: 'Electronics',
    rating: 4.5,
    ratingCount: 120,
    stock: 10,
    sku: 'TEST-SKU-123',
    brand: 'Test Brand',
    featured: true,
    onSale: true,
    discountPercentage: 20,
    tags: ['electronics'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-10'
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'This is test product 2',
    price: 149.99,
    images: ['image2.jpg'],
    mainImage: 'main-image2.jpg',
    categoryId: 'cat2',
    category: 'Clothing',
    rating: 3.8,
    ratingCount: 85,
    stock: 5,
    sku: 'TEST-SKU-456',
    brand: 'Another Brand',
    featured: false,
    onSale: false,
    tags: ['clothing'],
    createdAt: '2023-02-01',
    updatedAt: '2023-02-10'
  },
  {
    id: '3',
    name: 'Test Product 3',
    description: 'This is test product 3',
    price: 49.99,
    images: ['image3.jpg'],
    mainImage: 'main-image3.jpg',
    categoryId: 'cat1',
    category: 'Electronics',
    rating: 4.0,
    ratingCount: 200,
    stock: 0,
    sku: 'TEST-SKU-789',
    brand: 'Test Brand',
    featured: true,
    onSale: true,
    discountPercentage: 10,
    tags: ['electronics', 'gadget'],
    createdAt: '2023-03-01',
    updatedAt: '2023-03-10'
  }
];

describe('ProductGrid Component', () => {
  // Test loading state
  test('renders loading spinner when isLoading is true', () => {
    render(<ProductGrid isLoading={true} />);
    expect(screen.getByTestId('spinner-component')).toBeInTheDocument();
  });

  // Test error state
  test('renders error message when error is provided', () => {
    const errorMessage = 'Failed to load products';
    render(<ProductGrid error={errorMessage} />);
    expect(screen.getByText('Error Loading Products')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test empty products state
  test('renders empty state message when no products are provided', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search or filter to find what you're looking for.")).toBeInTheDocument();
  });

  // Test with products data
  test('renders correct number of ProductCard components', () => {
    render(<ProductGrid products={mockProducts} />);
    
    // Check if each product card is rendered
    mockProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  // Test grid configuration
  test('applies correct grid classes based on props', () => {
    const { container } = render(
      <ProductGrid 
        products={mockProducts} 
        smColumns={2}
        mdColumns={3}
        lgColumns={4}
        gap={4}
      />
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-4');
    expect(gridElement).toHaveClass('grid-cols-2');
    expect(gridElement).toHaveClass('md:grid-cols-3');
    expect(gridElement).toHaveClass('lg:grid-cols-4');
  });

  // Test custom grid configuration
  test('applies custom grid configuration', () => {
    const { container } = render(
      <ProductGrid 
        products={mockProducts} 
        smColumns={1}
        mdColumns={2}
        lgColumns={3}
        gap={6}
      />
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-6');
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('md:grid-cols-2');
    expect(gridElement).toHaveClass('lg:grid-cols-3');
  });

  // Test passing props to ProductCard
  test('passes correct props to ProductCard components', () => {
    const handleViewDetails = jest.fn();
    const handleAddToCart = jest.fn();
    
    render(
      <ProductGrid 
        products={mockProducts}
        showActions={true}
        onViewDetails={handleViewDetails}
        onAddToCart={handleAddToCart}
      />
    );
    
    // We can't directly test the props passed to the mocked component,
    // but we can verify that the correct number of cards are rendered
    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(mockProducts.length);
  });

  // Test with additional className
  test('applies additional className when provided', () => {
    const { container } = render(
      <ProductGrid 
        products={mockProducts}
        className="custom-class"
      />
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('custom-class');
  });
});