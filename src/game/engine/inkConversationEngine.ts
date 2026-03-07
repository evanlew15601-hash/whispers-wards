import type { ConversationEngine } from './conversationEngine';
import type { DialogueChoice, GameState } from '../types';

import { tsConversationEngine, TS_OPENING_LOG_LINE } from './tsConversationEngine';
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

export const inkConversationEngine: ConversationEngine = {
  createInitialState() {
    return tsConversationEngine.createInitialState();
  },

  startNewGame() {
    const base = tsConversationEngine.createInitialState();

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
      return tsConversationEngine.applyChoice(prev, choice);
    }

    const ink = prev.ink;
    if (!ink) return tsConversationEngine.applyChoice(prev, choice);

    const story = createInkStory(ink.storyId, ink.stateJson);
    syncGameStateToInkVariables(story, prev);

    const choiceIdx = story.currentChoices.findIndex(c => {
      const idTag = c.tags?.find(t => t.trim().startsWith('id:')) ?? null;
      const id = idTag ? idTag.trim().slice('id:'.length).trim() : null;
      return id === choice.id;
    });

    if (choiceIdx < 0) {
      // Fallback: if ids mismatch, allow the TS engine to attempt resolution.
      return tsConversationEngine.applyChoice({ ...prev, ink: null }, choice);
    }

    const chosen = story.currentChoices[choiceIdx];
    const gotoTag = chosen.tags?.find(t => t.trim().startsWith('goto:')) ?? null;
    const gotoId = gotoTag ? gotoTag.trim().slice('goto:'.length).trim() : null;

    story.ChooseChoiceIndex(choiceIdx);

    if (gotoId) {
      const next = tsConversationEngine.applyChoice({ ...prev, ink: null }, { ...choice, nextNodeId: gotoId });
      return next;
    }

    // Stay in Ink: use TS engine for state transitions (effects/logs/events/etc.), then overwrite dialogue.
    const advanced = tsConversationEngine.applyChoice(prev, { ...choice, nextNodeId: null });

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
    return tsConversationEngine.endTurn(prev);
  },

  getChoiceLockedFlags(state: GameState) {
    if (!state.currentDialogue) return null;

    if (isInkActive(state)) {
      return getInkChoiceLockedFlags(state, state.currentDialogue);
    }

    return tsConversationEngine.getChoiceLockedFlags?.(state) ?? null;
  },

  getChoiceUiHints(state: GameState) {
    if (!state.currentDialogue) return null;

    const lockedFlags = isInkActive(state)
      ? getInkChoiceLockedFlags(state, state.currentDialogue)
      : (tsConversationEngine.getChoiceLockedFlags?.(state) ?? null);

    if (!lockedFlags) return null;

    return state.currentDialogue.choices.map((choice, i) => ({
      locked: lockedFlags[i] ?? false,
      requiredReputation: choice.requiredReputation ?? null,
      effects: choice.effects,
      revealsInfo: choice.revealsInfo ?? null,
    }));
  },
};
