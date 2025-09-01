import React, { useEffect, useState, useCallback } from 'react';
import type { Product } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { generateProductDescription } from '../services/geminiService';
import { ImageWithLoader } from './ImageWithLoader';
import { useCart } from '../contexts/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [description, setDescription] = useState('');
  const [isDescLoading, setIsDescLoading] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      const productWithPrice = { ...product, price: price || product.price };
      addToCart(productWithPrice, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1500); // Close modal after showing confirmation
    } else if (!selectedSize) {
      alert("Please select a size.");
    }
  };

  useEffect(() => {
    if (product) {
      // Reset state on new product
      setPrice(product.price || `$${(Math.random() * 15 + 20).toFixed(2)}`);
      setSelectedSize(null);
      setQuantity(1);
      setAddedToCart(false);
      
      setIsDescLoading(true);
      generateProductDescription(product.prompt)
        .then(setDescription)
        .catch(err => {
          console.error(err);
          setDescription("A unique design that's sure to turn heads.");
        })
        .finally(() => setIsDescLoading(false));
    }
  }, [product]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  if (!product) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
    >
      <div 
        className="bg-content-bg rounded-3xl shadow-soft-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-8 p-8 relative animate-modal-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors z-10"
          aria-label="Close product details"
        >
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-element-bg">
            <ImageWithLoader 
              src={product.imageUrl} 
              alt={`Model wearing sweater with design: ${product.prompt}`}
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto pr-2">
          <h2 id="product-title" className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">{product.prompt}</h2>
          <p className="text-4xl font-light text-text-primary mb-4">{price}</p>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-text-secondary mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-bold border-2 transition-colors duration-200 ${selectedSize === size ? 'bg-primary border-primary text-white' : 'bg-transparent border-border-color hover:border-text-primary text-text-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-text-secondary mb-2">Quantity</h3>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center py-2 bg-element-bg rounded-lg font-bold border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>
          </div>
          
          <div className="text-text-secondary leading-relaxed mb-6">
            {isDescLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-element-bg rounded w-full"></div>
                <div className="h-4 bg-element-bg rounded w-5/6"></div>
              </div>
            ) : (
               <p>{description}</p>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-border-color">
             <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || addedToCart}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {addedToCart ? 'Added!' : 'Add to Cart'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};