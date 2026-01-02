import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShowcaseStorage } from '@/hooks/use-showcase-storage';
import { ItemForm } from '@/components/admin/ItemForm';
import { ItemList } from '@/components/admin/ItemList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Eye, 
  Download, 
  Upload, 
  Settings,
  Package
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Admin = () => {
  const { 
    data, 
    isLoading, 
    createItem, 
    updateItem, 
    deleteItem, 
    getItem,
    updateMetadata,
    exportData,
    importData 
  } = useShowcaseStorage();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description || '');
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsCreating(false);
  };

  const handleSave = (itemData: Parameters<typeof createItem>[0]) => {
    if (editingId) {
      updateItem(editingId, itemData);
      toast({ title: 'Élément modifié' });
    } else {
      createItem(itemData);
      toast({ title: 'Élément créé' });
    }
    setEditingId(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast({ title: 'Élément supprimé' });
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `showcase-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Données exportées' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importData(content)) {
        toast({ title: 'Données importées' });
      } else {
        toast({ title: 'Erreur d\'import', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = () => {
    updateMetadata(title, description);
    setSettingsOpen(false);
    toast({ title: 'Paramètres sauvegardés' });
  };

  const editingItem = editingId ? getItem(editingId) : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Administration</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir la vitrine
                </Link>
              </Button>
              
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Paramètres de la collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Titre de la collection</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la collection"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSaveSettings} className="w-full">
                      Sauvegarder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isCreating || editingId ? (
          <ItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel élément
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              
              <label>
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-2xl font-bold">{data.items.length}</p>
                <p className="text-sm text-muted-foreground">Éléments</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-2xl font-bold">
                  {data.items.reduce((acc, item) => acc + item.images.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-2xl font-bold">
                  {new Set(data.items.flatMap(item => item.tags)).size}
                </p>
                <p className="text-sm text-muted-foreground">Tags uniques</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground">Dernière MAJ</p>
                <p className="text-sm font-medium">
                  {new Date(data.generatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Liste des éléments */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Éléments ({data.items.length})</h2>
              <ItemList
                items={data.items}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
