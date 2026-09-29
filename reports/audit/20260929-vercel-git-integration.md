# Vercel Git 整合獨立稽核

- Task: [連接 GitHub 與 Vercel 自動部署](../../tickets/20260929-vercel-git-integration.md)
- Date: 2026-09-29
- Baseline: `f3d136ab236ea24fcbcd41e1a6ccdd3337bbbecf`
- Reviewer: 獨立 Auditor，GPT-6 Luna Max；未參與施工，唯讀審查
- Scope: `README.md`、`TODO.md`、`tickets/20260929-vercel-git-integration.md`、`.scratch/20260929-vercel-git-integration/handoff.md` 的工作樹內容，以及主 Agent 提供的 GitHub／Vercel UI 證據

## Standards

GitHub App 安裝限定 `Only select repositories`，原三庫加 `house-search`；使用者在 Save 前明確確認。App 權限含多項 read/write，屬既有 Vercel App 權限，已在 Ticket 逐項揭露與連結官方用途說明；GitHub 此頁無單項修改入口。Ticket／TODO／handoff 均為 `in_progress`。未發現權限範圍超出使用者確認的 repository 集合。

## Spec

Vercel Git 設定顯示 `psycho909/house-search`，首次從 `main` 部署 `f3d136a` 為 `READY`。此為匯入時部署，不能替代後續 `main` push 的自動觸發驗證。公開根路徑 404 與 docs-only 倉庫相符，已明示。後續 push 的 Deployment SHA、狀態與 URL 待確認。

## Findings and disposition

1. README 曾把後續 push 自動部署寫成已驗證事實；已改成「驗證進行中」。
2. Ticket 的 Git 連線與授權 Acceptance 曾未勾選；已依現有證據勾選。

目前可推送文件驗證自動部署；不得在取得後續 push 證據前宣稱整合全部驗收。推送後補查 Deployment，再由 Owner 依 L3 規範最終核准。

## Verification limit

Auditor 未直接操作 GitHub／Vercel UI；外部設定與部署狀態由主 Agent 的 UI 證據提供。文件檢查不等同可用網站或搜尋功能驗證。
