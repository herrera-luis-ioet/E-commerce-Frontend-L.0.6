import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import Header from '../components/Header';

// Layout component with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
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
