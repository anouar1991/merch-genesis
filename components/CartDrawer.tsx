import React, { useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, itemCount } = useCart();

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price?.replace('$', '') || '0');
      return total + price * item.quantity;
    }, 0).toFixed(2);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-content-bg shadow-2xl flex flex-col animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Close cart">
            <CloseIcon className="w-7 h-7" />
          </button>
        </header>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-text-primary">Your cart is empty</h3>
            <p className="text-text-secondary mt-1">Looks like you haven't added anything yet.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center animate-fade-in">
                <img src={item.designUrl} alt={item.prompt} className="w-20 h-20 rounded-md object-cover bg-content-bg" />
                <div className="flex-grow">
                  <p className="font-semibold text-text-primary truncate">{item.prompt}</p>
                  <p className="text-sm text-text-secondary">Size: {item.size}</p>
                  <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                  <p className="font-bold text-text-primary mt-1">{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-red-400 hover:text-red-500 transition-colors p-2"
                  aria-label={`Remove ${item.prompt} from cart`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <footer className="p-6 border-t border-border-color mt-auto bg-content-bg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-text-secondary">Subtotal</span>
            <span className="text-2xl font-bold text-text-primary">${subtotal}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={() => alert('Checkout is not implemented in this demo.')}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Proceed to Checkout
          </button>
        </footer>
      </div>
    </div>
  );
};