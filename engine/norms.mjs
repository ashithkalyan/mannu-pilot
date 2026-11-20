// Mannu norms table. DATA, not code: update here, re-run tests, get an agronomist to sign off.
// status 'verified-literature' = number found in UAS(B)/ICAR/IIMR sources (see sources). It is NOT yet field-validated by this team.
// Any entry whose status is not 'verified-literature' is REFUSED by the engine unless opts.allowUnverified is set (research use only).
export default {
  version: '2026.11-pilot',
  fertilisers: {
    urea: { N: 0.46, bagKg: 45, price: 242, priceStatus: 'verified-2026-06 (MRP per 45 kg bag)' },
    dap:  { N: 0.18, P2O5: 0.46, bagKg: 50, price: 1350, priceStatus: 'verified-2026-06 (per 50 kg bag)' },
    mop:  { K2O: 0.60, bagKg: 50, price: 1700, priceStatus: 'estimate: confirm at your retailer' },
  },
  soilClasses: {
    N: { low: 280, high: 560, unit: 'kg/ha', method: 'alkaline KMnO4' },
    P: { low: 10, high: 25, unit: 'kg/ha', method: 'Olsen' },
    K: { low: 120, high: 280, unit: 'kg/ha', method: 'NH4OAc' },
    source: 'ICAR-IISS Soil Health Card reading guide',
  },
  classMultiplier: { low: 1.25, medium: 1.0, high: 0.75,
    source: 'ICAR, Indian Farming Mar 2020: doses raised/lowered by 25% of general recommended dose for low/high soil-test category' },
  crops: {
    ragi: { name: { en: 'Finger millet (ragi)', kn: 'ರಾಗಿ' }, systems: {
      rainfed: { status: 'verified-literature', rdf: { N: 50, P2O5: 40, K2O: 25 }, fymTha: 7.5,
        split: [{ id: 'basal', fracN: 0.5, dasFrom: 0, dasTo: 0 }, { id: 'top1', fracN: 0.5, dasFrom: 25, dasTo: 30 }],
        sources: ['UAS(B)/ICAR-IIMR package of practices, finger millet (Karnataka): rainfed 50:40:25 + 7.5 t FYM/ha'] },
      irrigated: { status: 'verified-literature', rdf: { N: 100, P2O5: 50, K2O: 50 }, fymTha: 7.5,
        split: [{ id: 'basal', fracN: 0.5, dasFrom: 0, dasTo: 0 }, { id: 'top1', fracN: 0.25, dasFrom: 25, dasTo: 30 }, { id: 'top2', fracN: 0.25, dasFrom: 40, dasTo: 45 }],
        sources: ['UAS(B)/ICAR-IIMR package of practices, finger millet: irrigated 100:50:50; N 50% basal, rest in two splits'] } } },
    maize: { name: { en: 'Maize', kn: 'ಮೆಕ್ಕೆಜೋಳ' }, systems: {
      irrigated: { status: 'verified-literature', rdf: { N: 150, P2O5: 75, K2O: 40 }, fymTha: 0,
        split: [{ id: 'basal', fracN: 0.5, dasFrom: 0, dasTo: 0 }, { id: 'top1', fracN: 0.5, dasFrom: 28, dasTo: 32 }],
        sources: ['UAS(B) package of practices, maize: 150:75:40; 50% N + all P,K basal, rest N at ~30 DAS (some trials use 150:75:50 and thirds)'] },
      rainfed: { status: 'pending-verification', note: 'Rainfed maize dose not confirmed from a Karnataka source yet.' } } },
    tomato: { name: { en: 'Tomato', kn: 'ಟೊಮೆಟೊ' }, systems: {
      irrigated: { status: 'pending-verification',
        note: 'Published recommendations conflict (120:80:50, 115:100:60, 180:100:60 hybrid, 250:250:250 cited for Kolar). Confirm with KVK / UAS(B) horticulture officer.',
        range: 'N 115-250, P2O5 80-250, K2O 50-250 kg/ha (sources disagree)' },
      rainfed: { status: 'pending-verification', note: 'Not applicable / not confirmed.' } } },
  },
};
