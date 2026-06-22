# Calcolo Tasse & Guadagni

Web app a pagina singola per calcolare il prezzo con IVA e il guadagno reale dopo le detrazioni.
I dati vengono salvati su **MongoDB** tramite un piccolo backend serverless.

## Architettura

- **`index.html`** — la pagina (statica). Può essere ospitata su **GitHub Pages**.
- **`api/products.js`** — backend serverless per **Vercel** (tiene nascosta la password di Mongo).
- **`lib/db.js`** — connessione condivisa a MongoDB.
- **`server.js`** — server Express solo per provare in locale.

La pagina usa anche `localStorage`, quindi funziona offline e si carica all'istante;
quando il backend è raggiungibile sincronizza tutto su MongoDB.

---

## Provare in locale

```bash
npm install
npm start
```

Apri http://localhost:3000 . Le credenziali vengono lette dal file `.env`.

---

## Deploy

### 1) Backend su Vercel

1. Crea un account su https://vercel.com e installa la CLI: `npm i -g vercel`
2. Dalla cartella del progetto: `vercel` (segui le istruzioni).
3. Su Vercel → Project → **Settings → Environment Variables** aggiungi:
   - `MONGODB_URI` = la tua stringa di connessione Mongo
   - `DB_NAME` = `calcoloTasse`
4. Rifai il deploy: `vercel --prod`. Otterrai un URL tipo `https://calcolo-tasse.vercel.app`.

> ⚠️ NON mettere mai la password dentro `index.html` o nel repository pubblico.
> Vive solo nelle Environment Variables di Vercel e nel file `.env` locale (che è in `.gitignore`).

### 2) Pagina su GitHub Pages

1. In `index.html` imposta `API_BASE` con l'URL di Vercel del punto precedente:
   ```js
   const API_BASE = 'https://calcolo-tasse.vercel.app';
   ```
2. Carica `index.html` sul repo GitHub e attiva **Settings → Pages**.

Fatto: la pagina è su GitHub Pages e i dati vivono su MongoDB tramite Vercel.

---

## Sicurezza

La password del database non deve **mai** finire nel frontend né in un repo pubblico.
Se è stata esposta, cambiala da MongoDB Atlas → Database Access → Edit user → Edit Password.
