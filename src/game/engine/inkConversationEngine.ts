import type { ConversationEngine } from './conversationEngine';
import type { DialogueChoice, GameState } from '../types';

import { tsConversationEngine, TS_OPENING_LOG_LINE } from './tsConversationEngine';
import { getChoiceLockReasons } from '../choiceLocks';
import {
  createInkStory,
  getInkStoryVersion,
  syncGameStateToInkVariables,
  buildDialogueNodeFromInk,
  getInkChoiceLockedFlags,
} from './inkStory';

const INK_STORY_ID = 'main' as const;

const isInkActive = (state: GameState) => {
  return Boolean(state.ink && state.currentDialogue?.id.startsWith('ink:'));
};

const startInkStory = (base: GameState) => {
  const story = createInkStory(INK_STORY_ID);
  syncGameStateToInkVariables(story, base);

  const node = buildDialogueNodeFromInk(story);

  return {
    story,
    node,
  };
};

export function createInkConversationEngine(fallbackEngine: ConversationEngine = tsConversationEngine): ConversationEngine {
  return {
    createInitialState() {
      return fallbackEngine.createInitialState();
    },

    startNewGame() {
      const base = fallbackEngine.createInitialState();

      const started = startInkStory(base);

      return {
        ...base,
        currentScene: 'game',
        currentDialogue: started.node,
        log: [TS_OPENING_LOG_LINE],
        ink: {
          storyId: INK_STORY_ID,
          storyVersion: getInkStoryVersion(INK_STORY_ID) ?? undefined,
          stateJson: started.story.state.ToJson(),
        },
      };
    },

    applyChoice(prev: GameState, choice: DialogueChoice): GameState {
      if (!isInkActive(prev)) {
        return fallbackEngine.applyChoice(prev, choice);
      }

      const ink = prev.ink;
      if (!ink) return fallbackEngine.applyChoice(prev, choice);

      const story = createInkStory(ink.storyId, ink.stateJson);
      syncGameStateToInkVariables(story, prev);

      const choiceIdx = story.currentChoices.findIndex(c => {
        const idTag = c.tags?.find(t => t.trim().startsWith('id:')) ?? null;
        const id = idTag ? idTag.trim().slice('id:'.length).trim() : null;
        return id === choice.id;
      });

      if (choiceIdx < 0) {
        // Fallback: if ids mismatch, let the fallback engine attempt best-effort resolution.
        const advanced = fallbackEngine.applyChoice(prev, choice);
        if (advanced === prev) return prev;
        return { ...advanced, ink: null };
      }

      const chosen = story.currentChoices[choiceIdx];
      const gotoTag = chosen.tags?.find(t => t.trim().startsWith('goto:')) ?? null;
      const gotoId = gotoTag ? gotoTag.trim().slice('goto:'.length).trim() : null;

      if (gotoId) {
        const advanced = fallbackEngine.applyChoice(prev, { ...choice, nextNodeId: gotoId });
        if (advanced === prev) return prev;
        return { ...advanced, ink: null };
      }

      // Stay in Ink: apply state transitions (effects/logs/events/etc.) first.
      const advanced = fallbackEngine.applyChoice(prev, { ...choice, nextNodeId: null });
      if (advanced === prev) return prev;

      // Then advance Ink.
      story.ChooseChoiceIndex(choiceIdx);

      // Ensure Ink conditionals that depend on game state (eg reputation mirrors) see the updated values.
      syncGameStateToInkVariables(story, advanced);

      const node = buildDialogueNodeFromInk(story);

      return {
        ...advanced,
        currentDialogue: node,
        ink: {
          storyId: ink.storyId,
          storyVersion: ink.storyVersion ?? getInkStoryVersion(ink.storyId) ?? undefined,
          stateJson: story.state.ToJson(),
        },
      };
    },

    endTurn(prev: GameState): GameState {
      return fallbackEngine.endTurn(prev);
    },

    getChoiceLockedFlags(state: GameState) {
      if (!state.currentDialogue) return null;

      if (isInkActive(state)) {
        return getInkChoiceLockedFlags(state, state.currentDialogue);
      }

      return fallbackEngine.getChoiceLockedFlags?.(state) ?? null;
    },

    getChoiceUiHints(state: GameState) {
      if (!state.currentDialogue) return null;

      const lockedFlags = isInkActive(state)
        ? getInkChoiceLockedFlags(state, state.currentDialogue)
        : (fallbackEngine.getChoiceLockedFlags?.(state) ?? null);

      if (!lockedFlags) return null;

      return state.currentDialogue.choices.map((choice, i) => ({
        locked: lockedFlags[i] ?? false,
        lockReasons: getChoiceLockReasons(choice, state.factions, state.knownSecrets, state.selectedChoiceIds, state.resources),
        requiredReputation: choice.requiredReputation ?? null,
        effects: choice.effects,
        gameEffects: choice.gameEffects ?? [],
        revealsInfo: choice.revealsInfo ?? null,
      }));
    },
  };
}

export const inkConversationEngine: ConversationEngine = createInkConversationEngine(tsConversationEngine);
