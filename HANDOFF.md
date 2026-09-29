# Project Status

本檔是下一個 Session 的**專案入口**；正式 Work Authority 與最新票狀態以 [`tickets/`](tickets/README.md) 為準。目前已有 fixture 搜尋示範；篩選與保守去重已在核准分支完成、Preview Ready，UI smoke test 通過。

## Repository

- GitHub：[psycho909/house-search](https://github.com/psycho909/house-search)
- Branch：`feature/filter-dedup`（本次核准工作分支；`main` 未修改）
- Latest Commit：以 `git rev-parse HEAD` 和 `git ls-remote origin refs/heads/feature/filter-dedup` 核對本次工作分支；本檔不記自身提交的 hash

## Completed

專案目標、MVP 契約、架構與 UI 草案；三來源官方頁面及條款的初步桌面調查；fixture 搜尋垂直路徑與篩選／保守去重已接受並在 Preview 驗證。是否推送成功須用遠端核對，不能只依本檔宣稱。

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

工作 [Fixture 搜尋垂直路徑](tickets/20260929-fixture-search-slice.md) 與 [篩選與保守去重](tickets/20260929-filter-dedup.md) 均已接受。後續核准的 `feature/filter-dedup` Preview 包含 fixture commit `5589551`，Vercel `Ready` 且 UI smoke test 通過。TODO 第一張 [響應式與錯誤狀態](tickets/20260929-responsive-failures.md) 仍是 draft，需 Owner 核准後才能開工。未做 Production 部署；取得來源授權前不啟用任何 live Adapter。

## Recommended Next Command

在此倉庫執行 `git status --short --branch`，確認是否核准 [響應式與錯誤狀態](tickets/20260929-responsive-failures.md) 的 draft Scope；未核准其他施工或 Production 部署。

## Do Not Do

不繞過 CAPTCHA、登入或反爬限制；不猜 API/DOM；不把 fixture 當成真實房源；不進行全台預抓、資料庫建置或未授權部署。

## Verification

本機驗證：篩選實作的 `npm test` 18/18、`npm run typecheck`、`npm run build` 通過；fixture 搜尋基礎測試 3/3 通過。Vercel Preview `dpl_EpRYXdmLfn2Ehxe6TNVMKrpQnTry` 為 `Ready`，UI smoke test 確認城市／行政區搜尋、社區關鍵字、2／3 房 OR 篩選與跨來源疑似重複保留兩個連結。未做 Production 部署或 live Adapter 測試。詳見 [fixture 搜尋票](tickets/20260929-fixture-search-slice.md) 與 [篩選與保守去重票](tickets/20260929-filter-dedup.md)。
