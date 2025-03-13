import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../components/ProductList';
import { Product } from '../../../types/product.types';
import { formatPrice } from '../../../utils/formatters';

// Mock the Card, Button, and Spinner components
jest.mock('../../../components/ui/Card', () => {
  return ({ children, footer, className, hover, bordered, onClick }: any) => (
    <div 
      data-testid="card-component" 
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

jest.mock('../../../components/ui/Button', () => {
  return ({ children, onClick, variant, size, fullWidth, disabled }: any) => (
    <button 
      data-testid={`button-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});

jest.mock('../../../components/ui/Spinner', () => {
  return ({ size, centered }: any) => <div data-testid="spinner-component">Loading...</div>;
});

// Sample product data for testing
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
    tags: ['electronics', 'gadget'],
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
    rating: 3.5,
    ratingCount: 80,
    stock: 5,
    sku: 'TEST-SKU-456',
    brand: 'Another Brand',
    featured: false,
    onSale: false,
    tags: ['clothing', 'apparel'],
    createdAt: '2023-01-05',
    updatedAt: '2023-01-15'
  }
];

describe('ProductList Component', () => {
  // Test loading state
  test('renders loading spinner when isLoading is true', () => {
    render(<ProductList isLoading={true} />);
    expect(screen.getByTestId('spinner-component')).toBeInTheDocument();
  });

  // Test error state
  test('renders error message when error is provided', () => {
    const errorMessage = 'Failed to load products';
    render(<ProductList error={errorMessage} />);
    expect(screen.getByText('Error Loading Products')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test empty state
  test('renders empty state when no products are provided', () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  // Test with products data
  test('renders products correctly', () => {
    render(<ProductList products={mockProducts} />);
    
    // Check if both product names are displayed
    expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[1].name)).toBeInTheDocument();
    
    // Check if brands are displayed
    expect(screen.getByText(mockProducts[0].brand)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[1].brand)).toBeInTheDocument();
    
    // Check if prices are displayed correctly
    const discountedPrice = mockProducts[0].price * (1 - mockProducts[0].discountPercentage! / 100);
    expect(screen.getByText(formatPrice(discountedPrice, { fallbackValue: 'N/A' }))).toBeInTheDocument();
    expect(screen.getByText(formatPrice(mockProducts[0].price, { fallbackValue: 'N/A' }))).toBeInTheDocument();
    expect(screen.getByText(formatPrice(mockProducts[1].price, { fallbackValue: 'N/A' }))).toBeInTheDocument();
    
    // Check if stock badges are displayed
    const inStockElements = screen.getAllByText('In Stock');
    expect(inStockElements.length).toBe(2);
    
    // Check if sale badge is displayed for the first product
    expect(screen.getByText(`${mockProducts[0].discountPercentage}% OFF`)).toBeInTheDocument();
  });

  // Test action buttons
  test('calls onViewDetails when view details button is clicked', () => {
    const handleViewDetails = jest.fn();
    render(
      <ProductList 
        products={mockProducts} 
        onViewDetails={handleViewDetails}
      />
    );
    
    const viewDetailsButtons = screen.getAllByText('View Details');
    fireEvent.click(viewDetailsButtons[0]);
    expect(handleViewDetails).toHaveBeenCalledWith(mockProducts[0]);
  });

  test('calls onAddToCart when add to cart button is clicked', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductList 
        products={mockProducts} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  // Test without action buttons
  test('does not render action buttons when showActions is false', () => {
    render(<ProductList products={mockProducts} showActions={false} />);
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  // Test with out of stock product
  test('disables add to cart button for out of stock products', () => {
    const outOfStockProducts = [
      { ...mockProducts[0], stock: 0 }
    ];
    
    render(<ProductList products={outOfStockProducts} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    const addToCartButton = screen.getByText('Add to Cart');
    expect(addToCartButton).toHaveAttribute('disabled');
  });

  // Test image error handling
  test('handles image loading error', () => {
    render(<ProductList products={mockProducts} />);
    
    const images = screen.getAllByRole('img');
    fireEvent.error(images[0]);
    
    // Check if the fallback image URL is set
    expect(images[0]).toHaveAttribute('src', 'https://via.placeholder.com/300x300?text=No+Image');
  });

  // Test price formatting with formatPrice utility
  test('handles price formatting with formatPrice utility', () => {
    // Test with valid price
    render(<ProductList products={mockProducts} />);
    
    // Check regular price formatting
    expect(screen.getByText(formatPrice(mockProducts[1].price, { fallbackValue: 'N/A' }))).toBeInTheDocument();
    
    // Check discounted price formatting
    const discountedPrice = mockProducts[0].price * (1 - mockProducts[0].discountPercentage! / 100);
    expect(screen.getByText(formatPrice(discountedPrice, { fallbackValue: 'N/A' }))).toBeInTheDocument();
  });
  
  // Test with invalid price
  test('handles invalid price formatting', () => {
    const productsWithInvalidPrice = [
      { ...mockProducts[0], price: 'invalid' as any }
    ];
    
    render(<ProductList products={productsWithInvalidPrice} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
