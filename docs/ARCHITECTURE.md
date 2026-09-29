# Architecture

## Boundary

```text
Browser → Next.js UI → Server Search API
                         ├─ eligible 591 adapter
                         ├─ eligible Sinyi adapter
                         └─ eligible Yungching adapter
                   → normalize → filter → dedup annotation → response
```

每個 Adapter 是否啟用取決於 `SOURCE-FEASIBILITY.md` 的授權和驗證；目前全部未啟用。Browser 不直接請求來源站，不暴露來源存取憑證。禁用來源仍可顯示原因或提供人工開啟其官方搜尋頁的連結，不能偽裝成即時整合結果。

## Planned modules

`src/domain/` 保存查詢、房源及篩選純邏輯；`src/adapters/<source>/` 保存單一來源映射、低頻請求、解析與錯誤；`src/server/search/` 協調及故障隔離；`src/app/` 顯示查詢和結果。實際目錄在 scaffold 票建立，這裡是責任邊界而非已存在程式碼。

## Search sequence

1. 驗證城市、行政區和範圍，拒絕不一致或負值輸入。
2. 對**授權且啟用**的來源並行搜尋；以 `Promise.allSettled` 或等價方式回收個別結果。
3. 各來源只映射已核實支援的搜尋條件，回報未映射條件；以候選的原始欄位做明確單位轉換。
4. 統一模型後再套用所有使用者條件；缺欄位不得推測成符合。
5. 只精確去除同來源同 ID／同 URL 重複；跨來源疑似同屋只標記群組，保留各 Listing、價格和連結。
6. 回傳結果、各來源狀態、搜尋時間與結果範圍／不完整提示。

## Operational limits to validate

單次使用者主動搜尋；初始設計上限為每來源同時 1 個請求、每來源 5 秒超時、零自動重試、單來源最多 1 頁或 50 筆候選。這些是待來源許可確認的上限提案，不是已驗證能用的設定。若條款禁止請求，頻率降到零。共享快取預設關閉；只在授權允許保存且確認 freshness、資料最小化後評估短 TTL。不得收集聯絡電話、個資或原站圖片副本。

## Security and failure

服務端只允許已審核的來源 host 與 URL 建構方式，避免 SSRF；使用者關鍵字不得組成任意 fetch URL。輸出字串轉義，外部連結採安全屬性；不儲存原站 HTML。個別 timeout、解析失敗或來源禁用均有獨立狀態。若沒有啟用來源，回傳明確「目前無可用來源」，不得用空列表冒充完整搜尋。
