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
- Working tree: 實作 commit 已推送；目前更新中的部署失敗紀錄待本機 commit／push。
- Sync target: `origin/feature/filter-dedup`（目前遠端 SHA `09b0de1d3f813d7044d04fd3771ee99b869880c0`）

## Goal and Acceptance
實作 fixture 搜尋篩選與保守去重。程式、API 測試、production build 與 L2 review 已完成；branch Preview 部署失敗，UI smoke test 未完成，Acceptance 尚未勾選。

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
- Owner 已明確核准推送 `feature/filter-dedup` 並建立 Vercel Preview；未核准 Production 部署。
- `origin/feature/filter-dedup` 已核對指向 `09b0de1d3f813d7044d04fd3771ee99b869880c0`。
- CUA 安全政策拒絕本機 URL；未使用替代瀏覽器或間接執行方式繞過。

## Changed Files
`CHANGELOG.md`, `HANDOFF.md`, `SPEC.md`, `TODO.md`, `src/app/page.tsx`, `src/domain/search.ts`, `src/server/search.ts`, `tests/search.test.ts`, `tickets/20260929-filter-dedup.md`, `.scratch/20260929-filter-dedup/handoff.md`。

## Verification
- `npm test`: 18/18 passed。
- `npm run typecheck`: passed。
- `npm run build`: passed。
- `git diff --cached --check`: passed after staging the final handoff and documents.
- UI browser smoke test: unverified; CUA rejected `http://127.0.0.1:3000` by browser security policy.
- Remote sync: `git push -u origin feature/filter-dedup` 成功；`git ls-remote` SHA 與本機 HEAD 相同。
- Preview: Vercel deployment `AMcRPfHZU8cFmpEFbj9JYJ4tAdUn` failed；Vercel dashboard 需登入才能讀取 logs，CLI 未安裝／專案未連結。
- Review: independent L2 Standards／Spec review passed; no actionable findings; no Independent Audit trigger.

## Blockers
- Vercel Preview build failed；deployment logs 尚未取得。
- Preview domain 要求 Vercel sign-in；UI runtime interaction 尚未確認。

## Next Action
Owner opens the linked Vercel deployment logs and supplies the build error summary, with secrets removed.
