import type { GameState } from '../types';
import { getChapter } from '../chapters';

export type GameMode = 'title' | 'load' | 'create' | 'hub' | 'scene' | 'encounter' | 'epilogue';

export function getGameMode(state: GameState): GameMode {
  if (state.currentScene === 'title') return 'title';
  if (state.currentScene === 'load') return 'load';
  if (state.currentScene === 'create') return 'create';

  if (state.currentScene !== 'game') return 'title';

  const dialogueId = state.currentDialogue?.id ?? null;
  if (!dialogueId) return 'epilogue';

  if (dialogueId.startsWith('encounter:')) return 'encounter';

  const chapter = getChapter(state.chapterId);
  return dialogueId === chapter.hubNodeId ? 'hub' : 'scene';
}

export function isInHub(state: GameState): boolean {
  return getGameMode(state) === 'hub';
}

export function isInEncounter(state: GameState): boolean {
  return getGameMode(state) === 'encounter';
}

export function canEndTurn(state: GameState): boolean {
  return isInHub(state);
}

export function canEnterPendingEncounter(state: GameState): boolean {
  return isInHub(state) && Boolean(state.pendingEncounter);
}

export function canReturnToHub(state: GameState): boolean {
  const mode = getGameMode(state);
  return mode === 'scene' || mode === 'epilogue';
}
