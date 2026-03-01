import type { GameEffect } from './effects';
import type { GameState, ProjectInstance } from './types';

export type ProjectTemplate = {
  id: string;
  title: string;
  description: string;
  durationTurns: number;
  onCompleteEffects: GameEffect[];
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'scribe-audit',
    title: 'Scribes’ Audit of the Ledgers',
    description: 'Neutral scribes trace payments and shipping manifests for signs of sabotage.',
    durationTurns: 2,
    onCompleteEffects: [
      { kind: 'milestone:add', id: 'project:scribe-audit:complete' },
      { kind: 'resource', resourceId: 'intel', delta: 1 },
      { kind: 'log', message: '🔍 Project complete: The scribes deliver a tidy packet of contradictions and signatures.' },
    ],
  },
  {
    id: 'frontier-relief',
    title: 'Frontier Relief Convoys',
    description: 'Organize escorted relief shipments to stabilize border hamlets and keep patrols fed.',
    durationTurns: 3,
    onCompleteEffects: [
      { kind: 'milestone:add', id: 'project:frontier-relief:complete' },
      { kind: 'resource', resourceId: 'supplies', delta: 2 },
      { kind: 'resource', resourceId: 'influence', delta: 1 },
      { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: -4 },
      { kind: 'log', message: '📦 Project complete: Relief convoys arrive on schedule; tempers cool where hunger would have sharpened them.' },
    ],
  },
];

export const getProjectTemplateById = (templateId: string): ProjectTemplate | null => {
  return PROJECT_TEMPLATES.find(t => t.id === templateId) ?? null;
};

export const advanceProjectsOneTurn = (state: GameState): {
  projects: ProjectInstance[];
  completionEffects: GameEffect[];
  logEntries: string[];
} => {
  const completionEffects: GameEffect[] = [];
  const logEntries: string[] = [];

  const nextProjects: ProjectInstance[] = state.projects.map(p => {
    if (p.status !== 'active') return p;

    const remainingTurns = Math.max(0, p.remainingTurns - 1);

    if (remainingTurns === 0) {
      const template = getProjectTemplateById(p.templateId);
      if (template) completionEffects.push(...template.onCompleteEffects);
      logEntries.push(`📌 Project completed: ${p.title}`);
      return { ...p, remainingTurns, status: 'completed' };
    }

    logEntries.push(`📌 Project progress: ${p.title} (${remainingTurns} turn${remainingTurns === 1 ? '' : 's'} remaining)`);
    return { ...p, remainingTurns };
  });

  return { projects: nextProjects, completionEffects, logEntries };
};
