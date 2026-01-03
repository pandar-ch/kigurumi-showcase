import { useState, useEffect, useCallback } from 'react';
import { ShowcaseData, ShowcaseItem } from '@/types/showcase';
import { showcaseApi, itemsApi } from '@/lib/api';

const getDefaultData = (): ShowcaseData => ({
  title: 'Ma Collection',
  description: 'Collection personnelle de kigurumi',
  items: [],
  generatedAt: new Date().toISOString(),
});

export const useShowcaseStorage = () => {
  const [data, setData] = useState<ShowcaseData>(getDefaultData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const showcaseData = await showcaseApi.getData();
      setData(showcaseData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      // Keep default data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create item
  const createItem = useCallback(async (item: Omit<ShowcaseItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await itemsApi.create(item);
      setData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      return newItem;
    } catch (err) {
      console.error('Error creating item:', err);
      throw err;
    }
  }, []);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<Omit<ShowcaseItem, 'id' | 'createdAt'>>) => {
    try {
      const updatedItem = await itemsApi.update(id, updates);
      setData(prev => ({
        ...prev,
        items: prev.items.map(item => (item.id === id ? updatedItem : item)),
      }));
      return updatedItem;
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  }, []);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    try {
      await itemsApi.delete(id);
      setData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting item:', err);
      throw err;
    }
  }, []);

  // Get item by ID
  const getItem = useCallback((id: string) => {
    return data.items.find(item => item.id === id);
  }, [data]);

  // Update collection metadata
  const updateMetadata = useCallback(async (title: string, description?: string) => {
    try {
      const updatedData = await showcaseApi.updateMetadata(title, description);
      setData(updatedData);
    } catch (err) {
      console.error('Error updating metadata:', err);
      throw err;
    }
  }, []);

  // Export data
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Import data
  const importData = useCallback(async (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as ShowcaseData;
      const updatedData = await showcaseApi.importData(imported);
      setData(updatedData);
      return true;
    } catch (err) {
      console.error('Error importing data:', err);
      return false;
    }
  }, []);

  // Refresh data from server
  const refresh = useCallback(() => {
    return loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    updateMetadata,
    exportData,
    importData,
    refresh,
  };
};
