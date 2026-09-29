# MVP Specification（規格草案）

本規格定義**取得來源使用許可後**的目標行為。三個候選來源目前未啟用；fixture 驗收不代表即時資料已可用。

## Functional Requirements

- FR1：縣市、行政區必填且須為有效組合；關鍵字選填。
- FR2：可選總價、單價、建坪、房數、屋齡、房屋類型、車位條件；單位明示。
- FR3：只查詢明確授權且技術驗證通過的來源；每來源獨立 Adapter。
- FR4：呈現已取得且符合條件的 Listing、來源連結、各來源狀態及不完整提示。
- FR5：單來源失敗不能抹除其他成功結果；沒有啟用來源是獨立狀態。

## Search Query Schema

```ts
type Range = { min?: number; max?: number };
interface PropertySearchQuery {
  city: string;             // 台灣縣市 canonical 名稱
  district: string;         // 必須屬於 city
  keyword?: string;
  totalPrice?: Range;       // 萬元
  unitPrice?: Range;        // 萬元 / 坪
  area?: Range;             // 建築面積，坪
  rooms?: number[];         // 任一匹配；空陣列視為無條件
  age?: Range;              // 年
  buildingTypes?: string[]; // canonical 類型；具體字典待驗證
  parking?: 'any' | 'required' | 'none';
}
```

`min/max` 為含端點、非負有限數；`min > max` 拒絕。房數為非負整數且去重；字串 trim，空關鍵字視為未填。縣市與行政區清單要用明確、可更新的資料正本，不用前端自由字串暗示驗證成功。查詢大小與數值上限由 scaffold 票制定並測試。

## Property Schema

```ts
interface PropertyListing {
  id: string; // `${source}:${sourceId}`；無來源 ID 時以穩定 canonical URL 雜湊
  source: '591' | 'sinyi' | 'yungching' | string;
  sourceId?: string;
  sourceUrl: string; // 僅允許已核實的官方 https host
  title: string;
  city?: string; district?: string; address?: string; community?: string;
  totalPrice?: number; unitPrice?: number; // 萬元、萬元/坪
  buildingArea?: number; mainArea?: number; parkingArea?: number; // 坪
  rooms?: number; halls?: number; bathrooms?: number;
  age?: number; floor?: number; totalFloors?: number;
  buildingType?: string; hasParking?: boolean; parkingPrice?: number;
  imageUrl?: string; publishedAt?: string; updatedAt?: string; // ISO 8601，時間若不可信則缺省
}
```

缺值為 `undefined`；JSON 回應可省略，不得用 `0`、`false`、空字串或今日日期假裝來源有資料。`0` 只代表來源明確給出零。`totalPrice` 含車位與否若不明，不能自行扣除；無法確認分母時 `unitPrice` 缺省，不由總價／建坪推算。來源 listing URL、標題是最小可顯示欄位，欠缺時丟棄該候選並計入解析警示。日期、圖片和文字使用需符合來源許可。

## Adapter Contract and Search Flow

```ts
interface PropertySourceAdapter {
  readonly source: PropertyListing['source'];
  search(query: PropertySearchQuery, signal: AbortSignal): Promise<PropertyListing[]>;
}
```

Adapter 擁有已驗證的欄位映射、請求、解析、單位轉換和來源錯誤；不得跨站共用解析器。Coordinator 對啟用來源用 `Promise.allSettled` 或等價方式隔離失敗，回傳 `{ listings, sourceStatuses, completeness }`。狀態至少含 `success | failed | timeout | disabled`、本次候選／符合筆數和有限的錯誤類型，不將來源 HTML 或內部錯誤直接傳給使用者。若 0 個來源可用，回應 `no_sources`；若全部失敗，回應 `all_failed`，都不能稱為 `no_results`。

## Two-stage Filtering and Keyword

Stage A 只映射該來源**已證實支援**的條件；每次查詢固定地域邊界，頁數和筆數有上限。Stage B 對所有候選重新驗證 city/district 和所有啟用條件。價格、面積、屋齡等若缺值，不能證明匹配，予以排除並統計 `excludedBecauseUnknown`；`parking: none` 僅在明確 `hasParking === false` 時匹配。`rooms` 是 OR，其他範圍為 AND；`parking: any` 不篩選。

關鍵字先做 Unicode 正規化、空白壓縮及不區分英文字母大小寫的字面匹配，檢查 `title`、`community`、`address` 及來源明確允許的描述 metadata；這些欄位皆無匹配時排除。不得依賴 `title.includes` 單一欄位，也不做 NLP、拼字猜測或依未取得的 metadata 宣稱無結果。若來源未提供完整候選集合，UI 標明只搜尋本次取得範圍。

## Deduplication

`Exact Match`：同來源 ID 相同，或同來源 canonical URL 相同，合併完全重複的擷取記錄，保留最新可驗證資料。`Likely Same Property`：相同行政區，且社區／地址有足夠一致證據，再加樓層、建坪（容差暫定 0.5 坪）及格局相近；只標記群組，**不合併跨來源 Listing**。`Independent Listing`：證據不足或相互矛盾，分別顯示。不得僅以社區＋樓層＋四捨五入坪數＋房數強制合併；門牌不完整、車位面積和價格差異都可能造成誤判。容差須用 fixture 驗證後才定案。

## Error Handling / Caching / Performance

逐來源超時、解析錯誤、來源限制、無啟用來源都有可辨識狀態。初始提案：單來源 5 秒超時、同來源同時 1 請求、0 自動重試、最多 1 頁或 50 筆候選；實際值須符合授權和部署限制。無全台預抓、排程或鏡像。共享快取預設不使用；來源許可允許時才另票定 TTL、資料最小化與失效策略。效能驗收先用 fixture 檢查故障隔離與 timeout，不宣稱真站延遲。

## Responsive / Security / Source Compliance

桌面列表與手機卡片都顯示價格、主要屬性、來源及外連；320px 寬可操作，鍵盤可完成搜尋與篩選。伺服器只連已核准 host，驗證輸入和外連 URL，避免 SSRF、XSS；不暴露憑證，不保存原站 HTML／聯絡資料。取得公開頁面不代表可自動擷取或重製內容。591、信義、永慶各自須先確認條款、robots 與必要授權；有禁止、403、CAPTCHA 或登入要求時停用來源，不規避限制。詳見 [來源調查](docs/SOURCE-FEASIBILITY.md)。

## Testable Acceptance Criteria

1. Given 缺城市、缺行政區或 `min > max`，When 送出，Then 回傳欄位錯誤且不呼叫任何 Adapter。
2. Given 新北市／新莊區、兩個啟用 fixture Adapter，When 一個成功一個拒絕，Then 顯示成功來源的符合 Listing 和失敗來源狀態，沒有整體搜尋 Error。
3. Given 沒有啟用來源，When 搜尋，Then 顯示「目前無可用來源」，不能顯示「沒有符合條件房屋」。
4. Given 篩選 `parking: required` 且一筆 `hasParking` 缺省，When 本地篩選，Then 該筆不列為匹配並統計未知欄位排除。
5. Given 關鍵字只存在於 `community`，When 篩選，Then 能匹配；只出現在未取得欄位時不推測匹配。
6. Given 跨來源兩筆相似資料，When 去重，Then 兩個來源連結均保留；同來源相同 ID 的重複記錄只顯示一次。
7. Given 任一來源未取得使用許可，When 設定啟用清單，Then 不能向該來源發自動請求，且 UI 顯示該來源未啟用。
8. Given 320px 視窗及鍵盤操作，When 設定條件並搜尋，Then 主操作可見、可操作且來源狀態可閱讀。
