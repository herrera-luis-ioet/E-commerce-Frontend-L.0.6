import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PriceRangeFilter from '../components/PriceRangeFilter';
import { updateFilter } from '../../../store/slices/filterSlice';

// Mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('PriceRangeFilter', () => {
  let store: any;

  beforeEach(() => {
    // Initial state with no price filters
    store = mockStore({
      filter: {
        filters: {},
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    // Mock dispatch with Jest mock function
    store.dispatch = jest.fn().mockImplementation(() => {});
  });

  it('renders correctly with default props', () => {
    render(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min $')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max $')).toBeInTheDocument();
  });

  it('renders with custom label and currency symbol', () => {
    render(
      <Provider store={store}>
        <PriceRangeFilter label="Custom Price Range" currencySymbol="€" />
      </Provider>
    );
    
    expect(screen.getByText('Custom Price Range')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min €')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max €')).toBeInTheDocument();
  });

  it('displays existing filter values from store', () => {
    // Store with existing price filters
    store = mockStore({
      filter: {
        filters: {
          minPrice: 100,
          maxPrice: 500
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    // Mock dispatch with Jest mock function
    store.dispatch = jest.fn().mockImplementation(() => {});
    
    render(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    const minPriceInput = screen.getByLabelText('Minimum price') as HTMLInputElement;
    const maxPriceInput = screen.getByLabelText('Maximum price') as HTMLInputElement;
    
    expect(minPriceInput.value).toBe('100');
    expect(maxPriceInput.value).toBe('500');
  });

  it('updates min price on input change', async () => {
    // Use a longer debounce delay to ensure we can test the debounce behavior
    render(
      <Provider store={store}>
        <PriceRangeFilter debounceDelay={100} />
      </Provider>
    );
    
    const minPriceInput = screen.getByLabelText('Minimum price');
    
    // Change min price input
    fireEvent.change(minPriceInput, { target: { value: '200' } });
    
    // Input value should update immediately
    expect((minPriceInput as HTMLInputElement).value).toBe('200');
    
    // But dispatch should be debounced
    expect(store.dispatch).not.toHaveBeenCalled();
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateFilter({ key: 'minPrice', value: 200 })
      );
    }, { timeout: 200 });
  });

  it('updates max price on input change', async () => {
    render(
      <Provider store={store}>
        <PriceRangeFilter debounceDelay={100} />
      </Provider>
    );
    
    const maxPriceInput = screen.getByLabelText('Maximum price');
    
    // Change max price input
    fireEvent.change(maxPriceInput, { target: { value: '1000' } });
    
    // Input value should update immediately
    expect((maxPriceInput as HTMLInputElement).value).toBe('1000');
    
    // But dispatch should be debounced
    expect(store.dispatch).not.toHaveBeenCalled();
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateFilter({ key: 'maxPrice', value: 1000 })
      );
    }, { timeout: 200 });
  });

  it('clears min price when input is emptied', async () => {
    // Store with existing price filters
    store = mockStore({
      filter: {
        filters: {
          minPrice: 100,
          maxPrice: 500
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    // Mock dispatch with Jest mock function
    store.dispatch = jest.fn().mockImplementation(() => {});
    
    render(
      <Provider store={store}>
        <PriceRangeFilter debounceDelay={100} />
      </Provider>
    );
    
    const minPriceInput = screen.getByLabelText('Minimum price');
    
    // Clear min price input
    fireEvent.change(minPriceInput, { target: { value: '' } });
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateFilter({ key: 'minPrice', value: undefined })
      );
    }, { timeout: 200 });
  });

  it('clears max price when input is emptied', async () => {
    // Store with existing price filters
    store = mockStore({
      filter: {
        filters: {
          minPrice: 100,
          maxPrice: 500
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    // Mock dispatch with Jest mock function
    store.dispatch = jest.fn().mockImplementation(() => {});
    
    render(
      <Provider store={store}>
        <PriceRangeFilter debounceDelay={100} />
      </Provider>
    );
    
    const maxPriceInput = screen.getByLabelText('Maximum price');
    
    // Clear max price input
    fireEvent.change(maxPriceInput, { target: { value: '' } });
    
    // Wait for debounce to complete
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateFilter({ key: 'maxPrice', value: undefined })
      );
    }, { timeout: 200 });
  });

  it('only allows numeric input for min price', () => {
    render(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    const minPriceInput = screen.getByLabelText('Minimum price') as HTMLInputElement;
    
    // Try to enter non-numeric characters
    fireEvent.change(minPriceInput, { target: { value: 'abc' } });
    expect(minPriceInput.value).toBe('');
    
    // Try to enter valid numeric input
    fireEvent.change(minPriceInput, { target: { value: '123' } });
    expect(minPriceInput.value).toBe('123');
    
    // Try to enter decimal number
    fireEvent.change(minPriceInput, { target: { value: '123.45' } });
    expect(minPriceInput.value).toBe('123.45');
  });

  it('only allows numeric input for max price', () => {
    render(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    const maxPriceInput = screen.getByLabelText('Maximum price') as HTMLInputElement;
    
    // Try to enter non-numeric characters
    fireEvent.change(maxPriceInput, { target: { value: 'abc' } });
    expect(maxPriceInput.value).toBe('');
    
    // Try to enter valid numeric input
    fireEvent.change(maxPriceInput, { target: { value: '123' } });
    expect(maxPriceInput.value).toBe('123');
    
    // Try to enter decimal number
    fireEvent.change(maxPriceInput, { target: { value: '123.45' } });
    expect(maxPriceInput.value).toBe('123.45');
  });

  it('updates component when filter state changes', () => {
    const { rerender } = render(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    // Initial state - empty inputs
    const minPriceInput = screen.getByLabelText('Minimum price') as HTMLInputElement;
    const maxPriceInput = screen.getByLabelText('Maximum price') as HTMLInputElement;
    expect(minPriceInput.value).toBe('');
    expect(maxPriceInput.value).toBe('');
    
    // Update store with new filter values
    store = mockStore({
      filter: {
        filters: {
          minPrice: 200,
          maxPrice: 800
        },
        sortOption: 'newest',
        viewMode: 'grid',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: null
      }
    });
    
    // Re-render with new store
    rerender(
      <Provider store={store}>
        <PriceRangeFilter />
      </Provider>
    );
    
    // Inputs should reflect new store values
    expect(minPriceInput.value).toBe('200');
    expect(maxPriceInput.value).toBe('800');
  });
});
