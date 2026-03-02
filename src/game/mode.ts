import type { GameState } from './types';

export type GameMode = 'hall' | 'scene' | 'encounter' | 'epilogue';

export const getGameMode = (state: GameState, hubNodeId: string): GameMode => {
  const id = state.currentDialogue?.id ?? null;
  if (!id) return 'epilogue';
  if (id.startsWith('encounter:')) return 'encounter';
  if (id === hubNodeId) return 'hall';
  return 'scene';
};

export const isFocusMode = (mode: GameMode): boolean => {
  return mode === 'scene' || mode === 'encounter';
};
