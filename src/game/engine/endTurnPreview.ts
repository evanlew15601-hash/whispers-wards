import type { GameState } from '../types';

import { describeExpiredEncounterConsequence } from '../encounters';
import { BASE_INCOME, computeDeterministicIncome } from './income';

export type EndTurnPreview = {
  nextTurnNumber: number;
  apResetTo: number;
  coinIncome: number;
  influenceIncome: number;
  suppliesIncome: number;
  intelIncome: number;
  openRoutes: number;
  blockedRoutes: number;
  activeProjects: number;
  crisisExpiresNow: boolean;
  crisisExpiryPreview: string | null;
};

export const previewEndTurn = (state: GameState): EndTurnPreview | null => {
  if (state.currentScene !== 'game') return null;

  const nextTurnNumber = state.turnNumber + 1;

  const income = computeDeterministicIncome(state.world);

  const activeProjects = state.projects.filter(p => p.status === 'active').length;

  const crisisExpiresNow = Boolean(state.pendingEncounter && state.pendingEncounter.expiresOnTurn < nextTurnNumber);

  const factionNameById = Object.fromEntries(state.factions.map(f => [f.id, f.name] as const));

  const crisisExpiryPreview =
    crisisExpiresNow && state.pendingEncounter
      ? describeExpiredEncounterConsequence({
          world: state.world,
          encounter: state.pendingEncounter,
          turnNumber: nextTurnNumber,
          factionNameById,
        })
      : null;

  return {
    nextTurnNumber,
    apResetTo: state.management.apMax,
    coinIncome: income.coinIncome,
    influenceIncome: BASE_INCOME.influence,
    suppliesIncome: BASE_INCOME.supplies,
    intelIncome: BASE_INCOME.intel,
    openRoutes: income.openRoutes,
    blockedRoutes: income.blockedRoutes,
    activeProjects,
    crisisExpiresNow,
    crisisExpiryPreview,
  };
};
