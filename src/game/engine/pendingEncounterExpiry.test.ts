import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { SecondaryEncounter } from '../types';

describe('pendingEncounters expiry semantics', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('retains an existing encounter when expiresOnTurn === nextTurnNumber, then applies expiry consequences', async () => {
    const simPending: SecondaryEncounter = {
      id: 'enc-sim',
      kind: 'summit',
      title: 'simulated',
      description: 'simulated',
      relatedFactions: ['iron-pact', 'ember-throne'],
      expiresOnTurn: 999,
    };

    const simulateWorldTurn = vi.fn((args: { world: any; rngSeed: number }) => ({
      world: args.world,
      pendingEncounters: [simPending],
      logEntries: [],
      rngSeed: args.rngSeed,
    }));

    vi.doMock('../simulation', async () => {
      const actual = (await vi.importActual('../simulation')) as Record<string, unknown>;
      return { ...actual, simulateWorldTurn };
    });

    const { tsConversationEngine } = await import('./tsConversationEngine');

    const start = tsConversationEngine.startNewGame();

    const existing: SecondaryEncounter = {
      id: 'enc-existing',
      kind: 'raid',
      routeId: 'passcourier',
      title: 'existing',
      description: 'existing',
      relatedFactions: ['iron-pact', 'verdant-court'],
      // Boundary: applyChoice increments turnNumber by 1.
      expiresOnTurn: start.turnNumber + 1,
    };

    const choice = {
      id: 'qa',
      text: 'qa',
      effects: [],
      nextNodeId: null,
    };

    const next = tsConversationEngine.applyChoice({ ...start, pendingEncounters: [existing], rngSeed: 1 }, choice);

    // Existing is retained (boundary) and a new sim encounter is appended.
    expect(next.pendingEncounters).toEqual([existing, simPending]);

    // Next step should expire the existing encounter (since expiresOnTurn < nextTurnNumber).
    const next2 = tsConversationEngine.applyChoice({ ...next, rngSeed: 1 }, choice);
    expect(next2.pendingEncounters).toEqual([simPending]);

    // Expiry should add a log entry and deterministic world consequences.
    expect(next2.log).toContain('⏳ Encounter expired: existing (+5 tension)');
    expect(next2.world.tensions['iron-pact']?.['verdant-court']).toBe(5);
    expect(next2.world.tradeRoutes['passcourier']?.status).toBe('raided');
    expect(next2.world.tradeRoutes['passcourier']?.untilTurn).toBe(next2.turnNumber + 1);
  });
});
