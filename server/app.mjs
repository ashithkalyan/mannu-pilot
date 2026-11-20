import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computePlan, explain, numbersAreGrounded, summariseReadings, weatherAdvice } from '../engine/engine.mjs';
import { keywordIntent } from '../engine/intent.mjs';
import { fetchWeather, fetchSoilGrids } from './providers.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const RD = { no3_n_mgkg: [0, 500], no3_n_mgl_extract: [0, 500], ph: [3, 11], ec_dsm: [0, 20], moisture_pct: [0, 100], temp_c: [-5, 60] };

export function createApp({ gemini = null, store, fetchImpl = fetch, deviceKeys = (process.env.DEVICE_KEYS || '').split(',').filter(Boolean), adminKey = process.env.ADMIN_KEY } = {}) {
  const app = express();
  app.use(express.json({ limit: '6mb' }));
  app.use('/engine', express.static(path.join(here, '../engine')));
  app.use(express.static(path.join(here, '../web')));
  app.get('/api/health', (_q, r) => r.json({ ok: true, gemini: !!gemini, store: !!store }));

  app.post('/api/plan', async (q, r) => {
    try {
      const b = q.body || {}; const lang = b.lang === 'en' ? 'en' : 'kn'; const input = { ...b };
      if (!input.sensor && b.plotId && store) {
        const rows = (await store.list('readings', (x) => x.plotId === b.plotId)).slice(-30);
        if (rows.length) { const s = summariseReadings(rows); if (s.no3nMgKg != null) input.sensor = s; }
      }
      const plan = computePlan(input);
      let weather = null;
      if (plan.ok && b.lat != null && b.lon != null) { try { const w = await fetchWeather({ lat: b.lat, lon: b.lon, fetchImpl }); weather = { ...weatherAdvice(w.dailyPrecipMm), source: w.source }; } catch { /* optional */ } }
      plan.weather = weather;
      let text = explain(plan, lang), textSource = 'template';
      if (plan.ok && gemini) {
        try {
          const facts = { crop: plan.crop, acres: plan.acres, perAcre: plan.perAcre, schedule: plan.schedule, cost: plan.cost.perAcre, habit: plan.habit, flags: plan.flags };
          const g = await gemini.rephrase({ facts, draft: text, lang });
          if (g && numbersAreGrounded(g, plan).ok) { text = g; textSource = 'gemini'; }
        } catch { /* fall back to the template */ }
      }
      r.json({ plan, text, textSource });
    } catch (e) { r.status(400).json({ error: 'bad_request', detail: String(e.message || e) }); }
  });

  app.post('/api/card/parse', async (q, r) => {
    if (!gemini) return r.status(503).json({ error: 'ai_unavailable', fallback: 'manual' });
    const { imageBase64, mimeType } = q.body || {}; if (!imageBase64) return r.status(400).json({ error: 'no_image' });
    try { r.json(await gemini.parseCard({ imageBase64, mimeType })); } catch (e) { console.error('[card/parse error]', e?.message || e); r.status(502).json({ error: 'parse_failed', fallback: 'manual', detail: String(e?.message || e) }); }
  });
  app.post('/api/intent', async (q, r) => {
    const tr = String((q.body || {}).transcript || '').slice(0, 500); let out = keywordIntent(tr), source = 'keywords';
    if (gemini) { try { const g = await gemini.intent({ transcript: tr }); out = { crop: g.crop || out.crop, system: g.system || out.system, acres: g.acres ?? out.acres }; source = 'gemini'; } catch { /* keep keywords */ } }
    r.json({ ...out, source });
  });

  // Reader / field-dataset ingest. ESP32 reader, or any import of lab/field data.
  app.post('/api/readings', async (q, r) => {
    if (!deviceKeys.length) return r.status(503).json({ error: 'ingest_disabled' });
    if (!deviceKeys.includes(q.get('x-device-key'))) return r.status(401).json({ error: 'bad_device_key' });
    const b = q.body || {}; const plotId = String(b.plotId || '').slice(0, 64); if (!plotId) return r.status(400).json({ error: 'plotId_required' });
    const rows = (Array.isArray(b.readings) ? b.readings : [b]).slice(0, 200); let kept = 0, dropped = 0;
    for (const row of rows) {
      const clean = { plotId, ts: row.ts || new Date().toISOString(), deviceId: String(row.deviceId || '').slice(0, 32) }; let ok = false;
      for (const [k, [lo, hi]] of Object.entries(RD)) { const v = Number(row[k]); if (row[k] != null && Number.isFinite(v) && v >= lo && v <= hi) { clean[k] = v; if (k.startsWith('no3')) ok = true; } }
      if (ok) { await store.append('readings', clean); kept++; } else dropped++;
    }
    r.json({ kept, dropped });
  });
  app.get('/api/readings/:plotId', async (q, r) => {
    const rows = (await store.list('readings', (x) => x.plotId === q.params.plotId)).slice(-100); r.json({ summary: summariseReadings(rows), rows: rows.slice(-10) });
  });
  app.get('/api/context', async (q, r) => {
    const { lat, lon } = q.query; const out = {};
    if (lat == null || lon == null) return r.status(400).json({ error: 'lat_lon_required' });
    try { out.weather = await fetchWeather({ lat, lon, fetchImpl }); } catch { out.weather = null; }
    try { out.soilgrids = await fetchSoilGrids({ lat, lon, fetchImpl }); } catch { out.soilgrids = null; }
    r.json(out);
  });

  // Follow-up loop: outcomes become the pilot dataset (export to BigQuery).
  app.post('/api/outcome', async (q, r) => {
    const b = q.body || {}; if (!b.plotId || b.yieldKgAcre == null) return r.status(400).json({ error: 'plotId_and_yield_required' });
    await store.append('outcomes', { plotId: String(b.plotId).slice(0, 64), season: String(b.season || '').slice(0, 16), crop: b.crop, yieldKgAcre: Number(b.yieldKgAcre), ureaKgAcre: Number(b.ureaKgAcre ?? NaN), dapKgAcre: Number(b.dapKgAcre ?? NaN), followedPlan: !!b.followedPlan });
    r.json({ ok: true });
  });
  app.get('/api/export/outcomes.csv', async (q, r) => {
    if (adminKey && q.get('x-admin-key') !== adminKey) return r.status(401).end();
    const rows = await store.list('outcomes'); const cols = ['_ts', 'plotId', 'season', 'crop', 'yieldKgAcre', 'ureaKgAcre', 'dapKgAcre', 'followedPlan'];
    r.type('text/csv').send([cols.join(','), ...rows.map((x) => cols.map((c) => JSON.stringify(x[c] ?? '')).join(','))].join('\n'));
  });
  return app;
}
