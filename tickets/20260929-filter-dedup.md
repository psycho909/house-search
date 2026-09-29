# 完成篩選與保守去重

- Status: blocked
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/filter-dedup
- Git / Remote authority: Owner 於 2026-09-29 核准本票 Scope；本機實作、驗證與 commit 已授權。此前 fixture 票的 Preview deployment 範圍決策仍未完成；此分支推送會一併發布其基底 commit，故暫不推送。

## Goal

完成篩選與保守去重。

## Scope

在 fixture 路徑加入總價、單價、坪數、格局、屋齡、車位、關鍵字及重複標記。

## Files

CHANGELOG.md、HANDOFF.md、SPEC.md、TODO.md、src/domain/、src/server/、src/app/、tests/

## Out of Scope

真站 Adapter、NLP、歷史資料、房屋類型篩選（類型字典待確認）

## Acceptance

- [ ] 缺欄位不會匹配啟用條件；關鍵字可匹配社區；跨來源疑似重複仍保留兩個連結。

## Test

固定 fixtures 的單元測試、API route 整合測試、typecheck 與 production build；瀏覽器 UI smoke test 完成後才能驗收。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

搜尋請求維持 `{ city, district, filters }`；總價、單價、建坪與屋齡範圍端點包含在內、數值不得超過 `Number.MAX_SAFE_INTEGER`；房數多選為 OR，其餘條件為 AND。任一啟用條件遇到缺值時排除；只有該房源未因其他已知條件確定排除時，才計入 `excludedBecauseUnknown`。車位「無」只匹配明確 `false`；關鍵字以正規化後的字面搜尋比對標題、社區與地址。精確重複只合併同來源 ID／canonical URL；跨來源疑似同屋只加標記，保留各 Listing 與其 URL。單價只使用 fixture 已給值，不由總價或坪數推算。

## Dependencies and Blockers

依賴：fixture 搜尋路徑在本機基底 commit `5589551`。Owner 尚未決定是否允許此分支 push 觸發 Vercel Preview；目前 UI 瀏覽器 smoke test 也因 CUA 對 localhost 的安全政策未能執行。

## Evidence

- Verification: `npm test` 18/18、`npm run typecheck`、`npm run build`、`git diff --check` 通過。API route 測試覆蓋總價、單價、建坪、屋齡、格局、車位、關鍵字、缺值及去重；瀏覽器 UI 手動操作尚未驗證，因 CUA 阻擋本機 URL，未嘗試繞過。
- Review / Audit: 獨立 L2 reviewer 的 Standards／Spec review 無可行動 finding，未觸發 Independent Audit。初審的單價範圍、未知計數語意與數值上限差異已修正並重驗。
- Commit / PR: 本機 commit 已授權；remote push／PR 未授權，等待 Owner 決定 Preview 範圍。
