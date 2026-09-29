import {
  normalizeSearchText,
  parseSearchQuery,
  type DemoListing,
  type DemoSearchResponse,
  type SearchQuery,
  type SearchRange,
} from "../domain/search.ts";

const MAX_SEARCH_BODY_BYTES = 512;

const FIXTURE_LISTINGS: DemoListing[] = [
  {
    id: "fixture-1-old",
    title: "合成示範住宅 A 舊擷取",
    city: "新北市",
    district: "新莊區",
    totalPrice: 1540,
    unitPrice: 48.5,
    buildingArea: 32.3,
    rooms: 3,
    source: "fixture",
    sourceId: "synthetic-source-a",
    sourceListingId: "a-001",
    sourceLabel: "合成來源 A",
    url: "https://source-a.synthetic.invalid/listing/a-001",
    buildingAge: 7,
    hasParking: true,
    updatedAt: "2026-09-27T12:00:00.000Z",
  },
  {
    id: "fixture-1",
    title: "合成示範住宅 A",
    city: "新北市",
    district: "新莊區",
    totalPrice: 1580,
    unitPrice: 48.6,
    buildingArea: 32.5,
    rooms: 3,
    source: "fixture",
    sourceId: "synthetic-source-a",
    sourceListingId: "a-001",
    sourceLabel: "合成來源 A",
    url: "https://source-a.synthetic.invalid/listing/a-001",
    buildingAge: 6,
    hasParking: true,
    updatedAt: "2026-09-28T12:00:00.000Z",
    community: "合成雲河社區",
    floor: 12,
  },
  {
    id: "fixture-2",
    title: "合成示範住宅 B",
    city: "新北市",
    district: "新莊區",
    totalPrice: 1660,
    unitPrice: 50.6,
    buildingArea: 32.8,
    rooms: 3,
    source: "fixture",
    sourceId: "synthetic-source-b",
    sourceListingId: "b-001",
    sourceLabel: "合成來源 B",
    url: "https://source-b.synthetic.invalid/listing/b-001",
    buildingAge: 7,
    community: "合成雲河社區",
    floor: 12,
  },
  {
    id: "fixture-3",
    title: "合成示範住宅 C",
    city: "新北市",
    district: "新莊區",
    totalPrice: 1180,
    unitPrice: 50.4,
    buildingArea: 23.4,
    rooms: 2,
    source: "fixture",
    sourceId: "synthetic-source-c",
    sourceListingId: "c-001",
    sourceLabel: "合成來源 C",
    url: "https://source-c.synthetic.invalid/listing/c-001",
    hasParking: false,
    community: "Maple Court",
  },
  {
    id: "fixture-4-old",
    title: "合成示範住宅 D 舊擷取",
    city: "新北市",
    district: "新莊區",
    buildingArea: 22,
    unitPrice: 34,
    rooms: 4,
    source: "fixture",
    sourceId: "synthetic-source-d",
    sourceListingId: "d-old",
    sourceLabel: "合成來源 D",
    url: "https://source-d.synthetic.invalid/listing/d-001",
    buildingAge: 12,
    hasParking: true,
    community: "合成園景社區",
    floor: 5,
    updatedAt: "2026-09-24T12:00:00.000Z",
  },
  {
    id: "fixture-4",
    title: "合成示範住宅 D",
    city: "新北市",
    district: "新莊區",
    buildingArea: 22,
    unitPrice: 36,
    rooms: 4,
    source: "fixture",
    sourceId: "synthetic-source-d",
    sourceListingId: "d-new",
    sourceLabel: "合成來源 D",
    url: "https://SOURCE-D.synthetic.invalid/listing/d-001/",
    buildingAge: 12,
    hasParking: true,
    community: "合成園景社區",
    floor: 5,
    updatedAt: "2026-09-25T12:00:00.000Z",
  },
  {
    id: "fixture-5",
    title: "合成示範住宅 E",
    city: "新北市",
    district: "新莊區",
    totalPrice: 980,
    source: "fixture",
    sourceId: "synthetic-source-e",
    sourceListingId: "e-001",
    sourceLabel: "合成來源 E",
    url: "https://source-e.synthetic.invalid/listing/e-001",
    buildingAge: 33,
    hasParking: true,
    community: "合成溪岸社區",
    floor: 3,
  },
];

function canonicalListingUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
  url.searchParams.sort();
  return url.toString();
}

function exactListingKeys(listing: DemoListing): [string, string] {
  return [
    JSON.stringify(["id", listing.sourceId, listing.sourceListingId]),
    JSON.stringify(["url", listing.sourceId, canonicalListingUrl(listing.url)]),
  ];
}

function newerListing(current: DemoListing, candidate: DemoListing): DemoListing {
  const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : Number.NaN;
  const candidateTime = candidate.updatedAt ? Date.parse(candidate.updatedAt) : Number.NaN;
  return Number.isFinite(candidateTime) &&
    (!Number.isFinite(currentTime) || candidateTime > currentTime)
    ? candidate
    : current;
}

function deduplicateListings(listings: DemoListing[]): DemoListing[] {
  const result: DemoListing[] = [];
  const indexByKey = new Map<string, number>();

  for (const listing of listings) {
    const keys = exactListingKeys(listing);
    const existingIndex = keys.map((key) => indexByKey.get(key)).find((index) => index !== undefined);
    if (existingIndex === undefined) {
      const index = result.push(listing) - 1;
      for (const key of keys) indexByKey.set(key, index);
      continue;
    }

    const latest = newerListing(result[existingIndex], listing);
    result[existingIndex] = latest;
    for (const key of exactListingKeys(latest)) indexByKey.set(key, existingIndex);
  }

  return result;
}

function isLikelySameProperty(left: DemoListing, right: DemoListing): boolean {
  const sameCommunity = left.community !== undefined && right.community !== undefined &&
    normalizeSearchText(left.community) === normalizeSearchText(right.community);
  const sameAddress = left.address !== undefined && right.address !== undefined &&
    normalizeSearchText(left.address) === normalizeSearchText(right.address);

  return left.sourceId !== right.sourceId &&
    left.city === right.city &&
    left.district === right.district &&
    (sameCommunity || sameAddress) &&
    left.floor !== undefined &&
    left.floor === right.floor &&
    left.rooms !== undefined &&
    right.rooms !== undefined &&
    left.rooms === right.rooms &&
    left.buildingArea !== undefined &&
    right.buildingArea !== undefined &&
    Math.abs(left.buildingArea - right.buildingArea) <= 0.5;
}

function markPossibleDuplicates(listings: DemoListing[]): DemoListing[] {
  const duplicateIndexes = new Set<number>();
  // ponytail: O(n²) for fixed fixtures; index by city, district, and location evidence if the set grows.
  for (let left = 0; left < listings.length; left += 1) {
    for (let right = left + 1; right < listings.length; right += 1) {
      if (isLikelySameProperty(listings[left], listings[right])) {
        duplicateIndexes.add(left);
        duplicateIndexes.add(right);
      }
    }
  }

  return listings.map((listing, index) =>
    duplicateIndexes.has(index) ? { ...listing, possibleDuplicate: true } : listing,
  );
}

function checkRange(value: number | undefined, range: SearchRange | undefined): "match" | "mismatch" | "unknown" {
  if (!range) return "match";
  if (typeof value !== "number" || !Number.isFinite(value)) return "unknown";
  return (range.min === undefined || value >= range.min) &&
    (range.max === undefined || value <= range.max)
    ? "match"
    : "mismatch";
}

type ReadBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 };

async function readSearchBody(request: Request): Promise<ReadBodyResult> {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, status: 400 };

  const bytes = new Uint8Array(MAX_SEARCH_BODY_BYTES);
  let length = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.byteLength > MAX_SEARCH_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      bytes.set(value, length);
      length += value.byteLength;
    }

    if (!length) return { ok: false, status: 400 };
    return {
      ok: true,
      value: JSON.parse(new TextDecoder().decode(bytes.subarray(0, length))),
    };
  } catch {
    return { ok: false, status: 400 };
  }
}

function searchFixtures(query: SearchQuery): DemoSearchResponse {
  let excludedBecauseUnknown = 0;
  const ageRange = query.filters.buildingAge;
  const priceRange = query.filters.totalPrice;
  const unitPriceRange = query.filters.unitPrice;
  const areaRange = query.filters.buildingArea;
  const rooms = query.filters.rooms;
  const parking = query.filters.parking;
  const keyword = query.filters.keyword;
  const filteredListings = deduplicateListings(FIXTURE_LISTINGS).filter(
    (listing) => listing.city === query.city && listing.district === query.district,
  ).filter((listing) => {
    let unknown = false;
    let matches = true;

    const rangeResults = [
      checkRange(listing.totalPrice, priceRange),
      checkRange(listing.unitPrice, unitPriceRange),
      checkRange(listing.buildingArea, areaRange),
      checkRange(listing.buildingAge, ageRange),
    ];
    if (rangeResults.includes("unknown")) unknown = true;
    if (rangeResults.includes("mismatch")) matches = false;

    if (rooms?.length) {
      if (listing.rooms === undefined) unknown = true;
      else if (!rooms.includes(listing.rooms)) matches = false;
    }

    if (parking && parking !== "any") {
      if (listing.hasParking === undefined) {
        unknown = true;
      } else if (
        (parking === "required" && listing.hasParking !== true) ||
        (parking === "none" && listing.hasParking !== false)
      ) {
        matches = false;
      }
    }

    if (
      keyword &&
      ![listing.title, listing.community, listing.address].some(
        (field) => typeof field === "string" && normalizeSearchText(field).includes(keyword),
      )
    ) {
      matches = false;
    }

    if (unknown && matches) excludedBecauseUnknown += 1;
    return matches && !unknown;
  });
  const listings = markPossibleDuplicates(filteredListings);

  return {
    mode: "demo",
    notice: "這些是固定合成資料，不是真實房源；即時來源尚未啟用。",
    listings,
    excludedBecauseUnknown,
  };
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return Response.json({ error: "請以 JSON 提交搜尋條件。" }, { status: 415 });
  }

  const body = await readSearchBody(request);
  if (!body.ok) {
    const error = body.status === 413 ? "搜尋條件超過 512 bytes。" : "搜尋資料格式無效。";
    return Response.json({ error }, { status: body.status });
  }

  const parsed = parseSearchQuery(body.value);
  if (!parsed.ok) {
    const error =
      parsed.reason === "unsupported_area"
        ? "示範版目前僅支援新北市／新莊區。"
        : parsed.reason === "invalid_filters"
          ? "篩選條件格式無效。"
        : "請選擇有效的縣市與行政區。";
    return Response.json({ error }, { status: 400 });
  }

  return Response.json(searchFixtures(parsed.query));
}
