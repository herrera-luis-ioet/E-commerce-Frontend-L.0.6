import React from 'react';

/**
 * Card component props
 */
export interface CardProps {
  /** Card title for the header */
  title?: string;
  /** Card subtitle for the header */
  subtitle?: string;
  /** Card content */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether to add hover effect */
  hover?: boolean;
  /** Whether to add border */
  bordered?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional header action (e.g., button, icon) */
  headerAction?: React.ReactNode;
  /** Optional onClick handler */
  onClick?: () => void;
}

/**
 * PUBLIC_INTERFACE
 * Card component for displaying content with optional header, footer, and hover effects
 */
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  hover = false,
  bordered = false,
  className = '',
  headerAction,
  onClick,
}) => {
  // Base card classes
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
  
  // Hover effect
  const hoverClasses = hover ? 'transform transition-standard hover:shadow-lg hover:-translate-y-1' : '';
  
  // Border
  const borderClasses = bordered ? 'border border-gray-200 dark:border-gray-700' : '';
  
  // Clickable
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${hoverClasses}
    ${borderClasses}
    ${clickableClasses}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-6">{children}</div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;