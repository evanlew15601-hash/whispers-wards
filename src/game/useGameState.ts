import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { GameState, DialogueChoice, PlayerProfile } from './types';
import { dialogueTree } from './data';
import { CHAPTERS, getChapter } from './chapters';
import { normalizePlayerProfile } from './player';
import {
  SaveSlotInfo,
  CheckpointInfo,
  listSaveSlots,
  saveGameToSlot,
  loadGameFromSlot,
  deleteSaveSlot,
  getSummitGateCheckpointInfo,
  loadSummitGateCheckpoint,
  saveSummitGateCheckpoint,
} from './storage';
import { createInkConversationEngine, inkConversationEngine } from './engine/inkConversationEngine';
import { createUqmWasmConversationEngine } from './engine/uqmWasmConversationEngine';
import { loadUqmWasmRuntime } from './engine/uqmWasmRuntime';
import { createInkStory, buildDialogueNodeFromInk, getInkStoryVersion, syncGameStateToInkVariables } from './engine/inkStory';
import { buildEncounterDialogueNode } from './encounters';
import { applyManagementAction } from './management/applyManagementAction';
import { enterPendingEncounter as enterPendingEncounterTransition, returnToHub as returnToHubTransition } from './hubActions';

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

const HUB_NODE_IDS = new Set(Object.values(CHAPTERS).map(ch => ch.hubNodeId));

export function useGameState() {
  const engineRef = useRef(inkConversationEngine);

  const [engineLabel, setEngineLabel] = useState<string>('Ink (TS)');

  useEffect(() => {
    let cancelled = false;

    void loadUqmWasmRuntime()
      .then(uqm => {
        if (cancelled) return;
        const wasmEngine = createUqmWasmConversationEngine(uqm);
        engineRef.current = createInkConversationEngine(wasmEngine);
        setEngineLabel('Ink + WASM');
      })
      .catch(() => {
        // Best-effort: the app will keep using the TypeScript conversation core.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [state, setState] = useState<GameState>(() => engineRef.current.createInitialState());
  const [saveSlots, setSaveSlots] = useState<SaveSlotInfo[]>(() => listSaveSlots());
  const [summitGateCheckpoint, setSummitGateCheckpoint] = useState<CheckpointInfo>(() => getSummitGateCheckpointInfo());

  const suppressEncounterToastRef = useRef(false);
  const lastEncounterToastIdRef = useRef<string | null>(null);
  const didInitEncounterToastRef = useRef(false);
  const lastSummitGateCheckpointStepRef = useRef<number | null>(null);
  const lastSceneRef = useRef(state.currentScene);

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

  const refreshSlots = useCallback(() => {
    setSaveSlots(listSaveSlots());
    setSummitGateCheckpoint(getSummitGateCheckpointInfo());
  }, []);

  useEffect(() => {
    const prevScene = lastSceneRef.current;
    const nextScene = state.currentScene;

    if (prevScene === nextScene) return;

    if (nextScene === 'title' || nextScene === 'load') {
      refreshSlots();
    }

    lastSceneRef.current = nextScene;
  }, [refreshSlots, state.currentScene]);

  useEffect(() => {
    if (state.currentScene !== 'game') return;
    if (state.currentDialogue?.id !== 'summit-start') return;

    const step = state.stepNumber;
    if (lastSummitGateCheckpointStepRef.current === step) return;

    const ok = saveSummitGateCheckpoint(state);
    if (!ok) return;

    lastSummitGateCheckpointStepRef.current = step;
    refreshSlots();
    toast.info('Checkpoint saved: Summit Gate');
  }, [state.currentScene, state.currentDialogue?.id, state.stepNumber, state, refreshSlots]);

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

  const hydrateLoadedState = useCallback((loaded: unknown): GameState => {
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

    const inkCandidate =
      loadedAny.ink && typeof loadedAny.ink === 'object'
        ? (loadedAny.ink as { storyId?: unknown; storyVersion?: unknown; stateJson?: unknown })
        : null;

    const loadedInk =
      inkCandidate &&
      inkCandidate.storyId === 'main' &&
      typeof inkCandidate.stateJson === 'string' &&
      (typeof inkCandidate.storyVersion === 'undefined' || typeof inkCandidate.storyVersion === 'string')
        ? ({
            storyId: 'main',
            storyVersion: typeof inkCandidate.storyVersion === 'string' ? inkCandidate.storyVersion : undefined,
            stateJson: inkCandidate.stateJson,
          } as NonNullable<GameState['ink']>)
        : null;

    const hydratedLog = loadedAny.log ?? base.log;

    const selectedChoiceIdsFromSave = Array.isArray(loadedAny.selectedChoiceIds)
      ? loadedAny.selectedChoiceIds
      : base.selectedChoiceIds;

    const loadedTurnNumber = typeof loadedAny.turnNumber === 'number' ? loadedAny.turnNumber : base.turnNumber;

    let hydrated: GameState = {
      ...base,
      ...loadedAny,
      player: normalizePlayerProfile(loadedAny.player ?? base.player),
      factions: loadedAny.factions ?? base.factions,
      events: loadedAny.events ?? base.events,
      knownSecrets: loadedAny.knownSecrets ?? base.knownSecrets,
      selectedChoiceIds: inferSelectedChoiceIdsFromLog(selectedChoiceIdsFromSave, hydratedLog),
      log: hydratedLog,
      stepNumber: typeof loadedAny.stepNumber === 'number' ? loadedAny.stepNumber : loadedTurnNumber,
      turnNumber: loadedTurnNumber,
      chapterId: typeof loadedAny.chapterId === 'string' ? loadedAny.chapterId : base.chapterId,
      chapterTurn: typeof loadedAny.chapterTurn === 'number' ? loadedAny.chapterTurn : base.chapterTurn,
      milestones: Array.isArray(loadedAny.milestones) ? loadedAny.milestones : base.milestones,
      resources:
        loadedAny.resources && typeof loadedAny.resources === 'object'
          ? ({ ...base.resources, ...(loadedAny.resources as Partial<GameState['resources']>) } as GameState['resources'])
          : base.resources,
      projects: Array.isArray(loadedAny.projects) ? loadedAny.projects : base.projects,
      management:
        loadedAny.management && typeof loadedAny.management === 'object'
          ? {
              ...base.management,
              ...(loadedAny.management as Partial<GameState['management']>),
            }
          : base.management,
      rngSeed: typeof loadedAny.rngSeed === 'number' ? loadedAny.rngSeed : base.rngSeed,
      world:
        loadedAny.world && typeof loadedAny.world === 'object'
          ? {
              ...base.world,
              ...(loadedAny.world as Partial<GameState['world']>),
              aiMemory: {
                ...base.world.aiMemory,
                ...(((loadedAny.world as Partial<GameState['world']>).aiMemory ?? {}) as Partial<GameState['world']['aiMemory']>),
              },
              encounterMemory: {
                ...(base.world.encounterMemory ?? { lastSeenTurnByTemplateId: {}, seenThisChapter: {} }),
                ...(((loadedAny.world as Partial<GameState['world']>).encounterMemory ?? {}) as Partial<NonNullable<GameState['world']['encounterMemory']>>),
              },
            }
          : base.world,
      pendingEncounter,
      ink: loadedInk,
      currentDialogue: loadedDialogueId
        ? loadedDialogueId.startsWith('encounter:') && pendingEncounter
          ? buildEncounterDialogueNode(pendingEncounter)
          : dialogueTree[loadedDialogueId] ?? (loadedAny.currentDialogue as GameState['currentDialogue'])
        : (loadedAny.currentDialogue as GameState['currentDialogue']) ?? null,
      // Always resume gameplay after loading a save.
      currentScene: 'game',
    };

    if (loadedInk && loadedDialogueId && loadedDialogueId.startsWith('ink:')) {
      const currentStoryVersion = getInkStoryVersion(loadedInk.storyId);
      const saveVersion = loadedInk.storyVersion ?? null;

      if (saveVersion && currentStoryVersion && saveVersion !== currentStoryVersion) {
        hydrated = {
          ...hydrated,
          ink: null,
          currentDialogue: dialogueTree['opening'] ?? null,
        };
      } else {
        try {
          const story = createInkStory(loadedInk.storyId, loadedInk.stateJson);
          syncGameStateToInkVariables(story, hydrated);
          hydrated = {
            ...hydrated,
            currentDialogue: buildDialogueNodeFromInk(story),
          };
        } catch {
          hydrated = {
            ...hydrated,
            ink: null,
            currentDialogue: dialogueTree['opening'] ?? null,
          };
        }
      }
    } else if (loadedDialogueId && loadedDialogueId.startsWith('ink:')) {
      hydrated = {
        ...hydrated,
        ink: null,
        currentDialogue: dialogueTree['opening'] ?? null,
      };
    }

    if (hydrated.currentDialogue && HUB_NODE_IDS.has(hydrated.currentDialogue.id)) {
      const hubId = getChapter(hydrated.chapterId).hubNodeId;
      if (hydrated.currentDialogue.id !== hubId) {
        const hub = dialogueTree[hubId] ?? null;
        if (hub) hydrated = { ...hydrated, currentDialogue: hub };
      }
    }

    return hydrated;
  }, []);

  const loadFromSlot = useCallback((slotId: number) => {
    const loaded = loadGameFromSlot(slotId);
    if (!loaded) {
      toast.error(`Slot ${slotId} is empty.`);
      return;
    }

    const hydrated = hydrateLoadedState(loaded);

    suppressEncounterToastRef.current = true;
    setState(hydrated);
    refreshSlots();
    toast.success(`Loaded Slot ${slotId}`);
  }, [hydrateLoadedState, refreshSlots]);

  const loadCheckpoint = useCallback(() => {
    const loaded = loadSummitGateCheckpoint();
    if (!loaded) {
      toast.error('No Summit Gate checkpoint yet.');
      return;
    }

    const hydrated = hydrateLoadedState(loaded);

    suppressEncounterToastRef.current = true;
    setState(hydrated);
    refreshSlots();
    toast.success('Loaded Checkpoint: Summit Gate');
  }, [hydrateLoadedState, refreshSlots]);

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

  const takeManagementAction = useCallback((actionId: string) => {
    setState(prev => applyManagementAction(prev, actionId));
  }, []);

  const resetGame = useCallback(() => {
    setState(engineRef.current.createInitialState());
  }, []);

  const enterPendingEncounter = useCallback(() => {
    setState(prev => enterPendingEncounterTransition(prev));
  }, []);

  const returnToHub = useCallback(() => {
    setState(prev => returnToHubTransition(prev));
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
    loadCheckpoint,
    deleteSlot,
    listSlots,
    summitGateCheckpoint,
    makeChoice,
    endTurn,
    takeManagementAction,
    resetGame,
    enterPendingEncounter,
    returnToHub,
  };
}
