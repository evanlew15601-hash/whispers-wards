import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { GameState, DialogueChoice, PlayerProfile } from './types';
import { SaveSlotInfo, listSaveSlots } from './storage';
import { tsConversationEngine } from './engine/tsConversationEngine';
import { loadUqmWasmRuntime } from './engine/uqmWasmRuntime';
import { createUqmWasmConversationEngine } from './engine/uqmWasmConversationEngine';
import { applyGameFlowEvent } from './flow/gameFlow';
import { applyAppFlowEvent } from './flow/appFlow';
import { applyStorageFlowEvent, type StorageFlowEvent } from './flow/storageFlow';

export function useGameState() {
  const engineRef = useRef(tsConversationEngine);

  const [engineLabel, setEngineLabel] = useState<'TS' | 'UQM WASM'>('TS');

  const [state, setState] = useState<GameState>(() => engineRef.current.createInitialState());
  const [saveSlots, setSaveSlots] = useState<SaveSlotInfo[]>(() => listSaveSlots());

  const suppressEncounterToastRef = useRef(false);
  const lastEncounterToastIdRef = useRef<string | null>(null);
  const didInitEncounterToastRef = useRef(false);

  useEffect(() => {
    if (!didInitEncounterToastRef.current) {
      didInitEncounterToastRef.current = true;
      lastEncounterToastIdRef.current = state.pendingEncounter?.id ?? null;
      return;
    }

    if (suppressEncounterToastRef.current) {
      suppressEncounterToastRef.current = false;
      lastEncounterToastIdRef.current = state.pendingEncounter?.id ?? null;
      return;
    }

    const pendingId = state.pendingEncounter?.id ?? null;
    if (pendingId && pendingId !== lastEncounterToastIdRef.current && state.currentScene === 'game') {
      toast.info(`New encounter pending: ${state.pendingEncounter?.title ?? 'Encounter'}`);
    }
    lastEncounterToastIdRef.current = pendingId;
  }, [state.pendingEncounter?.id, state.pendingEncounter?.title, state.currentScene]);

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

  const dispatchStorageEvent = useCallback((event: StorageFlowEvent) => {
    const out = applyStorageFlowEvent(state, event, engineRef.current);

    setSaveSlots(out.saveSlots);

    if (out.toast) {
      if (out.toast.kind === 'success') toast.success(out.toast.message);
      else toast.error(out.toast.message);
    }

    if (out.suppressEncounterToast) suppressEncounterToastRef.current = true;
    if (out.state) setState(out.state);
  }, [state]);

  const refreshSlots = useCallback(() => {
    dispatchStorageEvent({ type: 'refreshSlots' });
  }, [dispatchStorageEvent]);

  const startGame = useCallback(() => {
    setState(prev => applyAppFlowEvent(prev, { type: 'startGame' }, engineRef.current));
  }, []);

  const confirmNewGame = useCallback((player: PlayerProfile) => {
    setState(prev => applyAppFlowEvent(prev, { type: 'confirmNewGame', player }, engineRef.current));
  }, []);

  const openLoadScreen = useCallback(() => {
    refreshSlots();
    setState(prev => applyAppFlowEvent(prev, { type: 'openLoadScreen' }, engineRef.current));
  }, [refreshSlots]);

  const backToTitle = useCallback(() => {
    refreshSlots();
    setState(prev => applyAppFlowEvent(prev, { type: 'backToTitle' }, engineRef.current));
  }, [refreshSlots]);

  const saveToSlot = useCallback((slotId: number) => {
    dispatchStorageEvent({ type: 'saveToSlot', slotId });
  }, [dispatchStorageEvent]);

  const loadFromSlot = useCallback((slotId: number) => {
    dispatchStorageEvent({ type: 'loadFromSlot', slotId });
  }, [dispatchStorageEvent]);

  const deleteSlot = useCallback((slotId: number) => {
    dispatchStorageEvent({ type: 'deleteSlot', slotId });
  }, [dispatchStorageEvent]);

  const listSlots = useCallback(() => saveSlots, [saveSlots]);

  const makeChoice = useCallback((choice: DialogueChoice) => {
    setState(prev => applyGameFlowEvent(prev, { type: 'choice', choice }, engineRef.current));
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => applyGameFlowEvent(prev, { type: 'endTurn' }, engineRef.current));
  }, []);

  const takeManagementAction = useCallback((actionId: string) => {
    setState(prev => applyGameFlowEvent(prev, { type: 'takeManagementAction', actionId }, engineRef.current));
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => applyAppFlowEvent(prev, { type: 'resetGame' }, engineRef.current));
  }, []);

  const enterPendingEncounter = useCallback(() => {
    setState(prev => applyGameFlowEvent(prev, { type: 'enterPendingEncounter' }, engineRef.current));
  }, []);

  const returnToHub = useCallback(() => {
    setState(prev => applyGameFlowEvent(prev, { type: 'returnToHub' }, engineRef.current));
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
    takeManagementAction,
    resetGame,
    enterPendingEncounter,
    returnToHub,
  };
}
