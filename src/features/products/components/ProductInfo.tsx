import React, { useState } from 'react';
import { Product } from '../../../types/product.types';
import Button from '../../../components/ui/Button';
import { formatPrice } from '../../../utils/formatters';

/**
 * ProductInfo component props
 */
export interface ProductInfoProps {
  /** Product data */
  product: Product;
  /** Handler for add to cart action */
  onAddToCart?: (product: Product, quantity: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * ProductInfo component for displaying detailed product information
 */
const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  className = '',
}) => {
  // State for quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate discount price if product is on sale
  const discountedPrice = product.onSale && product.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : null;


  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Rating count */}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          ({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Brand and category */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Brand:</span> {product.brand}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Category:</span> {product.category}
        </div>
      </div>
      
      {/* Product name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h1>
      
      {/* Rating */}
      <div className="mb-4">
        {renderRating(product.rating)}
      </div>
      
      {/* Price */}
      <div className="flex items-center mb-4">
        {discountedPrice ? (
          <>
            <span className="text-3xl font-bold text-primary mr-2">
              {formatPrice(discountedPrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
      
      {/* Stock status */}
      <div className="mb-4">
        {product.stock > 0 ? (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded">
            In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
            Out of Stock
          </span>
        )}
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {product.description}
        </p>
      </div>
      
      {/* Specifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.sku}</span>
              </li>
              {product.dimensions && (
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} ${product.dimensions.unit}`}
                  </span>
                </li>
              )}
              {product.weight && (
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {`${product.weight.value} ${product.weight.unit}`}
                  </span>
                </li>
              )}
            </ul>
          </div>
          
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span 
                    key={`tag-${index}`}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add to cart section */}
      {product.stock > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-4 text-gray-700 dark:text-gray-300 font-medium">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
              <button
                type="button"
                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center border-0 focus:ring-0 p-0 text-gray-900 dark:text-white bg-transparent"
              />
              <button
                type="button"
                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={() => onAddToCart && onAddToCart(product, quantity)}
            className="w-full md:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      )}
      
      {/* Additional information */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-1">
            <span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Last Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
