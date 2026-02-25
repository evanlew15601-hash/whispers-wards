import { describe, expect, it } from 'vitest';
import { tsConversationEngine, TS_OPENING_LOG_LINE } from './tsConversationEngine';

describe('tsConversationEngine', () => {
  it('startNewGame sets initial scene/dialogue/log', () => {
    const state = tsConversationEngine.startNewGame();

    expect(state.currentScene).toBe('game');
    expect(state.currentDialogue?.id).toBe('opening');
    expect(state.turnNumber).toBe(1);
    expect(state.log[0]).toBe(TS_OPENING_LOG_LINE);
  });

  it('applyChoice advances dialogue and increments turn', () => {
    const initial = tsConversationEngine.startNewGame();

    // Make deterministic for simulation output.
    const seeded = { ...initial, rngSeed: 123456789 };

    const choice = seeded.currentDialogue!.choices[0];
    const next = tsConversationEngine.applyChoice(seeded, choice);

    expect(next.turnNumber).toBe(seeded.turnNumber + 1);
    expect(next.currentDialogue?.id).toBe('aldric-diplomatic');
    expect(next.log.some(l => l.startsWith('> '))).toBe(true);
  });
});
