import norms from './engine/norms.mjs';
import { computePlan, explain, summariseReadings } from './engine/engine.mjs';
import { t } from './engine/i18n.mjs';
import { keywordIntent } from './engine/intent.mjs';

const X = {
  kn: {
    online: '● ಆನ್‌ಲೈನ್',
    backHome: 'ಮುಖಪುಟ',
    backHomeLong: '🏠 ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    backHomeHint: 'ಮತ್ತೊಂದು ಸೇವೆಯನ್ನು ಬಳಸಲು ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
    heroTitle: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ಇಂದು ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕು?',
    heroDesc: 'ಕೆಳಗಿನ ದೊಡ್ಡ ಐಕಾನ್‌ಗಳಲ್ಲಿ ನಿಮಗೆ ಬೇಕಾದ ಸೇವೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಮತ್ತೊಂದು ಸೇವೆ ಬೇಕಾದಾಗ ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
    openBtn: 'ತೆರೆಯಿರಿ',
    sample: 'ಮಾದರಿ ಮಾಹಿತಿ (ಕೃತಕ, ಪ್ರದರ್ಶನಕ್ಕೆ ಮಾತ್ರ)',
    data: 'ಜಮೀನಿನ ಮಾಹಿತಿ ಫೈಲ್ (ಐಚ್ಛಿಕ)',
    sowdate: 'ಬಿತ್ತನೆ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)',
    bags: 'ಚೀಲ',
    ph: 'ಮಣ್ಣಿನ pH (ಐಚ್ಛಿಕ)',
    readings: 'ಓದುವಿಕೆಗಳು: {n} · ನೈಟ್ರೇಟ್-N ಮಧ್ಯಮ {v} mg/kg',
    qcBad: 'ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ವಿಫಲ: ಈ ಮಾಹಿತಿ ಬಳಸಲಾಗುವುದಿಲ್ಲ',
    parsed: 'ಕಾರ್ಡ್‌ನಿಂದ ಓದಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಮೌಲ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    manual: 'ಫೋಟೋ ಓದಲು ಆಗಲಿಲ್ಲ. ಮೌಲ್ಯಗಳನ್ನು ಕೈಯಿಂದ ಭರ್ತಿ ಮಾಡಿ.',
    heard: 'ಕೇಳಿದ್ದು',
    noVoice: 'ಈ ಫೋನ್‌ನಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ.',
    saved: 'ಉಳಿಸಲಾಗಿದೆ',
    mine: 'ನನ್ನ ಜಮೀನುಗಳು',
    yield: 'ಇಳುವರಿ (ಎಕರೆಗೆ ಕೆಜಿ)',
    add: 'ಸೇರಿಸಿ',
    export: 'ಮಾಹಿತಿ ಡೌನ್‌ಲೋಡ್ (CSV)',
    plannerIntroTitle: 'ಮಣ್ಣು ಮತ್ತು ಗೊಬ್ಬರ ಯೋಜನೆ',
    plannerIntroDesc: 'ನಿಮ್ಮ ಬೆಳೆ, ನೀರಾವರಿ ಮತ್ತು ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ವಿವರ ನೀಡಿ ನಿಖರವಾದ ಗೊಬ್ಬರ ಚೀಲಗಳ ಲೆಕ್ಕ ಪಡೆಯಿರಿ.',
    assistantIntroTitle: 'ಮಣ್ಣು AI ಧ್ವನಿ ಸಹಾಯಕ ಮತ್ತು ಪರ್ಯಾಯ ಗೊಬ್ಬರ',
    assistantIntroDesc: 'ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ ಸಲಹೆ ಪಡೆಯಿರಿ ಅಥವಾ ಯೂರಿಯಾ ಇಲ್ಲದಿದ್ದಾಗ ಸರಿಯಾದ ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಪ್ರಮಾಣ ಲೆಕ್ಕ ಹಾಕಿ.',
    subTitle: 'ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಲೆಕ್ಕಾಚಾರ (ಗೊಬ್ಬರ ಲಭ್ಯವಿಲ್ಲದಿದ್ದಾಗ)',
    subOrig: 'ಲಭ್ಯವಿಲ್ಲದ ಗೊಬ್ಬರ',
    subQty: 'ಪ್ರಮಾಣ (ಕೆಜಿ)',
    subAlt: 'ಬದಲಿ / ಪರ್ಯಾಯ ಗೊಬ್ಬರ',
    subStage: 'ಬಳಸುವ ಹಂತ',
    stageTop: 'ಮೇಲುಗೊಬ್ಬರ (Top-dress)',
    stageBasal: 'ಬಿತ್ತನೆ ವೇಳೆ (Basal)',
    subBtn: 'ಪರ್ಯಾಯ ಪ್ರಮಾಣ ಲೆಕ್ಕ ಹಾಕಿ',
    subResultLbl: 'ಸಮಾನ ಪ್ರಮಾಣ:',
    chatTitle: 'ಮಣ್ಣು AI ಕೃಷಿ ಸಲಹೆಗಾರ',
    voiceLbl: 'ಧ್ವನಿ ಶೈಲಿ',
    modeLbl: 'ಕೃಷಿ ಪದ್ಧತಿ',
    vFriendly: 'ಸ್ನೇಹಪರ',
    vClear: 'ಸ್ಪಷ್ಟ',
    vCalm: 'ಶಾಂತ',
    modeConv: 'ಸಾಮಾನ್ಯ ಕೃಷಿ',
    modeOrg: 'ಸಾವಯವ ಕೃಷಿ',
    stopSpeak: '⏹ ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    chatPh: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ...',
    sendBtn: 'ಕಳುಹಿಸಿ',
    welcomeChat: 'ನಮಸ್ಕಾರ! ನಾನು ಮಣ್ಣು AI ಸಹಾಯಕ. ಮಣ್ಣು, ಬೆಳೆ, ಗೊಬ್ಬರ, ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಅಥವಾ ಸಾವಯವ ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ.',
    offlineChat: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್: ಮೇಲಿನ ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಪೂರ್ಣ AI ಚಾಟ್‌ಗೆ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಬೇಕು.',
    chips: [
      ['⚠️ ಯೂರಿಯಾ ಪರ್ಯಾಯ', 'ನನ್ನ ಬಳಿ ಯೂರಿಯಾ ಇಲ್ಲ, ಪರ್ಯಾಯವೇನು?'],
      ['🌿 ಸಾವಯವ ಸಲಹೆ', 'ಸಾವಯವ ಕೃಷಿ ಸಲಹೆ ನೀಡಿ'],
      ['🌱 ರಾಗಿ ಗೊಬ್ಬರ', 'ರಾಗಿ ಬೆಳೆಗೆ ಗೊಬ್ಬರ ಡೋಸ್ ಎಷ್ಟು?'],
      ['💧 ನೀರಿನ ಸಲಹೆ', 'ಮಳೆ ಬರುವಾಗ ಯೂರಿಯಾ ಹಾಕಬಹುದೇ?']
    ]
  },
  en: {
    online: '● Online',
    backHome: 'Back to Home',
    backHomeLong: '🏠 Return to Home Page',
    backHomeHint: 'Return to the main dashboard to open another feature.',
    heroTitle: 'Welcome! Choose a farming service below',
    heroDesc: 'Tap any large card to open that service. Return to the Home Page anytime to use another feature.',
    openBtn: 'Open',
    sample: 'Sample data (synthetic, demo only)',
    data: 'Field data file (optional)',
    sowdate: 'Sowing date (optional)',
    bags: 'bags',
    ph: 'Soil pH (optional)',
    readings: 'Readings: {n} · median nitrate-N {v} mg/kg',
    qcBad: 'Quality check failed: this data will not be used',
    parsed: 'Read from the card. Please check the values.',
    manual: 'Could not read the photo. Please type the values.',
    heard: 'Heard',
    noVoice: 'No Kannada voice on this phone.',
    saved: 'Saved',
    mine: 'My plots',
    yield: 'Yield (kg per acre)',
    add: 'Add',
    export: 'Download data (CSV)',
    plannerIntroTitle: 'Soil Health & Fertiliser Plan',
    plannerIntroDesc: 'Enter your crop, water type, and Soil Health Card values to get an exact bag-level schedule and cost comparison.',
    assistantIntroTitle: 'Mannu AI Voice & Fertiliser Substitutes',
    assistantIntroDesc: 'Speak or type farming questions and compute exact chemical/organic substitutes when Urea or DAP is unavailable.',
    subTitle: 'Deterministic Fertiliser Substitute Calculator',
    subOrig: 'Unavailable Fertiliser',
    subQty: 'Quantity (kg)',
    subAlt: 'Replacement Option',
    subStage: 'Application Stage',
    stageTop: 'Top-dressing (Standing crop)',
    stageBasal: 'At Sowing (Basal)',
    subBtn: 'Calculate Equivalent Amount',
    subResultLbl: 'Equivalent Quantity:',
    chatTitle: 'Mannu AI Farm Advisor',
    voiceLbl: 'Voice Style',
    modeLbl: 'Farming Mode',
    vFriendly: 'Friendly',
    vClear: 'Clear',
    vCalm: 'Calm',
    modeConv: 'Conventional',
    modeOrg: 'Organic Mode',
    stopSpeak: '⏹ Stop Voice',
    chatPh: 'Type your farming question or tap the mic…',
    sendBtn: 'Send',
    welcomeChat: 'Hello! I am Mannu AI. Ask me about soil nutrients, crops, organic farming, or fertiliser substitutes.',
    offlineChat: 'Offline mode: the Fertiliser Substitute Calculator above works offline. Live AI chat requires server connection.',
    chips: [
      ['⚠️ Urea Substitute', 'I do not have urea, what can I use instead?'],
      ['🌿 Organic Advice', 'Give me organic farming advice'],
      ['🌱 Ragi Dose', 'What is the fertiliser dose for Ragi?'],
      ['💧 Rain & Top-dress', 'Should I apply urea before heavy rain?']
    ]
  }
};

const FEATURES = [
  {
    id: 'planner',
    icon: '🌱',
    tone: 'green',
    openView: 'planner',
    href: 'index.html?view=planner',
    knTitle: 'ಮಣ್ಣು ಮತ್ತು ಗೊಬ್ಬರ ಯೋಜನೆ',
    enTitle: 'Soil Health & Fertiliser Plan',
    knDesc: 'ಮಣ್ಣಿನ ಕಾರ್ಡ್ ಮೌಲ್ಯ, ಫೋಟೋ ಅಥವಾ ಧ್ವನಿಯಿಂದ ನಿಖರ ಗೊಬ್ಬರ ಚೀಲಗಳ ಲೆಕ್ಕ ಮತ್ತು ವೆಚ್ಚ ಪಡೆಯಿರಿ.',
    enDesc: 'Enter Soil Health Card values, card photo, or voice to get bag-level doses and cost savings.'
  },
  {
    id: 'mapping',
    icon: '🗺️',
    tone: 'earth',
    href: 'mapping.html',
    knTitle: 'ಜಮೀನು ನಕ್ಷೆ ಮತ್ತು ಮಣ್ಣಿನ ವಲಯ',
    enTitle: 'Farmland Map & Soil Zones',
    knDesc: 'ಉಪಗ್ರಹ ನಕ್ಷೆಯಲ್ಲಿ ಜಮೀನು ಗಡಿ ಗುರುತಿಸಿ, ನೀರು-ಪೋಷಕಾಂಶ ವಲಯಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಸೆನ್ಸಾರ್ ಮಾಪನ ಸೇರಿಸಿ.',
    enDesc: 'Map plot boundaries by walking or tapping, view water/nutrient layers, and record zone readings.'
  },
  {
    id: 'live',
    icon: '📸',
    tone: 'green',
    href: 'live.html',
    knTitle: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಎಲೆ ತಪಾಸಣೆ',
    enTitle: 'Crop Health & Leaf Scanner',
    knDesc: 'ಕ್ಯಾಮೆರಾ ಅಥವಾ ಫೋಟೋ ಮೂಲಕ ಬೆಳೆ ಎಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಲಕ್ಷಣಗಳು ಮತ್ತು ಸುರಕ್ಷಿತ ಸಲಹೆ ಪಡೆಯಿರಿ.',
    enDesc: 'Scan crop leaves with camera or photo upload to review symptoms, visual guides, and case history.'
  },
  {
    id: 'finance',
    icon: '💰',
    tone: 'earth',
    href: 'finance.html',
    knTitle: 'ಕೃಷಿ ಖರ್ಚು ಮತ್ತು ಲಾಭದ ಲೆಕ್ಕ',
    enTitle: 'Farm Finance & Profit Calculator',
    knDesc: 'ಬೆಳೆ ಖರ್ಚು, ಬ್ರೇಕ್-ಈವನ್ ಬೆಲೆ, ಮಳೆ-ಬೆಲೆ ಅಪಾಯ ಪರೀಕ್ಷೆ ಮತ್ತು 12 ತಿಂಗಳ ನಗದು ಹರಿವು ಲೆಕ್ಕ ಹಾಕಿ.',
    enDesc: 'Calculate cultivation costs, break-even price/yield, risk stress scenarios, and 12-month cashflow.'
  },
  {
    id: 'reports',
    icon: '📋',
    tone: 'green',
    href: 'reports.html',
    knTitle: 'ದೈನಂದಿನ ವರದಿ ಮತ್ತು ಕೃಷಿ ದಿನಚರಿ',
    enTitle: 'Daily Reports & Farm Logbook',
    knDesc: 'ದೈನಂದಿನ ಕೃಷಿ ಕೆಲಸ ದಾಖಲಿಸಿ, 8-ವಿಭಾಗದ ವರದಿ ತಯಾರಿಸಿ, PDF ಉಳಿಸಿ ಅಥವಾ Gmail ಮೂಲಕ ಕಳುಹಿಸಿ.',
    enDesc: 'Log daily farm work, generate complete 8-section reports, save PDF, listen aloud, or share by email.'
  },
  {
    id: 'prices',
    icon: '📊',
    tone: 'earth',
    href: 'community.html?view=prices',
    knTitle: 'ಮಂಡಿ ಬೆಲೆ ಮತ್ತು ಸುಗ್ಗಿ ದರ',
    enTitle: 'Mandi Prices & Price Forecast',
    knDesc: 'AGMARKNET ಮಂಡಿ ದರಗಳು, ಸರ್ಕಾರಿ MSP ಬೆಲೆ, 6 ತಿಂಗಳ ಇತಿಹಾಸ ಮತ್ತು ಸುಗ್ಗಿ ದರ ಅಂದಾಜು ನೋಡಿ.',
    enDesc: 'Check today’s APMC mandi prices, official MSP benchmarks, 6-month trends, and harvest forecasts.'
  },
  {
    id: 'market',
    icon: '🛒',
    tone: 'green',
    href: 'community.html?view=market',
    knTitle: 'ಬೆಳೆ ಮಾರಾಟ ಮತ್ತು ಬೀಜ-ಗೊಬ್ಬರ ಮಾರುಕಟ್ಟೆ',
    enTitle: 'Crop & Input Marketplace',
    knDesc: 'ಬೆಳೆ ಮಾರಾಟ ಅಥವಾ ಖರೀದಿ ಪಟ್ಟಿ ಪ್ರಕಟಿಸಿ, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ ಮತ್ತು ಪರವಾನಗಿ ಪಡೆದ ಮಾರಾಟಗಾರರನ್ನು ಹೋಲಿಸಿ.',
    enDesc: 'List crops to sell or buy, match with buyer demand, and compare licensed seed & fertiliser sellers.'
  },
  {
    id: 'feed',
    icon: '🤝',
    tone: 'earth',
    href: 'community.html?view=feed',
    knTitle: 'ರೈತರ ಸಮುದಾಯ ಚರ್ಚೆ',
    enTitle: 'Farmer Community & Discussion',
    knDesc: 'ಇತರ ರೈತರೊಂದಿಗೆ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ, ಪ್ರಶ್ನೆ ಕೇಳಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ಸಲಹೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
    enDesc: 'Share crop updates, ask fellow farmers questions, and reply to local farming discussions.'
  },
  {
    id: 'news',
    icon: '🏛️',
    tone: 'green',
    href: 'community.html?view=news',
    knTitle: 'ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆ ಮತ್ತು ಹವಾಮಾನ ಸುದ್ದಿ',
    enTitle: 'Official Govt & Weather News',
    knDesc: 'ಅಧಿಕೃತ MSP ಪ್ರಕಟಣೆಗಳು, IMD ಮಳೆ ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಮಾಹಿತಿ ಓದಿ.',
    enDesc: 'Read verified agriculture department MSP schedules, IMD rain alerts, and PMFBY insurance updates.'
  },
  {
    id: 'assistant',
    icon: '🎙️',
    tone: 'earth',
    openView: 'assistant',
    href: 'index.html?view=assistant',
    knTitle: 'ಮಣ್ಣು AI ಧ್ವನಿ ಸಹಾಯಕ ಮತ್ತು ಪರ್ಯಾಯ ಗೊಬ್ಬರ',
    enTitle: 'Mannu AI Voice & Fertiliser Substitutes',
    knDesc: 'ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಹಾಗೂ ಯೂರಿಯಾ/ಡಿಎಪಿ ಇಲ್ಲದಿದ್ದಾಗ ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಲೆಕ್ಕ ಹಾಕಿ.',
    enDesc: 'Ask farming questions by voice or text and calculate safe substitutes when Urea or DAP is unavailable.'
  }
];

const SUB_SPECS = {
  urea: { kn: 'ಯೂರಿಯಾ (46% N)', en: 'Urea (46% N)', N: 0.46, P2O5: 0, K2O: 0, S: 0, organic: false },
  dap: { kn: 'ಡಿಎಪಿ (18:46:0)', en: 'DAP (18:46:0)', N: 0.18, P2O5: 0.46, K2O: 0, S: 0, organic: false },
  ammonium_sulphate: { kn: 'ಅಮೋನಿಯಂ ಸಲ್ಫೇಟ್ (20.6% N)', en: 'Ammonium Sulphate (20.6% N)', N: 0.206, P2O5: 0, K2O: 0, S: 0.24, organic: false },
  can: { kn: 'ಕ್ಯಾಲ್ಸಿಯಂ ಅಮೋನಿಯಂ ನೈಟ್ರೇಟ್ (25% N)', en: 'Calcium Ammonium Nitrate (25% N)', N: 0.25, P2O5: 0, K2O: 0, S: 0, organic: false },
  complex_20_20_0_13: { kn: 'ಕಾಂಪ್ಲೆಕ್ಸ್ (20:20:0:13)', en: 'NPK Complex (20:20:0:13)', N: 0.20, P2O5: 0.20, K2O: 0, S: 0.13, organic: false },
  vermicompost: { kn: 'ಎರೆಹುಳು ಗೊಬ್ಬರ (ಸಾವಯವ)', en: 'Vermicompost (Organic)', N: 0.015, P2O5: 0.010, K2O: 0.015, S: 0, organic: true, availabilityFractionN: 0.5 },
  fym: { kn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ FYM (ಸಾವಯವ)', en: 'Farmyard Manure FYM (Organic)', N: 0.005, P2O5: 0.002, K2O: 0.005, S: 0, organic: true, availabilityFractionN: 0.3 }
};

function readInitialView() {
  try {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'planner' || v === 'assistant') return v;
  } catch { /* ignore */ }
  return 'home';
}

const L = () => S.lang;
const tx = (k, v = {}) => {
  let s = (X[L()] && X[L()][k]) || X.en[k] || k;
  for (const [a, b] of Object.entries(v)) s = s.replaceAll('{' + a + '}', b);
  return s;
};
const $ = (s, r = document) => r.querySelector(s);

const def = {
  lang: 'kn',
  crop: 'ragi',
  system: 'rainfed',
  acres: 1,
  soil: { N: {}, P: {}, K: {} },
  ph: '',
  habitUrea: '',
  habitDap: '',
  sowing: '',
  reading: null,
  readingRows: null,
  plots: [],
  plan: null,
  text: '',
  online: false,
  activeView: readInitialView(),
  subResult: null,
  subForm: { orig: 'urea', qty: 50, alt: 'ammonium_sulphate', stage: 'topdress' },
  chatVoice: 'friendly',
  chatMode: 'conventional',
  chatMsgs: []
};

let S = { ...def };
try {
  const stored = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
  const directLang = localStorage.getItem('mannu.lang');
  Object.assign(S, stored, { plan: null, text: '', online: false, activeView: readInitialView() });
  if (directLang === 'en' || directLang === 'kn') S.lang = directLang;
  S.chatVoice = localStorage.getItem('mannu.voice') || S.chatVoice;
  S.chatMode = localStorage.getItem('mannu.farming_mode') || S.chatMode;
} catch { /* private mode */ }

const save = () => {
  try {
    localStorage.setItem('mannu.v1', JSON.stringify({
      lang: S.lang,
      crop: S.crop,
      system: S.system,
      acres: S.acres,
      soil: S.soil,
      ph: S.ph,
      habitUrea: S.habitUrea,
      habitDap: S.habitDap,
      sowing: S.sowing,
      reading: S.reading,
      readingRows: S.readingRows,
      plots: S.plots
    }));
    localStorage.setItem('mannu.lang', S.lang);
  } catch { /* ignore */ }
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COL = { urea: '#34A853', dap: '#4285F4', mop: '#F9AB00' };
const bag = (f, c) => `<svg class="bag" viewBox="0 0 30 38" width="30" height="38" aria-hidden="true"><path d="M5 6h20l3 6v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V12z" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="3" y="${(35 - 23 * f).toFixed(1)}" width="24" height="${(23 * f).toFixed(1)}" fill="${c}" opacity=".85"/></svg>`;
const icons = (n, c) => { let h = ''; for (let i = 0; i < Math.floor(n); i++) h += bag(1, c); if (n - Math.floor(n) >= 0.5) h += bag(0.5, c); return h; };
const crops = ['ragi', 'maize', 'tomato'];

function renderHomeDashboard() {
  const l = L();
  const cards = FEATURES.map((f) => {
    const title = l === 'kn' ? f.knTitle : f.enTitle;
    const desc = l === 'kn' ? f.knDesc : f.enDesc;
    const iconCls = f.tone === 'earth' ? 'm-hub-icon earth' : 'm-hub-icon';
    const body = `
      <div class="m-hub-card-top">
        <div class="${iconCls}" aria-hidden="true">${f.icon}</div>
        <h3 class="m-hub-title">${esc(title)}</h3>
      </div>
      <p class="m-hub-desc">${esc(desc)}</p>
      <div class="m-hub-cta"><span>${esc(tx('openBtn'))}</span><span aria-hidden="true">→</span></div>
    `;
    if (f.openView) {
      return `<button type="button" class="m-hub-card" data-open-view="${f.openView}" data-feature-id="${f.id}">${body}</button>`;
    }
    return `<a class="m-hub-card" href="${f.href}" data-feature-id="${f.id}">${body}</a>`;
  }).join('');

  return `
    <div id="home-dashboard" class="${S.activeView === 'home' ? '' : 'm-hidden'}">
      <div class="m-hub-hero">
        <div class="m-hub-hero-badge" aria-hidden="true">🌾</div>
        <div>
          <h2>${esc(tx('heroTitle'))}</h2>
          <p>${esc(tx('heroDesc'))}</p>
        </div>
      </div>
      <div class="m-hub-grid" id="feature-grid">${cards}</div>
    </div>
  `;
}

function renderPlannerView() {
  const l = L(), nk = (k) => t(l, k), cls = ['unknown', 'low', 'medium', 'high'];
  const soilRow = (k) => `<b>${nk(k)}</b><div><label for="cls${k}">${nk('soil')}</label><select id="cls${k}">${cls.map((c) => `<option value="${c === 'unknown' ? '' : c}" ${((S.soil[k].cls || '') === (c === 'unknown' ? '' : c)) ? 'selected' : ''}>${nk(c)}</option>`).join('')}</select></div><div><label for="val${k}">kg/ha</label><input id="val${k}" type="number" inputmode="decimal" min="0" value="${S.soil[k].value ?? ''}"></div>`;

  return `
    <div id="planner-view" class="${S.activeView === 'planner' ? '' : 'm-hidden'}">
      <div class="m-page-intro">
        <div class="m-page-intro-ico" aria-hidden="true">🌱</div>
        <div>
          <h2>${esc(tx('plannerIntroTitle'))}</h2>
          <p>${esc(tx('plannerIntroDesc'))}</p>
        </div>
      </div>

      <section>
        <div class="row">
          <button type="button" class="sec" data-act="speak" id="btnSpeak">🎤 ${nk('speak')}</button>
          <label class="btn sec" for="fileCard" style="margin:0">📷 ${nk('photo')}</label>
        </div>
        <input id="fileCard" type="file" accept="image/*" capture="environment" hidden>
        <div class="mut" id="heard" style="margin-top:6px"></div>
      </section>

      <section>
        <h2>1. ${nk('pickCrop')}</h2>
        <div class="row">${crops.map((c) => `<button type="button" data-crop="${c}" class="${S.crop === c ? 'sel' : ''}">${nk(c)}</button>`).join('')}</div>
        <label>${nk('water')}</label>
        <div class="row">${['rainfed', 'irrigated'].map((w) => `<button type="button" data-system="${w}" class="${S.system === w ? 'sel' : ''}">${nk(w)}</button>`).join('')}</div>
        <label for="acres">${nk('area')}</label>
        <input id="acres" type="number" inputmode="decimal" min="0.25" step="0.25" value="${S.acres}">
      </section>

      <section>
        <h2>2. ${nk('soil')}</h2>
        <div class="n3">${['N', 'P', 'K'].map(soilRow).join('')}</div>
        <label for="ph">${tx('ph')}</label>
        <input id="ph" type="number" step="0.1" value="${S.ph}">
      </section>

      <section>
        <h2>3. ${tx('data')}</h2>
        <div class="row">
          <label class="btn" for="fileData" style="margin:0">📄 CSV / JSON</label>
          <button type="button" data-act="sample" id="btnSample">${tx('sample')}</button>
        </div>
        <input id="fileData" type="file" accept=".csv,.json" hidden>
        <div id="readingInfo" class="mut" style="margin-top:8px">${readingInfo()}</div>
      </section>

      <section>
        <h2>4. ${nk('habit')}</h2>
        <div class="row">
          <div><label for="hu">${nk('urea')} (${tx('bags')})</label><input id="hu" type="number" inputmode="decimal" min="0" step="0.5" value="${S.habitUrea}"></div>
          <div><label for="hd">${nk('dap')} (${tx('bags')})</label><input id="hd" type="number" inputmode="decimal" min="0" step="0.5" value="${S.habitDap}"></div>
        </div>
        <label for="sow">${tx('sowdate')}</label>
        <input id="sow" type="date" value="${S.sowing}">
      </section>

      <button type="button" class="primary" id="btnPlan" data-act="plan">${nk('plan')}</button>
      <div id="result">${S.plan ? result() : ''}</div>
      ${plots()}
      <p class="mut">${nk('disclaimer')}</p>

      <div class="m-back-home-footer">
        <p>${esc(tx('backHomeHint'))}</p>
        <button type="button" class="primary" data-act="goHome">${esc(tx('backHomeLong'))}</button>
      </div>
    </div>
  `;
}

function renderSubstituteResult() {
  const r = S.subResult;
  if (!r || !r.ok) return r && r.reason ? `<div class="warn err">${esc(r.reason)}</div>` : '';
  const l = L();
  const alt = r.alternative;
  const orig = r.original;
  const warnHtml = (r.warnings || []).map((w) => `<div class="warn">${esc(l === 'kn' ? (w.kn || w.en) : (w.en || w.kn))}</div>`).join('');
  const notesHtml = (r.agronomicNotes || []).map((n) => `<div class="step">${esc(l === 'kn' ? (n.kn || n.en) : (n.en || n.kn))}</div>`).join('');
  return `
    <div class="step" style="margin-top:12px">
      <h3>${esc(tx('subResultLbl'))} ${esc(alt.quantityKg)} kg ${esc(alt.product)}</h3>
      <p style="margin:4px 0">${esc(orig.quantityKg)} kg ${esc(orig.product)} (${orig.nutrientDeliveredKg} kg ${orig.targetNutrient}) → <strong>${alt.quantityKg} kg</strong> (${alt.deliveredNutrientsKg.N} kg N${alt.deliveredNutrientsKg.S > 0 ? `, ${alt.deliveredNutrientsKg.S} kg S` : ''})</p>
    </div>
    ${warnHtml}
    ${notesHtml}
  `;
}

function renderAssistantView() {
  const l = L();
  const chips = X[l]?.chips || X.en.chips;
  const msgs = S.chatMsgs.length
    ? S.chatMsgs
    : [{ sender: 'agent', text: tx('welcomeChat'), card: null }];

  const msgHtml = msgs.map((m) => {
    let cardHtml = '';
    if (m.card && m.card.items && m.card.items.length) {
      cardHtml = `<div class="step" style="margin:8px 0 0;background:var(--g-light)">
        <strong>${esc(m.card.title)}</strong>
        ${m.card.items.map((it) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px dashed var(--g-border)"><span>${esc(it.label)}</span><strong>${esc(it.value)}</strong></div>`).join('')}
      </div>`;
    }
    return `<div class="chat-msg ${m.sender}">${esc(m.text)}${cardHtml}</div>`;
  }).join('');

  return `
    <div id="assistant-view" class="${S.activeView === 'assistant' ? '' : 'm-hidden'}">
      <div class="m-page-intro">
        <div class="m-page-intro-ico" aria-hidden="true">🎙️</div>
        <div>
          <h2>${esc(tx('assistantIntroTitle'))}</h2>
          <p>${esc(tx('assistantIntroDesc'))}</p>
        </div>
      </div>

      <section>
        <h2>⚗️ ${esc(tx('subTitle'))}</h2>
        <div class="row">
          <div>
            <label for="subOrig">${esc(tx('subOrig'))}</label>
            <select id="subOrig">
              <option value="urea" ${S.subForm.orig === 'urea' ? 'selected' : ''}>${esc(SUB_SPECS.urea[l])}</option>
              <option value="dap" ${S.subForm.orig === 'dap' ? 'selected' : ''}>${esc(SUB_SPECS.dap[l])}</option>
            </select>
          </div>
          <div>
            <label for="subQty">${esc(tx('subQty'))}</label>
            <input id="subQty" type="number" min="1" step="1" value="${S.subForm.qty}">
          </div>
        </div>
        <div class="row">
          <div>
            <label for="subAlt">${esc(tx('subAlt'))}</label>
            <select id="subAlt">
              <option value="ammonium_sulphate" ${S.subForm.alt === 'ammonium_sulphate' ? 'selected' : ''}>${esc(SUB_SPECS.ammonium_sulphate[l])}</option>
              <option value="can" ${S.subForm.alt === 'can' ? 'selected' : ''}>${esc(SUB_SPECS.can[l])}</option>
              <option value="complex_20_20_0_13" ${S.subForm.alt === 'complex_20_20_0_13' ? 'selected' : ''}>${esc(SUB_SPECS.complex_20_20_0_13[l])}</option>
              <option value="vermicompost" ${S.subForm.alt === 'vermicompost' ? 'selected' : ''}>${esc(SUB_SPECS.vermicompost[l])}</option>
              <option value="fym" ${S.subForm.alt === 'fym' ? 'selected' : ''}>${esc(SUB_SPECS.fym[l])}</option>
            </select>
          </div>
          <div>
            <label for="subStage">${esc(tx('subStage'))}</label>
            <select id="subStage">
              <option value="topdress" ${S.subForm.stage === 'topdress' ? 'selected' : ''}>${esc(tx('stageTop'))}</option>
              <option value="basal" ${S.subForm.stage === 'basal' ? 'selected' : ''}>${esc(tx('stageBasal'))}</option>
            </select>
          </div>
        </div>
        <button type="button" class="primary" data-act="calcSub" style="margin-top:12px">${esc(tx('subBtn'))}</button>
        <div id="subResultHost">${renderSubstituteResult()}</div>
      </section>

      <section>
        <h2>💬 ${esc(tx('chatTitle'))}</h2>
        <div class="row">
          <div>
            <label for="aiVoice">${esc(tx('voiceLbl'))}</label>
            <select id="aiVoice">
              <option value="friendly" ${S.chatVoice === 'friendly' ? 'selected' : ''}>${esc(tx('vFriendly'))}</option>
              <option value="clear" ${S.chatVoice === 'clear' ? 'selected' : ''}>${esc(tx('vClear'))}</option>
              <option value="calm" ${S.chatVoice === 'calm' ? 'selected' : ''}>${esc(tx('vCalm'))}</option>
            </select>
          </div>
          <div>
            <label for="aiMode">${esc(tx('modeLbl'))}</label>
            <select id="aiMode">
              <option value="conventional" ${S.chatMode === 'conventional' ? 'selected' : ''}>${esc(tx('modeConv'))}</option>
              <option value="organic" ${S.chatMode === 'organic' ? 'selected' : ''}>${esc(tx('modeOrg'))}</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end">
            <button type="button" class="sec" data-act="stopVoice" style="width:100%">${esc(tx('stopSpeak'))}</button>
          </div>
        </div>

        <div class="chat-history" id="aiChatBox">${msgHtml}</div>

        <div class="chip-strip">
          ${chips.map(([lbl, q]) => `<button type="button" class="chip-btn" data-ai-chip="${esc(q)}">${esc(lbl)}</button>`).join('')}
        </div>

        <div class="row" style="margin-top:10px">
          <button type="button" class="sec" data-act="aiMic" style="flex:0 0 auto;min-width:64px" aria-label="Voice input">🎤</button>
          <input id="aiInput" type="text" placeholder="${esc(tx('chatPh'))}" style="flex:1 1 200px">
          <button type="button" class="primary" data-act="aiSend" style="flex:0 0 auto;width:auto;min-height:50px;padding:0 20px">${esc(tx('sendBtn'))}</button>
        </div>
      </section>

      <div class="m-back-home-footer">
        <p>${esc(tx('backHomeHint'))}</p>
        <button type="button" class="primary" data-act="goHome">${esc(tx('backHomeLong'))}</button>
      </div>
    </div>
  `;
}

function view() {
  const l = L(), nk = (k) => t(l, k);
  $('#app').innerHTML = renderHomeDashboard() + renderPlannerView() + renderAssistantView();

  $('#tag').textContent = nk('tagline');
  $('#langBtn').textContent = l === 'kn' ? 'English' : 'ಕನ್ನಡ';
  $('#net').textContent = S.online ? tx('online') : '○ ' + nk('offline');
  $('#hdrHomeTxt').textContent = tx('backHome');
  $('#hdrHomeBtn').classList.toggle('m-hidden', S.activeView === 'home');
  document.documentElement.lang = l;

  const box = $('#aiChatBox');
  if (box) box.scrollTop = box.scrollHeight;
}

function openView(nextView, push = true) {
  S.activeView = nextView === 'planner' || nextView === 'assistant' ? nextView : 'home';
  if (push && window.history && typeof window.history.pushState === 'function') {
    try {
      const targetUrl = S.activeView === 'home' ? 'index.html' : `index.html?view=${S.activeView}`;
      window.history.pushState({ view: S.activeView }, '', targetUrl);
    } catch { /* ignore */ }
  }
  view();
  try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* jsdom */ }
}

function readingInfo() {
  const r = S.reading;
  if (!r) return '';
  return r.qcOk ? tx('readings', { n: r.n, v: r.no3nMgKg }) : `<span class="bad">${tx('qcBad')}</span>`;
}

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
  <div class="row"><button type="button" data-act="read">🔊 ${nk('read')}</button><button type="button" data-act="share">💬 ${nk('share')}</button><button type="button" data-act="savePlot">💾 ${nk('save')}</button></div></section>`;
}

function plots() {
  if (!S.plots.length) return '';
  return `<section><h2>${tx('mine')}</h2>${S.plots.map((p, i) => `<div class="warn"><b>${esc(t(L(), p.crop))}</b> · ${p.acres} ${t(L(), 'acre')} · ${esc(p.date)} · ₹${p.cost}${p.yield ? ` · ${p.yield} kg` : `<div class="row" style="margin-top:6px"><input data-y="${i}" type="number" placeholder="${tx('yield')}" aria-label="${tx('yield')}"><button type="button" data-act="addYield" data-i="${i}">${tx('add')}</button></div>`}</div>`).join('')}<button type="button" data-act="export">${tx('export')}</button></section>`;
}

async function api(path, body, ms = 8000) {
  const r = await fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(ms) } : { signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error('http_' + r.status);
  return r.json();
}

function collect() {
  const num = (id) => { const el = $('#' + id); const v = el ? el.value : ''; return v === '' ? null : Number(v); };
  for (const k of ['N', 'P', 'K']) {
    const clsEl = $('#cls' + k);
    S.soil[k] = { cls: (clsEl && clsEl.value) || undefined, value: num('val' + k) ?? undefined };
    if (S.soil[k].value != null) S.soil[k].cls = undefined;
  }
  S.acres = num('acres') || 1;
  if ($('#ph')) S.ph = $('#ph').value;
  if ($('#hu')) S.habitUrea = $('#hu').value;
  if ($('#hd')) S.habitDap = $('#hd').value;
  if ($('#sow')) S.sowing = $('#sow').value;
}

async function plan() {
  collect();
  const habit = (S.habitUrea !== '' || S.habitDap !== '') ? { ureaKgAcre: Number(S.habitUrea || 0) * norms.fertilisers.urea.bagKg, dapKgAcre: Number(S.habitDap || 0) * norms.fertilisers.dap.bagKg } : null;
  const input = { crop: S.crop, system: S.system, acres: S.acres, soil: { ...S.soil, pH: S.ph === '' ? undefined : Number(S.ph) }, sensor: S.reading, habit, sowingDate: S.sowing || null };
  let p = computePlan(input);
  S.text = explain(p, S.lang);
  if (p.ok && S.online) {
    try {
      const pos = await new Promise((res) => navigator.geolocation ? navigator.geolocation.getCurrentPosition((g) => res(g.coords), () => res(null), { timeout: 4000 }) : res(null));
      const r = await api('/api/plan', { ...input, lang: S.lang, lat: pos?.latitude, lon: pos?.longitude });
      if (r.plan && r.plan.ok) { p = r.plan; S.text = r.text; }
    } catch { /* stay offline-first */ }
  }
  S.plan = p;
  save();
  $('#result').innerHTML = result();
  $('#result').scrollIntoView?.({ behavior: 'smooth' });
}

function calcSubOffline({ originalProduct, originalQtyKg, alternativeProduct, cropStage }) {
  const orig = SUB_SPECS[originalProduct];
  const alt = SUB_SPECS[alternativeProduct];
  if (!orig || !alt) return { ok: false, reason: 'Invalid product selection' };
  const targetN = orig.N || 0;
  const nMass = originalQtyKg * targetN;
  const effN = alt.organic ? alt.N * (alt.availabilityFractionN || 0.4) : alt.N;
  if (effN <= 0) return { ok: false, reason: 'Selected alternative does not supply Nitrogen' };
  const eqKg = Math.round((nMass / effN) * 10) / 10;
  const warnings = [];
  if (cropStage === 'topdress' && alt.organic) {
    warnings.push({
      en: `${alt.en} releases nitrogen slowly over weeks and cannot rescue a standing crop immediately.`,
      kn: `${alt.kn} ಸಾರಜನಕವನ್ನು ನಿಧಾನವಾಗಿ ಬಿಡುಗಡೆ ಮಾಡುತ್ತದೆ. ನಿಂತ ಬೆಳೆಗೆ ತಕ್ಷಣ ಪರಿಣಾಮ ಬೀರಲಾರದು.`
    });
  }
  return {
    ok: true,
    original: { product: orig[L()], quantityKg: originalQtyKg, nutrientDeliveredKg: Math.round(nMass * 10) / 10, targetNutrient: 'N' },
    alternative: {
      product: alt[L()],
      quantityKg: eqKg,
      deliveredNutrientsKg: {
        N: Math.round(eqKg * effN * 10) / 10,
        S: Math.round(eqKg * (alt.S || 0) * 10) / 10
      }
    },
    warnings,
    agronomicNotes: []
  };
}

async function handleCalcSub() {
  const orig = $('#subOrig')?.value || 'urea';
  const qty = Math.max(1, Number($('#subQty')?.value) || 50);
  const alt = $('#subAlt')?.value || 'ammonium_sulphate';
  const stage = $('#subStage')?.value || 'topdress';
  S.subForm = { orig, qty, alt, stage };

  let resData;
  try {
    resData = await api('/api/agent/alternatives', {
      originalProduct: orig,
      targetNutrient: 'N',
      originalQtyKg: qty,
      alternativeProduct: alt,
      cropStage: stage
    });
  } catch {
    resData = calcSubOffline({ originalProduct: orig, originalQtyKg: qty, alternativeProduct: alt, cropStage: stage });
  }
  S.subResult = resData;
  const host = $('#subResultHost');
  if (host) host.innerHTML = renderSubstituteResult();
}

function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN';
  u.rate = S.chatVoice === 'calm' ? 0.88 : S.chatVoice === 'clear' ? 1.02 : 0.95;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(S.lang));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function buildLocalAiReply(rawMsg, lang) {
  const msg = String(rawMsg || '').toLowerCase();
  if (msg.includes('ಯೂರಿಯಾ ಇಲ್ಲ') || msg.includes('ಪರ್ಯಾಯ') || msg.includes('ಬದಲಿ') || msg.includes('no urea') || msg.includes('alternative') || msg.includes('substitute') || msg.includes('instead')) {
    const sub = calcSubOffline({ originalProduct: 'urea', originalQtyKg: 50, alternativeProduct: (msg.includes('vermi') || msg.includes('ಎರೆಹುಳು') || msg.includes('organic') || msg.includes('ಸಾವಯವ')) ? 'vermicompost' : 'ammonium_sulphate', cropStage: 'topdress' });
    return {
      reply: lang === 'kn'
        ? `50 ಕಿಲೋ ಯೂರಿಯಾ ಬದಲಿಗೆ ${sub.alternative.quantityKg} ಕಿಲೋ ${sub.alternative.product} ಬಳಸಬಹುದು (ಮೇಲಿನ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ನಲ್ಲಿ ಇತರೆ ಆಯ್ಕೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ).`
        : `Instead of 50 kg Urea (23 kg N), you can substitute ${sub.alternative.quantityKg} kg of ${sub.alternative.product} (use the calculator above for more options).`,
      card: {
        title: lang === 'kn' ? 'ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಲೆಕ್ಕಾಚಾರ' : 'Fertiliser Substitute',
        items: [
          { label: lang === 'kn' ? 'ಪರ್ಯಾಯ' : 'Alternative', value: sub.alternative.product },
          { label: lang === 'kn' ? 'ಪ್ರಮಾಣ' : 'Equivalent Qty', value: `${sub.alternative.quantityKg} kg` }
        ]
      }
    };
  }
  if (msg.includes('ಸಾವಯವ') || msg.includes('organic') || msg.includes('compost')) {
    return {
      reply: lang === 'kn'
        ? 'ಸಾವಯವ ಕೃಷಿಗೆ ಬಿತ್ತನೆಗೆ 2–3 ವಾರಗಳ ಮೊದಲು ಎಕರೆಗೆ 4–5 ಟನ್ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಅಥವಾ 1.5 ಟನ್ ಎರೆಹುಳು ಗೊಬ್ಬರ ಹಾಗೂ ಬೀಜೋಪಚಾರ ಬಳಸಿ.'
        : 'For organic farming, incorporate 4–5 tonnes/acre FYM or 1.5 tonnes/acre Vermicompost 2–3 weeks before sowing with Azotobacter + PSB.',
      card: null
    };
  }
  if (msg.includes('ರಾಗಿ') || msg.includes('ragi') || msg.includes('ಗೊಬ್ಬರ') || msg.includes('dose') || msg.includes('ಮಳೆ') || msg.includes('rain')) {
    const p = computePlan({ crop: S.crop, system: S.system, acres: S.acres || 1, soil: S.soil });
    if (p.ok) {
      return {
        reply: explain(p, lang) + (msg.includes('ಮಳೆ') || msg.includes('rain') ? (lang === 'kn' ? ' ಭಾರಿ ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದ್ದಾಗ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವನ್ನು ಮುಂದೂಡಿ.' : ' Delay urea top-dressing before heavy rain.') : ''),
        card: null
      };
    }
  }
  return {
    reply: lang === 'kn'
      ? 'ನಮಸ್ಕಾರ! ಯೂರಿಯಾ ಪರ್ಯಾಯ, ಸಾವಯವ ಕೃಷಿ, ಮಳೆ ಸಮಯದ ಗೊಬ್ಬರ ಅಥವಾ ನಿಮ್ಮ ಬೆಳೆ ಡೋಸ್ ಬಗ್ಗೆ ಕೇಳಿ — ಮೇಲಿನ ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಸಹ ಲಭ್ಯವಿದೆ.'
      : 'Hello! Ask me about Urea substitutes, organic farming, rain top-dressing rules, or your crop dose — and try the Fertiliser Substitute Calculator above.',
    card: null
  };
}

async function handleAiSend(customMsg) {
  const inp = $('#aiInput');
  const msg = (customMsg ?? inp?.value ?? '').trim();
  if (!msg) return;
  if (inp) inp.value = '';

  S.chatMsgs.push({ sender: 'user', text: msg, card: null });
  view();

  const query = S.chatMode === 'organic' && !msg.toLowerCase().includes('organic') && !msg.includes('ಸಾವಯವ')
    ? `${msg} (organic mode preference)` : msg;

  try {
    const data = await api('/api/agent/chat', {
      message: query,
      language: S.lang,
      farmerId: 'local-farmer',
      currentContext: { page: 'index.html', crop: S.crop, system: S.system }
    });
    if (!data || !data.reply) throw new Error('empty_reply');
    S.chatMsgs.push({ sender: 'agent', text: data.reply, card: data.card || null });
    speakText(data.reply);
  } catch {
    const localRes = buildLocalAiReply(query, S.lang);
    S.chatMsgs.push({ sender: 'agent', text: localRes.reply, card: localRes.card });
    speakText(localRes.reply);
  }
  view();
}

function toast(msg) {
  const h = $('#heard');
  if (h) h.textContent = msg;
}
function parseCsv(text) {
  const [h, ...rest] = text.trim().split(/\r?\n/);
  const cols = h.split(',').map((c) => c.trim());
  return rest.filter(Boolean).map((line) => Object.fromEntries(line.split(',').map((v, i) => [cols[i], v.trim() === '' ? undefined : Number.isNaN(Number(v)) ? v.trim() : Number(v)])));
}
const SAMPLE = [31, 29, 33, 30, 28, 32, 34, 27, 30, 31, 29, 35].map((v, i) => ({ no3_n_mgkg: v, ph: 6.1 + (i % 3) * 0.1, moisture_pct: 28, ts: 'demo' }));
function setReadings(rows) {
  S.readingRows = rows;
  S.reading = summariseReadings(rows);
  save();
  const el = $('#readingInfo');
  if (el) el.innerHTML = readingInfo();
}

document.addEventListener('click', async (e) => {
  const openBtn = e.target.closest('[data-open-view]');
  if (openBtn) {
    openView(openBtn.dataset.openView);
    return;
  }
  const chipBtn = e.target.closest('[data-ai-chip]');
  if (chipBtn) {
    handleAiSend(chipBtn.dataset.aiChip);
    return;
  }

  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.crop) {
    collect();
    S.crop = b.dataset.crop;
    if (S.crop === 'maize') S.system = 'irrigated';
    S.plan = null;
    save();
    view();
  } else if (b.dataset.system) {
    collect();
    S.system = b.dataset.system;
    S.plan = null;
    save();
    view();
  } else if (b.dataset.act === 'lang') {
    collect();
    S.lang = S.lang === 'kn' ? 'en' : 'kn';
    if (S.plan) S.text = explain(S.plan, S.lang);
    save();
    view();
    window.dispatchEvent(new CustomEvent('mannu:langchange', { detail: { lang: S.lang } }));
  } else if (b.dataset.act === 'goHome') {
    openView('home');
  } else if (b.dataset.act === 'plan') {
    plan();
  } else if (b.dataset.act === 'sample') {
    setReadings(SAMPLE);
  } else if (b.dataset.act === 'read') {
    const u = new SpeechSynthesisUtterance(S.text);
    u.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN';
    const v = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(S.lang));
    if (!v && S.lang === 'kn') toast(tx('noVoice'));
    else {
      if (v) u.voice = v;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  } else if (b.dataset.act === 'share') {
    window.open('https://wa.me/?text=' + encodeURIComponent('Mannu\n' + S.text), '_blank');
  } else if (b.dataset.act === 'savePlot' && S.plan?.ok) {
    S.plots.unshift({ crop: S.plan.crop, acres: S.plan.acres, cost: S.plan.cost.perAcre, date: new Date().toISOString().slice(0, 10) });
    save();
    toast(tx('saved'));
    view();
    if (S.plan && $('#result')) $('#result').innerHTML = result();
  } else if (b.dataset.act === 'addYield') {
    const v = Number(document.querySelector(`[data-y="${b.dataset.i}"]`)?.value);
    if (v > 0) {
      S.plots[b.dataset.i].yield = v;
      save();
      view();
      if (S.online) api('/api/outcome', { plotId: 'plot' + b.dataset.i, crop: S.plots[b.dataset.i].crop, yieldKgAcre: v, followedPlan: true }).catch(() => { });
    }
  } else if (b.dataset.act === 'export') {
    const csv = 'crop,acres,date,cost_per_acre,yield_kg_acre\n' + S.plots.map((p) => [p.crop, p.acres, p.date, p.cost, p.yield ?? ''].join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'mannu-plots.csv';
    a.click();
  } else if (b.dataset.act === 'speak') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return toast(tx('manual'));
    const rec = new SR();
    rec.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN';
    rec.onresult = async (ev) => {
      const tr = ev.results[0][0].transcript;
      toast(tx('heard') + ': ' + tr);
      let it = keywordIntent(tr);
      if (S.online) { try { it = { ...it, ...(await api('/api/intent', { transcript: tr })) }; } catch { /* keywords */ } }
      if (it.crop) S.crop = it.crop;
      if (it.system) S.system = it.system;
      if (it.acres) S.acres = it.acres;
      S.plan = null;
      save();
      view();
      toast(tx('heard') + ': ' + tr);
    };
    rec.start();
  } else if (b.dataset.act === 'calcSub') {
    handleCalcSub();
  } else if (b.dataset.act === 'aiSend') {
    handleAiSend();
  } else if (b.dataset.act === 'stopVoice') {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } else if (b.dataset.act === 'aiMic') {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = S.lang === 'kn' ? 'kn-IN' : 'en-IN';
    rec.onresult = (ev) => handleAiSend(ev.results[0][0].transcript);
    rec.start();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target && e.target.id === 'aiInput') {
    handleAiSend();
  }
});

document.addEventListener('change', async (e) => {
  if (e.target.id === 'aiVoice') {
    S.chatVoice = e.target.value;
    try { localStorage.setItem('mannu.voice', S.chatVoice); } catch { /* ignore */ }
    api('/api/agent/memory/local-farmer', { language: S.lang, voice: S.chatVoice, farmingStyle: S.chatMode }).catch(() => { });
    return;
  }
  if (e.target.id === 'aiMode') {
    S.chatMode = e.target.value;
    try { localStorage.setItem('mannu.farming_mode', S.chatMode); } catch { /* ignore */ }
    api('/api/agent/memory/local-farmer', { language: S.lang, voice: S.chatVoice, farmingStyle: S.chatMode }).catch(() => { });
    return;
  }

  const f = e.target.files && e.target.files[0];
  if (!f) return;
  if (e.target.id === 'fileData') {
    try {
      const txt = await f.text();
      setReadings(f.name.endsWith('.json') ? [].concat(JSON.parse(txt)) : parseCsv(txt));
    } catch { toast(tx('qcBad')); }
  }
  if (e.target.id === 'fileCard') {
    try {
      const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });
      const j = await api('/api/card/parse', { imageBase64: data, mimeType: f.type || 'image/jpeg' }, 90000);
      for (const k of ['N', 'P', 'K']) if (j.values?.[k] != null) S.soil[k] = { value: j.values[k] };
      if (j.values?.pH != null) S.ph = j.values.pH;
      save();
      view();
      toast(tx('parsed'));
    } catch { toast(tx('manual')); }
  }
});

window.addEventListener('popstate', () => {
  S.activeView = readInitialView();
  view();
});

window.addEventListener('mannu:langchange', (e) => {
  const next = e.detail?.lang;
  if ((next === 'en' || next === 'kn') && next !== S.lang) {
    collect();
    S.lang = next;
    if (S.plan) S.text = explain(S.plan, S.lang);
    save();
    view();
  }
});

(async () => {
  try { await api('./api/health', null, 1500); S.online = true; } catch { S.online = false; }
  view();
})();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !location.hostname.endsWith('claude.ai')) {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
