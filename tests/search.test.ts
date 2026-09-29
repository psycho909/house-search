import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/search/route.ts";
import { deriveSearchResultState, type SearchSourceStatus } from "../src/app/search-status.ts";

function post(body: string) {
  return POST(new Request("http://localhost/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }));
}

test("supported area returns a clearly marked synthetic fixture", async () => {
  const response = await post(JSON.stringify({ city: "新北市", district: "新莊區" }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.mode, "demo");
  assert.match(result.notice, /不是.*真實房源/);
  assert.equal(result.listings[0].source, "fixture");
  assert.equal(result.listings[0].city, "新北市");
  assert.equal(result.listings[0].district, "新莊區");
  assert.equal(result.resultState, "results");
  assert.deepEqual(result.sourceStatuses, [
    { id: "fixture", label: "合成示範資料", status: "success", matchedCount: result.listings.length },
    { id: "591", label: "591", status: "disabled" },
    { id: "sinyi", label: "信義", status: "disabled" },
    { id: "yungching", label: "永慶", status: "disabled" },
  ]);
});

test("successful empty fixture response is classified as no_results", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { totalPrice: { min: 2000 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings, []);
  assert.equal(result.resultState, "no_results");
  assert.equal(result.sourceStatuses[0].status, "success");
  assert.equal(result.sourceStatuses[0].matchedCount, 0);
  assert.deepEqual(result.sourceStatuses.slice(1).map((source: { status: string }) => source.status), [
    "disabled",
    "disabled",
    "disabled",
  ]);
});

test("unsupported and malformed searches are rejected", async () => {
  const unsupported = await post(JSON.stringify({ city: "臺北市", district: "中正區" }));
  const malformed = await post("{");

  assert.equal(unsupported.status, 400);
  assert.equal(malformed.status, 400);
  assert.deepEqual(await unsupported.json(), { error: "示範版目前僅支援新北市／新莊區。" });
  assert.deepEqual(await malformed.json(), { error: "搜尋資料格式無效。" });
});

test("search request bodies are capped at 512 bytes", async () => {
  const response = await post(JSON.stringify({ city: "x".repeat(600), district: "新莊區" }));
  assert.equal(response.status, 413);
});

test("active building age range excludes listings with unknown age", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { buildingAge: { min: 0, max: 40 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.excludedBecauseUnknown, 1);
  assert.ok(result.listings.every((listing: { buildingAge?: number }) => typeof listing.buildingAge === "number"));
});

test("parking none matches explicit false and counts unknown parking", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { parking: "none" },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), ["fixture-3"]);
  assert.ok(result.listings.every((listing: { hasParking?: boolean }) => listing.hasParking === false));
  assert.equal(result.excludedBecauseUnknown, 1);
});

test("keyword matches a community after NFKC, whitespace, and case normalization", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { keyword: "  ＭＡＰＬＥ　ＣＯＵＲＴ " },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), ["fixture-3"]);
});

test("same-source listing ID keeps only its newest verified fixture", async () => {
  const response = await post(JSON.stringify({ city: "新北市", district: "新莊區", filters: {} }));
  const result = await response.json();
  const sourceListings = result.listings.filter(
    (listing: { sourceId: string }) => listing.sourceId === "synthetic-source-a",
  );

  assert.deepEqual(sourceListings.map((listing: { id: string }) => listing.id), ["fixture-1"]);
  assert.equal(sourceListings[0].updatedAt, "2026-09-28T12:00:00.000Z");
});

test("likely cross-source duplicate keeps both synthetic listing URLs", async () => {
  const response = await post(JSON.stringify({ city: "新北市", district: "新莊區", filters: {} }));
  const result = await response.json();
  const possibleDuplicates = result.listings.filter(
    (listing: { possibleDuplicate?: boolean }) => listing.possibleDuplicate === true,
  );

  assert.deepEqual(possibleDuplicates.map((listing: { id: string }) => listing.id), ["fixture-1", "fixture-2"]);
  assert.deepEqual(possibleDuplicates.map((listing: { url: string }) => listing.url), [
    "https://source-a.synthetic.invalid/listing/a-001",
    "https://source-b.synthetic.invalid/listing/b-001",
  ]);
  assert.ok(possibleDuplicates.every((listing: { sourceLabel: string }) => listing.sourceLabel.includes("合成")));
});

test("total price range includes both endpoints", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { totalPrice: { min: 1580, max: 1660 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), ["fixture-1", "fixture-2"]);
});

test("building area range includes exact endpoints", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { buildingArea: { min: 32.5, max: 32.5 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), ["fixture-1"]);
});

test("unit price range includes both endpoints and excludes missing values", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { unitPrice: { min: 48.6, max: 50.4 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), ["fixture-1", "fixture-3"]);
  assert.equal(result.excludedBecauseUnknown, 1);
});

test("unknown count only includes listings that could otherwise match", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: {
      keyword: "住宅 C",
      totalPrice: { min: 2000 },
      buildingAge: { min: 0 },
    },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings, []);
  assert.equal(result.excludedBecauseUnknown, 0);
});

test("room options use OR matching", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { rooms: [2, 3] },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result.listings.map((listing: { id: string }) => listing.id), [
    "fixture-1",
    "fixture-2",
    "fixture-3",
  ]);
  assert.equal(result.excludedBecauseUnknown, 1);
});

test("active total price range excludes a missing price and counts it", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { totalPrice: { min: 0, max: 2000 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.excludedBecauseUnknown, 1);
  assert.ok(result.listings.every((listing: { totalPrice?: number }) => typeof listing.totalPrice === "number"));
});

test("same-source canonical URL keeps the newest fixture despite a changed source ID", async () => {
  const response = await post(JSON.stringify({ city: "新北市", district: "新莊區", filters: {} }));
  const result = await response.json();
  const sourceListings = result.listings.filter(
    (listing: { sourceId: string }) => listing.sourceId === "synthetic-source-d",
  );

  assert.deepEqual(sourceListings.map((listing: { id: string }) => listing.id), ["fixture-4"]);
  assert.equal(sourceListings[0].sourceListingId, "d-new");
  assert.equal(sourceListings[0].url, "https://SOURCE-D.synthetic.invalid/listing/d-001/");
  assert.equal(sourceListings[0].updatedAt, "2026-09-25T12:00:00.000Z");
});

test("active building area range excludes a missing area and counts it", async () => {
  const response = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { buildingArea: { min: 0 } },
  }));
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.excludedBecauseUnknown, 1);
  assert.ok(result.listings.every((listing: { buildingArea?: number }) => typeof listing.buildingArea === "number"));
});

test("parking required excludes unknown while any leaves parking unfiltered", async () => {
  const requiredResponse = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { parking: "required" },
  }));
  const required = await requiredResponse.json();
  const anyResponse = await post(JSON.stringify({
    city: "新北市",
    district: "新莊區",
    filters: { parking: "any" },
  }));
  const any = await anyResponse.json();

  assert.equal(requiredResponse.status, 200);
  assert.deepEqual(required.listings.map((listing: { id: string }) => listing.id), [
    "fixture-1",
    "fixture-4",
    "fixture-5",
  ]);
  assert.equal(required.excludedBecauseUnknown, 1);
  assert.equal(anyResponse.status, 200);
  assert.deepEqual(any.listings.map((listing: { id: string }) => listing.id), [
    "fixture-1",
    "fixture-2",
    "fixture-3",
    "fixture-4",
    "fixture-5",
  ]);
  assert.equal(any.excludedBecauseUnknown, 0);
});

test("invalid ranges, room options, and unknown filters are rejected", async () => {
  const invalidBodies = [
    { totalPrice: { min: 2000, max: 1000 } },
    { unitPrice: { max: Number.MAX_SAFE_INTEGER + 1 } },
    { rooms: [2.5] },
    { unsupported: true },
  ];

  for (const filters of invalidBodies) {
    const response = await post(JSON.stringify({ city: "新北市", district: "新莊區", filters }));
    assert.equal(response.status, 400);
  }
});

test("empty or disabled sources are classified as no_sources", () => {
  assert.equal(deriveSearchResultState([], 0), "no_sources");
  assert.equal(deriveSearchResultState([
    { id: "591", label: "591", status: "disabled" },
    { id: "sinyi", label: "信義", status: "disabled" },
  ], 0), "no_sources");
});

test("all active timeouts are classified as timeout", () => {
  assert.equal(deriveSearchResultState([
    { id: "fixture", label: "合成示範資料", status: "timeout" },
    { id: "591", label: "591", status: "timeout" },
    { id: "sinyi", label: "信義", status: "disabled" },
  ], 0), "timeout");
});

test("errors without a successful source are classified as all_failed", () => {
  assert.equal(deriveSearchResultState([
    { id: "fixture", label: "合成示範資料", status: "failed" },
    { id: "591", label: "591", status: "timeout" },
  ], 0), "all_failed");
});

test("a successful source mixed with an error is classified as partial", () => {
  const statuses: SearchSourceStatus[] = [
    { id: "fixture", label: "合成示範資料", status: "success", matchedCount: 2 },
    { id: "591", label: "591", status: "failed" },
  ];

  assert.equal(deriveSearchResultState(statuses, 2), "partial");
});

test("successful sources with no listings are classified as no_results", () => {
  assert.equal(deriveSearchResultState([
    { id: "fixture", label: "合成示範資料", status: "success", matchedCount: 0 },
  ], 0), "no_results");
});

test("successful sources with listings are classified as results", () => {
  assert.equal(deriveSearchResultState([
    { id: "fixture", label: "合成示範資料", status: "success", matchedCount: 1 },
  ], 1), "results");
});
