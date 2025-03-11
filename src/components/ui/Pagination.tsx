import React from 'react';

/**
 * Pagination component props
 */
export interface PaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback function when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Whether to show first and last page buttons */
  showFirstLast?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the pagination is disabled */
  disabled?: boolean;
}

/**
 * PUBLIC_INTERFACE
 * Pagination component for navigating through pages
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = '',
  disabled = false,
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Calculate range of pages to show
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // Case 1: Number of pages is less than the page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate left and right sibling index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Show ellipsis or not
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Case 2: Show left dots but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }
    
    // Case 3: Show right dots but no left dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from(
        { length: leftItemCount },
        (_, i) => i + 1
      );
      return [...leftRange, '...', totalPages];
    }
    
    // Case 4: Show both left and right dots
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, '...', ...middleRange, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();

  // Base button classes
  const baseButtonClasses = 'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-standard';
  
  // Active button classes
  const activeButtonClasses = 'bg-primary text-white';
  
  // Inactive button classes
  const inactiveButtonClasses = 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  
  // Disabled button classes
  const disabledButtonClasses = 'opacity-50 cursor-not-allowed';
  
  // Dots classes
  const dotsClasses = 'px-3 py-2 text-gray-500 dark:text-gray-400';

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => !disabled && currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={`${baseButtonClasses} ${
          disabled || currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses
        }`}
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* First page button */}
      {showFirstLast && currentPage > siblingCount + 2 && (
        <>
          <button
            onClick={() => !disabled && onPageChange(1)}
            disabled={disabled}
            className={`${baseButtonClasses} ${disabled ? disabledButtonClasses : inactiveButtonClasses}`}
            aria-label="First page"
          >
            1
          </button>
          {currentPage > siblingCount + 3 && (
            <span className={dotsClasses}>...</span>
          )}
        </>
      )}
      
      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return <span key={`ellipsis-${index}`} className={dotsClasses}>...</span>;
        }
        
        const isCurrentPage = pageNumber === currentPage;
        
        return (
          <button
            key={`page-${pageNumber}`}
            onClick={() => !disabled && !isCurrentPage && onPageChange(pageNumber as number)}
            disabled={disabled || isCurrentPage}
            className={`${baseButtonClasses} ${
              isCurrentPage 
                ? activeButtonClasses 
                : disabled ? disabledButtonClasses : inactiveButtonClasses
            }`}
            aria-current={isCurrentPage ? 'page' : undefined}
            aria-label={`Page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        );
      })}
      
      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - siblingCount - 1 && (
        <>
          {currentPage < totalPages - siblingCount - 2 && (
            <span className={dotsClasses}>...</span>
          )}
          <button
            onClick={() => !disabled && onPageChange(totalPages)}
            disabled={disabled}
            className={`${baseButtonClasses} ${disabled ? disabledButtonClasses : inactiveButtonClasses}`}
            aria-label="Last page"
          >
            {totalPages}
          </button>
        </>
      )}
      
      {/* Next button */}
      <button
        onClick={() => !disabled && currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={`${baseButtonClasses} ${
          disabled || currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses
        }`}
        aria-label="Next page"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;