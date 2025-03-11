import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCatalogManager from '../features/products/ProductCatalogManager';
import { useAppDispatch } from '../store/hooks';
import { setSelectedCategory } from '../store/slices/filterSlice';

/**
 * PUBLIC_INTERFACE
 * CategoryPage component
 * 
 * Displays products filtered by a specific category
 * Uses the ProductCatalogManager component with pre-applied category filtering
 */
const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useAppDispatch();
  
  // Set the selected category when the component mounts or categoryId changes
  useEffect(() => {
    if (categoryId) {
      dispatch(setSelectedCategory(categoryId));
    }
    
    // Clean up when component unmounts
    return () => {
      // Reset category filter when leaving the page
      dispatch(setSelectedCategory(null));
    };
  }, [categoryId, dispatch]);
  
  return (
    <>
      <Helmet>
        <title>Category Products | E-Commerce Platform</title>
        <meta name="description" content="Browse products in this category with advanced filtering and sorting options." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Category Products</h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse products in this category with advanced filtering and sorting options.
          </p>
        </div>
        
        <ProductCatalogManager />
      </div>
    </>
  );
};

export default CategoryPage;