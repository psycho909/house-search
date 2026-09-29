# 整合驗證與部署候選

- Status: draft
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: main（施工時核對）
- Git / Remote authority: 草案無施工授權；核准後依 README 推送目前工作分支

## Goal

整合驗證與部署候選。

## Scope

核對已獲准來源與 UI 的整體行為，完成風險相稱測試並準備部署候選；部署需另行授權。

## Files

tests/、README.md、docs/SOURCE-FEASIBILITY.md

## Out of Scope

未授權來源啟用、默認部署、全台預抓

## Acceptance

- [ ] 在允許範圍內的來源整合搜尋有可重現證據；部分失敗正常；實際覆蓋來源與風險明示。

## Test

typecheck、build、整合／瀏覽器 smoke test，記錄部署前檢查結果。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 20260929-filter-dedup；20260929-responsive-failures；至少一個來源 Adapter 已獲准且完成。

## Evidence

- Verification: 待施工
- Review / Audit: 待施工
- Commit / PR: 待施工
