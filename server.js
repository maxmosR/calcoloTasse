// Server SOLO per provare in locale (npm start).
// In produzione il backend gira come funzione serverless su Vercel (cartella /api).
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCollection } from './lib/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

app.get('/api/products', async (req, res) => {
  try {
    const col = await getCollection();
    const list = await col.find({}).sort({ order: 1 }).toArray();
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Errore nel caricamento' });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const col = await getCollection();
    const incoming = Array.isArray(req.body) ? req.body : [];
    const docs = incoming.map((p, i) => {
      const { _id, order, ...rest } = p;
      return { ...rest, order: i };
    });
    await col.deleteMany({});
    if (docs.length) await col.insertMany(docs);
    res.json({ ok: true, count: docs.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Locale: http://localhost:${PORT}`);
});
