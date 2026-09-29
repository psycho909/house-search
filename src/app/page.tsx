"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  SEARCHABLE_AREAS,
  type DemoListing,
  type SearchFilters,
} from "../domain/search.ts";
import type { SearchResponse, SearchSourceStatus } from "./search-status.ts";

function listingLocation(listing: DemoListing) {
  return [listing.city, listing.district, listing.community, listing.address].filter(Boolean).join("・");
}

function resultStateMessage(state: SearchResponse["resultState"]) {
  switch (state) {
    case "results":
      return "已取得符合條件的固定合成示範資料。";
    case "partial":
      return "已取得部分來源的結果；以下只列出本次成功取得的資料。";
    case "timeout":
      return "搜尋逾時，未能取得完整來源結果。";
    case "all_failed":
      return "這次未能取得房源資料，無法判定是否有符合條件的物件。";
    case "no_sources":
      return "目前沒有已啟用的房源資料來源，這次沒有查詢房源。";
    case "no_results":
      return "這次取得的房源中沒有符合條件的物件。";
  }
}

function sourceStatusMessage(source: SearchSourceStatus) {
  switch (source.status) {
    case "success":
      return source.matchedCount === undefined
        ? "成功取得結果"
        : `成功取得 ${source.matchedCount} 筆候選`;
    case "failed":
      return "暫時無法取得";
    case "timeout":
      return "搜尋逾時";
    case "disabled":
      return "未啟用";
  }
}

export default function Home() {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [draft, setDraft] = useState({
    keyword: "",
    totalPriceMin: "",
    totalPriceMax: "",
    unitPriceMin: "",
    unitPriceMax: "",
    buildingAreaMin: "",
    buildingAreaMax: "",
    buildingAgeMin: "",
    buildingAgeMax: "",
    rooms: [] as number[],
    parking: "any" as NonNullable<SearchFilters["parking"]>,
  });
  const [result, setResult] = useState<{
    response: SearchResponse;
    query: { city: string; district: string; filters: SearchFilters };
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);
  const districts = SEARCHABLE_AREAS.find((area) => area.city === city)?.districts ?? [];

  useEffect(() => {
    if (filtersOpen) filterCloseRef.current?.focus();
  }, [filtersOpen]);

  function closeFilters() {
    setFiltersOpen(false);
    window.requestAnimationFrame(() => filterTriggerRef.current?.focus());
  }

  function handleFilterKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!filtersOpen || !window.matchMedia("(max-width: 599px)").matches) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeFilters();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = filterPanelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function parseRange(minimum: string, maximum: string): SearchFilters["totalPrice"] {
    const range: NonNullable<SearchFilters["totalPrice"]> = {};
    if (minimum !== "") range.min = Number(minimum);
    if (maximum !== "") range.max = Number(maximum);
    return Object.keys(range).length === 0 ? undefined : range;
  }

  function buildQuery() {
    const totalPrice = parseRange(draft.totalPriceMin, draft.totalPriceMax);
    const unitPrice = parseRange(draft.unitPriceMin, draft.unitPriceMax);
    const buildingArea = parseRange(draft.buildingAreaMin, draft.buildingAreaMax);
    const buildingAge = parseRange(draft.buildingAgeMin, draft.buildingAgeMax);
    const keyword = draft.keyword.trim();
    const filters: SearchFilters = {
      ...(totalPrice ? { totalPrice } : {}),
      ...(unitPrice ? { unitPrice } : {}),
      ...(buildingArea ? { buildingArea } : {}),
      ...(buildingAge ? { buildingAge } : {}),
      ...(draft.rooms.length > 0 ? { rooms: [...draft.rooms].sort((a, b) => a - b) } : {}),
      parking: draft.parking,
      ...(keyword ? { keyword } : {}),
    };
    return { city, district, filters };
  }

  const currentQuery = buildQuery();
  const resultIsStale = result !== null && JSON.stringify(result.query) !== JSON.stringify(currentQuery);

  function rangeLabel(
    label: string,
    range: SearchFilters["totalPrice"],
    unit: string,
  ) {
    if (!range) return null;
    const minimum = range.min === undefined ? "不限" : String(range.min);
    const maximum = range.max === undefined ? "不限" : String(range.max);
    return label + " " + minimum + "–" + maximum + " " + unit;
  }

  function describeQuery(query: { city: string; district: string; filters: SearchFilters }) {
    const filters = query.filters;
    return [
      query.city,
      query.district,
      rangeLabel("總價", filters.totalPrice, "萬"),
      rangeLabel("單價", filters.unitPrice, "萬／坪"),
      rangeLabel("建坪", filters.buildingArea, "坪"),
      rangeLabel("屋齡", filters.buildingAge, "年"),
      filters.rooms?.length ? "格局 " + filters.rooms.join("／") + " 房" : null,
      filters.parking === "required"
        ? "需要車位"
        : filters.parking === "none"
          ? "明確無車位"
          : null,
      filters.keyword ? "關鍵字 " + filters.keyword : null,
    ].filter(Boolean).join("・");
  }

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const query = buildQuery();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        setError("搜尋服務暫時無法完成，請稍後重試。");
        return;
      }

      let payload: Partial<SearchResponse>;
      try {
        payload = (await response.json()) as Partial<SearchResponse>;
      } catch {
        setError("搜尋服務暫時無法完成，請稍後重試。");
        return;
      }
      if (
        !payload ||
        !Array.isArray(payload.listings) ||
        !Array.isArray(payload.sourceStatuses) ||
        !["results", "partial", "timeout", "all_failed", "no_sources", "no_results"].includes(payload.resultState as string)
      ) {
        setError("搜尋服務暫時無法完成，請稍後重試。");
        return;
      }
      setResult({ response: payload as SearchResponse, query });
    } catch (reason) {
      setError(
        reason instanceof DOMException && reason.name === "TimeoutError"
          ? "搜尋服務逾時，請稍後重試。"
          : "無法連線至搜尋服務，請檢查網路後重試。",
      );
    } finally {
      setLoading(false);
    }
  }

  const pendingConditions: { label: string; clear: () => void }[] = [];
  function addPendingCondition(label: string | null, clear: () => void) {
    if (label) pendingConditions.push({ label, clear });
  }
  function draftRangeLabel(label: string, minimum: string, maximum: string, unit: string) {
    if (minimum === "" && maximum === "") return null;
    return label + " " + (minimum || "不限") + "–" + (maximum || "不限") + " " + unit;
  }
  addPendingCondition(
    draft.keyword.trim() ? "關鍵字 " + draft.keyword.trim() : null,
    () => setDraft((value) => ({ ...value, keyword: "" })),
  );
  addPendingCondition(
    draftRangeLabel("總價", draft.totalPriceMin, draft.totalPriceMax, "萬"),
    () => setDraft((value) => ({ ...value, totalPriceMin: "", totalPriceMax: "" })),
  );
  addPendingCondition(
    draftRangeLabel("建坪", draft.buildingAreaMin, draft.buildingAreaMax, "坪"),
    () => setDraft((value) => ({ ...value, buildingAreaMin: "", buildingAreaMax: "" })),
  );
  addPendingCondition(
    draftRangeLabel("單價", draft.unitPriceMin, draft.unitPriceMax, "萬／坪"),
    () => setDraft((value) => ({ ...value, unitPriceMin: "", unitPriceMax: "" })),
  );
  addPendingCondition(
    draftRangeLabel("屋齡", draft.buildingAgeMin, draft.buildingAgeMax, "年"),
    () => setDraft((value) => ({ ...value, buildingAgeMin: "", buildingAgeMax: "" })),
  );
  addPendingCondition(
    draft.rooms.length ? "格局 " + draft.rooms.join("／") + " 房" : null,
    () => setDraft((value) => ({ ...value, rooms: [] })),
  );
  addPendingCondition(
    draft.parking === "required"
      ? "需要車位"
      : draft.parking === "none"
        ? "明確無車位"
        : null,
    () => setDraft((value) => ({ ...value, parking: "any" })),
  );
  const canShowListings = result !== null &&
    ["results", "partial", "timeout"].includes(result.response.resultState) &&
    result.response.listings.length > 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] px-4 py-8 text-[#302826] sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-[#968075] pb-6 sm:mb-10" inert={filtersOpen}>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[32px]">跨站找房</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[#685750]">
          用同一組條件整理候選房源。以下房源與來源連結都是固定合成示範資料，不是真實刊登。
        </p>
      </header>

      <section aria-labelledby="search-heading" className="rounded-lg border border-[#968075] bg-[#fcfaf8] p-5 sm:p-7">
        <h2 id="search-heading" className="text-xl font-semibold" inert={filtersOpen}>搜尋條件</h2>
        <p className="mt-2 text-sm leading-6 text-[#685750]" inert={filtersOpen}>
          示範版目前支援新北市／新莊區。591、信義與永慶即時來源尚未啟用。
        </p>

        <form className="mt-6" onSubmit={search}>
          <fieldset disabled={loading} className="grid min-w-0 gap-4 sm:grid-cols-2 sm:items-end">
            <legend className="sr-only" inert={filtersOpen}>搜尋地區與篩選條件</legend>
            <div inert={filtersOpen}>
              <label className="mb-2 block text-sm font-medium" htmlFor="city">縣市</label>
              <select
                id="city"
                className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:cursor-wait disabled:opacity-70"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setDistrict("");
                }}
                required
              >
                <option value="">選擇縣市</option>
                {SEARCHABLE_AREAS.map((area) => <option key={area.city} value={area.city}>{area.city}</option>)}
              </select>
            </div>

            <div inert={filtersOpen}>
              <label className="mb-2 block text-sm font-medium" htmlFor="district">行政區</label>
              <select
                id="district"
                className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:cursor-not-allowed disabled:bg-[#f1ebe7]"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                required
                disabled={!city}
              >
                <option value="">選擇行政區</option>
                {districts.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2" inert={filtersOpen}>
              <label className="mb-2 block text-sm font-medium" htmlFor="keyword">關鍵字</label>
              <input
                id="keyword"
                type="search"
                maxLength={80}
                placeholder="社區、路名或物件名稱"
                className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                value={draft.keyword}
                onChange={(event) => setDraft((value) => ({ ...value, keyword: event.target.value }))}
              />
            </div>

            <div className="search-actions sm:col-span-2" inert={filtersOpen}>
              <button
                ref={filterTriggerRef}
                type="button"
                className="mobile-filter-trigger min-h-11 rounded-lg border border-[#968075] bg-white px-4 font-medium hover:bg-[#f1ebe7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49]"
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
                onClick={() => setFiltersOpen(true)}
              >
                更多條件
              </button>
              <button
                className="search-submit min-h-11 rounded-lg bg-[#6e3b49] px-5 font-medium text-white hover:bg-[#542b37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#302826] disabled:cursor-wait disabled:opacity-70"
                type="submit"
              >
                {loading ? "搜尋中…" : "搜尋示範資料"}
              </button>
            </div>

            <div className="filter-backdrop" hidden={!filtersOpen} aria-hidden="true" />
            <div
              ref={filterPanelRef}
              id="filter-panel"
              className="filter-drawer sm:col-span-2"
              data-open={filtersOpen}
              role={filtersOpen ? "dialog" : undefined}
              aria-modal={filtersOpen ? true : undefined}
              aria-labelledby="filter-panel-heading"
              onKeyDown={handleFilterKeyDown}
            >
              <div className="filter-drawer-header">
                <h3 id="filter-panel-heading" className="text-lg font-semibold">篩選條件</h3>
                <button
                  ref={filterCloseRef}
                  type="button"
                  className="filter-drawer-close min-h-11 rounded-lg border border-[#968075] bg-white px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49]"
                  onClick={closeFilters}
                >
                  關閉
                </button>
              </div>

              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">總價範圍（萬元）</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[#685750]" htmlFor="total-price-min">
                  最低
                  <input
                    id="total-price-min"
                    aria-label="總價最低（萬元）"
                    type="number"
                    min={0}
                    max={draft.totalPriceMax === "" ? Number.MAX_SAFE_INTEGER : draft.totalPriceMax}
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.totalPriceMin}
                    onChange={(event) => setDraft((value) => ({ ...value, totalPriceMin: event.target.value }))}
                  />
                </label>
                <label className="text-sm text-[#685750]" htmlFor="total-price-max">
                  最高
                  <input
                    id="total-price-max"
                    aria-label="總價最高（萬元）"
                    type="number"
                    min={draft.totalPriceMin || 0}
                    max={Number.MAX_SAFE_INTEGER}
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.totalPriceMax}
                    onChange={(event) => setDraft((value) => ({ ...value, totalPriceMax: event.target.value }))}
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">單價範圍（萬元／坪）</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[#685750]" htmlFor="unit-price-min">
                  最低
                  <input
                    id="unit-price-min"
                    aria-label="單價最低（萬元／坪）"
                    type="number"
                    min={0}
                    max={draft.unitPriceMax === "" ? Number.MAX_SAFE_INTEGER : draft.unitPriceMax}
                    step="any"
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.unitPriceMin}
                    onChange={(event) => setDraft((value) => ({ ...value, unitPriceMin: event.target.value }))}
                  />
                </label>
                <label className="text-sm text-[#685750]" htmlFor="unit-price-max">
                  最高
                  <input
                    id="unit-price-max"
                    aria-label="單價最高（萬元／坪）"
                    type="number"
                    min={draft.unitPriceMin || 0}
                    max={Number.MAX_SAFE_INTEGER}
                    step="any"
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.unitPriceMax}
                    onChange={(event) => setDraft((value) => ({ ...value, unitPriceMax: event.target.value }))}
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">建坪範圍（坪）</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[#685750]" htmlFor="building-area-min">
                  最低
                  <input
                    id="building-area-min"
                    aria-label="建坪最低（坪）"
                    type="number"
                    min={0}
                    max={draft.buildingAreaMax === "" ? Number.MAX_SAFE_INTEGER : draft.buildingAreaMax}
                    step="any"
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.buildingAreaMin}
                    onChange={(event) => setDraft((value) => ({ ...value, buildingAreaMin: event.target.value }))}
                  />
                </label>
                <label className="text-sm text-[#685750]" htmlFor="building-area-max">
                  最高
                  <input
                    id="building-area-max"
                    aria-label="建坪最高（坪）"
                    type="number"
                    min={draft.buildingAreaMin || 0}
                    max={Number.MAX_SAFE_INTEGER}
                    step="any"
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.buildingAreaMax}
                    onChange={(event) => setDraft((value) => ({ ...value, buildingAreaMax: event.target.value }))}
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">屋齡範圍（年）</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-[#685750]" htmlFor="building-age-min">
                  最低
                  <input
                    id="building-age-min"
                    aria-label="屋齡最低（年）"
                    type="number"
                    min={0}
                    max={draft.buildingAgeMax === "" ? Number.MAX_SAFE_INTEGER : draft.buildingAgeMax}
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.buildingAgeMin}
                    onChange={(event) => setDraft((value) => ({ ...value, buildingAgeMin: event.target.value }))}
                  />
                </label>
                <label className="text-sm text-[#685750]" htmlFor="building-age-max">
                  最高
                  <input
                    id="building-age-max"
                    aria-label="屋齡最高（年）"
                    type="number"
                    min={draft.buildingAgeMin || 0}
                    max={Number.MAX_SAFE_INTEGER}
                    className="mt-1 min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base text-[#302826] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                    value={draft.buildingAgeMax}
                    onChange={(event) => setDraft((value) => ({ ...value, buildingAgeMax: event.target.value }))}
                  />
                </label>
              </div>
            </div>

            <fieldset className="min-w-0">
              <legend className="mb-2 text-sm font-medium">格局（可多選，符合任一房數）</legend>
              <div className="flex min-h-11 flex-wrap items-center gap-x-5 gap-y-2">
                {[1, 2, 3, 4, 5].map((room) => (
                  <label className="inline-flex min-h-11 items-center gap-2 text-sm" key={room}>
                    <input
                      type="checkbox"
                      className="size-4 accent-[#6e3b49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49]"
                      checked={draft.rooms.includes(room)}
                      onChange={(event) => setDraft((value) => ({
                        ...value,
                        rooms: event.target.checked
                          ? [...value.rooms, room].sort((a, b) => a - b)
                          : value.rooms.filter((selected) => selected !== room),
                      }))}
                    />
                    {room} 房
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="parking">車位</label>
              <select
                id="parking"
                className="min-h-11 w-full rounded-lg border border-[#968075] bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                value={draft.parking}
                onChange={(event) => setDraft((value) => ({
                  ...value,
                  parking: event.target.value as NonNullable<SearchFilters["parking"]>,
                }))}
              >
                <option value="any">不限</option>
                <option value="required">需要車位</option>
                <option value="none">明確無車位</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium">待搜尋條件</p>
              {pendingConditions.length === 0 ? (
                <p className="text-sm text-[#685750]">尚未設定篩選條件。</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {pendingConditions.map((condition) => (
                    <li key={condition.label}>
                      <button
                        type="button"
                        className="min-h-11 rounded-full border border-[#968075] bg-white px-3 text-sm hover:bg-[#f1ebe7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49] disabled:opacity-70"
                        aria-label={"移除" + condition.label}
                        onClick={condition.clear}
                      >
                        {condition.label} <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
              </div>

              <div className="filter-drawer-footer">
                <button
                  type="button"
                  className="filter-drawer-done min-h-11 rounded-lg bg-[#6e3b49] px-5 font-medium text-white hover:bg-[#542b37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#302826]"
                  onClick={closeFilters}
                >
                  完成設定
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="results-heading" aria-live="polite" aria-busy={loading} className="mt-8 sm:mt-10" inert={filtersOpen}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#968075] pb-3">
          <h2 id="results-heading" className="text-xl font-semibold">搜尋結果</h2>
          {result && !loading && !error && canShowListings && (
            <p className="text-sm text-[#685750]">
              {resultIsStale ? "上次搜尋結果：" : "本次示範資料："}{result.response.listings.length} 筆
            </p>
          )}
        </div>

        {loading && <p className="py-6 text-[#685750]" role="status">正在查詢固定合成示範資料…</p>}
        {error && <p className="py-6 font-medium text-[#9a421f]" role="alert">{error}</p>}
        {!loading && !error && !result && <p className="py-6 text-[#685750]">選擇縣市與行政區，開始搜尋。</p>}
        {!loading && !error && result && (
          <>
            {resultIsStale && (
              <p className="mt-4 rounded-lg border border-[#968075] bg-[#fcfaf8] p-4 text-sm leading-6" role="status">
                條件已變更，請重新搜尋。以下保留的是上次搜尋結果。
              </p>
            )}
            <p className="pt-4 text-sm leading-6 text-[#685750]">
              本次結果使用的條件：{describeQuery(result.query)}
            </p>
            <p
              className={`mt-4 rounded-lg border bg-[#fcfaf8] p-4 text-sm font-medium leading-6 ${
                ["timeout", "all_failed", "no_sources"].includes(result.response.resultState)
                  ? "border-[#9a421f] text-[#9a421f]"
                  : "border-[#968075]"
              }`}
              role="status"
            >
              {resultStateMessage(result.response.resultState)}
            </p>
            <div className="py-3">
              <h3 className="text-sm font-semibold">本次來源狀態</h3>
              {result.response.sourceStatuses.length > 0 ? (
                <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#685750]">
                  {result.response.sourceStatuses.map((source) => (
                    <li key={source.id}>{source.label}：{sourceStatusMessage(source)}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-6 text-[#685750]">沒有來源狀態資料。</p>
              )}
            </div>
            <p className="py-3 text-sm leading-6 text-[#685750]">{result.response.notice}</p>
            {result.response.excludedBecauseUnknown > 0 && (
              <p className="pb-3 text-sm leading-6 text-[#685750]" role="status">
                部分物件因資料不足未列入符合結果。
              </p>
            )}
            {canShowListings && (
              <ul className="divide-y divide-[#968075] border-y border-[#968075]">
                {result.response.listings.map((listing) => (
                  <li className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" key={listing.sourceLabel + "-" + listing.id}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#6e3b49]">合成來源：{listing.sourceLabel}</p>
                      <h3 className="mt-1 break-words text-lg font-semibold">{listing.title}</h3>
                      <p className="mt-1 text-sm text-[#685750]">{listingLocation(listing)}</p>
                      <p className="mt-2 text-sm text-[#685750]">
                        建坪 {listing.buildingArea === undefined ? "未提供" : listing.buildingArea + " 坪"}
                        {"・"}單價 {listing.unitPrice === undefined ? "未提供" : listing.unitPrice + " 萬／坪"}
                        {"・"}格局 {listing.rooms === undefined ? "未提供" : listing.rooms + " 房"}
                        {"・"}屋齡 {listing.buildingAge === undefined ? "未提供" : listing.buildingAge + " 年"}
                        {"・"}車位 {listing.hasParking === undefined ? "未提供" : listing.hasParking ? "有" : "無"}
                      </p>
                      {listing.possibleDuplicate && (
                        <p className="mt-2 text-sm font-medium text-[#685750]">可能為同一房屋</p>
                      )}
                      <a
                        className="mt-3 inline-flex min-h-11 items-center font-medium text-[#6e3b49] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e3b49]"
                        href={listing.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        查看此合成來源物件
                      </a>
                    </div>
                    <p className="text-2xl font-semibold tabular-nums sm:text-right">
                      {listing.totalPrice === undefined
                        ? "價格未提供"
                        : listing.totalPrice.toLocaleString("zh-TW") + " 萬"}
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
