import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../chapters';
import { getProjectTemplateById } from '../projects';
import { MANAGEMENT_ACTIONS } from './actions';

describe('management/actions integrity', () => {
  it('management action ids are unique', () => {
    const ids = MANAGEMENT_ACTIONS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('chapters reference management/project pools that have at least one action', () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(MANAGEMENT_ACTIONS.some(a => a.poolId === chapter.managementPoolId)).toBe(true);
      expect(MANAGEMENT_ACTIONS.some(a => a.poolId === chapter.projectPoolId)).toBe(true);
    }
  });

  it('project actions reference valid project templates', () => {
    for (const action of MANAGEMENT_ACTIONS) {
      for (const eff of action.effects) {
        if (eff.kind === 'project:start') {
          expect(getProjectTemplateById(eff.templateId)).toBeTruthy();
        }

        if (
          eff.kind === 'project:pauseByTemplate' ||
          eff.kind === 'project:resumeByTemplate' ||
          eff.kind === 'project:cancelByTemplate' ||
          eff.kind === 'project:accelerateByTemplate'
        ) {
          expect(getProjectTemplateById(eff.templateId)).toBeTruthy();
        }
      }
    }
  });
});
