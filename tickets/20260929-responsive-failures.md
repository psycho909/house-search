# 完成響應式與錯誤狀態

- Status: in_progress
- Owner: 本專案請求者
- Approver: 本專案請求者（2026-09-29 本 Session 明確核准）
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/filter-dedup（已核對目前工作分支）
- Git / Remote authority: Owner 已核准此 Scope；依 README 推送目前工作分支。既有 Preview 核准適用此分支；不含 Production 部署。

## Goal

完成響應式與錯誤狀態。

## Scope

完成手機篩選抽屜、載入中、部分結果、逾時、無結果、無來源等狀態。

## Files

src/app/、tests/、docs/UI-UX-DESIGN.md

## Out of Scope

地圖、動畫、會員

## Acceptance

- [ ] 320px、桌面和鍵盤可操作；失敗來源有明確提示；無來源不誤顯示無房源。

## Test

fixture 狀態測試及真實瀏覽器手測。

## Constraints and Decisions

2026-09-29 Owner 於目前 Session 核准「核准並開始」；狀態由 draft 經 approved 進入 in_progress。

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Dependencies satisfied: 20260929-fixture-search-slice and 20260929-filter-dedup are accepted.

## Evidence

- Verification: `npm test` 25/25、`npm run typecheck`、`npm run build`、`git diff --check` 通過；Preview 瀏覽器手測待部署後完成。
- Review / Audit: 獨立 L2 review 完成；兩項錯誤呈現與 modal inert 問題已修正，複查無新 blocker。
- Commit / PR: 待提交至核准分支。
