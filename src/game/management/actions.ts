import type { GameEffect } from '../effects';
import type { GameState } from '../types';

export type ManagementActionCategory = 'diplomacy' | 'routes' | 'projects';

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
  if (action.category === 'routes' && action.routeId) {
    if (!state.world.tradeRoutes[action.routeId]) {
      return { available: false, reason: 'Unknown route' };
    }
  }

  if (action.category === 'projects') {
    const start = action.effects.find(e => e.kind === 'project:start');
    if (
      start &&
      state.projects.some(p => p.templateId === start.templateId && p.status !== 'cancelled' && p.status !== 'completed')
    ) {
      return { available: false, reason: 'Project already underway' };
    }

    const accelerate = action.effects.find(e => e.kind === 'project:accelerateByTemplate');
    if (accelerate) {
      const hasActive = state.projects.some(p => p.templateId === accelerate.templateId && p.status === 'active');
      if (!hasActive) return { available: false, reason: 'No active project to accelerate' };
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

const mkProjectStart = (args: {
  id: string;
  title: string;
  description: string;
  templateId: string;
  apCost?: number;
  coinCost?: number;
  influenceCost?: number;
  oncePerChapter?: boolean;
}): ManagementAction => {
  const apCost = args.apCost ?? 2;
  const coinCost = args.coinCost ?? 3;
  const influenceCost = args.influenceCost ?? 1;

  const costs: Array<{ resourceId: keyof GameState['resources']; amount: number }> = [];
  if (coinCost > 0) costs.push({ resourceId: 'coin', amount: coinCost });
  if (influenceCost > 0) costs.push({ resourceId: 'influence', amount: influenceCost });

  return {
    id: args.id,
    title: args.title,
    description: args.description,
    category: 'projects',
    apCost,
    oncePerChapter: args.oncePerChapter ?? true,
    costs: costs.length ? costs : undefined,
    effects: [
      { kind: 'project:start', templateId: args.templateId },
      { kind: 'log', message: `📌 Project started: ${args.title}` },
    ],
  };
};

const mkProjectAccelerate = (args: {
  id: string;
  title: string;
  description: string;
  templateId: string;
  apCost?: number;
  coinCost?: number;
  deltaTurns: number;
  cooldownTurns?: number;
}): ManagementAction => {
  const apCost = args.apCost ?? 1;
  const coinCost = args.coinCost ?? 1;

  const costs: Array<{ resourceId: keyof GameState['resources']; amount: number }> = [];
  if (coinCost > 0) costs.push({ resourceId: 'coin', amount: coinCost });

  return {
    id: args.id,
    title: args.title,
    description: args.description,
    category: 'projects',
    apCost,
    cooldownTurns: args.cooldownTurns ?? 1,
    costs: costs.length ? costs : undefined,
    effects: [
      { kind: 'project:accelerateByTemplate', templateId: args.templateId, deltaTurns: args.deltaTurns },
      { kind: 'log', message: `⏩ Project accelerated: ${args.title}` },
    ],
  };
};

export const MANAGEMENT_ACTIONS: ManagementAction[] = [
  mkProjectStart({
    id: 'projects:start:scribe-audit',
    title: 'Scribes’ audit',
    description: 'Commission a neutral audit of ledgers and manifests to surface hidden patronage.',
    templateId: 'scribe-audit',
    apCost: 2,
    coinCost: 3,
    influenceCost: 1,
  }),
  mkProjectAccelerate({
    id: 'projects:accelerate:scribe-audit',
    title: 'Scribes’ audit',
    description: 'Assign additional clerks and couriers to shorten the audit by one turn.',
    templateId: 'scribe-audit',
    apCost: 1,
    coinCost: 2,
    deltaTurns: 1,
    cooldownTurns: 0,
  }),

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
