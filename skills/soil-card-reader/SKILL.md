---
name: soil-card-reader
description: Extract numeric soil test values (N, P, K in kg/ha, pH, EC, OC) from a photo of an Indian Soil Health Card or lab report, in Kannada or English. Use when a farmer uploads a card photo. Never guess illegible values; never extract personal data.
---
# Soil card reader
1. Ask Gemini (AI Studio prototype first, then `server/gemini.mjs`) for JSON only, `temperature: 0`, with the response schema in `parseCard`.
2. Return `null` for any value that is not clearly legible. Never infer a value from a neighbouring one.
3. Do not extract the farmer's name, survey number, phone or Aadhaar. Mask before upload on the device when possible.
4. Server-side `validateCard` rejects implausible values (N 0-1500, P 0-200, K 0-1500, pH 3-11, EC 0-20, OC 0-5).
5. Always show the extracted values to the farmer or agent for confirmation. A wrong digit changes a dose.
Golden tests: keep 50 real card photos (consented) with hand-typed truth; track field-level accuracy per release.
