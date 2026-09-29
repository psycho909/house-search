export const SEARCHABLE_AREAS: ReadonlyArray<{ city: string; districts: readonly string[] }> = [
  { city: "新北市", districts: ["新莊區"] },
] as const;

export interface SearchQuery {
  city: string;
  district: string;
}

export interface DemoListing {
  id: string;
  title: string;
  city: string;
  district: string;
  totalPrice: number;
  buildingArea: number;
  rooms: number;
  source: "fixture";
}

export interface DemoSearchResponse {
  mode: "demo";
  notice: string;
  listings: DemoListing[];
}

export type SearchQueryResult =
  | { ok: true; query: SearchQuery }
  | { ok: false; reason: "invalid_query" | "unsupported_area" };

export function parseSearchQuery(value: unknown): SearchQueryResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_query" };
  }

  const input = value as Record<string, unknown>;
  if (typeof input.city !== "string" || typeof input.district !== "string") {
    return { ok: false, reason: "invalid_query" };
  }

  const city = input.city.trim();
  const district = input.district.trim();
  if (!city || !district || city.length > 40 || district.length > 40) {
    return { ok: false, reason: "invalid_query" };
  }

  const supported = SEARCHABLE_AREAS.some(
    (area) => area.city === city && area.districts.includes(district),
  );
  if (!supported) return { ok: false, reason: "unsupported_area" };

  return { ok: true, query: { city, district } };
}
