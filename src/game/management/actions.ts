import type { GameEffect } from '../effects';
import type { GameState } from '../types';

export type ManagementActionCategory = 'diplomacy' | 'routes';

export type ManagementActionRequirement =
  | { kind: 'repAtLeast'; factionId: string; min: number }
  | { kind: 'resourceAtLeast'; resourceId: keyof GameState['resources']; min: number }
  | { kind: 'secretKnown'; secret: string }
  | { kind: 'milestone'; id: string };

export type ManagementActionCost = { resourceId: keyof GameState['resources']; amount: number };

export type ManagementAction = {
  id: string;
  title: string;
  description: string;
  category: ManagementActionCategory;
  apCost: number;
  cooldownTurns?: number;
  oncePerChapter?: boolean;
  requirements?: ManagementActionRequirement[];
  costs?: ManagementActionCost[];
  effects: GameEffect[];
};

export type ManagementActionAvailability =
  | { available: true }
  | { available: false; reason: string };

const hasResources = (state: GameState, costs: ManagementActionCost[] | undefined) => {
  if (!costs?.length) return true;
  return costs.every(c => (state.resources[c.resourceId] ?? 0) >= c.amount);
};

const hasRequirements = (state: GameState, reqs: ManagementActionRequirement[] | undefined) => {
  if (!reqs?.length) return true;

  for (const r of reqs) {
    if (r.kind === 'repAtLeast') {
      const rep = state.factions.find(f => f.id === r.factionId)?.reputation ?? -Infinity;
      if (rep < r.min) return false;
      continue;
    }

    if (r.kind === 'resourceAtLeast') {
      const v = state.resources[r.resourceId] ?? 0;
      if (v < r.min) return false;
      continue;
    }

    if (r.kind === 'secretKnown') {
      if (!state.knownSecrets.includes(r.secret)) return false;
      continue;
    }

    if (r.kind === 'milestone') {
      if (!state.milestones.includes(r.id)) return false;
      continue;
    }
  }

  return true;
};

const getCooldownRemaining = (state: GameState, action: ManagementAction): number => {
  const cd = action.cooldownTurns ?? 0;
  if (cd <= 0) return 0;

  const last = state.management.lastUsedTurnByActionId[action.id];
  if (last == null) return 0;

  // cooldownTurns=1 means: cannot use on the next turn (turn last+1), available again on last+2.
  const availableOnTurn = last + cd + 1;
  return Math.max(0, availableOnTurn - state.turnNumber);
};

export const getManagementActionAvailability = (state: GameState, action: ManagementAction): ManagementActionAvailability => {
  if (state.currentScene !== 'game') return { available: false, reason: 'Not in game' };

  if (state.management.apRemaining < action.apCost) {
    return { available: false, reason: 'Not enough AP' };
  }

  if (state.management.actionsTakenThisTurn.includes(action.id)) {
    return { available: false, reason: 'Already used this turn' };
  }

  if (action.oncePerChapter && state.management.usedThisChapter[action.id]) {
    return { available: false, reason: 'Already used this chapter' };
  }

  const cooldownRemaining = getCooldownRemaining(state, action);
  if (cooldownRemaining > 0) {
    return { available: false, reason: `Cooldown (${cooldownRemaining} turn${cooldownRemaining === 1 ? '' : 's'})` };
  }

  if (!hasRequirements(state, action.requirements)) {
    return { available: false, reason: 'Requirements not met' };
  }

  if (!hasResources(state, action.costs)) {
    return { available: false, reason: 'Insufficient resources' };
  }

  // Route actions should be hidden/disabled if the route doesn't exist in the current world.
  if (action.category === 'routes') {
    const routeEffect = action.effects.find(e => e.kind === 'tradeRoute:setStatus');
    if (routeEffect?.kind === 'tradeRoute:setStatus') {
      if (!state.world.tradeRoutes[routeEffect.routeId]) {
        return { available: false, reason: 'Route unavailable' };
      }
    }
  }

  return { available: true };
};

const mkDiplomacy = (args: {
  id: string;
  title: string;
  description: string;
  a: string;
  b: string;
  apCost?: number;
  influenceCost?: number;
  tensionDelta: number;
  cooldownTurns?: number;
}): ManagementAction => {
  const apCost = args.apCost ?? 1;
  const influenceCost = args.influenceCost ?? 1;

  return {
    id: args.id,
    title: args.title,
    description: args.description,
    category: 'diplomacy',
    apCost,
    cooldownTurns: args.cooldownTurns ?? 1,
    costs: influenceCost > 0 ? [{ resourceId: 'influence', amount: influenceCost }] : undefined,
    effects: [
      { kind: 'tension', a: args.a, b: args.b, delta: args.tensionDelta },
      { kind: 'rep', factionId: args.a, delta: 1 },
      { kind: 'rep', factionId: args.b, delta: 1 },
    ],
  };
};

const mkEscortRoute = (args: {
  id: string;
  title: string;
  description: string;
  routeId: string;
  a: string;
  b: string;
  apCost?: number;
  suppliesCost?: number;
  tensionDelta: number;
  cooldownTurns?: number;
}): ManagementAction => {
  const apCost = args.apCost ?? 1;
  const suppliesCost = args.suppliesCost ?? 1;

  return {
    id: args.id,
    title: args.title,
    description: args.description,
    category: 'routes',
    apCost,
    cooldownTurns: args.cooldownTurns ?? 1,
    costs: suppliesCost > 0 ? [{ resourceId: 'supplies', amount: suppliesCost }] : undefined,
    effects: [
      { kind: 'tradeRoute:setStatus', routeId: args.routeId, status: 'open' },
      { kind: 'tension', a: args.a, b: args.b, delta: args.tensionDelta },
    ],
  };
};

export const MANAGEMENT_ACTIONS: ManagementAction[] = [
  mkDiplomacy({
    id: 'diplomacy:quiet-talks:iron-verdant',
    title: 'Quiet talks (Iron Pact ↔ Verdant Court)',
    description: 'Arrange back-channel envoys to cool tempers and soften rhetoric.',
    a: 'iron-pact',
    b: 'verdant-court',
    tensionDelta: -6,
  }),
  mkDiplomacy({
    id: 'diplomacy:quiet-talks:iron-ember',
    title: 'Quiet talks (Iron Pact ↔ Ember Throne)',
    description: 'Send trusted intermediaries to reduce misread intentions.',
    a: 'iron-pact',
    b: 'ember-throne',
    tensionDelta: -6,
  }),
  mkDiplomacy({
    id: 'diplomacy:quiet-talks:verdant-ember',
    title: 'Quiet talks (Verdant Court ↔ Ember Throne)',
    description: 'Lean on shared interests to bring delegations back to the table.',
    a: 'verdant-court',
    b: 'ember-throne',
    tensionDelta: -6,
  }),

  mkEscortRoute({
    id: 'routes:escort:ashroad',
    title: 'Commission escorts (Ash Road)',
    description: 'Neutral escorts restore confidence in caravans along the Ash Road.',
    routeId: 'ashroad',
    a: 'ember-throne',
    b: 'iron-pact',
    tensionDelta: -2,
  }),
  mkEscortRoute({
    id: 'routes:escort:rootway',
    title: 'Commission escorts (Rootway Caravans)',
    description: 'Coordinated patrols reduce banditry and rumor on the Rootway.',
    routeId: 'rootway',
    a: 'verdant-court',
    b: 'ember-throne',
    tensionDelta: -2,
  }),
  mkEscortRoute({
    id: 'routes:escort:passcourier',
    title: 'Commission escorts (Pass Couriers)',
    description: 'Reinforce couriers through Greenmarch to keep messages moving.',
    routeId: 'passcourier',
    a: 'iron-pact',
    b: 'verdant-court',
    tensionDelta: -2,
  }),
];

export const getManagementActionById = (id: string): ManagementAction | null => {
  return MANAGEMENT_ACTIONS.find(a => a.id === id) ?? null;
};
