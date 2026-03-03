import { beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_KEY_V1 } from '../storage';
import { tsConversationEngine } from '../engine/tsConversationEngine';
import { applyStorageFlowEvent } from './storageFlow';

describe('storageFlow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an error toast when loading an empty slot', () => {
    const engine = tsConversationEngine;
    const base = engine.createInitialState();

    const out = applyStorageFlowEvent(base, { type: 'loadFromSlot', slotId: 1 }, engine);

    expect(out.state).toBeNull();
    expect(out.toast).toEqual({ kind: 'error', message: 'Slot 1 is empty.' });
  });

  it('hydrates v1 stores into gameplay state', () => {
    const engine = tsConversationEngine;
    const base = engine.createInitialState();

    const store = {
      version: 1 as const,
      slots: {
        '1': {
          meta: {
            savedAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
            turnNumber: 7,
            factions: base.factions.map(f => ({ id: f.id, name: f.name, reputation: f.reputation })),
          },
          state: {
            currentScene: 'load',
            factions: base.factions,
            currentDialogue: { id: 'opening' },
            events: base.events,
            knownSecrets: [],
            turnNumber: 7,
            log: ['qa log'],
            player: { name: 'Envoy', pronouns: 'they/them', portraitId: 'envoy-default' },
          },
        },
      },
    };

    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(store));

    const out = applyStorageFlowEvent(base, { type: 'loadFromSlot', slotId: 1 }, engine);

    expect(out.toast?.kind).toBe('success');
    expect(out.state?.currentScene).toBe('game');
    expect(out.state?.currentDialogue?.id).toBe('opening');
  });
});
