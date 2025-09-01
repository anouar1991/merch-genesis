import React, { useState } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string; // will be applied to the <img> element
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-element-bg animate-pulse"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};