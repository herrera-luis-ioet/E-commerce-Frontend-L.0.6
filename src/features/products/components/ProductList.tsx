import React from 'react';
import { Product } from '../../../types/product.types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { formatPrice } from '../../../utils/formatters';

/**
 * ProductList component props
 */
export interface ProductListProps {
  /** Array of products to display */
  products?: Product[];
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Whether to show quick actions on product items */
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
 * ProductList component for displaying products in a list view
 */
const ProductList: React.FC<ProductListProps> = ({
  products = [],
  isLoading = false,
  error,
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


  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Rating count */}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => {
        // Calculate discount price if product is on sale
        // Ensure price is a valid number before calculation
        const discountedPrice = product.onSale && 
          product.discountPercentage !== undefined && 
          typeof product.price === 'number' && 
          !isNaN(product.price)
            ? product.price * (1 - product.discountPercentage / 100)
            : null;

        // Handle fakestoreapi.com structure
        const productName = product.name || product.title;
        const productImage = product.mainImage || product.image;
        const productCategory = product.category;
        const productRating = product.rating?.rate || product.rating || 0;
        const productRatingCount = product.rating?.count || product.ratingCount || 0;
        const productDescription = product.description;

        return (
          <Card 
            key={product.id}
            className="overflow-hidden"
            hover
            bordered
          >
            <div className="flex flex-col md:flex-row">
              {/* Product image */}
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                
                {/* Stock status badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                
                {/* Sale badge */}
                {product.onSale && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.discountPercentage}% OFF
                  </div>
                )}
              </div>
              
              {/* Product details */}
              <div className="flex-grow p-4 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">{product.brand || productCategory}</span>
                  {renderRating(productRating)}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{productName}</h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {productDescription}
                </p>
                
                {/* Price display with proper type checking using formatPrice utility */}
                <div className="flex items-center space-x-2 mb-4">
                  {discountedPrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(discountedPrice, { fallbackValue: 'N/A' })}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price, { fallbackValue: 'N/A' })}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price, { fallbackValue: 'N/A' })}
                    </span>
                  )}
                </div>
                
                {/* Product metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {product.category}
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Tags:</span> {product.tags.join(', ')}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                {showActions && (
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => onAddToCart && onAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(product)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductList;
