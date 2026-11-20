import { initShell, getLang, createTranslator, onReady, recordActivityEvent, escHtml } from './mannu-shell.mjs';

const DICT = {
  kn: {
    headerSub: 'ಲೈವ್ ದೃಶ್ಯ ಕೃಷಿ ಸಹಾಯಕ',
    introDesc: 'ಬೆಳೆ ಎಲೆಗಳ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಲಕ್ಷಣಗಳನ್ನು ಮತ್ತು ಸುರಕ್ಷಿತ ಮುಂದಿನ ಹಂತಗಳನ್ನು ಪಡೆಯಿರಿ.',
    camTitle: 'ಬೆಳೆ ಲೈವ್ ತಪಾಸಣೆ',
    btnStartCam: '📷 ಕ್ಯಾಮೆರಾ ಆನ್',
    btnStopCam: '⏹ ಕ್ಯಾಮೆರಾ ಆಫ್',
    camTapPrompt: 'ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಮಾದರಿ / ಫೋಟೋ ಬಳಸಿ',
    camStandby: 'ಸಿದ್ಧವಾಗಿದೆ',
    camActive: 'ಲೈವ್ ಸಕ್ರಿಯ',
    camDenied: 'ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ಇಲ್ಲ',
    btnCapture: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    btnUpload: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
    btnSwitchCam: 'ಕ್ಯಾಮೆರಾ ಬದಲಿಸಿ',
    btnVoiceAsk: 'ಧ್ವನಿ ಪ್ರಶ್ನೆ',
    lblPresets: 'ತ್ವರಿತ ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು (ಕ್ಯಾಮೆರಾ ಇಲ್ಲದಿದ್ದಾಗ):',
    preRagi: '🌾 ರಾಗಿ ಎಲೆ ಚುಕ್ಕೆ',
    preMaize: '🌽 ಮೆಕ್ಕೆಜೋಳ N ಕೊರತೆ',
    preTomato: '🍅 ಟೊಮೇಟೊ ಬ್ಲೈಟ್',
    lblPlotAssoc: 'ಜಮೀನು ಆಯ್ಕೆ',
    lblZoneAssoc: 'ವಲಯ (ಐಚ್ಛಿಕ)',
    btnListen: 'ಕೇಳಿ',
    btnStopAudio: 'ನಿಲ್ಲಿಸಿ',
    msgAnalyzing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ.',
    lblSymptoms: '🔍 ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು',
    lblCauses: '⚠️ ಸಂಭಾವ್ಯ ಕಾರಣಗಳು (ದೃಢೀಕೃತ ರೋಗನಿರ್ಣಯವಲ್ಲ)',
    lblConf: '📊 ದೃಢೀಕರಣ ಮಟ್ಟ',
    lblSupEv: 'ಪೂರಕ ಪುರಾವೆ:',
    lblMisEv: 'ಕೊರತೆಯ ಮಾಹಿತಿ:',
    lblNextSteps: '✅ ಸುರಕ್ಷಿತ ಮುಂದಿನ ಹಂತಗಳು',
    safetyGuard: 'ಸುರಕ್ಷತಾ ಸೂಚನೆ: ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕ ಪ್ರಮಾಣವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನೀಡಲಾಗುವುದಿಲ್ಲ. ದೃಢೀಕರಣಕ್ಕಾಗಿ ಸ್ಥಳೀಯ KVK ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    btnGenDiagram: 'ದೃಶ್ಯ ವಿವರಣೆ ಚಿತ್ರ ರಚಿಸಿ',
    btnSaveCase: 'ದಾಖಲೆಯಲ್ಲಿ ಉಳಿಸಿ',
    lblVisualExpTitle: '🎨 ಶೈಕ್ಷಣಿಕ ದೃಶ್ಯ ವಿವರಣೆ (ದೃಢೀಕೃತ ಮಾಹಿತಿ)',
    btnDlSvg: '⬇ ಡೌನ್‌ಲೋಡ್',
    lblFollowUp: '💬 ಮುಂದಿನ ಪ್ರಶ್ನೆ ಕೇಳಿ',
    phChat: 'ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ (ಉದಾ: ಇದು ಹರಡುತ್ತದೆಯೇ?)',
    lblCaseMem: 'ಹಿಂದಿನ ತಪಾಸಣೆಗಳು ಮತ್ತು ಫಲಿತಾಂಶ',
    noCases: 'ಹಿಂದಿನ ತಪಾಸಣೆಗಳು ಇನ್ನೂ ದಾಖಲಾಗಿಲ್ಲ.',
    savedOk: 'ತಪಾಸಣೆಯನ್ನು ಪ್ರಕರಣ ಸ್ಮರಣೆಯಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!',
    outcomeBtn: 'ಫಲಿತಾಂಶ ದಾಖಲಿಸಿ',
    improved: 'ಸುಧಾರಿಸಿದೆ',
    worsened: 'ಹೆಚ್ಚಾಗಿದೆ',
    verified: 'ತಜ್ಞರಿಂದ ದೃಢೀಕೃತ',
    unverified: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    noPlot: '-- ಸಾಮಾನ್ಯ ಜಮೀನು --',
    healthyTitle: 'ಆರೋಗ್ಯಕರ ಎಲೆ',
    affectedTitle: 'ಲಕ್ಷಣ ಕಂಡ ಎಲೆ'
  },
  en: {
    headerSub: 'Live Visual Crop Assistant',
    introDesc: 'Capture or upload a leaf photo to inspect crop symptoms, visual guides, and safe next steps.',
    camTitle: 'Live Crop Inspection',
    btnStartCam: '📷 Start Camera',
    btnStopCam: '⏹ Stop Camera',
    camTapPrompt: 'Tap to start camera OR test instantly with a sample preset / photo upload below',
    camStandby: 'Standby',
    camActive: 'Camera Active',
    camDenied: 'Camera Denied',
    btnCapture: 'Capture & Scan',
    btnUpload: 'Upload Photo',
    btnSwitchCam: 'Switch Camera',
    btnVoiceAsk: 'Voice Question',
    lblPresets: 'Instant Test Presets (no physical leaf needed):',
    preRagi: '🌾 Ragi Leaf Blast',
    preMaize: '🌽 Maize N-Deficiency',
    preTomato: '🍅 Tomato Early Blight',
    lblPlotAssoc: 'Associate Farmland Plot',
    lblZoneAssoc: 'Zone (optional)',
    btnListen: 'Listen',
    btnStopAudio: 'Stop',
    msgAnalyzing: 'Analyzing plant symptoms… please wait.',
    lblSymptoms: '🔍 Observed Symptoms',
    lblCauses: '⚠️ Possible Causes (unverified estimate)',
    lblConf: '📊 Confidence Level',
    lblSupEv: 'Supporting Evidence:',
    lblMisEv: 'Missing Evidence:',
    lblNextSteps: '✅ Safe Next Steps',
    safetyGuard: 'Safety Guardrail: Mannu never invents chemical pesticide dosages or mixtures. Escalate to your local KVK/agronomist for diagnosis confirmation.',
    btnGenDiagram: 'Generate Visual Explanation',
    btnSaveCase: 'Save to Case Memory',
    lblVisualExpTitle: '🎨 Educational Visual Comparison (Grounded Labels)',
    btnDlSvg: '⬇ Download SVG',
    lblFollowUp: '💬 Ask Follow-up Question',
    phChat: 'Ask a question (e.g. Can this spread?)',
    lblCaseMem: 'Agricultural Case Memory & Outcomes',
    noCases: 'No saved investigations yet.',
    savedOk: 'Investigation saved to Agricultural Case Memory!',
    outcomeBtn: 'Record Outcome',
    improved: 'Improved',
    worsened: 'Worsened',
    verified: 'Expert Verified',
    unverified: 'Unverified',
    noPlot: '-- General Field --',
    healthyTitle: 'Healthy Leaf',
    affectedTitle: 'Affected Leaf'
  }
};

const S = {
  stream: null,
  facing: 'environment',
  imageDataUrl: null,
  sessionId: null,
  investigationId: null,
  assessment: null,
  lastHint: '',
  speaking: false
};

const $ = (id) => document.getElementById(id);
const t = createTranslator(DICT);
initShell({
  activeNav: 'live',
  dict: DICT,
  onLangChange: () => {
    loadPlots();
    loadCases();
    if (S.assessment) renderAssessment(S.assessment);
  }
});

async function toggleCamera() {
  if (S.stream) {
    S.stream.getTracks().forEach((tr) => tr.stop());
    S.stream = null;
    $('cam-video').srcObject = null;
    $('cam-placeholder').classList.remove('m-hidden');
    $('cam-dot').className = 'dot-live';
    $('cam-status-txt').textContent = t('camStandby');
    $('btn-live-toggle').textContent = t('btnStartCam');
    return;
  }
  try {
    S.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: S.facing }, width: { ideal: 1280 } }, audio: false });
    const v = $('cam-video');
    v.srcObject = S.stream;
    await v.play();
    $('cam-placeholder').classList.add('m-hidden');
    $('cam-dot').className = 'dot-live on';
    $('cam-status-txt').textContent = t('camActive');
    $('btn-live-toggle').textContent = t('btnStopCam');
  } catch {
    $('cam-dot').className = 'dot-live err';
    $('cam-status-txt').textContent = t('camDenied');
  }
}

function drawPresetLeaf(kind) {
  const c = $('cam-canvas');
  c.width = 480; c.height = 360;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e8f5e9';
  ctx.fillRect(0, 0, 480, 360);
  // Draw botanical leaf silhouette
  ctx.save();
  ctx.translate(240, 180);
  ctx.rotate(-0.25);
  ctx.beginPath();
  ctx.moveTo(-160, 0);
  ctx.quadraticCurveTo(0, -100, 170, 0);
  ctx.quadraticCurveTo(0, 100, -160, 0);
  ctx.fillStyle = kind === 'maize_n' ? '#84cc16' : '#2e7d32';
  ctx.fill();
  ctx.strokeStyle = '#1b5e20'; ctx.lineWidth = 4; ctx.stroke();
  // Midrib
  ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(160, 0); ctx.strokeStyle = '#d9f99d'; ctx.lineWidth = 5; ctx.stroke();

  if (kind === 'maize_n') {
    // V-shaped yellowing from leaf tip
    ctx.beginPath(); ctx.moveTo(170, 0); ctx.lineTo(10, -45); ctx.lineTo(40, 0); ctx.lineTo(10, 45); ctx.closePath();
    ctx.fillStyle = '#facc15'; ctx.fill();
  } else if (kind === 'tomato_blight') {
    // Concentric brown rings with yellow halos
    [[-40, -20], [30, 18], [80, -10]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fillStyle = '#fde047'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fillStyle = '#78350f'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.stroke();
    });
  } else {
    // Ragi spindle lesions
    [[-50, -15], [15, 22], [70, -8]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.ellipse(x, y, 22, 9, 0.2, 0, Math.PI * 2); ctx.fillStyle = '#7c2d12'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y, 11, 4, 0.2, 0, Math.PI * 2); ctx.fillStyle = '#d6d3d1'; ctx.fill();
    });
  }
  ctx.restore();
  return c.toDataURL('image/jpeg', 0.9);
}

function buildLocalAssessment(hintStr, lang) {
  const hint = String(hintStr || '').toLowerCase();
  if (hint.includes('maize') || hint.includes('nitrogen')) {
    return lang === 'kn' ? {
      identifiedCrop: 'ಮೆಕ್ಕೆಜೋಳ (ದೃಶ್ಯ ಅಂದಾಜು)',
      observedSymptoms: [
        'ಕೆಳಭಾಗದ ಹಳೆಯ ಎಲೆಗಳ ತುದಿಯಿಂದ ಮಧ್ಯನಾಳದ ಉದ್ದಕ್ಕೂ V-ಆಕಾರದ ಹಳದಿ ಬಣ್ಣ',
        'ಎಲೆಗಳ ಅಂಚುಗಳು ಸ್ವಲ್ಪ ಒಣಗಿರುವುದು',
        'ಮೇಲ್ಭಾಗದ ಹೊಸ ಎಲೆಗಳು ಹಸಿರಾಗಿವೆ'
      ],
      possibleCauses: [
        { name: 'ಸಾರಜನಕ (Nitrogen) ಕೊರತೆ', likelihood: 'high', reasoning: 'ಕೆಳಗಿನ ಹಳೆಯ ಎಲೆಗಳಲ್ಲಿ V-ಆಕಾರದ ಹಳದಿ ಬಣ್ಣ ಸಾರಜನಕ ಕೊರತೆಯ ಪ್ರಮುಖ ಲಕ್ಷಣವಾಗಿದೆ.' },
        { name: 'ನೀರಿನ ಬಸಿಗಾಲುವೆ / ಬೇರು ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಸಮಸ್ಯೆ', likelihood: 'medium', reasoning: 'ಅತಿಯಾದ ತೇವಾಂಶದಿಂದ ಬೇರುಗಳು ಸಾರಜನಕ ಹೀರಿಕೊಳ್ಳಲು ತೊಂದರೆಯಾಗಬಹುದು.' }
      ],
      confidence: 76,
      supportingEvidence: ['ಕೆಳ ಎಲೆಗಳಲ್ಲಿ V-ಆಕಾರದ ಕ್ಲೋರೋಸಿಸ್', 'ಬೆಳವಣಿಗೆಯ ಹಂತದೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ'],
      missingEvidence: ['ಮಣ್ಣಿನ ನೈಟ್ರೇಟ್-N ಅಳತೆ', 'ಹತ್ತಿರದ ಗಿಡಗಳ ಚಿತ್ರ'],
      recommendedNextSteps: [
        'ಮಣ್ಣು ಆ್ಯಪ್‌ನ ಡೋಸ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಮೂಲಕ ಸಾರಜನಕದ ಪ್ರಮಾಣ ಪರಿಶೀಲಿಸಿ',
        'ಹೊಲದಲ್ಲಿ ನೀರು ನಿಂತಿದ್ದರೆ ಬಸಿಗಾಲುವೆ ಸರಿಪಡಿಸಿ',
        '3–5 ಹತ್ತಿರದ ಗಿಡಗಳಲ್ಲಿ ಇದೇ ಲಕ್ಷಣ ಇದೆಯೇ ಎಂದು ಗಮನಿಸಿ'
      ],
      diagramCategory: 'nitrogen_deficiency',
      analysisSource: 'agronomic_fallback'
    } : {
      identifiedCrop: 'Maize (Visual estimate)',
      observedSymptoms: [
        'V-shaped yellowing starting from lower older leaf tips along the midrib',
        'Mild drying at older leaf tips',
        'Upper younger leaves remain relatively green'
      ],
      possibleCauses: [
        { name: 'Nitrogen Deficiency', likelihood: 'high', reasoning: 'V-shaped chlorosis along the midrib of older leaves is characteristic of mobile nitrogen shortage.' },
        { name: 'Root Uptake / Waterlogging Stress', likelihood: 'medium', reasoning: 'Excess soil moisture can restrict root nitrate uptake even when nitrogen is present.' }
      ],
      confidence: 76,
      supportingEvidence: ['Lower-leaf V-shaped chlorosis pattern', 'Consistent with vegetative demand'],
      missingEvidence: ['Current zone NO3-N reader measurement', 'Wide shot of neighboring rows'],
      recommendedNextSteps: [
        'Check your deterministic Urea split schedule in Soil Health Plan before applying',
        'Inspect drainage channels if heavy rain occurred recently',
        'Compare 4–5 neighboring plants in the same plot zone'
      ],
      diagramCategory: 'nitrogen_deficiency',
      analysisSource: 'agronomic_fallback'
    };
  }
  if (hint.includes('tomato') || hint.includes('blight')) {
    return lang === 'kn' ? {
      identifiedCrop: 'ಟೊಮೇಟೊ (ದೃಶ್ಯ ಅಂದಾಜು)',
      observedSymptoms: [
        'ಎಲೆಗಳ ಮೇಲೆ ಗಾಢ ಕಂದು ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು',
        'ಚುಕ್ಕೆಗಳ ಸುತ್ತ ಹಳದಿ ಅಂಚು',
        'ಕೆಳಗಿನ ಎಲೆಗಳು ಉದುರುವ ಲಕ್ಷಣ'
      ],
      possibleCauses: [
        { name: 'ಆರಂಭಿಕ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ (Early Blight - ಶಂಕಿತ)', likelihood: 'high', reasoning: 'ಉಂಗುರದಂತಹ ಕಂದು ಚುಕ್ಕೆಗಳು ಮತ್ತು ಹಳದಿ ವಲಯ ಶಿಲೀಂಧ್ರ ಸೋಂಕನ್ನು ಸೂಚಿಸಬಹುದು.' },
        { name: 'ತೇವಾಂಶ ಮತ್ತು ಗಾಳಿಯ ಕೊರತೆ', likelihood: 'medium', reasoning: 'ಎಲೆಗಳ ಮೇಲೆ ದೀರ್ಘಕಾಲ ನೀರು ನಿಲ್ಲುವುದರಿಂದ ಸೋಂಕು ಹರಡಬಹುದು.' }
      ],
      confidence: 72,
      supportingEvidence: ['ಕಂದು ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು ಮತ್ತು ಹಳದಿ ಹಾಲೋ'],
      missingEvidence: ['ಎಲೆಯ ಕೆಳಭಾಗದ ಸ್ಪಷ್ಟ ಫೋಟೋ', 'ಕಾಂಡ ಮತ್ತು ಹಣ್ಣಿನ ಪರಿಶೀಲನೆ'],
      recommendedNextSteps: [
        'ಹೆಚ್ಚಾಗಿ ಬಾಧಿತವಾದ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ಹೊಲದಿಂದ ದೂರ ನಾಶಪಡಿಸಿ',
        'ಸಂಜೆ ಸಮಯದಲ್ಲಿ ಎಲೆಗಳ ಮೇಲೆ ನೀರು ಸಿಂಪಡಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ',
        'ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆಗೆ ಹತ್ತಿರದ KVK ಅಥವಾ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ'
      ],
      diagramCategory: 'fungal_blight',
      analysisSource: 'agronomic_fallback'
    } : {
      identifiedCrop: 'Tomato (Visual estimate)',
      observedSymptoms: [
        'Dark brown concentric lesions on lower leaves',
        'Yellow chlorotic halo surrounding spots',
        'Early senescence of affected lower foliage'
      ],
      possibleCauses: [
        { name: 'Suspected Early Blight (Fungal leaf spot)', likelihood: 'high', reasoning: 'Concentric target-like rings with yellow halos are typical of Alternaria leaf spot, requiring field confirmation.' },
        { name: 'Foliar wetness & canopy humidity stress', likelihood: 'medium', reasoning: 'Prolonged leaf moisture accelerates fungal spore spread.' }
      ],
      confidence: 72,
      supportingEvidence: ['Concentric dark spots with yellow margins'],
      missingEvidence: ['Underside leaf close-up', 'Stem and fruit inspection'],
      recommendedNextSteps: [
        'Prune and safely dispose of severely spotted lower leaves away from healthy rows',
        'Avoid overhead evening irrigation to keep foliage dry',
        'Consult nearest KVK or agronomist before selecting any fungicide (Mannu does not invent chemical dosages)'
      ],
      diagramCategory: 'fungal_blight',
      analysisSource: 'agronomic_fallback'
    };
  }
  return lang === 'kn' ? {
    identifiedCrop: 'ರಾಗಿ / ಧಾನ್ಯದ ಬೆಳೆ (ದೃಶ್ಯ ಅಂದಾಜು)',
    observedSymptoms: [
      'ಎಲೆಗಳ ಮೇಲೆ ವಜ್ರಾಕಾರದ ಬೂದು-ಕಂದು ಚುಕ್ಕೆಗಳು',
      'ಎಲೆ ತುದಿಯಲ್ಲಿ ಒಣಗುವ ಲಕ್ಷಣ',
      'ಹತ್ತಿರದ ಗಿಡಗಳಲ್ಲಿ ಹರಡುವ ಸಾಧ್ಯತೆ'
    ],
    possibleCauses: [
      { name: 'ಬೆಂಕಿ ರೋಗ / ಎಲೆ ಚುಕ್ಕೆ (Leaf Blast - ಶಂಕಿತ)', likelihood: 'medium', reasoning: 'ಬೂದು ಮಧ್ಯಭಾಗ ಮತ್ತು ಕಂದು ಅಂಚಿನ ಚುಕ್ಕೆಗಳು ಎಲೆ ಬೆಂಕಿ ರೋಗವನ್ನು ಹೋಲುತ್ತವೆ.' },
      { name: 'ಪೋಷಕಾಂಶ ಅಸಮತೋಲನ / ಒಣ ಹವೆ ಒತ್ತಡ', likelihood: 'medium', reasoning: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಸಾರಜನಕದ ವ್ಯತ್ಯಾಸದಿಂದ ಎಲೆ ಒಣಗಬಹುದು.' }
    ],
    confidence: 68,
    supportingEvidence: ['ಎಲೆಯ ಮೇಲ್ಮೈಯಲ್ಲಿ ಕಂದು ಚುಕ್ಕೆಗಳು ಮತ್ತು ಅಂಚು ಒಣಗಿರುವುದು'],
    missingEvidence: ['ಎಲೆಯ ಕೆಳಭಾಗದ ಹತ್ತಿರದ ಫೋಟೋ', 'ಹೊಲದ ಇತರ ವಲಯಗಳ ಹೋಲಿಕೆ'],
    recommendedNextSteps: [
      'ಬಾಧಿತ ಗಿಡವನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ಹತ್ತಿರದ 10 ಗಿಡಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
      'ಹೆಚ್ಚುವರಿ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವನ್ನು ತಕ್ಷಣ ಹಾಕಬೇಡಿ',
      'ದೃಢೀಕರಣಕ್ಕಾಗಿ KVK ಕೃಷಿ ತಜ್ಞರಿಗೆ ಫೋಟೋ ತೋರಿಸಿ'
    ],
    diagramCategory: 'fungal_blight',
    analysisSource: 'agronomic_fallback'
  } : {
    identifiedCrop: 'Ragi / Cereal Crop (Visual estimate)',
    observedSymptoms: [
      'Spindle/diamond-shaped grey-brown lesions on leaf blade',
      'Mild drying along leaf margins',
      'Localized spotting pattern'
    ],
    possibleCauses: [
      { name: 'Suspected Leaf Blast / Fungal Spot', likelihood: 'medium', reasoning: 'Spindle lesions with grey centers resemble early blast symptoms, pending close-up confirmation.' },
      { name: 'Moisture or nutrient stress', likelihood: 'medium', reasoning: 'Irregular irrigation and excess N can increase leaf susceptibility.' }
    ],
    confidence: 68,
    supportingEvidence: ['Visible leaf blade lesions and tip drying'],
    missingEvidence: ['Macro close-up of lesion center & leaf underside', 'Check of neck/panicle node'],
    recommendedNextSteps: [
      'Inspect 10 neighboring plants in the same plot zone to check spread',
      'Avoid excessive nitrogen top-dressing until symptoms are verified',
      'Escalate to KVK or local agricultural officer for treatment confirmation'
    ],
    diagramCategory: 'fungal_blight',
    analysisSource: 'agronomic_fallback'
  };
}

function buildLocalChatReply(message, assessment, lang) {
  const m = String(message || '').toLowerCase();
  const crop = assessment?.identifiedCrop || (lang === 'kn' ? 'ಬೆಳೆ' : 'crop');
  if (m.includes('pesticide') || m.includes('spray') || m.includes('dose') || m.includes('medicine') || m.includes('ಔಷಧಿ') || m.includes('ಸಿಂಪಡಣೆ')) {
    return lang === 'kn'
      ? `ಸುರಕ್ಷತಾ ನಿಯಮದ ಪ್ರಕಾರ, ಕೇವಲ ಫೋಟೋ ಆಧಾರದ ಮೇಲೆ ಮಣ್ಣು ಆ್ಯಪ್ ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕ ಪ್ರಮಾಣವನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ತಜ್ಞರಿಂದ ${crop} ರೋಗವನ್ನು ದೃಢಪಡಿಸಿ ಸಲಹೆ ಪಡೆಯಿರಿ.`
      : `For safety, Mannu never invents chemical pesticide mixtures or dosages from a single photo. Please confirm the diagnosis for ${crop} with your local KVK or extension agronomist before spraying.`;
  }
  if (m.includes('spread') || m.includes('ಹರಡ') || m.includes('neighbor')) {
    return lang === 'kn'
      ? 'ಹೌದು, ತೇವಾಂಶ ಮತ್ತು ಗಾಳಿಯಿಂದ ಕೆಲವು ರೋಗಗಳು ಹತ್ತಿರದ ಗಿಡಗಳಿಗೆ ಹರಡಬಹುದು. ಬಾಧಿತ ಎಲೆಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ ಮತ್ತು ಸುತ್ತಲಿನ 5–10 ಗಿಡಗಳನ್ನು ಪ್ರತಿದಿನ ಪರಿಶೀಲಿಸಿ.'
      : 'Yes, fungal or pest issues can spread under humid conditions. Isolate heavily affected leaves, avoid evening overhead watering, and inspect 5–10 surrounding plants daily.';
  }
  if (m.includes('soil') || m.includes('nitrogen') || m.includes('urea') || m.includes('ಮಣ್ಣು') || m.includes('ಗೊಬ್ಬರ')) {
    return lang === 'kn'
      ? 'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆಯೂ ಎಲೆ ಬಣ್ಣ ಬದಲಾಗಲು ಕಾರಣವಾಗಬಹುದು. ಜಮೀನು ನಕ್ಷೆ ಅಥವಾ ಗೊಬ್ಬರ ಯೋಜನೆಯಲ್ಲಿ ನಿಮ್ಮ ವಲಯದ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ಮೌಲ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
      : 'Soil nutrient imbalance can look similar to foliar stress. Check your Soil Health Card and sensor readings in the Farmland Map before adjusting fertiliser.';
  }
  return lang === 'kn'
    ? `${crop} ಗಾಗಿ ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ, ಮೊದಲು ಹತ್ತಿರದ ಗಿಡಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ, ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ ಮತ್ತು ಹತ್ತಿರದ KVK ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.`
    : `Based on the observed symptoms on ${crop}, inspect neighboring plants, ensure proper drainage, and consult your local KVK for confirmation.`;
}

async function runAnalysis(dataUrl, hint = '') {
  S.imageDataUrl = dataUrl;
  S.lastHint = hint;
  $('panel-result').classList.remove('m-hidden');
  $('cap-thumb').src = dataUrl;
  $('res-meta').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  $('res-loading').classList.remove('m-hidden');
  $('res-body').classList.add('m-hidden');
  $('diagram-box').classList.add('m-hidden');
  $('panel-result').scrollIntoView({ behavior: 'smooth' });

  const base64 = dataUrl.split(',')[1] || dataUrl;
  const payload = {
    imageBase64: base64,
    mimeType: 'image/jpeg',
    farmerId: 'local-farmer',
    language: getLang(),
    cropInfo: {
      plotId: $('plot-select').value || null,
      zoneId: $('zone-input').value.trim() || null,
      presetHint: hint
    }
  };

  try {
    const res = await fetch('/api/visual/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('http_' + res.status);
    const data = await res.json();
    if (!data || !data.assessment) throw new Error('empty_assessment');
    S.investigationId = data.investigationId || ('inv_' + Date.now());
    S.sessionId = data.sessionId || ('sess_' + Date.now());
    S.assessment = data.assessment;
    renderAssessment(data.assessment);
  } catch {
    S.investigationId = 'inv_' + Date.now();
    S.sessionId = 'sess_' + Date.now();
    S.assessment = buildLocalAssessment(hint, getLang());
    renderAssessment(S.assessment);
  }
}

function renderAssessment(a) {
  $('res-loading').classList.add('m-hidden');
  $('res-body').classList.remove('m-hidden');
  const L = getLang();

  $('res-crop').textContent = a.identifiedCrop || '--';
  $('res-symptoms').innerHTML = (a.observedSymptoms || []).map((s) => `<li>${escHtml(s)}</li>`).join('');
  $('res-causes').innerHTML = (a.possibleCauses || []).map((c, idx) => {
    const name = typeof c === 'string' ? c : (c.name || c.cause || '');
    const reason = c.reasoning ? `<div class="m-mut">${escHtml(c.reasoning)}</div>` : '';
    return `<div style="padding:6px 0;border-bottom:1px dashed #e5e7eb"><strong>${idx + 1}. ${escHtml(name)}</strong>${reason}</div>`;
  }).join('');

  const conf = Number.isFinite(Number(a.confidence)) ? Math.min(100, Math.max(5, Math.round(Number(a.confidence)))) : 68;
  $('res-conf-bar').style.width = `${conf}%`;
  $('res-conf-txt').textContent = `${conf}% (${a.analysisSource === 'gemini_vision' ? 'Gemini Vision' : (L === 'kn' ? 'ಕೃಷಿ ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ' : 'Agronomic Pattern')})`;

  $('res-sup-ev').textContent = (a.supportingEvidence || []).join('; ') || '--';
  $('res-mis-ev').textContent = (a.missingEvidence || []).join('; ') || '--';
  $('res-steps').innerHTML = (a.recommendedNextSteps || []).map((s) => `<li>${escHtml(s)}</li>`).join('');
}

function buildEducationalSvg(a) {
  const L = getLang();
  const cat = a.diagramCategory || (S.lastHint.includes('maize') ? 'nitrogen_deficiency' : 'fungal_blight');
  const title = a.identifiedCrop || (L === 'kn' ? 'ಬೆಳೆ ವಿವರಣೆ' : 'Crop Explanation');
  const step1 = (a.recommendedNextSteps && a.recommendedNextSteps[0]) || '';
  const symptom = (a.observedSymptoms && a.observedSymptoms[0]) || '';
  const isN = cat === 'nitrogen_deficiency';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" style="width:100%;height:auto;border-radius:10px;background:#f8fafc">
    <rect x="0" y="0" width="600" height="38" fill="#0f682b"/>
    <text x="16" y="24" fill="#fff" font-size="14" font-weight="bold">${escHtml(title)} — ${escHtml(t('lblVisualExpTitle'))}</text>
    <rect x="16" y="52" width="270" height="145" rx="12" fill="#e6f4ea" stroke="#16a34a" stroke-width="2"/>
    <text x="151" y="74" text-anchor="middle" fill="#14532d" font-size="13" font-weight="bold">✓ ${escHtml(t('healthyTitle'))}</text>
    <path d="M55,130 Q150,75 245,130 Q150,185 55,130 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <line x1="65" y1="130" x2="235" y2="130" stroke="#dcfce7" stroke-width="3"/>
    <rect x="314" y="52" width="270" height="145" rx="12" fill="#fef7e0" stroke="#e37400" stroke-width="2"/>
    <text x="449" y="74" text-anchor="middle" fill="#92400e" font-size="13" font-weight="bold">⚠ ${escHtml(t('affectedTitle'))}</text>
    <path d="M353,130 Q448,75 543,130 Q448,185 353,130 Z" fill="${isN ? '#a3e635' : '#22c55e'}" stroke="#854d0e" stroke-width="2"/>
    ${isN
      ? '<polygon points="543,130 435,100 460,130 435,160" fill="#facc15"/>'
      : '<circle cx="420" cy="118" r="10" fill="#78350f"/><circle cx="470" cy="138" r="12" fill="#78350f"/>'}
    <line x1="363" y1="130" x2="533" y2="130" stroke="#fef08a" stroke-width="3"/>
    <rect x="16" y="208" width="568" height="42" rx="8" fill="#e8f0fe" stroke="#93c5fd"/>
    <text x="26" y="226" fill="#1e3a8a" font-size="11" font-weight="bold">${escHtml(symptom.slice(0, 78))}</text>
    <text x="26" y="242" fill="#0f682b" font-size="11">${escHtml(step1.slice(0, 78))}</text>
  </svg>`;
}

function speakSummary() {
  if (!('speechSynthesis' in window) || !S.assessment) return;
  if (S.speaking) {
    window.speechSynthesis.cancel();
    S.speaking = false;
    $('btn-speak-res').innerHTML = `🔊 <span>${t('btnListen')}</span>`;
    return;
  }
  const a = S.assessment;
  const text = `${a.identifiedCrop}. ${(a.observedSymptoms || []).slice(0, 2).join('. ')}. ${(a.recommendedNextSteps || []).slice(0, 2).join('. ')}`;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = getLang() === 'kn' ? 'kn-IN' : 'en-IN';
  u.onend = () => { S.speaking = false; $('btn-speak-res').innerHTML = `🔊 <span>${t('btnListen')}</span>`; };
  S.speaking = true;
  $('btn-speak-res').innerHTML = `⏹ <span>${t('btnStopAudio')}</span>`;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

async function sendFollowUp(msgText) {
  const txt = (msgText ?? $('chat-input').value).trim();
  if (!txt) return;
  $('chat-input').value = '';
  const box = $('chat-box');
  box.innerHTML += `<div class="chat-msg user">${escHtml(txt)}</div>`;

  let reply = '';
  try {
    const res = await fetch('/api/visual/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: S.sessionId, investigationId: S.investigationId, message: txt, language: getLang() })
    });
    if (!res.ok) throw new Error('http_' + res.status);
    const j = await res.json();
    reply = typeof j.reply === 'string' ? j.reply : (j.reply?.text || JSON.stringify(j.reply));
  } catch {
    reply = buildLocalChatReply(txt, S.assessment, getLang());
  }
  box.innerHTML += `<div class="chat-msg ai">${escHtml(reply)}</div>`;
  box.scrollTop = box.scrollHeight;
}

async function saveCase() {
  if (!S.assessment) return;
  const plotId = $('plot-select').value || null;
  const zoneId = $('zone-input').value.trim() || null;
  const rec = {
    investigationId: S.investigationId || ('inv_' + Date.now()),
    farmerId: 'local-farmer',
    plotId,
    zoneId,
    crop: S.assessment.identifiedCrop,
    language: getLang(),
    currentAssessment: S.assessment,
    verificationStatus: 'unverified',
    createdAt: new Date().toISOString()
  };

  try {
    await fetch('/api/investigations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) });
  } catch { /* offline safe */ }

  const list = JSON.parse(localStorage.getItem('mannu.investigations') || '[]').filter((x) => x.investigationId !== rec.investigationId);
  list.unshift(rec);
  localStorage.setItem('mannu.investigations', JSON.stringify(list.slice(0, 30)));

  await recordActivityEvent({
    eventType: 'visual_scan',
    plotId,
    zoneId,
    sourceModule: 'live',
    sourceRecordId: rec.investigationId,
    eventDetails: `${rec.crop}: ${(S.assessment.observedSymptoms || [])[0] || 'Scanned'}`
  });

  alert(t('savedOk'));
  loadCases();
}

async function loadPlots() {
  const sel = $('plot-select');
  sel.innerHTML = `<option value="">${escHtml(t('noPlot'))}</option>`;
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
    sel.appendChild(opt);
  });
}

async function loadCases() {
  const listEl = $('case-list');
  const local = JSON.parse(localStorage.getItem('mannu.investigations') || '[]');
  let srv = [];
  try {
    const res = await fetch('/api/investigations/local-farmer');
    if (res.ok) { const j = await res.json(); srv = Array.isArray(j) ? j : (j.investigations || []); }
  } catch { /* offline */ }
  const map = new Map();
  [...local, ...srv].forEach((c) => map.set(c.investigationId, c));
  const cases = [...map.values()].slice(0, 10);

  if (!cases.length) {
    listEl.innerHTML = `<div class="m-mut">${escHtml(t('noCases'))}</div>`;
    return;
  }
  listEl.innerHTML = '';
  cases.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'case-card';
    const statusLbl = c.outcomeStatus ? t(c.outcomeStatus) : t(c.verificationStatus === 'verified' ? 'verified' : 'unverified');
    div.innerHTML = `
      <div>
        <strong>🌾 ${escHtml(c.crop || 'Crop')}</strong>
        <div class="m-mut">${c.plotId ? escHtml(c.plotId) + ' · ' : ''}${new Date(c.createdAt || Date.now()).toLocaleDateString()}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="m-badge ${c.outcomeStatus === 'improved' ? 'm-badge-ok' : 'm-badge-warn'}">${escHtml(statusLbl)}</span>
        <button class="m-btn" data-outcome="${escHtml(c.investigationId)}" style="min-height:32px;font-size:12px;padding:4px 8px">${escHtml(t('outcomeBtn'))}</button>
      </div>
    `;
    div.addEventListener('click', (e) => {
      if (e.target.dataset.outcome) {
        e.stopPropagation();
        c.outcomeStatus = c.outcomeStatus === 'improved' ? 'worsened' : 'improved';
        const arr = JSON.parse(localStorage.getItem('mannu.investigations') || '[]');
        const idx = arr.findIndex((x) => x.investigationId === c.investigationId);
        if (idx >= 0) { arr[idx] = c; localStorage.setItem('mannu.investigations', JSON.stringify(arr)); }
        fetch(`/api/investigations/case/${c.investigationId}/outcome`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionTaken: 'Field follow-up', farmerReportedStatus: c.outcomeStatus })
        }).catch(() => { });
        loadCases();
        return;
      }
      if (c.currentAssessment) {
        S.investigationId = c.investigationId;
        S.sessionId = c.sessionId;
        S.assessment = c.currentAssessment;
        $('panel-result').classList.remove('m-hidden');
        renderAssessment(c.currentAssessment);
      }
    });
    listEl.appendChild(div);
  });
}

onReady(() => {
  loadPlots();
  loadCases();

  $('btn-live-toggle').addEventListener('click', toggleCamera);
  $('cam-placeholder').addEventListener('click', toggleCamera);
  $('btn-switch').addEventListener('click', () => { S.facing = S.facing === 'environment' ? 'user' : 'environment'; if (S.stream) { toggleCamera().then(toggleCamera); } });

  $('btn-capture').addEventListener('click', () => {
    const v = $('cam-video');
    if (S.stream && v.videoWidth) {
      const c = $('cam-canvas');
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0);
      runAnalysis(c.toDataURL('image/jpeg', 0.85), '');
    } else {
      runAnalysis(drawPresetLeaf('ragi_blast'), 'ragi blast leaf');
    }
  });

  $('file-upload').addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => runAnalysis(String(r.result), f.name);
    r.readAsDataURL(f);
  });

  document.querySelectorAll('.preset-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const p = b.dataset.preset;
      runAnalysis(drawPresetLeaf(p), p);
    });
  });

  $('btn-speak-res').addEventListener('click', speakSummary);
  $('btn-chat-send').addEventListener('click', () => sendFollowUp());
  $('chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendFollowUp(); });

  const startMic = (cb) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = getLang() === 'kn' ? 'kn-IN' : 'en-IN';
    rec.onresult = (ev) => cb(ev.results[0][0].transcript);
    rec.start();
  };
  $('btn-voice-ask').addEventListener('click', () => startMic((tr) => { $('panel-result').classList.remove('m-hidden'); sendFollowUp(tr); }));
  $('btn-chat-mic').addEventListener('click', () => startMic((tr) => sendFollowUp(tr)));

  $('btn-gen-diagram').addEventListener('click', () => {
    if (!S.assessment) return;
    const svg = buildEducationalSvg(S.assessment);
    $('diagram-svg-host').innerHTML = svg;
    $('diagram-box').classList.remove('m-hidden');
    localStorage.setItem('mannu.latest_diagram_svg', svg);
  });

  $('btn-dl-diagram').addEventListener('click', () => {
    const svg = $('diagram-svg-host').innerHTML;
    if (!svg) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = `mannu-visual-${Date.now()}.svg`;
    a.click();
  });

  $('btn-save-case').addEventListener('click', saveCase);
});
