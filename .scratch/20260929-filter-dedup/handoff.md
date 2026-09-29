# Task Handoff

## Identity
- Task: 篩選與保守去重
- Authority / Ticket: [20260929-filter-dedup](../../tickets/20260929-filter-dedup.md)
- Status: done
- Updated: 2026-09-29
- Source environment: Codex desktop, Windows, `D:\Codex\house-search`
- Branch: `feature/filter-dedup`
- Remote: `origin`
- Base commit: `5589551606e25b49b261c5d1a8cc33a7507e8e4e`
- Working tree: 篩選實作與 Next.js framework 修正已推送；最新 Preview 已 Ready；UI smoke test 通過。本 handoff 隨完成更新同步，push 後核對本機與遠端 SHA。
- Sync target: `origin/feature/filter-dedup`（framework 修正 commit `96138e431a09e0b61fa7491ecbb0ed122de8a6a5` 已驗證推送；完成狀態含於本次 handoff 更新）

## Goal and Acceptance
實作 fixture 搜尋篩選與保守去重。程式、API 測試、production build、L2 review、Vercel Preview build 與 UI smoke test 均完成；Acceptance 已接受。

## Completed
- 加入總價、單價、建坪、屋齡、格局、車位與關鍵字篩選；缺值不匹配，單價不由總價或坪數推算。
- 同來源精確重複保留最新 timestamp；跨來源疑似重複只標記並保留兩個合成連結。
- 對齊 `SPEC.md` 的查詢契約、數值上限與未知資料計數語意。
- 獨立 L2 Standards／Spec review 無可行動 finding。

## Remaining
- Complete. 後續從 TODO 選擇下一張已核准 Ticket。

## Decisions
- 本機施工、驗證與 commit 已由 Owner 核准。
- Owner 已明確核准推送 `feature/filter-dedup` 並建立 Vercel Preview；未核准 Production 部署。
- `origin/feature/filter-dedup` 已包含 framework 修正 commit `96138e431a09e0b61fa7491ecbb0ed122de8a6a5`；本次 UI access 結果隨 handoff 同步。
- Vercel CLI 61.0.0 已安裝；deployment `dpl_EpRYXdmLfn2Ehxe6TNVMKrpQnTry` 狀態 `Ready`，log 證實 Next.js routes 已部署。根因為原設定尋找不存在的 `public` output directory；`vercel.json` 已明確指定 `framework: nextjs`。
- CUA 安全政策拒絕本機 URL；未使用替代瀏覽器或間接執行方式繞過。

## Changed Files
`CHANGELOG.md`, `HANDOFF.md`, `SPEC.md`, `TODO.md`, `vercel.json`, `src/app/page.tsx`, `src/domain/search.ts`, `src/server/search.ts`, `tests/search.test.ts`, `tickets/20260929-filter-dedup.md`, `.scratch/20260929-filter-dedup/handoff.md`。

## Verification
- `npm test`: 18/18 passed。
- `npm run typecheck`: passed。
- `npm run build`: passed。
- `git diff --cached --check`: passed after staging the final handoff and documents.
- UI browser smoke test: passed on the Preview URL; normalized community keyword returned fixture C, and 2／3-room OR returned 3 listings with both possible-duplicate listings and source links retained.
- Remote sync: implementation and Preview configuration were pushed; final handoff update is included in this completion push, with HEAD checked against `origin/feature/filter-dedup`.
- Preview: `dpl_EpRYXdmLfn2Ehxe6TNVMKrpQnTry` status `Ready`; Owner completed Vercel login in the browser and the deployed search results rendered.
- Review: independent L2 Standards／Spec review passed; no actionable findings; no Independent Audit trigger.

## Blockers
- 無。未核准 Production 部署或即時來源 Adapter。

## Next Action
Complete; use TODO.md to select the next approved ticket.
