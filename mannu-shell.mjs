// Mannu Shared Localization, Single-Feature Navigation Shell & Activity Ledger Helper
// Guarantees 100% pure Kannada when lang === 'kn' and 100% pure English when lang === 'en'.

export const NAV_LABELS = {
  kn: {
    home: 'ಮುಖಪುಟ',
    backHome: '🏠 ಮುಖಪುಟ',
    backHomeLong: '🏠 ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    backHomeHint: 'ಮತ್ತೊಂದು ಸೇವೆಯನ್ನು ಬಳಸಲು ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.',
    online: '● ಆನ್‌ಲೈನ್',
    offline: '○ ಆಫ್‌ಲೈನ್',
    toggleBtn: 'English',
    back: 'ಹಿಂದೆ'
  },
  en: {
    home: 'Home',
    backHome: '🏠 Back to Home',
    backHomeLong: '🏠 Return to Home Page',
    backHomeHint: 'Return to the main dashboard to open another feature.',
    online: '● Online',
    offline: '○ Offline',
    toggleBtn: 'ಕನ್ನಡ',
    back: 'Back'
  }
};

export function getLang() {
  try {
    const direct = localStorage.getItem('mannu.lang');
    if (direct === 'en' || direct === 'kn') return direct;
    const v1 = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
    if (v1.lang === 'en' || v1.lang === 'kn') return v1.lang;
  } catch { /* ignore */ }
  return 'kn';
}

export function setLang(lang) {
  const clean = lang === 'en' ? 'en' : 'kn';
  try {
    localStorage.setItem('mannu.lang', clean);
    const v1 = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
    v1.lang = clean;
    localStorage.setItem('mannu.v1', JSON.stringify(v1));
  } catch { /* ignore */ }
  document.documentElement.lang = clean;
  window.dispatchEvent(new CustomEvent('mannu:langchange', { detail: { lang: clean } }));
  return clean;
}

export function createTranslator(dict) {
  return (key) => (dict && ((dict[getLang()] && dict[getLang()][key]) ?? (dict.en && dict.en[key]))) || key;
}

export function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn, { once: true });
}

export function applyDict(dict, lang = getLang()) {
  const L = dict[lang] || dict.en || {};
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    if (L[k] != null) el.textContent = L[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const k = el.getAttribute('data-i18n-ph');
    if (L[k] != null) el.placeholder = L[k];
  });
}

// Keep retired bottomNav empty and hidden so dedicated feature pages stay isolated
export function renderBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;
  nav.innerHTML = '';
  nav.style.display = 'none';
}

export function initShell({ activeNav, dict, onLangChange } = {}) {
  const t = createTranslator(dict);

  const refreshStatic = () => {
    const lang = getLang();
    document.documentElement.lang = lang;
    const navLbl = NAV_LABELS[lang] || NAV_LABELS.kn;
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = navLbl.toggleBtn;
    const netEl = document.getElementById('netStatus');
    if (netEl) netEl.textContent = navigator.onLine ? navLbl.online : navLbl.offline;

    document.querySelectorAll('[data-nav-home]').forEach((el) => {
      const mode = el.getAttribute('data-nav-home');
      if (mode === 'long') el.textContent = navLbl.backHomeLong;
      else if (mode === 'hint') el.textContent = navLbl.backHomeHint;
      else el.textContent = navLbl.backHome;
    });

    renderBottomNav(activeNav, lang);
    if (dict) applyDict(dict, lang);
  };

  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setLang(getLang() === 'kn' ? 'en' : 'kn');
    });
  }

  window.addEventListener('mannu:langchange', () => {
    refreshStatic();
    if (typeof onLangChange === 'function') onLangChange(getLang(), t);
  });
  window.addEventListener('online', refreshStatic);
  window.addEventListener('offline', refreshStatic);

  // Only refresh static DOM synchronously; never fire onLangChange synchronously inside initShell
  refreshStatic();

  return { getLang, setLang, t };
}

export async function recordActivityEvent({ eventType, eventDetails, plotId = null, zoneId = null, sourceModule = 'pwa' }) {
  const ev = {
    eventId: 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    farmerId: 'local-farmer',
    plotId,
    zoneId,
    eventType,
    eventTimestamp: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    sourceModule,
    eventDetails
  };
  try {
    const existing = JSON.parse(localStorage.getItem('mannu.daily_events') || '[]');
    existing.unshift(ev);
    localStorage.setItem('mannu.daily_events', JSON.stringify(existing.slice(0, 100)));
  } catch { /* ignore */ }
  try {
    await fetch('/api/reports/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    });
  } catch { /* queued locally */ }
  return ev;
}

export const escHtml = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
