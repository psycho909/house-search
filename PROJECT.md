# Project Overview

跨房屋交易網搜尋器是台灣買屋候選物件的統一搜尋介面。現階段為 MVP 規格；能否取得各來源資料取決於來源授權與後續技術驗證。

## Problem / Target User / Goal

買方需在多個房屋網站重複輸入條件，且欄位、單位與呈現方式不同。目標使用者是以地區和預算尋找中古屋的個人。目標是用一次輸入查看有來源連結、可比較且不虛構缺失欄位的候選列表。

## MVP / Non-Goals

MVP：縣市與行政區必填；關鍵字與價格、單價、面積、格局、屋齡、類型、車位選填；合規可用來源的伺服器端搜尋、資料標準化、二次篩選、保守去重、列表和來源連結、響應式 UI、部分失敗提示。

不做：會員、登入、收藏、資料庫、定時爬蟲、通知、價格歷史、推薦、AI 估價、地圖主介面、實價登錄分析或全台預抓。來源未取得許可時，不將即時跨站結果算作已交付。

## Core User Flow

選縣市 → 選行政區 → 可選關鍵字及進階條件 → 搜尋 → 查看每來源狀態與已驗證結果 → 前往來源物件頁。資料不足以證實啟用的篩選條件時，該物件不列為符合，UI 顯示篩選可能排除資料不完整物件。

## Data Sources

候選為 591、信義房屋、永慶房仲網；三者均尚未核准自動化資料整合。來源入口、條款與未知事項見 [SOURCE-FEASIBILITY.md](docs/SOURCE-FEASIBILITY.md)。新增來源、合作 feed 或改為來源搜尋連結由後續票決定。

## Architecture Summary / Technology Stack

規劃 Next.js + TypeScript + Tailwind CSS，部署候選為 Vercel。Browser 只呼叫本服務 API；每來源獨立 Adapter；正規化和篩選是可用固定資料驗證的純邏輯。MVP 無資料庫；技術選擇在 scaffold 票驗證版本、執行環境與來源相容性後確認。[ARCHITECTURE.md](docs/ARCHITECTURE.md) 記錄邊界。

## Milestones

1. 本階段：文件、來源風險、工作票與 Git 交接。
2. 授權關卡：逐來源確認可用方式與範圍；未通過者保持 disabled。
3. 第一條垂直路徑：用授權 fixture 接通查詢、API、結果 UI 及測試。
4. 逐來源加入經核准的 Adapter，完成故障隔離與響應式驗收。

## Risks

- 591、信義條款限制非授權自動擷取；永慶公開頁面不構成重用許可。此為 MVP 最大阻塞。
- 來源頁面和參數會改變；公開搜尋結果不證明穩定 API。
- 房源資料可能過時、重複、缺欄位；搜尋結果不可宣稱覆蓋所有市場物件。
- 無資料庫表示每次查詢受來源延遲與配額影響。

## Future Roadmap

取得合法資料管道後再評估更多平台；V1 才討論持久化、價格歷史、收藏與儲存搜尋；V2 才評估通知和分析。若需要持久化，可評估 Supabase PostgreSQL 的 `properties`、`property_listings`、`price_history`、`favorites`、`saved_searches`，目前不建立 schema 或 migration。
