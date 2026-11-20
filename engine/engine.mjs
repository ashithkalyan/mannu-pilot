// Mannu dose engine: deterministic, no LLM, no network. Runs identically in the browser (offline) and on the server.
import norms from './norms.mjs';
import { t } from './i18n.mjs';

export const ACRE_PER_HA = 2.47105;
export const CL = ['low', 'medium', 'high'];
// ASSUMPTIONS (tunable; to be estimated from pilot data, see README):
export const DEFAULTS = {
  // P(plot class | card class): a card is a grid-level estimate, so it only partly describes one plot. Rows = card class, cols = true plot class.
  cardAgreement: { low: [0.6, 0.35, 0.05], medium: [0.175, 0.65, 0.175], high: [0.05, 0.35, 0.6] },
  // P(reading class | true class): a plot reading is informative but imperfect. Rows = true class, cols = observed class.
  sensorLik: { low: [0.7, 0.25, 0.05], medium: [0.15, 0.7, 0.15], high: [0.05, 0.25, 0.7] },
  // Under-applying costs more than over-applying for N (yield loss); P and K have residual effects.
  underFactor: { N: 2, P: 1, K: 1 },
  readingCostInr: 50,
  nitrateCriticalMgKg: 25, // pre-sidedress nitrate test critical value for US corn; NOT validated for ragi/maize in Karnataka.
};
const r1 = (x) => Math.round(x * 10) / 10;
const halfBag = (kg, bagKg) => Math.round((kg / bagKg) * 2) / 2;
const normalise = (v) => { const s = v.reduce((a, b) => a + b, 0); return v.map((x) => x / s); };

export function classify(nutrient, value, n = norms) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const c = n.soilClasses[nutrient];
  return value < c.low ? 'low' : value > c.high ? 'high' : 'medium';
}
export const priorFor = (cls, agr = DEFAULTS.cardAgreement) => (cls ? [...agr[cls]] : [1 / 3, 1 / 3, 1 / 3]);
export function posterior(prior, obsCls, lik = DEFAULTS.sensorLik) {
  const o = CL.indexOf(obsCls);
  return normalise(prior.map((p, i) => p * lik[CL[i]][o]));
}
// Bayes decision over the three allowed dose multipliers.
export function decide(post, rdfKgHa, pricePerKg, under, mult = norms.classMultiplier) {
  const m = CL.map((c) => mult[c]);
  const losses = CL.map((_, j) => post.reduce((s, p, i) => { const d = m[j] - m[i]; return s + p * (d >= 0 ? d : -d * under) * rdfKgHa * pricePerKg; }, 0));
  let best = 1; losses.forEach((l, j) => { if (l < losses[best] - 1e-9) best = j; });
  return { cls: CL[best], multiplier: m[best], losses };
}
// Value of information (INR/ha) of one imperfect reading for one nutrient.
export function valueOfInformation(prior, rdfKgHa, pricePerKg, under, lik = DEFAULTS.sensorLik) {
  const el0 = Math.min(...decide(prior, rdfKgHa, pricePerKg, under).losses);
  let ev = 0;
  for (let s = 0; s < 3; s++) {
    const ps = prior.reduce((a, p, i) => a + p * lik[CL[i]][s], 0);
    if (ps <= 0) continue;
    const post = normalise(prior.map((p, i) => p * lik[CL[i]][s]));
    ev += ps * Math.min(...decide(post, rdfKgHa, pricePerKg, under).losses);
  }
  return Math.max(0, el0 - ev);
}
export const nutrientPrices = (prices, n = norms) => ({
  N: prices.urea / (n.fertilisers.urea.bagKg * n.fertilisers.urea.N),
  P2O5: prices.dap / (n.fertilisers.dap.bagKg * n.fertilisers.dap.P2O5),
  K2O: prices.mop / (n.fertilisers.mop.bagKg * n.fertilisers.mop.K2O),
});

// ---------- plot reading (ion-selective electrode or imported dataset) ----------
export const nernstSlope = (tempC = 25) => 0.1984 * (tempC + 273.15); // mV/decade, 59.16 at 25C
export function calibrate(points, ion = 'NO3', tempC = 25) {
  const pts = points.filter((p) => p.conc > 0 && Number.isFinite(p.mv));
  if (pts.length < 2) return { ok: false, reason: 'need_two_points' };
  const xs = pts.map((p) => Math.log10(p.conc)), ys = pts.map((p) => p.mv), n = pts.length;
  const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0), sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
  if (sxx === 0) return { ok: false, reason: 'same_concentration' };
  const slope = sxy / sxx, intercept = my - slope * mx;
  const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  const signOk = ion === 'NO3' ? slope < 0 : slope > 0; // anion electrode falls, cation electrode rises
  const mag = Math.abs(slope), ideal = nernstSlope(tempC);
  const ok = signOk && mag >= 0.85 * ideal && mag <= 1.05 * ideal;
  return { ok, slope, intercept, r2, tempC, ion, reason: ok ? null : (signOk ? 'slope_out_of_range' : 'wrong_slope_sign') };
}
export function mvToConc(mv, cal, tempC = cal.tempC) {
  const slope = cal.slope * ((tempC + 273.15) / (cal.tempC + 273.15));
  return Math.pow(10, (mv - cal.intercept) / slope);
}
export const extractToSoil = (concMgL, { waterMl = 50, soilG = 10 } = {}) => concMgL * waterMl / soilG;
export function classifyNitrate(no3nMgKg, crit = DEFAULTS.nitrateCriticalMgKg) {
  if (!Number.isFinite(no3nMgKg)) return null;
  return no3nMgKg < crit / 2 ? 'low' : no3nMgKg < crit ? 'medium' : 'high';
}
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
// rows: [{no3_n_mgkg | no3_n_mgl_extract, ph, ec_dsm, moisture_pct, temp_c, ts}] -> robust summary + QC
export function summariseReadings(rows, extract = { waterMl: 50, soilG: 10 }) {
  const no3 = rows.map((r) => (r.no3_n_mgkg != null ? Number(r.no3_n_mgkg) : r.no3_n_mgl_extract != null ? extractToSoil(Number(r.no3_n_mgl_extract), extract) : NaN)).filter(Number.isFinite);
  const col = (k) => rows.map((r) => Number(r[k])).filter(Number.isFinite);
  const flags = [];
  if (no3.length < 3) flags.push('few_readings');
  const med = no3.length ? median(no3) : NaN;
  if (no3.length >= 3 && med > 0) { const mad = median(no3.map((x) => Math.abs(x - med))); if (mad / med > 0.5) flags.push('noisy'); }
  const moist = col('moisture_pct'); if (moist.length && (median(moist) < 10 || median(moist) > 60)) flags.push('moisture_out_of_range');
  return { n: no3.length, no3nMgKg: Number.isFinite(med) ? r1(med) : null, ph: col('ph').length ? r1(median(col('ph'))) : null,
    ecDsm: col('ec_dsm').length ? r1(median(col('ec_dsm'))) : null, moisturePct: moist.length ? r1(median(moist)) : null, qcOk: no3.length >= 3 && !flags.includes('noisy'), flags };
}
export function weatherAdvice(dailyPrecipMm = [], thresholdMm = 25) {
  const mm = r1((dailyPrecipMm[0] || 0) + (dailyPrecipMm[1] || 0));
  return { mm, delayTopdress: mm >= thresholdMm, thresholdMm };
}
const addDays = (iso, d) => { const x = new Date(iso + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + d); return x.toISOString().slice(0, 10); };

// ---------- the plan ----------
export function computePlan(inp, n = norms) {
  const { crop, system, acres = 1, soil = {}, sensor = null, habit = null, sowingDate = null, opts = {} } = inp;
  const cdef = n.crops[crop];
  if (!cdef) return { ok: false, reason: 'unknown_crop' };
  const sdef = cdef.systems[system];
  if (!sdef) return { ok: false, reason: 'unknown_system' };
  if (sdef.status !== 'verified-literature' && !opts.allowUnverified) return { ok: false, reason: 'norms_unverified', crop, system, note: sdef.note, range: sdef.range };
  if (!sdef.rdf) return { ok: false, reason: 'norms_unverified', crop, system, note: sdef.note };
  const prices = { urea: n.fertilisers.urea.price, dap: n.fertilisers.dap.price, mop: n.fertilisers.mop.price, ...(inp.prices || {}) };
  const unconfirmed = ['urea', 'dap', 'mop'].filter((k) => !(inp.prices && inp.prices[k] != null) && !String(n.fertilisers[k].priceStatus).startsWith('verified'));
  const flags = [];
  const cfg = { ...DEFAULTS, ...(opts.assume || {}) };
  const np = nutrientPrices(prices, n);
  const nut = { N: ['N', 'N'], P: ['P', 'P2O5'], K: ['K', 'K2O'] };

  const cardCls = {}, post = {}, mult = {}, conf = {}, adj = {};
  for (const k of ['N', 'P', 'K']) {
    const s = soil[k] || {};
    cardCls[k] = s.cls || classify(k, s.value, n);
    post[k] = priorFor(cardCls[k], cfg.cardAgreement);
  }
  let sensorCls = null;
  if (sensor && sensor.no3nMgKg != null) {
    if (sensor.qcOk === false) flags.push('reading_rejected_qc');
    else { sensorCls = classifyNitrate(sensor.no3nMgKg, cfg.nitrateCriticalMgKg); post.N = posterior(post.N, sensorCls, cfg.sensorLik); flags.push('experimental_reading'); }
  }
  for (const k of ['N', 'P', 'K']) {
    const key = nut[k][1];
    const d = decide(post[k], sdef.rdf[key], np[key], cfg.underFactor[k], n.classMultiplier);
    mult[k] = d.multiplier; conf[k] = r1(Math.max(...post[k]) * 100) / 100; adj[key] = r1(sdef.rdf[key] * d.multiplier);
  }
  // fertiliser arithmetic per hectare
  const F = n.fertilisers;
  const dapHa = adj.P2O5 / F.dap.P2O5, nFromDap = dapHa * F.dap.N, mopHa = adj.K2O / F.mop.K2O;
  const step = (s) => {
    const nTarget = s.fracN * adj.N;
    const ureaHa = Math.max(0, (s.dasFrom === 0 ? nTarget - nFromDap : nTarget) / F.urea.N);
    return { ureaHa, dapHa: s.dasFrom === 0 ? dapHa : 0, mopHa: s.dasFrom === 0 ? mopHa : 0 };
  };
  const steps = sdef.split.map((s) => ({ s, ...step(s) }));
  const ureaTotHa = steps.reduce((a, x) => a + x.ureaHa, 0);
  const kg = (ha) => r1(ha / ACRE_PER_HA);
  const item = (ha, bag) => ({ kg: kg(ha), bags: halfBag(kg(ha), bag) });
  const perAcre = { urea: item(ureaTotHa, F.urea.bagKg), dap: item(dapHa, F.dap.bagKg), mop: item(mopHa, F.mop.bagKg), fymTonnes: r1((sdef.fymTha || 0) / ACRE_PER_HA) };
  const plot = { urea: item(ureaTotHa * acres * ACRE_PER_HA, F.urea.bagKg), dap: item(dapHa * acres * ACRE_PER_HA, F.dap.bagKg), mop: item(mopHa * acres * ACRE_PER_HA, F.mop.bagKg) };
  const schedule = steps.map((x) => ({ id: x.s.id, dasFrom: x.s.dasFrom, dasTo: x.s.dasTo,
    dueFrom: sowingDate ? addDays(sowingDate, x.s.dasFrom) : null, dueTo: sowingDate ? addDays(sowingDate, x.s.dasTo) : null,
    perAcre: { urea: item(x.ureaHa, F.urea.bagKg), dap: item(x.dapHa, F.dap.bagKg), mop: item(x.mopHa, F.mop.bagKg) } }));
  const costPerAcre = Math.round(perAcre.urea.kg * prices.urea / F.urea.bagKg + perAcre.dap.kg * prices.dap / F.dap.bagKg + perAcre.mop.kg * prices.mop / F.mop.bagKg);
  // compare with what the farmer usually applies
  let habitOut = null;
  if (habit && (habit.ureaKgAcre != null || habit.dapKgAcre != null)) {
    const u = Number(habit.ureaKgAcre || 0), d = Number(habit.dapKgAcre || 0), m = Number(habit.mopKgAcre || 0);
    const hCost = Math.round(u * prices.urea / F.urea.bagKg + d * prices.dap / F.dap.bagKg + m * prices.mop / F.mop.bagKg);
    const hN = r1(u * F.urea.N + d * F.dap.N);
    habitOut = { nKgAcre: hN, planNKgAcre: r1(adj.N / ACRE_PER_HA), costPerAcre: hCost, savingPerAcre: hCost - costPerAcre, savingPlot: Math.round((hCost - costPerAcre) * acres) };
  }
  // is a plot reading worth buying?
  let voi = null;
  if (!sensorCls) {
    const v = valueOfInformation(post.N, sdef.rdf.N, np.N, cfg.underFactor.N, cfg.sensorLik) / ACRE_PER_HA;
    voi = { inrPerAcre: Math.round(v), readingCost: cfg.readingCostInr, worthReading: v > cfg.readingCostInr };
  }
  if (soil.pH != null) { if (soil.pH < 6.0) flags.push('acidic'); if (soil.pH > 8.5) flags.push('alkaline'); }
  if (soil.EC != null && soil.EC > 4) flags.push('saline');
  if (unconfirmed.length) flags.push('price_unconfirmed');
  return { ok: true, version: n.version, crop, system, acres, rdfKgHa: sdef.rdf, adjKgHa: adj, multipliers: mult,
    classes: { card: cardCls, reading: sensorCls, posterior: post }, confidence: conf, perAcre, plot, schedule,
    cost: { perAcre: costPerAcre, plot: Math.round(costPerAcre * acres), prices, unconfirmedPrices: unconfirmed }, habit: habitOut, voi, flags, sources: sdef.sources || [] };
}

// ---------- plain-language explanation (template; Gemini may rephrase it but is checked against the plan) ----------
export function explain(plan, lang = 'kn') {
  if (!plan.ok) return t(lang, plan.reason === 'norms_unverified' ? 'unverified' : 'error');
  const nm = (k) => t(lang, k), L = [];
  const fmt = (it) => `${it.kg} ${nm('kg')} (${it.bags} ${nm('bag')})`;
  L.push(`${nm(plan.crop)} · ${plan.acres} ${nm('acre')} · ${nm(plan.system)}`);
  for (const s of plan.schedule) {
    const parts = [];
    if (s.perAcre.urea.kg > 0) parts.push(`${nm('urea')} ${fmt(s.perAcre.urea)}`);
    if (s.perAcre.dap.kg > 0) parts.push(`${nm('dap')} ${fmt(s.perAcre.dap)}`);
    if (s.perAcre.mop.kg > 0) parts.push(`${nm('mop')} ${fmt(s.perAcre.mop)}`);
    L.push(`${s.dasFrom === 0 ? nm('sowing') : t(lang, 'after', { a: s.dasFrom, b: s.dasTo })} (${nm('perAcre')}): ${parts.join(', ')}`);
  }
  L.push(`${nm('total')} (${nm('perAcre')}): ${nm('urea')} ${fmt(plan.perAcre.urea)}, ${nm('dap')} ${fmt(plan.perAcre.dap)}, ${nm('mop')} ${fmt(plan.perAcre.mop)}`);
  if (plan.perAcre.fymTonnes) L.push(t(lang, 'fym', { t: plan.perAcre.fymTonnes }));
  L.push(`${nm('cost')} ${nm('perAcre')}: ₹${plan.cost.perAcre}`);
  if (plan.habit) L.push(plan.habit.savingPerAcre >= 0 ? `${nm('saving')}: ₹${plan.habit.savingPerAcre} ${nm('perAcre')}` : `${nm('extra')}: ₹${-plan.habit.savingPerAcre} ${nm('perAcre')}`);
  if (plan.voi) L.push(plan.voi.worthReading ? t(lang, 'readingWorth', { c: plan.voi.readingCost, v: plan.voi.inrPerAcre }) : nm('readingNo'));
  if (plan.flags.includes('experimental_reading')) L.push(nm('experimental'));
  if (plan.flags.includes('acidic')) L.push(nm('acidic'));
  if (plan.flags.includes('saline')) L.push(nm('saline'));
  if (plan.cost.unconfirmedPrices.length) L.push(t(lang, 'priceConfirm', { x: plan.cost.unconfirmedPrices.map(nm).join(', ') }));
  L.push(nm('kvk'));
  return L.join('\n');
}

// ---------- guardrail: an LLM rewrite may not introduce numbers that are not in the plan ----------
const KN_DIGITS = '೦೧೨೩೪೫೬೭೮೯';
export const toAscii = (s) => s.replace(/[೦-೯]/g, (c) => String(KN_DIGITS.indexOf(c)));
function collectNumbers(o, out = new Set()) {
  if (typeof o === 'number') { out.add(o); out.add(Math.round(o)); out.add(r1(o)); }
  else if (typeof o === 'string') { for (const m of toAscii(o).match(/\d+(?:\.\d+)?/g) || []) out.add(Number(m)); }
  else if (Array.isArray(o)) o.forEach((x) => collectNumbers(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach((x) => collectNumbers(x, out));
  return out;
}
export function numbersAreGrounded(text, plan, extra = []) {
  const allowed = collectNumbers(plan); extra.forEach((x) => allowed.add(x));
  const found = (toAscii(text).match(/\d+(?:\.\d+)?/g) || []).map(Number);
  const bad = found.filter((v) => ![...allowed].some((a) => Math.abs(a - v) < 0.051));
  return { ok: bad.length === 0, ungrounded: bad };
}
