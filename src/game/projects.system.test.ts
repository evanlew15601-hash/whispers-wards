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

    const after1 = tsConversationEngine.endTurn({ ...started, rngSeed: 1 });
    expect(after1.projects[0]?.remainingTurns).toBe(1);
    expect(after1.projects[0]?.status).toBe('active');

    const after2 = tsConversationEngine.endTurn({ ...after1, rngSeed: 1 });
    expect(after2.projects[0]?.remainingTurns).toBe(0);
    expect(after2.projects[0]?.status).toBe('completed');

    expect(after2.milestones).toContain('project:scribe-audit:complete');
    expect(after2.resources.intel).toBeGreaterThan(started.resources.intel);
    expect(after2.log.some(l => l.includes('Project completed:'))).toBe(true);
    expect(after2.log.some(l => l.includes('🔍 Project complete:'))).toBe(true);
  });
});
