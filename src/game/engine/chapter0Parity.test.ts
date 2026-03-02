import { beforeAll, describe, expect, it } from 'vitest';

import { createUqmWasmConversationEngine } from './uqmWasmConversationEngine';
import { tsConversationEngine } from './tsConversationEngine';
import type { UqmWasmRuntime } from './uqmWasmRuntime';
import { loadUqmMinimalWasmExports } from '@/test/uqmWasmTestUtils';
import { dialogueTree } from '../data';
import type { GameState } from '../types';

function makeRuntime(exports: Awaited<ReturnType<typeof loadUqmMinimalWasmExports>>): UqmWasmRuntime {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return {
    exports,
    getVersionString() {
      const ptr = exports.uqm_version_ptr();
      const len = exports.uqm_version_len();
      return decoder.decode(new Uint8Array(exports.memory.buffer, ptr, len));
    },
    lineFitChars(text, maxWidth) {
      const bytes = encoder.encode(text);
      const ptr = exports.uqm_alloc(bytes.length + 1);
      const mem = new Uint8Array(exports.memory.buffer, ptr, bytes.length + 1);
      mem.set(bytes);
      mem[bytes.length] = 0;
      return exports.uqm_line_fit_chars(ptr, maxWidth);
    },
  };
}

function collectEncodableSecrets(secretBitCapacity: number): Set<string> {
  // Must match uqmWasmConversationEngine compileGraph() semantics:
  // - include revealsInfo
  // - include requiresAllSecrets
  // - include requiresAnySecrets
  // - then sort lexicographically and take the first N (N=64).
  const all = new Set<string>();

  const nodeIds = Object.keys(dialogueTree).sort();

  for (const nodeId of nodeIds) {
    const node = dialogueTree[nodeId];

    for (const choice of node.choices) {
      if (choice.revealsInfo) all.add(choice.revealsInfo);
      for (const s of choice.requiresAllSecrets ?? []) all.add(s);
      for (const s of choice.requiresAnySecrets ?? []) all.add(s);
    }
  }

  return new Set([...all].sort().slice(0, secretBitCapacity));
}

function repByFactionId(state: GameState): Record<string, number> {
  return Object.fromEntries(state.factions.map(f => [f.id, f.reputation] as const));
}

function normalizeSet(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function encodableSecretsOf(state: GameState, encodable: Set<string>): string[] {
  return normalizeSet(state.knownSecrets.filter(s => encodable.has(s)));
}

describe('Chapter 0 summit parity (TS vs WASM)', () => {
  let uqmRuntime: UqmWasmRuntime;

  beforeAll(async () => {
    const exports = await loadUqmMinimalWasmExports();
    uqmRuntime = makeRuntime(exports);
  }, 60_000);

  it.each([
    {
      name: 'compact-accord',
      choiceId: 'summit-compact-accord',
      expectedEndingId: 'ending-greenmarch-compact-accord',
      ironRep: 0,
      knownSecrets: ['The archives confirm Greenmarch Pass was once neutral ground under a tripartite accord.'],
    },
    {
      name: 'expose-ledger',
      choiceId: 'summit-expose-ledger',
      expectedEndingId: 'ending-embers-fall-ledger',
      ironRep: 5,
      knownSecrets: ["Renzo's ledger pages show coded payments tied to the border killings."],
    },
    {
      name: 'expose-manifest',
      choiceId: 'summit-expose-manifest',
      expectedEndingId: 'ending-embers-fall-manifest',
      ironRep: 5,
      knownSecrets: ['Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.'],
    },
    {
      name: 'expose-maps',
      choiceId: 'summit-expose-maps',
      expectedEndingId: 'ending-embers-fall-maps',
      ironRep: 5,
      knownSecrets: ['The Ember Throne forged maps to manipulate the border dispute.'],
    },
  ])('matches on $name', ({ choiceId, expectedEndingId, ironRep, knownSecrets }) => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    // WASM engine uses 64-bit secrets when available (our normalized exports include reset64).
    const encodable = collectEncodableSecrets(64);

    const start = tsConversationEngine.startNewGame();

    const summitNode = dialogueTree['summit-start'];
    if (!summitNode) throw new Error('Expected summit-start node');

    const atSummit: GameState = {
      ...start,
      rngSeed: 123456789,
      currentDialogue: summitNode,
      factions: start.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: ironRep } : f)),
      knownSecrets,
    };

    const choice = summitNode.choices.find(c => c.id === choiceId);
    if (!choice) throw new Error(`Expected summit choice: ${choiceId}`);

    const nextTs = tsConversationEngine.applyChoice(atSummit, choice);
    const nextWasm = wasmEngine.applyChoice(atSummit, choice);

    expect(nextTs.currentDialogue?.id).toBe(expectedEndingId);
    expect(nextWasm.currentDialogue?.id).toBe(expectedEndingId);

    // Parity fields.
    expect(nextWasm.currentDialogue?.id).toBe(nextTs.currentDialogue?.id);
    expect(repByFactionId(nextWasm)).toEqual(repByFactionId(nextTs));
    expect(normalizeSet(nextWasm.selectedChoiceIds)).toEqual(normalizeSet(nextTs.selectedChoiceIds));
    expect(nextWasm.pendingEncounter?.id ?? null).toBe(nextTs.pendingEncounter?.id ?? null);

    // Compare only secrets encodable by the wasm mask (the rest are TS-owned extensions).
    expect(encodableSecretsOf(nextWasm, encodable)).toEqual(encodableSecretsOf(nextTs, encodable));
  });
});
