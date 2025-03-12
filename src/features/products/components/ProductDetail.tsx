import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../../../types/product.types';
import { fetchProductById, fetchProducts } from '../../../store/slices/productSlice';
import { AppDispatch } from '../../../store';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  
  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Fetch product details
  useEffect(() => {
    const getProductDetails = async () => {
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
  }, [dispatch, productId]);

  // Fetch related products based on category
  useEffect(() => {
    const getRelatedProducts = async () => {
      if (!product) return;
      
      setRelatedLoading(true);
      setRelatedError(null);
      
      try {
        // Fetch products from the same category
        const resultAction = await dispatch(fetchProducts({
          filter: { categoryId: product.categoryId },
          limit: 10
        }));
        
        if (fetchProducts.fulfilled.match(resultAction)) {
          setRelatedProducts(resultAction.payload.products);
        } else {
          setRelatedError('Failed to fetch related products');
        }
      } catch (err) {
        setRelatedError('An error occurred while fetching related products');
        console.error('Error fetching related products:', err);
      } finally {
        setRelatedLoading(false);
      }
    };
    
    if (product) {
      getRelatedProducts();
    }
  }, [dispatch, product]);

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
      <RelatedProducts
        currentProductId={product.id}
        products={relatedProducts}
        isLoading={relatedLoading}
        error={relatedError || null}
        onViewDetails={onViewDetails}
        onAddToCart={(product) => onAddToCart && onAddToCart(product, 1)}
        className="mt-8"
      />
    </div>
  );
};

export default ProductDetail;
