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
});
