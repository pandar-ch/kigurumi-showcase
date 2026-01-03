# API Backend - Documentation

URL de base: `http://localhost:3001/api` (configurable via `VITE_API_URL`)

## Endpoints

### Showcase Data

#### GET /api/showcase
Récupère toutes les données du showcase.

**Réponse:**
```json
{
  "title": "Ma Collection",
  "description": "Description de la collection",
  "items": [...],
  "generatedAt": "2024-01-03T12:00:00.000Z"
}
```

#### PUT /api/showcase/metadata
Met à jour le titre et la description.

**Corps:**
```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description"
}
```

**Réponse:** ShowcaseData complet mis à jour

#### POST /api/showcase/import
Importe des données complètes (remplace tout).

**Corps:** ShowcaseData complet

**Réponse:** ShowcaseData importé

---

### Items

#### GET /api/items
Liste tous les items.

**Réponse:** `ShowcaseItem[]`

#### GET /api/items/:id
Récupère un item par ID.

**Réponse:** `ShowcaseItem`

#### POST /api/items
Crée un nouvel item.

**Corps:**
```json
{
  "name": "Nom de l'item",
  "images": [],
  "tags": [],
  "detailBlocks": []
}
```

**Réponse:** ShowcaseItem créé (avec id, slug, createdAt, updatedAt générés)

#### PUT /api/items/:id
Met à jour un item.

**Corps:** Champs partiels à mettre à jour

**Réponse:** ShowcaseItem mis à jour

#### DELETE /api/items/:id
Supprime un item.

**Réponse:** 204 No Content

---

### Images

#### POST /api/images/upload
Upload une image (multipart/form-data).

**Corps:** FormData avec champ `image`

**Réponse:**
```json
{
  "url": "/uploads/abc123.jpg",
  "filename": "abc123.jpg"
}
```

#### DELETE /api/images/:filename
Supprime une image.

**Réponse:** 204 No Content

---

## Types TypeScript

```typescript
interface ShowcaseData {
  title: string;
  description?: string;
  items: ShowcaseItem[];
  generatedAt: string;
}

interface ShowcaseItem {
  id: string;
  slug: string;
  name: string;
  images: ItemImage[];
  tags: string[];
  detailBlocks: DetailBlock[];
  createdAt: string;
  updatedAt: string;
}

interface ItemImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

interface DetailBlock {
  id: string;
  title: string;
  items: DetailItem[];
}

interface DetailItem {
  id: string;
  label: string;
  value: string;
}
```

---

## Exemple Node.js/Express

```javascript
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const DATA_FILE = './data/showcase.json';

// Helper functions
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { title: 'Ma Collection', description: '', items: [], generatedAt: new Date().toISOString() };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Showcase routes
app.get('/api/showcase', (req, res) => {
  res.json(readData());
});

app.put('/api/showcase/metadata', (req, res) => {
  const data = readData();
  data.title = req.body.title;
  data.description = req.body.description;
  data.generatedAt = new Date().toISOString();
  writeData(data);
  res.json(data);
});

app.post('/api/showcase/import', (req, res) => {
  const data = { ...req.body, generatedAt: new Date().toISOString() };
  writeData(data);
  res.json(data);
});

// Items routes
app.get('/api/items', (req, res) => {
  res.json(readData().items);
});

app.get('/api/items/:id', (req, res) => {
  const item = readData().items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const data = readData();
  const now = new Date().toISOString();
  const newItem = {
    ...req.body,
    id: crypto.randomUUID(),
    slug: generateSlug(req.body.name),
    createdAt: now,
    updatedAt: now,
  };
  data.items.push(newItem);
  data.generatedAt = now;
  writeData(data);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const data = readData();
  const index = data.items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  const now = new Date().toISOString();
  data.items[index] = {
    ...data.items[index],
    ...req.body,
    slug: req.body.name ? generateSlug(req.body.name) : data.items[index].slug,
    updatedAt: now,
  };
  data.generatedAt = now;
  writeData(data);
  res.json(data.items[index]);
});

app.delete('/api/items/:id', (req, res) => {
  const data = readData();
  data.items = data.items.filter(i => i.id !== req.params.id);
  data.generatedAt = new Date().toISOString();
  writeData(data);
  res.status(204).send();
});

// Image upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/api/images/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

app.delete('/api/images/:filename', (req, res) => {
  const filepath = path.join('./uploads', req.params.filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  res.status(204).send();
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));
```

Installez les dépendances: `npm install express cors multer`
