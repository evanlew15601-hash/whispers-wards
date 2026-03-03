import type { DialogueNode, Faction, GameEvent } from '../types';

import { initialEvents as chapter1Events, initialFactions as chapter1Factions, dialogueTree as chapter1Tree } from './chapter-1';
import { initialEvents as chapter2Events, initialFactions as chapter2Factions, dialogueTree as chapter2Tree } from './chapter-2';

export type DialogueTree = Record<string, DialogueNode>;

export type ChapterContent = {
  id: string;
  initialFactions: Faction[];
  initialEvents: GameEvent[];
  dialogueTree: DialogueTree;
};

export const CHAPTER_CONTENT_BY_ID: Record<string, ChapterContent> = {
  'chapter-1': {
    id: 'chapter-1',
    initialFactions: chapter1Factions,
    initialEvents: chapter1Events,
    dialogueTree: chapter1Tree,
  },
  'chapter-2': {
    id: 'chapter-2',
    initialFactions: chapter2Factions,
    initialEvents: chapter2Events,
    dialogueTree: chapter2Tree,
  },
};

export const getChapterContent = (chapterId: string): ChapterContent => {
  return CHAPTER_CONTENT_BY_ID[chapterId] ?? CHAPTER_CONTENT_BY_ID['chapter-1'];
};

export const getDialogueTree = (chapterId: string): DialogueTree => {
  return getChapterContent(chapterId).dialogueTree;
};

export const getAllDialogueTrees = (): DialogueTree[] => {
  return Object.values(CHAPTER_CONTENT_BY_ID).map(c => c.dialogueTree);
};

export const getAllDialogueNodes = (): DialogueNode[] => {
  return Object.values(CHAPTER_CONTENT_BY_ID).flatMap(c => Object.values(c.dialogueTree));
};

export const getInitialFactions = (): Faction[] => {
  return CHAPTER_CONTENT_BY_ID['chapter-1'].initialFactions;
};

export const getInitialEvents = (): GameEvent[] => {
  return CHAPTER_CONTENT_BY_ID['chapter-1'].initialEvents;
};

// Legacy exports (chapter 1 only). Prefer getDialogueTree(chapterId) for new code.
export const initialFactions = getInitialFactions();
export const initialEvents = getInitialEvents();
export const dialogueTree = getDialogueTree('chapter-1');
