
import { useRef, useCallback } from 'react';
import type { CacheStore, CacheData } from '../types';

export const useImageCache = () => {
  const cache = useRef<CacheStore>({});

  const get = useCallback((key: string): CacheData | null => {
    const normalizedKey = key.trim().toLowerCase();
    const cachedItem = cache.current[normalizedKey];
    if (cachedItem) {
      try {
        return JSON.parse(cachedItem) as CacheData;
      } catch (e) {
        console.error("Failed to parse cache data:", e);
        return null;
      }
    }
    return null;
  }, []);

  const set = useCallback((key: string, value: CacheData): void => {
    const normalizedKey = key.trim().toLowerCase();
    cache.current[normalizedKey] = JSON.stringify(value);
  }, []);
  
  const has = useCallback((key: string): boolean => {
    const normalizedKey = key.trim().toLowerCase();
    return normalizedKey in cache.current;
  }, []);

  return { get, set, has };
};
