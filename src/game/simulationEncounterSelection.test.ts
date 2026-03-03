import { describe, expect, it } from 'vitest';

import { pickEncounterCandidate, type EncounterCandidate } from './simulation';

describe('pickEncounterCandidate', () => {
  it('avoids candidates already seen this chapter when alternatives exist', () => {
    const candidates: EncounterCandidate[] = [
      { kind: 'raid', a: 'iron-pact', b: 'ember-throne', routeId: 'ashroad' },
      { kind: 'embargo', a: 'iron-pact', b: 'verdant-court', routeId: 'passcourier' },
    ];

    const memory = {
      lastSeenTurnByTemplateId: {},
      seenThisChapter: {
        // mark the raid as already seen
        'raid:ember-throne|iron-pact:route:ashroad': true,
      },
    };

    const pick = pickEncounterCandidate({ candidates, turnNumber: 10, rngSeed: 1, memory });
    expect(pick).toBeTruthy();

    expect(pick!.templateId).toBe('embargo:iron-pact|verdant-court:route:passcourier');
    expect(pick!.usedFallbackPool).toBe(false);
  });

  it('avoids candidates on cooldown when alternatives exist', () => {
    const candidates: EncounterCandidate[] = [
      { kind: 'summit', a: 'iron-pact', b: 'verdant-court' },
      { kind: 'skirmish', a: 'iron-pact', b: 'ember-throne', regionId: 'greenmarch' },
    ];

    const memory = {
      lastSeenTurnByTemplateId: {
        // summit cooldown is 3, so if last seen at 8 it is still on cooldown at 10
        'summit:iron-pact|verdant-court:none': 8,
      },
      seenThisChapter: {},
    };

    const pick = pickEncounterCandidate({ candidates, turnNumber: 10, rngSeed: 1, memory });
    expect(pick).toBeTruthy();

    expect(pick!.templateId).toBe('skirmish:ember-throne|iron-pact:region:greenmarch');
    expect(pick!.usedFallbackPool).toBe(false);
  });

  it('falls back to full pool when everything is filtered out', () => {
    const candidates: EncounterCandidate[] = [
      { kind: 'raid', a: 'iron-pact', b: 'ember-throne', routeId: 'ashroad' },
    ];

    const memory = {
      lastSeenTurnByTemplateId: {
        // raid cooldown is 2, so if last seen at 9 it is on cooldown at 10
        'raid:ember-throne|iron-pact:route:ashroad': 9,
      },
      seenThisChapter: {
        'raid:ember-throne|iron-pact:route:ashroad': true,
      },
    };

    const pick = pickEncounterCandidate({ candidates, turnNumber: 10, rngSeed: 1, memory });
    expect(pick).toBeTruthy();

    expect(pick!.templateId).toBe('raid:ember-throne|iron-pact:route:ashroad');
    expect(pick!.usedFallbackPool).toBe(true);
  });

  it('uses weights when provided', () => {
    const candidates: EncounterCandidate[] = [
      { kind: 'embargo', a: 'ember-throne', b: 'iron-pact', routeId: 'ashroad' },
      { kind: 'raid', a: 'ember-throne', b: 'iron-pact', routeId: 'ashroad' },
    ];

    const memory = {
      lastSeenTurnByTemplateId: {},
      seenThisChapter: {},
    };

    const equalWeights = (_: EncounterCandidate) => 1;
    const skewedWeights = (c: EncounterCandidate) => (c.kind === 'embargo' ? 10 : 1);

    // This seed is chosen so that the uniform pick (50/50) differs from the skewed pick (10/11).
    const seed = 123456789;

    const uniform = pickEncounterCandidate({
      candidates,
      turnNumber: 10,
      rngSeed: seed,
      memory,
      getWeight: equalWeights,
    });
    const weighted = pickEncounterCandidate({
      candidates,
      turnNumber: 10,
      rngSeed: seed,
      memory,
      getWeight: skewedWeights,
    });

    expect(uniform).toBeTruthy();
    expect(weighted).toBeTruthy();
    expect(uniform!.templateId).not.toBe(weighted!.templateId);
  });
});
