# 建立 fixture 搜尋垂直路徑

- Status: draft
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: main（施工時核對）
- Git / Remote authority: 草案無施工授權；核准後依 README 推送目前工作分支

## Goal

建立 fixture 搜尋垂直路徑。

## Scope

建立 Next.js/TypeScript/Tailwind scaffold、查詢表單、Server API、固定非真站 fixture Adapter、結果列表與最小自動測試。

## Files

package.json、src/app/、src/domain/、src/server/、tests/、README.md

## Out of Scope

任何真站自動請求、資料庫、部署

## Acceptance

- [ ] 有效城市/行政區提交可在 UI 顯示 fixture 房源與來源；無啟用 live source 時明示示範資料；README 有可執行的 build/test 命令。

## Test

執行本票新增的測試、typecheck/build，瀏覽器手測基本搜尋。

## Constraints and Decisions

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 無；可與來源授權調查並行。

## Evidence

- Verification: 待施工
- Review / Audit: 待施工
- Commit / PR: 待施工
