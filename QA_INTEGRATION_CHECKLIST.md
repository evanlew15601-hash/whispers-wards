# QA / Integration Checklist

This checklist is scoped to the two roadmap steps currently in flight:

1. Multi-encounter inbox (state transitions, expiry, save/load, UI).
2. Response pool semantics (once + secret gating, TS/WASM parity).

## 1) Multi-encounter inbox

### Data model + invariants
- [ ] Replace single `pendingEncounter: SecondaryEncounter | null` with an inbox representation (e.g. `encounterInbox: SecondaryEncounter[]`) or equivalent.
- [ ] Define and enforce invariants:
  - [ ] Stable `id` per encounter; no duplicates.
  - [ ] Deterministic ordering (e.g. by `expiresOnTurn`, then `id`) so save/load and UI are stable.
  - [ ] Clarify whether “addressing” an encounter removes it immediately or only after resolution.
  - [ ] Clarify whether generating a new encounter when the inbox is “full” drops/merges/queues.

### State transitions (engine)
- [ ] Encounter generation appends to inbox (or becomes “unread”) without overwriting existing encounters.
- [ ] Address flow:
  - [ ] From hub: selecting an encounter enters its dialogue node.
  - [ ] From non-hub dialogues: inbox is visible but actions are disabled (or consistently allowed—pick one and enforce).
  - [ ] After resolving an encounter, the resolved encounter is removed from inbox.
- [ ] Ensure engine rejects/ignores resolution choices for encounters not currently selected (prevents stale UI selections).

### Expiry semantics
- [ ] Expiry is evaluated per-encounter each turn with clear semantics (existing code uses: `expiresOnTurn` inclusive).
- [ ] Expired encounters:
  - [ ] Have consequences applied exactly once.
  - [ ] Are removed from inbox after expiry processing.
  - [ ] If multiple expire on the same turn, consequences apply in deterministic order.
- [ ] Verify interactions between expiry and “selected encounter in dialogue”:
  - [ ] If an encounter expires while the player is in its dialogue, define behavior (auto-resolve? eject back to hub? allow completion?).

### Save/load + migration
- [ ] Persist inbox state in `src/game/storage.ts` schema.
- [ ] Migrate older saves:
  - [ ] v2 saves containing `pendingEncounter` should load into the new inbox representation with a single entry.
  - [ ] Ensure load hydration for `currentDialogueId` continues to work when the dialogue id refers to an encounter.
- [ ] Add/adjust storage tests to cover:
  - [ ] round-trip save/load with multiple encounters.
  - [ ] migration path from legacy `pendingEncounter`.

### UI / UX
- [ ] Replace single “Pending encounter” prompt with “Inbox” semantics:
  - [ ] Hub prompt shows count (e.g. “2 encounters awaiting review”).
  - [ ] Info panel shows a list (title, short description, expiry indicator).
  - [ ] Selecting an encounter highlights it on the map (route/region highlight).
- [ ] Ensure accessibility:
  - [ ] list items are keyboard-focusable.
  - [ ] buttons have meaningful labels/tooltips.
- [ ] Ensure no UI runtime errors when inbox is empty, has one item, or many.

### Regression tests to update/add
- [ ] Update existing encounter-related tests to the new model:
  - `src/game/engine/pendingEncounterExpiry.test.ts`
  - `src/game/engine/encounterResolution.test.ts`
  - `src/components/GameScreen.encounterPrompt.test.tsx`
  - `src/game/useGameState.test.tsx`
- [ ] Add a new engine integration test:
  - [ ] Multiple encounters generated across turns are retained.
  - [ ] Resolving one doesn’t affect others.
  - [ ] Expiry removes only the expired subset and logs consequences once.

## 2) Response pool semantics (once + secret gating; TS/WASM parity)

### Semantics definition (must be explicit)
- [ ] “Once” means:
  - [ ] A choice can be selected at most once across the campaign OR once per node visit (pick one).
  - [ ] Decide whether “once” is keyed by `choice.id` or by a separate stable key.
- [ ] “Secret gating” means:
  - [ ] A choice is visible/selectable only if the player knows a required secret (or set of secrets).
  - [ ] Decide whether gating is AND/OR for multiple required secrets.

### Type-level changes
- [ ] Extend `DialogueChoice` with fields required by these semantics (examples):
  - [ ] `once?: boolean` and/or `onceKey?: string`
  - [ ] `requiresSecret?: string` or `requiresSecrets?: string[]`
- [ ] Extend `GameState` with whatever needs persisting to support “once” (examples):
  - [ ] `usedChoiceIds: string[]` or `usedOnceKeys: string[]`.

### TS engine behavior
- [ ] TS engine must enforce semantics even if UI is buggy:
  - [ ] If a choice is gated and requirements aren’t met, `applyChoice` returns `prev`.
  - [ ] If a choice is “once” and already used, `applyChoice` returns `prev`.
- [ ] Choice availability should affect UI rendering consistently:
  - [ ] gated choices are hidden or disabled (decide one).
  - [ ] once choices become hidden/disabled after selection.

### WASM engine parity
- [ ] `src/game/engine/uqmWasmConversationEngine.ts` graph compilation must encode the same availability rules.
- [ ] If the WASM core needs new fields in its graph/choice struct, update:
  - [ ] JS-side packing (`writeGraphToWasm` layout)
  - [ ] C/WAT side struct layout / accessors
  - [ ] any tests that assert sizes/offsets
- [ ] Add parity tests that cover:
  - [ ] once choices: TS and WASM both prevent re-selecting.
  - [ ] secret gating: TS and WASM both hide/lock until secret is learned.
  - [ ] interaction of `override` (if still present) with gating/once.

### Save/load + migration
- [ ] Persist the new “once” tracking state.
- [ ] Migrate older saves that lack the new field (default empty).

### Regression tests to update/add
- [ ] Add engine tests around choice availability filtering.
- [ ] Extend `src/game/engine/uqmWasmConversationEngine.test.ts` for new semantics.

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
