---
name: follow-up-loop
description: Schedule stage reminders, collect leaf-photo checks and season outcomes (yield, quantities used, whether advice was followed) into the pilot dataset. Use after a plan is issued.
---
# Follow-up loop
- Reminders come from `plan.schedule` due dates (sowing date + days after sowing).
- Outcomes: `POST /api/outcome` {plotId, season, crop, yieldKgAcre, ureaKgAcre, dapKgAcre, followedPlan}. Export with `GET /api/export/outcomes.csv` (admin key) and load into BigQuery.
- Metrics to publish: adherence %, N applied vs norm, yield and cost per acre, cost per advisory. Estimate `cardAgreement` and `sensorLik` in `engine/engine.mjs` from paired card/reading/lab data.
- Leaf-photo checks are advisory only; low confidence goes to a human agronomist.
