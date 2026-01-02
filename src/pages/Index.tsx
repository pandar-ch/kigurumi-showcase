import { showcaseData } from "@/data/showcase-data";
import NavHeader from "@/components/showcase/NavHeader";
import ItemCard from "@/components/showcase/ItemCard";

const Index = () => {
  const { title, description, items } = showcaseData;

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

        {/* Footer */}
        <footer className="mt-16 md:mt-24 text-center text-sm text-muted-foreground/60 pb-8">
          <p>Collection personnelle • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
