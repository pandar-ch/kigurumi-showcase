import { useState, useEffect } from 'react';
import { ShowcaseItem, ItemImage, DetailBlock } from '@/types/showcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageManager } from './ImageManager';
import { TagManager } from './TagManager';
import { DetailBlockManager } from './DetailBlockManager';
import { Save, ArrowLeft } from 'lucide-react';

interface ItemFormProps {
  item?: ShowcaseItem;
  onSave: (data: Omit<ShowcaseItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const ItemForm = ({ item, onSave, onCancel }: ItemFormProps) => {
  const [name, setName] = useState(item?.name || '');
  const [subtitle, setSubtitle] = useState(item?.subtitle || '');
  const [brand, setBrand] = useState(item?.brand || '');
  const [description, setDescription] = useState(item?.description || '');
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [images, setImages] = useState<ItemImage[]>(item?.images || []);
  const [details, setDetails] = useState<DetailBlock[]>(item?.details || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      subtitle,
      brand,
      description,
      tags,
      images,
      details,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-xl font-semibold">
          {item ? 'Modifier l\'élément' : 'Nouvel élément'}
        </h2>
      </div>

      {/* Informations principales */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Informations principales</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de l'élément"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Marque / Fabricant</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Marque ou fabricant"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Sous-titre ou description courte"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée..."
            rows={4}
          />
        </div>
      </section>

      {/* Tags */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Tags</h3>
        <TagManager tags={tags} onChange={setTags} />
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Images</h3>
        <ImageManager images={images} onChange={setImages} />
      </section>

      {/* Détails */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Blocs de détails</h3>
        <DetailBlockManager blocks={details} onChange={setDetails} />
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="submit" disabled={!name.trim()}>
          <Save className="w-4 h-4 mr-2" />
          {item ? 'Enregistrer' : 'Créer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};
