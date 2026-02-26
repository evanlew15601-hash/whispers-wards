import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { SecondaryEncounter } from '../types';

describe('pendingEncounters inbox capacity', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('does not add new simulated encounters when the inbox is at capacity', async () => {
    const simulateWorldTurn = vi.fn((args: { world: any; rngSeed: number; turnNumber: number }) => {
      const mk = (suffix: string): SecondaryEncounter => ({
        id: `enc-sim-${args.turnNumber}-${suffix}`,
        kind: 'summit',
        title: `sim-${suffix}`,
        description: 'simulated',
        relatedFactions: ['iron-pact', 'ember-throne'],
        expiresOnTurn: 999,
      });

      return {
        world: args.world,
        pendingEncounters: [mk('a'), mk('b')],
        logEntries: [],
        rngSeed: args.rngSeed,
      };
    });

    vi.doMock('../simulation', async () => {
      const actual = (await vi.importActual('../simulation')) as Record<string, unknown>;
      return { ...actual, simulateWorldTurn };
    });

    const { tsConversationEngine, MAX_PENDING_ENCOUNTERS } = await import('./tsConversationEngine');

    const start = tsConversationEngine.startNewGame();

    const existing1: SecondaryEncounter = {
      id: 'enc-existing-1',
      kind: 'raid',
      routeId: 'ashroad',
      title: 'existing-1',
      description: 'existing',
      relatedFactions: ['iron-pact', 'ember-throne'],
      expiresOnTurn: 999,
    };

    const existing2: SecondaryEncounter = {
      id: 'enc-existing-2',
      kind: 'embargo',
      routeId: 'passcourier',
      title: 'existing-2',
      description: 'existing',
      relatedFactions: ['iron-pact', 'verdant-court'],
      expiresOnTurn: 999,
    };

    const existing3: SecondaryEncounter = {
      id: 'enc-existing-3',
      kind: 'skirmish',
      regionId: 'greenmarch',
      title: 'existing-3',
      description: 'existing',
      relatedFactions: ['verdant-court', 'ember-throne'],
      expiresOnTurn: 999,
    };

    const choice = {
      id: 'qa',
      text: 'qa',
      effects: [],
      nextNodeId: null,
    };

    const atCap = tsConversationEngine.applyChoice(
      { ...start, pendingEncounters: [existing1, existing2, existing3], rngSeed: 1 },
      choice,
    );

    expect(atCap.pendingEncounters).toHaveLength(MAX_PENDING_ENCOUNTERS);
    expect(atCap.pendingEncounters.map(e => e.id)).toEqual(['enc-existing-1', 'enc-existing-2', 'enc-existing-3']);

    // Even though the sim produces 2 encounters per turn, we should not exceed the cap.
    const next = tsConversationEngine.applyChoice({ ...atCap, rngSeed: 1 }, choice);
    expect(next.pendingEncounters).toHaveLength(MAX_PENDING_ENCOUNTERS);
    expect(next.pendingEncounters.map(e => e.id)).toEqual(['enc-existing-1', 'enc-existing-2', 'enc-existing-3']);
  });
});
