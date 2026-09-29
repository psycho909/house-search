# 建立 fixture 搜尋垂直路徑

- Status: blocked
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/fixture-search-slice
- Git / Remote authority: Owner 於 2026-09-29 在 Codex Session 核准本票 Scope；本機施工與驗證已授權。依 README 與本票 Out of Scope，不推送會觸發 Vercel Preview／Production deployment 的分支。

## Goal

建立 fixture 搜尋垂直路徑。

## Scope

建立 Next.js/TypeScript/Tailwind scaffold、查詢表單、Server API、固定非真站 fixture Adapter、結果列表與最小自動測試。

## Files

package.json、src/app/、src/domain/、src/server/、tests/、README.md

## Out of Scope

任何真站自動請求、資料庫、部署

## Acceptance

- [x] 有效城市/行政區提交可在 UI 顯示 fixture 房源與來源；無啟用 live source 時明示示範資料；README 有可執行的 build/test 命令。

## Test

執行本票新增的測試、typecheck/build，瀏覽器手測基本搜尋。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 程式與本機驗收已完成；等待 Owner 決定是否允許遠端 branch push 觸發 Vercel Preview deployment。此票將部署列為 Out of Scope，故目前只保留本機分支。

## Evidence

- Approval: Owner 於 2026-09-29 在 Codex Session 明確核准本票 Scope。
- Verification: `npm test` 3/3、`npm run typecheck`、`npm run build` 通過；瀏覽器手測新北市／新莊區回傳 1 筆標示為合成資料的 fixture。
- Review / Audit: Independent Spec review 無可行動發現。Independent Standards review 發現 1 項 P2 過期回應風險，已於送出期間停用縣市／行政區欄位修正；無其他可行動發現。修正後 `npm test` 3/3、`npm run typecheck`、`npm run build`、`git diff --check` 通過。
- Commit / PR: 本機分支保留此變更；不建立 PR、不推送。遠端任何 branch push 會觸發 Vercel deployment，超出本票 Scope。
