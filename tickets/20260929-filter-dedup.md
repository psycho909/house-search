# 完成篩選與保守去重

- Status: draft
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: main（施工時核對）
- Git / Remote authority: 草案無施工授權；核准後依 README 推送目前工作分支

## Goal

完成篩選與保守去重。

## Scope

在 fixture 路徑加入價格、坪數、格局、屋齡、車位、關鍵字及重複標記。

## Files

src/domain/、src/server/、src/app/、tests/

## Out of Scope

真站 Adapter、NLP、歷史資料

## Acceptance

- [ ] 缺欄位不會匹配啟用條件；關鍵字可匹配社區；跨來源疑似重複仍保留兩個連結。

## Test

固定 fixtures 的單元測試及 UI/API 整合測試。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 20260929-fixture-search-slice。

## Evidence

- Verification: 待施工
- Review / Audit: 待施工
- Commit / PR: 待施工
