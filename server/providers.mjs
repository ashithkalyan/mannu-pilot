// Open data providers. Every call is optional: the app works offline without them.
// NOTE: written from the public API docs; not exercised against the live services from the build sandbox (network restricted). Tested with mocked responses.
export async function fetchWeather({ lat, lon, fetchImpl = fetch, days = 3 }) {
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&forecast_days=${days}&timezone=auto`;
  const r = await fetchImpl(u, { signal: AbortSignal.timeout(6000) }); if (!r.ok) throw new Error('weather_http_' + r.status);
  const j = await r.json(); return { dailyPrecipMm: j.daily?.precipitation_sum || [], dates: j.daily?.time || [], source: 'Open-Meteo' };
}
// ISRIC SoilGrids v2 topsoil context. Used for CONTEXT FLAGS only (never changes a dose): coarse 250 m model, high uncertainty.
export async function fetchSoilGrids({ lat, lon, fetchImpl = fetch }) {
  const props = ['phh2o', 'nitrogen', 'soc', 'clay', 'sand'];
  const u = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}` + props.map((p) => `&property=${p}`).join('') + '&depth=0-5cm&depth=5-15cm&value=mean';
  const r = await fetchImpl(u, { signal: AbortSignal.timeout(12000) }); if (!r.ok) throw new Error('soilgrids_http_' + r.status);
  const j = await r.json(); const out = { source: 'ISRIC SoilGrids 2.0 (250 m model)' };
  for (const layer of j.properties?.layers || []) {
    const f = layer.unit_measure?.d_factor || 1; const vals = (layer.depths || []).map((d) => d.values?.mean).filter((v) => v != null);
    if (vals.length) out[layer.name] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / f) * 100) / 100; // converted to conventional units (pH, g/kg, ...)
  }
  return out;
}
