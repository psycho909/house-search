# Task Handoff

## Identity
- Task: 篩選與保守去重
- Authority / Ticket: [20260929-filter-dedup](../../tickets/20260929-filter-dedup.md)
- Status: blocked
- Updated: 2026-09-29
- Source environment: Codex desktop, Windows, `D:\Codex\house-search`
- Branch: `feature/filter-dedup`
- Remote: `origin`
- Base commit: `5589551606e25b49b261c5d1a8cc33a7507e8e4e`
- Working tree: 本機 commit 已保存實作與此接續快照；尚未推送。
- Sync target: `origin/feature/filter-dedup`（未推送）

## Goal and Acceptance
實作 fixture 搜尋篩選與保守去重。程式、API 測試、production build 與 L2 review 已完成；瀏覽器 UI smoke test 未完成，Acceptance 尚未勾選。

## Completed
- 加入總價、單價、建坪、屋齡、格局、車位與關鍵字篩選；缺值不匹配，單價不由總價或坪數推算。
- 同來源精確重複保留最新 timestamp；跨來源疑似重複只標記並保留兩個合成連結。
- 對齊 `SPEC.md` 的查詢契約、數值上限與未知資料計數語意。
- 獨立 L2 Standards／Spec review 無可行動 finding。

## Remaining
- 由 Owner 手動確認 UI 的篩選輸入、待搜尋條件及結果畫面。
- Owner 決定是否允許推送此分支及其連帶觸發的 Vercel Preview。

## Decisions
- 本機施工、驗證與 commit 已由 Owner 核准。
- `feature/filter-dedup` 包含 fixture 票的本機基底 commit；該票將部署列為 Out of Scope，因此未獲決定前不 push。
- CUA 安全政策拒絕本機 URL；未使用替代瀏覽器或間接執行方式繞過。

## Changed Files
`CHANGELOG.md`, `HANDOFF.md`, `SPEC.md`, `TODO.md`, `src/app/page.tsx`, `src/domain/search.ts`, `src/server/search.ts`, `tests/search.test.ts`, `tickets/20260929-filter-dedup.md`, `.scratch/20260929-filter-dedup/handoff.md`。

## Verification
- `npm test`: 18/18 passed。
- `npm run typecheck`: passed。
- `npm run build`: passed。
- `git diff --cached --check`: passed after staging the final handoff and documents.
- UI browser smoke test: unverified; CUA rejected `http://127.0.0.1:3000` by browser security policy.
- Review: independent L2 Standards／Spec review passed; no actionable findings; no Independent Audit trigger.

## Blockers
- Branch push would create a Vercel Preview; Owner has not authorized that deployment scope.
- UI runtime interaction still needs manual confirmation.

## Next Action
Owner decides whether pushing `feature/filter-dedup` and creating its Vercel Preview are authorized.
