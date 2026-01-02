import { useState, useRef } from 'react';
import { ItemImage } from '@/types/showcase';
import { processImageUpload, reorderImages } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageManagerProps {
  images: ItemImage[];
  onChange: (images: ItemImage[]) => void;
}

export const ImageManager = ({ images, onChange }: ImageManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    const newImages: ItemImage[] = [...images];

    for (const file of Array.from(files)) {
      try {
        const newImage = await processImageUpload(file, newImages);
        newImages.push(newImage);
        toast({
          title: 'Image ajoutée',
          description: `${file.name} → ${newImage.id.slice(0, 8)}...`,
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
          variant: 'destructive',
        });
      }
    }

    onChange(newImages);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const handleAltChange = (id: string, alt: string) => {
    onChange(images.map(img => img.id === id ? { ...img, alt } : img));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = reorderImages(sortedImages, draggedIndex, index);
    onChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Upload en cours...' : 'Ajouter des images'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? 's' : ''}
        </span>
      </div>

      {sortedImages.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Aucune image</p>
          <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour ajouter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-all ${
                draggedIndex === index ? 'opacity-50 border-primary' : 'border-border'
              }`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              
              <img
                src={image.src}
                alt={image.alt}
                className="w-16 h-16 object-cover rounded"
              />
              
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground font-mono">
                  {image.id.slice(0, 12)}...
                </p>
                <Input
                  value={image.alt}
                  onChange={(e) => handleAltChange(image.id, e.target.value)}
                  placeholder="Description de l'image"
                  className="h-8"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(image.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
