# QA / Integration Checklist

This checklist is scoped to the two roadmap steps currently in flight:

1. Multi-encounter inbox (state transitions, expiry, save/load, UI).
2. Response pool semantics (once + secret gating, TS/WASM parity).

## 1) Multi-encounter inbox

### Data model + invariants
- [x] Replace single `pendingEncounter: SecondaryEncounter | null` with an inbox representation (e.g. `encounterInbox: SecondaryEncounter[]`) or equivalent.
- [x] Define and enforce invariants:
  - [x] Stable `id` per encounter; no duplicates.
  - [x] Deterministic ordering (sorted by `expiresOnTurn`, then `id`) so save/load and UI are stable.
  - [x] Clarify whether “addressing” an encounter removes it immediately or only after resolution. (After resolution.)
  - [x] Clarify whether generating a new encounter when the inbox is “full” drops/merges/queues. (Drops new encounters beyond `MAX_PENDING_ENCOUNTERS`.)

### State transitions (engine)
- [x] Encounter generation appends to inbox without overwriting existing encounters.
- [x] Address flow:
  - [x] From hub: selecting an encounter enters its dialogue node.
  - [x] From non-hub dialogues: inbox is visible but actions are disabled.
  - [x] After resolving an encounter, the resolved encounter is removed from inbox.
- [x] Ensure engine rejects/ignores resolution choices for encounters not currently selected (prevents stale UI selections).

### Expiry semantics
- [x] Expiry is evaluated per-encounter each turn with clear semantics (`expiresOnTurn` inclusive).
- [x] Expired encounters:
  - [x] Have consequences applied exactly once.
  - [x] Are removed from inbox after expiry processing.
  - [x] If multiple expire on the same turn, consequences apply in deterministic order.
- [x] Verify interactions between expiry and “selected encounter in dialogue”:
  - [x] Encounter dialogues currently only contain non-turn-advancing actions (resolve or **Defer**). Expiry is evaluated only on turn advance, so an encounter cannot expire mid-dialogue.

### Save/load + migration
- [x] Persist inbox state in `src/game/storage.ts` schema.
- [x] Migrate older saves:
  - [x] v2 saves containing `pendingEncounter` load into the new inbox representation with a single entry.
  - [x] Load hydration for `currentDialogueId` continues to work when the dialogue id refers to an encounter.
- [x] Add/adjust storage tests to cover:
  - [x] round-trip save/load with multiple encounters.
  - [x] migration path from legacy `pendingEncounter`.

### UI / UX
- [x] Replace single “Pending encounter” prompt with “Inbox” semantics:
  - [x] Hub prompt shows count (e.g. “2 encounters awaiting review”).
  - [x] Info panel shows a list (title, short description, expiry indicator).
  - [x] Selecting an encounter highlights it on the map (route/region highlight).
- [x] Ensure accessibility:
  - [x] list items are keyboard-focusable.
  - [x] buttons have meaningful labels/tooltips.
- [x] Ensure no UI runtime errors when inbox is empty, has one item, or many.

### Regression tests to update/add
- [x] Update existing encounter-related tests to the new model:
  - `src/game/engine/pendingEncounterExpiry.test.ts`
  - `src/game/engine/encounterResolution.test.ts`
  - `src/components/GameScreen.encounterPrompt.test.tsx`
  - `src/game/useGameState.test.tsx`
- [x] Add a new engine integration test:
  - [x] Multiple encounters generated across turns are retained.
  - [x] Resolving one doesn’t affect others.
  - [x] Expiry removes only the expired subset and logs consequences once.

## 2) Response pool semantics (once + secret gating; TS/WASM parity)

### Semantics definition (must be explicit)
- [x] “Once” means:
  - [x] A choice can be selected at most once across the campaign.
  - [x] “Once” is keyed by `choice.id` (tracked via hidden `choice-used:<choiceId>` secrets).
- [x] “Secret gating” means:
  - [x] A choice is selectable only if the player knows a required secret.
  - [x] Gating supports a single required secret (AND semantics is implicit because it is one secret).

### Type-level changes
- [x] Extend `DialogueChoice` with fields required by these semantics:
  - [x] `once?: boolean`
  - [x] `requiresInfo?: string` / `forbidsInfo?: string`
- [x] Extend `GameState` with whatever needs persisting to support “once”:
  - [x] Implemented by persisting `knownSecrets` (includes hidden `choice-used:*` entries).

### TS engine behavior
- [x] TS engine enforces semantics even if UI is buggy:
  - [x] If a choice is gated and requirements aren’t met, `applyChoice` returns `prev`.
  - [x] If a choice is “once” and already used, `applyChoice` returns `prev`.
- [x] Choice availability affects UI rendering consistently:
  - [x] Response pool presentation hides gated/locked choices and caps visible choices at 8.
  - [x] once choices disappear after selection.

### WASM engine parity
- [x] `src/game/engine/uqmWasmConversationEngine.ts` graph compilation encodes the same availability rules.
- [x] WASM core fields/struct layout updated consistently across TS packing + C/WAT:
  - [x] JS-side packing (`writeGraphToWasm` layout)
  - [x] C/WAT side struct layout / accessors
  - [x] tests updated for size/offsets (ChoiceMeta = 30 bytes)
- [x] Parity tests cover:
  - [x] once choices: TS and WASM both prevent re-selecting.
  - [x] secret gating: TS and WASM both hide/lock until secret is learned.
  - [x] interaction of `override` with gating/once.

### Save/load + migration
- [x] Persist the new “once” tracking state.
- [x] Migrate older saves that lack the new field (default empty).

### Regression tests to update/add
- [x] Add engine tests around choice availability filtering.
- [x] Extend `src/game/engine/uqmWasmConversationEngine.test.ts` for new semantics.

## Post-merge integration steps (commands)

Run these from the repo root:

```sh
npm test
npm run typecheck
```

### Manual smoke test (dev server)

```sh
npm run dev
```

Then, in the browser:
- [ ] Start a new game; verify the first dialogue renders and choices are clickable.
- [ ] Advance a few turns; confirm no console errors.
- [ ] Exercise encounter inbox UI:
  - [ ] list is visible, selecting works, addressing works.
  - [ ] expiry indicator updates as turns advance.
- [ ] Exercise response pool semantics:
  - [ ] gated choice is hidden/disabled until secret is learned.
  - [ ] once choice cannot be taken twice.
- [ ] Save to a slot and reload; verify inbox + once-state persist.

## Failure reporting template

When something fails, report:
- Command (or manual action) that failed
- Full error message
- File/line (or stack trace frame)
- Suggested fix (brief)
