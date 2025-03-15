/**
 * Product slice for Redux state management
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Product, 
  Category, 
  ProductState, 
  SortOption, 
  ProductFilter,
  ProductView
} from '../../types/product.types';
import productService from '../../services/productService';
// No need to import transformProductFromBackend as it's handled by ProductService

/**
 * Initial state for the product slice
 */
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  categories: [],
  selectedCategory: null,
  filters: {},
  sortOption: SortOption.NEWEST,
  viewMode: 'grid',
  currentPage: 1,
  itemsPerPage: 12,
  totalProducts: 0,
  totalPages: 0,
  loading: false,
  error: null,
  initialized: false
};

/**
 * Async thunk for fetching products
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ 
    filter, 
    page = 1, 
    limit = 12, 
    sort = SortOption.NEWEST 
  }: { 
    filter?: ProductFilter; 
    page?: number; 
    limit?: number; 
    sort?: SortOption;
  }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filter, { page, limit, sort });
      
      return {
        products: response.data,
        totalProducts: response.meta.total,
        totalPages: response.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

/**
 * Async thunk for fetching a product by ID
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data; // Data is already transformed by ProductService
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }
);

/**
 * Async thunk for fetching categories
 */
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      // Categories don't need transformation as they're already in the correct format
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

/**
 * Async thunk for fetching products by category
 */
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ 
    categoryId, 
    filter, 
    page = 1, 
    limit = 12, 
    sort = SortOption.NEWEST 
  }: { 
    categoryId: string; 
    filter?: Omit<ProductFilter, 'categoryId'>; 
    page?: number; 
    limit?: number; 
    sort?: SortOption;
  }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, filter, { page, limit, sort });
      
      return {
        products: response.data,
        totalProducts: response.meta.total,
        totalPages: response.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products by category');
    }
  }
);

/**
 * Async thunk for fetching featured products
 */
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async ({ 
    page = 1, 
    limit = 12, 
    sort = SortOption.NEWEST 
  }: { 
    page?: number; 
    limit?: number; 
    sort?: SortOption;
  }, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts({ page, limit, sort });
      
      return {
        products: response.data,
        totalProducts: response.meta.total,
        totalPages: response.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured products');
    }
  }
);

/**
 * Async thunk for searching products
 */
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ 
    query, 
    filter, 
    page = 1, 
    limit = 12, 
    sort = SortOption.NEWEST 
  }: { 
    query: string; 
    filter?: Omit<ProductFilter, 'searchQuery'>; 
    page?: number; 
    limit?: number; 
    sort?: SortOption;
  }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query, filter, { page, limit, sort });
      
      return {
        products: response.data,
        totalProducts: response.meta.total,
        totalPages: response.meta.totalPages
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search products');
    }
  }
);

/**
 * Product slice definition
 */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Select a product
     */
    selectProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    
    /**
     * Select a category
     */
    selectCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    
    /**
     * Set view mode (grid or list)
     */
    setViewMode: (state, action: PayloadAction<ProductView>) => {
      state.viewMode = action.payload;
    },
    
    /**
     * Reset product state
     */
    resetProductState: () => initialState
  },
  extraReducers: (builder) => {
    // Handle fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.initialized = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch products';
      });

    // Handle fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch product';
      });

    // Handle fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch categories';
      });

    // Handle fetchProductsByCategory
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch products by category';
      });

    // Handle fetchFeaturedProducts
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch featured products';
      });

    // Handle searchProducts
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to search products';
      });
  }
});

// Export actions
export const { 
  selectProduct, 
  selectCategory, 
  setViewMode, 
  resetProductState 
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;
