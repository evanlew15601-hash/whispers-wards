import { describe, expect, it } from 'vitest';

import type { GameState } from '../types';

import { previewEndTurn } from './endTurnPreview';

const baseState: GameState = {
  currentScene: 'game',
  player: { name: 'Envoy', pronouns: 'they/them', portraitId: 'envoy-default' },
  factions: [
    { id: 'iron', name: 'Iron', description: '', motto: '', color: 'iron', reputation: 0, traits: [] },
    { id: 'verdant', name: 'Verdant', description: '', motto: '', color: 'verdant', reputation: 0, traits: [] },
  ],
  currentDialogue: null,
  events: [],
  knownSecrets: [],
  selectedChoiceIds: [],
  stepNumber: 0,
  turnNumber: 10,
  chapterId: 'chapter-1',
  chapterTurn: 1,
  milestones: [],
  resources: { coin: 0, influence: 0, supplies: 0, intel: 0 },
  projects: [{
    id: 'p1',
    templateId: 't',
    title: 'Project',
    description: '',
    status: 'active',
    startedTurn: 1,
    remainingTurns: 2,
  }],
  management: { apMax: 3, apRemaining: 0, actionsTakenThisTurn: [], lastUsedTurnByActionId: {}, usedThisChapter: {} },
  log: [],
  rngSeed: 1,
  world: {
    regions: {},
    tradeRoutes: {
      a: { id: 'a', name: 'A', status: 'open', affectedFactions: ['iron', 'verdant'] },
      b: { id: 'b', name: 'B', status: 'raided', affectedFactions: ['iron', 'verdant'], untilTurn: 12 },
    },
    tensions: {},
    aiMemory: { lastOfferTurn: {}, lastEmbargoTurn: {} },
  },
  pendingEncounter: null,
};

describe('previewEndTurn', () => {
  it('computes deterministic income and project count', () => {
    const preview = previewEndTurn(baseState);
    expect(preview).not.toBeNull();

    expect(preview!.nextTurnNumber).toBe(11);
    expect(preview!.apResetTo).toBe(3);

    // base 1 + open(1) - blocked(1) => 1
    expect(preview!.coinIncome).toBe(1);
    expect(preview!.activeProjects).toBe(1);
    expect(preview!.blockedRoutes).toBe(1);
    expect(preview!.openRoutes).toBe(1);
  });

  it('includes a crisis expiry preview only when the crisis expires this End Turn', () => {
    const withCrisis: GameState = {
      ...baseState,
      pendingEncounter: {
        id: 'enc',
        kind: 'raid',
        routeId: 'a',
        title: 'Caravans attacked',
        description: 'test',
        relatedFactions: ['iron', 'verdant'],
        // expires on the current turn, so it expires on End Turn (nextTurnNumber=11).
        expiresOnTurn: baseState.turnNumber,
      },
    };

    const preview = previewEndTurn(withCrisis)!;
    expect(preview.crisisExpiresNow).toBe(true);
    expect(preview.crisisExpiryPreview).toMatch(/If ignored:/);
    expect(preview.crisisExpiryPreview).toMatch(/Trade route: A becomes raided/);
  });
});
