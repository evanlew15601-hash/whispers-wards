import { encounterTemplateIdFromCandidate } from './encounterIds';

export type EncounterCandidateLike = {
  kind: 'embargo' | 'raid' | 'skirmish' | 'summit';
  a: string;
  b: string;
  routeId?: string;
  regionId?: string;
};

export type EncounterPoolRule = {
  id: string;
  templateId?: string;
  kind?: EncounterCandidateLike['kind'];
  a?: string;
  b?: string;
  routeId?: string;
  regionId?: string;
  weight: number;
};

export type EncounterPool = {
  id: string;
  rules: EncounterPoolRule[];
};

export const ENCOUNTER_POOLS: Record<string, EncounterPool> = {
  // Default campaign pool.
  'encounters:chapter-1': {
    id: 'encounters:chapter-1',
    rules: [
      // Summits are only possible between the three founding factions.
      { id: 'summit:iron-verdant', kind: 'summit', a: 'iron-pact', b: 'verdant-court', weight: 1 },
      { id: 'summit:iron-ember', kind: 'summit', a: 'iron-pact', b: 'ember-throne', weight: 1 },
      { id: 'summit:verdant-ember', kind: 'summit', a: 'verdant-court', b: 'ember-throne', weight: 1 },

      // Route crises stay tied to the core trade routes.
      { id: 'embargo:ashroad', kind: 'embargo', a: 'ember-throne', b: 'iron-pact', routeId: 'ashroad', weight: 1 },
      { id: 'embargo:rootway', kind: 'embargo', a: 'ember-throne', b: 'verdant-court', routeId: 'rootway', weight: 1 },
      { id: 'embargo:passcourier', kind: 'embargo', a: 'iron-pact', b: 'verdant-court', routeId: 'passcourier', weight: 1 },

      { id: 'raid:ashroad', kind: 'raid', a: 'ember-throne', b: 'iron-pact', routeId: 'ashroad', weight: 1 },
      { id: 'raid:rootway', kind: 'raid', a: 'ember-throne', b: 'verdant-court', routeId: 'rootway', weight: 1 },
      { id: 'raid:passcourier', kind: 'raid', a: 'iron-pact', b: 'verdant-court', routeId: 'passcourier', weight: 1 },

      // Early conflict is localized to Greenmarch.
      {
        id: 'skirmish:greenmarch',
        templateId: 'skirmish:iron-pact|verdant-court:region:greenmarch',
        weight: 1,
      },
    ],
  },

  // Utility pools for tests / authoring.
  'encounters:none': {
    id: 'encounters:none',
    rules: [],
  },
  'encounters:summits-only': {
    id: 'encounters:summits-only',
    rules: [{ id: 'summits-only', kind: 'summit', weight: 1 }],
  },
};

export const getEncounterPool = (poolId: string | undefined): EncounterPool | null => {
  if (!poolId) return null;
  return ENCOUNTER_POOLS[poolId] ?? null;
};

const matchesRule = (c: EncounterCandidateLike, r: EncounterPoolRule): boolean => {
  if (r.templateId) {
    return encounterTemplateIdFromCandidate(c) === r.templateId;
  }

  if (r.kind && c.kind !== r.kind) return false;

  if (r.routeId && c.routeId !== r.routeId) return false;
  if (r.regionId && c.regionId !== r.regionId) return false;

  // If a/b are specified, treat them as an unordered pair.
  if (r.a && r.b) {
    const ab = [c.a, c.b].join('|');
    const ba = [c.b, c.a].join('|');
    const rule = [r.a, r.b].join('|');
    if (ab !== rule && ba !== rule) return false;
  } else {
    if (r.a && c.a !== r.a && c.b !== r.a) return false;
    if (r.b && c.a !== r.b && c.b !== r.b) return false;
  }

  return true;
};

/**
 * Returns a positive weight if the candidate is allowed by the pool, otherwise 0.
 *
 * Weight is the sum of all matching rule weights.
 */
export const getEncounterCandidateWeightForPool = (candidate: EncounterCandidateLike, poolId: string | undefined): number => {
  if (!poolId) return 1;

  const pool = getEncounterPool(poolId);
  if (!pool) return 1;

  if (!pool.rules.length) return 0;

  let weight = 0;
  for (const rule of pool.rules) {
    if (!matchesRule(candidate, rule)) continue;
    weight += rule.weight;
  }

  return weight;
};
