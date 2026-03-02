import type { DialogueChoice, GameState } from '../types';
import type { ConversationEngine } from '../engine/conversationEngine';

import { buildEncounterDialogueNode } from '../encounters';
import { dialogueTree } from '../data';
import { getChapter } from '../chapters';
import { applyManagementAction } from '../management/applyManagementAction';
import { canEndTurn, canEnterPendingEncounter, canReturnToHub } from './gameMode';

export type GameFlowEvent =
  | { type: 'choice'; choice: DialogueChoice }
  | { type: 'endTurn' }
  | { type: 'enterPendingEncounter' }
  | { type: 'returnToHub' }
  | { type: 'takeManagementAction'; actionId: string };

export function applyGameFlowEvent(prev: GameState, event: GameFlowEvent, engine: ConversationEngine): GameState {
  if (event.type === 'choice') {
    return engine.applyChoice(prev, event.choice);
  }

  if (event.type === 'endTurn') {
    return canEndTurn(prev) ? engine.endTurn(prev) : prev;
  }

  if (event.type === 'takeManagementAction') {
    return canEndTurn(prev) ? applyManagementAction(prev, event.actionId) : prev;
  }

  if (event.type === 'enterPendingEncounter') {
    if (!canEnterPendingEncounter(prev)) return prev;

    return {
      ...prev,
      currentDialogue: buildEncounterDialogueNode(prev.pendingEncounter!),
    };
  }

  if (event.type === 'returnToHub') {
    if (!canReturnToHub(prev)) return prev;

    const chapter = getChapter(prev.chapterId);
    const hub = dialogueTree[chapter.hubNodeId] ?? null;
    if (!hub) return prev;

    if (prev.currentDialogue?.id === hub.id) return prev;

    return {
      ...prev,
      stepNumber: prev.stepNumber + 1,
      currentDialogue: hub,
      log: [...prev.log, '↩ Returned to Concord Hall'],
    };
  }

  return prev;
}
