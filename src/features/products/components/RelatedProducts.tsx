import React, { useRef } from 'react';
import { Product } from '../../../types/product.types';
import ProductCard from './ProductCard';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';

/**
 * RelatedProducts component props
 */
export interface RelatedProductsProps {
  /** Current product ID to exclude from related products */
  currentProductId: string;
  /** Array of related products */
  products?: Product[];
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Handler for view details action */
  onViewDetails?: (product: Product) => void;
  /** Handler for add to cart action */
  onAddToCart?: (product: Product) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * RelatedProducts component for displaying horizontally scrollable related products
 */
const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  products = [],
  isLoading = false,
  error,
  onViewDetails,
  onAddToCart,
  className = '',
}) => {
  // Reference to the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter out the current product from related products
  const filteredProducts = products.filter(product => product.id !== currentProductId);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card className={`${className}`} title="Related Products">
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" centered />
        </div>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className={`${className}`} title="Related Products">
        <div className="text-center text-error py-8">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  // Handle empty state
  if (filteredProducts.length === 0) {
    return (
      <Card className={`${className}`} title="Related Products">
        <div className="text-center text-gray-500 py-8">
          <p>No related products found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`${className}`} 
      title="Related Products"
      headerAction={
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      }
    >
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 space-x-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredProducts.map(product => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard
              product={product}
              showActions={true}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RelatedProducts;

// Add this CSS to hide scrollbars but keep functionality
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
