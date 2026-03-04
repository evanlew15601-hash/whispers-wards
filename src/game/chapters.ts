import type { GameState } from './types';

import { dialogueTree } from './data';
import { applyEffects, type GameEffect } from './effects';
import { GREENMARCH_SUMMIT_CONCLUDED_SECRET } from './progress';

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
    exitConditions: [{ kind: 'secretKnown', secret: GREENMARCH_SUMMIT_CONCLUDED_SECRET }],
    exitToChapterId: 'chapter-2',
  },
  'chapter-2': {
    id: 'chapter-2',
    title: 'Chapter II — Patterns of Dispute',
    hubNodeId: 'concord-hub-2',
    encounterPoolId: 'encounters:chapter-2',
    managementPoolId: 'management:chapter-1',
    projectPoolId: 'projects:chapter-1',
    exitConditions: [],
    exitToChapterId: null,
  },
};

export const getChapter = (chapterId: string): ChapterDefinition => CHAPTERS[chapterId] ?? CHAPTERS['chapter-1'];

const HUB_NODE_IDS = new Set(Object.values(CHAPTERS).map(ch => ch.hubNodeId));

const normalizeHubDialogue = (state: GameState): GameState => {
  if (!state.currentDialogue) return state;

  const chapter = getChapter(state.chapterId);
  const hubId = chapter.hubNodeId;

  // Treat explicit jumps to other chapter hubs as "return to the Hall".
  if (!HUB_NODE_IDS.has(state.currentDialogue.id)) return state;
  if (state.currentDialogue.id === hubId) return state;

  const hub = dialogueTree[hubId] ?? null;
  if (!hub) return state;

  return { ...state, currentDialogue: hub };
};

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
  const normalized = normalizeHubDialogue(prev);

  const current = getChapter(normalized.chapterId);
  if (!current.exitToChapterId) return normalized;
  if (!isExitMet(normalized, current)) return normalized;

  const nextDef = getChapter(current.exitToChapterId);

  let next: GameState = {
    ...normalized,
    chapterId: nextDef.id,
    chapterTurn: 1,
    management: {
      ...normalized.management,
      usedThisChapter: {},
    },
    world: {
      ...normalized.world,
      encounterMemory: normalized.world.encounterMemory
        ? {
            ...normalized.world.encounterMemory,
            seenThisChapter: {},
          }
        : normalized.world.encounterMemory,
    },
  };

  if (nextDef.entryEffects?.length) {
    next = applyEffects(next, nextDef.entryEffects);
  }

  const hub = dialogueTree[nextDef.hubNodeId] ?? null;
  if (hub) {
    next = { ...next, currentDialogue: hub };
  }

  next = {
    ...next,
    log: [...next.log, `[CH] ${nextDef.title}`],
  };

  return next;
};
