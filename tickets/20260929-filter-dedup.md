# 完成篩選與保守去重

- Status: blocked
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/filter-dedup
- Git / Remote authority: Owner 於 2026-09-29 核准本票 Scope、本機 commit、`feature/filter-dedup` push 及其 Vercel Preview；未授權 Production 部署。

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

依賴：fixture 搜尋路徑在本機基底 commit `5589551`。Commit `09b0de1d3f813d7044d04fd3771ee99b869880c0` 已推送到 `origin/feature/filter-dedup`，並觸發 Vercel Preview；部署狀態為 failed。Vercel build logs 需要登入專案帳戶才能檢視，取得錯誤前無法修復；UI smoke test 待 Preview 成功後執行。

## Evidence

- Verification: `npm test` 18/18、`npm run typecheck`、`npm run build`、`git diff --cached --check` 通過。API route 測試覆蓋總價、單價、建坪、屋齡、格局、車位、關鍵字、缺值及去重。遠端分支 SHA 與本機一致；Vercel Preview [deployment](https://vercel.com/psycho909s-projects/house-search/AMcRPfHZU8cFmpEFbj9JYJ4tAdUn) 回報 failed，build logs 尚未取得，因此瀏覽器 UI smoke test 未驗證。
- Review / Audit: 獨立 L2 reviewer 的 Standards／Spec review 無可行動 finding，未觸發 Independent Audit。初審的單價範圍、未知計數語意與數值上限差異已修正並重驗。
- Commit / PR: `09b0de1d3f813d7044d04fd3771ee99b869880c0` 已推送並核對 `origin/feature/filter-dedup` SHA；未建立 PR，未做 Production 部署。
