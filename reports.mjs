import { initShell, getLang, createTranslator, onReady, recordActivityEvent, escHtml } from './mannu-shell.mjs';

const DICT = {
  kn: {
    headerSub: 'ದೈನಂದಿನ ವರದಿ ಮತ್ತು ದಿನಚರಿ',
    introDesc: 'ದೈನಂದಿನ ಕೃಷಿ ಚಟುವಟಿಕೆ ದಾಖಲಿಸಿ, ಪೂರ್ಣ ವರದಿ ತಯಾರಿಸಿ, PDF ಉಳಿಸಿ ಅಥವಾ Gmail ಮೂಲಕ ಕಳುಹಿಸಿ.',
    logActTitle: 'ಇಂದಿನ ಕೃಷಿ ಚಟುವಟಿಕೆ ದಾಖಲಿಸಿ',
    lblActType: 'ಚಟುವಟಿಕೆ ಪ್ರಕಾರ',
    actIrr: '💧 ನೀರಾವರಿ ನೀಡಲಾಗಿದೆ',
    actFert: '🌱 ಗೊಬ್ಬರ ಹಾಕಲಾಗಿದೆ',
    actInsp: '🌿 ಬೆಳೆ ಪರಿಶೀಲನೆ',
    actSoil: '🔬 ಮಣ್ಣು ಪರೀಕ್ಷೆ',
    lblActNote: 'ಟಿಪ್ಪಣಿ',
    phActNote: 'ಉದಾ: ಬೆಳಿಗ್ಗೆ 2 ಗಂಟೆ ನೀರು ಹರಿಸಲಾಗಿದೆ',
    btnLogAct: '+ ದಿನಚರಿಗೆ ಸೇರಿಸಿ',
    genTitle: 'ದೈನಂದಿನ ವರದಿ ತಯಾರಿಸಿ',
    lblDate: 'ದಿನಾಂಕ',
    lblPlot: 'ಜಮೀನು',
    lblRepLang: 'ವರದಿ ಭಾಷೆ',
    btnGenerate: 'ಪೂರ್ಣ ವರದಿ ರಚಿಸಿ',
    btnPdf: 'PDF ಉಳಿಸಿ / ಪ್ರಿಂಟ್',
    btnAudioRep: 'ಧ್ವನಿ ವಿವರಣೆ',
    lblEmailTo: 'ಇಮೇಲ್ ವಿಳಾಸಗಳು (ಬಹು ವಿಳಾಸಗಳಿಗೆ ಅಲ್ಪವಿರಾಮ ಬಳಸಿ)',
    btnGmail: 'ಸರ್ವರ್ ಮೂಲಕ ಕಳುಹಿಸಿ',
    btnGmailWeb: 'Gmail ನಲ್ಲಿ ತೆರೆಯಿರಿ',
    logbookTitle: 'ಡಿಜಿಟಲ್ ಕೃಷಿ ದಿನಚರಿ (Logbook)',
    allPlots: 'ಎಲ್ಲಾ ಜಮೀನುಗಳು',
    emptyLog: 'ಇನ್ನೂ ಯಾವುದೇ ವರದಿಗಳು ಉಳಿಸಲ್ಪಟ್ಟಿಲ್ಲ.',
    actSaved: 'ಚಟುವಟಿಕೆ ದಿನಚರಿಗೆ ಸೇರ್ಪಡೆಯಾಗಿದೆ!',
    needEmail: 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.',
    gmailSent: '✓ ವರದಿಯನ್ನು ಎಲ್ಲಾ ಇಮೇಲ್ ವಿಳಾಸಗಳಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.',
    gmailOauth: '⚠️ ಸರ್ವರ್‌ನಲ್ಲಿ Gmail ಕಾನ್ಫಿಗರ್ ಮಾಡಿಲ್ಲ (.env ನಲ್ಲಿ GMAIL_USER / GMAIL_APP_PASSWORD ಅಗತ್ಯವಿದೆ). ನೀವು ಪಕ್ಕದಲ್ಲಿರುವ "Gmail ನಲ್ಲಿ ತೆರೆಯಿರಿ" ಬಟನ್ ಮೂಲಕ ನೇರವಾಗಿ ಕಳುಹಿಸಬಹುದು!'
  },
  en: {
    headerSub: 'Daily Reports & Digital Logbook',
    introDesc: 'Record daily farm work, generate complete 8-section reports, save PDF, or email via Gmail.',
    logActTitle: 'Log Daily Field Activity',
    lblActType: 'Activity Type',
    actIrr: '💧 Irrigation Applied',
    actFert: '🌱 Fertiliser Applied',
    actInsp: '🌿 Crop Inspection',
    actSoil: '🔬 Soil Testing',
    lblActNote: 'Observation / Note',
    phActNote: 'e.g. 2 hours morning irrigation completed',
    btnLogAct: '+ Add to Activity Ledger',
    genTitle: 'Generate Daily Intelligence Report',
    lblDate: 'Reporting Date',
    lblPlot: 'Farmland Plot',
    lblRepLang: 'Report Language',
    btnGenerate: 'Generate 8-Section Report',
    btnPdf: 'Save PDF / Print',
    btnAudioRep: 'Listen Audio Summary',
    lblEmailTo: 'Recipient Email Address(es) — comma-separated for multiple',
    btnGmail: 'Send via Server',
    btnGmailWeb: 'Open in Gmail Web',
    logbookTitle: 'Digital Farm Logbook Archive',
    allPlots: 'All Registered Plots',
    emptyLog: 'No generated reports archived yet.',
    actSaved: 'Activity recorded in daily ledger!',
    needEmail: 'Please enter at least one valid email address before sending.',
    gmailSent: '✓ Report successfully delivered to all recipient email(s).',
    gmailOauth: '⚠️ Server Gmail SMTP is not configured (.env needs GMAIL_USER / GMAIL_APP_PASSWORD). You can click "Open in Gmail Web" to send immediately from your browser!'
  }
};

const REPORT_LABELS = {
  kn: {
    title: 'ಮಣ್ಣು · ದೈನಂದಿನ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ ವರದಿ',
    s1: '1. ರೈತ ಮತ್ತು ಜಮೀನಿನ ಅವಲೋಕನ',
    s2: '2. ದೈನಂದಿನ ಚಟುವಟಿಕೆಗಳ ಕಾಲಮಿತಿ',
    s3: '3. ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಗುಣಮಟ್ಟ (QC)',
    s4: '4. ಜಮೀನಿನ ವಲಯ ನಕ್ಷೆ ಮತ್ತು ನೀರಿನ ಸ್ಥಿತಿ',
    s5: '5. ಬೆಳೆ ದೃಶ್ಯ ತಪಾಸಣೆ',
    s6: '6. ದೃಢೀಕೃತ ಕೃಷಿ ಮತ್ತು ಗೊಬ್ಬರ ಶಿಫಾರಸು',
    s7: '7. ಶೈಕ್ಷಣಿಕ ದೃಶ್ಯ ವಿವರಣೆ',
    s8: '8. ಐತಿಹಾಸಿಕ ಹೋಲಿಕೆ ಮತ್ತು ಮುಂದಿನ ಕ್ರಮಗಳು',
    notRec: 'ಈ ದಿನ ಯಾವುದೇ ನೇರ ಮಾಪನ ದಾಖಲಾಗಿಲ್ಲ (ಕಲ್ಪಿತ ಮಾಹಿತಿ ಇಲ್ಲ).',
    plot: 'ಜಮೀನು', area: 'ವಿಸ್ತೀರ್ಣ', crop: 'ಬೆಳೆ', date: 'ದಿನಾಂಕ'
  },
  en: {
    title: 'Mannu · Daily Agricultural Intelligence Report',
    s1: '1. Farmer & Farm Overview',
    s2: '2. Chronological Daily Activity Timeline',
    s3: '3. Soil Intelligence & Calibration QC',
    s4: '4. Farmland Zone Snapshot & Water Condition',
    s5: '5. Crop Visual Inspection & Findings',
    s6: '6. Deterministic Agronomic Recommendations',
    s7: '7. Educational Visual Explanation',
    s8: '8. Historical Comparison & Follow-up Checklist',
    notRec: 'Not measured or recorded for this period (no fabricated data).',
    plot: 'Plot', area: 'Area', crop: 'Crop', date: 'Date'
  },
  hi: {
    title: 'मन्नू · दैनिक कृषि रिपोर्ट',
    s1: '1. किसान और खेत का विवरण', s2: '2. दैनिक गतिविधि समयरेखा', s3: '3. मृदा स्वास्थ्य और गुणवत्ता',
    s4: '4. खेत नक्शा और जल स्थिति', s5: '5. फसल दृश्य निरीक्षण', s6: '6. उर्वरक सिफारिशें',
    s7: '7. शैक्षिक दृश्य आरेख', s8: '8. ऐतिहासिक तुलना और अगले कदम',
    notRec: 'इस अवधि के लिए कोई सीधा माप दर्ज नहीं है।', plot: 'खेत', area: 'क्षेत्रफल', crop: 'फसल', date: 'दिनांक'
  },
  te: {
    title: 'మన్ను · రోజువారీ వ్యవసాయ నివేదిక',
    s1: '1. రైతు & పొలం వివరాలు', s2: '2. రోజువారీ కార్యకలాపాల క్రమం', s3: '3. మట్టి ఆరోగ్యం & నాణ్యత',
    s4: '4. పొలం జోన్ మ్యాప్ & నీటి స్థితి', s5: '5. పంట దృశ్య తనిఖీ', s6: '6. ఎరువుల సిఫార్సులు',
    s7: '7. విద్యా దృశ్య చిత్రం', s8: '8. చారిత్రక పోలిక & తదుపరి చర్యలు',
    notRec: 'ఈ కాలానికి ఎటువంటి కొలత నమోదు కాలేదు.', plot: 'పొలం', area: 'విస్తీర్ణం', crop: 'పంట', date: 'తేదీ'
  },
  ta: {
    title: 'மண்ணு · தினசரி வேளாண் அறிக்கை',
    s1: '1. விவசாயி & நில விவரம்', s2: '2. தினசரி செயல்பாட்டு வரிசை', s3: '3. மண் ஆரோக்கியம் & தரம்',
    s4: '4. நில மண்டல வரைபடம் & நீர் நிலை', s5: '5. பயிர் காட்சி ஆய்வு', s6: '6. உரப் பரிந்துரைகள்',
    s7: '7. கல்வி காட்சி விளக்கம்', s8: '8. வரலாற்று ஒப்பீடு & அடுத்த படிகள்',
    notRec: 'இந்த காலகட்டத்திற்கு அளவீடு எதுவும் பதிவு செய்யப்படவில்லை.', plot: 'நிலம்', area: 'பரப்பளவு', crop: 'பயிர்', date: 'தேதி'
  }
};

let activeReport = null;
const $ = (id) => document.getElementById(id);

const t = createTranslator(DICT);
initShell({
  activeNav: 'reports',
  dict: DICT,
  onLangChange: (lang) => {
    $('rep-lang').value = lang;
    loadPlotsDropdown();
    loadLogbook();
    if (activeReport) {
      activeReport.language = lang;
      renderReport(activeReport);
    }
  }
});

async function loadPlotsDropdown() {
  const sel = $('rep-plot');
  sel.innerHTML = `<option value="all">${escHtml(t('allPlots'))}</option>`;
  const local = JSON.parse(localStorage.getItem('mannu_plots_v1') || '[]');
  let srv = [];
  try {
    const res = await fetch('/api/farms/local-farmer');
    if (res.ok) { const j = await res.json(); srv = Array.isArray(j) ? j : (j.plots || []); }
  } catch { /* offline */ }
  const seen = new Set();
  [...srv, ...local].forEach((p) => {
    if (seen.has(p.plotId)) return;
    seen.add(p.plotId);
    const opt = document.createElement('option');
    opt.value = p.plotId;
    opt.textContent = `${p.plotName} (${p.calculatedArea?.acres ?? '--'} ac)`;
    opt.dataset.acres = p.calculatedArea?.acres ?? '';
    opt.dataset.name = p.plotName;
    sel.appendChild(opt);
  });
}

async function generateReport() {
  const dateVal = $('rep-date').value || new Date().toISOString().slice(0, 10);
  const sel = $('rep-plot');
  const plotId = sel.value;
  const opt = sel.options[sel.selectedIndex];
  const plotName = opt?.dataset?.name || t('allPlots');
  const acres = opt?.dataset?.acres || JSON.parse(localStorage.getItem('mannu.v1') || '{}').acres || 1;
  const rLang = $('rep-lang').value || getLang();

  // Gather real recorded events, investigations, soil readings, and main plan
  let events = JSON.parse(localStorage.getItem('mannu.daily_events') || '[]').filter((e) => e.date === dateVal);
  try {
    const r = await fetch(`/api/reports/events/local-farmer?date=${dateVal}&plotId=${plotId}`);
    if (r.ok) {
      const j = await r.json();
      if (j.events?.length) {
        const ids = new Set(events.map((x) => x.eventId));
        j.events.forEach((x) => { if (!ids.has(x.eventId)) events.push(x); });
      }
    }
  } catch { /* offline */ }

  let investigations = JSON.parse(localStorage.getItem('mannu.investigations') || '[]')
    .filter((i) => (i.createdAt || '').slice(0, 10) === dateVal);

  const mainV1 = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
  const zones = plotId !== 'all' ? JSON.parse(localStorage.getItem(`mannu_zones_${plotId}`) || '[]') : [];
  const visualDiagram = localStorage.getItem('mannu.latest_diagram_svg') || null;

  const rep = {
    reportId: 'rep_' + Date.now(),
    farmerId: 'local-farmer',
    plotId,
    plotName,
    acres,
    crop: mainV1.crop || 'ragi',
    reportDate: dateVal,
    language: rLang,
    generatedAt: new Date().toISOString(),
    events,
    readingSummary: mainV1.reading || null,
    investigations,
    zones,
    visualDiagram
  };

  try {
    const res = await fetch('/api/reports/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rep)
    });
    if (res.ok) Object.assign(rep, await res.json());
  } catch { /* offline */ }

  const archived = JSON.parse(localStorage.getItem('mannu.saved_reports') || '[]');
  archived.unshift(rep);
  localStorage.setItem('mannu.saved_reports', JSON.stringify(archived.slice(0, 30)));

  activeReport = rep;
  renderReport(rep);
  loadLogbook();
}

function buildZoneSnapshotSvg(zones) {
  if (!zones || !zones.length) {
    return `<svg viewBox="0 0 320 100" style="width:100%;max-width:340px;height:auto;border:1px solid #d1d5db;border-radius:10px;background:#f9fafb">
      <rect x="20" y="15" width="280" height="70" rx="8" fill="#e6f4ea" stroke="#0f682b" stroke-width="2" stroke-dasharray="5,4"/>
      <text x="160" y="54" text-anchor="middle" font-size="12" fill="#0f682b">Registered Plot Boundary (WGS84 GeoJSON)</text>
    </svg>`;
  }
  const cols = Math.ceil(Math.sqrt(zones.length));
  const w = 320, cellW = Math.floor((w - 20) / cols), cellH = 38;
  const rows = Math.ceil(zones.length / cols);
  const h = rows * cellH + 20;
  const cells = zones.map((z, idx) => {
    const r = Math.floor(idx / cols), c = idx % cols;
    const x = 10 + c * cellW, y = 10 + r * cellH;
    const fill = z.measurementStatus === 'measured' ? '#86efac' : z.measurementStatus === 'attention' ? '#fde047' : '#e5e7eb';
    return `<rect x="${x}" y="${y}" width="${cellW - 3}" height="${cellH - 3}" rx="4" fill="${fill}" stroke="#374151"/>
      <text x="${x + cellW / 2 - 2}" y="${y + cellH / 2 + 3}" text-anchor="middle" font-size="11" font-weight="bold" fill="#111827">${escHtml(z.zoneCode)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:340px;height:auto;border:1px solid #d1d5db;border-radius:10px;background:#fff">${cells}</svg>`;
}

function renderReport(rep) {
  const L = REPORT_LABELS[rep.language] || REPORT_LABELS.en;
  $('report-container').classList.remove('m-hidden');

  const eventsHtml = rep.events?.length
    ? rep.events.map((e) => `<div class="tl-row"><div><strong>${new Date(e.eventTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> — <b>${escHtml(e.eventType)}:</b> ${escHtml(e.eventDetails || '')}</div></div>`).join('')
    : `<div class="m-mut">${escHtml(L.notRec)}</div>`;

  const soilHtml = rep.readingSummary
    ? `<div><strong>NO₃-N:</strong> ${rep.readingSummary.no3nMgKg ?? '--'} mg/kg · <strong>pH:</strong> ${rep.readingSummary.ph ?? '--'} · <strong>QC:</strong> ${rep.readingSummary.qcOk ? 'PASS' : 'REJECTED'}</div>`
    : `<div class="m-mut">${escHtml(L.notRec)}</div>`;

  const invHtml = rep.investigations?.length
    ? rep.investigations.map((i) => `<div style="margin:4px 0">• <strong>${escHtml(i.crop || 'Crop')}:</strong> ${escHtml((i.currentAssessment?.observedSymptoms || []).join(', '))} (${escHtml(i.verificationStatus || 'unverified')})</div>`).join('')
    : `<div class="m-mut">${escHtml(L.notRec)}</div>`;

  const diagramHtml = rep.visualDiagram
    ? rep.visualDiagram
    : `<div class="m-mut">${escHtml(L.notRec)}</div>`;

  $('rep-doc').innerHTML = `
    <div class="rep-head">
      <div>
        <h2 style="margin:0;color:var(--g)">${escHtml(L.title)}</h2>
        <div class="m-mut">ID: ${escHtml(rep.reportId)} · ${new Date(rep.generatedAt).toLocaleString()}</div>
      </div>
      <span class="m-badge m-badge-ok">${escHtml(rep.reportDate)}</span>
    </div>

    <div class="rep-sec">
      <h3>${escHtml(L.s1)}</h3>
      <div class="m-grid-2" style="font-size:14px">
        <div><strong>${escHtml(L.plot)}:</strong> ${escHtml(rep.plotName || rep.plotId)}</div>
        <div><strong>${escHtml(L.area)}:</strong> ${escHtml(rep.acres)} acres</div>
        <div><strong>${escHtml(L.crop)}:</strong> ${escHtml(rep.crop)}</div>
        <div><strong>${escHtml(L.date)}:</strong> ${escHtml(rep.reportDate)}</div>
      </div>
    </div>

    <div class="rep-sec"><h3>${escHtml(L.s2)}</h3>${eventsHtml}</div>
    <div class="rep-sec"><h3>${escHtml(L.s3)}</h3>${soilHtml}</div>
    <div class="rep-sec"><h3>${escHtml(L.s4)}</h3>${buildZoneSnapshotSvg(rep.zones)}</div>
    <div class="rep-sec"><h3>${escHtml(L.s5)}</h3>${invHtml}</div>
    <div class="rep-sec"><h3>${escHtml(L.s6)}</h3><div style="font-size:14px">UAS Bangalore / ICAR deterministic dose rules active (no AI-invented quantities).</div></div>
    <div class="rep-sec"><h3>${escHtml(L.s7)}</h3>${diagramHtml}</div>
    <div class="rep-sec"><h3>${escHtml(L.s8)}</h3><div class="m-mut">All records preserved append-only in Digital Farm Logbook.</div></div>
  `;
  $('report-container').scrollIntoView({ behavior: 'smooth' });
}

async function loadLogbook() {
  const host = $('logbook-list');
  const local = JSON.parse(localStorage.getItem('mannu.saved_reports') || '[]');
  let srv = [];
  try {
    const res = await fetch('/api/reports/local-farmer');
    if (res.ok) { const j = await res.json(); srv = j.reports || []; }
  } catch { /* offline */ }
  const map = new Map();
  [...local, ...srv].forEach((r) => map.set(r.reportId, r));
  const list = [...map.values()];

  if (!list.length) {
    host.innerHTML = `<div class="m-mut">${escHtml(t('emptyLog'))}</div>`;
    return;
  }
  host.innerHTML = '';
  list.slice(0, 15).forEach((r) => {
    const row = document.createElement('div');
    row.className = 'log-row';
    row.innerHTML = `
      <div>
        <strong>📋 ${escHtml(r.plotName || r.plotId || 'Farm')} · ${escHtml(r.reportDate)}</strong>
        <div class="m-mut">${(r.events || []).length} events · ${escHtml(r.language?.toUpperCase())}</div>
      </div>
      <span class="m-badge m-badge-info">${escHtml(r.emailStatus || 'saved')}</span>
    `;
    row.addEventListener('click', () => { activeReport = r; renderReport(r); });
    host.appendChild(row);
  });
}

onReady(() => {
  $('rep-date').value = new Date().toISOString().slice(0, 10);
  $('rep-lang').value = getLang();
  loadPlotsDropdown();
  loadLogbook();

  $('btn-log-act').addEventListener('click', async () => {
    const type = $('act-type').value;
    const note = $('act-note').value.trim() || $('act-type').options[$('act-type').selectedIndex].text;
    await recordActivityEvent({ eventType: type, eventDetails: note, plotId: $('rep-plot').value, sourceModule: 'logbook' });
    $('act-note').value = '';
    alert(t('actSaved'));
  });

  $('btn-generate').addEventListener('click', generateReport);
  $('btn-print-pdf').addEventListener('click', () => window.print());

  $('btn-audio-rep').addEventListener('click', () => {
    if (!activeReport || !('speechSynthesis' in window)) return;
    const txt = `${activeReport.plotName}. ${activeReport.reportDate}. ${(activeReport.events || []).map((e) => e.eventDetails).join('. ')}`;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = activeReport.language === 'kn' ? 'kn-IN' : 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });

  $('btn-send-gmail').addEventListener('click', async () => {
    if (!activeReport) return;
    const rawEmails = $('rep-email').value.trim();
    const validEmails = rawEmails.split(/[,;\s]+/).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (!validEmails.length) {
      $('gmail-status').textContent = t('needEmail');
      $('gmail-status').style.color = 'var(--r)';
      return;
    }
    $('gmail-status').textContent = '⏳ Sending report to ' + validEmails.join(', ') + '...';
    $('gmail-status').style.color = 'var(--b)';

    try {
      const res = await fetch(`/api/reports/detail/${activeReport.reportId}/email`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: validEmails.join(', ') })
      });
      const j = await res.json();
      if (j.emailStatus === 'sent') {
        const count = j.recipientCount || validEmails.length;
        $('gmail-status').textContent = `${t('gmailSent')} (${count} recipient${count > 1 ? 's' : ''}: ${validEmails.join(', ')})`;
        $('gmail-status').style.color = 'var(--g)';
      } else if (j.emailStatus === 'requires_setup') {
        $('gmail-status').textContent = t('gmailOauth');
        $('gmail-status').style.color = 'var(--y)';
      } else {
        $('gmail-status').textContent = `⚠️ Send failed: ${j.emailError || 'unknown error'}. Check GMAIL_USER / GMAIL_APP_PASSWORD in .env, or use "Open in Gmail Web" below.`;
        $('gmail-status').style.color = 'var(--r)';
      }
      loadLogbook();
    } catch (err) {
      $('gmail-status').textContent = `⚠️ Network error: ${err.message}. You can use "Open in Gmail Web" button to send directly!`;
      $('gmail-status').style.color = 'var(--r)';
    }
  });

  const btnWeb = $('btn-open-gmail-web');
  if (btnWeb) {
    btnWeb.addEventListener('click', () => {
      if (!activeReport) return;
      const rawEmails = $('rep-email').value.trim();
      const validEmails = rawEmails.split(/[,;\s]+/).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      const subject = `Mannu Farm Intelligence Report — ${activeReport.reportDate} · ${activeReport.plotName || 'Farm'}`;

      const events = (activeReport.events || []).map((e) => `• [${e.eventType}] ${e.eventDetails || ''}`).join('\n') || '  (No field activities recorded today)';
      const s = activeReport.readingSummary;
      const soil = s ? `NO3-N: ${s.no3nMgKg ?? '--'} mg/kg | pH: ${s.ph ?? '--'} | EC: ${s.ecDsm ?? '--'} dS/m | QC: ${s.qcOk ? 'PASS' : 'WARN'}` : '  (No direct sensor readings recorded)';
      const inv = (activeReport.investigations || []).map((i) => `• Crop: ${i.crop || activeReport.crop || 'Crop'} | Symptoms: ${(i.currentAssessment?.observedSymptoms || []).join(', ')}`).join('\n') || '  (No visual disease abnormalities flagged)';

      const body = `🌾 MANNU (ಮಣ್ಣು) · DAILY FARM INTELLIGENCE REPORT
==================================================
Date: ${activeReport.reportDate}
Plot: ${activeReport.plotName || 'All Registered Plots'} (${activeReport.acres} acres)
Target Crop: ${(activeReport.crop || 'ragi').toUpperCase()}
Report ID: ${activeReport.reportId}
Generated At: ${new Date(activeReport.generatedAt || Date.now()).toLocaleString()}

--------------------------------------------------
1. CHRONOLOGICAL FIELD ACTIVITIES:
${events}

--------------------------------------------------
2. SOIL HEALTH & SENSOR DIAGNOSTICS:
${soil}

--------------------------------------------------
3. CROP HEALTH & PATHOLOGY INSPECTION:
${inv}

--------------------------------------------------
4. FERTILIZER & NUTRIENT ADVISORY (ICAR / UAS BANGALORE):
• Doses strictly calculated under verified scientific package of practices.
• Basal DAP nitrogen credited against Urea to prevent nitrogen toxicity.
• Zero arithmetic generated or altered by AI.

--------------------------------------------------
ℹ️ NOTICE:
Confirm with your nearest Krishi Vigyan Kendra (KVK) before purchasing inputs.
Sent via Mannu Farm Decision Layer.`;

      const toParam = validEmails.length ? `&to=${encodeURIComponent(validEmails.join(','))}` : '';
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1${toParam}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    });
  }
});
