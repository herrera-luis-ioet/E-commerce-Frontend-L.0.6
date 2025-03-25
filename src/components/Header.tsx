import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAppDispatch } from '../store/hooks';
import { toggleCart, setCartOpen } from '../store/slices/cartSlice';
import CartDropdown from '../features/cart/components/CartDropdown';

/**
 * Header component props
 */
export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * Header component with navigation and cart functionality
 */
const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { totalItems, isOpen } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartIconRef = useRef<HTMLDivElement>(null);

  // Toggle cart dropdown
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleCart());
  };

  // Handle view cart button click
  const handleViewCart = () => {
    navigate('/cart');
  };

  // Handle checkout button click
  const handleCheckout = () => {
    navigate('/cart'); // Navigate to cart page for now, could be checkout page in the future
  };

  return (
    <header className={`bg-primary text-white p-4 shadow-md ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">E-Commerce Platform</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/products" className="hover:underline">Products</Link></li>
            <li className="relative">
              <div ref={cartIconRef} className="relative">
                <button 
                  onClick={handleCartClick}
                  className="flex items-center hover:underline focus:outline-none"
                  aria-label="Cart"
                  aria-expanded={isOpen}
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                {isOpen && (
                  <CartDropdown 
                    onViewCart={handleViewCart} 
                    onCheckout={handleCheckout} 
                  />
                )}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;