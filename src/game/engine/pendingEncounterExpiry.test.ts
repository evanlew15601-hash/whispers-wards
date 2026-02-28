import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { SecondaryEncounter } from '../types';

describe('pendingEncounter expiry semantics', () => {
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
      pendingEncounter: simPending,
      logEntries: [],
      rngSeed: args.rngSeed,
    }));

    vi.doMock('../simulation', async () => {
      const actual = (await vi.importActual('../simulation')) as Record<string, unknown>;
      return { ...actual, simulateWorldTurn };
    });

    const { tsConversationEngine } = await import('./tsConversationEngine');

    const start = tsConversationEngine.startNewGame();

    // applyChoice should not run the simulation or apply expiry.
    const expiringNow: SecondaryEncounter = {
      id: 'enc-expiring-now',
      kind: 'raid',
      routeId: 'passcourier',
      title: 'expiring-now',
      description: 'expiring-now',
      relatedFactions: ['iron-pact', 'verdant-court'],
      expiresOnTurn: start.turnNumber,
    };

    const withExpiring = { ...start, pendingEncounter: expiringNow, rngSeed: 1 };
    const firstChoice = withExpiring.currentDialogue!.choices[0];

    const afterChoice = tsConversationEngine.applyChoice(withExpiring, firstChoice);
    expect(afterChoice.pendingEncounter).toEqual(expiringNow);
    expect(simulateWorldTurn).not.toHaveBeenCalled();

    const existing: SecondaryEncounter = {
      id: 'enc-existing',
      kind: 'raid',
      routeId: 'passcourier',
      title: 'existing',
      description: 'existing',
      relatedFactions: ['iron-pact', 'verdant-court'],
      // Boundary: endTurn increments turnNumber by 1.
      expiresOnTurn: start.turnNumber + 1,
    };

    const next = tsConversationEngine.endTurn({ ...start, pendingEncounter: existing, rngSeed: 1 });
    expect(simulateWorldTurn).toHaveBeenCalledTimes(1);
    expect(next.pendingEncounter).toEqual(existing);

    // Next turn should expire the existing encounter (since expiresOnTurn < nextTurnNumber).
    const next2 = tsConversationEngine.endTurn({ ...next, pendingEncounter: existing, rngSeed: 1 });
    expect(simulateWorldTurn).toHaveBeenCalledTimes(2);
    expect(next2.pendingEncounter).toEqual(simPending);

    // Expiry should add a log entry and deterministic world consequences.
    expect(next2.log).toContain('⏳ Encounter expired: existing (+5 tension)');
    expect(next2.world.tensions['iron-pact']?.['verdant-court']).toBe(5);
    expect(next2.world.tradeRoutes['passcourier']?.status).toBe('raided');
    expect(next2.world.tradeRoutes['passcourier']?.untilTurn).toBe(next2.turnNumber + 1);
  });
});
