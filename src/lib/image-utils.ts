import { ItemImage } from '@/types/showcase';
import { imagesApi } from '@/lib/api';

export const processImageUpload = async (
  file: File,
  existingImages: ItemImage[] = []
): Promise<ItemImage> => {
  // Upload to server
  const { url, filename } = await imagesApi.upload(file);
  
  // Check if image already exists by URL
  const existingImage = existingImages.find(img => img.url === url);
  if (existingImage) {
    throw new Error('Cette image existe déjà');
  }

  const maxPosition = existingImages.reduce((max, img) => Math.max(max, img.position), 0);

  return {
    id: filename,
    url,
    alt: file.name.replace(/\.[^/.]+$/, ''),
    position: maxPosition + 1,
  };
};

export const reorderImages = (images: ItemImage[], fromIndex: number, toIndex: number): ItemImage[] => {
  const result = [...images];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update positions
  return result.map((img, index) => ({
    ...img,
    position: index + 1,
  }));
};

export const deleteImage = async (filename: string): Promise<void> => {
  await imagesApi.delete(filename);
};
