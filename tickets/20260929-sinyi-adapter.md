# 接入獲准的信義來源

- Status: draft
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: main（施工時核對）
- Git / Remote authority: 草案無施工授權；核准後依 README 推送目前工作分支

## Goal

接入獲准的信義來源。

## Scope

在來源授權與低頻探測通過後，只建立信義 Adapter 與映射。

## Files

src/adapters/sinyi/、tests/、docs/SOURCE-FEASIBILITY.md

## Out of Scope

反爬繞過、大量抓取、其餘兩站

## Acceptance

- [ ] 記錄明確許可與已核實入口/欄位；單站故障隔離；未過關則不啟用。

## Test

使用經允許的去個資 fixture 測試；live smoke test 僅在授權允許時執行。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 20260929-source-permission；20260929-fixture-search-slice。

## Evidence

- Verification: 待施工
- Review / Audit: 待施工
- Commit / PR: 待施工
