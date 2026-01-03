import { ShowcaseData } from "@/types/showcase";

export const showcaseData: ShowcaseData = {
  title: "Ma Collection Kigurumi",
  description: "Une vitrine de ma collection personnelle de kigurumi et costumes.",
  generatedAt: new Date().toISOString(),
  items: [
    {
      id: "1",
      slug: "pikachu-premium",
      name: "Pikachu Premium",
      subtitle: "Édition collector",
      brand: "SAZAC",
      description: "Un kigurumi Pikachu de haute qualité avec des détails brodés et un tissu polaire ultra-doux. Parfait pour les soirées gaming ou les conventions.",
      tags: ["Pokémon", "Électrique", "Hiver", "Collector"],
      images: [
        {
          id: "img-1-1",
          url: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80",
          alt: "Kigurumi Pikachu vue de face",
          position: 0,
        },
        {
          id: "img-1-2",
          url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80",
          alt: "Détail du tissu",
          position: 1,
        },
        {
          id: "img-1-3",
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          alt: "Kigurumi porté",
          position: 2,
        },
      ],
      detailBlocks: [
        {
          id: "detail-1-1",
          title: "Caractéristiques",
          items: [
            { id: "d1", label: "Matière", value: "Polaire 100% polyester" },
            { id: "d2", label: "Taille", value: "M (165-175cm)" },
            { id: "d3", label: "Poids", value: "450g" },
          ],
        },
        {
          id: "detail-1-2",
          title: "Entretien",
          items: [
            { id: "d4", label: "Lavage", value: "30°C max" },
            { id: "d5", label: "Séchage", value: "À l'air libre" },
            { id: "d6", label: "Repassage", value: "Non recommandé" },
          ],
        },
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      slug: "totoro-ghibli",
      name: "Totoro",
      subtitle: "Mon voisin préféré",
      brand: "Studio Ghibli Official",
      description: "Le célèbre esprit de la forêt en version kigurumi. Avec son ventre beige caractéristique et ses oreilles pointues.",
      tags: ["Ghibli", "Classique", "Toutes saisons", "Cozy"],
      images: [
        {
          id: "img-2-1",
          url: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&q=80",
          alt: "Kigurumi Totoro",
          position: 0,
        },
        {
          id: "img-2-2",
          url: "https://images.unsplash.com/photo-1596460107916-430662021049?w=800&q=80",
          alt: "Détails Totoro",
          position: 1,
        },
      ],
      detailBlocks: [
        {
          id: "detail-2-1",
          title: "Caractéristiques",
          items: [
            { id: "d7", label: "Matière", value: "Flanelle douce" },
            { id: "d8", label: "Taille", value: "L (175-185cm)" },
            { id: "d9", label: "Couleur", value: "Gris / Beige" },
          ],
        },
        {
          id: "detail-2-2",
          title: "Provenance",
          items: [
            { id: "d10", label: "Licence", value: "Officielle Studio Ghibli" },
            { id: "d11", label: "Origine", value: "Japon" },
            { id: "d12", label: "Année", value: "2023" },
          ],
        },
      ],
      createdAt: "2024-02-20T14:30:00Z",
      updatedAt: "2024-02-20T14:30:00Z",
    },
    {
      id: "3",
      slug: "stitch-alien",
      name: "Stitch",
      subtitle: "Expérience 626",
      brand: "Disney Store",
      description: "L'adorable alien bleu de Lilo & Stitch. Capuche avec grandes oreilles et queue intégrée.",
      tags: ["Disney", "Alien", "Fun", "Été"],
      images: [
        {
          id: "img-3-1",
          url: "https://images.unsplash.com/photo-1531747056220-2b10b1c8f0d4?w=800&q=80",
          alt: "Kigurumi Stitch",
          position: 0,
        },
      ],
      detailBlocks: [
        {
          id: "detail-3-1",
          title: "Caractéristiques",
          items: [
            { id: "d13", label: "Matière", value: "Polaire légère" },
            { id: "d14", label: "Taille", value: "M (165-175cm)" },
            { id: "d15", label: "Couleur", value: "Bleu électrique" },
          ],
        },
      ],
      createdAt: "2024-03-10T09:15:00Z",
      updatedAt: "2024-03-10T09:15:00Z",
    },
  ],
};
