import { ShowcaseItem } from '@/types/showcase';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Image as ImageIcon, Tag } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ItemListProps {
  items: ShowcaseItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ItemList = ({ items, onEdit, onDelete }: ItemListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground mb-2">Aucun élément dans la collection</p>
        <p className="text-sm text-muted-foreground">Créez votre premier élément pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {item.images.length > 0 ? (
              <img
                src={item.images.sort((a, b) => a.position - b.position)[0].url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{item.name}</h3>
            {item.brand && (
              <p className="text-sm text-muted-foreground">{item.brand}</p>
            )}
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {item.images.length}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {item.tags.length}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(item.id)}>
              <Edit className="w-4 h-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer "{item.name}" ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'élément et toutes ses images seront supprimés définitivement.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(item.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};
