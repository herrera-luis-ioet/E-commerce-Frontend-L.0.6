import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for order state
export const useOrders = () => useAppSelector((state) => state.orders.orders);
export const useSelectedOrder = () => useAppSelector((state) => state.orders.selectedOrder);
export const useOrderLoading = () => useAppSelector((state) => state.orders.loading);
export const useOrderError = () => useAppSelector((state) => state.orders.error);
export const useOrderInitialized = () => useAppSelector((state) => state.orders.initialized);
export const useTotalOrders = () => useAppSelector((state) => state.orders.totalOrders);
export const useOrderTotalPages = () => useAppSelector((state) => state.orders.totalPages);
export const useOrderCurrentPage = () => useAppSelector((state) => state.orders.currentPage);
export const useOrderItemsPerPage = () => useAppSelector((state) => state.orders.itemsPerPage);

// Custom hooks for product state
export const useProducts = () => useAppSelector((state) => state.products.products);
export const useSelectedProduct = () => useAppSelector((state) => state.products.selectedProduct);
export const useCategories = () => useAppSelector((state) => state.products.categories);
export const useSelectedCategory = () => useAppSelector((state) => state.products.selectedCategory);
export const useProductLoading = () => useAppSelector((state) => state.products.loading);
export const useProductError = () => useAppSelector((state) => state.products.error);
export const useProductInitialized = () => useAppSelector((state) => state.products.initialized);
export const useTotalProducts = () => useAppSelector((state) => state.products.totalProducts);
export const useTotalPages = () => useAppSelector((state) => state.products.totalPages);

// Custom hooks for filter state
export const useFilters = () => useAppSelector((state) => state.filter.filters);
export const useSortOption = () => useAppSelector((state) => state.filter.sortOption);
export const useViewMode = () => useAppSelector((state) => state.filter.viewMode);
export const useSearchQuery = () => useAppSelector((state) => state.filter.searchQuery);
export const useCurrentPage = () => useAppSelector((state) => state.filter.currentPage);
export const useItemsPerPage = () => useAppSelector((state) => state.filter.itemsPerPage);

// Combined hooks for common use cases
export const useProductCatalog = () => {
  const products = useProducts();
  const loading = useProductLoading();
  const error = useProductError();
  const totalProducts = useTotalProducts();
  const totalPages = useTotalPages();
  const currentPage = useCurrentPage();
  const itemsPerPage = useItemsPerPage();
  const sortOption = useSortOption();
  const viewMode = useViewMode();
  
  return {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    currentPage,
    itemsPerPage,
    sortOption,
    viewMode
  };
};

export const useProductFiltering = () => {
  const filters = useFilters();
  const searchQuery = useSearchQuery();
  const categories = useCategories();
  const selectedCategory = useSelectedCategory();
  
  return {
    filters,
    searchQuery,
    categories,
    selectedCategory
  };
};

// Combined hook for order management
export const useOrderManagement = () => {
  const orders = useOrders();
  const selectedOrder = useSelectedOrder();
  const loading = useOrderLoading();
  const error = useOrderError();
  const totalOrders = useTotalOrders();
  const totalPages = useOrderTotalPages();
  const currentPage = useOrderCurrentPage();
  const itemsPerPage = useOrderItemsPerPage();
  
  return {
    orders,
    selectedOrder,
    loading,
    error,
    totalOrders,
    totalPages,
    currentPage,
    itemsPerPage
  };
};
