import type { GameState } from '../types';

import { applyEffects } from '../effects';
import { getManagementActionAvailability, getManagementActionById } from './actions';

export const applyManagementAction = (prev: GameState, actionId: string): GameState => {
  if (prev.currentScene !== 'game') return prev;

  const action = getManagementActionById(actionId);
  if (!action) return prev;

  const availability = getManagementActionAvailability(prev, action);
  if (!availability.available) return prev;

  const nextAp = prev.management.apRemaining - action.apCost;

  let next: GameState = {
    ...prev,
    stepNumber: prev.stepNumber + 1,
    management: {
      ...prev.management,
      apRemaining: nextAp,
      actionsTakenThisTurn: [...prev.management.actionsTakenThisTurn, action.id],
      lastUsedTurnByActionId: {
        ...prev.management.lastUsedTurnByActionId,
        [action.id]: prev.turnNumber,
      },
      usedThisChapter: action.oncePerChapter
        ? {
            ...prev.management.usedThisChapter,
            [action.id]: true,
          }
        : prev.management.usedThisChapter,
    },
  };

  if (action.costs?.length) {
    const updated = { ...next.resources };
    for (const cost of action.costs) {
      const current = updated[cost.resourceId] ?? 0;
      updated[cost.resourceId] = Math.max(0, current - cost.amount);
    }
    next = {
      ...next,
      resources: updated,
    };
  }

  next = applyEffects(next, action.effects);

  return {
    ...next,
    log: [...next.log, `🛠 Action: ${action.title}`],
  };
};
