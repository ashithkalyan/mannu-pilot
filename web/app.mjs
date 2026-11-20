import norms from '../engine/norms.mjs';
import { computePlan, explain, classify, summariseReadings, weatherAdvice, DEFAULTS } from '../engine/engine.mjs';
import { t } from '../engine/i18n.mjs';
import { keywordIntent } from '../engine/intent.mjs';

const X = {
  kn: { sample: 'ಮಾದರಿ ಮಾಹಿತಿ (ಕೃತಕ, ಪ್ರದರ್ಶನಕ್ಕೆ ಮಾತ್ರ)', data: 'ಜಮೀನಿನ ಮಾಹಿತಿ ಫೈಲ್ (ಐಚ್ಛಿಕ)', sowdate: 'ಬಿತ್ತನೆ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)', bags: 'ಚೀಲ', ph: 'ಮಣ್ಣಿನ pH (ಐಚ್ಛಿಕ)', readings: 'ಓದುವಿಕೆಗಳು: {n} · ನೈಟ್ರೇಟ್-N ಮಧ್ಯಮ {v} mg/kg', qcBad: 'ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ವಿಫಲ: ಈ ಮಾಹಿತಿ ಬಳಸಲಾಗುವುದಿಲ್ಲ', parsed: 'ಕಾರ್ಡ್‌ನಿಂದ ಓದಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಮೌಲ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.', manual: 'ಫೋಟೋ ಓದಲು ಆಗಲಿಲ್ಲ. ಮೌಲ್ಯಗಳನ್ನು ಕೈಯಿಂದ ಭರ್ತಿ ಮಾಡಿ.', heard: 'ಕೇಳಿದ್ದು', noVoice: 'ಈ ಫೋನ್‌ನಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ.', saved: 'ಉಳಿಸಲಾಗಿದೆ', mine: 'ನನ್ನ ಜಮೀನುಗಳು', yield: 'ಇಳುವರಿ (ಎಕರೆಗೆ ಕೆಜಿ)', add: 'ಸೇರಿಸಿ', export: 'ಮಾಹಿತಿ ಡೌನ್‌ಲೋಡ್ (CSV)', followed: 'ಸಲಹೆ ಪಾಲಿಸಿದೆ', demo: 'ಪ್ರದರ್ಶನ ಆವೃತ್ತಿ' },
  en: { sample: 'Sample data (synthetic, demo only)', data: 'Field data file (optional)', sowdate: 'Sowing date (optional)', bags: 'bags', ph: 'Soil pH (optional)', readings: 'Readings: {n} · median nitrate-N {v} mg/kg', qcBad: 'Quality check failed: this data will not be used', parsed: 'Read from the card. Please check the values.', manual: 'Could not read the photo. Please type the values.', heard: 'Heard', noVoice: 'No Kannada voice on this phone.', saved: 'Saved', mine: 'My plots', yield: 'Yield (kg per acre)', add: 'Add', export: 'Download data (CSV)', followed: 'Followed the advice', demo: 'Demo version' }
};
const L = () => S.lang; const tx = (k, v = {}) => { let s = (X[L()] && X[L()][k]) || X.en[k] || k; for (const [a, b] of Object.entries(v)) s = s.replaceAll('{' + a + '}', b); return s; };
const $ = (s, r = document) => r.querySelector(s);
const def = { lang: 'kn', crop: 'ragi', system: 'rainfed', acres: 1, soil: { N: {}, P: {}, K: {} }, ph: '', habitUrea: '', habitDap: '', sowing: '', reading: null, readingRows: null, plots: [], plan: null, text: '', online: false };
let S = { ...def };
try { Object.assign(S, JSON.parse(localStorage.getItem('mannu.v1') || '{}'), { plan: null, text: '', online: false }); } catch { /* private mode */ }
const save = () => { try { localStorage.setItem('mannu.v1', JSON.stringify({ ...S, plan: null, text: '' })); } catch { /* ignore */ } };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COL = { urea: '#34A853', dap: '#4285F4', mop: '#F9AB00' };
const bag = (f, c) => `<svg class="bag" viewBox="0 0 30 38" width="30" height="38" aria-hidden="true"><path d="M5 6h20l3 6v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V12z" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="3" y="${(35 - 23 * f).toFixed(1)}" width="24" height="${(23 * f).toFixed(1)}" fill="${c}" opacity=".85"/></svg>`;
const icons = (n, c) => { let h = ''; for (let i = 0; i < Math.floor(n); i++) h += bag(1, c); if (n - Math.floor(n) >= 0.5) h += bag(0.5, c); return h; };
const crops = ['ragi', 'maize', 'tomato'];

function view() {
  const l = L(), nk = (k) => t(l, k), cls = ['unknown', 'low', 'medium', 'high'];
  const soilRow = (k) => `<b>${nk(k)}</b><div><label for="cls${k}">${nk('soil')}</label><select id="cls${k}">${cls.map((c) => `<option value="${c === 'unknown' ? '' : c}" ${((S.soil[k].cls || '') === (c === 'unknown' ? '' : c)) ? 'selected' : ''}>${nk(c)}</option>`).join('')}</select></div><div><label for="val${k}">kg/ha</label><input id="val${k}" type="number" inputmode="decimal" min="0" value="${S.soil[k].value ?? ''}"></div>`;
  $('#app').innerHTML = `
  <section><div class="row"><button class="sec" data-act="speak" id="btnSpeak">🎤 ${nk('speak')}</button><label class="btn sec" for="fileCard" style="margin:0;color:#fff">📷 ${nk('photo')}</label></div>
  <input id="fileCard" type="file" accept="image/*" capture="environment" hidden><div class="mut" id="heard"></div></section>
  <section><h2>${nk('pickCrop')}</h2><div class="row">${crops.map((c) => `<button data-crop="${c}" class="${S.crop === c ? 'sel' : ''}">${nk(c)}</button>`).join('')}</div>
  <label>${nk('water')}</label><div class="row">${['rainfed', 'irrigated'].map((w) => `<button data-system="${w}" class="${S.system === w ? 'sel' : ''}">${nk(w)}</button>`).join('')}</div>
  <label for="acres">${nk('area')}</label><input id="acres" type="number" inputmode="decimal" min="0.25" step="0.25" value="${S.acres}"></section>
  <section><h2>${nk('soil')}</h2><div class="n3">${['N', 'P', 'K'].map(soilRow).join('')}</div>
  <label for="ph">${tx('ph')}</label><input id="ph" type="number" step="0.1" value="${S.ph}"></section>
  <section><h2>${tx('data')}</h2><div class="row"><label class="btn" for="fileData" style="margin:0">📄 CSV / JSON</label><button data-act="sample" id="btnSample">${tx('sample')}</button></div>
  <input id="fileData" type="file" accept=".csv,.json" hidden><div id="readingInfo" class="mut">${readingInfo()}</div></section>
  <section><h2>${nk('habit')}</h2><div class="row"><div><label for="hu">${nk('urea')} (${tx('bags')})</label><input id="hu" type="number" inputmode="decimal" min="0" step="0.5" value="${S.habitUrea}"></div>
  <div><label for="hd">${nk('dap')} (${tx('bags')})</label><input id="hd" type="number" inputmode="decimal" min="0" step="0.5" value="${S.habitDap}"></div></div>
  <label for="sow">${tx('sowdate')}</label><input id="sow" type="date" value="${S.sowing}"></section>
  <button class="primary" id="btnPlan" data-act="plan">${nk('plan')}</button><div id="result">${S.plan ? result() : ''}</div>${plots()}
  <p class="mut">${nk('disclaimer')}</p>`;
  $('#tag').textContent = nk('tagline'); $('#langBtn').textContent = l === 'kn' ? 'EN' : 'ಕನ್ನಡ'; $('#net').textContent = S.online ? '● online' : '○ ' + nk('offline'); document.documentElement.lang = l;
}
function readingInfo() { const r = S.reading; if (!r) return ''; return r.qcOk ? tx('readings', { n: r.n, v: r.no3nMgKg }) : `<span class="bad">${tx('qcBad')}</span>`; }

function result() {
  const p = S.plan, l = L(), nk = (k) => t(l, k);
  if (!p.ok) return `<section><div class="warn err">${esc(explain(p, l))}</div>${p.note ? `<p class="mut">${esc(p.note)}</p>` : ''}</section>`;
  const stage = (s) => (s.dasFrom === 0 ? nk('sowing') : t(l, 'after', { a: s.dasFrom, b: s.dasTo })) + (s.dueFrom ? ` (${s.dueFrom} → ${s.dueTo})` : '');
  const steps = p.schedule.map((s) => `<div class="step"><h3>${stage(s)} · ${nk('perAcre')}</h3><div class="prods">${['urea', 'dap', 'mop'].filter((k) => s.perAcre[k].kg > 0).map((k) => `<div class="p"><div class="icons">${icons(s.perAcre[k].bags, COL[k])}</div><b>${nk(k)}</b><span>${s.perAcre[k].kg} ${nk('kg')}</span></div>`).join('')}</div></div>`).join('');
  const h = p.habit, notes = [];
  if (p.weather && p.weather.delayTopdress) notes.push(nk('rain'));
  if (p.voi) notes.push(p.voi.worthReading ? t(l, 'readingWorth', { c: p.voi.readingCost, v: p.voi.inrPerAcre }) : nk('readingNo'));
  for (const f of ['experimental_reading', 'acidic', 'saline']) if (p.flags.includes(f)) notes.push(nk(f === 'experimental_reading' ? 'experimental' : f));
  if (p.flags.includes('reading_rejected_qc')) notes.push(tx('qcBad'));
  if (p.cost.unconfirmedPrices.length) notes.push(t(l, 'priceConfirm', { x: p.cost.unconfirmedPrices.map(nk).join(', ') }));
  const pl = p.plot;
  return `<section id="plan"><h2>${nk(p.crop)} · ${p.acres} ${nk('acre')} · ${nk(p.system)}</h2>${steps}
  ${p.perAcre.fymTonnes ? `<p>${t(l, 'fym', { t: p.perAcre.fymTonnes })}</p>` : ''}
  <p class="tot">${nk('plot')} (${p.acres} ${nk('acre')}): ${nk('urea')} ${pl.urea.bags} · ${nk('dap')} ${pl.dap.bags} · ${nk('mop')} ${pl.mop.bags} ${nk('bag')}</p>
  <p>${nk('cost')} ${nk('perAcre')}: <b>₹${p.cost.perAcre}</b>${h ? ` · <span class="${h.savingPerAcre >= 0 ? 'good' : 'bad'}">${h.savingPerAcre >= 0 ? nk('saving') : nk('extra')}: ₹${Math.abs(h.savingPerAcre)}</span>` : ''}</p>
  ${notes.map((n) => `<div class="warn">${esc(n)}</div>`).join('')}
  <pre id="adviceText">${esc(S.text)}</pre>
  <div class="row"><button data-act="read">🔊 ${nk('read')}</button><button data-act="share">💬 ${nk('share')}</button><button data-act="savePlot">💾 ${nk('save')}</button></div></section>`;
}
function plots() {
  if (!S.plots.length) return '';
  return `<section><h2>${tx('mine')}</h2>${S.plots.map((p, i) => `<div class="warn"><b>${esc(t(L(), p.crop))}</b> · ${p.acres} ${t(L(), 'acre')} · ${esc(p.date)} · ₹${p.cost}${p.yield ? ` · ${p.yield} kg` : `<div class="row" style="margin-top:6px"><input data-y="${i}" type="number" placeholder="${tx('yield')}" aria-label="${tx('yield')}"><button data-act="addYield" data-i="${i}">${tx('add')}</button></div>`}</div>`).join('')}<button data-act="export">${tx('export')}</button></section>`;
}

async function api(path, body, ms = 8000) {
  const r = await fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(ms) } : { signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error('http_' + r.status); return r.json();
}
function collect() {
  const num = (id) => { const v = $('#' + id).value; return v === '' ? null : Number(v); };
  for (const k of ['N', 'P', 'K']) { S.soil[k] = { cls: $('#cls' + k).value || undefined, value: num('val' + k) ?? undefined }; if (S.soil[k].value != null) S.soil[k].cls = undefined; }
  S.acres = num('acres') || 1; S.ph = $('#ph').value; S.habitUrea = $('#hu').value; S.habitDap = $('#hd').value; S.sowing = $('#sow').value;
}
async function plan() {
  collect();
  const habit = (S.habitUrea !== '' || S.habitDap !== '') ? { ureaKgAcre: Number(S.habitUrea || 0) * norms.fertilisers.urea.bagKg, dapKgAcre: Number(S.habitDap || 0) * norms.fertilisers.dap.bagKg } : null;
  const input = { crop: S.crop, system: S.system, acres: S.acres, soil: { ...S.soil, pH: S.ph === '' ? undefined : Number(S.ph) }, sensor: S.reading, habit, sowingDate: S.sowing || null };
  let p = computePlan(input); S.text = explain(p, S.lang);
  if (p.ok && S.online) { // optional online extras: Gemini wording + weather rule (the numbers always come from the same engine)
    try {
      const pos = await new Promise((res) => navigator.geolocation ? navigator.geolocation.getCurrentPosition((g) => res(g.coords), () => res(null), { timeout: 4000 }) : res(null));
      const r = await api('/api/plan', { ...input, lang: S.lang, lat: pos?.latitude, lon: pos?.longitude }); if (r.plan && r.plan.ok) { p = r.plan; S.text = r.text; }
    } catch { /* stay offline-first */ }
  }
  S.plan = p; save(); $('#result').innerHTML = result(); $('#result').scrollIntoView?.({ behavior: 'smooth' });
}
function toast(msg) { $('#heard').textContent = msg; }
function parseCsv(text) { const [h, ...rest] = text.trim().split(/\r?\n/); const cols = h.split(',').map((c) => c.trim()); return rest.filter(Boolean).map((line) => Object.fromEntries(line.split(',').map((v, i) => [cols[i], v.trim() === '' ? undefined : Number.isNaN(Number(v)) ? v.trim() : Number(v)]))); }
const SAMPLE = [31, 29, 33, 30, 28, 32, 34, 27, 30, 31, 29, 35].map((v, i) => ({ no3_n_mgkg: v, ph: 6.1 + (i % 3) * 0.1, moisture_pct: 28, ts: 'demo' }));
function setReadings(rows) { S.readingRows = rows; S.reading = summariseReadings(rows); save(); $('#readingInfo').innerHTML = readingInfo(); }

document.addEventListener('click', async (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.crop) { collect(); S.crop = b.dataset.crop; if (S.crop === 'maize') S.system = 'irrigated'; S.plan = null; save(); view(); }
  else if (b.dataset.system) { collect(); S.system = b.dataset.system; S.plan = null; save(); view(); }
  else if (b.dataset.act === 'lang') { collect(); S.lang = S.lang === 'kn' ? 'en' : 'kn'; if (S.plan) S.text = explain(S.plan, S.lang); save(); view(); }
  else if (b.dataset.act === 'plan') plan();
  else if (b.dataset.act === 'sample') setReadings(SAMPLE);
  else if (b.dataset.act === 'read') { const u = new SpeechSynthesisUtterance(S.text); u.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN'; const v = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(S.lang)); if (!v && S.lang === 'kn') toast(tx('noVoice')); else { if (v) u.voice = v; speechSynthesis.cancel(); speechSynthesis.speak(u); } }
  else if (b.dataset.act === 'share') window.open('https://wa.me/?text=' + encodeURIComponent('Mannu\n' + S.text), '_blank');
  else if (b.dataset.act === 'savePlot' && S.plan?.ok) { S.plots.unshift({ crop: S.plan.crop, acres: S.plan.acres, cost: S.plan.cost.perAcre, date: new Date().toISOString().slice(0, 10) }); save(); toast(tx('saved')); const sec = document.querySelector('#app'); view(); S.plan && ($('#result').innerHTML = result()); }
  else if (b.dataset.act === 'addYield') { const v = Number(document.querySelector(`[data-y="${b.dataset.i}"]`).value); if (v > 0) { S.plots[b.dataset.i].yield = v; save(); view(); if (S.online) api('/api/outcome', { plotId: 'plot' + b.dataset.i, crop: S.plots[b.dataset.i].crop, yieldKgAcre: v, followedPlan: true }).catch(() => { }); } }
  else if (b.dataset.act === 'export') { const csv = 'crop,acres,date,cost_per_acre,yield_kg_acre\n' + S.plots.map((p) => [p.crop, p.acres, p.date, p.cost, p.yield ?? ''].join(',')).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'mannu-plots.csv'; a.click(); }
  else if (b.dataset.act === 'speak') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return toast(tx('manual'));
    const rec = new SR(); rec.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN'; rec.onresult = async (ev) => {
      const tr = ev.results[0][0].transcript; toast(tx('heard') + ': ' + tr); let it = keywordIntent(tr); if (S.online) { try { it = { ...it, ...(await api('/api/intent', { transcript: tr })) }; } catch { /* keywords */ } }
      if (it.crop) S.crop = it.crop; if (it.system) S.system = it.system; if (it.acres) S.acres = it.acres; S.plan = null; save(); view(); toast(tx('heard') + ': ' + tr);
    }; rec.start();
  }
});
document.addEventListener('change', async (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  if (e.target.id === 'fileData') { try { const txt = await f.text(); setReadings(f.name.endsWith('.json') ? [].concat(JSON.parse(txt)) : parseCsv(txt)); } catch { toast(tx('qcBad')); } }
  if (e.target.id === 'fileCard') {
    try {
      const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });
      const j = await api('/api/card/parse', { imageBase64: data, mimeType: f.type || 'image/jpeg' }, 90000);
      for (const k of ['N', 'P', 'K']) if (j.values?.[k] != null) S.soil[k] = { value: j.values[k] }; if (j.values?.pH != null) S.ph = j.values.pH; save(); view(); toast(tx('parsed'));
    } catch { toast(tx('manual')); }
  }
});
(async () => { try { await api('/api/health', null, 1500); S.online = true; } catch { S.online = false; } view(); })();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !location.hostname.endsWith('claude.ai')) navigator.serviceWorker.register('sw.js').catch(() => { });
