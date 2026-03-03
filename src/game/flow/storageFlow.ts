import type { GameState } from '../types';
import type { ConversationEngine } from '../engine/conversationEngine';

import { getAllDialogueNodes, getDialogueTree } from '../data';
import { normalizePlayerProfile } from '../player';
import { buildEncounterDialogueNode } from '../encounters';
import type { SaveSlotInfo } from '../storage';
import { deleteSaveSlot, listSaveSlots, loadGameFromSlot, saveGameToSlot } from '../storage';

export type StorageFlowEvent =
  | { type: 'refreshSlots' }
  | { type: 'saveToSlot'; slotId: number }
  | { type: 'loadFromSlot'; slotId: number }
  | { type: 'deleteSlot'; slotId: number };

export type StorageFlowToast = { kind: 'success' | 'error'; message: string };

export type StorageFlowOutcome = {
  state: GameState | null;
  saveSlots: SaveSlotInfo[];
  toast: StorageFlowToast | null;
  suppressEncounterToast: boolean;
};

const uniqueRepChoiceIdByText = (() => {
  const seen = new Map<string, string | null>();

  for (const node of getAllDialogueNodes()) {
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

export function applyStorageFlowEvent(
  prev: GameState,
  event: StorageFlowEvent,
  engine: ConversationEngine,
): StorageFlowOutcome {
  if (event.type === 'refreshSlots') {
    return {
      state: null,
      saveSlots: listSaveSlots(),
      toast: null,
      suppressEncounterToast: false,
    };
  }

  if (event.type === 'saveToSlot') {
    if (prev.currentScene !== 'game') {
      return {
        state: null,
        saveSlots: listSaveSlots(),
        toast: { kind: 'error', message: 'Cannot save outside gameplay.' },
        suppressEncounterToast: false,
      };
    }

    const ok = saveGameToSlot(event.slotId, prev);

    return {
      state: null,
      saveSlots: listSaveSlots(),
      toast: ok
        ? { kind: 'success', message: `Saved to Slot ${event.slotId}` }
        : { kind: 'error', message: `Failed to save Slot ${event.slotId}` },
      suppressEncounterToast: false,
    };
  }

  if (event.type === 'deleteSlot') {
    const ok = deleteSaveSlot(event.slotId);

    return {
      state: null,
      saveSlots: listSaveSlots(),
      toast: ok
        ? { kind: 'success', message: `Deleted Slot ${event.slotId}` }
        : { kind: 'error', message: `Failed to delete Slot ${event.slotId}` },
      suppressEncounterToast: false,
    };
  }

  if (event.type === 'loadFromSlot') {
    const loaded = loadGameFromSlot(event.slotId);
    if (!loaded) {
      return {
        state: null,
        saveSlots: listSaveSlots(),
        toast: { kind: 'error', message: `Slot ${event.slotId} is empty.` },
        suppressEncounterToast: false,
      };
    }

    // Back/forward compatibility: hydrate missing fields and refresh dialogue from the current tree when possible.
    const base = engine.createInitialState();

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

    const chapterId = typeof (loadedAny as any).chapterId === 'string' ? ((loadedAny as any).chapterId as string) : base.chapterId;
    const chapterTree = getDialogueTree(chapterId);

    const hydrated: GameState = {
      ...base,
      ...loadedAny,
      player: normalizePlayerProfile(loadedAny.player ?? base.player),
      factions: loadedAny.factions ?? base.factions,
      events: loadedAny.events ?? base.events,
      knownSecrets: loadedAny.knownSecrets ?? base.knownSecrets,
      knownTokens: (loadedAny as any).knownTokens ?? base.knownTokens,
      selectedChoiceIds: inferSelectedChoiceIdsFromLog(selectedChoiceIdsFromSave, hydratedLog),
      log: hydratedLog,
      stepNumber:
        typeof (loadedAny as any).stepNumber === 'number'
          ? ((loadedAny as any).stepNumber as number)
          : loadedTurnNumber,
      turnNumber: loadedTurnNumber,
      chapterId,
      chapterTurn: typeof (loadedAny as any).chapterTurn === 'number' ? ((loadedAny as any).chapterTurn as number) : base.chapterTurn,
      milestones: Array.isArray((loadedAny as any).milestones) ? ((loadedAny as any).milestones as string[]) : base.milestones,
      resources:
        (loadedAny as any).resources && typeof (loadedAny as any).resources === 'object'
          ? ({ ...base.resources, ...(loadedAny as any).resources } as GameState['resources'])
          : base.resources,
      projects: Array.isArray((loadedAny as any).projects) ? ((loadedAny as any).projects as GameState['projects']) : base.projects,
      management:
        (loadedAny as any).management && typeof (loadedAny as any).management === 'object'
          ? {
              ...base.management,
              ...(loadedAny as any).management,
            }
          : base.management,
      rngSeed: typeof loadedAny.rngSeed === 'number' ? loadedAny.rngSeed : base.rngSeed,
      world:
        loadedAny.world && typeof loadedAny.world === 'object'
          ? {
              ...base.world,
              ...(loadedAny.world as any),
              aiMemory: {
                ...base.world.aiMemory,
                ...((loadedAny.world as any).aiMemory ?? {}),
              },
              encounterMemory: {
                ...(base.world.encounterMemory ?? { lastSeenTurnByTemplateId: {}, seenThisChapter: {} }),
                ...((loadedAny.world as any).encounterMemory ?? {}),
              },
            }
          : base.world,
      pendingEncounter,
      currentDialogue: loadedDialogueId
        ? loadedDialogueId.startsWith('encounter:') && pendingEncounter
          ? buildEncounterDialogueNode(pendingEncounter)
          : chapterTree[loadedDialogueId] ?? (loadedAny.currentDialogue as GameState['currentDialogue'])
        : (loadedAny.currentDialogue as GameState['currentDialogue']) ?? null,
      // Always resume gameplay after loading a save.
      currentScene: 'game',
    };

    // Keep the encounter toast suppressed; loading a save should not show a "new encounter" popup.
    return {
      state: hydrated,
      saveSlots: listSaveSlots(),
      toast: { kind: 'success', message: `Loaded Slot ${event.slotId}` },
      suppressEncounterToast: true,
    };
  }

  // Exhaustiveness
  return {
    state: null,
    saveSlots: listSaveSlots(),
    toast: null,
    suppressEncounterToast: false,
  };
}
