import React from 'react';
import { CartItem as CartItemType } from '../../../types/cart.types';
import { formatPrice } from '../../../utils/formatters';
import { useAppDispatch } from '../../../store/hooks';
import { updateCartItemQuantity, removeFromCart } from '../../../store/slices/cartSlice';

/**
 * CartItem component props
 */
export interface CartItemProps {
  /** Cart item data */
  item: CartItemType;
  /** Whether to show full details or compact view */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * CartItem component for displaying individual cart items
 */
const CartItem: React.FC<CartItemProps> = ({
  item,
  compact = false,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { product, quantity, price, finalPrice, hasDiscount } = item;

  /**
   * Handle quantity increment
   */
  const handleIncrement = () => {
    dispatch(updateCartItemQuantity({
      productId: product.id,
      quantity: quantity + 1
    }));
  };

  /**
   * Handle quantity decrement
   */
  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateCartItemQuantity({
        productId: product.id,
        quantity: quantity - 1
      }));
    } else {
      handleRemove();
    }
  };

  /**
   * Handle item removal
   */
  const handleRemove = () => {
    dispatch(removeFromCart({ productId: product.id }));
  };

  // Compact view for dropdown
  if (compact) {
    return (
      <div className={`flex items-center py-2 ${className}`}>
        {/* Product image */}
        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-3">
          <img 
            src={product.mainImage} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
            }}
          />
        </div>
        
        {/* Product info */}
        <div className="flex-grow min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">{quantity} ×</span>
            {hasDiscount ? (
              <>
                <span className="text-sm font-medium text-primary">{formatPrice(product.discountPrice || 0)}</span>
                <span className="text-xs text-gray-500 line-through ml-1">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        
        {/* Remove button */}
        <button 
          onClick={handleRemove}
          className="ml-2 text-gray-400 hover:text-error focus:outline-none"
          aria-label="Remove item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  // Full view for cart page
  return (
    <div className={`flex items-center py-4 border-b border-gray-200 ${className}`}>
      {/* Product image */}
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden mr-4">
        <img 
          src={product.mainImage} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=No+Image';
          }}
        />
      </div>
      
      {/* Product info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
        
        <div className="flex items-center mt-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-medium text-primary">{formatPrice(product.discountPrice || 0)}</span>
              <span className="text-xs text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center mr-6">
        <button 
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Decrease quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        
        <span className="mx-3 w-8 text-center">{quantity}</span>
        
        <button 
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Increase quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Subtotal */}
      <div className="w-24 text-right">
        <span className="font-medium text-gray-900">{formatPrice(finalPrice)}</span>
      </div>
      
      {/* Remove button */}
      <button 
        onClick={handleRemove}
        className="ml-4 text-gray-400 hover:text-error focus:outline-none"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
