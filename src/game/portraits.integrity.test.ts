import { describe, expect, it } from 'vitest';

import { playerPortraitIds } from './portraitIds';
import { getPlayerPortraits } from './portraits';

describe('portraits integrity', () => {
  it('playerPortraitIds stays in sync with playerPortraits', () => {
    expect(getPlayerPortraits().map(p => p.id)).toEqual(playerPortraitIds);
  });
});
