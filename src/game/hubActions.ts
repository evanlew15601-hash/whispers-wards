import type { GameState } from './types';

import { dialogueTree } from './data';
import { buildEncounterDialogueNode } from './encounters';
import { getChapter } from './chapters';

const getHubNode = (state: GameState) => {
  const chapter = getChapter(state.chapterId);
  return dialogueTree[chapter.hubNodeId] ?? null;
};

export const returnToHub = (prev: GameState): GameState => {
  if (prev.currentScene !== 'game') return prev;

  const hub = getHubNode(prev);
  if (!hub) return prev;

  if (prev.currentDialogue?.id === hub.id) return prev;

  return {
    ...prev,
    stepNumber: prev.stepNumber + 1,
    currentDialogue: hub,
    log: [...prev.log, '↩ Returned to Concord Hall'],
  };
};

export const enterPendingEncounter = (prev: GameState): GameState => {
  if (prev.currentScene !== 'game') return prev;
  if (!prev.pendingEncounter) return prev;

  const hub = getHubNode(prev);
  if (hub && prev.currentDialogue?.id !== hub.id) return prev;

  const nextNode = buildEncounterDialogueNode(prev.pendingEncounter);

  if (prev.currentDialogue?.id === nextNode.id) return prev;

  return {
    ...prev,
    stepNumber: prev.stepNumber + 1,
    currentDialogue: nextNode,
    log: [...prev.log, `⚔ Addressing crisis: ${prev.pendingEncounter.title}`],
  };
};
