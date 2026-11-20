import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs'; import { JSDOM } from 'jsdom';
const html = fs.readFileSync(new URL('../dist/mannu-demo.html', import.meta.url), 'utf8');
async function load() {
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://mannu.test/', beforeParse(w) { w.fetch = () => Promise.reject(new Error('offline')); w.AbortSignal.timeout ??= () => undefined; w.Element.prototype.scrollIntoView = () => {}; } });
  await new Promise((r) => setTimeout(r, 80)); return dom;
}
const click = (d, sel) => d.window.document.querySelector(sel).dispatchEvent(new d.window.MouseEvent('click', { bubbles: true }));
test('offline flow in Kannada: ragi rainfed -> advice with bags, split and cost', async () => {
  const d = await load(), q = (s) => d.window.document.querySelector(s);
  assert.match(q('#net').textContent, /ಆಫ್‌ಲೈನ್/); click(d, '[data-crop=ragi]'); click(d, '[data-system=rainfed]');
  q('#acres').value = '2'; q('#clsN').value = 'medium'; q('#hu').value = '2'; q('#hd').value = '1'; click(d, '#btnPlan'); await new Promise((r) => setTimeout(r, 50));
  const r = q('#result').textContent; assert.match(r, /ಯೂರಿಯಾ/); assert.match(r, /ಡಿಎಪಿ/); assert.match(r, /₹\d+/); assert.match(r, /ಉಳಿತಾಯ/); assert.ok(q('#result svg.bag')); assert.match(q('#adviceText').textContent, /KVK/);
});
test('language toggle re-renders the advice in English', async () => {
  const d = await load(), q = (s) => d.window.document.querySelector(s); click(d, '#btnPlan'); await new Promise((r) => setTimeout(r, 50)); click(d, '#langBtn');
  assert.match(q('#result').textContent, /Urea/); assert.match(q('#adviceText').textContent, /At sowing/);
});
test('tomato shows a KVK referral and no dose; sample dataset enables the experimental reading', async () => {
  const d = await load(), q = (s) => d.window.document.querySelector(s); click(d, '[data-crop=tomato]'); click(d, '#btnPlan'); await new Promise((r) => setTimeout(r, 50));
  assert.match(q('#result').textContent, /KVK/); assert.ok(!q('#result svg.bag'));
  click(d, '[data-crop=ragi]'); click(d, '[data-system=irrigated]'); q('#valN').value = '700'; click(d, '#btnSample'); click(d, '#btnPlan'); await new Promise((r) => setTimeout(r, 50));
  assert.match(q('#readingInfo').textContent, /12/); assert.match(q('#result').textContent, /ಪ್ರಾಯೋಗಿಕ/);
});
