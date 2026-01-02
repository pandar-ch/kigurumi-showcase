import { ShowcaseItem } from "@/types/showcase";

interface NavHeaderProps {
  title: string;
  items: ShowcaseItem[];
}

const NavHeader = ({ title, items }: NavHeaderProps) => {
  const scrollToItem = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-semibold text-gradient">{title}</h1>
          
          <nav className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToItem(item.slug)}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-all duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
