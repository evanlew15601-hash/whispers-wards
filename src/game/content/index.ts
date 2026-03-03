import type { DialogueNode, Faction, GameEvent } from '../types';

import { initialEvents as chapter1Events, initialFactions as chapter1Factions, dialogueTree as chapter1Tree } from './chapter-1';
import { initialEvents as chapter2Events, initialFactions as chapter2Factions, dialogueTree as chapter2Tree } from './chapter-2';
import { initialEvents as chapter3Events, initialFactions as chapter3Factions, dialogueTree as chapter3Tree } from './chapter-3';
import { initialEvents as chapter4Events, initialFactions as chapter4Factions, dialogueTree as chapter4Tree } from './chapter-4';
import { initialEvents as chapter5Events, initialFactions as chapter5Factions, dialogueTree as chapter5Tree } from './chapter-5';
import { initialEvents as chapter6Events, initialFactions as chapter6Factions, dialogueTree as chapter6Tree } from './chapter-6';
import { initialEvents as chapter7Events, initialFactions as chapter7Factions, dialogueTree as chapter7Tree } from './chapter-7';
import { initialEvents as chapter8Events, initialFactions as chapter8Factions, dialogueTree as chapter8Tree } from './chapter-8';
import { initialEvents as chapter9Events, initialFactions as chapter9Factions, dialogueTree as chapter9Tree } from './chapter-9';
import { initialEvents as chapter10Events, initialFactions as chapter10Factions, dialogueTree as chapter10Tree } from './chapter-10';
import { initialEvents as chapter11Events, initialFactions as chapter11Factions, dialogueTree as chapter11Tree } from './chapter-11';
import { initialEvents as chapter12Events, initialFactions as chapter12Factions, dialogueTree as chapter12Tree } from './chapter-12';
import { initialEvents as chapter13Events, initialFactions as chapter13Factions, dialogueTree as chapter13Tree } from './chapter-13';
import { initialEvents as chapter14Events, initialFactions as chapter14Factions, dialogueTree as chapter14Tree } from './chapter-14';
import { initialEvents as chapter15Events, initialFactions as chapter15Factions, dialogueTree as chapter15Tree } from './chapter-15';
import { initialEvents as chapter16Events, initialFactions as chapter16Factions, dialogueTree as chapter16Tree } from './chapter-16';
import { initialEvents as chapter17Events, initialFactions as chapter17Factions, dialogueTree as chapter17Tree } from './chapter-17';

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
  'chapter-3': {
    id: 'chapter-3',
    initialFactions: chapter3Factions,
    initialEvents: chapter3Events,
    dialogueTree: chapter3Tree,
  },
  'chapter-4': {
    id: 'chapter-4',
    initialFactions: chapter4Factions,
    initialEvents: chapter4Events,
    dialogueTree: chapter4Tree,
  },
  'chapter-5': {
    id: 'chapter-5',
    initialFactions: chapter5Factions,
    initialEvents: chapter5Events,
    dialogueTree: chapter5Tree,
  },
  'chapter-6': {
    id: 'chapter-6',
    initialFactions: chapter6Factions,
    initialEvents: chapter6Events,
    dialogueTree: chapter6Tree,
  },
  'chapter-7': {
    id: 'chapter-7',
    initialFactions: chapter7Factions,
    initialEvents: chapter7Events,
    dialogueTree: chapter7Tree,
  },
  'chapter-8': {
    id: 'chapter-8',
    initialFactions: chapter8Factions,
    initialEvents: chapter8Events,
    dialogueTree: chapter8Tree,
  },
  'chapter-9': {
    id: 'chapter-9',
    initialFactions: chapter9Factions,
    initialEvents: chapter9Events,
    dialogueTree: chapter9Tree,
  },
  'chapter-10': {
    id: 'chapter-10',
    initialFactions: chapter10Factions,
    initialEvents: chapter10Events,
    dialogueTree: chapter10Tree,
  },
  'chapter-11': {
    id: 'chapter-11',
    initialFactions: chapter11Factions,
    initialEvents: chapter11Events,
    dialogueTree: chapter11Tree,
  },
  'chapter-12': {
    id: 'chapter-12',
    initialFactions: chapter12Factions,
    initialEvents: chapter12Events,
    dialogueTree: chapter12Tree,
  },
  'chapter-13': {
    id: 'chapter-13',
    initialFactions: chapter13Factions,
    initialEvents: chapter13Events,
    dialogueTree: chapter13Tree,
  },
  'chapter-14': {
    id: 'chapter-14',
    initialFactions: chapter14Factions,
    initialEvents: chapter14Events,
    dialogueTree: chapter14Tree,
  },
  'chapter-15': {
    id: 'chapter-15',
    initialFactions: chapter15Factions,
    initialEvents: chapter15Events,
    dialogueTree: chapter15Tree,
  },
  'chapter-16': {
    id: 'chapter-16',
    initialFactions: chapter16Factions,
    initialEvents: chapter16Events,
    dialogueTree: chapter16Tree,
  },
  'chapter-17': {
    id: 'chapter-17',
    initialFactions: chapter17Factions,
    initialEvents: chapter17Events,
    dialogueTree: chapter17Tree,
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
