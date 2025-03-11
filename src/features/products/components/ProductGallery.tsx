import React, { useState } from 'react';
import { Product } from '../../../types/product.types';

/**
 * ProductGallery component props
 */
export interface ProductGalleryProps {
  /** Product data containing images */
  product: Product;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PUBLIC_INTERFACE
 * ProductGallery component for displaying product images with thumbnail navigation
 */
const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  className = '',
}) => {
  // State for currently selected image
  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);
  // State for zoom effect
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  // State for zoom position
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Combine all product images into a single array, with main image first
  const allImages = [
    product.mainImage,
    ...product.images.filter(img => img !== product.mainImage)
  ];

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main image container */}
      <div 
        className={`
          relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-4
          border border-gray-200 dark:border-gray-700
          ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
        `}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img 
          src={selectedImage} 
          alt={product.name}
          className={`
            w-full h-full object-contain transition-transform duration-300
            ${isZoomed ? 'scale-150' : ''}
          `}
          style={isZoomed ? {
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          } : undefined}
          onError={handleImageError}
        />
        
        {/* Zoom instructions */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
        </div>
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {allImages.map((image, index) => (
            <button
              key={`thumb-${index}`}
              className={`
                w-16 h-16 md:w-20 md:h-20 border-2 rounded overflow-hidden
                ${selectedImage === image ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}
                transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary
              `}
              onClick={() => setSelectedImage(image)}
              aria-label={`View product image ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;