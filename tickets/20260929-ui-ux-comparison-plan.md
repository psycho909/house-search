# 規劃比較清單 UI／UX

- Status: accepted
- Owner: 本專案請求者
- Approver: 本專案請求者（本 Session 指定 frontend-design 並選定「比較清單」）
- Risk: L2
- Updated: 2026-09-29
- Branch: main
- Git / Remote authority: 依 README 對已核准且驗證通過的文件更新 commit／push；無實作或部署授權

## Goal

把比較清單方向整理為可供後續 UI Ticket 實作與驗收的深度規劃。

## Scope

更新 `docs/UI-UX-DESIGN.md`，包含視覺 token、版面、搜尋及篩選互動、房源比較、來源狀態、響應式、無障礙與驗收方法。

## Files

docs/UI-UX-DESIGN.md；本 Ticket。

## Out of Scope

任何 UI 程式碼、圖片資產、真站資料、部署、改動 SPEC 的產品規則。

## Acceptance

- [x] 比較清單有清楚的桌面與手機資訊層級、線框及設計 token。
- [x] 搜尋、缺值、部分失敗、無來源、疑似重複等狀態符合 SPEC 與來源授權邊界。
- [x] 包含可驗證的鍵盤、手機、對比度與文案驗收。
- [x] 文件檢查與遠端 main 同步通過。

## Test

`git diff --check`、Markdown 相對連結檢查、人工對照 `SPEC.md`／`PROJECT.md` 與設計 skill 的 plan-review 要求；無 runtime UI 測試。

## Constraints and Decisions

採使用者選定的「比較清單」方向；來源圖片與即時內容在未授權前不作為設計成立的前提。

## Dependencies and Blockers

Blocked by: 無；使用者已選定視覺方向。

## Evidence

- Verification: `git diff --check` 與 29 份 Markdown 相對連結檢查通過；以計算式核對四組主要文字／底色對比度，成品 hover、focus、disabled 尚未驗證。無 UI runtime 或使用者測試。
- Review / Audit: 主 Agent 依 `docs/agents/review.md` 的 L2 fallback 自查 Standards（文件 Scope、來源授權與資料真實性）及 Spec（查詢、缺值、故障隔離、去重、320px）。修正了「已套用條件」與舊結果可能混淆的文案；未進行獨立 review。
- Commit / PR: 規劃提交 `1b76f8ff9e48bf99b1364c5e436519587ef416db` 已推送；`git fetch origin` 後 `HEAD == origin/main`。本票驗收狀態以後續提交保存；無 PR。
