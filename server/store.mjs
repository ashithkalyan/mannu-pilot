import fs from 'node:fs';
import path from 'node:path';
// Default: JSON-lines file (single instance / demo). Production: set USE_FIRESTORE=1 and `npm i @google-cloud/firestore` (Cloud Run has ephemeral disk).
export function makeStore(dir = process.env.DATA_DIR || path.join(process.cwd(), 'data')) {
  if (process.env.USE_FIRESTORE === '1') return firestoreStore();
  fs.mkdirSync(dir, { recursive: true });
  const f = (k) => path.join(dir, k + '.jsonl');
  return { async append(kind, obj) { fs.appendFileSync(f(kind), JSON.stringify({ ...obj, _ts: new Date().toISOString() }) + '\n'); },
    async list(kind, pred = () => true) { if (!fs.existsSync(f(kind))) return []; return fs.readFileSync(f(kind), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter(pred); } };
}
function firestoreStore() {
  let db; const get = async () => db || (db = new (await import('@google-cloud/firestore')).Firestore());
  return { async append(kind, obj) { await (await get()).collection(kind).add({ ...obj, _ts: new Date().toISOString() }); },
    async list(kind, pred = () => true) { const s = await (await get()).collection(kind).orderBy('_ts').limitToLast(5000).get(); return s.docs.map((d) => d.data()).filter(pred); } };
}
