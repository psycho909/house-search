import { deriveSearchResultState, type SearchResponse, type SearchSourceStatus } from "../../search-status.ts";
import { POST as search } from "../../../server/search.ts";
import type { DemoSearchResponse } from "../../../domain/search.ts";

export async function POST(request: Request): Promise<Response> {
  const response = await search(request);
  if (!response.ok) return response;

  const result = await response.json() as DemoSearchResponse;
  const sourceStatuses: SearchSourceStatus[] = [
    { id: "fixture", label: "合成示範資料", status: "success", matchedCount: result.listings.length },
    { id: "591", label: "591", status: "disabled" },
    { id: "sinyi", label: "信義", status: "disabled" },
    { id: "yungching", label: "永慶", status: "disabled" },
  ];
  const body: SearchResponse = {
    ...result,
    sourceStatuses,
    resultState: deriveSearchResultState(sourceStatuses, result.listings.length),
  };

  return Response.json(body, { status: response.status });
}
