"use client";

import { useState, type FormEvent } from "react";
import { SEARCHABLE_AREAS, type DemoSearchResponse } from "../domain/search.ts";

export default function Home() {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [result, setResult] = useState<DemoSearchResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const districts = SEARCHABLE_AREAS.find((area) => area.city === city)?.districts ?? [];

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, district }),
      });
      const payload = (await response.json()) as DemoSearchResponse | { error?: string };
      if (!response.ok || !("listings" in payload)) {
        throw new Error("error" in payload ? payload.error : "搜尋暫時無法完成。");
      }
      setResult(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "搜尋暫時無法完成。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] px-4 py-8 text-[#302826] sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-[#968075] pb-6 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[32px]">跨站找房</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[#685750]">
          用同一組條件整理候選房源。這個版本以固定示範資料展示搜尋流程。
        </p>
      </header>

      <section aria-labelledby="search-heading" className="rounded-lg border border-[#968075] bg-[#fcfaf8] p-5 sm:p-7">
        <h2 id="search-heading" className="text-xl font-semibold">搜尋條件</h2>
        <p className="mt-2 text-sm leading-6 text-[#685750]">
          示範版目前支援新北市／新莊區。591、信義與永慶即時來源尚未啟用。
        </p>

        <form className="mt-6 grid gap-4 sm:grid-cols-2 sm:items-end" onSubmit={search}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="city">縣市</label>
            <select
              id="city"
              className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49]"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                setDistrict("");
                setResult(null);
              }}
              required
              disabled={loading}
            >
              <option value="">選擇縣市</option>
              {SEARCHABLE_AREAS.map((area) => <option key={area.city} value={area.city}>{area.city}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="district">行政區</label>
            <select
              id="district"
              className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:cursor-not-allowed disabled:bg-[#f1ebe7]"
              value={district}
              onChange={(event) => {
                setDistrict(event.target.value);
                setResult(null);
              }}
              required
              disabled={!city || loading}
            >
              <option value="">選擇行政區</option>
              {districts.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          <button
            className="min-h-11 rounded-lg bg-[#6e3b49] px-5 font-medium text-white hover:bg-[#542b37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#302826] disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-start"
            type="submit"
            disabled={loading}
          >
            {loading ? "搜尋中…" : "搜尋示範資料"}
          </button>
        </form>
      </section>

      <section aria-labelledby="results-heading" aria-live="polite" aria-busy={loading} className="mt-8 sm:mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#968075] pb-3">
          <h2 id="results-heading" className="text-xl font-semibold">搜尋結果</h2>
          {result && <p className="text-sm text-[#685750]">本次示範資料：{result.listings.length} 筆</p>}
        </div>

        {loading && <p className="py-6 text-[#685750]">正在載入固定示範資料…</p>}
        {error && <p className="py-6 font-medium text-[#9a421f]" role="alert">{error}</p>}
        {!loading && !error && !result && <p className="py-6 text-[#685750]">選擇縣市與行政區，開始搜尋。</p>}
        {result && (
          <>
            <p className="py-4 text-sm leading-6 text-[#685750]">{result.notice}</p>
            {result.listings.length === 0 ? (
              <p className="border-t border-[#968075] py-5">目前沒有符合的示範資料。</p>
            ) : (
              <ul className="divide-y divide-[#968075] border-y border-[#968075]">
                {result.listings.map((listing) => (
                  <li className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" key={listing.id}>
                    <div>
                      <p className="text-sm font-medium text-[#6e3b49]">來源：固定示範資料</p>
                      <h3 className="mt-1 text-lg font-semibold">{listing.title}</h3>
                      <p className="mt-1 text-sm text-[#685750]">{listing.city}・{listing.district}</p>
                      <p className="mt-2 text-sm text-[#685750]">建坪 {listing.buildingArea} 坪・{listing.rooms} 房</p>
                    </div>
                    <p className="text-2xl font-semibold tabular-nums sm:text-right">
                      {listing.totalPrice.toLocaleString("zh-TW")} 萬
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
}
