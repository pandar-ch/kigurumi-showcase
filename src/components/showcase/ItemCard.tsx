import { useState } from "react";
import { ShowcaseItem } from "@/types/showcase";
import ImageCarousel from "./ImageCarousel";
import TagBadge from "./TagBadge";
import DetailBlock from "./DetailBlock";
import Lightbox from "./Lightbox";

interface ItemCardProps {
  item: ShowcaseItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section 
        id={item.slug}
        className="scroll-mt-24 animate-fade-in"
      >
        <article className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-4 md:p-6">
              <ImageCarousel 
                images={item.images} 
                onImageClick={handleImageClick}
              />
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-6 md:border-l border-border flex flex-col">
              {/* Header */}
              <div className="mb-4">
                {item.brand && (
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {item.brand}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                  {item.name}
                </h2>
                {item.subtitle && (
                  <p className="text-lg text-muted-foreground mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {item.description}
                </p>
              )}

              {/* Details */}
              {item.details.length > 0 && (
                <div className="mt-auto grid gap-3">
                  {item.details.map((block) => (
                    <DetailBlock key={block.id} block={block} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </section>

      <Lightbox
        images={item.images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default ItemCard;
