// Shared event bus for Mannu pages to communicate via localStorage events
export const MannuEvents = {
  emit(type, data) {
    localStorage.setItem('mannu.event', JSON.stringify({type, data, ts: Date.now()}));
    window.dispatchEvent(new Event('storage'));
  },
  on(type, handler) {
    window.addEventListener('storage', (e) => {
      try {
        if (e.key === 'mannu.event') {
          const ev = JSON.parse(e.newValue);
          if (ev.type === type) handler(ev.data);
        }
      } catch {}
    });
  }
};
export default MannuEvents;
