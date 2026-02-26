# Crown & Concord Roadmap Execution Plan

This document is the working execution plan for the Crown & Concord codebase.

It is written for fast, low-risk iteration:
- keep changes small and well-tested,
- preserve determinism in engine logic,
- prefer adding targeted tests over adding runtime guards.

## How to work in this repo

### Default local verification loop

Run the full CI-style check before opening a PR:

```sh
npm run qa
```

(Equivalent to `lint + typecheck + test + build`.)

### Manual smoke test

```sh
npm run dev
```

Then:
- Start a new game.
- Click through a few dialogue choices.
- Let a couple of turns pass to generate/expire encounters.
- Open the encounter inbox from the hub and resolve one.
- Save and reload the same slot.

## Subagents (project-level)

This repo includes project subagent definitions in `.claude/agents/` so contributors can delegate focused audits.

Suggested usage patterns:

- **Engine changes** (state transitions, determinism): use `engine-auditor`.
- **WASM ABI / packing changes**: use `wasm-auditor`.
- **Save/load schema changes**: use `storage-migrator`.
- **UI flow changes**: use `ui-ux-tester`.
- **Before merging**: use `test-runner` to run/triage failures.

## Roadmap workstreams

### 1) Multi-encounter inbox (engine + UI)

Status: implemented.

Invariants that must remain true:
- `pendingEncounters` contains no duplicate `id`s.
- Ordering is deterministic: sort by `expiresOnTurn`, then `id`.
- Encounter expiry is evaluated on turn advance (inclusive `expiresOnTurn`).
- Resolving an encounter removes it from the inbox and is limited to **one** resolution per turn.
- Entering an encounter dialogue now includes a **Defer** option that returns to the hub without resolving (no turn advance).

Key files:
- Engine: `src/game/engine/tsConversationEngine.ts`, `src/game/engine/uqmWasmConversationEngine.ts`
- Encounters: `src/game/encounters.ts`
- UI: `src/components/EncounterInboxDialog.tsx`, `src/components/GameScreen.tsx`, `src/components/InfoPanel.tsx`

Tests to keep green:
- `src/game/engine/pendingEncounterExpiry.test.ts`
- `src/game/engine/pendingEncounterInboxCapacity.test.ts`
- `src/game/engine/encounterInbox.integration.test.ts`

Open question to resolve:
- If we later add multi-step encounter dialogues (beyond resolve/defer), decide whether intermediate steps should advance the turn or remain "intra-turn".

### 2) Response pool semantics (once + secret gating) with TS/WASM parity

Status: implemented.

Semantics:
- `once: true` is enforced across the campaign by adding a hidden secret `choice-used:<choiceId>`.
- `requiresInfo` and `forbidsInfo` gate choices based on `knownSecrets`.
- `override` bypasses locks (TS and WASM wrapper both respect this).

Key files:
- TS lock logic: `src/game/engine/dialogueChoiceLocks.ts`
- WASM wrapper + packing: `src/game/engine/uqmWasmConversationEngine.ts`
- WASM core: `third_party/uqm/minimal_wasm/uqm_min.c`, `third_party/uqm/minimal_wasm/uqm_min.wat`

Tests to keep green:
- `src/game/engine/uqmMinimalConversationCore.test.ts`
- `src/game/engine/uqmWasmConversationEngine.test.ts`

### 3) UQM minimal WASM build strategy

Status: implemented (Option 1).

- Prefer native toolchains when present (Zig/Clang/Emscripten).
- Always support a zero-native-deps fallback by compiling the WAT via `wabt`.

Key files:
- Build script: `scripts/build-uqm-minimal-wasm.mjs`
- Output: `public/wasm/uqm_minimal.wasm`

### 4) Narrative expansion + data integrity

Status: ongoing.

Guidelines:
- Keep dialogue node ids stable.
- When adding new secrets, be aware that the WASM conversation core tracks only 32 bits.
  - Prefer secrets that affect locking semantics (`once` / `requiresInfo` / `forbidsInfo`).

Recommended workflow for content changes:
1. Add content in `src/game/data.ts`.
2. Run `npm test` and ensure `src/game/data.integrity.test.ts` passes.
3. If locks/once/gating are touched, ensure WASM parity tests still pass.

## CI expectations

GitHub Actions runs, separately:
- lint
- typecheck
- vitest
- build

See `.github/workflows/ci.yml`.
