export const SEARCHABLE_AREAS: ReadonlyArray<{ city: string; districts: readonly string[] }> = [
  { city: "新北市", districts: ["新莊區"] },
] as const;

export interface SearchQuery {
  city: string;
  district: string;
  filters: SearchFilters;
}

export interface SearchRange {
  min?: number;
  max?: number;
}

export interface SearchFilters {
  totalPrice?: SearchRange;
  unitPrice?: SearchRange;
  buildingArea?: SearchRange;
  buildingAge?: SearchRange;
  rooms?: number[];
  parking?: "any" | "required" | "none";
  keyword?: string;
}

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, " ").trim().toLowerCase();
}

export interface DemoListing {
  id: string;
  title: string;
  city: string;
  district: string;
  totalPrice?: number;
  unitPrice?: number;
  buildingArea?: number;
  rooms?: number;
  source: "fixture";
  sourceId: string;
  sourceListingId: string;
  sourceLabel: string;
  url: string;
  community?: string;
  address?: string;
  floor?: number;
  buildingAge?: number;
  hasParking?: boolean;
  updatedAt?: string;
  possibleDuplicate?: boolean;
}

export interface DemoSearchResponse {
  mode: "demo";
  notice: string;
  listings: DemoListing[];
  excludedBecauseUnknown: number;
}

export type SearchQueryResult =
  | { ok: true; query: SearchQuery }
  | { ok: false; reason: "invalid_query" | "invalid_filters" | "unsupported_area" };

type ParsedRange = { ok: true; range?: SearchRange } | { ok: false };

function parseRange(value: unknown): ParsedRange {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false };
  const input = value as Record<string, unknown>;
  const keys = Object.keys(input);
  if (keys.some((key) => key !== "min" && key !== "max")) return { ok: false };

  const hasMin = Object.hasOwn(input, "min");
  const hasMax = Object.hasOwn(input, "max");
  if (!hasMin && !hasMax) return { ok: true };

  const min = input.min;
  const max = input.max;
  if (
    (hasMin && (typeof min !== "number" || !Number.isFinite(min) || min < 0 || min > Number.MAX_SAFE_INTEGER)) ||
    (hasMax && (typeof max !== "number" || !Number.isFinite(max) || max < 0 || max > Number.MAX_SAFE_INTEGER)) ||
    (hasMin && hasMax && (min as number) > (max as number))
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    range: {
      ...(hasMin ? { min: min as number } : {}),
      ...(hasMax ? { max: max as number } : {}),
    },
  };
}

function parseFilters(value: unknown): { ok: true; filters: SearchFilters } | { ok: false } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false };
  const input = value as Record<string, unknown>;
  if (
    Object.keys(input).some(
      (key) =>
        key !== "totalPrice" &&
        key !== "unitPrice" &&
        key !== "buildingArea" &&
        key !== "buildingAge" &&
        key !== "rooms" &&
        key !== "parking" &&
        key !== "keyword",
    )
  ) {
    return { ok: false };
  }

  const parsedTotalPrice = Object.hasOwn(input, "totalPrice")
    ? parseRange(input.totalPrice)
    : { ok: true as const };
  if (!parsedTotalPrice.ok) return { ok: false };

  const parsedUnitPrice = Object.hasOwn(input, "unitPrice")
    ? parseRange(input.unitPrice)
    : { ok: true as const };
  if (!parsedUnitPrice.ok) return { ok: false };

  const parsedBuildingArea = Object.hasOwn(input, "buildingArea")
    ? parseRange(input.buildingArea)
    : { ok: true as const };
  if (!parsedBuildingArea.ok) return { ok: false };

  const parsedAge = Object.hasOwn(input, "buildingAge")
    ? parseRange(input.buildingAge)
    : { ok: true as const };
  if (!parsedAge.ok) return { ok: false };

  const rooms = input.rooms;
  if (
    Object.hasOwn(input, "rooms") &&
    (!Array.isArray(rooms) || rooms.some((room) => typeof room !== "number" || !Number.isInteger(room) || room < 0))
  ) {
    return { ok: false };
  }

  const parking = input.parking;
  if (
    Object.hasOwn(input, "parking") &&
    parking !== "any" && parking !== "required" && parking !== "none"
  ) {
    return { ok: false };
  }

  if (Object.hasOwn(input, "keyword") && typeof input.keyword !== "string") return { ok: false };
  const keyword = typeof input.keyword === "string" ? normalizeSearchText(input.keyword) : "";

  return {
    ok: true,
    filters: {
      ...(parsedTotalPrice.range ? { totalPrice: parsedTotalPrice.range } : {}),
      ...(parsedUnitPrice.range ? { unitPrice: parsedUnitPrice.range } : {}),
      ...(parsedBuildingArea.range ? { buildingArea: parsedBuildingArea.range } : {}),
      ...(parsedAge.range ? { buildingAge: parsedAge.range } : {}),
      ...(Array.isArray(rooms) && rooms.length ? { rooms: [...new Set(rooms as number[])] } : {}),
      ...(Object.hasOwn(input, "parking") ? { parking: parking as SearchFilters["parking"] } : {}),
      ...(keyword ? { keyword } : {}),
    },
  };
}

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

  const parsedFilters = parseFilters(input.filters === undefined ? {} : input.filters);
  if (!parsedFilters.ok) return { ok: false, reason: "invalid_filters" };

  const supported = SEARCHABLE_AREAS.some(
    (area) => area.city === city && area.districts.includes(district),
  );
  if (!supported) return { ok: false, reason: "unsupported_area" };

  return { ok: true, query: { city, district, filters: parsedFilters.filters } };
}
