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

  it('can positively allowlist encounters (summits-only)', () => {
    const factions = [
      initialFactions.find(f => f.id === 'ember-throne')!,
      initialFactions.find(f => f.id === 'iron-pact')!,
    ];

    const makeWorld = () => {
      const world = createInitialWorldState(factions);
      // Remove unrelated RNG consumption from contested-region cooling.
      world.regions.greenmarch = { ...world.regions.greenmarch, contested: false };
      // Low tension -> offers more likely, enabling summit candidates.
      world.tensions['ember-throne']['iron-pact'] = 0;
      world.tensions['iron-pact']['ember-throne'] = 0;
      return world;
    };

    let seedWithSummit: number | null = null;
    for (let seed = 1; seed <= 5000; seed++) {
      const result = simulateWorldTurn({
        world: makeWorld(),
        factions,
        turnNumber: 2,
        rngSeed: seed,
        encounterPoolId: 'encounters:summits-only',
      });

      if (result.pendingEncounter?.kind === 'summit') {
        seedWithSummit = seed;
        break;
      }
    }

    expect(seedWithSummit).not.toBeNull();

    const result = simulateWorldTurn({
      world: makeWorld(),
      factions,
      turnNumber: 2,
      rngSeed: seedWithSummit!,
      encounterPoolId: 'encounters:summits-only',
    });

    expect(result.pendingEncounter?.kind).toBe('summit');
  });

  it('weights influence which encounter is selected (full simulateWorldTurn)', () => {
    const factions = [
      initialFactions.find(f => f.id === 'ember-throne')!,
      initialFactions.find(f => f.id === 'iron-pact')!,
    ];

    const makeWorld = () => {
      const world = createInitialWorldState(factions);
      // Remove unrelated RNG consumption from contested-region cooling.
      world.regions.greenmarch = { ...world.regions.greenmarch, contested: false };

      // Push toward crisis actions (embargo/raid) so multiple candidates exist.
      world.tensions['ember-throne']['iron-pact'] = 80;
      world.tensions['iron-pact']['ember-throne'] = 80;

      return world;
    };

    let seedThatShowsWeighting: number | null = null;

    for (let seed = 1; seed <= 10000; seed++) {
      const baseline = simulateWorldTurn({
        world: makeWorld(),
        factions,
        turnNumber: 3,
        rngSeed: seed,
        encounterPoolId: 'encounters:chapter-1',
      });

      const raidHeavy = simulateWorldTurn({
        world: makeWorld(),
        factions,
        turnNumber: 3,
        rngSeed: seed,
        encounterPoolId: 'encounters:chapter-1-raid-heavy',
      });

      if (!baseline.pendingEncounter || !raidHeavy.pendingEncounter) continue;

      if (baseline.pendingEncounter.kind !== 'raid' && raidHeavy.pendingEncounter.kind === 'raid') {
        seedThatShowsWeighting = seed;
        break;
      }
    }

    expect(seedThatShowsWeighting).not.toBeNull();

    const baseline = simulateWorldTurn({
      world: makeWorld(),
      factions,
      turnNumber: 3,
      rngSeed: seedThatShowsWeighting!,
      encounterPoolId: 'encounters:chapter-1',
    });

    const raidHeavy = simulateWorldTurn({
      world: makeWorld(),
      factions,
      turnNumber: 3,
      rngSeed: seedThatShowsWeighting!,
      encounterPoolId: 'encounters:chapter-1-raid-heavy',
    });

    expect(baseline.pendingEncounter).toBeTruthy();
    expect(raidHeavy.pendingEncounter).toBeTruthy();

    expect(baseline.pendingEncounter!.kind).not.toBe('raid');
    expect(raidHeavy.pendingEncounter!.kind).toBe('raid');
  });
});
