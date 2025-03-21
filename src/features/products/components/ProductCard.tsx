import React from 'react';
import { Product } from '../../../types/product.types';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import { formatPrice } from '../../../utils/formatters';

/**
 * ProductCard component props
 */
export interface ProductCardProps {
  /** Product data */
  product?: Product;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Whether to show quick actions */
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
 * ProductCard component for displaying individual product information
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
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
      <Card className={`h-80 flex items-center justify-center ${className}`}>
        <Spinner size="lg" centered />
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className={`h-80 flex items-center justify-center ${className}`}>
        <div className="text-center text-error">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  // Handle no product data
  if (!product) {
    return (
      <Card className={`h-80 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <p>Product not available</p>
        </div>
      </Card>
    );
  }

  // Calculate discount price if product is on sale
  const discountedPrice = product.onSale && product.discountPercentage !== undefined
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  // Handle fakestoreapi.com structure
  const productName = product.name || product.title;
  const productImage = product.mainImage || product.image;
  const productCategory = product.category;
  const productRating = product.rating?.rate || product.rating || 0;
  const productRatingCount = product.rating?.count || product.ratingCount || 0;
  


  // Render star rating
  const renderRating = (rating: number, ratingCount: number) => {
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
        <span className="ml-1 text-xs text-gray-500">({ratingCount})</span>
      </div>
    );
  };

  // Card footer with actions
  const cardFooter = showActions ? (
    <div className="flex flex-col space-y-2">
      <Button 
        variant="primary" 
        size="sm" 
        fullWidth
        onClick={() => onAddToCart && onAddToCart(product)}
      >
        Add to Cart
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        fullWidth
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        View Details
      </Button>
    </div>
  ) : null;

  // Stock status badge
  const stockBadge = (
    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
    </div>
  );

  // Sale badge
  const saleBadge = product.onSale ? (
    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
      {product.discountPercentage}% OFF
    </div>
  ) : null;

  return (
    <Card 
      className={`h-full flex flex-col ${className}`}
      hover
      bordered
      onClick={() => onViewDetails && onViewDetails(product)}
      footer={cardFooter}
    >
      {/* Product image with badges */}
      <div className="relative mb-4 h-48 overflow-hidden rounded-md">
        <img 
          src={productImage} 
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        {stockBadge}
        {saleBadge}
      </div>

      {/* Product info */}
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{product.brand || productCategory}</span>
          {renderRating(productRating, productRatingCount)}
        </div>
        
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{productName}</h3>
        
        <div className="flex items-center space-x-2">
          {discountedPrice ? (
            <>
              <span className="font-bold text-primary">{formatPrice(discountedPrice)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
