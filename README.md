# 跨房屋交易網搜尋器

台灣買屋搜尋 MVP 的規格與可行性專案。使用者以縣市、行政區及選填條件搜尋，系統在**取得來源授權與技術驗證後**，由伺服器整合可用來源的候選物件。現階段只有文件，**沒有可執行的搜尋器或即時資料**。

## Vercel 部署

本倉庫的 `main` 已連接 [Vercel 專案](https://vercel.com/psycho909s-projects/house-search)，Production 網址為 [house-search-iota.vercel.app](https://house-search-iota.vercel.app/)。目前沒有網站入口，根路徑會顯示 404；Vercel 部署成功只代表 Git 建置管線可運作，不代表搜尋器已上線。已以 `main` 推送驗證 Vercel 自動建立 Production deployment；後續更新的實際狀態與 commit 請在 [Deployments](https://vercel.com/psycho909s-projects/house-search/deployments) 核對。

## 快速開始

目前無 runtime 或安裝步驟。從 [PROJECT.md](PROJECT.md) 了解目標、[SPEC.md](SPEC.md) 了解契約、[TODO.md](TODO.md) 選下一張票；來源使用前先讀 [可行性調查](docs/SOURCE-FEASIBILITY.md)。

## Work Authority 與 Git handoff

- Work Authority：Git 追蹤的 [`tickets/*.md`](tickets/README.md)。未核准票不得施工。
- Owner／Approver：本專案的請求者；GitHub 倉庫 `psycho909/house-search` 的存取權由實際帳戶權限決定，不由倉庫名稱推定身分。
- L1 單一 Session 直接授權：Owner 在當前 Session 明確指定、低風險且可逆時允許。
- Git commit／push：已核准且驗證通過的更新可推送目前工作分支；PR、merge、deploy 另依授權。
- 跨 Session 未完成工作：依 [Handoff Workflow](docs/HANDOFF.md) 保存在 `.scratch/<task>/handoff.md`；本次規劃的交接概覽另見 [HANDOFF.md](HANDOFF.md)。

## 角色與模型

| 角色 | 身分 | 權責 |
| --- | --- | --- |
| Orchestrator／Final Reviewer | 當前主 Agent | 決策、整合、驗證與一般驗收 |
| Developer | 以 `.codex/agents/luna_worker.toml` 為目標 profile；可用性依 [Subagent 規則](docs/SUBAGENTS.md) 確認 | 明確委派的施工 |
| Independent Auditor | 未參與施工的獨立 context | 觸發獨立稽核時檢查；L3 仍由 Owner 最終核准 |

## 驗證

| 變更類型 | 首選驗證 | 限制 |
| --- | --- | --- |
| 文件／Ticket | 專案根目錄執行 `git diff --check`、檢查相對連結與 Ticket 欄位，再人工對照 [SPEC.md](SPEC.md) | 只證明文件一致性，不證明網站可抓取或功能可運作 |
| 程式模組／API／UI／設定 | N/A，尚無程式或測試入口；scaffold Ticket 必須補上可重複執行的命令 | 不預稱 typecheck、build、E2E 已通過 |
| 資料遷移 | N/A，MVP 不建立資料庫 | — |

## 架構導覽

目前只有規格與工作票。預計資料流：Browser → Next.js Server API → 各來源 Adapter → 正規化 → 本地篩選 → 審慎去重 → 結果列表。實際整合須通過來源條款、授權及技術可行性關卡。

## 文件索引

- [AGENTS.md](AGENTS.md)、[PROJECT.md](PROJECT.md)、[SPEC.md](SPEC.md)、[TODO.md](TODO.md)
- [架構](docs/ARCHITECTURE.md)、[UI／UX](docs/UI-UX-DESIGN.md)、[來源可行性](docs/SOURCE-FEASIBILITY.md)、[交接](HANDOFF.md)
- [工程方法](docs/development/ai-development-guide.md)、[治理](docs/governance/ai-governance.md)、[Work Authority](docs/agents/work-authority.md)、[Ticket Convention](tickets/README.md)
- [Skill Workflows](docs/agents/skill-workflows.md)、[Review](docs/agents/review.md)、[Handoff Workflow](docs/HANDOFF.md)、[Subagents](docs/SUBAGENTS.md)

## 專案設定檔

小型、規格階段；目前無正式應用程式。行為實作時依根 `AGENTS.md` 及對應 Ticket 補足契約和驗證。
