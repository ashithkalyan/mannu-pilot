import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { createApp } from '../server/app.mjs';
import { makeStore } from '../server/store.mjs';
import { validateCard } from '../server/gemini.mjs';
import { fetchWeather, fetchSoilGrids } from '../server/providers.mjs';
import { keywordIntent } from '../engine/intent.mjs';

const mockFetch = async (u) => ({ ok: true, json: async () => (String(u).includes('open-meteo') ? { daily: { precipitation_sum: [30, 5, 0], time: ['a', 'b', 'c'] } }
  : { properties: { layers: [{ name: 'phh2o', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 55 } }, { values: { mean: 57 } }] }, { name: 'nitrogen', unit_measure: { d_factor: 100 }, depths: [{ values: { mean: 150 } }] }] } }) });
async function boot(opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mannu-')); const app = createApp({ store: makeStore(dir), fetchImpl: mockFetch, deviceKeys: ['k1'], adminKey: 'adm', ...opts });
  const srv = await new Promise((res) => { const s = app.listen(0, () => res(s)); }); const base = `http://127.0.0.1:${srv.address().port}`;
  const post = (p, body, h = {}) => fetch(base + p, { method: 'POST', headers: { 'content-type': 'application/json', ...h }, body: JSON.stringify(body) });
  return { srv, base, post };
}
const body = { crop: 'ragi', system: 'rainfed', acres: 2, soil: { N: { cls: 'medium' } }, lang: 'en', lat: 13.1, lon: 77.6 };

test('plan endpoint: template mode, weather rule applied', async () => {
  const { srv, post } = await boot(); const j = await (await post('/api/plan', body)).json(); srv.close();
  assert.equal(j.plan.ok, true); assert.equal(j.textSource, 'template'); assert.equal(j.plan.weather.delayTopdress, true); assert.match(j.text, /Urea/);
});
test('Gemini rewrite is used only when every number is grounded', async () => {
  const good = { rephrase: async ({ draft }) => draft + '\nGood luck.' }, bad = { rephrase: async () => 'Apply 777 kg urea' };
  let t = await boot({ gemini: good }); let j = await (await t.post('/api/plan', body)).json(); t.srv.close(); assert.equal(j.textSource, 'gemini');
  t = await boot({ gemini: bad }); j = await (await t.post('/api/plan', body)).json(); t.srv.close(); assert.equal(j.textSource, 'template'); assert.ok(!j.text.includes('777'));
  t = await boot({ gemini: { rephrase: async () => { throw new Error('quota'); } } }); j = await (await t.post('/api/plan', body)).json(); t.srv.close(); assert.equal(j.textSource, 'template');
});
test('unverified crop returns a refusal and a KVK message, never a dose', async () => {
  const t = await boot(); const j = await (await t.post('/api/plan', { crop: 'tomato', system: 'irrigated', lang: 'en' })).json(); t.srv.close();
  assert.equal(j.plan.ok, false); assert.match(j.text, /KVK/);
});
test('reader ingest: auth, validation, then a stored reading changes the plan', async () => {
  const t = await boot();
  assert.equal((await t.post('/api/readings', { plotId: 'p1', no3_n_mgkg: 30 })).status, 401);
  assert.equal((await t.post('/api/readings', { plotId: 'p1', no3_n_mgkg: 30 }, { 'x-device-key': 'nope' })).status, 401);
  const rows = [30, 32, 31, 29].map((v) => ({ no3_n_mgkg: v })).concat([{ no3_n_mgkg: -5 }, { ph: 6 }]);
  const ing = await (await t.post('/api/readings', { plotId: 'p1', readings: rows }, { 'x-device-key': 'k1' })).json(); assert.deepEqual(ing, { kept: 4, dropped: 2 });
  const hi = { crop: 'ragi', system: 'irrigated', soil: { N: { value: 700 } }, lang: 'en', plotId: 'p1' };
  const j = await (await t.post('/api/plan', hi)).json(); t.srv.close(); assert.equal(j.plan.multipliers.N, 0.75); assert.ok(j.plan.flags.includes('experimental_reading'));
});
test('card parse: 503 without AI, validation rejects implausible values', async () => {
  let t = await boot(); assert.equal((await t.post('/api/card/parse', { imageBase64: 'x' })).status, 503); t.srv.close();
  const v = validateCard({ legible: true, N: 250, P: 9999, pH: 6.2, K: null }); assert.deepEqual(v.values, { N: 250, pH: 6.2 }); assert.deepEqual(v.rejected, ['P']);
  t = await boot({ gemini: { parseCard: async () => validateCard({ legible: true, N: 250 }) } }); const j = await (await t.post('/api/card/parse', { imageBase64: 'x' })).json(); t.srv.close(); assert.equal(j.values.N, 250);
});
test('intent: Kannada and English keywords', () => {
  assert.deepEqual(keywordIntent('ನನ್ನ ಎರಡು ಎಕರೆ ರಾಗಿ ಮಳೆಯಾಶ್ರಿತ'), { crop: 'ragi', system: 'rainfed', acres: 2 });
  assert.deepEqual(keywordIntent('3 acres of maize irrigated'), { crop: 'maize', system: 'irrigated', acres: 3 });
  assert.deepEqual(keywordIntent('೨.೫ ಎಕರೆ ಟೊಮೆಟೊ'), { crop: 'tomato', system: null, acres: 2.5 });
});
test('providers convert SoilGrids units and parse weather', async () => {
  const s = await fetchSoilGrids({ lat: 1, lon: 1, fetchImpl: mockFetch }); assert.equal(s.phh2o, 5.6); assert.equal(s.nitrogen, 1.5);
  assert.deepEqual((await fetchWeather({ lat: 1, lon: 1, fetchImpl: mockFetch })).dailyPrecipMm, [30, 5, 0]);
});
test('outcomes: stored and exported behind the admin key', async () => {
  const t = await boot(); assert.equal((await t.post('/api/outcome', { plotId: 'p1' })).status, 400);
  await t.post('/api/outcome', { plotId: 'p1', season: '2026K', crop: 'ragi', yieldKgAcre: 900, followedPlan: true });
  assert.equal((await fetch(t.base + '/api/export/outcomes.csv')).status, 401);
  const csv = await (await fetch(t.base + '/api/export/outcomes.csv', { headers: { 'x-admin-key': 'adm' } })).text(); t.srv.close(); assert.match(csv, /p1/);
});
