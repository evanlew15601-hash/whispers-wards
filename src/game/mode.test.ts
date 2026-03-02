import { describe, expect, it } from 'vitest';

import type { GameState } from './types';

import { getGameMode, isFocusMode } from './mode';

const base: GameState = {
  currentScene: 'game',
  player: { name: 'Envoy', pronouns: 'they/them', portraitId: 'envoy-default' },
  factions: [],
  currentDialogue: null,
  events: [],
  knownSecrets: [],
  selectedChoiceIds: [],
  stepNumber: 0,
  turnNumber: 1,
  chapterId: 'chapter-1',
  chapterTurn: 1,
  milestones: [],
  resources: { coin: 0, influence: 0, supplies: 0, intel: 0 },
  projects: [],
  management: { apMax: 3, apRemaining: 3, actionsTakenThisTurn: [], lastUsedTurnByActionId: {}, usedThisChapter: {} },
  log: [],
  rngSeed: 1,
  world: { regions: {}, tradeRoutes: {}, tensions: {}, aiMemory: { lastOfferTurn: {}, lastEmbargoTurn: {} } },
  pendingEncounter: null,
};

describe('mode helpers', () => {
  it('derives mode from the current dialogue id', () => {
    expect(getGameMode(base, 'hub')).toBe('epilogue');

    expect(getGameMode({ ...base, currentDialogue: { id: 'hub', speaker: '', text: '', choices: [] } }, 'hub')).toBe('hall');

    expect(getGameMode({ ...base, currentDialogue: { id: 'encounter:x', speaker: '', text: '', choices: [] } }, 'hub')).toBe('encounter');

    expect(getGameMode({ ...base, currentDialogue: { id: 'scene:y', speaker: '', text: '', choices: [] } }, 'hub')).toBe('scene');
  });

  it('treats encounter and scene as focus mode', () => {
    expect(isFocusMode('hall')).toBe(false);
    expect(isFocusMode('scene')).toBe(true);
    expect(isFocusMode('encounter')).toBe(true);
    expect(isFocusMode('epilogue')).toBe(false);
  });
});
