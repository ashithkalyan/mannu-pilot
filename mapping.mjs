import { initShell, getLang, createTranslator, onReady, recordActivityEvent, escHtml } from './mannu-shell.mjs';
import { computePlan } from './engine/engine.mjs';

const DICT = {
  kn: {
    headerSub: 'ಜಮೀನು ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
    introDesc: 'ನಿಮ್ಮ ಜಮೀನಿನ ಗಡಿಯನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ ಮತ್ತು ಪ್ರತಿ ವಲಯದ ಮಣ್ಣು ಹಾಗೂ ನೀರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
    twinTitle: 'ಜಮೀನಿನ ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
    btnNewPlot: 'ಹೊಸ ಜಮೀನು ನಕ್ಷೆ',
    lblArea: 'ವಿಸ್ತೀರ್ಣ',
    lblCoverage: 'ಮಾಪನ ವ್ಯಾಪ್ತಿ',
    lblVersion: 'ಗಡಿ ಆವೃತ್ತಿ',
    layerOverall: 'ಒಟ್ಟಾರೆ',
    layerWater: 'ನೀರು',
    layerNutrient: 'ಪೋಷಕಾಂಶ',
    layerCrop: 'ಬೆಳೆ ಆರೋಗ್ಯ',
    lblSelectNutrient: 'ಪೋಷಕಾಂಶ ಆಯ್ಕೆಮಾಡಿ',
    optNO3: 'ನೈಟ್ರೇಟ್ (NO₃-N · mg/kg)',
    optN: 'ಲಭ್ಯ ಸಾರಜನಕ (N · kg/ha)',
    optP: 'ರಂಜಕ (P₂O₅ · kg/ha)',
    optK: 'ಪೊಟ್ಯಾಶ್ (K₂O · kg/ha)',
    optPH: 'ಮಣ್ಣಿನ pH',
    optEC: 'ಲವಣಾಂಶ (EC · dS/m)',
    lblActiveCrop: 'ಪ್ರಸ್ತುತ ಬೆಳೆ',
    cropRagi: 'ರಾಗಿ',
    cropMaize: 'ಮೆಕ್ಕೆಜೋಳ',
    cropTomato: 'ಟೊಮೇಟೊ',
    lblZoneDensity: 'ವಲಯ ಗಾತ್ರ (m²)',
    btnResegment: 'ವಿಭಜಿಸಿ',
    wfTitle: 'ಹೊಸ ಜಮೀನು ಗಡಿ ದಾಖಲಾತಿ',
    btnCancel: 'ರದ್ದುಮಾಡಿ',
    stName: '1. ಹೆಸರು',
    stWalk: '2. GPS ನಡಿಗೆ',
    stReview: '3. ಪರಿಶೀಲನೆ',
    lblPlotName: 'ಹೊಲದ ಹೆಸರು',
    phPlotName: 'ಉದಾ: ಉತ್ತರ ಹೊಲ',
    lblSelfArea: 'ಸ್ವಯಂ-ತಿಳಿಸಿದ ವಿಸ್ತೀರ್ಣ (ಐಚ್ಛಿಕ - ಎಕರೆ)',
    btnNextWalk: 'ಮುಂದೆ: ಗಡಿ ಗುರುತಿಸಿ →',
    lblGpsAcc: 'GPS ನಿಖರತೆ',
    lblPoints: 'ಬಿಂದುಗಳು',
    lblPerim: 'ಸುತ್ತಳತೆ',
    msgTapOrWalk: 'ನಕ್ಷೆಯ ಮೇಲೆ ಮೂಲೆಗಳನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ GPS ನಡಿಗೆ ಪ್ರಾರಂಭಿಸಿ.',
    btnStartGps: '▶ GPS ಪ್ರಾರಂಭಿಸಿ',
    btnPause: '⏸ ವಿರಾಮ',
    btnResume: '▶ ಮುಂದುವರಿಸಿ',
    btnFinishPoly: '✓ ಗಡಿ ಪೂರ್ಣಗೊಳಿಸಿ',
    btnLoadSample: '📍 ಮಾದರಿ ಜಮೀನು',
    btnUndoPt: '↩ ಹಿಂದಿನ ಬಿಂದು',
    btnRedo: '↩ ಮತ್ತೆ ಗುರುತಿಸಿ',
    btnSavePlot: '💾 ದೃಢಪಡಿಸಿ ಉಳಿಸಿ',
    lblTapZoneHint: 'ವಲಯವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರ ನೋಡಿ',
    txtTapZoneDesc: 'ನಕ್ಷೆಯಲ್ಲಿರುವ ಯಾವುದೇ ವಲಯವನ್ನು (A1, A2...) ಟ್ಯಾಪ್ ಮಾಡಿ ಮಣ್ಣು, ನೀರು, ಬೆಳೆ ಅಪಾಯ ಮತ್ತು ಸೆನ್ಸಾರ್ ಮಾಪನ ಸೇರಿಸಿ.',
    lblAddReading: '🔬 ಜಿಯೋಟ್ಯಾಗ್ ಸೆನ್ಸಾರ್ ಮಾಪನ / ವೀಕ್ಷಣೆ ಸೇರಿಸಿ',
    lblNo3Input: 'ನೈಟ್ರೇಟ್ NO₃-N (mg/kg · 1:5 ಸಾರ)',
    lblPhInput: 'pH ಮೌಲ್ಯ',
    lblCalSlope: 'ಎಲೆಕ್ಟ್ರೋಡ್ ಕ್ಯಾಲಿಬ್ರೇಶನ್ (Nernst %)',
    lblWaterObs: 'ನೀರು / ಬೆಳೆ ವೀಕ್ಷಣೆ',
    obsAdequate: 'ಸಾಮಾನ್ಯ ತೇವಾಂಶ',
    obsDry: 'ಒಣ / ನೀರು ಕೊರತೆ',
    obsWet: 'ನೀರು ನಿಂತಿದೆ (Waterlogging)',
    obsPest: 'ಕೀಟ / ರೋಗ ಲಕ್ಷಣ ಕಂಡಿದೆ',
    btnSaveReading: '✓ ಮಾಪನ ಉಳಿಸಿ (QC ಪರಿಶೀಲನೆ)',
    acre: 'ಎಕರೆ',
    ha: 'ಹೆಕ್ಟೇರ್',
    demoTag: 'ಪ್ರದರ್ಶನ ಮಾದರಿ',
    savedTag: 'ಉಳಿಸಿದ ಜಮೀನು',
    measured: 'ಮಾಪನವಾಗಿದೆ',
    unmeasured: 'ಮಾಪನವಾಗಿಲ್ಲ',
    attention: 'ಗಮನ ಅಗತ್ಯ',
    qcRejected: 'QC ತಿರಸ್ಕೃತ',
    noticeOverall: 'ನೇರ ವಲಯ ಸ್ಥಿತಿ ಮತ್ತು ಸೆನ್ಸಾರ್ ಮಾಪನ ವ್ಯಾಪ್ತಿ. ಹಸಿರು = ಮಾಪನವಾಗಿದೆ, ಬೂದು = ಮಾಪನವಾಗಿಲ್ಲ.',
    noticeWater: 'ಮಾದರಿ ನೀರಿನ ಅಪಾಯ ಅಂದಾಜು (Open-Meteo ಮಳೆ + ನೀರಾವರಿ ವೀಕ್ಷಣೆ). ನೇರ ತೇವಾಂಶ ಸೆನ್ಸಾರ್ ಇಲ್ಲದಿದ್ದಾಗ ಅಂದಾಜು ಎಂದು ಗುರುತಿಸಲಾಗುತ್ತದೆ.',
    noticeNutrient: 'ಪ್ರತ್ಯೇಕ ಪೋಷಕಾಂಶ ಪದರ: ಮಣ್ಣು ರೀಡರ್ (ISE) ಮಾಪನಗಳು, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಮತ್ತು ISRIC 250m ಹಿನ್ನೆಲೆ ಪ್ರತ್ಯೇಕವಾಗಿ ತೋರಿಸಲಾಗಿದೆ.',
    noticeCrop: 'ವರ್ಗ A (ಸಾಮಾನ್ಯ ಬೆಳೆ ಅಪಾಯ) ಮತ್ತು ವರ್ಗ B (ಪ್ರಸ್ತುತ ಹಂತದ ಅಪಾಯ) + ರೈತರ/ಕ್ಯಾಮೆರಾ ವೀಕ್ಷಣೆ. ಕೀಟನಾಶಕ ಪ್ರಮಾಣ ಊಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    qcFailCal: 'ಕ್ಯಾಲಿಬ್ರೇಶನ್ ವಿಫಲ (85%–105% Nernst ಶ್ರೇಣಿಯ ಹೊರಗೆ): ಈ ಮಾಪನವನ್ನು ನಕ್ಷೆ ಅಥವಾ ಗೊಬ್ಬರ ಲೆಕ್ಕಾಚಾರಕ್ಕೆ ಬಳಸಲಾಗುವುದಿಲ್ಲ.',
    qcSaved: 'ಮಾಪನ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ ಮತ್ತು ವಲಯ ನವೀಕರಿಸಲಾಗಿದೆ.',
    needThreePts: 'ಕನಿಷ್ಠ 3 ಗಡಿ ಬಿಂದುಗಳು ಅಗತ್ಯವಿದೆ.',
    selfIntersect: 'ಎಚ್ಚರಿಕೆ: ಗಡಿ ರೇಖೆಗಳು ಪರಸ್ಪರ ದಾಟಿವೆ. ದಯವಿಟ್ಟು ಮರು-ಗುರುತಿಸಿ.',
    tooSmall: 'ವಿಸ್ತೀರ್ಣ ತುಂಬಾ ಚಿಕ್ಕದು (ಕನಿಷ್ಠ 100 m² ಅಗತ್ಯ).',
    zoneDetailsFmt: 'ವಿಸ್ತೀರ್ಣ: {area} m² · ಕೇಂದ್ರ: {lat}, {lng}',
    sourceMeasured: 'ಮೂಲ: Mannu Reader ISE (1:5 ಸಾರ)',
    sourceCard: 'ಮೂಲ: ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ (ಜಮೀನು ಮಟ್ಟದ ಪೂರ್ವ ಮಾಹಿತಿ)',
    sourceNone: 'ಮೂಲ: ಸಾಕಷ್ಟು ಮಾಪನವಿಲ್ಲ'
  },
  en: {
    headerSub: 'Farmland Digital Twin',
    introDesc: 'Mark your farmland boundary by walking or tapping and inspect soil, water, and crop zones.',
    twinTitle: 'Farmland Digital Twin',
    btnNewPlot: 'Map New Plot',
    lblArea: 'Measured Area',
    lblCoverage: 'Coverage',
    lblVersion: 'Boundary Ver',
    layerOverall: 'Overall',
    layerWater: 'Water Risk',
    layerNutrient: 'Nutrients',
    layerCrop: 'Crop Health',
    lblSelectNutrient: 'Select Soil Parameter',
    optNO3: 'Nitrate (NO₃-N · mg/kg)',
    optN: 'Available Nitrogen (N · kg/ha)',
    optP: 'Available Phosphorus (P₂O₅ · kg/ha)',
    optK: 'Available Potassium (K₂O · kg/ha)',
    optPH: 'Soil pH',
    optEC: 'Salinity (EC · dS/m)',
    lblActiveCrop: 'Active Crop',
    cropRagi: 'Finger Millet (Ragi)',
    cropMaize: 'Maize',
    cropTomato: 'Tomato',
    lblZoneDensity: 'Zone Size (m²)',
    btnResegment: 'Segment',
    wfTitle: 'Register New Farmland Boundary',
    btnCancel: 'Cancel',
    stName: '1. Name',
    stWalk: '2. GPS / Tap',
    stReview: '3. Review',
    lblPlotName: 'Plot Name',
    phPlotName: 'e.g. North Field',
    lblSelfArea: 'Self-reported Area (optional, acres)',
    btnNextWalk: 'Next: Capture Boundary →',
    lblGpsAcc: 'GPS Accuracy',
    lblPoints: 'Vertices',
    lblPerim: 'Perimeter',
    msgTapOrWalk: 'Tap corners directly on the satellite map OR start a live GPS perimeter walk.',
    btnStartGps: '▶ Start GPS Walk',
    btnPause: '⏸ Pause',
    btnResume: '▶ Resume',
    btnFinishPoly: '✓ Close & Review Polygon',
    btnLoadSample: '📍 Load Sample Field',
    btnUndoPt: '↩ Undo Point',
    btnRedo: '↩ Redo Boundary',
    btnSavePlot: '💾 Confirm & Save Plot',
    lblTapZoneHint: 'Tap Any Zone on Map to Inspect',
    txtTapZoneDesc: 'Select any zone (A1, A2…) on the map above to inspect soil readings, water risk, UAS dose plan, or record a geotagged sample.',
    lblAddReading: '🔬 Record Geotagged Reading / Observation',
    lblNo3Input: 'Nitrate NO₃-N (mg/kg · 1:5 extract)',
    lblPhInput: 'Soil pH',
    lblCalSlope: 'Electrode Calibration (Nernst %)',
    lblWaterObs: 'Water / Crop Field Observation',
    obsAdequate: 'Adequate Moisture',
    obsDry: 'Dry / Water Stress',
    obsWet: 'Waterlogged / Excess Water',
    obsPest: 'Suspected Pest / Leaf Symptom',
    btnSaveReading: '✓ Save Geotagged Record (with QC)',
    acre: 'acres',
    ha: 'ha',
    demoTag: 'Synthetic Demo',
    savedTag: 'Registered',
    measured: 'Measured',
    unmeasured: 'Unmeasured',
    attention: 'Attention Needed',
    qcRejected: 'QC Rejected',
    noticeOverall: 'Real-time plot coverage & sampling locations. Green = measured, Grey = unmeasured, Red = QC rejected.',
    noticeWater: 'Modelled Water-Risk Estimate (Open-Meteo weather + irrigation observations). Direct soil moisture is never fabricated.',
    noticeNutrient: 'Single-parameter nutrient distribution: distinguishes Mannu Reader ISE measurements from plot-level Soil Health Card priors.',
    noticeCrop: 'Category A (General crop threats) & Category B (Current stage threats) + verified observations. No invented pesticide doses.',
    qcFailCal: 'Calibration QC Failed (outside 85%–105% Nernst ideal slope): reading rejected from heatmaps and dose math.',
    qcSaved: 'Geotagged reading validated and saved to zone history.',
    needThreePts: 'At least 3 boundary points are required.',
    selfIntersect: 'Self-intersection detected in polygon edges. Please redo the boundary.',
    tooSmall: 'Polygon area is too small (minimum 100 m²).',
    zoneDetailsFmt: 'Area: {area} m² · Centroid: {lat}, {lng}',
    sourceMeasured: 'Source: Mannu Reader ISE (1:5 soil-water extract)',
    sourceCard: 'Source: Soil Health Card (Plot-level prior, not zone-specific)',
    sourceNone: 'Source: Insufficient zone sampling'
  }
};

const RAD = Math.PI / 180;
const TUMAKURU_DEMO_RING = [
  [77.1004, 13.3413], [77.1014, 13.3413], [77.1014, 13.3406], [77.1004, 13.3406], [77.1004, 13.3413]
];

const S = {
  plots: [],
  activePlot: null,
  zones: [],
  activeLayer: sessionStorage.getItem('mannu.active_layer') || 'overall',
  nutrientParam: 'NO3_N',
  crop: 'ragi',
  zoneSizeSqm: 900,
  selectedZone: null,
  twinMap: null,
  twinLayer: null,
  walkMap: null,
  walkLayer: null,
  walkPath: [],
  watchId: null,
  paused: false
};

const $ = (id) => document.getElementById(id);
const t = createTranslator(DICT);
initShell({
  activeNav: 'map',
  dict: DICT,
  onLangChange: () => {
    renderPlotSelector();
    renderLayerUI();
    renderZones();
  }
});

// Geodesic math
function haversine(a, b) {
  const dLat = (b.lat - a.lat) * RAD, dLng = (b.lng - a.lng) * RAD;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}
function calcAreaSqm(pts) {
  if (pts.length < 3) return 0;
  const R = 6371000;
  const avgLat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
  const xScale = RAD * R * Math.cos(avgLat * RAD), yScale = RAD * R;
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += (pts[i].lng * xScale) * (pts[j].lat * yScale) - (pts[j].lng * xScale) * (pts[i].lat * yScale);
  }
  return Math.abs(a / 2);
}
function calcPerimeterM(pts) {
  if (pts.length < 2) return 0;
  let d = 0;
  for (let i = 0; i < pts.length; i++) d += haversine(pts[i], pts[(i + 1) % pts.length]);
  return d;
}
function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lng, yi = poly[i].lat, xj = poly[j].lng, yj = poly[j].lat;
    if (((yi > pt.lat) !== (yj > pt.lat)) && (pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function hasSelfIntersection(pts) {
  if (pts.length < 4) return false;
  const cross = (o, a, b) => (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
  const segs = pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 2; j < segs.length; j++) {
      if (i === 0 && j === segs.length - 1) continue;
      const [p1, p2] = segs[i], [p3, p4] = segs[j];
      const d1 = cross(p3, p4, p1), d2 = cross(p3, p4, p2), d3 = cross(p1, p2, p3), d4 = cross(p1, p2, p4);
      if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
    }
  }
  return false;
}

// Create Leaflet map with Esri Satellite + OpenStreetMap + Offline resilient background
function makeLeaflet(containerId, center = [13.3409, 77.1009], zoom = 17) {
  if (!window.L) return null;
  const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri Satellite', maxZoom: 19
  });
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 19
  });
  const map = L.map(containerId, { center, zoom, layers: [sat] });
  L.control.layers({ '🛰️ Satellite': sat, '🗺️ Street': osm }).addTo(map);
  return map;
}

function defaultDemoPlot() {
  const pts = TUMAKURU_DEMO_RING.slice(0, -1).map(([lng, lat]) => ({ lat, lng }));
  const sqm = Math.round(calcAreaSqm(pts));
  return {
    plotId: 'demo_tumakuru_1',
    ownerId: 'local-farmer',
    plotName: 'Tumakuru Demo Field',
    isSyntheticDemo: true,
    boundaryVersion: 1,
    boundaryGeometry: { type: 'Polygon', coordinates: [TUMAKURU_DEMO_RING] },
    calculatedArea: { sqm, hectares: +(sqm / 10000).toFixed(3), acres: +(sqm / 4046.856).toFixed(2) },
    perimeter: Math.round(calcPerimeterM(pts)),
    coordinateReference: 'WGS84'
  };
}

function generateZonesForPlot(plot, zoneSizeSqm = 900) {
  const ring = plot.boundaryGeometry?.coordinates?.[0] || TUMAKURU_DEMO_RING;
  const poly = ring.slice(0, -1).map(([lng, lat]) => ({ lat, lng }));
  const savedZones = JSON.parse(localStorage.getItem(`mannu_zones_${plot.plotId}`) || 'null');
  if (savedZones && savedZones.length && savedZones[0].sizeSqm === zoneSizeSqm) return savedZones;

  const sideM = Math.sqrt(zoneSizeSqm);
  const lats = poly.map((p) => p.lat), lngs = poly.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const avgLat = (minLat + maxLat) / 2;
  const dLat = sideM / 111320;
  const dLng = sideM / (111320 * Math.cos(avgLat * RAD));

  const zones = [];
  let r = 0;
  for (let lat = minLat; lat < maxLat; lat += dLat) {
    let c = 0;
    for (let lng = minLng; lng < maxLng; lng += dLng) {
      const center = { lat: lat + dLat / 2, lng: lng + dLng / 2 };
      if (pointInPoly(center, poly)) {
        const code = String.fromCharCode(65 + (r % 26)) + (c + 1);
        const demoSeed = (r + c) % 4;
        const isDemo = !!plot.isSyntheticDemo;
        zones.push({
          zoneId: `${plot.plotId}_${code}`,
          zoneCode: code,
          sizeSqm: zoneSizeSqm,
          area: Math.round(zoneSizeSqm),
          centroid: center,
          bounds: [[lat, lng], [lat + dLat, lng], [lat + dLat, lng + dLng], [lat, lng + dLng]],
          measurementStatus: isDemo ? (demoSeed === 0 ? 'unmeasured' : demoSeed === 3 ? 'attention' : 'measured') : 'unmeasured',
          readings: isDemo && demoSeed !== 0 ? {
            NO3_N: [null, 32.4, 28.1, 14.2][demoSeed],
            N: [null, 310, 290, 210][demoSeed],
            P: [null, 28, 22, 18][demoSeed],
            K: [null, 240, 195, 140][demoSeed],
            pH: [null, 6.5, 6.2, 5.7][demoSeed],
            EC: [null, 0.34, 0.41, 0.52][demoSeed],
            source: 'Mannu Reader ISE (Synthetic Demo)',
            ts: new Date().toISOString()
          } : null,
          waterObs: isDemo ? ['unobserved', 'adequate', 'adequate', 'dry'][demoSeed] : 'unobserved',
          cropObs: isDemo && demoSeed === 3 ? 'chlorosis_suspected' : 'normal'
        });
      }
      c++;
    }
    r++;
  }
  localStorage.setItem(`mannu_zones_${plot.plotId}`, JSON.stringify(zones));
  return zones;
}

function getZoneVisual(z) {
  const layer = S.activeLayer;
  if (layer === 'water') {
    if (z.waterObs === 'dry') return { color: '#f59e0b', label: getLang() === 'kn' ? 'ಕಡಿಮೆ ತೇವಾಂಶ ಅಪಾಯ (ಅಂದಾಜು)' : 'Low Moisture Risk (Modelled)' };
    if (z.waterObs === 'waterlogged') return { color: '#1d4ed8', label: getLang() === 'kn' ? 'ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ' : 'Waterlogging Risk' };
    if (z.waterObs === 'adequate') return { color: '#16a34a', label: getLang() === 'kn' ? 'ಸೂಕ್ತ ತೇವಾಂಶ (ವೀಕ್ಷಿತ)' : 'Adequate (Observed)' };
    return { color: '#9ca3af', label: getLang() === 'kn' ? 'ತೇವಾಂಶ ಮಾಪನವಿಲ್ಲ' : 'Unmeasured Moisture' };
  }
  if (layer === 'nutrient') {
    const p = S.nutrientParam;
    const val = z.readings?.[p];
    if (val == null) return { color: '#9ca3af', label: getLang() === 'kn' ? 'ಸಾಕಷ್ಟು ಮಾಪನವಿಲ್ಲ' : 'Insufficient Data' };
    if (p === 'NO3_N') return val < 15 ? { color: '#dc2626', label: `${val} mg/kg (Low)` } : val < 25 ? { color: '#f59e0b', label: `${val} mg/kg (Med)` } : { color: '#16a34a', label: `${val} mg/kg (Opt)` };
    if (p === 'N') return val < 280 ? { color: '#dc2626', label: `${val} kg/ha (Low)` } : val <= 560 ? { color: '#16a34a', label: `${val} kg/ha (Med)` } : { color: '#2563eb', label: `${val} kg/ha (High)` };
    if (p === 'pH') return val < 6.0 ? { color: '#f59e0b', label: `pH ${val} (Acidic)` } : val > 8.5 ? { color: '#dc2626', label: `pH ${val} (Alkaline)` } : { color: '#16a34a', label: `pH ${val} (Normal)` };
    return { color: '#16a34a', label: `${val}` };
  }
  if (layer === 'crophealth') {
    if (z.cropObs === 'pest' || z.cropObs === 'chlorosis_suspected') return { color: '#f59e0b', label: getLang() === 'kn' ? 'ವೀಕ್ಷಿತ ಲಕ್ಷಣ (ಪರಿಶೀಲನೆ ಬಾಕಿ)' : 'Observed Symptom (Unverified)' };
    return { color: '#16a34a', label: getLang() === 'kn' ? 'ಕಡಿಮೆ ಅಪಾಯ / ಸಾಮಾನ್ಯ' : 'Low Risk / Normal' };
  }
  // Overall
  if (z.measurementStatus === 'qc_rejected') return { color: '#dc2626', label: t('qcRejected') };
  if (z.measurementStatus === 'attention') return { color: '#f59e0b', label: t('attention') };
  if (z.measurementStatus === 'measured') return { color: '#16a34a', label: t('measured') };
  return { color: '#9ca3af', label: t('unmeasured') };
}

function renderLayerUI() {
  const L = getLang();
  $('nutrient-param-bar').classList.toggle('m-hidden', S.activeLayer !== 'nutrient');
  const noticeKey = S.activeLayer === 'water' ? 'noticeWater'
    : S.activeLayer === 'nutrient' ? 'noticeNutrient'
      : S.activeLayer === 'crophealth' ? 'noticeCrop' : 'noticeOverall';
  $('layer-notice').textContent = t(noticeKey);

  document.querySelectorAll('#layer-btns .layer-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.layer === S.activeLayer);
  });

  const legends = {
    overall: [
      ['#16a34a', t('measured')], ['#f59e0b', t('attention')], ['#dc2626', t('qcRejected')], ['#9ca3af', t('unmeasured')]
    ],
    water: [
      ['#16a34a', L === 'kn' ? 'ಸೂಕ್ತ' : 'Adequate'], ['#f59e0b', L === 'kn' ? 'ಕಡಿಮೆ ತೇವಾಂಶ ಅಪಾಯ' : 'Low Moisture Risk'],
      ['#1d4ed8', L === 'kn' ? 'ನೀರು ನಿಲ್ಲುವಿಕೆ' : 'Waterlogging'], ['#9ca3af', L === 'kn' ? 'ಮಾಪನವಿಲ್ಲ' : 'Unmeasured']
    ],
    nutrient: [
      ['#dc2626', L === 'kn' ? 'ಕೊರತೆ' : 'Deficient'], ['#f59e0b', L === 'kn' ? 'ಮಧ್ಯಮ' : 'Moderate'],
      ['#16a34a', L === 'kn' ? 'ಪೂರೈಕೆ ಇದೆ' : 'Adequate'], ['#9ca3af', L === 'kn' ? 'ಡೇಟಾ ಇಲ್ಲ' : 'Insufficient Data']
    ],
    crophealth: [
      ['#16a34a', L === 'kn' ? 'ಸಾಮಾನ್ಯ / ಕಡಿಮೆ ಅಪಾಯ' : 'Normal / Low Risk'],
      ['#f59e0b', L === 'kn' ? 'ರೈತರ ವೀಕ್ಷಣೆ / ಶಂಕಿತ ಲಕ್ಷಣ' : 'Observed / Suspected Issue']
    ]
  };
  $('layer-legend').innerHTML = (legends[S.activeLayer] || legends.overall)
    .map(([c, lbl]) => `<span><span class="dot" style="background:${c}"></span>${escHtml(lbl)}</span>`).join('');
}

function renderZones() {
  if (!S.activePlot) return;
  const plot = S.activePlot;
  $('kpi-area').textContent = `${plot.calculatedArea?.acres ?? '--'} ${t('acre')}`;
  $('kpi-ver').textContent = `v${plot.boundaryVersion || 1}`;
  const measuredCount = S.zones.filter((z) => z.measurementStatus === 'measured' || z.measurementStatus === 'attention').length;
  const covPct = S.zones.length ? Math.round((measuredCount / S.zones.length) * 100) : 0;
  $('kpi-cov').textContent = `${covPct}% (${measuredCount}/${S.zones.length})`;

  if (!S.twinMap && window.L) {
    S.twinMap = makeLeaflet('twin-map', [13.3409, 77.1009], 17);
    S.twinLayer = L.layerGroup().addTo(S.twinMap);
  }
  if (S.twinMap && S.twinLayer) {
    S.twinLayer.clearLayers();
    const ring = plot.boundaryGeometry?.coordinates?.[0] || TUMAKURU_DEMO_RING;
    const outerLatLngs = ring.map(([lng, lat]) => [lat, lng]);
    const outerPoly = L.polygon(outerLatLngs, { color: '#ffffff', weight: 3, fillOpacity: 0.04 }).addTo(S.twinLayer);

    S.zones.forEach((z) => {
      const vis = getZoneVisual(z);
      const poly = L.polygon(z.bounds, { color: '#ffffff', weight: 1.5, fillColor: vis.color, fillOpacity: 0.56 }).addTo(S.twinLayer);
      poly.bindTooltip(z.zoneCode, { permanent: true, direction: 'center', className: 'zone-lbl' });
      poly.on('click', () => openZoneModal(z, vis));
      if (z.measurementStatus === 'measured') {
        L.circleMarker([z.centroid.lat, z.centroid.lng], { radius: 4, color: '#fff', weight: 1.5, fillColor: '#0f682b', fillOpacity: 1 }).addTo(S.twinLayer);
      }
    });
    S.twinMap.invalidateSize();
    S.twinMap.fitBounds(outerPoly.getBounds(), { padding: [22, 22] });
    setTimeout(() => { if (S.twinMap) { S.twinMap.invalidateSize(); S.twinMap.fitBounds(outerPoly.getBounds(), { padding: [22, 22] }); } }, 200);
  } else {
    renderFallbackSvgMap($('twin-map'), plot, S.zones);
  }
}

function renderFallbackSvgMap(host, plot, zones) {
  if (!host) return;
  const ring = (plot.boundaryGeometry?.coordinates?.[0] || TUMAKURU_DEMO_RING).map(([lng, lat]) => ({ lat, lng }));
  const lats = ring.map((p) => p.lat), lngs = ring.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const pad = 34, W = 560, H = 340;
  const toX = (lng) => pad + ((lng - minLng) / (maxLng - minLng || 1e-4)) * (W - pad * 2);
  const toY = (lat) => H - pad - ((lat - minLat) / (maxLat - minLat || 1e-4)) * (H - pad * 2);
  const polyPts = ring.map((p) => `${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`).join(' ');

  const zoneSvgs = zones.map((z, idx) => {
    const vis = getZoneVisual(z);
    const pts = z.bounds.map(([lat, lng]) => `${toX(lng).toFixed(1)},${toY(lat).toFixed(1)}`).join(' ');
    const cx = toX(z.centroid.lng).toFixed(1), cy = toY(z.centroid.lat).toFixed(1);
    return `<g class="svg-zone" data-zidx="${idx}" style="cursor:pointer">
      <polygon points="${pts}" fill="${vis.color}" fill-opacity="0.6" stroke="#ffffff" stroke-width="2"/>
      <rect x="${cx - 14}" y="${cy - 9}" width="28" height="18" rx="4" fill="#ffffff" fill-opacity="0.92" stroke="#1f2937"/>
      <text x="${cx}" y="${Number(cy) + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#111827">${escHtml(z.zoneCode)}</text>
    </g>`;
  }).join('');

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;background:radial-gradient(circle at 30% 30%,#2c4c34,#1a2f22)">
    <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <polygon points="${polyPts}" fill="rgba(255,255,255,0.06)" stroke="#ffffff" stroke-width="3" stroke-dasharray="6,4"/>
    ${zoneSvgs}
    <text x="12" y="20" fill="#e5e7eb" font-size="12" font-weight="700">🛰️ ${escHtml(plot.plotName)} · WGS84 Interactive Digital Twin</text>
  </svg>`;

  host.querySelectorAll('.svg-zone').forEach((g) => {
    g.addEventListener('click', () => {
      const z = zones[Number(g.dataset.zidx)];
      if (z) openZoneModal(z, getZoneVisual(z));
    });
  });
}

function openZoneModal(z, vis) {
  S.selectedZone = z;
  const L = getLang();
  $('zm-title').textContent = `${L === 'kn' ? 'ವಲಯ' : 'Zone'} ${z.zoneCode}`;
  $('zm-badges').innerHTML = `
    <span class="m-badge" style="background:${vis.color}22;color:${vis.color};border:1px solid ${vis.color}">${escHtml(vis.label)}</span>
    <span class="m-badge m-badge-info">${z.area} m²</span>
    <span class="m-badge m-badge-mut">${z.centroid.lat.toFixed(5)}, ${z.centroid.lng.toFixed(5)}</span>
  `;

  const r = z.readings;
  $('zm-metrics').innerHTML = `
    <div class="m-kpi"><div class="m-kpi-val">${r?.NO3_N != null ? r.NO3_N + ' mg/kg' : '--'}</div><div class="m-kpi-lbl">NO₃-N (1:5)</div></div>
    <div class="m-kpi"><div class="m-kpi-val">${r?.pH != null ? r.pH : '--'}</div><div class="m-kpi-lbl">pH</div></div>
  `;
  $('zm-details').innerHTML = `
    <div><b>${r ? t('sourceMeasured') : t('sourceNone')}</b></div>
    <div class="m-mut">${r?.ts ? new Date(r.ts).toLocaleString() : ''}</div>
  `;

  // Deterministic dose engine integration for the active plot + zone
  const plan = computePlan({
    crop: S.crop,
    system: S.crop === 'maize' ? 'irrigated' : 'rainfed',
    acres: S.activePlot.calculatedArea?.acres || 1,
    soil: { N: { value: r?.N ?? 290 }, P: { value: r?.P ?? 22 }, K: { value: r?.K ?? 195 }, pH: r?.pH },
    sensor: r?.NO3_N != null ? { no3nMgKg: r.NO3_N, qcOk: z.measurementStatus !== 'qc_rejected' } : null
  });
  if (plan.ok) {
    $('zm-dose').textContent = L === 'kn'
      ? `UAS ಬೆಂಗಳೂರು ಜಮೀನು ಶಿಫಾರಸು (${plan.acres} ಎಕರೆ): ಯೂರಿಯಾ ${plan.plot.urea.bags} ಚೀಲ, DAP ${plan.plot.dap.bags} ಚೀಲ, MOP ${plan.plot.mop.bags} ಚೀಲ (₹${plan.cost.perAcre}/ಎಕರೆ)`
      : `UAS Bangalore Plot Plan (${plan.acres} ac): Urea ${plan.plot.urea.bags} bags, DAP ${plan.plot.dap.bags} bags, MOP ${plan.plot.mop.bags} bags (₹${plan.cost.perAcre}/ac)`;
  } else {
    $('zm-dose').textContent = L === 'kn'
      ? `${S.crop} ಬೆಳೆಗೆ ದೃಢೀಕೃತ ಡೋಸ್ ಲಭ್ಯವಿಲ್ಲ — KVK ಸಂಪರ್ಕಿಸಿ.`
      : `Norms unverified for ${S.crop} — consult local KVK.`;
  }

  $('zm-in-no3').value = r?.NO3_N ?? '';
  $('zm-in-ph').value = r?.pH ?? '';
  $('zm-qc-msg').textContent = '';
  $('zone-modal').classList.remove('m-hidden');
}

async function saveZoneReading() {
  const z = S.selectedZone;
  if (!z) return;
  const no3 = Number($('zm-in-no3').value);
  const ph = $('zm-in-ph').value ? Number($('zm-in-ph').value) : null;
  const calPct = Number($('zm-in-cal').value) || 96;
  const obs = $('zm-in-obs').value;

  const calValid = calPct >= 85 && calPct <= 105;
  if (!calValid) {
    z.measurementStatus = 'qc_rejected';
    $('zm-qc-msg').textContent = t('qcFailCal');
    $('zm-qc-msg').style.color = 'var(--r)';
  } else {
    z.measurementStatus = (obs === 'dry' || obs === 'waterlogged' || obs === 'pest') ? 'attention' : 'measured';
    z.readings = {
      ...(z.readings || {}),
      NO3_N: Number.isFinite(no3) && $('zm-in-no3').value !== '' ? no3 : z.readings?.NO3_N ?? null,
      pH: ph ?? z.readings?.pH ?? null,
      calPct,
      source: 'Mannu Reader ISE (Field Entry)',
      ts: new Date().toISOString()
    };
    z.waterObs = (obs === 'dry' || obs === 'waterlogged' || obs === 'adequate') ? obs : z.waterObs;
    z.cropObs = obs === 'pest' ? 'pest' : 'normal';
    $('zm-qc-msg').textContent = t('qcSaved');
    $('zm-qc-msg').style.color = 'var(--g)';
  }

  localStorage.setItem(`mannu_zones_${S.activePlot.plotId}`, JSON.stringify(S.zones));
  try {
    await fetch(`/api/farms/plot/${S.activePlot.plotId}/samples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zoneId: z.zoneId,
        location: { lat: z.centroid.lat, lon: z.centroid.lng, accuracy: 5 },
        collectionMethod: '1:5_extract_ISE',
        calibrationId: `nernst_${calPct}pct`,
        qcStatus: calValid ? 'passed' : 'rejected_calibration'
      })
    });
  } catch { /* offline safe */ }

  await recordActivityEvent({
    eventType: calValid ? 'soil_test' : 'qc_alert',
    plotId: S.activePlot.plotId,
    zoneId: z.zoneCode,
    sourceModule: 'mapping',
    eventDetails: `Zone ${z.zoneCode}: NO3-N=${z.readings?.NO3_N ?? '--'} mg/kg, cal=${calPct}%, obs=${obs}`
  });

  renderZones();
}

function renderPlotSelector() {
  const L = getLang();
  $('plot-selector-list').innerHTML = S.plots.map((p) => `
    <div class="plot-pill ${S.activePlot?.plotId === p.plotId ? 'active' : ''}" data-plot="${escHtml(p.plotId)}">
      <div>
        <strong>🌾 ${escHtml(p.plotName)}</strong>
        <div class="m-mut">${p.calculatedArea?.acres ?? '--'} ${t('acre')} · v${p.boundaryVersion || 1}</div>
      </div>
      <span class="m-badge ${p.isSyntheticDemo ? 'm-badge-warn' : 'm-badge-ok'}">${p.isSyntheticDemo ? t('demoTag') : t('savedTag')}</span>
    </div>
  `).join('');

  document.querySelectorAll('.plot-pill').forEach((el) => {
    el.addEventListener('click', () => {
      const found = S.plots.find((x) => x.plotId === el.dataset.plot);
      if (found) selectPlot(found);
    });
  });
}

function selectPlot(plot) {
  S.activePlot = plot;
  S.zones = generateZonesForPlot(plot, S.zoneSizeSqm);
  renderPlotSelector();
  renderZones();
}

async function loadPlots() {
  const local = JSON.parse(localStorage.getItem('mannu_plots_v1') || '[]');
  let srv = [];
  try {
    const res = await fetch('/api/farms/local-farmer');
    if (res.ok) {
      const data = await res.json();
      srv = Array.isArray(data) ? data : (data.plots || []);
    }
  } catch { /* offline */ }
  const merged = [...srv];
  for (const p of local) if (!merged.some((x) => x.plotId === p.plotId)) merged.push(p);
  if (!merged.length) merged.push(defaultDemoPlot());
  S.plots = merged;
  selectPlot(S.plots[0]);
}

// ─── Boundary Capture Workflow ──────────────────────────────────────────
function showWfStep(n) {
  $('sec-workflow').classList.toggle('m-hidden', n === 0);
  for (let i = 1; i <= 3; i++) {
    $('wf-step-' + i).classList.toggle('m-hidden', i !== n);
    const chip = $('st-' + i);
    chip.classList.toggle('active', i === n);
    chip.classList.toggle('done', i < n);
  }
  if (n === 2) {
    if (!S.walkMap && window.L) {
      S.walkMap = makeLeaflet('walk-map', [13.3409, 77.1009], 17);
      S.walkLayer = L.layerGroup().addTo(S.walkMap);
      S.walkMap.on('click', (e) => addWalkPoint(e.latlng.lat, e.latlng.lng, 5));
    } else if (!window.L) {
      renderWalkSvgFallback();
    }
    setTimeout(() => S.walkMap && S.walkMap.invalidateSize(), 150);
  }
  if (n === 3) {
    const sqm = calcAreaSqm(S.walkPath);
    const perim = calcPerimeterM(S.walkPath);
    const acres = (sqm / 4046.856).toFixed(3);
    const ha = (sqm / 10000).toFixed(3);
    $('wf-area-acres').textContent = `${acres} ${t('acre')}`;
    $('wf-area-sub').textContent = `${Math.round(sqm)} m² · ${ha} ${t('ha')} · ${t('lblPerim')}: ${Math.round(perim)} m`;
    const warn = $('wf-geom-warn');
    if (hasSelfIntersection(S.walkPath)) {
      warn.textContent = t('selfIntersect'); warn.classList.remove('m-hidden');
    } else if (sqm < 100) {
      warn.textContent = t('tooSmall'); warn.classList.remove('m-hidden');
    } else {
      warn.classList.add('m-hidden');
    }
  }
}

function addWalkPoint(lat, lng, accuracy = 5) {
  S.walkPath.push({ lat, lng, ts: Date.now(), accuracy });
  $('wf-acc').textContent = `${Math.round(accuracy)}m`;
  $('wf-pts').textContent = String(S.walkPath.length);
  $('wf-dist').textContent = `${Math.round(calcPerimeterM(S.walkPath))} m`;
  $('btn-walk-stop').classList.toggle('m-hidden', S.walkPath.length < 3);
  if (S.walkMap && S.walkLayer) {
    S.walkLayer.clearLayers();
    const ll = S.walkPath.map((p) => [p.lat, p.lng]);
    ll.forEach((pt, idx) => L.circleMarker(pt, { radius: 6, color: '#fff', fillColor: idx === 0 ? '#dc2626' : '#0f682b', fillOpacity: 1 }).addTo(S.walkLayer));
    L.polyline(ll, { color: '#1967d2', weight: 3, dashArray: '5,5' }).addTo(S.walkLayer);
    if (ll.length >= 3) L.polygon(ll, { color: '#0f682b', fillColor: '#0f682b', fillOpacity: 0.25 }).addTo(S.walkLayer);
  } else if (!window.L) {
    renderWalkSvgFallback();
  }
}

function renderWalkSvgFallback() {
  const host = $('walk-map');
  if (!host) return;
  const W = 500, H = 260;
  const pts = S.walkPath;
  const poly = pts.map((p) => `${(250 + (p.lng - 77.1009) * 200000).toFixed(1)},${(130 - (p.lat - 13.3409) * 200000).toFixed(1)}`).join(' ');
  host.innerHTML = `<svg id="walk-svg-canvas" viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;background:#1e3526;cursor:crosshair">
    <text x="12" y="22" fill="#d1fae5" font-size="12" font-weight="700">Tap anywhere on canvas to mark boundary corners (Offline Canvas)</text>
    ${pts.length >= 3 ? `<polygon points="${poly}" fill="rgba(34,197,94,0.3)" stroke="#22c55e" stroke-width="2.5"/>` : ''}
    ${pts.length >= 2 ? `<polyline points="${poly}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>` : ''}
    ${pts.map((p) => `<circle cx="${(250 + (p.lng - 77.1009) * 200000).toFixed(1)}" cy="${(130 - (p.lat - 13.3409) * 200000).toFixed(1)}" r="5" fill="#fff" stroke="#0f682b" stroke-width="2"/>`).join('')}
  </svg>`;
  const svg = host.querySelector('#walk-svg-canvas');
  if (svg) {
    svg.addEventListener('click', (e) => {
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      addWalkPoint(13.3409 + (130 - y) / 200000, 77.1009 + (x - 250) / 200000, 5);
    });
  }
}

async function saveNewPlot() {
  if (S.walkPath.length < 3) return alert(t('needThreePts'));
  const sqm = calcAreaSqm(S.walkPath);
  if (sqm < 100) return alert(t('tooSmall'));
  const ring = [...S.walkPath.map((p) => [p.lng, p.lat]), [S.walkPath[0].lng, S.walkPath[0].lat]];
  const plot = {
    plotId: 'plot_' + Date.now(),
    ownerId: 'local-farmer',
    plotName: $('wf-plot-name').value.trim() || (getLang() === 'kn' ? 'ನನ್ನ ಹೊಲ' : 'My Field'),
    selfReportedAcres: $('wf-self-area').value ? Number($('wf-self-area').value) : null,
    boundaryGeometry: { type: 'Polygon', coordinates: [ring] },
    boundaryVersion: 1,
    calculatedArea: { sqm: Math.round(sqm), hectares: +(sqm / 10000).toFixed(3), acres: +(sqm / 4046.856).toFixed(2) },
    areaUnit: 'acres',
    perimeter: Math.round(calcPerimeterM(S.walkPath)),
    boundaryQuality: 'verified'
  };

  try {
    const res = await fetch('/api/farms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plot) });
    if (res.ok) Object.assign(plot, await res.json());
  } catch { /* offline local */ }

  const saved = JSON.parse(localStorage.getItem('mannu_plots_v1') || '[]');
  saved.unshift(plot);
  localStorage.setItem('mannu_plots_v1', JSON.stringify(saved));
  S.plots = [plot, ...S.plots.filter((p) => !p.isSyntheticDemo && p.plotId !== plot.plotId)];
  showWfStep(0);
  selectPlot(plot);
  recordActivityEvent({ eventType: 'plot_mapped', plotId: plot.plotId, sourceModule: 'mapping', eventDetails: `${plot.plotName} (${plot.calculatedArea.acres} acres)` });
}

onReady(() => {
  loadPlots();
  renderLayerUI();

  document.querySelectorAll('#layer-btns .layer-btn').forEach((b) => {
    b.addEventListener('click', () => {
      S.activeLayer = b.dataset.layer;
      sessionStorage.setItem('mannu.active_layer', S.activeLayer);
      renderLayerUI();
      renderZones();
    });
  });

  $('nutrient-param-select').addEventListener('change', (e) => {
    S.nutrientParam = e.target.value;
    renderZones();
  });
  $('twin-crop-select').addEventListener('change', (e) => {
    S.crop = e.target.value;
    renderZones();
  });
  $('btn-resegment').addEventListener('click', () => {
    S.zoneSizeSqm = Math.max(100, Math.min(5000, Number($('twin-zone-size').value) || 900));
    if (S.activePlot) {
      localStorage.removeItem(`mannu_zones_${S.activePlot.plotId}`);
      S.zones = generateZonesForPlot(S.activePlot, S.zoneSizeSqm);
      renderZones();
    }
  });

  $('zm-close').addEventListener('click', () => $('zone-modal').classList.add('m-hidden'));
  $('zm-save-reading').addEventListener('click', saveZoneReading);

  $('btn-new-plot').addEventListener('click', () => { S.walkPath = []; showWfStep(1); });
  $('btn-cancel-wf').addEventListener('click', () => {
    if (S.watchId != null) navigator.geolocation.clearWatch(S.watchId);
    showWfStep(0);
  });
  $('btn-wf-1-next').addEventListener('click', () => showWfStep(2));
  $('btn-walk-start').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    $('btn-walk-start').classList.add('m-hidden');
    $('btn-walk-pause').classList.remove('m-hidden');
    S.paused = false;
    S.watchId = navigator.geolocation.watchPosition((pos) => {
      if (S.paused || pos.coords.accuracy > 50) return;
      addWalkPoint(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      S.walkMap && S.walkMap.panTo([pos.coords.latitude, pos.coords.longitude]);
    }, () => { }, { enableHighAccuracy: true, maximumAge: 1000 });
  });
  $('btn-walk-pause').addEventListener('click', () => { S.paused = true; $('btn-walk-pause').classList.add('m-hidden'); $('btn-walk-resume').classList.remove('m-hidden'); });
  $('btn-walk-resume').addEventListener('click', () => { S.paused = false; $('btn-walk-resume').classList.add('m-hidden'); $('btn-walk-pause').classList.remove('m-hidden'); });
  $('btn-walk-stop').addEventListener('click', () => {
    if (S.watchId != null) navigator.geolocation.clearWatch(S.watchId);
    showWfStep(3);
  });
  $('btn-wf-undo').addEventListener('click', () => {
    S.walkPath.pop();
    if (S.walkPath.length) {
      const last = S.walkPath.pop();
      addWalkPoint(last.lat, last.lng, last.accuracy);
    } else {
      $('wf-pts').textContent = '0';
      $('wf-dist').textContent = '0 m';
      S.walkLayer && S.walkLayer.clearLayers();
    }
  });
  $('btn-wf-sample').addEventListener('click', () => {
    S.walkPath = [];
    [[13.3413, 77.1004], [13.3413, 77.1014], [13.3406, 77.1014], [13.3406, 77.1004]].forEach(([lat, lng]) => addWalkPoint(lat, lng, 4));
    if (S.walkMap) S.walkMap.setView([13.34095, 77.1009], 17);
  });
  $('btn-wf-redo').addEventListener('click', () => { S.walkPath = []; showWfStep(2); });
  $('btn-wf-save').addEventListener('click', saveNewPlot);

  window.switchMapLayer = (layer) => {
    S.activeLayer = layer;
    renderLayerUI();
    renderZones();
  };
});
