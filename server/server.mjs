import { createApp } from './app.mjs';
import { makeGemini } from './gemini.mjs';
import { makeStore } from './store.mjs';
const app = createApp({ gemini: makeGemini(), store: makeStore() });
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Mannu listening on :${port} (gemini ${process.env.GEMINI_API_KEY ? 'on' : 'off: template mode'})`));
