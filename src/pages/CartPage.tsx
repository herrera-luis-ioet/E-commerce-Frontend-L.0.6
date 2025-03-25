import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../store/hooks';
import CartItem from '../features/cart/components/CartItem';
import CartSummary from '../features/cart/components/CartSummary';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * CartPage component
 * 
 * Displays the user's shopping cart with items, quantities, and totals.
 * Allows users to update quantities, remove items, and proceed to checkout.
 */
const CartPage: React.FC = () => {
  const { items, totalItems, loading } = useCart();
  
  // Empty cart view
  if (!loading && items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart | E-Commerce Platform</title>
          <meta name="description" content="View and manage items in your shopping cart." />
        </Helmet>
        
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                className="mt-6"
              >
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Your Cart (${totalItems} items) | E-Commerce Platform`}</title>
        <meta name="description" content="View and manage items in your shopping cart." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review and manage your items before checkout.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items - takes up 2/3 of the space on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Cart header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      Cart Items ({totalItems})
                    </h2>
                  </div>
                </div>
                
                {/* Cart items list */}
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.product.id} className="px-6">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
                
                {/* Continue shopping link */}
                <div className="px-6 py-4 bg-gray-50">
                  <Link to="/products" className="text-primary hover:text-primary-dark flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Cart summary - takes up 1/3 of the space on large screens */}
            <div>
              <CartSummary showCheckoutButton={true} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
