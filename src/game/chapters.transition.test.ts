import { describe, expect, it } from 'vitest';

import { getDialogueTree } from './data';
import { tsConversationEngine } from './engine/tsConversationEngine';
import { applyManagementAction } from './management/applyManagementAction';

describe('chapter transitions', () => {
  it('moves into chapter-2 without resetting factions/events and preserves knownTokens', () => {
    const base = tsConversationEngine.startNewGame();

    const started = applyManagementAction(base, 'projects:start:scribe-audit');
    const accelerated = applyManagementAction(started, 'projects:accelerate:scribe-audit');

    const withToken = {
      ...accelerated,
      knownTokens: ['tok:ch01:test-proof'],
      rngSeed: 1,
    };

    const repBefore = Object.fromEntries(withToken.factions.map(f => [f.id, f.reputation] as const));
    const eventsBefore = withToken.events.map(e => ({ id: e.id, triggered: e.triggered }));

    const after = tsConversationEngine.endTurn(withToken);

    expect(after.chapterId).toBe('chapter-2');
    expect(after.currentDialogue?.id).toBe('chapter-2-hub');

    const repAfter = Object.fromEntries(after.factions.map(f => [f.id, f.reputation] as const));
    expect(repAfter).toEqual(repBefore);

    const eventsAfter = after.events.map(e => ({ id: e.id, triggered: e.triggered }));
    expect(eventsAfter).toEqual(eventsBefore);

    expect(after.knownTokens).toContain('tok:ch01:test-proof');
  });

  it('moves into chapter-3 once chapter-2 is resolved and preserves knownTokens', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter2Hub = getDialogueTree('chapter-2')['chapter-2-hub'];
    if (!chapter2Hub) throw new Error('Expected chapter-2-hub');

    const withToken = {
      ...base,
      chapterId: 'chapter-2',
      chapterTurn: 1,
      currentDialogue: chapter2Hub,
      milestones: [...base.milestones, 'chapter-2:resolved'],
      knownTokens: ['tok:ch02:test'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(withToken);

    expect(after.chapterId).toBe('chapter-3');
    expect(after.currentDialogue?.id).toBe('chapter-3-hub');
    expect(after.knownTokens).toContain('tok:ch02:test');
  });

  it('moves into chapter-4 once chapter-3 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter3Hub = getDialogueTree('chapter-3')['chapter-3-hub'];
    if (!chapter3Hub) throw new Error('Expected chapter-3-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-3',
      chapterTurn: 1,
      currentDialogue: chapter3Hub,
      milestones: [...base.milestones, 'chapter-3:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-4');
    expect(after.currentDialogue?.id).toBe('chapter-4-hub');
  });

  it('moves into chapter-5 once chapter-4 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter4Hub = getDialogueTree('chapter-4')['chapter-4-hub'];
    if (!chapter4Hub) throw new Error('Expected chapter-4-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-4',
      chapterTurn: 1,
      currentDialogue: chapter4Hub,
      milestones: [...base.milestones, 'chapter-4:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-5');
    expect(after.currentDialogue?.id).toBe('chapter-5-hub');
  });

  it('moves into chapter-6 once chapter-5 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter5Hub = getDialogueTree('chapter-5')['chapter-5-hub'];
    if (!chapter5Hub) throw new Error('Expected chapter-5-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-5',
      chapterTurn: 1,
      currentDialogue: chapter5Hub,
      milestones: [...base.milestones, 'chapter-5:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-6');
    expect(after.currentDialogue?.id).toBe('chapter-6-hub');
  });

  it('moves into chapter-7 once chapter-6 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter6Hub = getDialogueTree('chapter-6')['chapter-6-hub'];
    if (!chapter6Hub) throw new Error('Expected chapter-6-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-6',
      chapterTurn: 1,
      currentDialogue: chapter6Hub,
      milestones: [...base.milestones, 'chapter-6:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-7');
    expect(after.currentDialogue?.id).toBe('chapter-7-hub');
  });

  it('moves into chapter-8 once chapter-7 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter7Hub = getDialogueTree('chapter-7')['chapter-7-hub'];
    if (!chapter7Hub) throw new Error('Expected chapter-7-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-7',
      chapterTurn: 1,
      currentDialogue: chapter7Hub,
      milestones: [...base.milestones, 'chapter-7:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-8');
    expect(after.currentDialogue?.id).toBe('chapter-8-hub');
  });

  it('moves into chapter-9 once chapter-8 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter8Hub = getDialogueTree('chapter-8')['chapter-8-hub'];
    if (!chapter8Hub) throw new Error('Expected chapter-8-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-8',
      chapterTurn: 1,
      currentDialogue: chapter8Hub,
      milestones: [...base.milestones, 'chapter-8:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-9');
    expect(after.currentDialogue?.id).toBe('chapter-9-hub');
  });

  it('moves into chapter-10 once chapter-9 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter9Hub = getDialogueTree('chapter-9')['chapter-9-hub'];
    if (!chapter9Hub) throw new Error('Expected chapter-9-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-9',
      chapterTurn: 1,
      currentDialogue: chapter9Hub,
      milestones: [...base.milestones, 'chapter-9:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-10');
    expect(after.currentDialogue?.id).toBe('chapter-10-hub');
  });

  it('moves into chapter-11 once chapter-10 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter10Hub = getDialogueTree('chapter-10')['chapter-10-hub'];
    if (!chapter10Hub) throw new Error('Expected chapter-10-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-10',
      chapterTurn: 1,
      currentDialogue: chapter10Hub,
      milestones: [...base.milestones, 'chapter-10:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-11');
    expect(after.currentDialogue?.id).toBe('chapter-11-hub');
  });

  it('moves into chapter-12 once chapter-11 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter11Hub = getDialogueTree('chapter-11')['chapter-11-hub'];
    if (!chapter11Hub) throw new Error('Expected chapter-11-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-11',
      chapterTurn: 1,
      currentDialogue: chapter11Hub,
      milestones: [...base.milestones, 'chapter-11:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-12');
    expect(after.currentDialogue?.id).toBe('chapter-12-hub');
  });

  it('moves into chapter-13 once chapter-12 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter12Hub = getDialogueTree('chapter-12')['chapter-12-hub'];
    if (!chapter12Hub) throw new Error('Expected chapter-12-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-12',
      chapterTurn: 1,
      currentDialogue: chapter12Hub,
      milestones: [...base.milestones, 'chapter-12:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-13');
    expect(after.currentDialogue?.id).toBe('chapter-13-hub');
  });

  it('moves into chapter-14 once chapter-13 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter13Hub = getDialogueTree('chapter-13')['chapter-13-hub'];
    if (!chapter13Hub) throw new Error('Expected chapter-13-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-13',
      chapterTurn: 1,
      currentDialogue: chapter13Hub,
      milestones: [...base.milestones, 'chapter-13:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-14');
    expect(after.currentDialogue?.id).toBe('chapter-14-hub');
  });

  it('moves into chapter-15 once chapter-14 is resolved', () => {
    const base = tsConversationEngine.startNewGame();

    const chapter14Hub = getDialogueTree('chapter-14')['chapter-14-hub'];
    if (!chapter14Hub) throw new Error('Expected chapter-14-hub');

    const resolved = {
      ...base,
      chapterId: 'chapter-14',
      chapterTurn: 1,
      currentDialogue: chapter14Hub,
      milestones: [...base.milestones, 'chapter-14:resolved'],
      rngSeed: 1,
    };

    const after = tsConversationEngine.endTurn(resolved);

    expect(after.chapterId).toBe('chapter-15');
    expect(after.currentDialogue?.id).toBe('chapter-15-hub');
  });
});
