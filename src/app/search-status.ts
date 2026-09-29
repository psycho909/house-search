import type { DemoSearchResponse } from "../domain/search.ts";

export interface SearchSourceStatus {
  id: string;
  label: string;
  status: "success" | "failed" | "timeout" | "disabled";
  matchedCount?: number;
}

export type SearchResultState = "results" | "partial" | "timeout" | "all_failed" | "no_sources" | "no_results";

export interface SearchResponse extends DemoSearchResponse {
  sourceStatuses: SearchSourceStatus[];
  resultState: SearchResultState;
}

export function deriveSearchResultState(
  sourceStatuses: SearchSourceStatus[],
  listingCount: number,
): SearchResultState {
  const activeStatuses = sourceStatuses.filter((source) => source.status !== "disabled");
  if (activeStatuses.length === 0) return "no_sources";
  if (activeStatuses.every((source) => source.status === "timeout")) return "timeout";

  const hasSuccess = activeStatuses.some((source) => source.status === "success");
  const hasError = activeStatuses.some((source) => source.status === "failed" || source.status === "timeout");
  if (!hasSuccess && hasError) return "all_failed";
  if (hasSuccess && hasError) return "partial";
  return listingCount === 0 ? "no_results" : "results";
}
