import { useState, useEffect, useCallback } from 'react';
import { ShowcaseData, ShowcaseItem, ItemImage, DetailBlock } from '@/types/showcase';

const STORAGE_KEY = 'showcase-admin-data';

const getDefaultData = (): ShowcaseData => ({
  title: 'Ma Collection',
  description: 'Collection personnelle de kigurumi',
  items: [],
  generatedAt: new Date().toISOString(),
});

export const useShowcaseStorage = () => {
  const [data, setData] = useState<ShowcaseData>(getDefaultData());
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((newData: ShowcaseData) => {
    const dataToSave = {
      ...newData,
      generatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setData(dataToSave);
  }, []);

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Create item
  const createItem = useCallback((item: Omit<ShowcaseItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newItem: ShowcaseItem = {
      ...item,
      id: crypto.randomUUID(),
      slug: generateSlug(item.name),
      createdAt: now,
      updatedAt: now,
    };
    const newData = {
      ...data,
      items: [...data.items, newItem],
    };
    saveData(newData);
    return newItem;
  }, [data, saveData]);

  // Update item
  const updateItem = useCallback((id: string, updates: Partial<Omit<ShowcaseItem, 'id' | 'createdAt'>>) => {
    const newData = {
      ...data,
      items: data.items.map(item =>
        item.id === id
          ? {
              ...item,
              ...updates,
              slug: updates.name ? generateSlug(updates.name) : item.slug,
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    };
    saveData(newData);
  }, [data, saveData]);

  // Delete item
  const deleteItem = useCallback((id: string) => {
    const newData = {
      ...data,
      items: data.items.filter(item => item.id !== id),
    };
    saveData(newData);
  }, [data, saveData]);

  // Get item by ID
  const getItem = useCallback((id: string) => {
    return data.items.find(item => item.id === id);
  }, [data]);

  // Update collection metadata
  const updateMetadata = useCallback((title: string, description?: string) => {
    saveData({
      ...data,
      title,
      description,
    });
  }, [data, saveData]);

  // Export data for showcase
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Import data
  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as ShowcaseData;
      saveData(imported);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [saveData]);

  return {
    data,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    updateMetadata,
    exportData,
    importData,
  };
};
