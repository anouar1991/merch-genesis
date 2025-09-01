import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateShirtImage, generateInspirationPrompts, generateModelMockup } from './services/geminiService';
import { useImageCache } from './hooks/useImageCache';
import type { Product } from './types';
import { InfiniteScrollLoader } from './components/InfiniteScrollLoader';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartProvider } from './contexts/CartContext';
import { CartDrawer } from './components/CartDrawer';
import ParticleBackground from './components/ParticleBackground';

const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const imageCache = useImageCache();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for infinite scroll
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [inspirationPrompts, setInspirationPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);

  const fetchInspiration = useCallback(async (prompt: string) => {
    const newPrompts = await generateInspirationPrompts(prompt);
    setInspirationPrompts(newPrompts);
    setCurrentPromptIndex(0);
  }, []);

  // Fetch initial generic prompts on load
  useEffect(() => {
    fetchInspiration("popular and trending t-shirt designs");
  }, [fetchInspiration]);
  
  const generateProduct = useCallback(async (prompt: string, isFromSearch: boolean) => {
    const cachedData = imageCache.get(prompt);
    const id = new Date().toISOString() + Math.random();
    const price = `$${(Math.random() * 15 + 20).toFixed(2)}`;

    if (cachedData) {
      const newProduct: Product = { id, prompt, price, ...cachedData };
      setProducts(prev => isFromSearch ? [newProduct, ...prev] : [...prev, newProduct]);
      return;
    }

    try {
      // Stage 1: Generate Design
      const designImageUrl = await generateShirtImage(prompt);
      const tempProduct: Product = {
        id,
        prompt,
        price,
        imageUrl: designImageUrl, // Use design as placeholder
        designUrl: designImageUrl,
        isLoadingMockup: true,
      };
      setProducts(prevProducts => isFromSearch ? [tempProduct, ...prevProducts] : [...prevProducts, tempProduct]);

      // Stage 2: Generate Mockup in background
      generateModelMockup(designImageUrl, prompt)
        .then(mockupImageUrl => {
          imageCache.set(prompt, { imageUrl: mockupImageUrl, designUrl: designImageUrl });
          setProducts(prevProducts =>
            prevProducts.map(p =>
              p.id === tempProduct.id
                ? { ...p, imageUrl: mockupImageUrl, isLoadingMockup: false }
                : p
            )
          );
        })
        .catch(err => {
          console.error("Mockup generation failed:", err);
          setProducts(prevProducts => prevProducts.filter(p => p.id !== tempProduct.id));
          if (isFromSearch) {
              setError(`Failed to create a model for "${prompt}". Please try another idea.`);
          }
        });
    } catch (err: any) {
      console.error(`Failed to generate product for prompt "${prompt}":`, err);
      if (isFromSearch) {
        setError(err.message || 'An unknown error occurred.');
      }
    }

  }, [imageCache]);


  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || isFetchingMore || currentPromptIndex >= inspirationPrompts.length) {
      return;
    }
    
    setIsFetchingMore(true);
    const prompt = inspirationPrompts[currentPromptIndex];
    
    if (prompt) {
        await generateProduct(prompt, false);
        setCurrentPromptIndex(prev => prev + 1);
    }

    setIsFetchingMore(false);
  }, [isLoading, isFetchingMore, currentPromptIndex, inspirationPrompts, generateProduct]);
  
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 400; 
      
      if (isAtBottom) {
        fetchMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMoreProducts]);

  const handleSearch = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setProducts([]); // Clear existing products for a new search
    fetchInspiration(prompt); // Fetch new related prompts for infinite scroll
    
    await generateProduct(prompt, true);
    
    setIsLoading(false);
  }, [generateProduct, fetchInspiration]);
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        {error && <div className="max-w-2xl mx-auto"><ErrorDisplay message={error} /></div>}
        {isLoading && <Loader />}
        
        <ProductGrid products={products} onProductSelect={handleProductSelect} />

        {isFetchingMore && <InfiniteScrollLoader />}
      </main>
      <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
