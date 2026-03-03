import { describe, expect, it } from 'vitest';

import { getDialogueTree } from './data';
import { tsConversationEngine } from './engine/tsConversationEngine';

describe('token gating', () => {
  it('locks choices behind tokens and unlocks once tokens are present', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-2');

    const tribunal = tree['ch2-tribunal'];
    if (!tribunal) throw new Error('Expected ch2-tribunal');

    const expose = tribunal.choices.find(c => c.id === 'ch2-trib-expose');
    if (!expose) throw new Error('Expected ch2-trib-expose choice');

    const lockedState = {
      ...base,
      chapterId: 'chapter-2',
      chapterTurn: 1,
      currentDialogue: tribunal,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(lockedState, expose)).toBe(lockedState);

    const unlockedState = {
      ...lockedState,
      knownTokens: ['tok:ch02:docket:trail', 'tok:ch02:ledger:irregular'],
    };

    const next = tsConversationEngine.applyChoice(unlockedState, expose);
    expect(next).not.toBe(unlockedState);
    expect(next.currentDialogue?.id).toBe('ch2-ending-expose');
    expect(next.knownTokens).toContain('tok:ch02:docket:trail');
    expect(next.knownTokens).toContain('tok:ch02:ledger:irregular');
    expect(next.milestones).toContain('chapter-2:resolved:expose');
  });
});
