import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/search/route.ts";

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
});

test("unsupported and malformed searches are rejected", async () => {
  const unsupported = await post(JSON.stringify({ city: "臺北市", district: "中正區" }));
  const malformed = await post("{");

  assert.equal(unsupported.status, 400);
  assert.equal(malformed.status, 400);
});

test("search request bodies are capped at 512 bytes", async () => {
  const response = await post(JSON.stringify({ city: "x".repeat(600), district: "新莊區" }));
  assert.equal(response.status, 413);
});
