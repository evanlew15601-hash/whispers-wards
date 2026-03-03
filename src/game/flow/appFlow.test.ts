import { describe, expect, it } from 'vitest';

import { tsConversationEngine } from '../engine/tsConversationEngine';
import { applyAppFlowEvent } from './appFlow';

describe('appFlow (state-machine guards)', () => {
  it('startGame transitions title -> create', () => {
    const engine = tsConversationEngine;

    const title = engine.createInitialState();
    expect(title.currentScene).toBe('title');

    const next = applyAppFlowEvent(title, { type: 'startGame' }, engine);
    expect(next.currentScene).toBe('create');
  });

  it('confirmNewGame is ignored unless in create', () => {
    const engine = tsConversationEngine;

    const title = engine.createInitialState();

    const ignored = applyAppFlowEvent(
      title,
      { type: 'confirmNewGame', player: { name: 'X', pronouns: 'they/them', portraitId: 'envoy-default' } },
      engine,
    );

    expect(ignored).toBe(title);
  });

  it('confirmNewGame transitions create -> game', () => {
    const engine = tsConversationEngine;

    const create = applyAppFlowEvent(engine.createInitialState(), { type: 'startGame' }, engine);
    expect(create.currentScene).toBe('create');

    const next = applyAppFlowEvent(
      create,
      { type: 'confirmNewGame', player: { name: 'Envoy', pronouns: 'they/them', portraitId: 'envoy-default' } },
      engine,
    );

    expect(next.currentScene).toBe('game');
    expect(next.currentDialogue?.id).toBeTruthy();
  });

  it('openLoadScreen/backToTitle are always allowed', () => {
    const engine = tsConversationEngine;

    const inGame = engine.startNewGame();
    const toLoad = applyAppFlowEvent(inGame, { type: 'openLoadScreen' }, engine);
    expect(toLoad.currentScene).toBe('load');

    const toTitle = applyAppFlowEvent(inGame, { type: 'backToTitle' }, engine);
    expect(toTitle.currentScene).toBe('title');
  });
});
