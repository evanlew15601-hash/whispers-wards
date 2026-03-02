import type { Faction, WorldState } from './types';

export type TensionTier = 'calm' | 'strained' | 'volatile';

export const getTensionTier = (value: number): TensionTier => {
  if (value >= 70) return 'volatile';
  if (value >= 40) return 'strained';
  return 'calm';
};

export const getTension = (world: WorldState, a: string, b: string): number => {
  const direct = world.tensions[a]?.[b];
  if (typeof direct === 'number') return direct;

  const reverse = world.tensions[b]?.[a];
  if (typeof reverse === 'number') return reverse;

  return 0;
};

export type TensionPair = {
  aId: string;
  bId: string;
  aName: string;
  bName: string;
  value: number;
  tier: TensionTier;
};

export const getTopTensionPairs = (world: WorldState, factions: Faction[], n: number): TensionPair[] => {
  const pairs: TensionPair[] = [];

  for (let i = 0; i < factions.length; i++) {
    for (let j = i + 1; j < factions.length; j++) {
      const a = factions[i];
      const b = factions[j];
      if (!a || !b) continue;

      const value = getTension(world, a.id, b.id);
      if (value <= 0) continue;

      pairs.push({
        aId: a.id,
        bId: b.id,
        aName: a.name,
        bName: b.name,
        value,
        tier: getTensionTier(value),
      });
    }
  }

  pairs.sort((x, y) => y.value - x.value || `${x.aId}:${x.bId}`.localeCompare(`${y.aId}:${y.bId}`));

  return pairs.slice(0, Math.max(0, Math.floor(n)));
};
