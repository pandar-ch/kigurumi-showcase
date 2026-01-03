import { useState } from 'react';
import { DetailBlock, DetailItem } from '@/types/showcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DetailBlockManagerProps {
  blocks: DetailBlock[];
  onChange: (blocks: DetailBlock[]) => void;
}

export const DetailBlockManager = ({ blocks, onChange }: DetailBlockManagerProps) => {
  const [openBlocks, setOpenBlocks] = useState<Set<string>>(new Set());

  const toggleBlock = (id: string) => {
    const newOpen = new Set(openBlocks);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenBlocks(newOpen);
  };

  const addBlock = () => {
    const newBlock: DetailBlock = {
      id: crypto.randomUUID(),
      title: 'Nouveau bloc',
      items: [],
    };
    onChange([...blocks, newBlock]);
    setOpenBlocks(new Set([...openBlocks, newBlock.id]));
  };

  const updateBlockTitle = (id: string, title: string) => {
    onChange(blocks.map(block =>
      block.id === id ? { ...block, title } : block
    ));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const addItem = (blockId: string) => {
    const newItem: DetailItem = {
      id: crypto.randomUUID(),
      label: '',
      value: '',
    };
    onChange(blocks.map(block =>
      block.id === blockId
        ? { ...block, items: [...block.items, newItem] }
        : block
    ));
  };

  const updateItem = (blockId: string, itemId: string, field: 'label' | 'value', value: string) => {
    onChange(blocks.map(block =>
      block.id === blockId
        ? {
            ...block,
            items: block.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
        : block
    ));
  };

  const deleteItem = (blockId: string, itemId: string) => {
    onChange(blocks.map(block =>
      block.id === blockId
        ? { ...block, items: block.items.filter((item) => item.id !== itemId) }
        : block
    ));
  };

  return (
    <div className="space-y-3">
      {blocks.map((block) => (
        <Collapsible
          key={block.id}
          open={openBlocks.has(block.id)}
          onOpenChange={() => toggleBlock(block.id)}
        >
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 p-3 bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                {openBlocks.has(block.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <Input
                  value={block.title}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateBlockTitle(block.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-8 bg-background"
                  placeholder="Titre du bloc"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-3 space-y-2">
                {block.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      value={item.label}
                      onChange={(e) => updateItem(block.id, item.id, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 h-8"
                    />
                    <Input
                      value={item.value}
                      onChange={(e) => updateItem(block.id, item.id, 'value', e.target.value)}
                      placeholder="Valeur"
                      className="flex-1 h-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(block.id, item.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(block.id)}
                  className="w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Ajouter un item
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addBlock}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un bloc de détails
      </Button>
    </div>
  );
};
