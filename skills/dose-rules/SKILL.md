---
name: dose-rules
description: Maintain the verified fertiliser recommendation table (engine/norms.mjs) and the deterministic dose engine. Use when adding a crop, a state, or updating a recommended dose. Never let an LLM produce a dose.
---
# Dose rules
- All numbers live in `engine/norms.mjs` with `status` and `sources`. Only `verified-literature` entries are served.
- Add a crop: add the entry as `pending-verification`, get the number from the current UAS/ICAR/state package of practices, have an agronomist sign off, then flip the status and add a unit test with a hand calculation.
- Soil classes: ICAR-IISS Soil Health Card thresholds. Class adjustment: +25% low, 0 medium, -25% high (ICAR, Indian Farming 2020).
- Safety rule (tested): soil-card information alone never lowers N below the recommended dose; a plot reading or agronomist confirmation is needed.
- DAP nitrogen is credited against urea. Run `npm test` before every release.
