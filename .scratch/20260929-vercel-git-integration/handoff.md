# Task Handoff

## Identity

- Task: Vercel Git 自動部署連線
- Authority / Ticket: [tickets/20260929-vercel-git-integration.md](../../tickets/20260929-vercel-git-integration.md)
- Status: in_progress
- Updated: 2026-09-29
- Source environment: Codex desktop, Windows, `D:\Codex\house-search`
- Branch: main
- Remote: https://github.com/psycho909/house-search.git
- Base commit: `f3d136ab236ea24fcbcd41e1a6ccdd3337bbbecf`
- Working tree: 本次文件更新待提交；接手時以 `git status --short --branch` 重新核對
- Sync target: origin/main

## Goal and Acceptance

把指定 GitHub 倉庫接到 Vercel，main push 自動建立 Production deployment；以 Vercel 的 Git 設定及 Deployment commit/status 證明。正式條件以 Ticket 為準。

## Completed

核對 Git remote/main；使用者自行完成 GitHub sudo 密碼驗證，並明確確認把 `house-search` 加入既有 Vercel App 的 Selected repositories（原三庫保留）。Vercel 專案已從 GitHub 匯入；Git 設定顯示連接正確儲存庫，Overview 顯示 `main` Production deployment `READY`、commit `f3d136a`。公開根路徑實際為 404，因倉庫只有文件。未建立新 Git 倉庫。

## Remaining

推送本次文件更新，核對新 commit 是否自動產生 Production deployment 並記錄狀態；完成 Independent Audit 與 Owner 驗收。

## Decisions

使用者明確要求後續 Git 更新觸發 Vercel 自動部署；以 `main` 為 Production branch。倉庫目前只有文件，連線成功不等於可用網站。Vercel Connect 的第三方 OAuth token 功能不適用本任務；應使用 Vercel Git integration。

## Changed Files

`tickets/20260929-vercel-git-integration.md`、`README.md`、`TODO.md`、本 handoff。

## Verification

Vercel 專案 Overview：`https://vercel.com/psycho909s-projects/house-search`；Git 設定：`https://vercel.com/psycho909s-projects/house-search/settings/git`；首次 deployment `https://vercel.com/psycho909s-projects/house-search/6ZX3wJoWuuAQdsMDMvV5w1VRY9qp` 為 `READY`、來源 `main`、commit `f3d136a`。Production 網址根路徑顯示 `404 NOT_FOUND`。

## Blockers

尚無阻塞；等待 Git push 的自動部署證據與 Independent Audit。

## Next Action

驗證文件後推送 main，檢查 Vercel 是否自動部署新 commit。
