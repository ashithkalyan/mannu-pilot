import { initShell, getLang, createTranslator, onReady, recordActivityEvent, escHtml } from './mannu-shell.mjs';
import { computePlan } from './engine/engine.mjs';

const DICT = {
  kn: {
    headerSub: 'ಆರ್ಥಿಕ ಅಪಾಯ ಸಿಮ್ಯುಲೇಟರ್ ಮತ್ತು ವಾರ್ಷಿಕ ಯೋಜನೆ',
    introDesc: 'ಬೆಳೆ ವೆಚ್ಚ, ಬ್ರೇಕ್-ಈವನ್ ಬೆಲೆ, ಲಾಭದ ಅಂದಾಜು ಮತ್ತು 12 ತಿಂಗಳ ನಗದು ಹರಿವನ್ನು ಸುಲಭವಾಗಿ ಲೆಕ್ಕ ಹಾಕಿ.',
    s1Title: '1. ಜಮೀನು, ಬೆಳೆ ಮತ್ತು ಬಜೆಟ್ ವಿವರ',
    lblPlot: 'ನೋಂದಾಯಿತ ಜಮೀನು',
    lblCrop: 'ಬೆಳೆ',
    cRagi: 'ರಾಗಿ', cMaize: 'ಮೆಕ್ಕೆಜೋಳ', cJowar: 'ಜೋಳ', cPaddy: 'ಭತ್ತ', cTomato: 'ಟೊಮೇಟೊ',
    lblAcres: 'ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)',
    lblBudget: 'ಲಭ್ಯ ಬಂಡವಾಳ (₹)',
    lblCostBasis: 'ವೆಚ್ಚದ ಆಧಾರ',
    bCash: 'ನಗದು ವೆಚ್ಚ (Paid-out)',
    bA2fl: 'A2 + ಕುಟುಂಬ ಶ್ರಮ',
    bC2: 'C2 (ಭೂಮಿ ಬಾಡಿಗೆ ಸಹಿತ)',
    s2Title: '2. ಪ್ರತಿ ಎಕರೆ ಕೃಷಿ ವೆಚ್ಚ (₹/ಎಕರೆ)',
    cSeed: 'ಬಿತ್ತನೆ ಬೀಜ', cFert: 'ಗೊಬ್ಬರ (UAS ಲೆಕ್ಕ)', cLab: 'ಕೂಲಿ ಮತ್ತು ಉಳುಮೆ',
    cMach: 'ಯಂತ್ರ ಮತ್ತು ನೀರಾವರಿ', cHarv: 'ಕಟಾವು ಮತ್ತು ಸಾಗಾಣಿಕೆ', cOther: 'ಇತರೆ / ಆಕಸ್ಮಿಕ',
    s3Title: '3. ಇಳುವರಿ (kg/ಎಕರೆ) ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರ (₹/ಕ್ವಿಂಟಾಲ್)',
    yLow: 'ಕನಿಷ್ಠ ಇಳುವರಿ', yBase: 'ಸಾಮಾನ್ಯ ಇಳುವರಿ', yHigh: 'ಉತ್ತಮ ಇಳುವರಿ',
    pLow: 'ಕನಿಷ್ಠ ಬೆಲೆ', pBase: 'ಮಾದರಿ ಬೆಲೆ', pHigh: 'ಗರಿಷ್ಠ ಬೆಲೆ',
    lblScenPick: 'ಅಪಾಯದ ಸನ್ನಿವೇಶ ಪರೀಕ್ಷಿಸಿ:',
    scNormal: '1. ಸಾಮಾನ್ಯ', scDrought: '2. ಕಡಿಮೆ ಮಳೆ (-30%)', scFlood: '3. ಅತಿವೃಷ್ಟಿ',
    scCrash: '4. ಬೆಲೆ ಕುಸಿತ (-20%)', scSpike: '5. ವೆಚ್ಚ ಹೆಚ್ಚಳ (+18%)', scComb: '6. ಸಂಯುಕ್ತ ಅಪಾಯ',
    btnRunSim: 'ಸಿಮ್ಯುಲೇಶನ್ ಲೆಕ್ಕ ಹಾಕಿ',
    s4Title: '4. ಆರ್ಥಿಕ ಫಲಿತಾಂಶ ಮತ್ತು ಬ್ರೇಕ್-ಈವನ್',
    lblBep: 'ಬ್ರೇಕ್-ಈವನ್ ಬೆಲೆ (₹/qtl)',
    lblBey: 'ಬ್ರೇಕ್-ಈವನ್ ಇಳುವರಿ (kg/ac)',
    s5Title: '5. ಪರ್ಯಾಯ ಬೆಳೆಗಳ ಹೋಲಿಕೆ (ಒಂದೇ ಜಮೀನಿಗೆ)',
    s6Title: '6. ವಾರ್ಷಿಕ 12-ತಿಂಗಳ ನಗದು ಹರಿವು',
    calNote: 'ಕೆಂಪು ಅಂಚು = ಗರಿಷ್ಠ ಬಂಡವಾಳ ಅಗತ್ಯ ತಿಂಗಳು · ಹಸಿರು = ಕಟಾವು ಆದಾಯ ತಿಂಗಳು',
    s7Title: '7. ನಿರೀಕ್ಷಿತ vs ನೈಜ ಫಲಿತಾಂಶ ದಾಖಲೆ',
    lblActCost: 'ನೈಜ ವೆಚ್ಚ (₹)', lblActYield: 'ನೈಜ ಇಳುವರಿ (ಒಟ್ಟು kg)', lblActPrice: 'ಮಾರಾಟ ದರ (₹/qtl)',
    btnSaveOutcome: '💾 ಯೋಜನೆ ಮತ್ತು ನೈಜ ಫಲಿತಾಂಶ ಹೋಲಿಸಿ ಉಳಿಸಿ',
    customPlot: 'ಕೈಯಿಂದ ನಮೂದಿಸಿದ ವಿಸ್ತೀರ್ಣ',
    budgetWarn: '⚠️ ಎಚ್ಚರಿಕೆ: ಒಟ್ಟು ವೆಚ್ಚವು (₹{cost}) ನಿಮ್ಮ ಲಭ್ಯ ಬಂಡವಾಳವನ್ನು (₹{bud}) ಮೀರಿದೆ. ₹{diff} ಸಾಲ ಅಥವಾ ಮೀಸಲು ಅಗತ್ಯವಿದೆ.',
    downsideWarn: '⚠️ ಕನಿಷ್ಠ ಸನ್ನಿವೇಶದಲ್ಲಿ ನಷ್ಟದ ಸಾಧ್ಯತೆ ಇದೆ (₹{loss}). ಬಂಡವಾಳ ಮೀಸಲು ಇಟ್ಟುಕೊಳ್ಳಿ.',
    months: ['ಜನ', 'ಫೆಬ್ರ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿ', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆ', 'ಅಕ್ಟೋ', 'ನವೆಂ', 'ಡಿಸೆಂ']
  },
  en: {
    headerSub: 'Financial Risk Simulator & Annual Planner',
    introDesc: 'Calculate cultivation costs, break-even selling prices, risk scenarios, and 12-month cashflow.',
    s1Title: '1. Farm Profile, Crop & Working Capital',
    lblPlot: 'Registered Plot',
    lblCrop: 'Candidate Crop',
    cRagi: 'Finger Millet (Ragi)', cMaize: 'Maize', cJowar: 'Sorghum (Jowar)', cPaddy: 'Paddy', cTomato: 'Tomato',
    lblAcres: 'Cultivated Area (acres)',
    lblBudget: 'Available Capital (₹)',
    lblCostBasis: 'Accounting Cost Basis',
    bCash: 'Paid-out Cash Cost',
    bA2fl: 'A2 + Family Labour',
    bC2: 'C2 (incl. Imputed Land Rent)',
    s2Title: '2. Cultivation Cost Breakdown (₹/acre)',
    cSeed: 'Seeds', cFert: 'Fertilisers (UAS Engine)', cLab: 'Labour & Land Prep',
    cMach: 'Machinery & Water', cHarv: 'Harvest & Transport', cOther: 'Contingency / Misc',
    s3Title: '3. Yield Scenarios (kg/acre) & Market Price (₹/quintal)',
    yLow: 'Conservative Yield', yBase: 'Base Yield', yHigh: 'Optimistic Yield',
    pLow: 'Downside Price', pBase: 'Modal Price', pHigh: 'Upside Price',
    lblScenPick: 'Stress-Test Risk Scenarios:',
    scNormal: '1. Normal Baseline', scDrought: '2. Low Rainfall (-30%)', scFlood: '3. Excess Rain',
    scCrash: '4. Price Drop (-20%)', scSpike: '5. Input Inflation (+18%)', scComb: '6. Combined Stress',
    btnRunSim: 'Run Deterministic Simulation',
    s4Title: '4. Profit, Loss & Break-Even Analysis',
    lblBep: 'Break-Even Price (₹/qtl)',
    lblBey: 'Break-Even Yield (kg/ac)',
    s5Title: '5. Multi-Crop Comparison (Same Plot)',
    s6Title: '6. Annual 12-Month Cash-Flow Calendar',
    calNote: 'Red highlight = peak working capital outflow · Green = harvest cash inflow',
    s7Title: '7. Planned vs Actual Outcome Tracker',
    lblActCost: 'Actual Cost (₹)', lblActYield: 'Actual Harvest (total kg)', lblActPrice: 'Realised Price (₹/qtl)',
    btnSaveOutcome: '💾 Compare & Save Actual Outcome',
    customPlot: 'Manual Plot Area',
    budgetWarn: '⚠️ Working Capital Alert: Total cultivation cost (₹{cost}) exceeds available budget (₹{bud}) by ₹{diff}.',
    downsideWarn: '⚠️ Downside Stress Alert: Under adverse conditions, net return drops to ₹{loss}.',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
};

const CROP_PRESETS = {
  ragi: { seed: 650, lab: 4800, mach: 2000, harv: 2200, other: 800, y: [800, 1250, 1600], p: [2850, 3420, 3800], water: 'Low–Moderate (Rainfed)' },
  maize: { seed: 1100, lab: 5200, mach: 2800, harv: 2600, other: 900, y: [1400, 2200, 2800], p: [1950, 2240, 2450], water: 'Moderate (Irrigated)' },
  jowar: { seed: 600, lab: 4400, mach: 1800, harv: 2000, other: 700, y: [750, 1150, 1450], p: [2600, 3100, 3500], water: 'Low (Drought Hardy)' },
  paddy: { seed: 1200, lab: 7500, mach: 4200, harv: 3200, other: 1200, y: [1800, 2500, 3100], p: [2180, 2450, 2750], water: 'High (Irrigated)' },
  tomato: { seed: 2500, lab: 9500, mach: 5000, harv: 4000, other: 2000, y: [6000, 11000, 16000], p: [900, 1400, 2200], water: 'High + Price Volatile' }
};

let activeScenario = 'normal';
let lastSim = null;
const $ = (id) => document.getElementById(id);

const t = createTranslator(DICT);
initShell({
  activeNav: 'finance',
  dict: DICT,
  onLangChange: () => {
    loadPlots();
    runSim();
  }
});

async function loadPlots() {
  const sel = $('fin-plot');
  sel.innerHTML = `<option value="manual">${escHtml(t('customPlot'))}</option>`;
  const local = JSON.parse(localStorage.getItem('mannu_plots_v1') || '[]');
  let srv = [];
  try {
    const r = await fetch('/api/farms/local-farmer');
    if (r.ok) { const j = await r.json(); srv = Array.isArray(j) ? j : (j.plots || []); }
  } catch { /* offline */ }
  const seen = new Set();
  [...srv, ...local].forEach((p) => {
    if (seen.has(p.plotId)) return;
    seen.add(p.plotId);
    const opt = document.createElement('option');
    opt.value = p.plotId;
    opt.dataset.acres = p.calculatedArea?.acres || 1.5;
    opt.textContent = `${p.plotName} (${opt.dataset.acres} ac)`;
    sel.appendChild(opt);
  });
}

function syncDoseEngineFertiliserCost() {
  const crop = $('fin-crop').value;
  const L = getLang();
  const mappedCrop = crop === 'maize' ? 'maize' : crop === 'tomato' ? 'tomato' : 'ragi';
  const plan = computePlan({
    crop: mappedCrop,
    system: crop === 'maize' || crop === 'paddy' ? 'irrigated' : 'rainfed',
    acres: Number($('fin-acres').value) || 1,
    soil: { N: { cls: 'medium' }, P: { cls: 'medium' }, K: { cls: 'medium' } }
  });
  if (plan.ok) {
    $('c-fert').value = plan.cost.perAcre;
    $('dose-sync-note').textContent = L === 'kn'
      ? `✓ ಗೊಬ್ಬರ ವೆಚ್ಚವನ್ನು UAS ಬೆಂಗಳೂರು ಡೋಸ್ ಎಂಜಿನ್‌ನಿಂದ ಪಡೆಯಲಾಗಿದೆ: ಎಕರೆಗೆ ₹${plan.cost.perAcre} (ಯೂರಿಯಾ ${plan.perAcre.urea.bags} + DAP ${plan.perAcre.dap.bags} + MOP ${plan.perAcre.mop.bags} ಚೀಲ)`
      : `✓ Fertiliser cost synced from UAS Bangalore Dose Engine: ₹${plan.cost.perAcre}/acre (${plan.perAcre.urea.bags} Urea + ${plan.perAcre.dap.bags} DAP + ${plan.perAcre.mop.bags} MOP bags)`;
  } else {
    $('dose-sync-note').textContent = L === 'kn'
      ? `ℹ️ ${crop} ಗೊಬ್ಬರ ವೆಚ್ಚಕ್ಕೆ ದೃಢೀಕೃತ UAS ಪ್ರಮಾಣ ಲಭ್ಯವಿಲ್ಲ — ಕೈಯಿಂದ ನಮೂದಿಸಿದ ವೆಚ್ಚ ಬಳಸಲಾಗಿದೆ.`
      : `ℹ️ Verified UAS dose norms unavailable for ${crop}; using editable estimate.`;
  }
}

function applyCropDefaults() {
  const c = $('fin-crop').value;
  const p = CROP_PRESETS[c] || CROP_PRESETS.ragi;
  $('c-seed').value = p.seed;
  $('c-lab').value = p.lab;
  $('c-mach').value = p.mach;
  $('c-harv').value = p.harv;
  $('c-other').value = p.other;
  $('y-low').value = p.y[0];
  $('y-base').value = p.y[1];
  $('y-high').value = p.y[2];
  $('p-low').value = p.p[0];
  $('p-base').value = p.p[1];
  $('p-high').value = p.p[2];
  syncDoseEngineFertiliserCost();
}

function computeDeterministicLocal(payload) {
  const area = payload.cultivatedAreaAcres;
  const total = Object.values(payload.costs).reduce((a, b) => a + b, 0);
  const gross = {
    conservative: Math.round(area * (payload.yieldScenarios.conservative / 100) * payload.priceScenarios.conservative),
    base: Math.round(area * (payload.yieldScenarios.base / 100) * payload.priceScenarios.base),
    optimistic: Math.round(area * (payload.yieldScenarios.optimistic / 100) * payload.priceScenarios.optimistic)
  };
  const net = {
    conservative: gross.conservative - total,
    base: gross.base - total,
    optimistic: gross.optimistic - total
  };
  const roi = {
    conservative: total > 0 ? Math.round((net.conservative / total) * 100) : 0,
    base: total > 0 ? Math.round((net.base / total) * 100) : 0,
    optimistic: total > 0 ? Math.round((net.optimistic / total) * 100) : 0
  };
  const baseQtl = area * (payload.yieldScenarios.base / 100);
  return {
    totalCostINR: total,
    costPerAcre: Math.round(total / area),
    grossRevenue: gross,
    netReturn: net,
    roi,
    breakEvenPrice: baseQtl > 0 ? Math.round(total / baseQtl) : 0,
    breakEvenYield: payload.priceScenarios.base > 0 ? Math.round((total / area) / (payload.priceScenarios.base / 100)) : 0
  };
}

async function runSim() {
  const acres = Math.max(0.25, Number($('fin-acres').value) || 1);
  const basis = $('fin-basis').value;
  const basisMult = basis === 'c2' ? 1.25 : basis === 'a2fl' ? 1.12 : 1.0;

  let costMult = 1.0, yieldMult = 1.0, priceMult = 1.0;
  if (activeScenario === 'drought') yieldMult = 0.70;
  else if (activeScenario === 'flood') { yieldMult = 0.78; costMult = 1.08; }
  else if (activeScenario === 'crash') priceMult = 0.80;
  else if (activeScenario === 'costspike') costMult = 1.18;
  else if (activeScenario === 'combined') { yieldMult = 0.75; priceMult = 0.85; costMult = 1.15; }

  const costs = {
    seeds: Math.round(Number($('c-seed').value) * acres * costMult),
    fertilisers: Math.round(Number($('c-fert').value) * acres * costMult),
    labour: Math.round(Number($('c-lab').value) * acres * costMult * basisMult),
    machinery: Math.round(Number($('c-mach').value) * acres * costMult),
    harvest: Math.round(Number($('c-harv').value) * acres * costMult),
    other: Math.round(Number($('c-other').value) * acres * costMult)
  };
  const payload = {
    cultivatedAreaAcres: acres,
    crop: $('fin-crop').value,
    priceUnit: 'quintal',
    costs,
    yieldScenarios: {
      conservative: Math.round(Number($('y-low').value) * yieldMult),
      base: Math.round(Number($('y-base').value) * yieldMult),
      optimistic: Math.round(Number($('y-high').value) * yieldMult)
    },
    priceScenarios: {
      conservative: Math.round(Number($('p-low').value) * priceMult),
      base: Math.round(Number($('p-base').value) * priceMult),
      optimistic: Math.round(Number($('p-high').value) * priceMult)
    }
  };

  let resData;
  try {
    const r = await fetch('/api/finance/calculate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    resData = r.ok ? await r.json() : computeDeterministicLocal(payload);
  } catch {
    resData = computeDeterministicLocal(payload);
  }
  lastSim = resData;
  renderResults(resData, acres);
  renderCropComparison(acres);
  renderAnnualCalendar(resData.totalCostINR, resData.grossRevenue.base);
}

function renderResults(r, acres) {
  const L = getLang();
  const budget = Number($('fin-budget').value) || 0;
  $('out-cost').textContent = '₹' + Math.round(r.totalCostINR).toLocaleString();
  $('out-cost-sub').textContent = L === 'kn' ? `ಎಕರೆಗೆ ₹${r.costPerAcre.toLocaleString()} (${acres} ಎಕರೆ)` : `₹${r.costPerAcre.toLocaleString()}/ac (${acres} ac)`;

  const net = r.netReturn.base;
  $('out-net').textContent = (net >= 0 ? '₹' : '-₹') + Math.abs(net).toLocaleString();
  $('out-net').style.color = net >= 0 ? 'var(--g)' : 'var(--r)';
  $('out-roi').textContent = `ROI: ${r.roi.base >= 0 ? '+' : ''}${r.roi.base}%`;
  $('out-bep').textContent = '₹' + (r.breakEvenPrice ?? 0).toLocaleString();
  $('out-bey').textContent = (r.breakEvenYield ?? 0).toLocaleString() + ' kg';

  const alerts = [];
  if (budget > 0 && r.totalCostINR > budget) {
    alerts.push(t('budgetWarn').replace('{cost}', r.totalCostINR.toLocaleString()).replace('{bud}', budget.toLocaleString()).replace('{diff}', (r.totalCostINR - budget).toLocaleString()));
  }
  if (r.netReturn.conservative < 0) {
    alerts.push(t('downsideWarn').replace('{loss}', r.netReturn.conservative.toLocaleString()));
  }
  $('fin-alerts').innerHTML = alerts.map((a) => `<div class="m-callout m-callout-err" style="font-size:13px">${escHtml(a)}</div>`).join('');

  $('scen-table-host').innerHTML = `<table class="m-tbl">
    <thead><tr>
      <th>${L === 'kn' ? 'ಸನ್ನಿವೇಶ' : 'Scenario'}</th>
      <th>${L === 'kn' ? 'ಒಟ್ಟು ಆದಾಯ' : 'Gross Revenue'}</th>
      <th>${L === 'kn' ? 'ನಿವ್ವಳ ಲಾಭ' : 'Net Return'}</th>
      <th>ROI</th>
    </tr></thead>
    <tbody>
      <tr><td>${L === 'kn' ? '📉 ಕನಿಷ್ಠ' : '📉 Conservative'}</td><td>₹${r.grossRevenue.conservative.toLocaleString()}</td><td style="color:${r.netReturn.conservative >= 0 ? 'var(--g)' : 'var(--r)'}">₹${r.netReturn.conservative.toLocaleString()}</td><td>${r.roi.conservative}%</td></tr>
      <tr style="background:var(--g-light);font-weight:700"><td>${L === 'kn' ? '🎯 ಸಾಮಾನ್ಯ' : '🎯 Base'}</td><td>₹${r.grossRevenue.base.toLocaleString()}</td><td>₹${r.netReturn.base.toLocaleString()}</td><td>${r.roi.base}%</td></tr>
      <tr><td>${L === 'kn' ? '🌟 ಉತ್ತಮ' : '🌟 Optimistic'}</td><td>₹${r.grossRevenue.optimistic.toLocaleString()}</td><td>₹${r.netReturn.optimistic.toLocaleString()}</td><td>${r.roi.optimistic}%</td></tr>
    </tbody>
  </table>`;

  $('fin-roadmap-box').textContent = L === 'kn'
    ? `📌 ಆರ್ಥಿಕ ಮಾರ್ಗದರ್ಶನ (${acres} ಎಕರೆ): ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${r.breakEvenPrice} ಗಿಂತ ಹೆಚ್ಚು ದರ ಸಿಕ್ಕರೆ ನಷ್ಟವಾಗುವುದಿಲ್ಲ. ಬಿತ್ತನೆ ಮತ್ತು ಗೊಬ್ಬರ ಹಂತದಲ್ಲಿ (ಜೂನ್–ಆಗಸ್ಟ್) ಒಟ್ಟು ಬಂಡವಾಳದ ~65% ಅಗತ್ಯವಿರುತ್ತದೆ.`
    : `📌 Deterministic Roadmap (${acres} ac): Minimum break-even selling price is ₹${r.breakEvenPrice}/quintal (or ${r.breakEvenYield} kg/ac). ~65% of working capital is needed during sowing and basal/top-dress operations before harvest.`;
}

function renderCropComparison(acres) {
  const L = getLang();
  const keys = ['ragi', 'maize', 'jowar', 'paddy'];
  const rows = keys.map((k) => {
    const p = CROP_PRESETS[k];
    const fertPerAc = k === 'maize' ? 4200 : k === 'paddy' ? 4600 : 2850;
    const costTot = (p.seed + fertPerAc + p.lab + p.mach + p.harv + p.other) * acres;
    const grossBase = Math.round(acres * (p.y[1] / 100) * p.p[1]);
    const netBase = grossBase - costTot;
    const bep = Math.round(costTot / (acres * (p.y[1] / 100)));
    return `<tr>
      <td>${escHtml(t('c' + k[0].toUpperCase() + k.slice(1)))}</td>
      <td>₹${Math.round(costTot).toLocaleString()}</td>
      <td>₹${netBase.toLocaleString()}</td>
      <td>₹${bep.toLocaleString()}</td>
      <td style="text-align:center">${escHtml(p.water)}</td>
    </tr>`;
  }).join('');
  $('crop-compare-host').innerHTML = `<table class="m-tbl">
    <thead><tr>
      <th>${L === 'kn' ? 'ಬೆಳೆ' : 'Crop'}</th>
      <th>${L === 'kn' ? 'ಹೂಡಿಕೆ' : 'Investment'}</th>
      <th>${L === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಲಾಭ' : 'Base Net'}</th>
      <th>${L === 'kn' ? 'ಬ್ರೇಕ್-ಈವನ್' : 'Break-Even'}</th>
      <th>${L === 'kn' ? 'ನೀರಿನ ಬೇಡಿಕೆ' : 'Water Need'}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderAnnualCalendar(totalExp, totalInc) {
  const months = t('months');
  const expW = [0.02, 0.02, 0.03, 0.04, 0.14, 0.26, 0.22, 0.12, 0.07, 0.05, 0.03, 0.0];
  const incW = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.10, 0.50, 0.40];
  $('cal-grid').innerHTML = months.map((m, i) => {
    const out = Math.round(totalExp * expW[i]);
    const inc = Math.round(totalInc * incW[i]);
    const cls = i === 5 || i === 6 ? 'peak' : inc > 0 ? 'harvest' : '';
    return `<div class="cal-box ${cls}">
      <strong>${escHtml(m)}</strong>
      <div style="color:var(--r)">-${out > 0 ? '₹' + out.toLocaleString() : '₹0'}</div>
      <div style="color:var(--g);font-weight:700">${inc > 0 ? '+₹' + inc.toLocaleString() : ''}</div>
    </div>`;
  }).join('');
}

onReady(() => {
  loadPlots();
  syncDoseEngineFertiliserCost();
  runSim();

  $('fin-plot').addEventListener('change', (e) => {
    const opt = e.target.options[e.target.selectedIndex];
    if (opt?.dataset?.acres) $('fin-acres').value = opt.dataset.acres;
    syncDoseEngineFertiliserCost();
    runSim();
  });
  $('fin-crop').addEventListener('change', () => { applyCropDefaults(); runSim(); });
  $('fin-acres').addEventListener('change', () => { syncDoseEngineFertiliserCost(); runSim(); });
  $('fin-basis').addEventListener('change', runSim);
  $('btn-run-sim').addEventListener('click', runSim);

  document.querySelectorAll('#scen-strip .scen-btn').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#scen-strip .scen-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      activeScenario = b.dataset.sc;
      runSim();
    });
  });

  $('btn-save-outcome').addEventListener('click', async () => {
    const actCost = Number($('act-cost').value) || 0;
    const actYield = Number($('act-yield').value) || 0;
    const actPrice = Number($('act-price').value) || 0;
    const actRev = Math.round((actYield / 100) * actPrice);
    const actNet = actRev - actCost;
    const projNet = lastSim?.netReturn?.base || 0;
    const diff = actNet - projNet;
    const L = getLang();

    $('outcome-diff').innerHTML = L === 'kn'
      ? `<b>ಹೋಲಿಕೆ:</b> ನೈಜ ಆದಾಯ ₹${actRev.toLocaleString()} · ನೈಜ ಲಾಭ ₹${actNet.toLocaleString()} (ಯೋಜಿತಕ್ಕಿಂತ ${diff >= 0 ? '+' : ''}₹${diff.toLocaleString()})`
      : `<b>Comparison:</b> Actual Revenue ₹${actRev.toLocaleString()} · Actual Net ₹${actNet.toLocaleString()} (${diff >= 0 ? '+' : ''}₹${diff.toLocaleString()} vs Base Plan)`;

    try {
      const pRes = await fetch('/api/finance/plans', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: 'local-farmer', plotId: $('fin-plot').value, crop: $('fin-crop').value, cultivatedArea: Number($('fin-acres').value), financialResults: lastSim })
      });
      if (pRes.ok) {
        const plan = await pRes.json();
        await fetch(`/api/finance/plans/detail/${plan.planId}/outcome`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actualProduction: actYield, actualRevenue: actRev, actualCosts: actCost, realisedPrice: actPrice, finalProfitOrLoss: actNet })
        });
      }
    } catch { /* offline */ }
    recordActivityEvent({ eventType: 'financial_outcome', sourceModule: 'finance', eventDetails: `${$('fin-crop').value}: Actual Net ₹${actNet}` });
  });
});
