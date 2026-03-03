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
