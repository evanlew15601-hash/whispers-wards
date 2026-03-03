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

  it('locks chapter-8 audit option behind ledger + signature proof', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-8');

    const decision = tree['ch8-decision'];
    if (!decision) throw new Error('Expected ch8-decision');

    const audit = decision.choices.find(c => c.id === 'ch8-decision-audit');
    if (!audit) throw new Error('Expected ch8-decision-audit');

    const locked = {
      ...base,
      chapterId: 'chapter-8',
      chapterTurn: 1,
      currentDialogue: decision,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, audit)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch08:proof:ledger', 'tok:ch08:proof:signature'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, audit);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch8-ending-audit');
    expect(next.milestones).toContain('chapter-8:resolved');
    expect(next.milestones).toContain('chapter-8:resolved:audit');
    expect(next.knownTokens).toContain('tok:ch08:outcome:audit');
  });

  it('locks chapter-9 freeze option behind registry proof', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-9');

    const decision = tree['ch9-decision'];
    if (!decision) throw new Error('Expected ch9-decision');

    const freeze = decision.choices.find(c => c.id === 'ch9-decision-freeze');
    if (!freeze) throw new Error('Expected ch9-decision-freeze');

    const locked = {
      ...base,
      chapterId: 'chapter-9',
      chapterTurn: 1,
      currentDialogue: decision,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, freeze)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch09:proof:registry'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, freeze);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch9-ending-freeze');
    expect(next.milestones).toContain('chapter-9:resolved');
    expect(next.milestones).toContain('chapter-9:resolved:freeze');
    expect(next.knownTokens).toContain('tok:ch09:outcome:freeze');
  });

  it('locks chapter-10 oversight option behind charter + templates proof', () => {
    const base = tsConversationEngine.startNewGame();
    const tree = getDialogueTree('chapter-10');

    const decision = tree['ch10-decision'];
    if (!decision) throw new Error('Expected ch10-decision');

    const oversight = decision.choices.find(c => c.id === 'ch10-decision-oversight');
    if (!oversight) throw new Error('Expected ch10-decision-oversight');

    const locked = {
      ...base,
      chapterId: 'chapter-10',
      chapterTurn: 1,
      currentDialogue: decision,
      knownTokens: [],
    };

    expect(tsConversationEngine.applyChoice(locked, oversight)).toBe(locked);

    const unlocked = {
      ...locked,
      knownTokens: ['tok:ch10:proof:charter', 'tok:ch10:proof:templates'],
    };

    const next = tsConversationEngine.applyChoice(unlocked, oversight);
    expect(next).not.toBe(unlocked);
    expect(next.currentDialogue?.id).toBe('ch10-ending-oversight');
    expect(next.milestones).toContain('chapter-10:resolved');
    expect(next.milestones).toContain('chapter-10:resolved:oversight');
    expect(next.knownTokens).toContain('tok:ch10:outcome:oversight');
  });
});
