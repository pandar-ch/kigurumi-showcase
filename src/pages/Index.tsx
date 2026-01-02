import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShowcaseData } from "@/types/showcase";
import { showcaseData as defaultData } from "@/data/showcase-data";
import NavHeader from "@/components/showcase/NavHeader";
import ItemCard from "@/components/showcase/ItemCard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const STORAGE_KEY = 'showcase-admin-data';

const Index = () => {
  const [data, setData] = useState<ShowcaseData | null>(null);

  useEffect(() => {
    // Try to load from localStorage first, fallback to default data
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(defaultData);
      }
    } else {
      setData(defaultData);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const { title, description, items } = data;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader title={title} items={items} />

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        {description && (
          <div className="text-center mb-12 md:mb-16">
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
            <div className="mt-4 text-sm text-muted-foreground/60">
              {items.length} élément{items.length > 1 ? "s" : ""} dans la collection
            </div>
          </div>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Aucun élément dans la collection</p>
            <Button asChild>
              <Link to="/admin">
                <Settings className="w-4 h-4 mr-2" />
                Accéder à l'administration
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            {items.map((item, index) => (
              <div 
                key={item.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 md:mt-24 text-center text-sm text-muted-foreground/60 pb-8">
          <p>Collection personnelle • {new Date().getFullYear()}</p>
          <Link to="/admin" className="text-primary hover:underline mt-2 inline-block">
            Administration
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Index;
