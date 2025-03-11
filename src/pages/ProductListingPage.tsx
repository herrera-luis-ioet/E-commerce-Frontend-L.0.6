import React from 'react';
import ProductCatalogManager from '../features/products/ProductCatalogManager';
import { Helmet } from 'react-helmet-async';

/**
 * PUBLIC_INTERFACE
 * ProductListingPage component
 * 
 * Displays a complete product catalog with filtering, sorting, and pagination capabilities
 * using the ProductCatalogManager component
 */
const ProductListingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>All Products | E-Commerce Platform</title>
        <meta name="description" content="Browse our complete catalog of products with advanced filtering and sorting options." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse our complete catalog of products with advanced filtering and sorting options.
          </p>
        </div>
        
        <ProductCatalogManager />
      </div>
    </>
  );
};

export default ProductListingPage;