import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tsConversationEngine } from './engine/tsConversationEngine';

describe('game storage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    vi.resetModules();
  });

  const importStorage = () => import('./storage');

  it('lists SAVE_SLOT_COUNT slots with stable ids', async () => {
    const { listSaveSlots, SAVE_SLOT_COUNT } = await importStorage();

    const slots = listSaveSlots();
    expect(slots).toHaveLength(SAVE_SLOT_COUNT);
    expect(slots.map(s => s.id)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(slots.every(s => s.meta === null)).toBe(true);
  });

  it('saves, loads, and deletes a slot (v2)', async () => {
    const { STORAGE_KEY_V2, deleteSaveSlot, listSaveSlots, loadGameFromSlot, saveGameToSlot } =
      await importStorage();

    const state = tsConversationEngine.startNewGame();

    expect(saveGameToSlot(1, state)).toBe(true);

    const raw = localStorage.getItem(STORAGE_KEY_V2);
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw as string) as {
      version: number;
      slots: Record<string, { state?: { currentDialogueId?: unknown } }>;
    };

    expect(persisted.version).toBe(2);
    expect(persisted.slots['1']?.state?.currentDialogueId).toBe(state.currentDialogue?.id ?? null);

    const slots = listSaveSlots();
    expect(slots[0].meta?.turnNumber).toBe(state.turnNumber);

    const loaded = loadGameFromSlot(1);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.state.currentScene).toBe('game');
      expect(loaded.state.turnNumber).toBe(state.turnNumber);
      expect(loaded.state.currentDialogue?.id).toBe(state.currentDialogue?.id);
    }

    expect(deleteSaveSlot(1)).toBe(true);
    expect(loadGameFromSlot(1)).toEqual({ ok: false, reason: 'empty' });
    expect(listSaveSlots()[0].meta).toBeNull();
  });

  it('loads a v2 slot containing legacy pendingEncounter into pendingEncounters', async () => {
    const { STORAGE_KEY_V2, loadGameFromSlot } = await importStorage();

    const base = tsConversationEngine.startNewGame();

    const legacyPendingEncounter = {
      id: 'enc-legacy',
      kind: 'embargo' as const,
      routeId: 'ashroad',
      title: 'Embargo crisis',
      description: 'Legacy pendingEncounter field.',
      relatedFactions: ['ember-throne', 'iron-pact'],
      expiresOnTurn: 5,
    };

    localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({
        version: 2,
        slots: {
          '1': {
            meta: {
              savedAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
              turnNumber: base.turnNumber,
              factions: base.factions.map(f => ({ id: f.id, name: f.name, reputation: f.reputation })),
            },
            state: {
              factions: base.factions,
              events: base.events,
              knownSecrets: base.knownSecrets,
              turnNumber: base.turnNumber,
              log: base.log,
              rngSeed: base.rngSeed,
              world: base.world,
              pendingEncounter: legacyPendingEncounter,
              encounterResolvedOnTurn: null,
              currentScene: 'game',
              currentDialogueId: base.currentDialogue?.id ?? null,
            },
          },
        },
      }),
    );

    const loaded = loadGameFromSlot(1);
    expect(loaded.ok).toBe(true);

    if (loaded.ok) {
      expect(loaded.state.pendingEncounters?.map(e => e.id)).toEqual(['enc-legacy']);
    }
  });

  it('ignores invalid slot ids', async () => {
    const { deleteSaveSlot, listSaveSlots, loadGameFromSlot, saveGameToSlot } = await importStorage();

    const state = tsConversationEngine.startNewGame();

    expect(saveGameToSlot(0, state)).toBe(false);
    expect(saveGameToSlot(-1, state)).toBe(false);
    expect(saveGameToSlot(999, state)).toBe(false);

    expect(listSaveSlots().every(s => s.meta === null)).toBe(true);

    expect(loadGameFromSlot(0)).toEqual({ ok: false, reason: 'empty' });
    expect(loadGameFromSlot(-1)).toEqual({ ok: false, reason: 'empty' });
    expect(loadGameFromSlot(999)).toEqual({ ok: false, reason: 'empty' });

    expect(deleteSaveSlot(0)).toBe(false);
    expect(deleteSaveSlot(-1)).toBe(false);
    expect(deleteSaveSlot(999)).toBe(false);

    expect(listSaveSlots().every(s => s.meta === null)).toBe(true);
  });

  it('handles corrupted JSON in STORAGE_KEY_V2 without throwing', async () => {
    const { STORAGE_KEY_V2, listSaveSlots, SAVE_SLOT_COUNT } = await importStorage();

    localStorage.setItem(STORAGE_KEY_V2, '{not json');

    const slots = listSaveSlots();
    expect(slots).toHaveLength(SAVE_SLOT_COUNT);
    expect(slots.every(s => s.meta === null)).toBe(true);
  });

  it('returns corrupt when STORAGE_KEY_V2 contains invalid JSON', async () => {
    const { STORAGE_KEY_V2, loadGameFromSlot } = await importStorage();

    localStorage.setItem(STORAGE_KEY_V2, '{not json');

    expect(loadGameFromSlot(1)).toEqual({ ok: false, reason: 'corrupt' });
  });

  it('returns corrupt when slot exists but fails schema validation (v2)', async () => {
    const { STORAGE_KEY_V2, loadGameFromSlot } = await importStorage();

    localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({
        version: 2,
        slots: {
          '1': {
            meta: 'not meta',
            state: { currentDialogueId: null },
          },
        },
      }),
    );

    expect(loadGameFromSlot(1)).toEqual({ ok: false, reason: 'corrupt' });
  });

  it('treats a schema-invalid slot as empty (v2)', async () => {
    const { STORAGE_KEY_V2, listSaveSlots } = await importStorage();

    localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({
        version: 2,
        slots: {
          '1': {
            meta: 'not meta',
            state: { currentDialogueId: null },
          },
        },
      }),
    );

    const slots = listSaveSlots();
    expect(slots[0].meta).toBeNull();
  });

  it('migrates legacy unversioned key (v1) to STORAGE_KEY_V2', async () => {
    const { STORAGE_KEY_V2, listSaveSlots } = await importStorage();

    const state = tsConversationEngine.startNewGame();

    // Create a legacy store: { slots: { ... } } (no version field, full state).
    localStorage.setItem(
      'crown-concord:save-slots',
      JSON.stringify({
        slots: {
          '1': {
            meta: {
              savedAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
              turnNumber: state.turnNumber,
              factions: state.factions.map(f => ({ id: f.id, name: f.name, reputation: f.reputation })),
            },
            state,
          },
        },
      }),
    );

    const slots = listSaveSlots();
    expect(slots[0].meta?.turnNumber).toBe(state.turnNumber);

    const migrated = localStorage.getItem(STORAGE_KEY_V2);
    expect(migrated).toBeTruthy();

    const parsed = JSON.parse(migrated as string) as {
      version: number;
      slots: Record<string, { state?: { currentDialogueId?: unknown } }>;
    };
    expect(parsed.version).toBe(2);
    expect(parsed.slots['1']?.state?.currentDialogueId).toBe(state.currentDialogue?.id ?? null);
  });

  it('migrates v1 key to v2 by extracting currentDialogue?.id', async () => {
    const { STORAGE_KEY_V1, STORAGE_KEY_V2, loadGameFromSlot } = await importStorage();

    const state = tsConversationEngine.startNewGame();

    localStorage.setItem(
      STORAGE_KEY_V1,
      JSON.stringify({
        version: 1,
        slots: {
          '1': {
            meta: {
              savedAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
              turnNumber: state.turnNumber,
              factions: state.factions.map(f => ({ id: f.id, name: f.name, reputation: f.reputation })),
            },
            state,
          },
        },
      }),
    );

    expect(localStorage.getItem(STORAGE_KEY_V2)).toBeNull();

    const loaded = loadGameFromSlot(1);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.state.currentDialogue?.id).toBe(state.currentDialogue?.id);
    }

    const migrated = localStorage.getItem(STORAGE_KEY_V2);
    expect(migrated).toBeTruthy();

    const parsed = JSON.parse(migrated as string) as {
      version: number;
      slots: Record<string, { state?: { currentDialogueId?: unknown } }>;
    };
    expect(parsed.version).toBe(2);
    expect(parsed.slots['1']?.state?.currentDialogueId).toBe(state.currentDialogue?.id ?? null);
  });

  it('returns false when localStorage.setItem throws during save', async () => {
    const { loadGameFromSlot, saveGameToSlot } = await importStorage();

    const state = tsConversationEngine.startNewGame();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err =
        typeof DOMException !== 'undefined'
          ? new DOMException('Quota exceeded', 'QuotaExceededError')
          : Object.assign(new Error('Quota exceeded'), { name: 'QuotaExceededError' });
      throw err;
    });

    expect(saveGameToSlot(1, state)).toBe(false);
    expect(loadGameFromSlot(1)).toEqual({ ok: false, reason: 'empty' });
  });

  it('returns false when localStorage.setItem throws during delete', async () => {
    const { deleteSaveSlot, loadGameFromSlot, saveGameToSlot } = await importStorage();

    const state = tsConversationEngine.startNewGame();
    expect(saveGameToSlot(1, state)).toBe(true);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const err =
        typeof DOMException !== 'undefined'
          ? new DOMException('Quota exceeded', 'QuotaExceededError')
          : Object.assign(new Error('Quota exceeded'), { name: 'QuotaExceededError' });
      throw err;
    });

    expect(deleteSaveSlot(1)).toBe(false);

    const loaded = loadGameFromSlot(1);
    expect(loaded.ok).toBe(true);
  });
});
