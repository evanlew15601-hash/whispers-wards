import { describe, expect, it } from 'vitest';

import { getDialogueTree } from '../data';
import { tsConversationEngine } from '../engine/tsConversationEngine';
import { applyGameFlowEvent } from './gameFlow';

describe('gameFlow (state-machine guards)', () => {
  it('ignores choice events outside gameplay modes', () => {
    const engine = tsConversationEngine;

    const tree = getDialogueTree('chapter-1');

    const titleState = {
      ...engine.createInitialState(),
      currentDialogue: tree['opening'],
      currentScene: 'title',
    };

    const choice = tree['opening'].choices[0];

    const next = applyGameFlowEvent(titleState, { type: 'choice', choice }, engine);
    expect(next).toBe(titleState);
  });

  it('enterPendingEncounter increments stepNumber and logs', () => {
    const engine = tsConversationEngine;

    const start = engine.startNewGame();

    const tree = getDialogueTree('chapter-1');

    const hubState = {
      ...start,
      currentDialogue: tree['concord-hub'],
      pendingEncounter: {
        id: 'enc-test',
        kind: 'embargo',
        routeId: 'ashroad',
        title: 'Embargo crisis',
        description: 'Test encounter.',
        relatedFactions: ['ember-throne', 'iron-pact'],
        expiresOnTurn: start.turnNumber + 2,
      },
    };

    const next = applyGameFlowEvent(hubState, { type: 'enterPendingEncounter' }, engine);

    expect(next.currentDialogue?.id).toBe('encounter:enc-test');
    expect(next.stepNumber).toBe(hubState.stepNumber + 1);
    expect(next.log.at(-1)).toBe('⚔ Encounter: Embargo crisis');
  });

  it('returnToHub is a no-op from hub, but works from a scene', () => {
    const engine = tsConversationEngine;

    const start = engine.startNewGame();

    const tree = getDialogueTree('chapter-1');

    const fromHub = {
      ...start,
      currentDialogue: tree['concord-hub'],
    };

    const hubNext = applyGameFlowEvent(fromHub, { type: 'returnToHub' }, engine);
    expect(hubNext).toBe(fromHub);

    const fromScene = {
      ...start,
      currentDialogue: tree['opening'],
    };

    const sceneNext = applyGameFlowEvent(fromScene, { type: 'returnToHub' }, engine);
    expect(sceneNext).not.toBe(fromScene);
    expect(sceneNext.currentDialogue?.id).toBe('concord-hub');
    expect(sceneNext.stepNumber).toBe(fromScene.stepNumber + 1);
    expect(sceneNext.log.at(-1)).toBe('↩ Returned to Concord Hall');
  });
});
