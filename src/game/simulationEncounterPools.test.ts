import { describe, expect, it } from 'vitest';

import { initialFactions } from './data';
import { createInitialWorldState, simulateWorldTurn } from './simulation';

describe('encounter pools', () => {
  it('can suppress encounter generation when the chapter pool filters everything out', () => {
    const factions = [
      initialFactions.find(f => f.id === 'ember-throne')!,
      initialFactions.find(f => f.id === 'iron-pact')!,
    ];

    const makeWorld = () => {
      const world = createInitialWorldState(factions);
      // Remove unrelated RNG consumption from contested-region cooling.
      world.regions.greenmarch = { ...world.regions.greenmarch, contested: false };
      world.tensions['ember-throne']['iron-pact'] = 80;
      world.tensions['iron-pact']['ember-throne'] = 80;
      return world;
    };

    let seedWithEncounter: number | null = null;
    for (let seed = 1; seed <= 2000; seed++) {
      const result = simulateWorldTurn({
        world: makeWorld(),
        factions,
        turnNumber: 5,
        rngSeed: seed,
        encounterPoolId: 'encounters:chapter-1',
      });
      if (result.pendingEncounter) {
        seedWithEncounter = seed;
        break;
      }
    }

    expect(seedWithEncounter).not.toBeNull();

    const baseline = simulateWorldTurn({
      world: makeWorld(),
      factions,
      turnNumber: 5,
      rngSeed: seedWithEncounter!,
      encounterPoolId: 'encounters:chapter-1',
    });

    expect(baseline.pendingEncounter).not.toBeNull();

    const suppressed = simulateWorldTurn({
      world: makeWorld(),
      factions,
      turnNumber: 5,
      rngSeed: seedWithEncounter!,
      encounterPoolId: 'encounters:none',
    });

    expect(suppressed.pendingEncounter).toBeNull();
    expect(suppressed.logEntries.some(l => l.includes('No eligible encounters for pool encounters:none'))).toBe(true);
  });
});
