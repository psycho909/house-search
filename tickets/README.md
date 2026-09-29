# Ticket Convention

本專案的正式 Work Authority 是 `tickets/*.md`。一個 Ticket 保存一個工作的 Requirement、Scope、Acceptance、授權與最終證據；`TODO.md` 只索引未完成 Ticket，`.scratch` 只保存跨環境接續快照。

## 命名與讀取

- 檔名：`<YYYYMMDD-short-title>.md`；同日同名時加簡短序號。
- 開始工作前只讀目前 Ticket；沒有正式 Ticket 的 L1 工作，必須有 Owner 在目前 Session 的明確授權。
- Ticket 保存最新決策與精簡證據，不附加逐回合日誌或完整命令輸出。

## 固定格式

```md
# <Title>

- Status: draft | approved | in_progress | returned | blocked | accepted | archived
- Owner:
- Approver:
- Risk: L1 | L2 | L3
- Updated: YYYY-MM-DD
- Branch:
- Git / Remote authority:

## Goal
## Scope
## Out of Scope
## Acceptance
- [ ] <可驗證條件>

## Constraints and Decisions
## Dependencies and Blockers
## Evidence
- Verification:
- Review / Audit:
- Commit / PR:
```

## 狀態與完成

- `draft` 不得施工；Owner／Approver 核准後改為 `approved`。
- 施工時使用 `in_progress`；需要新決策或外部條件時使用 `returned` 或 `blocked`。
- Acceptance 全部具有可重現證據後，由 Final Reviewer 改為 `accepted`；L3 仍需要 Owner 最終核准。
- `accepted` Ticket 保留為歷史正本並從 `TODO.md` 移除；只在專案政策要求時改為 `archived`。

完成條件：Ticket 能單獨回答誰授權、允許做什麼、如何驗收、目前狀態與證據位置，且沒有與 TODO、handoff 或其他 Ticket 重複的目前狀態正本。
