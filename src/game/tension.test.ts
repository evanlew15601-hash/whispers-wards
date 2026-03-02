import { describe, expect, it } from 'vitest';

import type { Faction, WorldState } from './types';

import { getTension, getTensionTier, getTopTensionPairs } from './tension';

describe('tension helpers', () => {
  it('classifies tiers aligned with simulation thresholds', () => {
    expect(getTensionTier(0)).toBe('calm');
    expect(getTensionTier(39)).toBe('calm');
    expect(getTensionTier(40)).toBe('strained');
    expect(getTensionTier(69)).toBe('strained');
    expect(getTensionTier(70)).toBe('volatile');
  });

  it('reads tension symmetrically and defaults to 0', () => {
    const world: WorldState = {
      regions: {},
      tradeRoutes: {},
      tensions: { a: { b: 12 } },
      aiMemory: { lastOfferTurn: {}, lastEmbargoTurn: {} },
    };

    expect(getTension(world, 'a', 'b')).toBe(12);
    expect(getTension(world, 'b', 'a')).toBe(12);
    expect(getTension(world, 'a', 'c')).toBe(0);
  });

  it('returns top N non-zero tension pairs sorted descending', () => {
    const factions: Faction[] = [
      { id: 'a', name: 'A', description: '', motto: '', color: 'iron', reputation: 0, traits: [] },
      { id: 'b', name: 'B', description: '', motto: '', color: 'verdant', reputation: 0, traits: [] },
      { id: 'c', name: 'C', description: '', motto: '', color: 'ember', reputation: 0, traits: [] },
    ];

    const world: WorldState = {
      regions: {},
      tradeRoutes: {},
      tensions: {
        a: { b: 10, c: 80 },
        b: { a: 10, c: 5 },
        c: { a: 80, b: 5 },
      },
      aiMemory: { lastOfferTurn: {}, lastEmbargoTurn: {} },
    };

    const top = getTopTensionPairs(world, factions, 2);
    expect(top).toHaveLength(2);
    expect(top[0]?.aId).toBe('a');
    expect(top[0]?.bId).toBe('c');
    expect(top[0]?.tier).toBe('volatile');
    expect(top[1]?.value).toBe(10);
  });
});
