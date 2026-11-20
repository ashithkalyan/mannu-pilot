import fs from 'node:fs';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const imgBase64 = fs.readFileSync('data/soil_health_card_sample.jpg').toString('base64');

async function tryParse(model) {
  console.log('Trying model:', model);
  const start = Date.now();
  const res = await ai.models.generateContent({
    model,
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imgBase64 } },
        { text: 'Extract ONLY numeric soil test values: N, P, K (kg/ha), pH, EC (dS/m), OC (%). Return JSON with keys: legible, N, P, K, pH, EC, OC.' }
      ]
    }],
    config: { responseMimeType: 'application/json' }
  });
  console.log(`Success in ${(Date.now() - start)/1000}s with ${model}:`);
  console.log(res.text);
}

for (const m of ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.8-flash']) {
  try {
    await tryParse(m);
    break;
  } catch (e) {
    console.error(`Failed ${m}:`, e.message || e);
  }
}
