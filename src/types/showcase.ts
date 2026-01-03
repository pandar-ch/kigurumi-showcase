export interface ItemImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface DetailItem {
  id: string;
  label: string;
  value: string;
}

export interface DetailBlock {
  id: string;
  title: string;
  items: DetailItem[];
}

export interface ShowcaseItem {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  brand?: string;
  description?: string;
  tags: string[];
  images: ItemImage[];
  detailBlocks: DetailBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface ShowcaseData {
  title: string;
  description?: string;
  items: ShowcaseItem[];
  generatedAt: string;
}
