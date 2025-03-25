import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../../../types/product.types';
import { fetchProductById } from '../../../store/slices/productSlice';
import { AppDispatch } from '../../../store';
import { useAppSelector, useProducts } from '../../../store/hooks';
import { filterProductsBySearchQuery } from '../../../utils/formatters';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';
import Input from '../../../components/ui/Input';

/**
 * ProductDetail component props
 */
export interface ProductDetailProps {
  /** Product ID to display */
  productId: string;
  /** Handler for add to cart action */
  onAddToCart?: (product: Product, quantity: number) => void;
  /** Handler for view details action for related products */
  onViewDetails?: (product: Product) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * ProductDetail component for displaying comprehensive product information
 */
const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onAddToCart,
  onViewDetails,
  className = '',
}) => {
  // Local state
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  
  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const allProducts = useProducts();
  const storeProduct = useAppSelector(state => {
    // Safely access the products array with null checks
    const products = state.products?.products || [];
    return products.find(p => p.id === productId) || state.products?.selectedProduct || null;
  });

  // Fetch product details - use store product if available, otherwise fetch from API
  useEffect(() => {
    const getProductDetails = async () => {
      // If product is already in Redux store, use it
      if (storeProduct && storeProduct.id === productId) {
        setProduct(storeProduct);
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      setLoading(true);
      setError(null);
      
      try {
        const resultAction = await dispatch(fetchProductById(productId));
        if (fetchProductById.fulfilled.match(resultAction)) {
          setProduct(resultAction.payload);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (err) {
        setError('An error occurred while fetching product details');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      getProductDetails();
    }
  }, [dispatch, productId, storeProduct]);

  // Get related products from Redux store based on category
  useEffect(() => {
    if (!product) return;
    
    setRelatedLoading(true);
    setRelatedError(null);
    
    try {
      // Filter products from the same category from Redux store
      const sameCategoryProducts = allProducts.filter(p => 
        p.categoryId === product.categoryId && p.id !== product.id
      );
      
      if (sameCategoryProducts.length > 0) {
        setRelatedProducts(sameCategoryProducts);
      } else {
        // If no related products found, show message
        setRelatedError('No related products found');
      }
    } catch (err) {
      setRelatedError('An error occurred while filtering related products');
      console.error('Error filtering related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  }, [product, allProducts]);
  
  // Filter related products based on search query
  useEffect(() => {
    if (relatedProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    // Apply search filter to related products
    const filtered = filterProductsBySearchQuery(relatedProducts, searchQuery);
    setFilteredProducts(filtered);
  }, [relatedProducts, searchQuery]);
  
  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className={`w-full flex justify-center items-center py-16 ${className}`}>
        <Spinner size="xl" centered />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className={`${className}`}>
        <div className="text-center text-error py-8">
          <p className="text-lg font-semibold">Error Loading Product</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  // Handle no product data
  if (!product) {
    return (
      <Card className={`${className}`}>
        <div className="text-center text-gray-500 py-8">
          <p>Product not found</p>
        </div>
      </Card>
    );
  }

  // Handle add to cart with quantity
  const handleAddToCart = (product: Product, quantity: number) => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="hover:text-primary">Home</a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="/products" className="hover:text-primary">Products</a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href={`/categories/${product.categoryId}`} className="hover:text-primary">{product.category}</a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 dark:text-white font-medium truncate">
            {product.name}
          </li>
        </ol>
      </nav>
      
      {/* Product details section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product gallery */}
        <ProductGallery product={product} />
        
        {/* Product information */}
        <ProductInfo 
          product={product} 
          onAddToCart={handleAddToCart}
        />
      </div>
      
      {/* Related products section */}
      <div className="space-y-4">
        {/* Search input for related products */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search related products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-xs"
            aria-label="Search related products"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <RelatedProducts
          currentProductId={product.id}
          products={filteredProducts}
          isLoading={relatedLoading}
          error={relatedError || null}
          onViewDetails={onViewDetails}
          onAddToCart={(product) => onAddToCart && onAddToCart(product, 1)}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default ProductDetail;
