# 完成響應式與錯誤狀態

- Status: draft
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: main（施工時核對）
- Git / Remote authority: 草案無施工授權；核准後依 README 推送目前工作分支

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

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 20260929-fixture-search-slice；20260929-filter-dedup。

## Evidence

- Verification: 待施工
- Review / Audit: 待施工
- Commit / PR: 待施工
