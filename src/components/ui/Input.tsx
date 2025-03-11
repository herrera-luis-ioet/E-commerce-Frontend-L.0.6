import React, { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input component props
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Whether the input is in an error state */
  isError?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Full width input */
  fullWidth?: boolean;
  /** Start icon or element */
  startAdornment?: React.ReactNode;
  /** End icon or element */
  endAdornment?: React.ReactNode;
  /** Additional CSS classes for the input container */
  containerClassName?: string;
  /** Additional CSS classes for the input element */
  inputClassName?: string;
}

/**
 * PUBLIC_INTERFACE
 * Input component with label, error state, and helper text
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  isError = false,
  required = false,
  fullWidth = false,
  startAdornment,
  endAdornment,
  containerClassName = '',
  inputClassName = '',
  disabled = false,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base container classes
  const containerClasses = `mb-4 ${fullWidth ? 'w-full' : ''} ${containerClassName}`;
  
  // Base input classes
  const baseInputClasses = 'block w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition-standard';
  
  // Input state classes
  const stateClasses = isError
    ? 'border-error focus:border-error focus:ring-error/20 text-error'
    : disabled
      ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 focus:border-primary focus:ring-primary/20 text-gray-900 dark:text-white';
  
  // Adornment classes
  const startAdornmentClasses = startAdornment ? 'pl-10' : '';
  const endAdornmentClasses = endAdornment ? 'pr-10' : '';
  
  // Combine all input classes
  const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${startAdornmentClasses}
    ${endAdornmentClasses}
    ${inputClassName}
  `;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {/* Input wrapper for adornments */}
      <div className="relative">
        {/* Start adornment */}
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        {/* Input element */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={isError}
          aria-describedby={`${inputId}-helper-text`}
          disabled={disabled}
          {...props}
        />
        
        {/* End adornment */}
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <p 
          id={`${inputId}-helper-text`} 
          className={`mt-1 text-sm ${isError ? 'text-error' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {isError ? error : helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;