import React from 'react';
import type { Product } from '../types';
import { TShirtMockup } from './TShirtMockup';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="bg-content-bg rounded-2xl border border-border-color shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-300 group animate-fade-in">
      <div className="cursor-pointer" onClick={() => onSelect(product)}>
        <div className="overflow-hidden rounded-t-2xl">
          <TShirtMockup 
            imageUrl={product.imageUrl} 
            altText={product.prompt} 
            isLoading={product.isLoadingMockup} 
          />
        </div>
        <div className="p-4">
            <p className="text-text-primary font-semibold text-md truncate" title={product.prompt}>
              {product.prompt}
            </p>
            <p className="text-text-primary font-bold text-lg mt-1">{product.price}</p>
        </div>
      </div>
    </div>
  );
};