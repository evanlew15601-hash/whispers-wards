import { describe, expect, it } from 'vitest';
import { createTsConversationEngine, tsConversationEngine, TS_OPENING_LOG_LINE } from './tsConversationEngine';

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

  it('applyChoice triggers threshold events and logs secrets/world sim output', () => {
    const initial = tsConversationEngine.startNewGame();

    const seeded = { ...initial, rngSeed: 123456789 };

    const choice = {
      id: 'qa-boost',
      text: 'Test choice for QA',
      effects: [{ factionId: 'iron-pact', reputationChange: 35 }],
      nextNodeId: null,
      revealsInfo: 'qa-secret',
    };

    const next = tsConversationEngine.applyChoice(seeded, choice);

    const ironAlliance = next.events.find(e => e.id === 'iron-pact-alliance');
    expect(ironAlliance?.triggered).toBe(true);

    expect(next.log.some(l => l.startsWith('⚡ Event: '))).toBe(true);
    expect(next.log.some(l => l.startsWith('🔍 Secret learned: '))).toBe(true);
    expect(next.log.some(l => l.startsWith('🌍 '))).toBe(true);
  });

  it('dedupes knownSecrets while preserving insertion order', () => {
    const initial = tsConversationEngine.startNewGame();

    const seeded = { ...initial, knownSecrets: ['dup'], rngSeed: 123456789 };

    const choice = {
      id: 'qa-dup',
      text: 'Duplicate secret',
      effects: [],
      nextNodeId: null,
      revealsInfo: 'dup',
    };

    const next = tsConversationEngine.applyChoice(seeded, choice);
    expect(next.knownSecrets).toEqual(['dup']);
  });

  it('enforces once + requiresInfo + forbidsInfo gating (response pool semantics)', () => {
    const testTree = {
      opening: {
        id: 'opening',
        speaker: 'Test',
        speakerFaction: 'iron-pact',
        text: 'Test opening',
        choices: [
          {
            id: 'learn-intel',
            text: 'Acquire the intel token.',
            effects: [],
            nextNodeId: 'opening',
            revealsInfo: 'intel-token',
          },
          {
            id: 'one-time-ask',
            text: 'Ask the one-time question.',
            effects: [],
            nextNodeId: 'after',
            once: true,
            requiresInfo: 'intel-token',
            revealsInfo: 'learned-answer',
          },
          {
            id: 'forbidden-if-token',
            text: 'This becomes blocked once you have the token.',
            effects: [],
            nextNodeId: null,
            forbidsInfo: 'intel-token',
          },
        ],
      },
      after: {
        id: 'after',
        speaker: 'Test',
        speakerFaction: 'iron-pact',
        text: 'After node',
        choices: [
          {
            id: 'back',
            text: 'Back to opening.',
            effects: [],
            nextNodeId: 'opening',
          },
        ],
      },
      'concord-hub': {
        id: 'concord-hub',
        speaker: 'Hub',
        speakerFaction: 'iron-pact',
        text: 'Hub',
        choices: [],
      },
    } as const;

    const engine = createTsConversationEngine(testTree as any);
    const start = engine.startNewGame();

    // Trying to pick the gated one-time choice without intel should be rejected.
    const gatedChoice = start.currentDialogue!.choices.find(c => c.id === 'one-time-ask')!;
    expect(engine.applyChoice(start, gatedChoice)).toBe(start);

    // Learn the token.
    const learnChoice = start.currentDialogue!.choices.find(c => c.id === 'learn-intel')!;
    const withToken = engine.applyChoice(start, learnChoice);
    expect(withToken).not.toBe(start);
    expect(withToken.knownSecrets).toContain('intel-token');

    // Now the forbids choice should be locked.
    const forbidsChoice = withToken.currentDialogue!.choices.find(c => c.id === 'forbidden-if-token')!;
    expect(engine.applyChoice(withToken, forbidsChoice)).toBe(withToken);

    // Take the one-time choice; it should add a usage marker.
    const asked = engine.applyChoice(withToken, gatedChoice);
    expect(asked.currentDialogue?.id).toBe('after');
    expect(asked.knownSecrets).toContain('learned-answer');
    expect(asked.knownSecrets.some(s => s.startsWith('choice-used:one-time-ask'))).toBe(true);

    // Return to opening and verify the one-time choice is now locked.
    const back = asked.currentDialogue!.choices[0];
    const backToOpening = engine.applyChoice(asked, back);
    expect(backToOpening.currentDialogue?.id).toBe('opening');

    expect(engine.applyChoice(backToOpening, gatedChoice)).toBe(backToOpening);
  });
});
