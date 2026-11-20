// Mannu Personal Agricultural AI Agent — Floating Multimodal Assistant
(function () {
  if (window._mannuAssistantInitialized) return;
  window._mannuAssistantInitialized = true;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'mannu-assistant.css';
  document.head.appendChild(link);

  const getLang = () => {
    try {
      const d = localStorage.getItem('mannu.lang');
      if (d === 'en' || d === 'kn') return d;
      const v1 = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
      if (v1.lang === 'en' || v1.lang === 'kn') return v1.lang;
    } catch { /* ignore */ }
    return 'kn';
  };

  let currentLang = getLang();
  let isSpeaking = false;
  let isListening = false;
  let recognition = null;
  let preferredVoice = localStorage.getItem('mannu.voice') || 'friendly';
  let farmingMode = localStorage.getItem('mannu.farming_mode') || 'conventional';
  let chatHistory = [];
  try { chatHistory = JSON.parse(sessionStorage.getItem('mannu.chat_history') || '[]'); } catch { chatHistory = []; }

  const DICT = {
    kn: {
      title: 'ಮಣ್ಣು AI ಸಹಾಯಕ',
      ready: '● ಸಿದ್ಧವಾಗಿದೆ',
      listening: '● ಆಲಿಸುತ್ತಿದೆ...',
      speaking: '● ಮಾತನಾಡುತ್ತಿದೆ...',
      toggleLang: 'English',
      phInput: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ ಅಥವಾ ಬರೆಯಿರಿ...',
      stopBtn: '⏹ ನಿಲ್ಲಿಸಿ',
      voiceLbl: 'ಧ್ವನಿ:',
      vFriendly: 'ಸ್ನೇಹಪರ',
      vClear: 'ಸ್ಪಷ್ಟ',
      vCalm: 'ಶಾಂತ',
      modeConv: 'ಸಾಮಾನ್ಯ ಕೃಷಿ',
      modeOrg: 'ಸಾವಯವ ಕೃಷಿ',
      navBtn: 'ಪುಟ ತೆರೆಯಿರಿ',
      welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಮಣ್ಣು AI ಕೃಷಿ ಸಹಾಯಕ. ನಕ್ಷೆ, ಮಣ್ಣು, ಪರ್ಯಾಯ ಗೊಬ್ಬರ, ಬೆಳೆ ಸ್ಕ್ಯಾನ್, ಮಂಡಿ ದರ ಅಥವಾ ಆರ್ಥಿಕ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.',
      chips: [
        ['🗺️ ನನ್ನ ಜಮೀನು ನಕ್ಷೆ', 'ನನ್ನ ಜಮೀನಿನ ನಕ್ಷೆ ತೋರಿಸಿ'],
        ['💧 ನೀರಿನ ತೇವಾಂಶ', 'ಯಾವ ಭಾಗದಲ್ಲಿ ನೀರಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಿದೆ?'],
        ['⚠️ ಯೂರಿಯಾ ಪರ್ಯಾಯ', 'ನನ್ನ ಬಳಿ ಯೂರಿಯಾ ಇಲ್ಲ, ಪರ್ಯಾಯವೇನು?'],
        ['🌿 ಸಾವಯವ ಸಲಹೆ', 'ಸಾವಯವ ಕೃಷಿ ಸಲಹೆ ನೀಡಿ'],
        ['📊 ಮಂಡಿ ಬೆಲೆ', 'ರಾಗಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು?'],
        ['💰 ಆರ್ಥಿಕ ಯೋಜನೆ', 'ಮುಂದಿನ ಸುಗ್ಗಿಯ ಆರ್ಥಿಕ ಯೋಜನೆ ಲೆಕ್ಕ ಹಾಕಿ'],
        ['📋 ಇಂದಿನ ವರದಿ', 'ಇಂದಿನ ದಿನಚರಿ ವರದಿ ತೆರೆಯಿರಿ']
      ]
    },
    en: {
      title: 'Mannu Personal AI',
      ready: '● Ready',
      listening: '● Listening...',
      speaking: '● Speaking...',
      toggleLang: 'ಕನ್ನಡ',
      phInput: 'Speak or type your farm question…',
      stopBtn: '⏹ Stop',
      voiceLbl: 'Voice:',
      vFriendly: 'Friendly',
      vClear: 'Clear',
      vCalm: 'Calm',
      modeConv: 'Conventional',
      modeOrg: 'Organic Mode',
      navBtn: 'Open Screen',
      welcome: 'Hello! I am Mannu AI, your personal agricultural assistant. Ask me to open maps, inspect leaves, compute urea alternatives, check mandi prices, or run farm finance.',
      chips: [
        ['🗺️ Farm Map', 'Show my farmland map'],
        ['💧 Water Risk', 'Show which zone has low water'],
        ['⚠️ Urea Alternative', 'I do not have urea, what can I use instead?'],
        ['🌿 Organic Mode', 'Give me organic farming advice'],
        ['📊 Mandi Price', 'What is the current ragi market price?'],
        ['💰 Farm Finance', 'Simulate crop budget and break-even'],
        ['📋 Daily Report', 'Open today daily report']
      ]
    }
  };

  const t = (k) => (DICT[currentLang] && DICT[currentLang][k]) || DICT.en[k] || k;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const root = document.createElement('div');
  root.id = 'mannu-assistant-root';
  root.innerHTML = `
    <div id="mannu-fab" title="Mannu AI" aria-label="Mannu Personal AI Assistant">
      <span id="mannu-fab-icon">🎙️</span>
    </div>
    <div id="mannu-panel">
      <div class="agy-header">
        <div class="agy-title-group">
          <span style="font-size:22px">🌱</span>
          <div>
            <h3 id="agy-title"></h3>
            <small id="agy-status"></small>
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="agy-btn-icon" id="agy-lang-toggle"></button>
          <button class="agy-btn-icon" id="agy-close-btn">✕</button>
        </div>
      </div>
      <div class="agy-settings-bar">
        <span id="agy-voice-lbl"></span>
        <select class="agy-select-compact" id="agy-voice-select"></select>
        <select class="agy-select-compact" id="agy-mode-select"></select>
        <button class="agy-btn-icon" id="agy-stop-speech" style="color:#c5221f;background:#fce8e6;border-color:#fca5a5;min-height:26px"></button>
      </div>
      <div class="agy-chat-history" id="agy-history"></div>
      <div class="agy-chips-tray" id="agy-chips"></div>
      <div class="agy-input-row">
        <button class="agy-btn-circle" id="agy-mic-btn">🎤</button>
        <input type="text" class="agy-input-box" id="agy-text-input">
        <button class="agy-btn-circle primary" id="agy-send-btn">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const fab = document.getElementById('mannu-fab');
  const panel = document.getElementById('mannu-panel');
  const historyEl = document.getElementById('agy-history');
  const inputEl = document.getElementById('agy-text-input');
  const micBtn = document.getElementById('agy-mic-btn');
  const sendBtn = document.getElementById('agy-send-btn');
  const statusEl = document.getElementById('agy-status');
  const langBtn = document.getElementById('agy-lang-toggle');
  const voiceSel = document.getElementById('agy-voice-select');
  const modeSel = document.getElementById('agy-mode-select');

  function refreshLabels() {
    currentLang = getLang();
    document.getElementById('agy-title').textContent = t('title');
    statusEl.textContent = isListening ? t('listening') : isSpeaking ? t('speaking') : t('ready');
    langBtn.textContent = t('toggleLang');
    inputEl.placeholder = t('phInput');
    document.getElementById('agy-stop-speech').textContent = t('stopBtn');
    document.getElementById('agy-voice-lbl').textContent = t('voiceLbl');

    voiceSel.innerHTML = `
      <option value="friendly">${esc(t('vFriendly'))}</option>
      <option value="clear">${esc(t('vClear'))}</option>
      <option value="calm">${esc(t('vCalm'))}</option>
    `;
    voiceSel.value = preferredVoice;

    modeSel.innerHTML = `
      <option value="conventional">${esc(t('modeConv'))}</option>
      <option value="organic">${esc(t('modeOrg'))}</option>
    `;
    modeSel.value = farmingMode;

    const chipsEl = document.getElementById('agy-chips');
    chipsEl.innerHTML = t('chips').map(([lbl, q]) => `<button class="agy-chip" data-q="${esc(q)}">${esc(lbl)}</button>`).join('');
    chipsEl.querySelectorAll('.agy-chip').forEach((b) => {
      b.addEventListener('click', () => handleSend(b.dataset.q));
    });
  }

  function renderChatHistory() {
    historyEl.innerHTML = '';
    if (!chatHistory.length) {
      appendMessage(t('welcome'), 'agent', null, null, false);
    } else {
      chatHistory.forEach((m) => appendMessage(m.text, m.sender, m.uiCmd, m.card, false));
    }
  }

  function appendMessage(text, sender, uiCmd, card, persist = true) {
    const el = document.createElement('div');
    el.className = `agy-msg ${sender}`;
    el.appendChild(document.createTextNode(text));

    if (card && card.items && card.items.length) {
      const box = document.createElement('div');
      box.className = 'agy-data-card';
      box.innerHTML = `<div class="agy-data-card-title">${esc(card.title)}</div>` +
        card.items.map((it) => `<div class="agy-data-row"><span>${esc(it.label)}</span><strong>${esc(it.value)}</strong></div>`).join('');
      el.appendChild(box);
    }

    if (uiCmd && uiCmd.page) {
      const pill = document.createElement('div');
      pill.className = 'agy-action-pill';
      pill.textContent = `🧭 ${t('navBtn')}: ${uiCmd.page.replace('.html', '')}`;
      pill.addEventListener('click', () => executeNav(uiCmd));
      el.appendChild(pill);
    }

    const tm = document.createElement('div');
    tm.className = 'agy-msg-time';
    tm.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    el.appendChild(tm);

    historyEl.appendChild(el);
    historyEl.scrollTop = historyEl.scrollHeight;

    if (persist) {
      chatHistory.push({ text, sender, uiCmd, card, ts: Date.now() });
      try { sessionStorage.setItem('mannu.chat_history', JSON.stringify(chatHistory.slice(-24))); } catch { /* ignore */ }
    }
  }

  function executeNav(cmd) {
    if (!cmd || !cmd.page) return;
    if (cmd.layer) sessionStorage.setItem('mannu.active_layer', cmd.layer);
    const curr = window.location.pathname.split('/').pop() || 'index.html';
    if (curr !== cmd.page) {
      setTimeout(() => { window.location.href = cmd.page; }, 650);
    } else if (typeof window.switchMapLayer === 'function' && cmd.layer) {
      window.switchMapLayer(cmd.layer);
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    u.rate = preferredVoice === 'calm' ? 0.88 : preferredVoice === 'clear' ? 1.02 : 0.95;
    u.pitch = preferredVoice === 'calm' ? 0.94 : 1.0;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((x) => x.lang.toLowerCase().startsWith(currentLang));
    if (v) u.voice = v;

    u.onstart = () => { isSpeaking = true; fab.classList.add('speaking'); statusEl.textContent = t('speaking'); };
    u.onend = () => { isSpeaking = false; fab.classList.remove('speaking'); statusEl.textContent = t('ready'); };
    u.onerror = () => { isSpeaking = false; fab.classList.remove('speaking'); statusEl.textContent = t('ready'); };
    window.speechSynthesis.speak(u);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    fab.classList.remove('speaking');
    statusEl.textContent = t('ready');
  }

  function buildLocalAgentResponse(rawMsg, lang) {
    const msg = String(rawMsg || '').toLowerCase();
    if (msg.includes('ಯೂರಿಯಾ ಇಲ್ಲ') || msg.includes('ಪರ್ಯಾಯ') || msg.includes('ಬದಲಿ') || msg.includes('no urea') || msg.includes('alternative') || msg.includes('substitute') || msg.includes('instead')) {
      const isCan = msg.includes('can') || msg.includes('ಕ್ಯಾಲ್ಸಿಯಂ');
      const isOrg = msg.includes('vermi') || msg.includes('ಎರೆಹುಳು') || msg.includes('organic') || msg.includes('ಸಾವಯವ');
      const altName = isCan ? (lang === 'kn' ? 'ಕ್ಯಾಲ್ಸಿಯಂ ಅಮೋನಿಯಂ ನೈಟ್ರೇಟ್ (CAN)' : 'Calcium Ammonium Nitrate (CAN)')
        : isOrg ? (lang === 'kn' ? 'ಎರೆಹುಳು ಗೊಬ್ಬರ' : 'Vermicompost')
          : (lang === 'kn' ? 'ಅಮೋನಿಯಂ ಸಲ್ಫೇಟ್' : 'Ammonium Sulphate');
      const qtyKg = isCan ? 92 : isOrg ? 3066.7 : 111.7;
      return {
        reply: lang === 'kn'
          ? `50 ಕಿಲೋ ಯೂರಿಯಾ (23 ಕಿಲೋ ಸಾರಜನಕ) ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ, ${qtyKg} ಕಿಲೋ ${altName} ಬಳಸಬಹುದು.${isOrg ? ' ಗಮನಿಸಿ: ಸಾವಯವ ಗೊಬ್ಬರ ನಿಧಾನವಾಗಿ ಪೋಷಕಾಂಶ ನೀಡುತ್ತದೆ.' : ''}`
          : `If 50 kg Urea (23 kg N) is unavailable, you can substitute ${qtyKg} kg of ${altName}.${isOrg ? ' Note: organic sources release nitrogen slowly over weeks.' : ''}`,
        uiCommand: null,
        card: {
          title: lang === 'kn' ? 'ಪರ್ಯಾಯ ಗೊಬ್ಬರ ಲೆಕ್ಕಾಚಾರ (50 kg ಯೂರಿಯಾ ಬದಲು)' : 'Deterministic Fertiliser Substitution (vs 50 kg Urea)',
          items: [
            { label: lang === 'kn' ? 'ಪರ್ಯಾಯ ಗೊಬ್ಬರ' : 'Alternative', value: altName },
            { label: lang === 'kn' ? 'ಬೇಕಾದ ಪ್ರಮಾಣ' : 'Equivalent Qty', value: `${qtyKg} kg` },
            { label: lang === 'kn' ? 'ಸಾರಜನಕ (N)' : 'Nitrogen Delivered', value: '23 kg' }
          ]
        }
      };
    }
    if (msg.includes('ಸಾವಯವ') || msg.includes('ಜೀವಾಮೃತ') || msg.includes('ಕಾಂಪೋಸ್ಟ್') || msg.includes('organic') || msg.includes('compost') || msg.includes('fym')) {
      return {
        reply: lang === 'kn'
          ? 'ಸಾವಯವ ಕೃಷಿಯಲ್ಲಿ ಬಿತ್ತನೆಗೆ 2–3 ವಾರಗಳ ಮೊದಲು ಎಕರೆಗೆ 4–5 ಟನ್ ಕೊಳೆತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಅಥವಾ 1.5 ಟನ್ ಎರೆಹುಳು ಗೊಬ್ಬರ ಸೇರಿಸಿ.'
          : 'For organic farming, incorporate 4–5 tonnes/acre of composted FYM or 1.5 tonnes/acre of Vermicompost 2–3 weeks before sowing with Azotobacter + PSB.',
        uiCommand: null,
        card: {
          title: lang === 'kn' ? 'ಸಾವಯವ ಕೃಷಿ ಪದ್ಧತಿ (UAS ಬೆಂಗಳೂರು)' : 'Organic Farming Practices',
          items: [
            { label: lang === 'kn' ? 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ (FYM)' : 'FYM Basal', value: lang === 'kn' ? '4–5 ಟನ್ / ಎಕರೆ' : '4–5 tonnes / acre' },
            { label: lang === 'kn' ? 'ಎರೆಹುಳು ಗೊಬ್ಬರ' : 'Vermicompost', value: lang === 'kn' ? '1.5 ಟನ್ / ಎಕರೆ' : '1.5 tonnes / acre' }
          ]
        }
      };
    }
    if (msg.includes('ನಕ್ಷೆ') || msg.includes('ಜಮೀನು') || msg.includes('ನೀರು') || msg.includes('ತೇವಾಂಶ') || msg.includes('map') || msg.includes('water') || msg.includes('moisture') || msg.includes('zone') || msg.includes('plot')) {
      const layer = (msg.includes('ನೀರು') || msg.includes('water') || msg.includes('moisture') || msg.includes('ತೇವಾಂಶ')) ? 'water'
        : (msg.includes('ಪೋಷಕ') || msg.includes('nutrient')) ? 'nutrient' : 'overall';
      return {
        reply: lang === 'kn' ? 'ನಿಮ್ಮ ಜಮೀನಿನ ನಕ್ಷೆ ಪುಟವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ.' : `Opening your Farmland Digital Twin (${layer} layer).`,
        uiCommand: { action: 'navigate', page: 'mapping.html', layer },
        card: null
      };
    }
    if (msg.includes('ಹಣಕಾಸು') || msg.includes('ಖರ್ಚು') || msg.includes('ಲಾಭ') || msg.includes('ಬಂಡವಾಳ') || msg.includes('finance') || msg.includes('cost') || msg.includes('profit') || msg.includes('budget')) {
      return {
        reply: lang === 'kn' ? 'ಆರ್ಥಿಕ ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಬ್ರೇಕ್-ಈವನ್ ಸಿಮ್ಯುಲೇಟರ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.' : 'Opening Farm Finance & Profit Simulator.',
        uiCommand: { action: 'navigate', page: 'finance.html' },
        card: null
      };
    }
    if (msg.includes('ಮಾರುಕಟ್ಟೆ') || msg.includes('ಬೆಲೆ') || msg.includes('market') || msg.includes('price') || msg.includes('mandi')) {
      return {
        reply: lang === 'kn' ? 'ರಾಗಿ ಮಾದರಿ ಮಂಡಿ ದರ ₹3,420/ಕ್ವಿಂಟಾಲ್ (MSP ₹4,290). ಮಂಡಿ ಬೆಲೆ ಪುಟ ತೆರೆಯಲಾಗುತ್ತಿದೆ.' : 'Ragi modal mandi benchmark is ₹3,420/qtl (MSP ₹4,290). Opening Mandi Prices.',
        uiCommand: { action: 'navigate', page: 'community.html?view=prices' },
        card: null
      };
    }
    if (msg.includes('ವರದಿ') || msg.includes('ದಿನಚರಿ') || msg.includes('report') || msg.includes('logbook') || msg.includes('pdf')) {
      return {
        reply: lang === 'kn' ? 'ದೈನಂದಿನ ಕೃಷಿ ವರದಿ ಮತ್ತು ದಿನಚರಿ ಪುಟ ತೆರೆಯಲಾಗುತ್ತಿದೆ.' : 'Opening Daily Reports & Farm Logbook.',
        uiCommand: { action: 'navigate', page: 'reports.html' },
        card: null
      };
    }
    if (msg.includes('ಕ್ಯಾಮೆರಾ') || msg.includes('ಲೈವ್') || msg.includes('ಸ್ಕ್ಯಾನ್') || msg.includes('ರೋಗ') || msg.includes('ಎಲೆ') || msg.includes('live') || msg.includes('camera') || msg.includes('scan') || msg.includes('leaf')) {
      return {
        reply: lang === 'kn' ? 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಎಲೆ ತಪಾಸಣೆ ಪುಟ ತೆರೆಯಲಾಗುತ್ತಿದೆ.' : 'Opening Crop Health & Leaf Scanner.',
        uiCommand: { action: 'navigate', page: 'live.html' },
        card: null
      };
    }
    return {
      reply: lang === 'kn'
        ? 'ನಮಸ್ಕಾರ! ನಾನು ಮಣ್ಣು AI ಸಹಾಯಕ. ಜಮೀನಿನ ನಕ್ಷೆ, ಮಣ್ಣಿನ ಗೊಬ್ಬರ ಯೋಜನೆ, ಪರ್ಯಾಯ ಗೊಬ್ಬರ, ಎಲೆ ತಪಾಸಣೆ, ಮಂಡಿ ದರ ಅಥವಾ ಆರ್ಥಿಕ ಲೆಕ್ಕದ ಬಗ್ಗೆ ಕೇಳಿ.'
        : 'Hello! I am Mannu AI. Ask me about farmland maps, fertiliser plans, Urea substitutes, leaf scanning, mandi prices, or farm finance.',
      uiCommand: null,
      card: null
    };
  }

  async function handleSend(customText) {
    const msg = (customText ?? inputEl.value).trim();
    if (!msg) return;
    appendMessage(msg, 'user', null, null);
    inputEl.value = '';

    let mainState = {};
    try { mainState = JSON.parse(localStorage.getItem('mannu.v1') || '{}'); } catch { mainState = {}; }

    const query = farmingMode === 'organic' && !msg.toLowerCase().includes('organic') && !msg.includes('ಸಾವಯವ')
      ? `${msg} (organic mode preference)` : msg;

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
          farmerId: 'local-farmer',
          currentContext: {
            page: window.location.pathname.split('/').pop() || 'index.html',
            crop: mainState.crop || 'ragi',
            system: mainState.system || 'rainfed',
            layer: sessionStorage.getItem('mannu.active_layer') || 'overall'
          }
        })
      });
      if (!res.ok) throw new Error('http_' + res.status);
      const data = await res.json();
      if (!data || !data.reply) throw new Error('empty_reply');
      appendMessage(data.reply, 'agent', data.uiCommand, data.card);
      speak(data.reply);
      if (data.uiCommand?.action === 'navigate') executeNav(data.uiCommand);
    } catch {
      const localRes = buildLocalAgentResponse(query, currentLang);
      appendMessage(localRes.reply, 'agent', localRes.uiCommand, localRes.card);
      speak(localRes.reply);
      if (localRes.uiCommand?.action === 'navigate') executeNav(localRes.uiCommand);
    }
  }

  // Speech recognition
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => { isListening = true; micBtn.classList.add('active'); fab.classList.add('listening'); statusEl.textContent = t('listening'); };
    recognition.onend = () => { isListening = false; micBtn.classList.remove('active'); fab.classList.remove('listening'); statusEl.textContent = t('ready'); };
    recognition.onresult = (e) => {
      const tr = e.results[0][0].transcript;
      inputEl.value = tr;
      handleSend(tr);
    };
  }

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) inputEl.focus();
  });
  document.getElementById('agy-close-btn').addEventListener('click', () => panel.classList.remove('open'));
  document.getElementById('agy-stop-speech').addEventListener('click', stopSpeech);
  sendBtn.addEventListener('click', () => handleSend());
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

  micBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (isSpeaking) stopSpeech();
    if (isListening) { recognition.stop(); return; }
    recognition.lang = currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    try { recognition.start(); } catch { /* ignore */ }
  });

  langBtn.addEventListener('click', () => {
    const next = currentLang === 'kn' ? 'en' : 'kn';
    currentLang = next;
    try {
      localStorage.setItem('mannu.lang', next);
      const v1 = JSON.parse(localStorage.getItem('mannu.v1') || '{}');
      v1.lang = next;
      localStorage.setItem('mannu.v1', JSON.stringify(v1));
    } catch { /* ignore */ }
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent('mannu:langchange', { detail: { lang: next } }));
    refreshLabels();
  });

  voiceSel.addEventListener('change', () => {
    preferredVoice = voiceSel.value;
    localStorage.setItem('mannu.voice', preferredVoice);
    fetch('/api/agent/memory/local-farmer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: currentLang, voice: preferredVoice, farmingStyle: farmingMode })
    }).catch(() => { });
  });

  modeSel.addEventListener('change', () => {
    farmingMode = modeSel.value;
    localStorage.setItem('mannu.farming_mode', farmingMode);
    fetch('/api/agent/memory/local-farmer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: currentLang, voice: preferredVoice, farmingStyle: farmingMode })
    }).catch(() => { });
  });

  window.addEventListener('mannu:langchange', () => {
    refreshLabels();
  });

  refreshLabels();
  renderChatHistory();
})();
