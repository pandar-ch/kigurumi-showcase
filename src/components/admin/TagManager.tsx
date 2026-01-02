import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagManager = ({ tags, onChange }: TagManagerProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nouveau tag..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTag}
          disabled={!newTag.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun tag</p>
      )}
    </div>
  );
};
