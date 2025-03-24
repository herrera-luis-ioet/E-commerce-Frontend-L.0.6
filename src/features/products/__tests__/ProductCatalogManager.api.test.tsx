import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductCatalogManager from "../ProductCatalogManager";
import productReducer, { fetchProducts } from "../../../store/slices/productSlice";
import filterReducer, { updateFilter } from "../../../store/slices/filterSlice";
import productService from "../../../services/productService";
import { BrowserRouter } from "react-router-dom";

// Mock the product service
jest.mock("../../../services/productService");
const mockedProductService = productService as jest.Mocked<typeof productService>;

// Mock the formatters module
jest.mock("../../../utils/formatters", () => {
  const originalModule = jest.requireActual("../../../utils/formatters");
  return {
    ...originalModule,
    sortProducts: jest.fn((products, sortOption) => {
      // Return a copy of the products array to simulate sorting
      return [...products];
    }),
    applyClientSideFilters: jest.fn((products, filters) => {
      // Simulate client-side filtering based on price range
      if (!filters || (!filters.minPrice && !filters.maxPrice)) {
        return [...products];
      }
      
      return products.filter(product => {
        const price = product.price;
        if (price === undefined || price === null) {
          return false;
        }
        
        const isAboveMin = filters.minPrice === undefined || price >= filters.minPrice;
        const isBelowMax = filters.maxPrice === undefined || price <= filters.maxPrice;
        
        return isAboveMin && isBelowMax;
      });
    }),
    formatPrice: originalModule.formatPrice,
    formatPercentage: originalModule.formatPercentage
  };
});

// Mock the components that are not relevant for this test
jest.mock("../components/ProductGrid", () => ({
  __esModule: true,
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-grid">
      {products.map(product => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          {product.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../components/ProductList", () => ({
  __esModule: true,
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-list">
      {products.map(product => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          {product.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../filters/components/FilterPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="filter-panel">Filter Panel</div>,
}));

jest.mock("../../filters/components/SearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar">Search Bar</div>,
}));

jest.mock("../../filters/components/SortOptions", () => ({
  __esModule: true,
  default: () => <div data-testid="sort-options">Sort Options</div>,
}));

jest.mock("../../../components/ui/Pagination", () => ({
  __esModule: true,
  default: () => <div data-testid="pagination">Pagination</div>,
}));

jest.mock("../../../components/ui/Spinner", () => ({
  __esModule: true,
  default: () => <div data-testid="spinner">Loading...</div>,
}));

// Sample product data
const mockProducts = [
  {
    id: "1",
    name: "Test Product 1",
    description: "This is test product 1",
    price: 99.99,
    images: ["image1.jpg"],
    mainImage: "main-image1.jpg",
    categoryId: "cat1",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Test Product 2",
    description: "This is test product 2",
    price: 149.99,
    images: ["image2.jpg"],
    mainImage: "main-image2.jpg",
    categoryId: "cat2",
    category: "Clothing"
  }
];

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      filter: filterReducer
    }
  });
};

describe("ProductCatalogManager API Call Tests", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a fresh store for each test
    store = createMockStore();
    
    // Mock the API response
    mockedProductService.getProducts.mockResolvedValue({
      success: true,
      statusCode: 200,
      data: mockProducts,
      message: "Products retrieved successfully"
    });
  });

  test("should not trigger API calls when price range filters change", async () => {
    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Wait for the initial API call to complete
    await waitFor(() => {
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    // Verify that the API was called once during initial load
    expect(mockedProductService.getProducts).toHaveBeenCalledTimes(1);

    // Reset the mock to verify no additional API calls are made when price filters change
    mockedProductService.getProducts.mockClear();

    // Wait a bit to ensure any potential API calls would have been triggered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reset the mock to verify no additional API calls are made when price filters change
    mockedProductService.getProducts.mockClear();
    
    // Dispatch a price filter change (minPrice)
    await act(async () => {
      store.dispatch(updateFilter({ key: "minPrice", value: 100 }));
    });
    
    // Wait a bit to ensure any potential API calls would have been triggered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that no API calls were made after changing minPrice
    expect(mockedProductService.getProducts).not.toHaveBeenCalled();

    // Dispatch another price filter change (maxPrice)
    await act(async () => {
      store.dispatch(updateFilter({ key: "maxPrice", value: 200 }));
    });
    
    // Wait a bit to ensure any potential API calls would have been triggered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that no API calls were made after changing maxPrice
    expect(mockedProductService.getProducts).not.toHaveBeenCalled();

    // Dispatch a price filter change to reset filters
    await act(async () => {
      store.dispatch(updateFilter({ key: "minPrice", value: undefined }));
      store.dispatch(updateFilter({ key: "maxPrice", value: undefined }));
    });
    
    // Wait a bit to ensure any potential API calls would have been triggered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that no API calls were made after resetting price filters
    expect(mockedProductService.getProducts).not.toHaveBeenCalled();
  });

  test("should trigger API calls when non-price filters change", async () => {
    // Render the component
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCatalogManager />
        </BrowserRouter>
      </Provider>
    );

    // Wait for the initial API call to complete
    await waitFor(() => {
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    // Verify that the API was called once during initial load
    expect(mockedProductService.getProducts).toHaveBeenCalledTimes(1);

    // Reset the mock to verify additional API calls are made when non-price filters change
    mockedProductService.getProducts.mockClear();

    // Dispatch a non-price filter change (e.g., brand)
    await act(async () => {
      store.dispatch(updateFilter({ key: "brand", value: "Test Brand" }));
    });

    // Verify that an API call was made after changing a non-price filter
    expect(mockedProductService.getProducts).toHaveBeenCalledTimes(1);
  });
});
