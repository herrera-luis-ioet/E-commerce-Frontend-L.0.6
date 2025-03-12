import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';
import { setSearchQuery } from '../../../store/slices/filterSlice';

// Mock Redux hooks
jest.mock('../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useSearchQuery: jest.fn()
}));

// Mock Input component
jest.mock('../../../components/ui/Input', () => {
  return ({ 
    value, 
    onChange, 
    placeholder, 
    startAdornment, 
    endAdornment,
    'data-testid': dataTestId
  }: any) => (
    <div data-testid="input-container">
      {startAdornment && <div data-testid="start-adornment">{startAdornment}</div>}
      <input
        data-testid={dataTestId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {endAdornment && <div data-testid="end-adornment">{endAdornment}</div>}
    </div>
  );
});

// Import the mocked hooks
import { useAppDispatch, useSearchQuery } from '../../../store/hooks';

describe('SearchBar Component', () => {
  // Setup mock functions
  const mockDispatch = jest.fn();
  const mockUseSearchQuery = useSearchQuery as jest.Mock;
  const mockUseAppDispatch = useAppDispatch as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch.mockClear();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseSearchQuery.mockReturnValue('');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Test rendering
  test('renders search input with correct placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search products...');
  });

  // Test custom placeholder
  test('renders with custom placeholder when provided', () => {
    render(<SearchBar placeholder="Find items..." />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('placeholder', 'Find items...');
  });

  // Test input change with debounce
  test('updates input value and dispatches action after debounce delay', () => {
    render(<SearchBar debounceDelay={500} />);
    const input = screen.getByTestId('search-input');
    
    // Change input value
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Check that input value is updated immediately
    expect(input).toHaveValue('test');
    
    // Verify that dispatch is not called immediately
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Fast-forward time to trigger debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now dispatch should be called with the search query
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery('test'));
  });

  // Test clear button
  test('shows clear button when input has value and clears on click', () => {
    mockUseSearchQuery.mockReturnValue('existing search');
    
    render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    
    // Input should have the value from Redux
    expect(input).toHaveValue('existing search');
    
    // Clear button should be visible
    const endAdornment = screen.getByTestId('end-adornment');
    expect(endAdornment).toBeInTheDocument();
    
    // Click the clear button (inside the end adornment)
    const clearButton = endAdornment.querySelector('button');
    if (clearButton) {
      fireEvent.click(clearButton);
    }
    
    // Dispatch should be called with empty string
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery(''));
    
    // Input value should be cleared
    expect(input).toHaveValue('');
  });

  // Test no clear button when input is empty
  test('does not show clear button when input is empty', () => {
    mockUseSearchQuery.mockReturnValue('');
    
    render(<SearchBar />);
    
    // End adornment (clear button) should not be present
    expect(screen.queryByTestId('end-adornment')).not.toBeInTheDocument();
  });

  // Test search icon is always present
  test('always shows search icon', () => {
    render(<SearchBar />);
    
    // Start adornment (search icon) should be present
    expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
  });

  // Test debounce cancellation
  test('cancels previous debounce when input changes rapidly', () => {
    render(<SearchBar debounceDelay={500} />);
    const input = screen.getByTestId('search-input');
    
    // Change input value multiple times
    fireEvent.change(input, { target: { value: 'a' } });
    
    // Fast-forward time partially
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Change input again before debounce triggers
    fireEvent.change(input, { target: { value: 'ab' } });
    
    // Fast-forward time partially again
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Change input once more
    fireEvent.change(input, { target: { value: 'abc' } });
    
    // Complete the debounce time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Dispatch should only be called once with the final value
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSearchQuery('abc'));
  });

  // Test with custom className
  test('applies additional className when provided', () => {
    const { container } = render(<SearchBar className="custom-class" />);
    const searchBarContainer = container.firstChild as HTMLElement;
    expect(searchBarContainer).toHaveClass('custom-class');
  });

  // Test synchronization with Redux state
  test('updates local state when Redux state changes', () => {
    const { rerender } = render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    
    // Initial state
    expect(input).toHaveValue('');
    
    // Update Redux state
    mockUseSearchQuery.mockReturnValue('new search');
    
    // Re-render with new Redux state
    rerender(<SearchBar />);
    
    // Input should reflect the new Redux state
    expect(input).toHaveValue('new search');
  });
});
