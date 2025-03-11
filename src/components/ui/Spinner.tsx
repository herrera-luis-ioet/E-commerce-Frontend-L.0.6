import React from 'react';

/**
 * Spinner size variants
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Spinner component props
 */
export interface SpinnerProps {
  /** Spinner size */
  size?: SpinnerSize;
  /** Spinner color */
  color?: 'primary' | 'secondary' | 'white' | 'black' | 'gray';
  /** Additional CSS classes */
  className?: string;
  /** Whether to center the spinner */
  centered?: boolean;
  /** Optional label for accessibility */
  label?: string;
}

/**
 * PUBLIC_INTERFACE
 * Loading spinner component with size variants
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  centered = false,
  label = 'Loading...',
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    white: 'border-white/30 border-t-white',
    black: 'border-black/30 border-t-black',
    gray: 'border-gray-300 border-t-gray-600',
  };
  
  // Centered container classes
  const centeredClasses = centered ? 'flex justify-center items-center' : '';
  
  // Spinner classes
  const spinnerClasses = `
    inline-block rounded-full border-solid animate-spin
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${className}
  `;

  return (
    <div className={centeredClasses}>
      <div
        className={spinnerClasses}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default Spinner;