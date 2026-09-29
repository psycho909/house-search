# 確認來源使用授權

- Status: accepted
- Owner: 本專案請求者
- Approver: 本專案請求者（2026-09-29 本 Session 明確核准）
- Risk: L2
- Updated: 2026-09-29
- Branch: feature/filter-dedup（已核對目前工作分支）
- Git / Remote authority: Owner 已核准此 Scope；依 README 推送目前工作分支，不含 PR、Merge 或部署。

## Goal

確認來源使用授權。

## Scope

逐一確認 591、信義、永慶可用的存取、展示、資料保留與圖片方式；形成可核查的書面決策。

## Files

docs/SOURCE-FEASIBILITY.md；必要的來源授權證據位置，不提交秘密

## Out of Scope

實作 Adapter、部署、繞過限制

## Acceptance

- [x] 三來源各有允許或拒絕/待授權狀態，列出請求頻率、欄位、展示／圖片方式與保留限制；明列 Owner 已確認無來源授權、僅個人使用，未授權維持 disabled。

## Test

人工核對各來源正式條款、授權紀錄與文檔一致；不得執行未授權擷取。

## Constraints and Decisions

2026-09-29 Owner 回覆指定「確認來源使用授權」，依前一訊息確認為開始本票既定範圍；只核對官方正式條款與既有授權記錄，不聯絡來源、不登入、不擷取內容。

2026-09-29 Owner 確認目前沒有任何來源使用授權，使用目的僅限個人；此用途不作為來源授權或自動存取許可。

遵守 SPEC.md 與來源許可關卡；不可自行擴張到未授權站點。

## Dependencies and Blockers

Blocked by: 無。

## Evidence

- Verification: 人工閱讀 591、信義、永慶官方條款並記錄請求頻率、欄位、圖片、保留期限及各自缺口；未發送擷取請求。結果見 `docs/SOURCE-FEASIBILITY.md`。
- Review / Audit: Independent L2 reviewer completed Standards/Spec review. The initial ticket/TODO/HANDOFF closure mismatch was fixed; the final snapshot had no further findings. Reviewer did not independently fetch source pages per instruction; Primary Agent directly checked the official terms linked in `docs/SOURCE-FEASIBILITY.md`. Reviewer runtime identified Codex/GPT-6 family; exact model variant and reasoning effort were unavailable. No Independent Audit was triggered.
- Commit / PR: Source permission decision committed and pushed to `feature/filter-dedup`; no PR or merge. Branch SHA verified at completion; no direct deployment.
