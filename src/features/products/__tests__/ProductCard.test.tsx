import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../components/ProductCard';
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
      {footer && <div data-testid="card-footer">{footer}</div>}
    </div>
  );
});

jest.mock('../../../components/ui/Button', () => {
  return ({ children, onClick, variant, size, fullWidth }: any) => (
    <button 
      data-testid={`button-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

jest.mock('../../../components/ui/Spinner', () => {
  return ({ size, centered }: any) => <div data-testid="spinner-component">Loading...</div>;
});

// Sample product data for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product',
  price: 99.99,
  images: ['image1.jpg', 'image2.jpg'],
  mainImage: 'main-image.jpg',
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
};

describe('ProductCard Component', () => {
  // Test loading state
  test('renders loading spinner when isLoading is true', () => {
    render(<ProductCard isLoading={true} />);
    expect(screen.getByTestId('spinner-component')).toBeInTheDocument();
  });

  // Test error state
  test('renders error message when error is provided', () => {
    const errorMessage = 'Failed to load product';
    render(<ProductCard error={errorMessage} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test no product state
  test('renders "Product not available" when no product is provided', () => {
    render(<ProductCard />);
    expect(screen.getByText('Product not available')).toBeInTheDocument();
  });

  // Test with product data
  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check if product name and brand are displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    
    // Check if price is displayed correctly (with discount)
    const discountedPrice = mockProduct.price * (1 - mockProduct.discountPercentage! / 100);
    expect(screen.getByText(formatPrice(discountedPrice))).toBeInTheDocument();
    expect(screen.getByText(formatPrice(mockProduct.price))).toBeInTheDocument();
    
    // Check if stock badge is displayed
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    
    // Check if sale badge is displayed
    expect(screen.getByText(`${mockProduct.discountPercentage}% OFF`)).toBeInTheDocument();
  });

  // Test with out of stock product
  test('renders "Out of Stock" badge when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  // Test without discount
  test('renders regular price when product is not on sale', () => {
    const noSaleProduct = { ...mockProduct, onSale: false, discountPercentage: undefined };
    render(<ProductCard product={noSaleProduct} />);
    expect(screen.getByText(formatPrice(mockProduct.price))).toBeInTheDocument();
    expect(screen.queryByText(`% OFF`)).not.toBeInTheDocument();
  });

  // Test action buttons
  test('calls onViewDetails when view details button is clicked', () => {
    const handleViewDetails = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onViewDetails={handleViewDetails}
      />
    );
    
    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);
    expect(handleViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  test('calls onAddToCart when add to cart button is clicked', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  // Test without action buttons
  test('does not render action buttons when showActions is false', () => {
    render(<ProductCard product={mockProduct} showActions={false} />);
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  // Test image error handling
  test('handles image loading error', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText(mockProduct.name) as HTMLImageElement;
    fireEvent.error(image);
    
    // Check if the fallback image URL is set
    expect(image.src).toContain('placeholder');
  });

  // Test star rating rendering
  test('renders correct number of stars based on rating', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    
    // For a rating of 4.5, we should have 4 full stars, 1 half star, and 0 empty stars
    const fullStars = container.querySelectorAll('svg[key^="full-"]');
    const halfStar = container.querySelector('svg[fill="url(#half-star-gradient)"]');
    const emptyStars = container.querySelectorAll('svg[key^="empty-"]');
    
    expect(fullStars.length).toBe(4);
    expect(halfStar).toBeInTheDocument();
    expect(emptyStars.length).toBe(0);
    
    // Check if rating count is displayed
    expect(screen.getByText(`(${mockProduct.ratingCount})`)).toBeInTheDocument();
  });
});
