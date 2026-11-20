// Mannu Reader MR-1: OPTIONAL reference firmware (ESP32 + ADS1115 + DS18B20). NOT TESTED ON HARDWARE - bench-test before any field use.
// Measures a nitrate ion-selective electrode in a 1:5 soil:water extract (10 g soil + 50 mL water). Two-point calibration on EVERY use.
// Front end assumption: electrometer buffer output biased to mid-rail so the ADS1115 (single-ended, 0-4.096 V) sees a positive voltage; the
// 2-point calibration absorbs the constant offset. Serial commands (115200): cal1 <mgL>, cal2 <mgL>, read
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_ADS1X15.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Preferences.h>
#include <math.h>

const char* WIFI_SSID = "YOUR_WIFI";  const char* WIFI_PASS = "YOUR_PASS";
const char* SERVER = "https://YOUR-CLOUD-RUN-URL/api/readings";
const char* DEVICE_KEY = "YOUR_DEVICE_KEY";  const char* PLOT_ID = "plot-001";  const char* DEVICE_ID = "mr1-001";
const int ONE_WIRE_PIN = 4, ISE_CH = 0;

Adafruit_ADS1115 ads; OneWire ow(ONE_WIRE_PIN); DallasTemperature temps(&ow); Preferences prefs;
float slopeMv = 0, interceptMv = 0, calTempC = 25; bool calOk = false, have1 = false; float cal1Mv = 0, cal1C = 0;

float tempC() { temps.requestTemperatures(); float t = temps.getTempCByIndex(0); return (t > -50 && t < 80) ? t : 25.0f; }
float readMv(int n = 20) { long s = 0; for (int i = 0; i < n; i++) { s += ads.readADC_SingleEnded(ISE_CH); delay(25); } return (s / (float)n) * 0.125f; } // GAIN_ONE: 0.125 mV/LSB
float nernst(float t) { return 0.1984f * (t + 273.15f); }  // mV/decade (59.16 at 25 C)

void calPoint(int which, float conc) {
  float mv = readMv(40), t = tempC();
  if (which == 1) { cal1Mv = mv; cal1C = conc; have1 = true; Serial.printf("cal1 mV=%.1f at %.2f mg/L\n", mv, conc); return; }
  if (!have1 || conc <= 0 || cal1C <= 0 || conc == cal1C) { Serial.println("CAL FAIL: need cal1 first and two different standards"); return; }
  float slope = (mv - cal1Mv) / (log10f(conc) - log10f(cal1C)); float mag = fabsf(slope), ideal = nernst(t);
  if (slope >= 0 || mag < 0.85f * ideal || mag > 1.05f * ideal) { calOk = false; Serial.printf("CAL FAIL: slope %.1f mV/dec (expected about -%.1f). Check electrode, standards, temperature.\n", slope, ideal); return; }
  slopeMv = slope; interceptMv = mv - slope * log10f(conc); calTempC = t; calOk = true;
  prefs.putFloat("slope", slopeMv); prefs.putFloat("icpt", interceptMv); prefs.putFloat("tcal", calTempC);
  Serial.printf("CAL OK: slope %.1f mV/dec, intercept %.1f mV, T %.1f C\n", slope, interceptMv, t);
}
void postReadings() {
  if (!calOk) { Serial.println("Calibrate first (cal1/cal2)."); return; }
  String body = String("{\"plotId\":\"") + PLOT_ID + "\",\"readings\":["; 
  for (int i = 0; i < 5; i++) {
    float t = tempC(), mv = readMv(20), slopeT = slopeMv * ((t + 273.15f) / (calTempC + 273.15f));
    float conc = powf(10.0f, (mv - interceptMv) / slopeT);               // mg/L NO3-N in the 1:5 extract
    if (i) body += ","; body += String("{\"no3_n_mgl_extract\":") + String(conc, 2) + ",\"temp_c\":" + String(t, 1) + ",\"deviceId\":\"" + DEVICE_ID + "\"}";
    Serial.printf("extract NO3-N %.2f mg/L  (%.1f mg/kg soil)\n", conc, conc * 5.0f); delay(1000);
  }
  body += "]}";
  WiFiClientSecure c; c.setInsecure();  // TODO production: pin the Cloud Run certificate / use a CA bundle
  HTTPClient h; h.begin(c, SERVER); h.addHeader("Content-Type", "application/json"); h.addHeader("x-device-key", DEVICE_KEY);
  int code = h.POST(body); Serial.printf("POST -> %d %s\n", code, h.getString().c_str()); h.end();
}
void setup() {
  Serial.begin(115200); ads.setGain(GAIN_ONE); ads.begin(); temps.begin(); prefs.begin("mannu", false);
  slopeMv = prefs.getFloat("slope", 0); interceptMv = prefs.getFloat("icpt", 0); calTempC = prefs.getFloat("tcal", 25); calOk = slopeMv != 0;
  WiFi.begin(WIFI_SSID, WIFI_PASS); Serial.println("Mannu Reader ready. Calibrate on EVERY use: cal1 <mg/L>, cal2 <mg/L>, then read.");
}
void loop() {
  if (!Serial.available()) return; String cmd = Serial.readStringUntil('\n'); cmd.trim();
  if (cmd.startsWith("cal1 ")) calPoint(1, cmd.substring(5).toFloat()); else if (cmd.startsWith("cal2 ")) calPoint(2, cmd.substring(5).toFloat()); else if (cmd == "read") postReadings();
}
