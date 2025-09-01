export interface Product {
  id: string;
  prompt: string;
  imageUrl: string; // model mockup
  designUrl: string; // isolated design
  price?: string;
  description?: string;
  isLoadingMockup?: boolean;
}

export interface CartItem extends Product {
  size: string;
  quantity: number;
}

export interface CacheData {
  imageUrl: string;
  designUrl: string;
}

export interface CacheStore {
  [key: string]: string; // Will store stringified CacheData
}