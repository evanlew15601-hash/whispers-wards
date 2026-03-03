import type { GameState, PlayerProfile } from '../types';
import type { ConversationEngine } from '../engine/conversationEngine';

import { normalizePlayerProfile } from '../player';

export type AppFlowEvent =
  | { type: 'startGame' }
  | { type: 'confirmNewGame'; player: PlayerProfile }
  | { type: 'openLoadScreen' }
  | { type: 'backToTitle' }
  | { type: 'resetGame' };

export function applyAppFlowEvent(prev: GameState, event: AppFlowEvent, engine: ConversationEngine): GameState {
  if (event.type === 'startGame') {
    // Route new games through the character creator.
    if (prev.currentScene !== 'title' && prev.currentScene !== 'load') return prev;

    const base = engine.createInitialState();
    return {
      ...base,
      currentScene: 'create',
    };
  }

  if (event.type === 'confirmNewGame') {
    if (prev.currentScene !== 'create') return prev;

    const started = engine.startNewGame();
    return {
      ...started,
      player: normalizePlayerProfile(event.player),
      currentScene: 'game',
    };
  }

  if (event.type === 'openLoadScreen') {
    // Allow opening load from anywhere (title or in-game menu).
    return {
      ...prev,
      currentScene: 'load',
    };
  }

  if (event.type === 'backToTitle') {
    return {
      ...prev,
      currentScene: 'title',
    };
  }

  if (event.type === 'resetGame') {
    return engine.createInitialState();
  }

  return prev;
}
