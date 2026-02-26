import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SecondaryEncounter } from '../types';

describe('encounter inbox integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('retains multiple encounters across turns, resolves one without affecting others, and expires the correct subset', async () => {
    const encA: SecondaryEncounter = {
      id: 'enc-a',
      kind: 'summit',
      title: 'A',
      description: 'A',
      relatedFactions: ['iron-pact', 'verdant-court'],
      expiresOnTurn: 4,
    };

    const encB: SecondaryEncounter = {
      id: 'enc-b',
      kind: 'raid',
      routeId: 'ashroad',
      title: 'B',
      description: 'B',
      relatedFactions: ['iron-pact', 'ember-throne'],
      expiresOnTurn: 3,
    };

    const encC: SecondaryEncounter = {
      id: 'enc-c',
      kind: 'embargo',
      routeId: 'passcourier',
      title: 'C',
      description: 'C',
      relatedFactions: ['ember-throne', 'verdant-court'],
      expiresOnTurn: 10,
    };

    const simulateWorldTurn = vi.fn((args: { world: any; rngSeed: number; turnNumber: number }) => {
      if (args.turnNumber === 2) {
        return { world: args.world, pendingEncounters: [encA, encB], logEntries: [], rngSeed: args.rngSeed };
      }

      if (args.turnNumber === 3) {
        return { world: args.world, pendingEncounters: [encC], logEntries: [], rngSeed: args.rngSeed };
      }

      return { world: args.world, pendingEncounters: [], logEntries: [], rngSeed: args.rngSeed };
    });

    vi.doMock('../simulation', async () => {
      const actual = (await vi.importActual('../simulation')) as Record<string, unknown>;
      return { ...actual, simulateWorldTurn };
    });

    const { buildEncounterDialogueNode } = await import('../encounters');
    const { tsConversationEngine } = await import('./tsConversationEngine');

    const start = tsConversationEngine.startNewGame();

    const advanceChoice = {
      id: 'qa',
      text: 'qa',
      effects: [],
      nextNodeId: null,
    };

    const after1 = tsConversationEngine.applyChoice({ ...start, rngSeed: 1 }, advanceChoice);
    expect(after1.turnNumber).toBe(2);
    expect(after1.pendingEncounters.map(e => e.id)).toEqual(['enc-b', 'enc-a']);

    const after2 = tsConversationEngine.applyChoice({ ...after1, rngSeed: 1 }, advanceChoice);
    expect(after2.turnNumber).toBe(3);
    expect(after2.pendingEncounters.map(e => e.id)).toEqual(['enc-b', 'enc-a', 'enc-c']);

    // Resolve enc-a. It should be removed, leaving the other two untouched.
    const inEncounterA = {
      ...after2,
      currentDialogue: buildEncounterDialogueNode(encA),
    };

    const resolutionChoice = inEncounterA.currentDialogue.choices[0];
    const resolved = tsConversationEngine.applyChoice(inEncounterA, resolutionChoice);

    expect(resolved.encounterResolvedOnTurn).toBe(3);
    expect(resolved.pendingEncounters.map(e => e.id)).toEqual(['enc-b', 'enc-c']);

    // Advance to turn 4: enc-b expires (expiresOnTurn=3), enc-c remains.
    const after3 = tsConversationEngine.applyChoice({ ...resolved, rngSeed: 1 }, advanceChoice);
    expect(after3.turnNumber).toBe(4);
    expect(after3.pendingEncounters.map(e => e.id)).toEqual(['enc-c']);

    const expiryLines = after3.log.filter(l => l.includes('⏳ Encounter expired: B'));
    expect(expiryLines).toHaveLength(1);
  });
});
