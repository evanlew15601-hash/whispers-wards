import { describe, expect, it } from 'vitest';

import { tsConversationEngine } from './engine/tsConversationEngine';
import { applyManagementAction } from './management/applyManagementAction';

describe('projects system', () => {
  it('can start a project via management action and completes after its duration', () => {
    const base = tsConversationEngine.startNewGame();

    const started = applyManagementAction(base, 'projects:start:scribe-audit');
    expect(started).not.toBe(base);

    expect(started.projects).toHaveLength(1);
    expect(started.projects[0]?.templateId).toBe('scribe-audit');
    expect(started.projects[0]?.remainingTurns).toBe(2);
    expect(started.projects[0]?.status).toBe('active');

    const accelerated = applyManagementAction(started, 'projects:accelerate:scribe-audit');
    expect(accelerated.projects[0]?.remainingTurns).toBe(1);

    const after1 = tsConversationEngine.endTurn({ ...accelerated, rngSeed: 1 });
    expect(after1.projects[0]?.remainingTurns).toBe(0);
    expect(after1.projects[0]?.status).toBe('completed');

    expect(after1.milestones).toContain('project:scribe-audit:complete');
    expect(after1.resources.intel).toBeGreaterThan(started.resources.intel);
    expect(after1.log.some(l => l.includes('Project completed:'))).toBe(true);
    expect(after1.log.some(l => l.includes('[PROJ] Project complete:'))).toBe(true);
  });
});
