# Project Status

本檔是下一個 Session 的**專案入口**；正式 Work Authority 與最新票狀態以 [`tickets/`](tickets/README.md) 為準。本次只有規格，沒有可執行 Web App。

## Repository

- GitHub：[psycho909/house-search](https://github.com/psycho909/house-search)
- Branch：`main`
- Latest Commit：以 `git rev-parse HEAD` 和 `git ls-remote origin refs/heads/main` 核對；本檔不記自身提交的 hash

## Completed

專案目標、MVP 契約、架構與 UI 草案；三來源官方頁面及條款的初步桌面調查；後續正式草案票。是否推送成功須用遠端核對，不能只依本檔宣稱。

## Current Architecture

規劃 Browser → Next.js UI → Server Search API → 經授權的來源 Adapter → 正規化／本地篩選／去重標記 → 結果；MVP 無資料庫。實際程式碼尚未建立。

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

先由 Owner 核准 [fixture 搜尋垂直路徑](tickets/20260929-fixture-search-slice.md)；[來源授權票](tickets/20260929-source-permission.md) 可並行啟動，但取得授權前不啟用任何 live Adapter。

## Recommended Next Command

在此倉庫執行 `git pull --ff-only origin main`，再讀 `AGENTS.md`、本檔、`PROJECT.md`、`SPEC.md` 與目標 Ticket。

## Do Not Do

不繞過 CAPTCHA、登入或反爬限制；不猜 API/DOM；不把 fixture 當成真實房源；不進行全台預抓、資料庫建置或未授權部署。

## Verification

本次以文件結構、連結、Git diff 與遠端提交核對為準；無 runtime 測試或真站 Adapter 測試。實際完成證據見 [規劃票](tickets/20260929-mvp-planning.md)。
