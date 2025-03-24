import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import {
  useProductCatalog,
  useProductFiltering
} from '../../store/hooks';
import { fetchProducts } from '../../store/slices/productSlice';
import { setViewMode, setCurrentPage } from '../../store/slices/filterSlice';
import { ProductView, Product } from '../../types/product.types';
import { sortProducts, applyClientSideFilters } from '../../utils/formatters';

// Components
import ProductGrid from './components/ProductGrid';
import ProductList from './components/ProductList';
import FilterPanel from '../filters/components/FilterPanel';
import SearchBar from '../filters/components/SearchBar';
import SortOptions from '../filters/components/SortOptions';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';

/**
 * PUBLIC_INTERFACE
 * ProductCatalogManager component serves as the main entry point for the product catalog functionality.
 * It integrates product listing, filtering, search, sorting, and pagination components.
 * 
 * Features:
 * - Toggle between grid and list views
 * - Filter products by various criteria
 * - Search products
 * - Sort products
 * - Paginate through product results
 * - Responsive design for all device sizes
 * - Loading, error, and empty state handling
 */
const ProductCatalogManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get product catalog data from Redux store
  const {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    currentPage,
    itemsPerPage,
    sortOption,
    viewMode
  } = useProductCatalog();
  
  // Get filtering data from Redux store
  const { filters, searchQuery, selectedCategory } = useProductFiltering();
  
  // Local state for mobile filter visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Create a version of filters without price range filters (which are handled client-side)
  // This prevents unnecessary API calls when only price range filters change
  // Price range filtering is applied client-side in the filteredAndSortedProducts useMemo hook
  const serverSideFilters = useMemo(() => {
    const { minPrice, maxPrice, ...otherFilters } = filters;
    return otherFilters;
  }, [filters]);

  // Fetch products when component mounts or when server-side filters/pagination changes
  // Note: We use serverSideFilters in the dependency array to ensure that changes to price range filters
  // (which are handled client-side) don't trigger unnecessary API calls
  useEffect(() => {
    dispatch(fetchProducts({
      filter: serverSideFilters, // Use server-side filters that exclude price range
      page: currentPage,
      limit: itemsPerPage
    }));
  }, [dispatch, serverSideFilters, currentPage, itemsPerPage, searchQuery, selectedCategory]);

  // Handle view mode toggle
  const handleViewModeToggle = useCallback((mode: ProductView) => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);
  
  // Handle view details action
  const handleViewDetails = useCallback((product: Product) => {
    navigate(`/products/${product.id}`);
  }, [navigate]);

  // Toggle mobile filters visibility
  const toggleMobileFilters = useCallback(() => {
    setMobileFiltersOpen(prev => !prev);
  }, []);

  // Apply client-side filtering and sorting to products
  // This is where price range filtering is applied, after products are fetched from the server
  const filteredAndSortedProducts = useMemo(() => {
    // First apply client-side filters (price range)
    // Make sure products is an array before spreading
    const productsArray = Array.isArray(products) ? products : [];
    const filteredProducts = applyClientSideFilters([...productsArray], filters);
    // Then apply sorting
    return sortProducts(filteredProducts, sortOption);
  }, [products, filters, sortOption]);

  // Calculate safe values for totalProducts and totalPages to handle cases where they might be undefined
  // For client-side filtering, we need to use the length of the filtered products array
  const safeTotalProducts = useMemo(() => {
    return filteredAndSortedProducts ? filteredAndSortedProducts.length : 0;
  }, [filteredAndSortedProducts]);

  const safeTotalPages = useMemo(() => {
    const productsLength = filteredAndSortedProducts ? filteredAndSortedProducts.length : 0;
    return Math.max(1, Math.ceil(productsLength / itemsPerPage));
  }, [filteredAndSortedProducts, itemsPerPage]);

  // Memoize the product display component to prevent unnecessary re-renders
  const ProductDisplay = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'An error occurred'}</span>
        </div>
      );
    }

    if (!filteredAndSortedProducts || filteredAndSortedProducts.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      );
    }

    return viewMode === 'grid' ? (
      <ProductGrid 
        products={filteredAndSortedProducts} 
        isLoading={loading} 
        error={error || undefined} 
        onViewDetails={handleViewDetails}
      />
    ) : (
      <ProductList 
        products={filteredAndSortedProducts} 
        isLoading={loading} 
        error={error || undefined} 
        showActions={true} 
        onViewDetails={handleViewDetails}
      />
    );
  }, [filteredAndSortedProducts, loading, error, viewMode, handleViewDetails]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <div className={`fixed inset-0 flex z-40 lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={toggleMobileFilters}></div>
          
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                onClick={toggleMobileFilters}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile filters */}
            <div className="mt-4 px-4">
              <FilterPanel />
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {selectedCategory ? selectedCategory.name : 'All Products'}
            </h1>

            <div className="flex items-center">
              <SearchBar className="mr-4 hidden md:block" />
              <SortOptions className="hidden sm:block" />
              
              <div className="ml-4 flex items-center">
                <button
                  type="button"
                  className={`p-2 text-gray-400 hover:text-gray-500 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : ''}`}
                  onClick={() => handleViewModeToggle('grid')}
                >
                  <span className="sr-only">Grid view</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className={`ml-2 p-2 text-gray-400 hover:text-gray-500 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : ''}`}
                  onClick={() => handleViewModeToggle('list')}
                >
                  <span className="sr-only">List view</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>

              <button
                type="button"
                className="ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
                onClick={toggleMobileFilters}
              >
                <span className="sr-only">Filters</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="md:flex md:gap-x-8 md:gap-y-10 lg:gap-x-12">
            {/* Filters - Desktop */}
            <div className="hidden lg:block w-64 flex-none">
              <div className="sticky top-6">
                <FilterPanel />
              </div>
            </div>

            {/* Product grid/list */}
            <div className="mt-6 lg:mt-0 lg:flex-auto">
              {/* Mobile search bar */}
              <div className="mb-4 md:hidden">
                <SearchBar />
              </div>
              
              {/* Mobile sort options */}
              <div className="mb-4 sm:hidden">
                <SortOptions />
              </div>
              
              {/* Product count */}
              <div className="mb-4 text-sm text-gray-500">
                {safeTotalProducts} {safeTotalProducts === 1 ? 'product' : 'products'}
              </div>
              
              {/* Product display */}
              {ProductDisplay}
              
              {/* Pagination */}
              {safeTotalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={safeTotalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductCatalogManager;
