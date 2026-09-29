# 建立跨房屋搜尋 MVP 專案規格

- Status: accepted
- Owner: 本專案請求者
- Approver: 本專案請求者（本 Session 貼上的任務與指定的 GitHub URL）
- Risk: L2
- Updated: 2026-09-29
- Branch: main
- Git / Remote authority: 任務明示初始化、commit 並 push 至 `https://github.com/psycho909/house-search.git`；不含部署或未授權來源請求

## Goal

建立可接續的 MVP 規格、來源風險調查、正式後續票與 Git 交接。

## Scope

初始化 Git；補完 README、PROJECT、SPEC、TODO、架構、UI、來源可行性、HANDOFF；建立後續草案票；文件驗證並 push。

## Files

README.md、PROJECT.md、SPEC.md、TODO.md、HANDOFF.md、docs/ARCHITECTURE.md、docs/UI-UX-DESIGN.md、docs/SOURCE-FEASIBILITY.md、tickets/*.md、.gitignore。

## Out of Scope

正式功能實作、真站自動擷取、API 探測、部署、資料庫。

## Acceptance

- [x] 指定遠端 main 包含全部規格文件和可接續票。
- [x] 來源調查分清已驗證與 Need Verification，違反條款的來源不宣稱可抓取。
- [x] 文件連結、Ticket 欄位、Git diff 與遠端 commit 經核對。

## Test

`git diff --check`、相對連結與 Ticket 欄位檢查、人工 Spec／Standards review、`git fetch origin` 後比較 `HEAD` 與 `origin/main`。

## Constraints and Decisions

本票由目前 Session 的使用者明確授權；後續票仍為 draft。根 `HANDOFF.md` 是使用者指定的交接入口，正式工作狀態以 tickets 為正本。

## Dependencies and Blockers

遠端目前無分支；需完成首次 push。591／信義條款限制自動擷取，此風險不阻擋文件規劃，但阻擋後續 live Adapter。

## Evidence

- Verification: 28 份 Markdown 相對連結檢查通過；9 張票必要欄位檢查通過；`git diff --cached --check` 通過。無 runtime／真站 Adapter 驗證。
- Review / Audit: 主 Agent 自查 Standards（Scope、授權、來源限制）與 Spec（必填／缺值／故障隔離／去重／UI 狀態）；未委派獨立 reviewer，L2 採 `docs/agents/review.md` 的主 Agent fallback。剩餘風險：來源授權、API 與 runtime 尚未驗證，均由後續草案票處理。
- Commit / PR: 首次規格提交 `17b5d0533430a417d9012cfe5ec74d1d72e20c85` 已推送；`git fetch origin` 後 `HEAD == origin/main`。本票結案狀態另以後續提交保存；無 PR。
