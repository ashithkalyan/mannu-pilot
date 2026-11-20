import { initShell, getLang, createTranslator, onReady, recordActivityEvent, escHtml } from './mannu-shell.mjs';

const DICT = {
  kn: {
    headerSub: 'ಕೃಷಿ ಸಮುದಾಯ ಮತ್ತು ಮಾರುಕಟ್ಟೆ',
    tabFeed: 'ಸಮುದಾಯ',
    tabMarket: 'ಮಾರುಕಟ್ಟೆ',
    tabPrices: 'ಬೆಲೆ ವಿವರ',
    tabNews: 'ಅಧಿಕೃತ ಸುದ್ದಿ',
    newPostTitle: 'ಸಮುದಾಯದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
    lblCat: 'ವಿಭಾಗ',
    catSell: '🌾 ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯ',
    catBuy: '🛒 ಖರೀದಿ ಬೇಡಿಕೆ',
    catInput: '🌱 ಬೀಜ / ಗೊಬ್ಬರ',
    catDisc: '💬 ರೈತರ ಚರ್ಚೆ',
    catOpp: '🤝 FPO ಅವಕಾಶಗಳು',
    lblLoc: 'ಸ್ಥಳ',
    phLoc: 'ಉದಾ: ತುಮಕೂರು',
    lblMsg: 'ಸಂದೇಶ',
    phPost: 'ನಿಮ್ಮ ಕೃಷಿ ಮಾಹಿತಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ...',
    btnPublish: '🚀 ಪ್ರಕಟಿಸಿ',
    fAll: 'ಎಲ್ಲಾ',
    apmcNotice: '⚖️ ಕರ್ನಾಟಕ APMC ಕಾಯ್ದೆ (2025 ತಿದ್ದುಪಡಿ) ಅನುಸಾರ: ನೇರ ಹಣಕಾಸು ವಹಿವಾಟು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ (regulatedTradeEnabled = false). ಇದು ರೈತರು ಮತ್ತು ಪರವಾನಗಿ ಪಡೆದ ಖರೀದಿದಾರರ ಸಂಪರ್ಕ ವೇದಿಕೆ ಮಾತ್ರ.',
    mktAddTitle: 'ಉತ್ಪನ್ನ ಮಾರಾಟ ಅಥವಾ ಖರೀದಿ ಬೇಡಿಕೆ ಪಟ್ಟಿ',
    lblMktMode: 'ಪಟ್ಟಿ ಪ್ರಕಾರ',
    modeSell: '🌾 ನಾನು ಬೆಳೆ ಮಾರುತ್ತಿದ್ದೇನೆ (Supply)',
    modeBuy: '🛒 ನಾನು ಬೆಳೆ ಖರೀದಿಸುತ್ತೇನೆ (Demand)',
    lblComm: 'ಬೆಳೆ / ತಳಿ',
    phComm: 'ಉದಾ: ಮೆಕ್ಕೆಜೋಳ',
    lblQty: 'ಪ್ರಮಾಣ',
    lblUnit: 'ಘಟಕ',
    uTon: 'ಟನ್ (Tonnes)',
    uQtl: 'ಕ್ವಿಂಟಾಲ್ (Quintals)',
    uKg: 'ಕಿಲೋ (kg)',
    lblAskPrice: 'ನಿರೀಕ್ಷಿತ ದರ (₹/ಘಟಕ)',
    btnPublishList: 'ಪಟ್ಟಿ ಪ್ರಕಟಿಸಿ',
    lblSupplyMatch: 'ಲಭ್ಯ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಖರೀದಿದಾರರ ಹೊಂದಾಣಿಕೆ',
    lblInputCompare: 'ಪರವಾನಗಿ ಪಡೆದ ಬೀಜ & ಗೊಬ್ಬರ ಮಾರಾಟಗಾರರ ಹೋಲಿಕೆ',
    txtNonSponsored: 'ಸೂಚನೆ: ಬೆಲೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಆಧಾರಿತ ಶ್ರೇಯಾಂಕ — ಯಾವುದೇ ಪಾವತಿಸಿದ ಜಾಹೀರಾತಿಲ್ಲ.',
    prTitle: 'ಮಂಡಿ ಬೆಲೆ ಬುದ್ಧಿವಂತಿಕೆ (AGMARKNET / OGD)',
    lblSelCrop: 'ಬೆಳೆ',
    cRagi: 'ರಾಗಿ', cMaize: 'ಮೆಕ್ಕೆಜೋಳ', cJowar: 'ಜೋಳ', cPaddy: 'ಭತ್ತ', cTomato: 'ಟೊಮೇಟೊ',
    lblMandi: 'ಮಂಡಿ / ಜಿಲ್ಲೆ',
    lblMinPr: 'ಕನಿಷ್ಠ (₹/qtl)',
    lblModalPr: 'ಮಾದರಿ ದರ (₹/qtl)',
    lblMaxPr: 'ಗರಿಷ್ಠ (₹/qtl)',
    newsTitle: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು MSP',
    newsDistinction: 'ಇವು ಅಧಿಕೃತ ಸರ್ಕಾರಿ / IMD ಮೂಲಗಳಿಂದ ಪಡೆದ ಮಾಹಿತಿಗಳಾಗಿವೆ (ಸಮುದಾಯ ಚರ್ಚೆಗಿಂತ ಪ್ರತ್ಯೇಕ).',
    findMatch: '🔍 ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ',
    sendEnquiry: '📩 ವಿಚಾರಣೆ ಕಳುಹಿಸಿ',
    enquirySent: '✓ ವಿಚಾರಣೆ ದಾಖಲಾಗಿದೆ (ಪರಸ್ಪರ ಒಪ್ಪಿಗೆ ಬಾಕಿ)',
    replyPlaceholder: 'ಪ್ರತಿಕ್ರಿಯೆ ಬರೆಯಿರಿ...',
    replyBtn: 'ಉತ್ತರಿಸಿ',
    matchSummary: 'ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿದೆ: {m} {u} ಪೂರೈಸಬಹುದು (ಬಾಕಿ {rem} {u} ಲಭ್ಯ).',
    noMatch: 'ಪ್ರಸ್ತುತ ಸಮೀಪದ ಖರೀದಿದಾರರ ಬೇಡಿಕೆ ಪಟ್ಟಿಯಿಲ್ಲ — ಹೊಸ ಬೇಡಿಕೆ ಬಂದಾಗ ತೋರಿಸಲಾಗುತ್ತದೆ.'
  },
  en: {
    headerSub: 'Agricultural Community & Marketplace',
    tabFeed: 'Community',
    tabMarket: 'Marketplace',
    tabPrices: 'Mandi Prices',
    tabNews: 'Verified News',
    newPostTitle: 'Share with Farming Community',
    lblCat: 'Category',
    catSell: '🌾 Selling Produce',
    catBuy: '🛒 Looking to Buy',
    catInput: '🌱 Agri Inputs',
    catDisc: '💬 Farmer Discussion',
    catOpp: '🤝 FPO Opportunities',
    lblLoc: 'Location',
    phLoc: 'e.g. Tumakuru',
    lblMsg: 'Message',
    phPost: 'Write your crop availability, question, or market update…',
    btnPublish: '🚀 Publish Post',
    fAll: 'All',
    apmcNotice: '⚖️ Karnataka APMC Act (2025 Amendment) Compliance: Direct financial settlement is gated off (regulatedTradeEnabled = false). Permitted discovery & enquiry channel only.',
    mktAddTitle: 'Publish Produce Supply or Buyer Requirement',
    lblMktMode: 'Listing Mode',
    modeSell: '🌾 Selling Produce (Supply)',
    modeBuy: '🛒 Looking to Buy (Demand)',
    lblComm: 'Commodity / Variety',
    phComm: 'e.g. Maize',
    lblQty: 'Quantity',
    lblUnit: 'Unit',
    uTon: 'Tonnes',
    uQtl: 'Quintals',
    uKg: 'kg',
    lblAskPrice: 'Expected Price (₹/unit)',
    btnPublishList: 'Publish Listing',
    lblSupplyMatch: 'Active Supply Listings & Demand Matching',
    lblInputCompare: 'Licensed Seed & Fertiliser Input Seller Comparison',
    txtNonSponsored: 'Ranked transparently by unit price and verified composition — zero paid promotion.',
    prTitle: 'Market Price Intelligence (AGMARKNET / OGD)',
    lblSelCrop: 'Commodity',
    cRagi: 'Finger Millet (Ragi)', cMaize: 'Maize', cJowar: 'Sorghum (Jowar)', cPaddy: 'Paddy', cTomato: 'Tomato',
    lblMandi: 'Mandi / District',
    lblMinPr: 'Min (₹/qtl)',
    lblModalPr: 'Modal Benchmark (₹/qtl)',
    lblMaxPr: 'Max (₹/qtl)',
    newsTitle: 'Verified Institutional Announcements & MSP',
    newsDistinction: 'Verified official government / IMD sources — strictly separated from user community posts.',
    findMatch: '🔍 Find Matching Demand',
    sendEnquiry: '📩 Send Enquiry',
    enquirySent: '✓ Enquiry logged (awaiting mutual confirmation)',
    replyPlaceholder: 'Write a comment…',
    replyBtn: 'Reply',
    matchSummary: 'Partial/Full Match Found: {m} {u} matches buyer demand ({rem} {u} remains open).',
    noMatch: 'No open buyer requirement matched yet — listing remains discoverable.'
  }
};

const PRICE_DATA = {
  ragi: { min: 2850, modal: 3420, max: 3800, msp: 4290, hist: [3050, 3180, 3260, 3310, 3380, 3420], fc: [3250, 3550, 3850], mae: 112 },
  maize: { min: 1950, modal: 2240, max: 2450, msp: 2225, hist: [2080, 2120, 2190, 2210, 2260, 2240], fc: [2050, 2280, 2490], mae: 85 },
  jowar: { min: 2600, modal: 3100, max: 3500, msp: 3371, hist: [2750, 2890, 2940, 3020, 3080, 3100], fc: [2900, 3180, 3420], mae: 95 },
  paddy: { min: 2180, modal: 2450, max: 2750, msp: 2300, hist: [2240, 2300, 2360, 2400, 2420, 2450], fc: [2320, 2500, 2700], mae: 78 },
  tomato: { min: 900, modal: 1400, max: 2200, msp: null, hist: [1800, 2400, 1950, 1200, 1350, 1400], fc: [950, 1500, 2350], mae: 340 }
};

const INPUT_SELLERS = [
  { product: 'Urea (Neem Coated 46% N)', brand: 'IFFCO', pack: '45 kg', price: 242, perKg: '₹5.38/kg', seller: 'Tumakuru Taluk Agro Kendra', lic: 'FCO-KA-1102', verified: true },
  { product: 'DAP (18:46:0)', brand: 'Coromandel', pack: '50 kg', price: 1350, perKg: '₹27.00/kg', seller: 'Gubbi Sahakari Sangha FPO', lic: 'FCO-KA-2041', verified: true },
  { product: 'Ragi Certified Seed (ML-365)', brand: 'UAS Bangalore', pack: '10 kg', price: 480, perKg: '₹48.00/kg', seller: 'Raitha Samparka Kendra', lic: 'SEED-KA-0814', verified: true },
  { product: 'Maize Hybrid Seed (NAH-1137)', brand: 'KSSC', pack: '5 kg', price: 820, perKg: '₹164.00/kg', seller: 'Sira Agri Inputs', lic: 'SEED-KA-1290', verified: true }
];

const SEED_POSTS = [
  { postId: 'seed_p1', authorId: 'Sridhar (Gubbi)', postCategory: 'selling', location: 'Tumakuru', contentKn: 'ನಮ್ಮ ಹೊಲದಲ್ಲಿ 5 ಟನ್ ML-365 ರಾಗಿ ಕಟಾವಾಗಿದೆ. ಉತ್ತಮ ಗುಣಮಟ್ಟ.', contentEn: '5 tonnes of ML-365 Ragi harvested and cleaned near Gubbi, Tumakuru. Moisture tested <12%.', createdAt: new Date(Date.now() - 7200000).toISOString(), comments: [] },
  { postId: 'seed_p2', authorId: 'Krishimitra FPO', postCategory: 'buying', location: 'Tumakuru', contentKn: 'ಸಂಸ್ಕರಣೆಗಾಗಿ 4 ಟನ್ ಮೆಕ್ಕೆಜೋಳ ಖರೀದಿಸಲು ಬಯಸುತ್ತೇವೆ.', contentEn: 'Looking to procure 4 tonnes of dry Maize near Tumakuru for FPO feed unit.', createdAt: new Date(Date.now() - 18000000).toISOString(), comments: [] },
  { postId: 'seed_p3', authorId: 'Manjunath', postCategory: 'discussion', location: 'Mandya', contentKn: 'ಮಳೆಯ ನಂತರ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ 2 ದಿನ ತಡವಾಗಿ ಹಾಕಿದರೆ ಬೆಳೆಗೆ ಒಳ್ಳೆಯದು.', contentEn: 'Delayed urea top-dressing by 48 hours due to heavy rain forecast — saved fertilizer from leaching.', createdAt: new Date(Date.now() - 36000000).toISOString(), comments: [] }
];

const SEED_LISTINGS = [
  { listingId: 'lst_1', sellerId: 'Sridhar Gowda', commodity: 'Maize', quantity: 5, unit: 'tonnes', price: 22400, location: 'Gubbi, Tumakuru', verified: true, listingStatus: 'active' },
  { listingId: 'lst_2', sellerId: 'Lakshmi FPO', commodity: 'Ragi (ML-365)', quantity: 30, unit: 'quintal', price: 3450, location: 'Sira, Tumakuru', verified: true, listingStatus: 'active' }
];

const SEED_REQS = [
  { requirementId: 'req_1', buyerId: 'Deccan Feed Mill', commodity: 'Maize', quantity: 4, unit: 'tonnes', deliveryLocation: 'Tumakuru Industrial Area', priceRange: '₹22,000–23,000/t' }
];

let activeFilter = 'all';
const viewMode = (() => {
  try {
    const v = new URLSearchParams(window.location.search).get('view');
    if (['prices', 'market', 'news', 'feed'].includes(v)) return v;
  } catch { /* ignore */ }
  return 'feed';
})();

const VIEW_META = {
  feed: {
    ico: '🤝',
    knTitle: 'ರೈತರ ಸಮುದಾಯ ಚರ್ಚೆ',
    enTitle: 'Farmer Community & Discussion',
    knDesc: 'ಇತರ ರೈತರೊಂದಿಗೆ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ, ಪ್ರಶ್ನೆ ಕೇಳಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ಸಲಹೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
    enDesc: 'Share farming updates, ask questions, and reply to fellow farmers in your region.'
  },
  market: {
    ico: '🛒',
    knTitle: 'ಬೆಳೆ ಮಾರಾಟ ಮತ್ತು ಬೀಜ-ಗೊಬ್ಬರ ಮಾರುಕಟ್ಟೆ',
    enTitle: 'Crop & Input Marketplace',
    knDesc: 'ಬೆಳೆ ಮಾರಾಟ ಅಥವಾ ಖರೀದಿ ಪಟ್ಟಿ ಪ್ರಕಟಿಸಿ, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ ಮತ್ತು ಪರವಾನಗಿ ಪಡೆದ ಮಾರಾಟಗಾರರನ್ನು ಹೋಲಿಸಿ.',
    enDesc: 'Publish produce supply or buyer needs, find matches, and compare licensed seed & fertiliser sellers.'
  },
  prices: {
    ico: '📊',
    knTitle: 'ಮಂಡಿ ಬೆಲೆ ಮತ್ತು ಸುಗ್ಗಿ ದರ',
    enTitle: 'Mandi Prices & Price Forecast',
    knDesc: 'AGMARKNET ಮಂಡಿ ದರಗಳು, ಸರ್ಕಾರಿ MSP ಬೆಲೆ, 6 ತಿಂಗಳ ಇತಿಹಾಸ ಮತ್ತು ಸುಗ್ಗಿ ದರ ಅಂದಾಜು ನೋಡಿ.',
    enDesc: 'Check daily APMC mandi rates, official MSP benchmarks, 6-month trends, and harvest price forecasts.'
  },
  news: {
    ico: '🏛️',
    knTitle: 'ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆ ಮತ್ತು ಹವಾಮಾನ ಸುದ್ದಿ',
    enTitle: 'Official Govt & Weather News',
    knDesc: 'ಅಧಿಕೃತ MSP ಪ್ರಕಟಣೆಗಳು, IMD ಮಳೆ ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಮಾಹಿತಿ ಓದಿ.',
    enDesc: 'Read verified agriculture department MSP schedules, IMD rain alerts, and PMFBY insurance updates.'
  }
};

function applyDedicatedView() {
  const L = getLang();
  const meta = VIEW_META[viewMode] || VIEW_META.feed;
  document.querySelectorAll('.tab-view').forEach((v) => v.classList.add('m-hidden'));
  const target = $('view-' + viewMode);
  if (target) target.classList.remove('m-hidden');

  if ($('comm-intro-ico')) $('comm-intro-ico').textContent = meta.ico;
  if ($('comm-intro-title')) $('comm-intro-title').textContent = L === 'kn' ? meta.knTitle : meta.enTitle;
  if ($('comm-intro-desc')) $('comm-intro-desc').textContent = L === 'kn' ? meta.knDesc : meta.enDesc;
  if ($('comm-hdr-sub')) $('comm-hdr-sub').textContent = L === 'kn' ? meta.knTitle : meta.enTitle;
}

const $ = (id) => document.getElementById(id);
const t = createTranslator(DICT);
initShell({
  activeNav: 'community',
  dict: DICT,
  onLangChange: () => {
    applyDedicatedView();
    renderPosts();
    renderListings();
    renderInputsTable();
    renderPrices();
    renderNews();
  }
});

async function renderPosts() {
  const L = getLang();
  const local = JSON.parse(localStorage.getItem('mannu.posts_v2') || '[]');
  let srv = [];
  try {
    const res = await fetch('/api/community/posts?limit=30');
    if (res.ok) srv = (await res.json()).posts || [];
  } catch { /* offline */ }
  const map = new Map();
  [...SEED_POSTS, ...srv, ...local].forEach((p) => map.set(p.postId, p));
  let all = [...map.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (activeFilter !== 'all') all = all.filter((p) => p.postCategory === activeFilter);

  const host = $('posts-host');
  host.innerHTML = '';
  all.forEach((p) => {
    const body = p.content || (L === 'kn' ? p.contentKn : p.contentEn) || p.contentKn || p.contentEn;
    const card = document.createElement('div');
    card.className = 'post-card';
    const commentsHtml = (p.comments || []).map((c) => `<div class="m-mut" style="padding:3px 0">💬 <b>${escHtml(c.authorId)}:</b> ${escHtml(c.content)}</div>`).join('');
    card.innerHTML = `
      <div class="post-head">
        <strong>👤 ${escHtml(p.authorId)}</strong>
        <span class="m-badge m-badge-ok">${escHtml(p.postCategory)}</span>
      </div>
      <div style="font-size:15px;margin:4px 0 8px">${escHtml(body)}</div>
      <div class="m-mut" style="display:flex;justify-content:space-between">
        <span>📍 ${escHtml(p.location || 'Karnataka')}</span>
        <span>${new Date(p.createdAt).toLocaleDateString()}</span>
      </div>
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid #f3f4f6">
        ${commentsHtml}
        <div style="display:flex;gap:6px;margin-top:6px">
          <input type="text" class="m-input" data-cinput="${escHtml(p.postId)}" placeholder="${escHtml(t('replyPlaceholder'))}" style="min-height:36px;font-size:13px">
          <button class="m-btn" data-cbtn="${escHtml(p.postId)}" style="min-height:36px;font-size:13px;padding:4px 10px">${escHtml(t('replyBtn'))}</button>
        </div>
      </div>
    `;
    host.appendChild(card);
  });

  host.querySelectorAll('[data-cbtn]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const pid = btn.dataset.cbtn;
      const inp = host.querySelector(`[data-cinput="${pid}"]`);
      const txt = inp?.value.trim();
      if (!txt) return;
      const cObj = { authorId: 'local-farmer', content: txt, createdAt: new Date().toISOString() };
      try {
        await fetch(`/api/community/posts/${pid}/comments`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cObj)
        });
      } catch { /* offline */ }
      const pLocal = JSON.parse(localStorage.getItem('mannu.posts_v2') || '[]');
      const target = pLocal.find((x) => x.postId === pid) || SEED_POSTS.find((x) => x.postId === pid);
      if (target) { target.comments = target.comments || []; target.comments.push(cObj); }
      localStorage.setItem('mannu.posts_v2', JSON.stringify(pLocal));
      renderPosts();
    });
  });
}

async function renderListings() {
  const localL = JSON.parse(localStorage.getItem('mannu.listings_v2') || '[]');
  const localR = JSON.parse(localStorage.getItem('mannu.reqs_v2') || '[]');
  let srvL = [], srvR = [];
  try {
    const [r1, r2] = await Promise.all([fetch('/api/community/listings'), fetch('/api/community/requirements')]);
    if (r1.ok) srvL = (await r1.json()).listings || [];
    if (r2.ok) srvR = (await r2.json()).requirements || [];
  } catch { /* offline */ }

  const listings = [...SEED_LISTINGS, ...srvL, ...localL];
  const reqs = [...SEED_REQS, ...srvR, ...localR];
  const host = $('listings-host');
  host.innerHTML = '';

  listings.forEach((l) => {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
      <div class="post-head">
        <strong>🌾 ${escHtml(l.commodity)} — ${escHtml(l.quantity)} ${escHtml(l.unit)}</strong>
        <span class="m-badge m-badge-ok">₹${Number(l.price).toLocaleString()} / ${escHtml(l.unit)}</span>
      </div>
      <div class="m-mut">👤 ${escHtml(l.sellerId)} · 📍 ${escHtml(l.location || 'Tumakuru')}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="m-btn m-btn-sec" data-match="${escHtml(l.listingId)}" style="min-height:38px;font-size:13px;flex:1">${escHtml(t('findMatch'))}</button>
        <button class="m-btn" data-enq="${escHtml(l.listingId)}" style="min-height:38px;font-size:13px;flex:1">${escHtml(t('sendEnquiry'))}</button>
      </div>
      <div id="match-res-${escHtml(l.listingId)}"></div>
    `;
    host.appendChild(div);
  });

  host.querySelectorAll('[data-match]').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.dataset.match;
      const lst = listings.find((x) => x.listingId === id);
      const box = document.getElementById(`match-res-${id}`);
      const matched = reqs.find((r) => lst && r.commodity.toLowerCase().includes(lst.commodity.toLowerCase().split(' ')[0]));
      if (matched && lst) {
        const mQty = Math.min(Number(lst.quantity), Number(matched.quantity));
        const rem = Math.max(0, Number(lst.quantity) - mQty);
        box.innerHTML = `<div class="match-box">
          <strong>🤝 ${escHtml(matched.buyerId)}</strong> (${escHtml(matched.deliveryLocation)})<br>
          ${escHtml(t('matchSummary').replaceAll('{m}', mQty).replaceAll('{u}', lst.unit).replaceAll('{rem}', rem))}
        </div>`;
      } else {
        box.innerHTML = `<div class="m-callout" style="margin-top:6px;font-size:12px">${escHtml(t('noMatch'))}</div>`;
      }
    });
  });

  host.querySelectorAll('[data-enq]').forEach((b) => {
    b.addEventListener('click', () => {
      b.textContent = t('enquirySent');
      b.disabled = true;
    });
  });
}

function renderInputsTable() {
  const L = getLang();
  $('inputs-table-host').innerHTML = `<table class="m-tbl">
    <thead><tr>
      <th>${L === 'kn' ? 'ಉತ್ಪನ್ನ' : 'Product'}</th>
      <th>${L === 'kn' ? 'ಪ್ರಮಾಣ' : 'Pack'}</th>
      <th>${L === 'kn' ? 'ಬೆಲೆ' : 'Price'}</th>
      <th>${L === 'kn' ? 'ಮಾರಾಟಗಾರ (ಪರವಾನಗಿ)' : 'Licensed Seller'}</th>
    </tr></thead>
    <tbody>
      ${INPUT_SELLERS.map((s) => `<tr>
        <td><b>${escHtml(s.product)}</b><div class="m-mut">${escHtml(s.brand)}</div></td>
        <td>${escHtml(s.pack)}</td>
        <td><b>₹${s.price}</b><div class="m-mut">${escHtml(s.perKg)}</div></td>
        <td>${escHtml(s.seller)}<div class="m-mut">✓ ${escHtml(s.lic)}</div></td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderPrices() {
  const L = getLang();
  const crop = $('pr-crop').value || 'ragi';
  const mandi = $('pr-mandi').value || 'Tumakuru';
  const d = PRICE_DATA[crop] || PRICE_DATA.ragi;

  $('pr-min').textContent = '₹' + d.min.toLocaleString();
  $('pr-modal').textContent = '₹' + d.modal.toLocaleString();
  $('pr-max').textContent = '₹' + d.max.toLocaleString();

  $('pr-msp-note').textContent = d.msp
    ? (L === 'kn'
      ? `ಮೂಲ: AGMARKNET ${mandi} (ಇಂದಿನ ಸಗಟು ದರ). 2025-26 ಅಧಿಕೃತ MSP: ₹${d.msp}/ಕ್ವಿಂಟಾಲ್ (ಸರ್ಕಾರಿ ಖರೀದಿ ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ, ಎಲ್ಲಾ ಮಾರಾಟಗಳಿಗೆ ಖಾತರಿಯಲ್ಲ).`
      : `Source: AGMARKNET ${mandi} daily modal price. Official 2025-26 MSP: ₹${d.msp}/quintal (MSP is a procurement benchmark, not an automatic guarantee at every mandi).`)
    : (L === 'kn'
      ? `ಮೂಲ: AGMARKNET ${mandi}. ತೋಟಗಾರಿಕಾ ಬೆಳೆಗೆ ಸರ್ಕಾರಿ MSP ಇಲ್ಲ — ಮಾರುಕಟ್ಟೆ ದರವು ಆವಕದ ಮೇಲೆ ಬದಲಾಗುತ್ತದೆ.`
      : `Source: AGMARKNET ${mandi}. No statutory MSP applies to tomato — wholesale prices vary daily with arrivals.`);

  const allPts = [...d.hist, d.fc[1]];
  const minV = Math.min(...allPts) * 0.9, maxV = Math.max(...allPts) * 1.05;
  const toY = (v) => Math.round(105 - ((v - minV) / (maxV - minV || 1)) * 85);
  const histStr = d.hist.map((v, i) => `${30 + i * 52},${toY(v)}`).join(' ');
  const lastX = 30 + (d.hist.length - 1) * 52, fcX = 30 + d.hist.length * 52;

  $('pr-chart-host').innerHTML = `<svg viewBox="0 0 380 130" style="width:100%;height:auto;background:#fff;border:1px solid #d1d5db;border-radius:12px">
    <line x1="20" y1="110" x2="365" y2="110" stroke="#e5e7eb"/>
    <polyline fill="none" stroke="#0f682b" stroke-width="3" points="${histStr}"/>
    <line x1="${lastX}" y1="${toY(d.hist[d.hist.length - 1])}" x2="${fcX}" y2="${toY(d.fc[1])}" stroke="#1967d2" stroke-width="2.5" stroke-dasharray="5,4"/>
    ${d.hist.map((v, i) => `<circle cx="${30 + i * 52}" cy="${toY(v)}" r="4" fill="#0f682b"/>`).join('')}
    <circle cx="${fcX}" cy="${toY(d.fc[1])}" r="5" fill="#1967d2"/>
    <text x="25" y="124" font-size="10" fill="#4b5563">${L === 'kn' ? '6 ತಿಂಗಳ ಇತಿಹಾಸ' : '6-Month History'}</text>
    <text x="${fcX - 35}" y="124" font-size="10" fill="#1967d2" font-weight="bold">${L === 'kn' ? 'ಸುಗ್ಗಿ ಅಂದಾಜು' : 'Harvest Forecast'}</text>
  </svg>`;

  $('pr-forecast-box').textContent = L === 'kn'
    ? `📈 ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಸುಗ್ಗಿ ದರ ಅಂದಾಜು (ಋತುಮಾನ ಸರಾಸರಿ ಮಾದರಿ, MAE ±₹${d.mae}/qtl): ಕನಿಷ್ಠ ₹${d.fc[0]} · ಮಧ್ಯಮ ₹${d.fc[1]} · ಗರಿಷ್ಠ ₹${d.fc[2]}/ಕ್ವಿಂಟಾಲ್.`
    : `📈 Statistical Harvest Forecast (Seasonal baseline model, backtest MAE ±₹${d.mae}/qtl): Downside ₹${d.fc[0]} · Base ₹${d.fc[1]} · Upside ₹${d.fc[2]}/quintal.`;
}

function renderNews() {
  const L = getLang();
  const items = L === 'kn' ? [
    { src: 'ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ (ಅಧಿಕೃತ)', title: '2025-26 ಖಾರಿಫ್ MSP ಘೋಷಣೆ', body: 'ರಾಗಿ ₹4,290/ಕ್ವಿಂಟಾಲ್ ಹಾಗೂ ಮೆಕ್ಕೆಜೋಳ ₹2,225/ಕ್ವಿಂಟಾಲ್ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ. ನೊಂದಣಿಗೆ ಸಮೀಪದ ಪಿಎಸಿಎಸ್ ಸಂಪರ್ಕಿಸಿ.' },
    { src: 'IMD ಬೆಂಗಳೂರು (ಹವಾಮಾನ ಪ್ರಕಟಣೆ)', title: 'ಮುಂದಿನ 48 ಗಂಟೆಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ', body: 'ದಕ್ಷಿಣ ಒಳನಾಡಿನಲ್ಲಿ ಸಾಧಾರಣ ಮಳೆ ಸಂಭವವಿದೆ. 25 mm ಗಿಂತ ಹೆಚ್ಚು ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದ್ದಲ್ಲಿ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವನ್ನು ಮುಂದೂಡಿ.' },
    { src: 'PMFBY ಬೆಳೆ ವಿಮೆ ಪೋರ್ಟಲ್', title: 'ಬೆಳೆ ವಿಮೆ ದಾಖಲಾತಿ ಮಾಹಿತಿ', body: 'ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳಿಗೆ ರೈತರು ಬ್ಯಾಂಕ್ ಅಥವಾ CSC ಕೇಂದ್ರದಲ್ಲಿ ಬೆಳೆ ವಿಮೆ ನೋಂದಣಿ ಪರಿಶೀಲಿಸಬಹುದು (ಅರ್ಹತೆ ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ).' }
  ] : [
    { src: 'Dept. of Agriculture, Karnataka (Official)', title: '2025-26 Kharif MSP Schedule', body: 'Statutory MSP notified at ₹4,290/qtl for Ragi and ₹2,225/qtl for Maize. Check local PACS procurement schedules for eligibility.' },
    { src: 'IMD Bengaluru Weather Advisory', title: '48-Hour Leaching Protection Alert', body: 'Moderate showers forecast across southern interior Karnataka. Delay urea top-dressing whenever 48h rainfall exceeds 25 mm.' },
    { src: 'PMFBY Portal Reference', title: 'Crop Insurance Window Information', body: 'Farmers cultivating notified crops may verify seasonal insurance enrollment deadlines at their nearest bank or CSC (subject to official eligibility rules).' }
  ];
  $('news-host').innerHTML = items.map((n) => `
    <div class="post-card" style="border-left:4px solid var(--b)">
      <div class="m-badge m-badge-info" style="margin-bottom:6px">${escHtml(n.src)}</div>
      <div style="font-weight:800;font-size:15px">${escHtml(n.title)}</div>
      <div style="font-size:14px;margin-top:4px">${escHtml(n.body)}</div>
    </div>
  `).join('');
}

onReady(() => {
  applyDedicatedView();

  document.querySelectorAll('#feed-filters button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#feed-filters button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      activeFilter = b.dataset.f;
      renderPosts();
    });
  });

  $('btn-post-submit').addEventListener('click', async () => {
    const content = $('post-content').value.trim();
    if (!content) return;
    const post = {
      postId: 'p_' + Date.now(),
      authorId: 'local-farmer',
      postCategory: $('post-cat').value,
      content,
      location: $('post-loc').value.trim() || 'Tumakuru',
      language: getLang(),
      createdAt: new Date().toISOString(),
      comments: []
    };
    try {
      await fetch('/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) });
    } catch { /* offline */ }
    const arr = JSON.parse(localStorage.getItem('mannu.posts_v2') || '[]');
    arr.unshift(post);
    localStorage.setItem('mannu.posts_v2', JSON.stringify(arr));
    $('post-content').value = '';
    renderPosts();
  });

  $('btn-mkt-add').addEventListener('click', async () => {
    const mode = $('mkt-mode').value;
    const comm = $('mkt-comm').value.trim();
    const qty = Number($('mkt-qty').value) || 1;
    const unit = $('mkt-unit').value;
    const price = Number($('mkt-price').value) || 0;
    if (!comm) return;

    if (mode === 'sell') {
      const lst = { listingId: 'lst_' + Date.now(), sellerId: 'local-farmer', commodity: comm, quantity: qty, unit, price, location: 'Local Plot' };
      try { await fetch('/api/community/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lst) }); } catch { }
      const arr = JSON.parse(localStorage.getItem('mannu.listings_v2') || '[]');
      arr.unshift(lst);
      localStorage.setItem('mannu.listings_v2', JSON.stringify(arr));
    } else {
      const req = { requirementId: 'req_' + Date.now(), buyerId: 'local-buyer', commodity: comm, quantity: qty, unit, deliveryLocation: 'Local Mandi', priceRange: `₹${price}/${unit}` };
      try { await fetch('/api/community/requirements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) }); } catch { }
      const arr = JSON.parse(localStorage.getItem('mannu.reqs_v2') || '[]');
      arr.unshift(req);
      localStorage.setItem('mannu.reqs_v2', JSON.stringify(arr));
    }
    $('mkt-comm').value = '';
    recordActivityEvent({ eventType: 'marketplace_post', sourceModule: 'community', eventDetails: `${mode}: ${qty} ${unit} ${comm}` });
    renderListings();
  });

  $('pr-crop').addEventListener('change', renderPrices);
  $('pr-mandi').addEventListener('change', renderPrices);

  renderPosts();
  renderListings();
  renderInputsTable();
  renderPrices();
  renderNews();
});
