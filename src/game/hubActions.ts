import type { GameState } from './types';

import { dialogueTree } from './data';
import { buildEncounterDialogueNode } from './encounters';
import { evaluateChapterTransition, getChapter } from './chapters';

const getHubNode = (state: GameState) => {
  const chapter = getChapter(state.chapterId);
  return dialogueTree[chapter.hubNodeId] ?? null;
};

export const returnToHub = (prev: GameState): GameState => {
  if (prev.currentScene !== 'game') return prev;

  const hub = getHubNode(prev);
  if (!hub) return prev;

  if (prev.currentDialogue?.id === hub.id) return prev;

  const returned: GameState = {
    ...prev,
    stepNumber: prev.stepNumber + 1,
    currentDialogue: hub,
    log: [...prev.log, '[HALL] Returned to Concord Hall'],
  };

  // Chapter transitions are keyed off knownSecrets; if the player returns to the hall
  // via the UI (instead of selecting a dialogue choice), we still want Act changes to apply.
  return evaluateChapterTransition(returned);
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
    log: [...prev.log, `[CRISIS] Addressing crisis: ${prev.pendingEncounter.title}`],
  };
};
