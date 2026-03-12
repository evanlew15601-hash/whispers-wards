import { describe, expect, it } from 'vitest';

import { returnToHub } from './hubActions';
import { tsConversationEngine } from './engine/tsConversationEngine';
import { dialogueTree } from './data';
import { GREENMARCH_SUMMIT_CONCLUDED_SECRET } from './progress';

describe('hubActions.returnToHub', () => {
  it('applies chapter transitions when returning to the hall (e.g. after the Greenmarch summit)', () => {
    const initial = tsConversationEngine.startNewGame();

    const before = {
      ...initial,
      chapterId: 'chapter-1',
      chapterTurn: 7,
      knownSecrets: [GREENMARCH_SUMMIT_CONCLUDED_SECRET],
      currentDialogue: dialogueTree['summit-aftermath-router'],
    };

    const after = returnToHub(before);

    expect(after.chapterId).toBe('chapter-2');
    expect(after.currentDialogue?.id).toBe('concord-hub-2');
    expect(after.log.some(l => l.startsWith('[CH] Chapter II'))).toBe(true);
  });
});
