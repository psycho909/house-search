# Project Status

本檔是下一個 Session 的**專案入口**；正式 Work Authority 與最新票狀態以 [`tickets/`](tickets/README.md) 為準。目前已有 fixture 搜尋示範；篩選與保守去重已在核准分支完成、Preview Ready，UI smoke test 通過。

## Repository

- GitHub：[psycho909/house-search](https://github.com/psycho909/house-search)
- Branch：`feature/filter-dedup`（本次核准工作分支；`main` 未修改）
- Latest Commit：以 `git rev-parse HEAD` 和 `git ls-remote origin refs/heads/feature/filter-dedup` 核對本次工作分支；本檔不記自身提交的 hash

## Completed

專案目標、MVP 契約、架構與 UI 草案；fixture 搜尋垂直路徑與篩選／保守去重已接受並在 Preview 驗證。2026-09-29 已核對 591、信義、永慶官方使用條款；Owner 確認目前沒有來源使用授權，僅個人使用，因此全部 live Adapter 維持 disabled。是否推送成功須用遠端核對，不能只依本檔宣稱。

## Current Architecture

Browser → Next.js UI → Server Search API → 查詢驗證 → 固定合成 fixture → 結果。資料庫與 live Adapter 尚未建立或啟用。

## Documents

[README.md](README.md)、[PROJECT.md](PROJECT.md)、[SPEC.md](SPEC.md)、[TODO.md](TODO.md)、[UI-UX-DESIGN.md](docs/UI-UX-DESIGN.md)、[ARCHITECTURE.md](docs/ARCHITECTURE.md)、[SOURCE-FEASIBILITY.md](docs/SOURCE-FEASIBILITY.md)。

## Decisions

城市／行政區必填；來源不足欄位不能猜測；篩選缺值不匹配；跨來源疑似重複保留原 Listing；來源故障隔離；三個 live Adapter 在授權前 disabled。個人使用目的不構成來源授權；沒有來源書面授權前不得自動讀取、展示或保留房源內容。

## Known Risks

Owner 確認沒有來源使用授權且用途僅限個人。591 要求明確授權自動擷取，信義條款禁止非人為自動讀取，永慶未經正式書面同意不得轉貼節錄。三站 API、原始 HTML／CSR、參數、robots、分頁、限速與欄位穩定性仍未驗證；公開頁可見及個人用途均不構成來源授權。

## Source Feasibility

### 591

- 狀態：未授權 / disabled；官方條款要求明確授權後才可連續自動擷取。
- 欄位／圖片與保存：未找到本專案可用的欄位、圖片或房源保留授權；頻率/API 未核定。

### 信義

- 狀態：未授權 / disabled；官方條款禁止非人為自動截取、點擊及重複讀取。
- 欄位／圖片與保存：未找到本專案可用的欄位、圖片或房源保留授權；頻率/API 未核定。

### 永慶

- 狀態：未授權 / disabled；條款要求正式書面同意方可轉貼節錄，未查得自動存取授權。
- 欄位／圖片與保存：未找到本專案可用的欄位、圖片或房源保留授權；頻率/API 未核定。

## Next Ticket

工作 [Fixture 搜尋垂直路徑](tickets/20260929-fixture-search-slice.md)、[篩選與保守去重](tickets/20260929-filter-dedup.md) 與 [響應式與錯誤狀態](tickets/20260929-responsive-failures.md) 均已接受。響應式與錯誤狀態提交 `645ce40` 已推送，遠端 SHA 相同；Vercel Preview `house-search-nc8xy2q4m-psycho909s-projects.vercel.app` 為 Ready，320px、桌面、抽屜鍵盤與無結果狀態手測通過。來源使用授權票已完成：目前沒有任何來源授權且用途僅限個人，故三個 Adapter 及依賴 Adapter 的[整合驗證與部署候選](tickets/20260929-integration-release.md)維持 blocked。未做 Production 部署。

## Recommended Next Command

本專案暫停新增功能開發。只有取得至少一個來源的書面授權，列明存取頻率、欄位、圖片與保存期限後，才重開對應 Adapter 票；目前只保留既有 fixture 示範。

## Do Not Do

不繞過 CAPTCHA、登入或反爬限制；不猜 API/DOM；不把 fixture 當成真實房源；不進行全台預抓、資料庫建置或未授權部署。

## Verification

本機驗證：最新 `npm test` 25/25、`npm run typecheck`、`npm run build`、`git diff --check` 通過。Vercel Preview `house-search-nc8xy2q4m-psycho909s-projects.vercel.app` 對應程式提交 `645ce40` 且為 `Ready`；瀏覽器 320px 無水平溢出，篩選抽屜焦點移入、Tab／Shift+Tab 限制、Esc 與完成設定關閉及焦點還原通過；桌面 1060px 篩選維持 inline；總價下限 2000 萬顯示無符合結果，仍將合成 fixture 成功 0 筆與三個未啟用來源分開呈現。未做 Production 部署或 live Adapter 測試。詳見各 [已接受票據](tickets/README.md)。
