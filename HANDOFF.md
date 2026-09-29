# Project Status

本檔是下一個 Session 的**專案入口**；正式 Work Authority 與最新票狀態以 [`tickets/`](tickets/README.md) 為準。目前已有本機 fixture 搜尋示範；相關票尚未遠端同步。

## Repository

- GitHub：[psycho909/house-search](https://github.com/psycho909/house-search)
- Branch：`main`
- Latest Commit：以 `git rev-parse HEAD` 和 `git ls-remote origin refs/heads/main` 核對；本檔不記自身提交的 hash

## Completed

專案目標、MVP 契約、架構與 UI 草案；三來源官方頁面及條款的初步桌面調查；本機 Next.js fixture 搜尋 UI／API。是否推送成功須用遠端核對，不能只依本檔宣稱。

## Current Architecture

Browser → Next.js UI → Server Search API → 查詢驗證 → 固定合成 fixture → 結果。資料庫與 live Adapter 尚未建立或啟用。

## Documents

[README.md](README.md)、[PROJECT.md](PROJECT.md)、[SPEC.md](SPEC.md)、[TODO.md](TODO.md)、[UI-UX-DESIGN.md](docs/UI-UX-DESIGN.md)、[ARCHITECTURE.md](docs/ARCHITECTURE.md)、[SOURCE-FEASIBILITY.md](docs/SOURCE-FEASIBILITY.md)。

## Decisions

城市／行政區必填；來源不足欄位不能猜測；篩選缺值不匹配；跨來源疑似重複保留原 Listing；來源故障隔離；三個 live Adapter 在授權前 disabled。後續票均為 draft，不代表已批准施工。

## Known Risks

591 與信義條款限制非授權自動擷取；永慶是否允許重用未確認。三站 API、原始 HTML／CSR、參數、robots、分頁、限速與欄位穩定性仍需驗證。公開頁可見不等於合法可聚合。

## Source Feasibility

### 591

- 狀態：disabled / Need Verification；條款限制未授權自動擷取。
- 可取得：搜尋索引可見售屋頁與部分欄位；未作正式 Adapter 取得。
- 未知：正式授權、API、原始 HTML、參數、robots、速率。

### 信義

- 狀態：disabled / Need Verification；條款禁止非人為自動截取。
- 可取得：公開買屋頁可見列表文字；未作正式 Adapter 取得。
- 未知：正式授權、API、SSR/CSR、完整參數、robots、速率。

### 永慶

- 狀態：disabled / Need Verification；公開內容不構成重用許可。
- 可取得：公開買屋頁可見列表文字；未作正式 Adapter 取得。
- 未知：正式授權、適用條款、API、SSR/CSR、完整參數、robots、速率。

## Next Ticket

目前工作 [篩選與保守去重](tickets/20260929-filter-dedup.md) 的本機實作、API 測試、typecheck、production build 與 L2 review 已完成；UI 瀏覽器 smoke test 尚未驗證。分支 `feature/filter-dedup` 包含尚未推送的 fixture 基底 commit；Vercel Git integration 會對 branch push 建立 Preview。先由 Owner 決定是否允許該 Preview，再同步分支。後續來源授權票可獨立處理，但取得授權前不啟用任何 live Adapter。

## Recommended Next Command

在此倉庫執行 `git status --short --branch`，讀取 [.scratch handoff](.scratch/20260929-filter-dedup/handoff.md) 與目標 Ticket；不要 push，直到 Owner 明確決定部署範圍。

## Do Not Do

不繞過 CAPTCHA、登入或反爬限制；不猜 API/DOM；不把 fixture 當成真實房源；不進行全台預抓、資料庫建置或未授權部署。

## Verification

本機驗證：`npm test` 18/18、`npm run typecheck`、`npm run build`、`git diff --check` 通過。API route 驗證篩選和去重；本票 UI 瀏覽器操作未確認，CUA 安全政策阻擋 localhost 存取。未做遠端 push、Vercel deployment 或 live Adapter 測試。詳見 [篩選與保守去重票](tickets/20260929-filter-dedup.md)。
