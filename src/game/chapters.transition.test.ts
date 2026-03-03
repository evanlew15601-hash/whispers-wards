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
});
