import type { GameState, WorldState } from './types';

export type GameEffect =
  | { kind: 'rep'; factionId: string; delta: number }
  | { kind: 'secret:add'; secret: string }
  | { kind: 'milestone:add'; id: string }
  | { kind: 'tension'; a: string; b: string; delta: number }
  | { kind: 'tradeRoute:setStatus'; routeId: string; status: 'open' | 'embargoed' | 'raided'; untilTurn?: number; embargoedBy?: string }
  | { kind: 'region:setControl'; regionId: string; control: string | 'neutral'; contested?: boolean }
  | { kind: 'resource'; resourceId: 'coin' | 'influence' | 'supplies' | 'intel'; delta: number }
  | { kind: 'project:start'; templateId: string }
  | { kind: 'project:pause'; projectId: string }
  | { kind: 'project:cancel'; projectId: string }
  | { kind: 'project:accelerate'; projectId: string; deltaTurns: number }
  | { kind: 'log'; message: string };

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const cloneWorld = (world: WorldState): WorldState => ({
  regions: Object.fromEntries(Object.entries(world.regions).map(([k, v]) => [k, { ...v }])) as WorldState['regions'],
  tradeRoutes: Object.fromEntries(Object.entries(world.tradeRoutes).map(([k, v]) => [k, { ...v }])) as WorldState['tradeRoutes'],
  tensions: Object.fromEntries(
    Object.entries(world.tensions).map(([k, row]) => [k, { ...row }])
  ) as WorldState['tensions'],
  aiMemory: {
    lastOfferTurn: { ...world.aiMemory.lastOfferTurn },
    lastEmbargoTurn: { ...world.aiMemory.lastEmbargoTurn },
  },
});

const ensureTensionMatrix = (world: WorldState, a: string, b: string) => {
  if (!world.tensions[a]) world.tensions[a] = {};
  if (!world.tensions[b]) world.tensions[b] = {};
  if (world.tensions[a][b] == null) world.tensions[a][b] = a === b ? 0 : 0;
  if (world.tensions[b][a] == null) world.tensions[b][a] = a === b ? 0 : 0;
};

const adjustTensionPair = (world: WorldState, a: string, b: string, delta: number) => {
  ensureTensionMatrix(world, a, b);
  const next = clamp((world.tensions[a][b] ?? 0) + delta, 0, 100);
  world.tensions[a][b] = next;
  world.tensions[b][a] = next;
};

export const applyEffects = (prev: GameState, effects: GameEffect[]): GameState => {
  if (!effects.length) return prev;

  let next = prev;
  let world: WorldState | null = null;

  for (const eff of effects) {
    if (eff.kind === 'rep') {
      if (next === prev) next = { ...next };
      next.factions = next.factions.map(f =>
        f.id === eff.factionId ? { ...f, reputation: clamp(f.reputation + eff.delta, -100, 100) } : f
      );
      continue;
    }

    if (eff.kind === 'secret:add') {
      if (next.knownSecrets.includes(eff.secret)) continue;
      if (next === prev) next = { ...next };
      next.knownSecrets = [...next.knownSecrets, eff.secret];
      continue;
    }

    if (eff.kind === 'milestone:add') {
      if (next.milestones.includes(eff.id)) continue;
      if (next === prev) next = { ...next };
      next.milestones = [...next.milestones, eff.id];
      continue;
    }

    if (eff.kind === 'resource') {
      const current = next.resources[eff.resourceId] ?? 0;
      const updated = Math.max(0, current + eff.delta);
      if (updated === current) continue;
      if (next === prev) next = { ...next };
      next.resources = { ...next.resources, [eff.resourceId]: updated };
      continue;
    }

    if (eff.kind === 'log') {
      if (next === prev) next = { ...next };
      next.log = [...next.log, eff.message];
      continue;
    }

    // World effects.
    if (!world) world = cloneWorld(next.world);

    if (eff.kind === 'tension') {
      adjustTensionPair(world, eff.a, eff.b, eff.delta);
      continue;
    }

    if (eff.kind === 'tradeRoute:setStatus') {
      const route = world.tradeRoutes[eff.routeId];
      if (!route) continue;
      world.tradeRoutes[eff.routeId] = {
        ...route,
        status: eff.status,
        untilTurn: eff.untilTurn,
        embargoedBy: eff.embargoedBy,
      };
      continue;
    }

    if (eff.kind === 'region:setControl') {
      const region = world.regions[eff.regionId];
      if (!region) continue;
      world.regions[eff.regionId] = {
        ...region,
        control: eff.control,
        contested: eff.contested,
      };
      continue;
    }

    // Project effects are stubs for now; projects are introduced in a later phase.
    if (eff.kind.startsWith('project:')) {
      continue;
    }
  }

  if (world) {
    if (next === prev) next = { ...next };
    next.world = world;
  }

  return next;
};
