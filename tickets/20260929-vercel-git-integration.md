# 連接 GitHub 與 Vercel 自動部署

- Status: in_progress
- Owner: 本專案請求者
- Approver: 本專案請求者（本 Session 指定連接 Vercel，且 Git 更新後自動部署）
- Risk: L3
- Updated: 2026-09-29
- Branch: main
- Git / Remote authority: 可為此連線更新並推送專案文件；Vercel Git 整合與 main 自動部署由目前使用者明確授權；GitHub App 權限變更須遵守操作當下的確認要求

## Goal

將 `psycho909/house-search` 連接至 Vercel，使 `main` 的後續 push 自動觸發 Production deployment。

## Scope

核對 Vercel 帳戶與現有專案、GitHub App 對指定倉庫的權限、建立／連接 Vercel 專案、確認 Production branch 為 main、觀察 Git 觸發與部署結果，保存可接續證據。

## Files

本 Ticket；必要時 README.md／HANDOFF.md 更新連線與部署狀態。若為可部署性建立最小靜態入口，須先確認其內容與範圍。

## Out of Scope

房源搜尋功能、真站 Adapter、資料庫、custom domain、外部服務憑證、付費升級、繞過來源限制。

## Acceptance

- [x] Vercel 專案的 Git Repository 顯示 `psycho909/house-search`，Production branch 為 `main`。
- [ ] GitHub `main` push 在 Vercel 產生對應 commit 的自動 Deployment；READY 與失敗須分開記錄。
- [x] GitHub App 授權只擴至完成此任務所需範圍，且必要確認由使用者提供。
- [ ] 實際部署狀態、URL、Git SHA 與剩餘風險有可重現證據，必要 Independent Audit 已完成。

## Test

Vercel Project Settings 的 Git 設定、Vercel Deployments 的觸發 commit／狀態、GitHub 遠端 SHA、`git status --short --branch` 與文件檢查。僅有 Git push 不等於部署成功。

## Constraints and Decisions

目前 repository 只有文件，沒有 App；不得把 Vercel 專案建立成功當成可用網站。Production 操作遵守 [AI 治理規範](../docs/governance/ai-governance.md) 的 L3 獨立稽核與 Owner 最終核准。

## Dependencies and Blockers

GitHub 重新驗證與授權已完成。仍須以後續 `main` push 驗證自動部署，並完成獨立稽核。

## Evidence

- Verification: 使用者自行完成 GitHub Confirm access，並在本 Session 明確確認將既有 Vercel App 的 Selected repositories 從 3 個增加 `psycho909/house-search`，原三庫維持不變；Save 後 Vercel 匯入頁顯示該庫。建立 `psycho909's projects/house-search` 後，Vercel Git 設定顯示 Connected Git Repository `psycho909/house-search`；Overview 顯示 Production `main`、首次 deployment `READY`、commit `f3d136ab236ea24fcbcd41e1a6ccdd3337bbbecf`。公開網址 `https://house-search-iota.vercel.app/` 根路徑實際顯示 `404 NOT_FOUND`，因倉庫僅有文件。
- Permission scope: GitHub App 設定重新載入後仍為 `Only select repositories`、Selected 4 repositories（原三庫加 `house-search`），Save 為 disabled，證明已保存。既有 Vercel App 的權限為 Actions／metadata read；administration、checks、code、commit statuses、deployments、issues、pull requests、repository hooks、workflows read/write。這是 App 層權限，GitHub 此頁可限制 repository 範圍，無逐項編輯控制。Vercel [官方權限說明](https://vercel.com/docs/git/vercel-for-github#repository-permissions)列出既有 Repository Permissions 用途；[2026 年權限更新](https://vercel.com/changelog/vercel-github-app-updated-permissions)說明 Actions／Workflows 的新增用途。
- Review / Audit: 獨立 Auditor（GPT-6 Luna Max，未參與施工）唯讀檢查目前 staged／unstaged／untracked 範圍，見 [稽核報告](../reports/audit/20260929-vercel-git-integration.md)。先前指出 README 預稱後續 push 已驗證及 Acceptance 勾選落後證據，均已修正；後續 push 證據仍待補查。
- Commit / PR: 待完成
