import { describe, expect, it } from 'vitest';
import { tsConversationEngine, TS_OPENING_LOG_LINE } from './tsConversationEngine';
import { dialogueTree } from '../data';
import { buildEncounterDialogueNode } from '../encounters';
import type { SecondaryEncounter } from '../types';

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

  it('locks proof-gated summit actions until evidence is discovered', () => {
    const initial = tsConversationEngine.startNewGame();

    const atSummit = {
      ...initial,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
      factions: initial.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
      knownSecrets: [],
    };

    const exposeIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-expose');
    expect(exposeIdx).toBeGreaterThanOrEqual(0);

    const exposeChoice = atSummit.currentDialogue!.choices[exposeIdx];

    const lockedFlags = tsConversationEngine.getChoiceLockedFlags(atSummit);
    expect(lockedFlags?.[exposeIdx]).toBe(true);

    const nextLocked = tsConversationEngine.applyChoice(atSummit, exposeChoice);
    expect(nextLocked).toBe(atSummit);

    const withProof = {
      ...atSummit,
      knownSecrets: ['Renzo\'s ledger pages show coded payments tied to the border killings.'],
    };

    const unlockedFlags = tsConversationEngine.getChoiceLockedFlags(withProof);
    expect(unlockedFlags?.[exposeIdx]).toBe(false);

    const next = tsConversationEngine.applyChoice(withProof, exposeChoice);
    expect(next).not.toBe(withProof);
    expect(next.currentDialogue?.id).toBe('ending-embers-fall');
  });

  it('suppresses reputation effects when repeating rep-affecting choices in legacy saves', () => {
    const initial = tsConversationEngine.startNewGame();

    const legacyState = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-request'],
      knownSecrets: ['You stole a copy of Renzo\'s ledger pages while his guards were distracted.'],
      selectedChoiceIds: [],
      rngSeed: 123456789,
    };

    const stealIdx = legacyState.currentDialogue!.choices.findIndex(c => c.id === 'ledger-steal');
    expect(stealIdx).toBeGreaterThanOrEqual(0);

    const stealChoice = legacyState.currentDialogue!.choices[stealIdx];

    const repsBefore = Object.fromEntries(legacyState.factions.map(f => [f.id, f.reputation] as const));

    const next = tsConversationEngine.applyChoice(legacyState, stealChoice);
    expect(next).not.toBe(legacyState);

    const repsAfter = Object.fromEntries(next.factions.map(f => [f.id, f.reputation] as const));
    expect(repsAfter).toEqual(repsBefore);

    expect(next.selectedChoiceIds).toContain('ledger-steal');
  });

  it('suppresses reputation effects when repeating rep-affecting choices (e.g. stealing Renzo\'s ledger pages)', () => {
    const initial = tsConversationEngine.startNewGame();

    const atLedger = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-request'],
      rngSeed: 123456789,
    };

    const stealIdx = atLedger.currentDialogue!.choices.findIndex(c => c.id === 'ledger-steal');
    expect(stealIdx).toBeGreaterThanOrEqual(0);

    const stealChoice = atLedger.currentDialogue!.choices[stealIdx];

    const afterSteal = tsConversationEngine.applyChoice(atLedger, stealChoice);
    expect(afterSteal).not.toBe(atLedger);
    expect(afterSteal.selectedChoiceIds).toContain('ledger-steal');

    const revisit = {
      ...afterSteal,
      currentDialogue: dialogueTree['renzo-ledger-request'],
    };

    const repsBefore = Object.fromEntries(revisit.factions.map(f => [f.id, f.reputation] as const));

    const afterRepeat = tsConversationEngine.applyChoice(revisit, stealChoice);
    expect(afterRepeat).not.toBe(revisit);

    const repsAfter = Object.fromEntries(afterRepeat.factions.map(f => [f.id, f.reputation] as const));
    expect(repsAfter).toEqual(repsBefore);
  });

  it('keeps choice history after resolving an encounter (summit-adjourn effects are not re-applied)', () => {
    const initial = tsConversationEngine.startNewGame();

    const atSummit = {
      ...initial,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
    };

    const adjournIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-adjourn');
    expect(adjournIdx).toBeGreaterThanOrEqual(0);

    const adjourn = atSummit.currentDialogue!.choices[adjournIdx];

    const afterAdjourn = tsConversationEngine.applyChoice(atSummit, adjourn);
    expect(afterAdjourn.selectedChoiceIds).toContain('summit-adjourn');

    const encounter: SecondaryEncounter = {
      id: 'enc-test',
      kind: 'embargo',
      routeId: 'ashroad',
      title: 'Embargo crisis',
      description: 'Test encounter.',
      relatedFactions: ['ember-throne', 'iron-pact'],
      expiresOnTurn: afterAdjourn.turnNumber + 2,
    };

    const encounterNode = buildEncounterDialogueNode(encounter);

    const inEncounter = {
      ...afterAdjourn,
      currentDialogue: encounterNode,
      pendingEncounter: encounter,
    };

    const resolveChoice = encounterNode.choices[0];
    const afterEncounter = tsConversationEngine.applyChoice(inEncounter, resolveChoice);

    const revisitSummit = {
      ...afterEncounter,
      currentDialogue: dialogueTree['summit-start'],
    };

    expect(revisitSummit.selectedChoiceIds).toContain('summit-adjourn');

    const repeatAdjourn = revisitSummit.currentDialogue!.choices.find(c => c.id === 'summit-adjourn');
    if (!repeatAdjourn) throw new Error('Expected summit-adjourn choice on revisit');

    const repsBefore = Object.fromEntries(revisitSummit.factions.map(f => [f.id, f.reputation] as const));

    const afterRepeat = tsConversationEngine.applyChoice(revisitSummit, repeatAdjourn);

    const repsAfter = Object.fromEntries(afterRepeat.factions.map(f => [f.id, f.reputation] as const));
    expect(repsAfter).toEqual(repsBefore);
  });
});
