import React, { useRef, useEffect } from 'react';
import { useCart, useAppDispatch } from '../../../store/hooks';
import { setCartOpen } from '../../../store/slices/cartSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from '../../../components/ui/Button';

/**
 * CartDropdown component props
 */
export interface CartDropdownProps {
  /** Handler for view cart button click */
  onViewCart?: () => void;
  /** Handler for checkout button click */
  onCheckout?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * CartDropdown component for displaying a mini-cart in the header
 */
const CartDropdown: React.FC<CartDropdownProps> = ({
  onViewCart,
  onCheckout,
  className = '',
}) => {
  const { items, totalItems, isOpen } = useCart();
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dispatch(setCartOpen(false));
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);

  // Close dropdown handler
  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  // View cart handler
  const handleViewCart = () => {
    handleClose();
    if (onViewCart) {
      onViewCart();
    }
  };

  // Checkout handler
  const handleCheckout = () => {
    handleClose();
    if (onCheckout) {
      onCheckout();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg z-50 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Your Cart ({totalItems})</h3>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="mt-4 text-gray-500">Your cart is empty</p>
          <Button 
            variant="primary" 
            size="sm" 
            className="mt-4"
            onClick={handleClose}
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="max-h-80 overflow-y-auto p-4">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem 
                  key={item.product.id} 
                  item={item} 
                  compact 
                />
              ))}
            </div>
          </div>

          {/* Cart summary */}
          <div className="border-t border-gray-200 p-4">
            <CartSummary compact showCheckoutButton={false} />
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewCart}
              >
                View Cart
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
