import { ShowcaseData, ShowcaseItem } from '@/types/showcase';

// Configure your backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || `HTTP ${response.status}`);
  }
  return response.json();
}

// ============================================
// SHOWCASE DATA API
// ============================================

export const showcaseApi = {
  // GET /api/showcase - Get all showcase data
  async getData(): Promise<ShowcaseData> {
    const response = await fetch(`${API_BASE_URL}/showcase`);
    return handleResponse<ShowcaseData>(response);
  },

  // PUT /api/showcase/metadata - Update title and description
  async updateMetadata(title: string, description?: string): Promise<ShowcaseData> {
    const response = await fetch(`${API_BASE_URL}/showcase/metadata`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    return handleResponse<ShowcaseData>(response);
  },

  // POST /api/showcase/import - Import full data
  async importData(data: ShowcaseData): Promise<ShowcaseData> {
    const response = await fetch(`${API_BASE_URL}/showcase/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ShowcaseData>(response);
  },
};

// ============================================
// ITEMS API
// ============================================

export const itemsApi = {
  // GET /api/items - Get all items
  async getAll(): Promise<ShowcaseItem[]> {
    const response = await fetch(`${API_BASE_URL}/items`);
    return handleResponse<ShowcaseItem[]>(response);
  },

  // GET /api/items/:id - Get single item
  async getById(id: string): Promise<ShowcaseItem> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    return handleResponse<ShowcaseItem>(response);
  },

  // POST /api/items - Create new item
  async create(item: Omit<ShowcaseItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<ShowcaseItem> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<ShowcaseItem>(response);
  },

  // PUT /api/items/:id - Update item
  async update(id: string, updates: Partial<Omit<ShowcaseItem, 'id' | 'createdAt'>>): Promise<ShowcaseItem> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<ShowcaseItem>(response);
  },

  // DELETE /api/items/:id - Delete item
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
  },
};

// ============================================
// IMAGES API
// ============================================

export const imagesApi = {
  // POST /api/images/upload - Upload image file
  // Returns: { url: string, filename: string }
  async upload(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<{ url: string; filename: string }>(response);
  },

  // DELETE /api/images/:filename - Delete image
  async delete(filename: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/images/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
  },
};
