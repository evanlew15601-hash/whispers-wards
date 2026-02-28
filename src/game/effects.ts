import type { GameState, WorldState } from './types';

import { getProjectTemplateById } from './projects';

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
  | { kind: 'project:pauseByTemplate'; templateId: string }
  | { kind: 'project:resume'; projectId: string }
  | { kind: 'project:resumeByTemplate'; templateId: string }
  | { kind: 'project:cancel'; projectId: string }
  | { kind: 'project:cancelByTemplate'; templateId: string }
  | { kind: 'project:accelerate'; projectId: string; deltaTurns: number }
  | { kind: 'project:accelerateByTemplate'; templateId: string; deltaTurns: number }
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
  encounterMemory: world.encounterMemory
    ? {
        lastSeenTurnByTemplateId: { ...world.encounterMemory.lastSeenTurnByTemplateId },
        seenThisChapter: { ...world.encounterMemory.seenThisChapter },
      }
    : undefined,
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

export const applyWorldEffects = (prevWorld: WorldState, effects: GameEffect[]): WorldState => {
  let world: WorldState | null = null;

  for (const eff of effects) {
    if (eff.kind === 'tension') {
      if (eff.delta === 0) continue;
      if (!world) world = cloneWorld(prevWorld);
      adjustTensionPair(world, eff.a, eff.b, eff.delta);
      continue;
    }

    if (eff.kind === 'tradeRoute:setStatus') {
      if (!prevWorld.tradeRoutes[eff.routeId]) continue;
      if (!world) world = cloneWorld(prevWorld);
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
      if (!prevWorld.regions[eff.regionId]) continue;
      if (!world) world = cloneWorld(prevWorld);
      const region = world.regions[eff.regionId];
      if (!region) continue;
      world.regions[eff.regionId] = {
        ...region,
        control: eff.control,
        contested: eff.contested,
      };
      continue;
    }
  }

  return world ?? prevWorld;
};

export const applyEffects = (prev: GameState, effects: GameEffect[]): GameState => {
  if (!effects.length) return prev;

  let next = prev;
  let world: WorldState | null = null;
  let projectStartIdx = 0;
  const followUpEffects: GameEffect[] = [];

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

    if (eff.kind === 'project:start') {
      const template = getProjectTemplateById(eff.templateId);
      if (!template) continue;

      const already = next.projects.some(p => p.templateId === eff.templateId && p.status !== 'cancelled' && p.status !== 'completed');
      if (already) continue;

      if (next === prev) next = { ...next };
      const id = `proj:${eff.templateId}:${next.turnNumber}:${next.stepNumber}:${projectStartIdx++}`;

      next.projects = [
        ...next.projects,
        {
          id,
          templateId: eff.templateId,
          title: template.title,
          description: template.description,
          status: 'active',
          startedTurn: next.turnNumber,
          remainingTurns: template.durationTurns,
        },
      ];
      continue;
    }

    if (eff.kind === 'project:pause') {
      const idx = next.projects.findIndex(p => p.id === eff.projectId);
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p || p.status !== 'active') continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === eff.projectId ? { ...x, status: 'paused' } : x));
      continue;
    }

    if (eff.kind === 'project:pauseByTemplate') {
      const idx = next.projects.findIndex(p => p.templateId === eff.templateId && p.status === 'active');
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p) continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === p.id ? { ...x, status: 'paused' } : x));
      continue;
    }

    if (eff.kind === 'project:resume') {
      const idx = next.projects.findIndex(p => p.id === eff.projectId);
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p || p.status !== 'paused') continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === eff.projectId ? { ...x, status: 'active' } : x));
      continue;
    }

    if (eff.kind === 'project:resumeByTemplate') {
      const idx = next.projects.findIndex(p => p.templateId === eff.templateId && p.status === 'paused');
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p) continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === p.id ? { ...x, status: 'active' } : x));
      continue;
    }

    if (eff.kind === 'project:cancel') {
      const idx = next.projects.findIndex(p => p.id === eff.projectId);
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p || p.status === 'cancelled' || p.status === 'completed') continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === eff.projectId ? { ...x, status: 'cancelled' } : x));
      continue;
    }

    if (eff.kind === 'project:cancelByTemplate') {
      const idx = next.projects.findIndex(p => p.templateId === eff.templateId && p.status !== 'cancelled' && p.status !== 'completed');
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p) continue;
      if (next === prev) next = { ...next };
      next.projects = next.projects.map(x => (x.id === p.id ? { ...x, status: 'cancelled' } : x));
      continue;
    }

    if (eff.kind === 'project:accelerate') {
      const idx = next.projects.findIndex(p => p.id === eff.projectId);
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p || p.status !== 'active') continue;

      const remainingTurns = Math.max(0, p.remainingTurns - eff.deltaTurns);

      if (remainingTurns === p.remainingTurns) continue;
      if (next === prev) next = { ...next };

      const completed = remainingTurns === 0;

      next.projects = next.projects.map(x =>
        x.id === eff.projectId ? { ...x, remainingTurns, status: completed ? 'completed' : x.status } : x
      );

      if (completed) {
        const template = getProjectTemplateById(p.templateId);
        if (template) followUpEffects.push(...template.onCompleteEffects);
        followUpEffects.push({ kind: 'log', message: `📌 Project completed: ${p.title}` });
      }

      continue;
    }

    if (eff.kind === 'project:accelerateByTemplate') {
      const idx = next.projects.findIndex(p => p.templateId === eff.templateId && p.status === 'active');
      if (idx < 0) continue;
      const p = next.projects[idx];
      if (!p) continue;

      const remainingTurns = Math.max(0, p.remainingTurns - eff.deltaTurns);

      if (remainingTurns === p.remainingTurns) continue;
      if (next === prev) next = { ...next };

      const completed = remainingTurns === 0;

      next.projects = next.projects.map(x =>
        x.id === p.id ? { ...x, remainingTurns, status: completed ? 'completed' : x.status } : x
      );

      if (completed) {
        const template = getProjectTemplateById(p.templateId);
        if (template) followUpEffects.push(...template.onCompleteEffects);
        followUpEffects.push({ kind: 'log', message: `📌 Project completed: ${p.title}` });
      }

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
  }

  if (world) {
    if (next === prev) next = { ...next };
    next.world = world;
  }

  if (next !== prev) {
    if (new Set(next.knownSecrets).size !== next.knownSecrets.length) {
      next.knownSecrets = [...new Set(next.knownSecrets)];
    }
    if (new Set(next.milestones).size !== next.milestones.length) {
      next.milestones = [...new Set(next.milestones)];
    }
  }

  if (followUpEffects.length) {
    return applyEffects(next, followUpEffects);
  }

  return next;
};
