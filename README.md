# Mannu · ಮಣ್ಣು — plot-aware fertiliser advice in Kannada (pilot v0.1)

Farmer sends a Soil Health Card (photo or values), speaks, and optionally adds a plot reading. Mannu returns a **bag-level, split-timed plan** with cost, compared with what the farmer usually applies. Numbers come from a **deterministic engine**; Gemini reads cards, understands speech and rewords the advice, and is never allowed to change a number.

## Status (read this first)
| Part | State |
|---|---|
| Dose engine (`engine/`) | Built. 16 unit tests incl. hand-calculation checks. Runs offline in the browser and on the server. |
| Norms | **Literature-verified, not field-validated.** Ragi rainfed 50:40:25 and irrigated 100:50:50 (UAS(B)/ICAR-IIMR), maize irrigated 150:75:40 (UAS(B)), ICAR Soil Health Card classes and ±25% rule. **Tomato and rainfed maize are refused** until an agronomist confirms a dose. Re-check against the current UAS(B) package before release. |
| Web app (`web/`) | Built. Kannada/English, offline, voice (browser speech), card photo, dataset import, WhatsApp share. DOM-tested with jsdom; **not yet tested on real phones**. Kannada strings need native-speaker review. |
| Server (`server/`) | Built, 11 tests with mocks. **Gemini, Open-Meteo and SoilGrids calls were not exercised live** (build sandbox had no access). Test with a real key before relying on them. |
| ESP32 Reader (`firmware/`) | Optional reference firmware. **Not tested on hardware.** Calibrates on every use and rejects non-Nernstian slopes. |
| Plot-reading rules | **Experimental.** The nitrate critical value (25 mg/kg) is a US corn value; the card-agreement and sensor-likelihood matrices are assumptions. They are tunable in `engine/engine.mjs` and must be estimated from pilot data. |

## Safety rules enforced in code (and tested)
1. LLM output is discarded if it contains any number not in the computed plan (`numbersAreGrounded`).
2. Unverified crops return a KVK referral, never a dose.
3. Soil-card data alone never lowers nitrogen below the recommended dose; a confirming plot reading is required.
4. Readings failing quality control (too few, noisy, bad calibration) are ignored and flagged.

## Data: works with no hardware
Inputs, in order of preference: Soil Health Card values/photo → imported field/lab dataset (CSV/JSON; columns `no3_n_mgkg` or `no3_n_mgl_extract`, `ph`, `ec_dsm`, `moisture_pct`, `temp_c`) → optional ESP32 Reader via `POST /api/readings`. Open data (Open-Meteo rain forecast, SoilGrids topsoil context) is optional context only. `data/sample_readings.csv` and the in-app sample are **synthetic**, for demos.

## Run
`npm install && npm test && npm start` (template mode; set `GEMINI_API_KEY` for AI features). Demo single file: `npm run build:demo` → `dist/mannu-demo.html`.
Deploy: `PROJECT=… GEMINI_API_KEY=… DEVICE_KEYS=… ADMIN_KEY=… ./deploy.sh` (Cloud Run + Secret Manager + Firestore). Outcomes export to BigQuery (see script).

## API
`POST /api/plan` · `POST /api/card/parse` · `POST /api/intent` · `POST /api/readings` (x-device-key) · `GET /api/readings/:plotId` · `GET /api/context?lat&lon` · `POST /api/outcome` · `GET /api/export/outcomes.csv` (x-admin-key) · `GET /api/health`

## Before any farmer uses it
Agronomist sign-off on `norms.mjs`; native-speaker review of Kannada; real-phone tests (low-end Android, Chrome); consent + privacy notice (DPDP Act); rate limiting and auth on a public deployment; run the 10–20 farmer pilot with the metrics in `skills/follow-up-loop`.
