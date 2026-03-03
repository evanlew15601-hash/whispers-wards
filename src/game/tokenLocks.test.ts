import { describe, expect, it } from 'vitest';

import { getDialogueTree } from './data';
import { tsConversationEngine } from './engine/tsConversationEngine';

describe('token gating', () => {
  it('locks choices behind tokens and unlocks once the token is earned', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-2');

    const inner = tree['ch2-archives-inner'];
    if (!inner) throw new Error('Expected ch2-archives-inner');

    const openLedger = inner.choices.find(c => c.id === 'ch2-open-ledger');
    if (!openLedger) throw new Error('Expected ch2-open-ledger choice');

    const lockedState = {
      ...base,
      chapterId: 'chapter-2',
      chapterTurn: 1,
      currentDialogue: inner,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(lockedState, openLedger)).toBe(lockedState);

    const unlockedState = {
      ...lockedState,
      knownTokens: ['tok:ch02:archives-seal'],
    };

    const next = tsConversationEngine.applyChoice(unlockedState, openLedger);
    expect(next).not.toBe(unlockedState);
    expect(next.currentDialogue?.id).toBe('chapter-2-hub');
    expect(next.knownTokens).toContain('tok:ch02:archives-seal');
    expect(next.knownSecrets.some(s => s.includes('ledger'))).toBe(true);
  });
});
