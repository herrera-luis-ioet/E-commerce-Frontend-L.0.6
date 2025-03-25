import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../store/hooks';

// Layout component with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalItems } = useCart();
  
  return (
    <>
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">E-Commerce Platform</h1>
          <nav>
            <ul className="flex space-x-4 items-center">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li>
                <Link to="/cart" className="hover:underline flex items-center">
                  <span className="mr-1">Cart</span>
                  {totalItems > 0 && (
                    <span className="bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    <main className="container mx-auto py-6 flex-grow">
      {children}
    </main>
    <footer className="bg-secondary text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
      </div>
    </footer>
  </>
);

// Lazy-loaded page components
const Home = lazy(() => import('../pages/Home'));
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <Spinner size="lg" />
  </div>
);

/**
 * PUBLIC_INTERFACE
 * AppRoutes component that defines all application routes
 * Uses lazy loading for better performance with code splitting
 */
const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />
          
          {/* Product listing page */}
          <Route path="/products" element={<ProductListingPage />} />
          
          {/* Product detail page with product ID parameter */}
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          
          {/* Category page with category ID parameter */}
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          
          {/* Cart page */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* 404 page */}
          <Route path="/404" element={<NotFoundPage />} />
          
          {/* Redirect all other routes to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;
