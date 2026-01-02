import SparkMD5 from 'spark-md5';
import { ItemImage } from '@/types/showcase';

export const computeMD5 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(arrayBuffer);
      resolve(spark.end());
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
};

export const processImageUpload = async (
  file: File,
  existingImages: ItemImage[] = []
): Promise<ItemImage> => {
  const md5Hash = await computeMD5(file);
  const extension = getFileExtension(file.name);
  const base64 = await fileToBase64(file);
  
  // Check if image already exists
  const existingImage = existingImages.find(img => img.id === md5Hash);
  if (existingImage) {
    throw new Error('Cette image existe déjà');
  }

  const maxPosition = existingImages.reduce((max, img) => Math.max(max, img.position), 0);

  return {
    id: md5Hash,
    src: base64,
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
