import { MongoClient } from 'mongodb';

// Connessione riutilizzata tra le invocazioni (importante in ambiente serverless:
// evita di aprire una nuova connessione ad ogni richiesta).
let cached = globalThis._mongo;
if (!cached) cached = globalThis._mongo = { promise: null };

export async function getCollection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'calcoloTasse';
  if (!uri) throw new Error('Manca MONGODB_URI');

  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect();
  }
  const client = await cached.promise;
  return client.db(dbName).collection('products');
}
