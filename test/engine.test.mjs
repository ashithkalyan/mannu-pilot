import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, computePlan, calibrate, mvToConc, extractToSoil, classifyNitrate, summariseReadings, weatherAdvice, explain, numbersAreGrounded, posterior, priorFor, valueOfInformation, nutrientPrices, ACRE_PER_HA, nernstSlope } from '../engine/engine.mjs';
import norms from '../engine/norms.mjs';

const close = (a, b, tol = 0.11) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test('Soil Health Card classes follow ICAR thresholds (boundaries)', () => {
  assert.equal(classify('N', 279.9), 'low'); assert.equal(classify('N', 280), 'medium'); assert.equal(classify('N', 560), 'medium'); assert.equal(classify('N', 560.1), 'high');
  assert.equal(classify('P', 9.9), 'low'); assert.equal(classify('P', 25), 'medium'); assert.equal(classify('P', 25.1), 'high');
  assert.equal(classify('K', 119), 'low'); assert.equal(classify('K', 281), 'high'); assert.equal(classify('K', null), null);
});

test('ragi rainfed, medium soil: matches hand calculation (DAP nitrogen is credited)', () => {
  const p = computePlan({ crop: 'ragi', system: 'rainfed', acres: 1, soil: { N: { cls: 'medium' }, P: { cls: 'medium' }, K: { cls: 'medium' } } });
  assert.ok(p.ok); assert.deepEqual(p.adjKgHa, { N: 50, P2O5: 40, K2O: 25 });
  const dapHa = 40 / 0.46, nDap = dapHa * 0.18, ureaHa = (50 - nDap) / 0.46, mopHa = 25 / 0.6;
  close(p.perAcre.dap.kg, dapHa / ACRE_PER_HA); close(p.perAcre.urea.kg, ureaHa / ACRE_PER_HA); close(p.perAcre.mop.kg, mopHa / ACRE_PER_HA);
  // delivered nutrients equal the target
  const nDelivered = (p.perAcre.urea.kg * 0.46 + p.perAcre.dap.kg * 0.18) * ACRE_PER_HA; close(nDelivered, 50, 0.6);
  assert.equal(p.schedule.length, 2); assert.equal(p.schedule[0].dasFrom, 0); assert.equal(p.schedule[1].dasFrom, 25);
});

test('split fractions sum to 1 and top-dress contains no P or K', () => {
  for (const [c, s] of [['ragi', 'rainfed'], ['ragi', 'irrigated'], ['maize', 'irrigated']]) {
    const sp = norms.crops[c].systems[s].split; assert.ok(Math.abs(sp.reduce((a, x) => a + x.fracN, 0) - 1) < 1e-9);
    const p = computePlan({ crop: c, system: s }); for (const st of p.schedule.slice(1)) { assert.equal(st.perAcre.dap.kg, 0); assert.equal(st.perAcre.mop.kg, 0); }
  }
});

test('unverified crops are refused, not guessed', () => {
  const p = computePlan({ crop: 'tomato', system: 'irrigated' }); assert.equal(p.ok, false); assert.equal(p.reason, 'norms_unverified');
  assert.match(explain(p, 'en'), /KVK/); assert.equal(computePlan({ crop: 'maize', system: 'rainfed' }).ok, false); assert.equal(computePlan({ crop: 'x', system: 'y' }).ok, false);
});

test('card information alone never cuts nitrogen below the recommended dose (safety rule)', () => {
  const p = computePlan({ crop: 'ragi', system: 'irrigated', soil: { N: { value: 700 }, P: { cls: 'medium' }, K: { cls: 'medium' } } });
  assert.equal(p.classes.card.N, 'high'); assert.equal(p.multipliers.N, 1);
});

test('a confirming plot reading unlocks a 25% nitrogen cut; a low reading raises it', () => {
  const base = { crop: 'ragi', system: 'irrigated', soil: { N: { value: 700 }, P: { cls: 'medium' }, K: { cls: 'medium' } } };
  const hi = computePlan({ ...base, sensor: { no3nMgKg: 40, qcOk: true } }); assert.equal(hi.multipliers.N, 0.75); assert.ok(hi.flags.includes('experimental_reading'));
  const lo = computePlan({ ...base, soil: { N: { value: 100 }, P: { cls: 'medium' }, K: { cls: 'medium' } }, sensor: { no3nMgKg: 3, qcOk: true } }); assert.equal(lo.multipliers.N, 1.25);
  const bad = computePlan({ ...base, sensor: { no3nMgKg: 40, qcOk: false } }); assert.equal(bad.multipliers.N, 1); assert.ok(bad.flags.includes('reading_rejected_qc'));
});

test('posterior is a probability distribution and value of information is never negative', () => {
  for (const c of ['low', 'medium', 'high', null]) for (const o of ['low', 'medium', 'high']) { const q = posterior(priorFor(c), o); close(q.reduce((a, b) => a + b), 1, 1e-9); }
  const np = nutrientPrices({ urea: 242, dap: 1350, mop: 1700 });
  for (const c of ['low', 'medium', 'high', null]) assert.ok(valueOfInformation(priorFor(c), 100, np.N, 2) >= 0);
});

test('habit comparison: farmer over-applying urea sees a saving', () => {
  const p = computePlan({ crop: 'ragi', system: 'rainfed', acres: 2, soil: { N: { cls: 'medium' } }, habit: { ureaKgAcre: 90, dapKgAcre: 50 } });
  assert.ok(p.habit.savingPerAcre > 0); close(p.habit.savingPlot, p.habit.savingPerAcre * 2, 1.5); assert.ok(p.habit.nKgAcre > p.habit.planNKgAcre);
});

test('Nernst calibration: good electrode passes, flat or wrong-sign electrode fails', () => {
  const s = nernstSlope(25); close(s, 59.16, 0.05);
  const good = calibrate([{ mv: 200, conc: 10 }, { mv: 200 - s * 2, conc: 1000 }], 'NO3'); assert.ok(good.ok); close(good.slope, -s * 1, 3.5 * 0 + 60);
  assert.equal(calibrate([{ mv: 200, conc: 10 }, { mv: 190, conc: 1000 }], 'NO3').ok, false);
  assert.equal(calibrate([{ mv: 200, conc: 10 }, { mv: 320, conc: 1000 }], 'NO3').reason, 'wrong_slope_sign');
  assert.equal(calibrate([{ mv: 1, conc: 10 }], 'NO3').ok, false);
  const cal = calibrate([{ mv: 150, conc: 10 }, { mv: 150 - s * 2, conc: 1000 }], 'NO3'); close(mvToConc(150 - s, cal), 100, 0.5);
});

test('extract conversion and nitrate class limits', () => {
  assert.equal(extractToSoil(5), 25); assert.equal(classifyNitrate(5), 'low'); assert.equal(classifyNitrate(20), 'medium'); assert.equal(classifyNitrate(25), 'high');
});

test('reading summary is robust to one bad value and flags noise / too few readings', () => {
  const rows = [{ no3_n_mgkg: 20 }, { no3_n_mgkg: 22 }, { no3_n_mgkg: 21 }, { no3_n_mgkg: 400 }, { no3_n_mgkg: 19 }];
  const s = summariseReadings(rows); assert.equal(s.no3nMgKg, 21); assert.ok(s.qcOk);
  assert.ok(summariseReadings([{ no3_n_mgkg: 20 }]).flags.includes('few_readings'));
  assert.ok(summariseReadings([{ no3_n_mgkg: 5 }, { no3_n_mgkg: 50 }, { no3_n_mgkg: 100 }]).flags.includes('noisy'));
  close(summariseReadings([{ no3_n_mgl_extract: 4 }, { no3_n_mgl_extract: 4 }, { no3_n_mgl_extract: 4 }]).no3nMgKg, 20);
});

test('weather rule delays top-dressing before heavy rain', () => {
  assert.equal(weatherAdvice([20, 10, 0]).delayTopdress, true); assert.equal(weatherAdvice([5, 5]).delayTopdress, false); assert.equal(weatherAdvice([]).mm, 0);
});

test('sowing date produces due dates', () => {
  const p = computePlan({ crop: 'ragi', system: 'rainfed', sowingDate: '2026-07-01' }); assert.equal(p.schedule[1].dueFrom, '2026-07-26'); assert.equal(p.schedule[1].dueTo, '2026-07-31');
});

test('Kannada and English explanations render and contain the computed numbers', () => {
  const p = computePlan({ crop: 'ragi', system: 'rainfed', acres: 2, soil: { N: { cls: 'medium' } } });
  for (const l of ['kn', 'en']) { const e = explain(p, l); assert.ok(e.includes(String(p.perAcre.dap.kg))); assert.ok(e.includes(String(p.perAcre.urea.kg))); assert.ok(e.includes(String(p.cost.perAcre))); }
  assert.match(explain(p, 'kn'), /ಯೂರಿಯಾ/);
  assert.equal(numbersAreGrounded(explain(p, 'en'), p).ok, true);
});

test('numeric guard rejects invented numbers and understands Kannada digits', () => {
  const p = computePlan({ crop: 'ragi', system: 'rainfed', soil: { N: { cls: 'medium' } } });
  assert.equal(numbersAreGrounded('Apply 999 kg urea', p).ok, false);
  const kn = String(p.perAcre.dap.bags).replace(/\d/g, (d) => '೦೧೨೩೪೫೬೭೮೯'[d]);
  assert.equal(numbersAreGrounded(`DAP ${kn}`, p).ok, true);
});

test('no negative quantities across all verified crop/system/class combinations', () => {
  for (const [c, s] of [['ragi', 'rainfed'], ['ragi', 'irrigated'], ['maize', 'irrigated']]) for (const a of ['low', 'medium', 'high', null]) for (const b of ['low', 'medium', 'high', null]) {
    const p = computePlan({ crop: c, system: s, acres: 3, soil: { N: { cls: a }, P: { cls: b }, K: { cls: b } } });
    for (const v of [p.perAcre.urea.kg, p.perAcre.dap.kg, p.perAcre.mop.kg, p.cost.perAcre]) assert.ok(v >= 0);
  }
});
