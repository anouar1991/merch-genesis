import React from 'react';
import { ImageWithLoader } from './ImageWithLoader';
import { SparklesIcon } from './icons/SparklesIcon';

interface TShirtMockupProps {
  imageUrl: string;
  altText: string; 
  isLoading?: boolean;
}

export const TShirtMockup: React.FC<TShirtMockupProps> = ({ imageUrl, altText, isLoading }) => {
  return (
    <div className="relative w-full aspect-square bg-element-bg overflow-hidden">
      <ImageWithLoader
        src={imageUrl}
        alt={altText}
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-content-bg/70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 animate-fade-in">
          <div className="flex flex-col items-center text-text-primary text-center">
              <SparklesIcon className="w-8 h-8 animate-spin" />
              <p className="text-xs mt-2 font-semibold">Creating Mockup...</p>
          </div>
        </div>
      )}
    </div>
  );
};