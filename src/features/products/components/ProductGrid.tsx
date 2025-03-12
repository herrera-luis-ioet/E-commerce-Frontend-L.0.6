import React from 'react';
import { Product } from '../../../types/product.types';
import ProductCard from './ProductCard';
import Spinner from '../../../components/ui/Spinner';

/**
 * ProductGrid component props
 */
export interface ProductGridProps {
  /** Array of products to display */
  products?: Product[];
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Number of columns for small screens (default: 2) */
  smColumns?: number;
  /** Number of columns for medium screens (default: 3) */
  mdColumns?: number;
  /** Number of columns for large screens (default: 4) */
  lgColumns?: number;
  /** Gap between grid items (in Tailwind units, default: 4 = 1rem) */
  gap?: number;
  /** Whether to show quick actions on product cards */
  showActions?: boolean;
  /** Handler for view details action */
  onViewDetails?: (product: Product) => void;
  /** Handler for add to cart action */
  onAddToCart?: (product: Product) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * ProductGrid component for displaying products in a responsive grid layout
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  error,
  smColumns = 2,
  mdColumns = 3,
  lgColumns = 4,
  gap = 4,
  showActions = true,
  onViewDetails,
  onAddToCart,
  className = '',
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <Spinner size="xl" centered />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="text-center text-error">
          <p className="text-lg font-semibold">Error Loading Products</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!products || products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="text-center text-gray-500">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>
    );
  }

  // Generate gap class based on prop
  const gapClass = `gap-${gap}`;

  return (
    <div 
      className={`grid ${gapClass} grid-cols-${smColumns} md:grid-cols-${mdColumns} lg:grid-cols-${lgColumns} ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showActions={showActions}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
