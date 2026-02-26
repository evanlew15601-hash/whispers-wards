import { describe, expect, it } from 'vitest';

import { MAX_PENDING_ENCOUNTERS, tsConversationEngine } from './engine/tsConversationEngine';

const chooseById = (state: Parameters<typeof tsConversationEngine.applyChoice>[0], id: string) => {
  const choice = state.currentDialogue?.choices.find(c => c.id === id);
  expect(choice, `expected choice '${id}' to exist on node '${state.currentDialogue?.id ?? 'null'}'`).toBeTruthy();
  return tsConversationEngine.applyChoice(state, choice!);
};

describe('smoke: playable vertical slice', () => {
  it('can reach an ending via the summit flow without crashing', () => {
    let state = tsConversationEngine.startNewGame();

    // Stabilize the simulation for this smoke test.
    state = { ...state, rngSeed: 123 };

    expect(state.currentDialogue?.id).toBe('opening');
    expect(state.turnNumber).toBe(1);

    state = chooseById(state, 'information');
    expect(state.currentDialogue?.id).toBe('aldric-suspicious');
    expect(state.pendingEncounters.length).toBeLessThanOrEqual(MAX_PENDING_ENCOUNTERS);

    state = chooseById(state, 'stay-neutral');
    expect(state.currentDialogue?.id).toBe('investigation-start');
    expect(state.pendingEncounters.length).toBeLessThanOrEqual(MAX_PENDING_ENCOUNTERS);

    state = chooseById(state, 'begin');
    expect(state.currentDialogue?.id).toBe('concord-hub');
    expect(state.pendingEncounters.length).toBeLessThanOrEqual(MAX_PENDING_ENCOUNTERS);

    state = chooseById(state, 'hub-summit');
    expect(state.currentDialogue?.id).toBe('summit-start');

    state = chooseById(state, 'summit-compact');
    expect(state.currentDialogue?.id).toBe('ending-greenmarch-compact');

    state = chooseById(state, 'end-compact');
    expect(state.currentDialogue).toBeNull();

    // 6 player choices from turn 1 => turn 7.
    expect(state.turnNumber).toBe(7);
  });
});
