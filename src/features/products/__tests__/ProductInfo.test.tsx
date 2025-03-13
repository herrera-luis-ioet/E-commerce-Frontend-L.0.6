import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductInfo from '../components/ProductInfo';
import { Product } from '../../../types/product.types';
import { formatPrice } from '../../../utils/formatters';

// Mock the Button component
jest.mock('../../../components/ui/Button', () => {
  return ({ children, onClick, variant, size, fullWidth, disabled, className }: any) => (
    <button 
      data-testid={`button-${variant}`}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
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

describe('ProductInfo Component', () => {
  test('renders product information correctly', () => {
    render(<ProductInfo product={mockProduct} />);
    
    // Check if product name and brand are displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(/Brand:/)).toBeInTheDocument();
    expect(screen.getByText(/Test Brand/)).toBeInTheDocument();
    
    // Check if price is displayed correctly (with discount)
    const discountedPrice = mockProduct.price * (1 - mockProduct.discountPercentage! / 100);
    expect(screen.getByText(formatPrice(discountedPrice))).toBeInTheDocument();
    expect(screen.getByText(formatPrice(mockProduct.price))).toBeInTheDocument();
    
    // Check if stock badge is displayed
    expect(screen.getByText(/In Stock/)).toBeInTheDocument();
    
    // Check if sale badge is displayed
    expect(screen.getByText(`${mockProduct.discountPercentage}% OFF`)).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  test('renders regular price when product is not on sale', () => {
    const noSaleProduct = { ...mockProduct, onSale: false, discountPercentage: undefined };
    render(<ProductInfo product={noSaleProduct} />);
    
    expect(screen.getByText(formatPrice(mockProduct.price))).toBeInTheDocument();
    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });

  test('handles quantity changes correctly', () => {
    render(<ProductInfo product={mockProduct} />);
    
    // Find quantity input
    const quantityInput = screen.getByLabelText('Quantity:') as HTMLInputElement;
    expect(quantityInput.value).toBe('1');
    
    // Test increment button
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    expect(quantityInput.value).toBe('2');
    
    // Test decrement button
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    expect(quantityInput.value).toBe('1');
    
    // Test direct input
    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput.value).toBe('5');
    
    // Test invalid input (should not change)
    fireEvent.change(quantityInput, { target: { value: '-1' } });
    expect(quantityInput.value).toBe('5'); // Should remain unchanged
  });

  test('calls onAddToCart with product and quantity when add to cart button is clicked', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductInfo 
        product={mockProduct} 
        onAddToCart={handleAddToCart}
      />
    );
    
    // Set quantity to 3
    const quantityInput = screen.getByLabelText('Quantity:') as HTMLInputElement;
    fireEvent.change(quantityInput, { target: { value: '3' } });
    
    // Click add to cart button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    // Check if handler was called with correct arguments
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct, 3);
  });

  test('does not show add to cart section when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductInfo product={outOfStockProduct} />);
    
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Quantity:')).not.toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('renders star rating correctly', () => {
    const { container } = render(<ProductInfo product={mockProduct} />);
    
    // For a rating of 4.5, we should have 4 full stars, 1 half star, and 0 empty stars
    // Check if rating count is displayed
    expect(screen.getByText(`(${mockProduct.ratingCount} reviews)`)).toBeInTheDocument();
    
    // Check for star SVGs
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5); // Total 5 stars (4 full + 1 half)
    
    // Check for half-star gradient
    const halfStar = container.querySelector('svg path[fill="url(#half-star-gradient)"]');
    expect(halfStar).toBeTruthy();
  });

  test('handles product with dimensions and weight', () => {
    const productWithDimensions = {
      ...mockProduct,
      dimensions: {
        width: 10,
        height: 5,
        depth: 2,
        unit: 'cm'
      },
      weight: {
        value: 0.5,
        unit: 'kg'
      }
    };
    
    render(<ProductInfo product={productWithDimensions} />);
    
    expect(screen.getByText('Dimensions:')).toBeInTheDocument();
    expect(screen.getByText('10 × 5 × 2 cm')).toBeInTheDocument();
    expect(screen.getByText('Weight:')).toBeInTheDocument();
    expect(screen.getByText('0.5 kg')).toBeInTheDocument();
  });

  test('handles price formatting with formatPrice utility', () => {
    render(<ProductInfo product={mockProduct} />);
    
    // Check regular price formatting
    expect(screen.getByText(formatPrice(mockProduct.price))).toBeInTheDocument();
    
    // Check discounted price formatting
    const discountedPrice = mockProduct.price * (1 - mockProduct.discountPercentage! / 100);
    expect(screen.getByText(formatPrice(discountedPrice))).toBeInTheDocument();
  });
});
