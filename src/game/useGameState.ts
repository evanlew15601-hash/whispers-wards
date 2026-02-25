import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, DialogueChoice } from './types';
import { dialogueTree } from './data';
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
    setState(engineRef.current.startNewGame());
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
    saveGameToSlot(slotId, state);
    refreshSlots();
  }, [state, refreshSlots]);

  const loadFromSlot = useCallback((slotId: number) => {
    const loaded = loadGameFromSlot(slotId);
    if (!loaded) return;

    // Back/forward compatibility: hydrate missing fields and refresh dialogue from the current tree when possible.
    const base = engineRef.current.createInitialState();
    const loadedAny = loaded as unknown as Partial<GameState> & { currentDialogue?: { id?: string } | null };

    const hydrated: GameState = {
      ...base,
      ...loadedAny,
      factions: loadedAny.factions ?? base.factions,
      events: loadedAny.events ?? base.events,
      knownSecrets: loadedAny.knownSecrets ?? base.knownSecrets,
      log: loadedAny.log ?? base.log,
      turnNumber: typeof loadedAny.turnNumber === 'number' ? loadedAny.turnNumber : base.turnNumber,
      rngSeed: typeof loadedAny.rngSeed === 'number' ? loadedAny.rngSeed : base.rngSeed,
      world: loadedAny.world ?? base.world,
      pendingEncounter: loadedAny.pendingEncounter ?? null,
      currentDialogue:
        loadedAny.currentDialogue && typeof loadedAny.currentDialogue === 'object' && loadedAny.currentDialogue.id
          ? dialogueTree[loadedAny.currentDialogue.id] ?? (loadedAny.currentDialogue as GameState['currentDialogue'])
          : (loadedAny.currentDialogue as GameState['currentDialogue']) ?? null,
      // Always resume gameplay after loading a save.
      currentScene: 'game',
    };

    setState(hydrated);
    refreshSlots();
  }, [refreshSlots]);

  const deleteSlot = useCallback((slotId: number) => {
    deleteSaveSlot(slotId);
    refreshSlots();
  }, [refreshSlots]);

  const listSlots = useCallback(() => saveSlots, [saveSlots]);

  const makeChoice = useCallback((choice: DialogueChoice) => {
    setState(prev => engineRef.current.applyChoice(prev, choice));
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

  return {
    state,
    engineLabel,
    startGame,
    openLoadScreen,
    backToTitle,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    listSlots,
    makeChoice,
    resetGame,
    enterPendingEncounter,
  };
}
