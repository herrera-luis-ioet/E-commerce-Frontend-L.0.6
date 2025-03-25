import React, { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductDetail from '../features/products/components/ProductDetail';
import { Product } from '../types/product.types';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

/**
 * PUBLIC_INTERFACE
 * ProductDetailPage component
 * 
 * Displays detailed information about a specific product
 * Uses the ProductDetail component with the productId from URL parameters
 */
const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Handle adding product to cart
  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    // Dispatch the addToCart action
    dispatch(addToCart({ product, quantity }));
    
    // Show feedback
    setAddedToCart(true);
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
    
    // Optional: Show a visual feedback in the UI
    console.log(`Added ${quantity} of ${product.name} to cart`);
  }, [dispatch]);
  
  // Handle viewing details of a related product
  const handleViewDetails = useCallback((product: Product) => {
    navigate(`/products/${product.id}`);
  }, [navigate]);
  
  // If productId is missing, show an error
  if (!productId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2">Product ID is missing. Please go back to the product catalog.</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Product Details | E-Commerce Platform</title>
        <meta name="description" content="View detailed product information, specifications, and related products." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <ProductDetail 
          productId={productId}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          className="py-4"
        />
      </div>
    </>
  );
};

export default ProductDetailPage;
