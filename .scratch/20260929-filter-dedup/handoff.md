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
- Working tree: 篩選實作與前次 handoff 更新已推送；`vercel.json` framework 修正與部署證據更新待 commit／push。
- Sync target: `origin/feature/filter-dedup`（目前遠端 SHA `093edca1a2e28c0edfb4692721cf8808015df755`）

## Goal and Acceptance
實作 fixture 搜尋篩選與保守去重。程式、API 測試、production build 與 L2 review 已完成。Vercel Preview 的 Next.js build 成功，但因輸出目錄設定錯誤而失敗；已新增 framework 修正，待新 Preview 驗證。UI smoke test 未完成，Acceptance 尚未勾選。

## Completed
- 加入總價、單價、建坪、屋齡、格局、車位與關鍵字篩選；缺值不匹配，單價不由總價或坪數推算。
- 同來源精確重複保留最新 timestamp；跨來源疑似重複只標記並保留兩個合成連結。
- 對齊 `SPEC.md` 的查詢契約、數值上限與未知資料計數語意。
- 獨立 L2 Standards／Spec review 無可行動 finding。

## Remaining
- commit/push Next.js framework 設定修正至已核准分支，確認新 Preview 建置成功。
- 在可存取的 Preview 網址手動確認 UI 篩選輸入、待搜尋條件及結果畫面。

## Decisions
- 本機施工、驗證與 commit 已由 Owner 核准。
- Owner 已明確核准推送 `feature/filter-dedup` 並建立 Vercel Preview；未核准 Production 部署。
- `origin/feature/filter-dedup` 已核對指向 `093edca1a2e28c0edfb4692721cf8808015df755`。
- Vercel CLI 61.0.0 已安裝；最新 deployment log 證實 Next.js build 完成後，平台因找不到設定的 `public` output directory 而失敗。`vercel.json` 已明確指定 `framework: nextjs`。
- CUA 安全政策拒絕本機 URL；未使用替代瀏覽器或間接執行方式繞過。

## Changed Files
`CHANGELOG.md`, `HANDOFF.md`, `SPEC.md`, `TODO.md`, `vercel.json`, `src/app/page.tsx`, `src/domain/search.ts`, `src/server/search.ts`, `tests/search.test.ts`, `tickets/20260929-filter-dedup.md`, `.scratch/20260929-filter-dedup/handoff.md`。

## Verification
- `npm test`: 18/18 passed。
- `npm run typecheck`: passed。
- `npm run build`: passed。
- `git diff --cached --check`: passed after staging the final handoff and documents.
- UI browser smoke test: unverified; CUA rejected `http://127.0.0.1:3000` by browser security policy.
- Remote sync: 前一個文件 commit `093edca1a2e28c0edfb4692721cf8808015df755` 已推送；目前 `vercel.json` 修正與 handoff 更新尚未推送。
- Preview: Vercel deployment `dpl_46rAEj2K94kbAWk2MqoLKqNz2Uez` failed because output directory was set to `public`; logs 已由 Vercel CLI 讀取。Next.js framework override 待部署驗證。
- Review: independent L2 Standards／Spec review passed; no actionable findings; no Independent Audit trigger.

## Blockers
- 新 Vercel Preview 尚未驗證；UI smoke test 尚未完成。
- 先前 Preview domain 在 CUA 顯示 Vercel sign-in；若新 Preview 仍受保護，Owner 需在可登入的瀏覽器完成 smoke test。

## Next Action
Review the diff, commit/push the Next.js framework override to the authorized branch, then inspect the resulting Preview build and run UI smoke if accessible.
