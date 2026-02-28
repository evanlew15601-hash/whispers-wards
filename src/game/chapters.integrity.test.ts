import { describe, expect, it } from 'vitest';

import { CHAPTERS } from './chapters';
import { dialogueTree } from './data';

describe('chapters integrity', () => {
  it('defines at least a default chapter', () => {
    expect(CHAPTERS['chapter-1']).toBeTruthy();
  });

  it('references valid hub node ids and chapter transitions', () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(dialogueTree[chapter.hubNodeId]).toBeTruthy();

      if (chapter.exitToChapterId !== null) {
        expect(CHAPTERS[chapter.exitToChapterId]).toBeTruthy();
      }
    }
  });
});
