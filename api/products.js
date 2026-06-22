import { getCollection } from '../lib/db.js';

// CORS: la pagina su GitHub Pages è su un dominio diverso dal backend Vercel,
// quindi il browser ha bisogno di questi header per poter chiamare l'API.
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const col = await getCollection();

    if (req.method === 'GET') {
      const list = await col.find({}).sort({ order: 1 }).toArray();
      return res.status(200).json(list);
    }

    if (req.method === 'PUT') {
      const incoming = Array.isArray(req.body) ? req.body : [];
      // Riscrive l'intero stato. Semplice e affidabile per un'app personale.
      const docs = incoming.map((p, i) => {
        const { _id, order, ...rest } = p; // scarta eventuali campi interni in arrivo
        return { ...rest, order: i };
      });
      await col.deleteMany({});
      if (docs.length) await col.insertMany(docs);
      return res.status(200).json({ ok: true, count: docs.length });
    }

    res.setHeader('Allow', 'GET, PUT, OPTIONS');
    return res.status(405).json({ error: 'Metodo non consentito' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Errore del server' });
  }
}
