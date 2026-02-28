import { describe, expect, it } from 'vitest';

import { getEncounterCandidateWeightForPool } from './encounterPools';

describe('encounterPools', () => {
  it('curates chapter-1: only certain routes/regions are eligible', () => {
    expect(
      getEncounterCandidateWeightForPool(
        { kind: 'raid', a: 'iron-pact', b: 'ember-throne', routeId: 'ashroad' },
        'encounters:chapter-1'
      )
    ).toBeGreaterThan(0);

    expect(
      getEncounterCandidateWeightForPool(
        { kind: 'raid', a: 'iron-pact', b: 'ember-throne', routeId: 'rootway' },
        'encounters:chapter-1'
      )
    ).toBe(0);

    expect(
      getEncounterCandidateWeightForPool(
        { kind: 'skirmish', a: 'iron-pact', b: 'verdant-court', regionId: 'greenmarch' },
        'encounters:chapter-1'
      )
    ).toBeGreaterThan(0);

    expect(
      getEncounterCandidateWeightForPool(
        { kind: 'skirmish', a: 'iron-pact', b: 'verdant-court', regionId: 'crownlands' },
        'encounters:chapter-1'
      )
    ).toBe(0);
  });
});
