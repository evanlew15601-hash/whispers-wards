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

  it('supports weights (summits slightly rarer than crises)', () => {
    const summit = getEncounterCandidateWeightForPool(
      { kind: 'summit', a: 'iron-pact', b: 'ember-throne' },
      'encounters:chapter-1'
    );

    const embargo = getEncounterCandidateWeightForPool(
      { kind: 'embargo', a: 'iron-pact', b: 'ember-throne', routeId: 'ashroad' },
      'encounters:chapter-1'
    );

    expect(summit).toBeCloseTo(0.6);
    expect(embargo).toBe(1);
  });
});
