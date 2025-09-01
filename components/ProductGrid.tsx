import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl opacity-20 mb-4">👕✨</div>
        <h2 className="text-4xl font-extrabold text-text-primary">Your Designs Await</h2>
        <p className="text-text-secondary mt-2 max-w-md mx-auto">Use the generator above to bring your t-shirt ideas to life, and they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 p-4 md:p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
      ))}
    </div>
  );
};