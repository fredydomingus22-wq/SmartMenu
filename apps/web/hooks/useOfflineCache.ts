import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface OfflineCacheOptions {
  maxAge?: number; // in milliseconds
  maxItems?: number;
}

export const useOfflineCache = <T>(
  key: string,
  options: OfflineCacheOptions = {}
) => {
  const { maxAge = 24 * 60 * 60 * 1000, maxItems = 100 } = options; // 24 hours default
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from cache
  const loadFromCache = useCallback(async (): Promise<T | null> => {
    try {
      if (typeof window === 'undefined') return null;

      const cached = localStorage.getItem(`smartmenu_cache_${key}`);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);

      // Check if expired
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(`smartmenu_cache_${key}`);
        return null;
      }

      return item.data;
    } catch (err) {
      console.error('Error loading from cache:', err);
      return null;
    }
  }, [key]);

  // Save data to cache
  const saveToCache = useCallback(async (data: T): Promise<void> => {
    try {
      if (typeof window === 'undefined') return;

      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + maxAge,
      };

      localStorage.setItem(`smartmenu_cache_${key}`, JSON.stringify(item));

      // Clean up old items if we have too many
      await cleanupOldItems();
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  }, [key, maxAge]);

  // Clean up old cache items
  const cleanupOldItems = useCallback(async (): Promise<void> => {
    try {
      if (typeof window === 'undefined') return;

      const keys = Object.keys(localStorage).filter(k => k.startsWith('smartmenu_cache_'));
      const now = Date.now();

      // Remove expired items
      for (const key of keys) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.expiresAt && now > item.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove invalid items
          localStorage.removeItem(key);
        }
      }

      // If still too many items, remove oldest
      if (keys.length > maxItems) {
        const items = keys
          .map(key => ({
            key,
            timestamp: JSON.parse(localStorage.getItem(key) || '{}').timestamp || 0,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const toRemove = items.slice(0, keys.length - maxItems);
        toRemove.forEach(item => localStorage.removeItem(item.key));
      }
    } catch (err) {
      console.error('Error cleaning up cache:', err);
    }
  }, [maxItems]);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      const cachedData = await loadFromCache();
      if (cachedData) {
        setData(cachedData);
      }
    };

    loadCachedData();
  }, [loadFromCache]);

  // Fetch fresh data and cache it
  const fetchAndCache = useCallback(async (fetchFn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const freshData = await fetchFn();
      setData(freshData);
      await saveToCache(freshData);
      return freshData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      // Try to return cached data as fallback
      const cachedData = await loadFromCache();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveToCache, loadFromCache]);

  // Clear cache for this key
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`smartmenu_cache_${key}`);
        setData(null);
      }
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  }, [key]);

  return {
    data,
    isLoading,
    error,
    fetchAndCache,
    clearCache,
    isOffline: !navigator.onLine,
  };
};