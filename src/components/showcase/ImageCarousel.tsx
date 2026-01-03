import { useState, useEffect, useCallback } from "react";
import { ItemImage } from "@/types/showcase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: ItemImage[];
  onImageClick: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
}

const ImageCarousel = ({ 
  images, 
  onImageClick, 
  autoPlay = true, 
  interval = 4000 
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return;
    
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, interval, goToNext, images.length]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-secondary rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground">Aucune image</span>
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div 
        className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary cursor-pointer"
        onClick={() => onImageClick(currentIndex)}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || ''}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? "bg-primary w-6" 
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || ''}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
