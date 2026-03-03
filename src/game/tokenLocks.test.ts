import { describe, expect, it } from 'vitest';

import { getDialogueTree } from './data';
import { tsConversationEngine } from './engine/tsConversationEngine';

describe('token gating', () => {
  it('locks choices behind tokens and unlocks once the token is earned', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-2');

    const tribunal = tree['ch2-tribunal'];
    if (!tribunal) throw new Error('Expected ch2-tribunal');

    const ironChoice = tribunal.choices.find(c => c.id === 'ch2-trib-iron');
    if (!ironChoice) throw new Error('Expected ch2-trib-iron choice');

    const lockedState = {
      ...base,
      chapterId: 'chapter-2',
      chapterTurn: 1,
      currentDialogue: tribunal,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(lockedState, ironChoice)).toBe(lockedState);

    const unlockedState = {
      ...lockedState,
      knownTokens: ['tok:ch02:iron:toll-order'],
    };

    const next = tsConversationEngine.applyChoice(unlockedState, ironChoice);
    expect(next).not.toBe(unlockedState);
    expect(next.currentDialogue?.id).toBe('ch2-ending-iron');
    expect(next.knownTokens).toContain('tok:ch02:iron:toll-order');
    expect(next.knownTokens).toContain('tok:ch02:outcome:iron');
    expect(next.milestones).toContain('chapter-2:resolved');
    expect(next.milestones).toContain('chapter-2:resolved:iron');
  });
});
