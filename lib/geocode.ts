// Turn the free-text "Nơi phân bố/nuôi/trồng" field into map points.
//
// Strategy (most accurate first):
//   1. Look up a precomputed local table (data/thanhHoaPlaces.ts) keyed by the
//      normalized "<xã>|<huyện>" — built offline from OpenStreetMap + a one-off
//      Nominatim pass, all validated inside the province. Covers ~86% of the
//      place names currently in the data, commune-precise where OSM has it.
//   2. Fall back to the district (huyện) centre when only the district is known.
//   3. Last resort: live Nominatim (network), constrained to the province bbox.
// Every resulting point is checked against the real province polygon, and points
// landing on the same coordinate are spread apart so each is visible.

import { THANH_HOA_BOUNDARY } from "@/data/thanhHoaBoundary";
import { PLACE_COORDS, DISTRICT_COORDS } from "@/data/thanhHoaPlaces";

export interface GeoPoint {
  name: string;
  district?: string;
  lat: number;
  lng: number;
  names: string[];
  approx: boolean; // true when only resolved to the district centre
}

const VIEWBOX = "104.3,20.8,106.2,19.1";
const PROVINCE = "Thanh Hóa, Việt Nam";

// ── Province polygon test (the bbox alone lets neighbouring provinces slip in) ──
function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}
function inProvince(lng: number, lat: number): boolean {
  const rings = THANH_HOA_BOUNDARY.coordinates as number[][][];
  if (!pointInRing(lng, lat, rings[0])) return false;
  for (let h = 1; h < rings.length; h++) if (pointInRing(lng, lat, rings[h])) return false;
  return true;
}

// ── Parsing (mirrors the offline build so the local-table keys line up) ──
const DISTRICTS = [
  "thanh hoa", "bim son", "sam son", "ba thuoc", "cam thuy", "dong son", "ha trung",
  "hau loc", "hoang hoa", "lang chanh", "muong lat", "nga son", "ngoc lac", "nhu thanh",
  "nhu xuan", "nong cong", "quan hoa", "quan son", "quang xuong", "thach thanh",
  "thieu hoa", "tho xuan", "thuong xuan", "tinh gia", "nghi son", "trieu son",
  "vinh loc", "yen dinh",
];
const ALIAS: Record<string, string> = {
  lc: "lang chanh", nx: "nhu xuan", nc: "nong cong", tx: "thuong xuan",
  ds: "dong son", "c thuy": "cam thuy",
};
// Normalized district key -> proper accented display name.
const DISTRICT_DISPLAY: Record<string, string> = {
  "thanh hoa": "Thanh Hóa", "bim son": "Bỉm Sơn", "sam son": "Sầm Sơn",
  "ba thuoc": "Bá Thước", "cam thuy": "Cẩm Thủy", "dong son": "Đông Sơn",
  "ha trung": "Hà Trung", "hau loc": "Hậu Lộc", "hoang hoa": "Hoằng Hóa",
  "lang chanh": "Lang Chánh", "muong lat": "Mường Lát", "nga son": "Nga Sơn",
  "ngoc lac": "Ngọc Lặc", "nhu thanh": "Như Thanh", "nhu xuan": "Như Xuân",
  "nong cong": "Nông Cống", "quan hoa": "Quan Hóa", "quan son": "Quan Sơn",
  "quang xuong": "Quảng Xương", "thach thanh": "Thạch Thành", "thieu hoa": "Thiệu Hóa",
  "tho xuan": "Thọ Xuân", "thuong xuan": "Thường Xuân", "tinh gia": "Tĩnh Gia",
  "nghi son": "Nghi Sơn", "trieu son": "Triệu Sơn", "vinh loc": "Vĩnh Lộc",
  "yen dinh": "Yên Định",
};

function strip(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}
const PREF = /^(xa\.?|phuong|thi tran|tt\.?|huyen|thanh pho|tp\.?|thon|ban)\s+/;
function norm(s: string): string {
  let t = strip(s);
  for (let i = 0; i < 2; i++) t = t.replace(PREF, "");
  return t.replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}
function findDist(s: string): string {
  let t = strip(s).trim();
  t = ALIAS[t] ?? t;
  return DISTRICTS.find((d) => t.includes(d)) ?? "";
}

// Tidy a place name for display: keep the original diacritics, drop the
// administrative prefix, trim stray punctuation, and capitalize each word.
function cleanDisplay(s: string): string {
  const t = s
    .replace(/\([^)]*\)?/g, " ") // drop any leftover parenthetical (district remnant)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(xã|xa\.?|phường|phuong|thị trấn|thi tran|tt\.?|thôn|thon|bản|ban|huyện|huyen|thành phố|thanh pho|tp\.?)\s+/i, "")
    .replace(/^[–—()[\]\\.,;\s]+|[–—()[\]\\.,;\s]+$/g, "");
  return t
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export interface Place { name: string; district: string; nameDisplay: string; districtDisplay: string }

function splitEntry(raw: string): Place {
  let s = raw.trim();
  let dist = "";
  const par = s.match(/\(([^)]*)\)/);
  if (par && par.index !== undefined) {
    dist = dist || findDist(par[1]);
    s = s.slice(0, par.index) + " " + s.slice(par.index + par[0].length);
  }
  if (/(?:huyen|huyện|tp|thành phố|thanh pho)/i.test(s)) {
    const after = s.replace(/.*?(?:huyen|huyện|tp|thành phố|thanh pho)/i, "");
    dist = dist || findDist(after);
    s = s.replace(/(?:huyện|huyen|tp\.?|thành phố|thanh pho).*$/i, "");
  }
  if (!dist && /[–—-]/.test(s)) {
    const parts = s.split(/\s*[–—-]\s*/);
    if (parts.length >= 2) {
      const d = findDist(parts.slice(1).join(" "));
      if (d) { s = parts[0]; dist = d; }
    }
  }
  let n = norm(s);
  if (!dist) {
    for (const d of DISTRICTS) {
      if (n.endsWith(" " + d) && n.length - d.length > 3) {
        n = n.slice(0, n.length - d.length).trim();
        dist = d;
        // drop the same trailing district words from the display string too
        const wc = d.split(" ").length;
        s = s.trim().split(/\s+/).slice(0, -wc).join(" ");
        break;
      }
    }
  }
  const nameDisplay = cleanDisplay(s);
  if (n.length < 2) { n = ""; dist = dist || "thanh hoa"; }
  return { name: n, district: dist, nameDisplay, districtDisplay: DISTRICT_DISPLAY[dist] ?? "" };
}

export function parsePlaces(text: string): Place[] {
  if (!text) return [];
  const out: Place[] = [];
  const seen = new Set<string>();
  for (const part of text.split(/[,;]/)) {
    const p = part.trim();
    if (!p) continue;
    const e = splitEntry(p);
    if (!e.name) continue;
    const k = `${e.name}|${e.district}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

// ── Resolution ──
function resolveLocal(name: string, district: string): { lat: number; lng: number; approx: boolean } | null {
  const exact = PLACE_COORDS[`${name}|${district}`] ?? PLACE_COORDS[`${name}|`];
  if (exact) return { lat: exact[0], lng: exact[1], approx: false };
  const dc = district ? DISTRICT_COORDS[district] : undefined;
  if (dc) return { lat: dc[0], lng: dc[1], approx: true };
  return null;
}

const cache = new Map<string, { lat: number; lng: number } | null>();
async function fetchNominatim(q: string): Promise<{ lat: number; lng: number } | null> {
  if (cache.has(q)) return cache.get(q)!;
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn` +
      `&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { "Accept-Language": "vi" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) { cache.set(q, null); return null; }
    const arr = await res.json();
    if (Array.isArray(arr) && arr[0]?.lat && arr[0]?.lon) {
      const pt = { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
      cache.set(q, pt);
      return pt;
    }
    cache.set(q, null);
    return null;
  } catch {
    return null;
  }
}
async function geocodeRemote(name: string, district: string): Promise<{ lat: number; lng: number } | null> {
  const queries = district && district !== "thanh hoa"
    ? [`${name}, ${district}, ${PROVINCE}`, `${district}, ${PROVINCE}`]
    : [`${name}, ${PROVINCE}`];
  for (const q of queries) {
    const pt = await fetchNominatim(q);
    if (pt && inProvince(pt.lng, pt.lat)) return pt;
  }
  return null;
}

// Spread points sharing a coordinate into a small ring so each glow shows.
function jitterColocated(points: GeoPoint[]): void {
  const groups = new Map<string, GeoPoint[]>();
  for (const p of points) {
    const k = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    const g = groups.get(k);
    if (g) g.push(p); else groups.set(k, [p]);
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const r = 0.0035;
    g.forEach((p, i) => {
      const a = (2 * Math.PI * i) / g.length;
      p.lat += r * Math.sin(a);
      p.lng += (r * Math.cos(a)) / Math.cos((p.lat * Math.PI) / 180);
    });
  }
}

export interface GeocodeResult {
  points: GeoPoint[];
  total: number;
  resolved: number;
}

export async function geocodeDistribution(
  text: string,
  onProgress?: (done: number, total: number) => void,
): Promise<GeocodeResult> {
  const places = parsePlaces(text);
  const points: GeoPoint[] = [];
  let done = 0;
  onProgress?.(0, places.length);

  for (const p of places) {
    let r = resolveLocal(p.name, p.district);
    if (!r) {
      const remote = await geocodeRemote(p.name, p.district);
      if (remote) r = { ...remote, approx: !p.district ? false : true };
    }
    done++;
    onProgress?.(done, places.length);
    if (!r) continue;
    if (!inProvince(r.lng, r.lat)) continue;
    const label = p.districtDisplay ? `${p.nameDisplay} (${p.districtDisplay})` : p.nameDisplay;
    points.push({ name: p.nameDisplay, district: p.districtDisplay, lat: r.lat, lng: r.lng, names: [label], approx: r.approx });
  }

  jitterColocated(points);
  return { points, total: places.length, resolved: points.length };
}
