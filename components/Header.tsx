import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { itemCount } = useCart();
  
  return (
    <header className="py-4 px-4 md:px-8 bg-content-bg/80 backdrop-blur-sm sticky top-0 z-20 border-b border-border-color">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">
            AI Merch Genesis
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-text-secondary font-medium">
          <a href="#" className="hover:text-text-primary transition-colors">Men</a>
          <a href="#" className="hover:text-text-primary transition-colors">Women</a>
          <a href="#" className="hover:text-text-primary transition-colors">Custom</a>
          <a href="#" className="hover:text-text-primary transition-colors">Sale</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onCartClick} 
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors" 
            aria-label={`Open cart with ${itemCount} items`}
          >
            <ShoppingCartIcon className="w-7 h-7" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-content-bg flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          {/* Placeholder for account icon */}
          <div className="w-8 h-8 rounded-full bg-element-bg flex items-center justify-center text-text-secondary font-medium text-sm cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  );
};