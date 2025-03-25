import React from 'react';
import { useCart } from '../../../store/hooks';
import { formatPrice } from '../../../utils/formatters';
import Button from '../../../components/ui/Button';

/**
 * CartSummary component props
 */
export interface CartSummaryProps {
  /** Whether to show compact view */
  compact?: boolean;
  /** Whether to show checkout button */
  showCheckoutButton?: boolean;
  /** Handler for checkout button click */
  onCheckout?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * CartSummary component for displaying cart totals
 */
const CartSummary: React.FC<CartSummaryProps> = ({
  compact = false,
  showCheckoutButton = true,
  onCheckout,
  className = '',
}) => {
  const { items, totalItems, totalPrice } = useCart();
  
  // Calculate subtotal (before any discounts)
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  
  // Calculate discount amount
  const discountAmount = subtotal - totalPrice;
  
  // Determine if there are any discounts
  const hasDiscount = discountAmount > 0;

  // Handle checkout button click
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      // Default checkout behavior if no handler provided
      console.log('Checkout clicked');
      // Could navigate to checkout page here
    }
  };

  // Compact view for dropdown
  if (compact) {
    return (
      <div className={`py-3 ${className}`}>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal ({totalItems} items):</span>
          <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
        
        {showCheckoutButton && (
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth 
            onClick={handleCheckout}
            className="mt-2"
          >
            Proceed to Checkout
          </Button>
        )}
      </div>
    );
  }

  // Full view for cart page
  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {/* Items count */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({totalItems}):</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        
        {/* Discount if applicable */}
        {hasDiscount && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount:</span>
            <span className="text-green-600">-{formatPrice(discountAmount)}</span>
          </div>
        )}
        
        {/* Shipping - placeholder for future implementation */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-gray-900">Free</span>
        </div>
        
        {/* Tax - placeholder for future implementation */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated tax:</span>
          <span className="text-gray-900">Calculated at checkout</span>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-2 py-2"></div>
        
        {/* Total */}
        <div className="flex justify-between">
          <span className="text-base font-medium text-gray-900">Total:</span>
          <span className="text-base font-medium text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
      </div>
      
      {/* Checkout button */}
      {showCheckoutButton && (
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={handleCheckout}
          className="mt-6"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
