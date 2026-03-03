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

  it('locks chapter-4 session outcomes behind proof tokens', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-4');

    const session = tree['ch4-session'];
    if (!session) throw new Error('Expected ch4-session');

    const publish = session.choices.find(c => c.id === 'ch4-session-publish');
    if (!publish) throw new Error('Expected ch4-session-publish');

    const locked = {
      ...base,
      chapterId: 'chapter-4',
      chapterTurn: 1,
      currentDialogue: session,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, publish)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch04:proof:cutouts', 'tok:ch04:proof:missing-lines'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, publish);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch4-ending-publish');
    expect(next.milestones).toContain('chapter-4:resolved');
    expect(next.milestones).toContain('chapter-4:resolved:publish');
    expect(next.knownTokens).toContain('tok:ch04:outcome:publish');
  });

  it('locks chapter-6 outcomes behind proof tokens', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-6');

    const decision = tree['ch6-decision'];
    if (!decision) throw new Error('Expected ch6-decision');

    const raid = decision.choices.find(c => c.id === 'ch6-decision-raid');
    if (!raid) throw new Error('Expected ch6-decision-raid');

    const locked = {
      ...base,
      chapterId: 'chapter-6',
      chapterTurn: 1,
      currentDialogue: decision,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, raid)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch06:proof:seal'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, raid);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch6-ending-raid');
    expect(next.milestones).toContain('chapter-6:resolved');
    expect(next.milestones).toContain('chapter-6:resolved:raid');
    expect(next.knownTokens).toContain('tok:ch06:outcome:raid');
  });

  it('locks chapter-7 scandal option behind manifest + witness proof', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-7');

    const decision = tree['ch7-decision'];
    if (!decision) throw new Error('Expected ch7-decision');

    const expose = decision.choices.find(c => c.id === 'ch7-decision-expose');
    if (!expose) throw new Error('Expected ch7-decision-expose');

    const locked = {
      ...base,
      chapterId: 'chapter-7',
      chapterTurn: 1,
      currentDialogue: decision,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, expose)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch07:proof:manifest', 'tok:ch07:proof:witness'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, expose);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch7-ending-expose');
    expect(next.milestones).toContain('chapter-7:resolved');
    expect(next.milestones).toContain('chapter-7:resolved:expose');
    expect(next.knownTokens).toContain('tok:ch07:outcome:expose');
  });
});
