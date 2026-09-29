import {
  parseSearchQuery,
  type DemoListing,
  type DemoSearchResponse,
  type SearchQuery,
} from "../domain/search.ts";

const MAX_SEARCH_BODY_BYTES = 512;

const FIXTURE_LISTINGS: DemoListing[] = [
  {
    id: "fixture-1",
    title: "合成示範住宅 A",
    city: "新北市",
    district: "新莊區",
    totalPrice: 1580,
    buildingArea: 32.5,
    rooms: 3,
    source: "fixture",
  },
];

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
  return {
    mode: "demo",
    notice: "這些是固定合成資料，不是真實房源；即時來源尚未啟用。",
    listings: FIXTURE_LISTINGS.filter(
      (listing) => listing.city === query.city && listing.district === query.district,
    ),
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
        : "請選擇有效的縣市與行政區。";
    return Response.json({ error }, { status: 400 });
  }

  return Response.json(searchFixtures(parsed.query));
}
