import { describe, expect, it } from 'vitest';

import { tsConversationEngine } from '../engine/tsConversationEngine';
import { applyManagementAction } from './applyManagementAction';

describe('applyManagementAction', () => {
  it('consumes AP/resources and applies effects', () => {
    const base = tsConversationEngine.startNewGame();

    const seeded = {
      ...base,
      rngSeed: 123,
      world: {
        ...base.world,
        tensions: {
          ...base.world.tensions,
          'iron-pact': { ...base.world.tensions['iron-pact'], 'verdant-court': 12 },
          'verdant-court': { ...base.world.tensions['verdant-court'], 'iron-pact': 12 },
        },
      },
    };

    const beforeInfluence = seeded.resources.influence;

    const next = applyManagementAction(seeded, 'diplomacy:quiet-talks:iron-verdant');

    expect(next).not.toBe(seeded);
    expect(next.stepNumber).toBe(seeded.stepNumber + 1);
    expect(next.management.apRemaining).toBe(seeded.management.apRemaining - 1);
    expect(next.resources.influence).toBe(beforeInfluence - 1);

    expect(next.world.tensions['iron-pact']?.['verdant-court']).toBe(6);
    expect(next.world.tensions['verdant-court']?.['iron-pact']).toBe(6);

    expect(next.log[next.log.length - 1]).toContain('🛠 Action:');
  });

  it('prevents repeating the same action within the same turn', () => {
    const base = tsConversationEngine.startNewGame();

    const once = applyManagementAction(base, 'routes:escort:ashroad');
    const twice = applyManagementAction(once, 'routes:escort:ashroad');

    expect(twice).toBe(once);
  });

  it('enforces cooldown across turns (cooldownTurns=1 => available again on turn+2)', () => {
    const base = tsConversationEngine.startNewGame();

    const used = applyManagementAction(base, 'routes:escort:ashroad');
    expect(used.management.lastUsedTurnByActionId['routes:escort:ashroad']).toBe(base.turnNumber);

    const nextTurn = tsConversationEngine.endTurn({ ...used, rngSeed: 1 });
    expect(nextTurn.turnNumber).toBe(base.turnNumber + 1);

    const blocked = applyManagementAction(nextTurn, 'routes:escort:ashroad');
    expect(blocked).toBe(nextTurn);

    const nextTurn2 = tsConversationEngine.endTurn({ ...nextTurn, rngSeed: 1 });
    expect(nextTurn2.turnNumber).toBe(base.turnNumber + 2);

    const allowed = applyManagementAction(nextTurn2, 'routes:escort:ashroad');
    expect(allowed).not.toBe(nextTurn2);
  });

  it('can start and accelerate a project', () => {
    const base = tsConversationEngine.startNewGame();

    const blocked = applyManagementAction(base, 'projects:accelerate:scribe-audit');
    expect(blocked).toBe(base);

    const started = applyManagementAction(base, 'projects:start:scribe-audit');
    expect(started).not.toBe(base);
    expect(started.projects[0]?.templateId).toBe('scribe-audit');
    expect(started.projects[0]?.remainingTurns).toBe(2);

    const beforeCoin = started.resources.coin;
    const accelerated = applyManagementAction(started, 'projects:accelerate:scribe-audit');

    expect(accelerated).not.toBe(started);
    expect(accelerated.projects[0]?.remainingTurns).toBe(1);
    expect(accelerated.resources.coin).toBe(beforeCoin - 2);
  });

  it('can pause, resume, and cancel a project', () => {
    const base = tsConversationEngine.startNewGame();

    const started = applyManagementAction(base, 'projects:start:scribe-audit');
    const paused = applyManagementAction(started, 'projects:pause:scribe-audit');

    expect(paused).not.toBe(started);
    expect(paused.projects[0]?.status).toBe('paused');

    const resumed = applyManagementAction(paused, 'projects:resume:scribe-audit');
    expect(resumed).not.toBe(paused);
    expect(resumed.projects[0]?.status).toBe('active');

    const cancelled = applyManagementAction(resumed, 'projects:cancel:scribe-audit');
    expect(cancelled).not.toBe(resumed);
    expect(cancelled.projects[0]?.status).toBe('cancelled');

    const cannotResume = applyManagementAction(cancelled, 'projects:resume:scribe-audit');
    expect(cannotResume).toBe(cancelled);
  });

  it('can start and complete the frontier relief project', () => {
    const base = tsConversationEngine.startNewGame();

    const started = applyManagementAction(base, 'projects:start:frontier-relief');
    expect(started).not.toBe(base);
    expect(started.projects[0]?.templateId).toBe('frontier-relief');
    expect(started.projects[0]?.remainingTurns).toBe(3);

    const after1 = tsConversationEngine.endTurn({ ...started, rngSeed: 1 });
    const after2 = tsConversationEngine.endTurn({ ...after1, rngSeed: 1 });
    const after3 = tsConversationEngine.endTurn({ ...after2, rngSeed: 1 });

    const pr = after3.projects.find(p => p.templateId === 'frontier-relief');
    expect(pr?.status).toBe('completed');
    expect(after3.milestones).toContain('project:frontier-relief:complete');
  });
});
