import type { GameState } from './types';

import { getDialogueTree } from './data';
import { applyEffects, type GameEffect } from './effects';

export type ChapterExitCondition =
  | { kind: 'turnsAtLeast'; n: number }
  | { kind: 'milestone'; id: string }
  | { kind: 'repAtLeast'; factionId: string; min: number }
  | { kind: 'secretKnown'; secret: string };

export type ChapterDefinition = {
  id: string;
  title: string;
  hubNodeId: string;
  encounterPoolId: string;
  managementPoolId: string;
  projectPoolId: string;
  entryEffects?: GameEffect[];
  exitConditions: ChapterExitCondition[];
  exitToChapterId: string | null;
};

export const CHAPTERS: Record<string, ChapterDefinition> = {
  'chapter-1': {
    id: 'chapter-1',
    title: 'Chapter I — The Concord Hall',
    hubNodeId: 'concord-hub',
    encounterPoolId: 'encounters:chapter-1',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    exitConditions: [{ kind: 'milestone', id: 'project:scribe-audit:complete' }],
    exitToChapterId: 'chapter-2',
  },
  'chapter-2': {
    id: 'chapter-2',
    title: 'Chapter II — Ash Road',
    hubNodeId: 'chapter-2-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-2:resolved' }],
    exitToChapterId: 'chapter-3',
  },
  'chapter-3': {
    id: 'chapter-3',
    title: 'Chapter III — The Root-Archive',
    hubNodeId: 'chapter-3-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-3:resolved' }],
    exitToChapterId: 'chapter-4',
  },
  'chapter-4': {
    id: 'chapter-4',
    title: 'Chapter IV — The Counting-House',
    hubNodeId: 'chapter-4-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-4:resolved' }],
    exitToChapterId: 'chapter-5',
  },
  'chapter-5': {
    id: 'chapter-5',
    title: 'Chapter V — Oathline',
    hubNodeId: 'chapter-5-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-5:resolved' }],
    exitToChapterId: 'chapter-6',
  },
  'chapter-6': {
    id: 'chapter-6',
    title: 'Chapter VI — The Quiet Office',
    hubNodeId: 'chapter-6-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-6:resolved' }],
    exitToChapterId: 'chapter-7',
  },
  'chapter-7': {
    id: 'chapter-7',
    title: 'Chapter VII — The River Gate',
    hubNodeId: 'chapter-7-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-7:resolved' }],
    exitToChapterId: 'chapter-8',
  },
  'chapter-8': {
    id: 'chapter-8',
    title: 'Chapter VIII — The Quay Ledger',
    hubNodeId: 'chapter-8-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-8:resolved' }],
    exitToChapterId: 'chapter-9',
  },
  'chapter-9': {
    id: 'chapter-9',
    title: 'Chapter IX — The Docket Stair',
    hubNodeId: 'chapter-9-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-9:resolved' }],
    exitToChapterId: 'chapter-10',
  },
  'chapter-10': {
    id: 'chapter-10',
    title: 'Chapter X — The Corridor King',
    hubNodeId: 'chapter-10-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-10:resolved' }],
    exitToChapterId: 'chapter-11',
  },
  'chapter-11': {
    id: 'chapter-11',
    title: 'Chapter XI — Drafting Table',
    hubNodeId: 'chapter-11-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-11:resolved' }],
    exitToChapterId: 'chapter-12',
  },
  'chapter-12': {
    id: 'chapter-12',
    title: 'Chapter XII — The Red Margin',
    hubNodeId: 'chapter-12-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-12:resolved' }],
    exitToChapterId: 'chapter-13',
  },
  'chapter-13': {
    id: 'chapter-13',
    title: 'Chapter XIII — The First Recipient',
    hubNodeId: 'chapter-13-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-13:resolved' }],
    exitToChapterId: 'chapter-14',
  },
  'chapter-14': {
    id: 'chapter-14',
    title: 'Chapter XIV — Second Address',
    hubNodeId: 'chapter-14-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [{ kind: 'milestone', id: 'chapter-14:resolved' }],
    exitToChapterId: 'chapter-15',
  },
  'chapter-15': {
    id: 'chapter-15',
    title: 'Chapter XV — Third Address',
    hubNodeId: 'chapter-15-hub',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    entryEffects: [{ kind: 'resource', resourceId: 'intel', delta: 1 }],
    exitConditions: [],
    exitToChapterId: null,
  },
};

export const getChapter = (chapterId: string): ChapterDefinition => CHAPTERS[chapterId] ?? CHAPTERS['chapter-1'];

const isExitMet = (state: GameState, def: ChapterDefinition): boolean => {
  if (!def.exitConditions.length) return false;

  return def.exitConditions.every(cond => {
    if (cond.kind === 'turnsAtLeast') {
      return state.chapterTurn >= cond.n;
    }

    if (cond.kind === 'milestone') {
      return state.milestones.includes(cond.id);
    }

    if (cond.kind === 'repAtLeast') {
      const rep = state.factions.find(f => f.id === cond.factionId)?.reputation ?? -Infinity;
      return rep >= cond.min;
    }

    if (cond.kind === 'secretKnown') {
      return state.knownSecrets.includes(cond.secret);
    }

    return false;
  });
};

export const evaluateChapterTransition = (prev: GameState): GameState => {
  const current = getChapter(prev.chapterId);
  if (!current.exitToChapterId) return prev;
  if (!isExitMet(prev, current)) return prev;

  const nextDef = getChapter(current.exitToChapterId);

  let next: GameState = {
    ...prev,
    chapterId: nextDef.id,
    chapterTurn: 1,
    management: {
      ...prev.management,
      usedThisChapter: {},
    },
    world: {
      ...prev.world,
      encounterMemory: prev.world.encounterMemory
        ? {
            ...prev.world.encounterMemory,
            seenThisChapter: {},
          }
        : prev.world.encounterMemory,
    },
  };

  if (nextDef.entryEffects?.length) {
    next = applyEffects(next, nextDef.entryEffects);
  }

  const hub = getDialogueTree(nextDef.id)[nextDef.hubNodeId] ?? null;
  if (hub) {
    next = { ...next, currentDialogue: hub };
  }

  next = {
    ...next,
    log: [...next.log, `📘 ${nextDef.title}`],
  };

  return next;
};
