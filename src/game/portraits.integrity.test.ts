import { describe, expect, it } from 'vitest';

import { playerPortraitIds } from './portraitIds';
import { playerPortraits } from './portraits';

describe('portraits integrity', () => {
  it('playerPortraitIds stays in sync with playerPortraits', () => {
    expect(playerPortraits.map(p => p.id)).toEqual(playerPortraitIds);
  });
});
