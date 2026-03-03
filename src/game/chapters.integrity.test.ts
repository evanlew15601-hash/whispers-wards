import { describe, expect, it } from 'vitest';

import { CHAPTERS } from './chapters';
import { ENCOUNTER_POOLS } from './encounterPools';
import { getDialogueTree } from './data';

describe('chapters integrity', () => {
  it('defines at least a default chapter', () => {
    expect(CHAPTERS['chapter-1']).toBeTruthy();
  });

  it('references valid hub node ids and chapter transitions', () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(getDialogueTree(chapter.id)[chapter.hubNodeId]).toBeTruthy();

      if (chapter.exitToChapterId !== null) {
        expect(CHAPTERS[chapter.exitToChapterId]).toBeTruthy();
      }
    }
  });

  it('references valid encounter pool ids', () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(ENCOUNTER_POOLS[chapter.encounterPoolId]).toBeTruthy();
    }
  });
});
