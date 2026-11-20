import { GoogleGenAI, Type } from '@google/genai';
// Gemini client wrapper. Model id is configurable (GEMINI_MODEL); default is the Flash alias. Not exercised against the live API from the build sandbox: tested with an injected mock.
const RANGES = { N: [0, 1500], P: [0, 200], K: [0, 1500], pH: [3, 11], EC: [0, 20], OC: [0, 5] };
export function validateCard(raw) {
  const out = { values: {}, rejected: [], legible: !!raw.legible, confidence: raw.confidence || {} };
  for (const [k, [lo, hi]] of Object.entries(RANGES)) {
    const v = raw[k]; if (v == null) continue;
    if (typeof v === 'number' && v >= lo && v <= hi) out.values[k] = v; else out.rejected.push(k);
  }
  return out;
}
export function makeGemini({ apiKey = process.env.GEMINI_API_KEY, model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite' } = {}) {
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  const fallbackModels = [model, 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'].filter((m, i, arr) => arr.indexOf(m) === i);

  const gen = async (contents, config) => {
    let lastErr;
    for (const m of fallbackModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await ai.models.generateContent({ model: m, contents, config });
        } catch (e) {
          lastErr = e;
          const msg = String(e?.message || '');
          const isRetryable = e?.status === 503 || e?.status === 429 || msg.includes('high demand') || msg.includes('fetch failed');
          if (!isRetryable) break;
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    throw lastErr;
  };

  const num = { type: Type.NUMBER, nullable: true };
  return {
    async parseCard({ imageBase64, mimeType = 'image/jpeg' }) {
      const r = await gen([{
        role: 'user', parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: 'This is an Indian Soil Health Card (may be Kannada or English). Extract ONLY these numeric soil test values: N, P, K (kg/ha), pH, EC (dS/m), OC (%). If a value is not clearly legible return null. Never guess or infer. Do not extract names, survey numbers or any personal data. Return JSON format with keys: legible (boolean), N, P, K, pH, EC, OC (number or null), confidence: { N, P, K, pH, EC, OC }.' }
        ]
      }], { responseMimeType: 'application/json' });
      return validateCard(JSON.parse(r.text));
    },
    async intent({ transcript }) {
      const r = await gen(`Farmer said: "${transcript}". Extract crop (ragi|maize|tomato), system (rainfed|irrigated) and acres (number). Use null if not stated. Return JSON with keys: crop, system, acres.`,
        { responseMimeType: 'application/json' });
      return JSON.parse(r.text);
    },
    async rephrase({ facts, draft, lang }) {
      const r = await gen(`Facts (JSON): ${JSON.stringify(facts)}\n\nDraft advice:\n${draft}`, {
        systemInstruction:
          `You rewrite fertiliser advice for a low-literacy farmer in ${lang === 'kn' ? 'simple spoken Kannada' : 'simple English'}. Use ONLY numbers that appear in the facts. Keep every quantity and every product. Do not add products, doses, pesticides or new numbers. Short sentences. Plain text, no markdown.`
      });
      return r.text;
    },
  };
}
