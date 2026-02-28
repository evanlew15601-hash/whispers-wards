import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { GameState, DialogueChoice, PlayerProfile } from './types';
import { dialogueTree } from './data';
import { normalizePlayerProfile } from './player';
import {
  SaveSlotInfo,
  listSaveSlots,
  saveGameToSlot,
  loadGameFromSlot,
  deleteSaveSlot,
} from './storage';
import { tsConversationEngine } from './engine/tsConversationEngine';
import { loadUqmWasmRuntime } from './engine/uqmWasmRuntime';
import { createUqmWasmConversationEngine } from './engine/uqmWasmConversationEngine';
import { buildEncounterDialogueNode } from './encounters';

const uniqueRepChoiceIdByText = (() => {
  const seen = new Map<string, string | null>();

  for (const node of Object.values(dialogueTree)) {
    for (const c of node.choices) {
      if (!c.exclusiveGroup && !c.effects.some(e => e.reputationChange !== 0)) continue;

      const existing = seen.get(c.text);
      if (existing === undefined) seen.set(c.text, c.id);
      else if (existing !== c.id) seen.set(c.text, null);
    }
  }

  const out = new Map<string, string>();
  for (const [text, id] of seen.entries()) {
    if (id) out.set(text, id);
  }

  return out;
})();

const inferSelectedChoiceIdsFromLog = (selectedChoiceIds: string[], log: string[] | undefined) => {
  if (!log?.length) return selectedChoiceIds;

  const out = new Set(selectedChoiceIds);
  for (const entry of log) {
    if (!entry.startsWith('> ')) continue;

    const text = entry.slice(2);
    const id = uniqueRepChoiceIdByText.get(text) ?? null;
    if (id) out.add(id);
  }

  return [...out];
};

export function useGameState() {
  const engineRef = useRef(tsConversationEngine);

  const [engineLabel, setEngineLabel] = useState<'TS' | 'UQM WASM'>('TS');

  const [state, setState] = useState<GameState>(() => engineRef.current.createInitialState());
  const [saveSlots, setSaveSlots] = useState<SaveSlotInfo[]>(() => listSaveSlots());

  useEffect(() => {
    let cancelled = false;

    void loadUqmWasmRuntime()
      .then(uqm => {
        if (cancelled) return;
        engineRef.current = createUqmWasmConversationEngine(uqm);
        setEngineLabel('UQM WASM');
      })
      .catch(() => {
        // Ignore; we simply stay on the TS engine.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshSlots = useCallback(() => {
    setSaveSlots(listSaveSlots());
  }, []);

  const startGame = useCallback(() => {
    // Route new games through the character creator.
    const base = engineRef.current.createInitialState();
    setState({
      ...base,
      currentScene: 'create',
    });
  }, []);

  const confirmNewGame = useCallback((player: PlayerProfile) => {
    const started = engineRef.current.startNewGame();
    setState({
      ...started,
      player: normalizePlayerProfile(player),
      currentScene: 'game',
    });
  }, []);

  const openLoadScreen = useCallback(() => {
    refreshSlots();
    setState(prev => ({
      ...prev,
      currentScene: 'load',
    }));
  }, [refreshSlots]);

  const backToTitle = useCallback(() => {
    refreshSlots();
    setState(prev => ({
      ...prev,
      currentScene: 'title',
    }));
  }, [refreshSlots]);

  const saveToSlot = useCallback((slotId: number) => {
    const ok = saveGameToSlot(slotId, state);
    refreshSlots();

    if (ok) {
      toast.success(`Saved to Slot ${slotId}`);
    } else {
      toast.error(`Failed to save Slot ${slotId}`);
    }
  }, [state, refreshSlots]);

  const loadFromSlot = useCallback((slotId: number) => {
    const loaded = loadGameFromSlot(slotId);
    if (!loaded) {
      toast.error(`Slot ${slotId} is empty.`);
      return;
    }

    // Back/forward compatibility: hydrate missing fields and refresh dialogue from the current tree when possible.
    const base = engineRef.current.createInitialState();
    const loadedAny = loaded as unknown as Partial<GameState> & {
      currentDialogue?: { id?: string } | null;
      currentDialogueId?: string | null;
    };

    const pendingEncounter = loadedAny.pendingEncounter ?? null;

    const loadedDialogueId =
      typeof loadedAny.currentDialogueId === 'string'
        ? loadedAny.currentDialogueId
        : loadedAny.currentDialogue && typeof loadedAny.currentDialogue === 'object'
          ? (loadedAny.currentDialogue as { id?: string }).id ?? null
          : null;

    const hydratedLog = loadedAny.log ?? base.log;

    const selectedChoiceIdsFromSave = Array.isArray((loadedAny as any).selectedChoiceIds)
      ? ((loadedAny as any).selectedChoiceIds as string[])
      : base.selectedChoiceIds;

    const loadedTurnNumber = typeof loadedAny.turnNumber === 'number' ? loadedAny.turnNumber : base.turnNumber;

    const hydrated: GameState = {
      ...base,
      ...loadedAny,
      player: normalizePlayerProfile(loadedAny.player ?? base.player),
      factions: loadedAny.factions ?? base.factions,
      events: loadedAny.events ?? base.events,
      knownSecrets: loadedAny.knownSecrets ?? base.knownSecrets,
      selectedChoiceIds: inferSelectedChoiceIdsFromLog(selectedChoiceIdsFromSave, hydratedLog),
      log: hydratedLog,
      stepNumber:
        typeof (loadedAny as any).stepNumber === 'number'
          ? ((loadedAny as any).stepNumber as number)
          : loadedTurnNumber,
      turnNumber: loadedTurnNumber,
      chapterId: typeof (loadedAny as any).chapterId === 'string' ? ((loadedAny as any).chapterId as string) : base.chapterId,
      chapterTurn: typeof (loadedAny as any).chapterTurn === 'number' ? ((loadedAny as any).chapterTurn as number) : base.chapterTurn,
      milestones: Array.isArray((loadedAny as any).milestones) ? ((loadedAny as any).milestones as string[]) : base.milestones,
      resources:
        (loadedAny as any).resources && typeof (loadedAny as any).resources === 'object'
          ? ({ ...base.resources, ...(loadedAny as any).resources } as GameState['resources'])
          : base.resources,
      management:
        (loadedAny as any).management && typeof (loadedAny as any).management === 'object'
          ? {
              ...base.management,
              ...(loadedAny as any).management,
            }
          : base.management,
      rngSeed: typeof loadedAny.rngSeed === 'number' ? loadedAny.rngSeed : base.rngSeed,
      world: loadedAny.world ?? base.world,
      pendingEncounter,
      currentDialogue: loadedDialogueId
        ? loadedDialogueId.startsWith('encounter:') && pendingEncounter
          ? buildEncounterDialogueNode(pendingEncounter)
          : dialogueTree[loadedDialogueId] ?? (loadedAny.currentDialogue as GameState['currentDialogue'])
        : (loadedAny.currentDialogue as GameState['currentDialogue']) ?? null,
      // Always resume gameplay after loading a save.
      currentScene: 'game',
    };

    setState(hydrated);
    refreshSlots();
    toast.success(`Loaded Slot ${slotId}`);
  }, [refreshSlots]);

  const deleteSlot = useCallback((slotId: number) => {
    const ok = deleteSaveSlot(slotId);
    refreshSlots();

    if (ok) {
      toast.success(`Deleted Slot ${slotId}`);
    } else {
      toast.error(`Failed to delete Slot ${slotId}`);
    }
  }, [refreshSlots]);

  const listSlots = useCallback(() => saveSlots, [saveSlots]);

  const makeChoice = useCallback((choice: DialogueChoice) => {
    setState(prev => engineRef.current.applyChoice(prev, choice));
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => engineRef.current.endTurn(prev));
  }, []);

  const resetGame = useCallback(() => {
    setState(engineRef.current.createInitialState());
  }, []);

  const enterPendingEncounter = useCallback(() => {
    setState(prev => {
      if (!prev.pendingEncounter) return prev;
      return {
        ...prev,
        currentDialogue: buildEncounterDialogueNode(prev.pendingEncounter),
      };
    });
  }, []);

  const choiceLockedFlags = engineRef.current.getChoiceLockedFlags?.(state) ?? null;
  const choiceUiHints = engineRef.current.getChoiceUiHints?.(state) ?? null;

  return {
    state,
    engineLabel,
    choiceLockedFlags,
    choiceUiHints,
    startGame,
    confirmNewGame,
    openLoadScreen,
    backToTitle,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    listSlots,
    makeChoice,
    endTurn,
    resetGame,
    enterPendingEncounter,
  };
}
