# 建立 fixture 搜尋垂直路徑

- Status: accepted
- Owner: 本專案請求者
- Approver: 本專案請求者
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/fixture-search-slice
- Git / Remote authority: Owner 於 2026-09-29 核准本票 Scope 及本機施工；之後明確核准 `feature/filter-dedup` push 與 Vercel Preview。該分支包含本票 commit `5589551`；未推送本票原分支、未做 Production deployment。

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

Blocker resolved：本票 acceptance 於本機已完成；Owner 後續核准的 `feature/filter-dedup` Preview 含本票 commit `5589551`，build Ready 且 UI smoke 確認搜尋結果。未做 Production deployment。

## Evidence

- Approval: Owner 於 2026-09-29 在 Codex Session 明確核准本票 Scope。
- Verification: `npm test` 3/3、`npm run typecheck`、`npm run build` 通過；瀏覽器手測新北市／新莊區回傳 1 筆標示為合成資料的 fixture。
- Preview: 後續核准分支 `feature/filter-dedup` 含 commit `5589551`；Vercel deployment [Ready](https://vercel.com/psycho909s-projects/house-search/iUMuwtB25XzfWGASvyPQqma8W15a)，UI smoke test 在新北市／新莊區回傳固定合成 fixture，並明示不是真實房源。
- Review / Audit: Independent Spec review 無可行動發現。Independent Standards review 發現 1 項 P2 過期回應風險，已於送出期間停用縣市／行政區欄位修正；無其他可行動發現。修正後 `npm test` 3/3、`npm run typecheck`、`npm run build`、`git diff --check` 通過。
- Commit / PR: `feature/fixture-search-slice` 保留本地；commit `5589551` 透過後續核准的 `feature/filter-dedup` 分支進入 Preview。未為本票建立 PR，未做 Production deployment。
