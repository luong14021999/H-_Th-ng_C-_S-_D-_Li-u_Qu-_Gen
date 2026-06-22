// Forward-geocode the free-text "Nơi phân bố/nuôi/trồng" field into map points
// via OpenStreetMap Nominatim (already used elsewhere in the app for routing /
// reverse-geocoding).
//
// Reality check: OSM has good DISTRICT (huyện) coverage for Thanh Hóa but very
// sparse COMMUNE (xã) coverage, and bare commune names without a district can
// resolve to the wrong province entirely. So we:
//   1. constrain every query to the Thanh Hóa bounding box (bounded=1), which
//      throws out out-of-province false matches; and
//   2. try the precise "commune, district, province" query first, then fall
//      back to "district, province" (reliable) when the commune isn't found.
// Net effect: points resolve at commune precision where OSM has it, else at the
// district centre. Results are cached per query for the session.

export interface GeoPoint {
  name: string;
  district?: string;
  lat: number;
  lng: number;
  /** All place labels that collapsed onto this point (district-level matches). */
  names: string[];
  /** True when this resolved at district granularity (commune not in OSM). */
  approx: boolean;
}

import { THANH_HOA_BOUNDARY } from "@/data/thanhHoaBoundary";

// Thanh Hóa province bounding box: viewbox = lonMin,latMax,lonMax,latMin.
const VIEWBOX = "104.3,20.8,106.2,19.1";
const PROVINCE = "Thanh Hóa, Việt Nam";

// Point-in-polygon (ray casting) against the real province outline — the bbox
// alone lets matches in neighbouring provinces slip through.
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

// query string -> resolved point (or null when nothing was found).
const cache = new Map<string, { lat: number; lng: number } | null>();

// Abbreviations occasionally used for districts in the free text.
const DISTRICT_ALIASES: Record<string, string> = {
  lc: "Lang Chánh",
  nx: "Như Xuân",
  nc: "Nông Cống",
  tx: "Thường Xuân",
};

function normDistrict(d: string): string {
  const t = d.trim();
  return DISTRICT_ALIASES[t.toLowerCase()] ?? t;
}

// Split the field into individual { name, district } entries. The text is a
// comma/semicolon list where a name may carry its district in parentheses, and
// several "name (district)" groups can appear inside one comma-part without a
// separator (e.g. "Bắc Lương (Thọ Xuân) Minh Nghĩa (Nông Cống)").
export function parsePlaces(text: string): { name: string; district?: string }[] {
  if (!text) return [];
  const out: { name: string; district?: string }[] = [];

  for (const rawPart of text.split(/[,;]/)) {
    const part = rawPart.trim();
    if (!part) continue;

    const re = /([^()]+?)\s*\(([^)]*)\)/g;
    let m: RegExpExecArray | null;
    let lastIndex = 0;
    let matched = false;
    while ((m = re.exec(part))) {
      matched = true;
      const name = m[1].trim();
      const district = m[2].trim();
      if (name) out.push({ name, district: district ? normDistrict(district) : undefined });
      lastIndex = re.lastIndex;
    }
    if (!matched) {
      out.push({ name: part });
    } else {
      const trailing = part.slice(lastIndex).trim();
      if (trailing) out.push({ name: trailing });
    }
  }

  // De-dupe by name + district (case-insensitive).
  const seen = new Set<string>();
  return out.filter((p) => {
    const k = `${p.name}|${p.district ?? ""}`.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Ordered candidate queries for one place: most precise first.
function candidates(name: string, district?: string): string[] {
  const clean = name.replace(/^TT\.?\s+/i, "Thị trấn ").trim();
  if (district) {
    return [`${clean}, ${district}, ${PROVINCE}`, `${district}, ${PROVINCE}`];
  }
  return [`${clean}, ${PROVINCE}`];
}

async function fetchNominatim(q: string): Promise<{ lat: number; lng: number } | null> {
  if (cache.has(q)) return cache.get(q)!;
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn` +
      `&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "vi" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      cache.set(q, null);
      return null;
    }
    const arr = await res.json();
    if (Array.isArray(arr) && arr[0]?.lat && arr[0]?.lon) {
      const pt = { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
      cache.set(q, pt);
      return pt;
    }
    cache.set(q, null);
    return null;
  } catch {
    return null; // network/timeout — don't cache, allow a later retry
  }
}

// Try each candidate in order; returns the first hit plus whether it was the
// precise (index 0) match or a district-level fallback.
async function geocodeOne(
  name: string,
  district?: string,
): Promise<{ lat: number; lng: number; approx: boolean } | null> {
  const cands = candidates(name, district);
  for (let i = 0; i < cands.length; i++) {
    const pt = await fetchNominatim(cands[i]);
    if (pt) return { ...pt, approx: i > 0 };
  }
  return null;
}

export interface GeocodeResult {
  points: GeoPoint[];
  total: number; // place names parsed from the field
  resolved: number; // place names that got a coordinate
}

// Spread points that share a coordinate (e.g. several communes that fell back
// to the same district centre) into a small ring so each glow is individually
// visible and the lit count matches the number of places found.
function jitterColocated(points: GeoPoint[]): void {
  const groups = new Map<string, GeoPoint[]>();
  for (const p of points) {
    const k = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    const g = groups.get(k);
    if (g) g.push(p);
    else groups.set(k, [p]);
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const r = 0.0035; // ~350 m
    g.forEach((p, i) => {
      const a = (2 * Math.PI * i) / g.length;
      p.lat += r * Math.sin(a);
      p.lng += (r * Math.cos(a)) / Math.cos((p.lat * Math.PI) / 180);
    });
  }
}

// Geocode every place sequentially (natural rate-limiting that respects
// Nominatim's usage policy). Each place that resolves to a point *inside the
// province* becomes its own glow; out-of-province matches are dropped, and
// points that land on the same coordinate are spread apart. `onProgress`
// reports done/total.
export async function geocodeDistribution(
  text: string,
  onProgress?: (done: number, total: number) => void,
): Promise<GeocodeResult> {
  const places = parsePlaces(text);
  const points: GeoPoint[] = [];
  let done = 0;
  onProgress?.(0, places.length);

  for (const p of places) {
    const r = await geocodeOne(p.name, p.district);
    done++;
    onProgress?.(done, places.length);
    if (!r) continue;
    if (!inProvince(r.lng, r.lat)) continue; // outside Thanh Hóa — false match
    const label = p.district ? `${p.name} (${p.district})` : p.name;
    points.push({ name: p.name, district: p.district, lat: r.lat, lng: r.lng, names: [label], approx: r.approx });
  }

  jitterColocated(points);
  return { points, total: places.length, resolved: points.length };
}
