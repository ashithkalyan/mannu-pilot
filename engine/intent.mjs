// Offline keyword intent (shared by browser and server). Gemini handles free-form speech when online; this is the fallback.
import { toAscii } from './engine.mjs';
const W = { 'ಒಂದು': 1, 'ಎರಡು': 2, 'ಮೂರು': 3, 'ನಾಲ್ಕು': 4, 'ಐದು': 5, 'ಆರು': 6, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
export function keywordIntent(text = '') {
  const s = toAscii(String(text)).toLowerCase(); const out = { crop: null, system: null, acres: null };
  if (/ರಾಗಿ|ragi|finger millet/.test(s)) out.crop = 'ragi';
  else if (/ಮೆಕ್ಕೆ|maize|corn/.test(s)) out.crop = 'maize';
  else if (/ಟೊಮ|tomato/.test(s)) out.crop = 'tomato';
  if (/ನೀರಾವರಿ|ಬೋರ್|irrigat|borewell/.test(s)) out.system = 'irrigated'; else if (/ಮಳೆ|rainfed|rain-fed|dryland/.test(s)) out.system = 'rainfed';
  const m = s.match(/(\d+(?:\.\d+)?)\s*(?:ಎಕರೆ|acre)/) || s.match(/(?:ಎಕರೆ|acres?)\s*(\d+(?:\.\d+)?)/);
  if (m) out.acres = Number(m[1]);
  else { for (const [w, v] of Object.entries(W)) if (new RegExp(w + '\\s*(?:ಎಕರೆ|acre)').test(s)) { out.acres = v; break; } }
  return out;
}
