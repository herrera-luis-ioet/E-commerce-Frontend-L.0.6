import React, { SelectHTMLAttributes, forwardRef } from 'react';

/**
 * Option type for select options
 */
export interface SelectOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Select component props
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select options */
  options: SelectOption[];
  /** Select label */
  label?: string;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Whether the select is in an error state */
  isError?: boolean;
  /** Whether the select is required */
  required?: boolean;
  /** Full width select */
  fullWidth?: boolean;
  /** Select size */
  size?: 'sm' | 'md' | 'lg';
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes for the select container */
  containerClassName?: string;
  /** Additional CSS classes for the select element */
  selectClassName?: string;
}

/**
 * PUBLIC_INTERFACE
 * Select dropdown component with label and error state
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  label,
  helperText,
  error,
  isError = false,
  required = false,
  fullWidth = false,
  size = 'md',
  placeholder,
  containerClassName = '',
  selectClassName = '',
  disabled = false,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base container classes
  const containerClasses = `mb-4 ${fullWidth ? 'w-full' : ''} ${containerClassName}`;
  
  // Base select classes
  const baseSelectClasses = 'block w-full rounded-md border focus:outline-none focus:ring-2 transition-standard appearance-none bg-no-repeat bg-right';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-3 text-lg',
  };
  
  // Select state classes
  const stateClasses = isError
    ? 'border-error focus:border-error focus:ring-error/20 text-error'
    : disabled
      ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 focus:border-primary focus:ring-primary/20 text-gray-900 dark:text-white';
  
  // Combine all select classes
  const selectClasses = `
    ${baseSelectClasses}
    ${sizeClasses[size]}
    ${stateClasses}
    ${selectClassName}
  `;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId} 
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {/* Select wrapper with custom dropdown arrow */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          aria-invalid={isError}
          aria-describedby={`${selectId}-helper-text`}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <p 
          id={`${selectId}-helper-text`} 
          className={`mt-1 text-sm ${isError ? 'text-error' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {isError ? error : helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;