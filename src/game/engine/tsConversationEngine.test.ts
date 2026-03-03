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

  it('applyChoice advances dialogue without advancing the turn; endTurn advances the simulation', () => {
    const initial = tsConversationEngine.startNewGame();

    // Make deterministic for simulation output.
    const seeded = { ...initial, rngSeed: 123456789 };

    const choice = seeded.currentDialogue!.choices[0];
    const afterChoice = tsConversationEngine.applyChoice(seeded, choice);

    expect(afterChoice.turnNumber).toBe(seeded.turnNumber);
    expect(afterChoice.stepNumber).toBe(seeded.stepNumber + 1);
    expect(afterChoice.currentDialogue?.id).toBe('aldric-diplomatic');
    expect(afterChoice.log.some(l => l.startsWith('> '))).toBe(true);

    const drained = {
      ...afterChoice,
      management: {
        ...afterChoice.management,
        apRemaining: 0,
        actionsTakenThisTurn: ['test-action'],
      },
    };

    const afterTurn = tsConversationEngine.endTurn(drained);
    expect(afterTurn.turnNumber).toBe(seeded.turnNumber + 1);
    expect(afterTurn.stepNumber).toBe(seeded.stepNumber + 2);
    expect(afterTurn.management.apRemaining).toBe(afterTurn.management.apMax);
    expect(afterTurn.management.actionsTakenThisTurn).toEqual([]);
    expect(afterTurn.log.some(l => l.startsWith('🌍 '))).toBe(true);

    const routes = Object.values(afterTurn.world.tradeRoutes);
    const openRoutes = routes.filter(r => r.status === 'open').length;
    const blockedRoutes = routes.filter(r => r.status !== 'open').length;
    const coinIncome = Math.max(0, 1 + openRoutes - blockedRoutes);
    expect(afterTurn.resources.coin).toBe(drained.resources.coin + coinIncome);
    expect(afterTurn.resources.influence).toBe(drained.resources.influence + 1);
    expect(afterTurn.resources.supplies).toBe(drained.resources.supplies + 1);
    expect(afterTurn.log.some(l => l.startsWith('💰 Income: '))).toBe(true);
  });

  it('treats nextNodeId=null as returning to the chapter hub', () => {
    const initial = tsConversationEngine.startNewGame();

    const choice = {
      id: 'qa-end-scene',
      text: 'End this scene',
      effects: [],
      nextNodeId: null,
    };

    const next = tsConversationEngine.applyChoice(initial, choice);
    expect(next.currentDialogue?.id).toBe('concord-hub');
  });

  it('applyChoice triggers threshold events and logs secrets; world sim output is logged on endTurn', () => {
    const initial = tsConversationEngine.startNewGame();

    const seeded = { ...initial, rngSeed: 123456789 };

    const choice = {
      id: 'qa-boost',
      text: 'Test choice for QA',
      effects: [{ factionId: 'iron-pact', reputationChange: 35 }],
      nextNodeId: null,
      revealsInfo: 'qa-secret',
    };

    const afterChoice = tsConversationEngine.applyChoice(seeded, choice);

    const ironAlliance = afterChoice.events.find(e => e.id === 'iron-pact-alliance');
    expect(ironAlliance?.triggered).toBe(true);

    expect(afterChoice.log.some(l => l.startsWith('⚡ Event: '))).toBe(true);
    expect(afterChoice.log.some(l => l.startsWith('🔍 Secret learned: '))).toBe(true);
    expect(afterChoice.log.some(l => l.startsWith('🌍 '))).toBe(false);

    const afterTurn = tsConversationEngine.endTurn(afterChoice);
    expect(afterTurn.log.some(l => l.startsWith('🌍 '))).toBe(true);
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

    const ledgerIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-expose-ledger');
    const manifestIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-expose-manifest');
    const mapsIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-expose-maps');

    expect(ledgerIdx).toBeGreaterThanOrEqual(0);
    expect(manifestIdx).toBeGreaterThanOrEqual(0);
    expect(mapsIdx).toBeGreaterThanOrEqual(0);

    const ledgerChoice = atSummit.currentDialogue!.choices[ledgerIdx];
    const manifestChoice = atSummit.currentDialogue!.choices[manifestIdx];
    const mapsChoice = atSummit.currentDialogue!.choices[mapsIdx];

    const lockedFlags = tsConversationEngine.getChoiceLockedFlags(atSummit);
    expect(lockedFlags?.[ledgerIdx]).toBe(true);
    expect(lockedFlags?.[manifestIdx]).toBe(true);
    expect(lockedFlags?.[mapsIdx]).toBe(true);

    expect(tsConversationEngine.applyChoice(atSummit, ledgerChoice)).toBe(atSummit);
    expect(tsConversationEngine.applyChoice(atSummit, manifestChoice)).toBe(atSummit);
    expect(tsConversationEngine.applyChoice(atSummit, mapsChoice)).toBe(atSummit);

    const withLedgerProof = {
      ...atSummit,
      knownSecrets: ['Renzo\'s ledger pages show coded payments tied to the border killings.'],
    };

    const unlockedLedger = tsConversationEngine.getChoiceLockedFlags(withLedgerProof);
    expect(unlockedLedger?.[ledgerIdx]).toBe(false);
    expect(unlockedLedger?.[manifestIdx]).toBe(true);
    expect(unlockedLedger?.[mapsIdx]).toBe(true);

    const nextLedger = tsConversationEngine.applyChoice(withLedgerProof, ledgerChoice);
    expect(nextLedger).not.toBe(withLedgerProof);
    expect(nextLedger.currentDialogue?.id).toBe('ending-embers-fall-ledger');

    const withManifestProof = {
      ...atSummit,
      knownSecrets: ['Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.'],
    };

    const unlockedManifest = tsConversationEngine.getChoiceLockedFlags(withManifestProof);
    expect(unlockedManifest?.[ledgerIdx]).toBe(true);
    expect(unlockedManifest?.[manifestIdx]).toBe(false);
    expect(unlockedManifest?.[mapsIdx]).toBe(true);

    const nextManifest = tsConversationEngine.applyChoice(withManifestProof, manifestChoice);
    expect(nextManifest).not.toBe(withManifestProof);
    expect(nextManifest.currentDialogue?.id).toBe('ending-embers-fall-manifest');

    const withMapsProof = {
      ...atSummit,
      knownSecrets: ['The Ember Throne forged maps to manipulate the border dispute.'],
    };

    const unlockedMaps = tsConversationEngine.getChoiceLockedFlags(withMapsProof);
    expect(unlockedMaps?.[ledgerIdx]).toBe(true);
    expect(unlockedMaps?.[manifestIdx]).toBe(true);
    expect(unlockedMaps?.[mapsIdx]).toBe(false);

    const nextMaps = tsConversationEngine.applyChoice(withMapsProof, mapsChoice);
    expect(nextMaps).not.toBe(withMapsProof);
    expect(nextMaps.currentDialogue?.id).toBe('ending-embers-fall-maps');

    const withMultipleProofs = {
      ...atSummit,
      knownSecrets: [
        'Renzo\'s ledger pages show coded payments tied to the border killings.',
        'Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.',
        'The Ember Throne forged maps to manipulate the border dispute.',
      ],
    };

    const unlockedMultiple = tsConversationEngine.getChoiceLockedFlags(withMultipleProofs);
    expect(unlockedMultiple?.[ledgerIdx]).toBe(false);
    expect(unlockedMultiple?.[manifestIdx]).toBe(false);
    expect(unlockedMultiple?.[mapsIdx]).toBe(false);
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

    const revisitHints = tsConversationEngine.getChoiceUiHints(revisit);
    expect(revisitHints?.[stealIdx]?.alreadyDecided).toBe(true);
    expect(revisitHints?.[stealIdx]?.locked).toBe(false);

    const repsBefore = Object.fromEntries(revisit.factions.map(f => [f.id, f.reputation] as const));

    const afterRepeat = tsConversationEngine.applyChoice(revisit, stealChoice);
    expect(afterRepeat).not.toBe(revisit);

    const repsAfter = Object.fromEntries(afterRepeat.factions.map(f => [f.id, f.reputation] as const));
    expect(repsAfter).toEqual(repsBefore);
  });

  it('locks mutually-exclusive choices via exclusiveGroup to prevent branch swapping on revisit', () => {
    const initial = tsConversationEngine.startNewGame();

    const atMaps = {
      ...initial,
      currentDialogue: dialogueTree['map-revelation'],
      rngSeed: 123456789,
    };

    const keepSecret = atMaps.currentDialogue!.choices.find(c => c.id === 'keep-secret');
    if (!keepSecret) throw new Error('Expected keep-secret choice');

    const afterKeep = tsConversationEngine.applyChoice(atMaps, keepSecret);
    expect(afterKeep.selectedChoiceIds).toContain('keep-secret');

    const revisitMaps = {
      ...afterKeep,
      currentDialogue: dialogueTree['map-revelation'],
    };

    const revealForgery = revisitMaps.currentDialogue!.choices.find(c => c.id === 'reveal-forgery');
    if (!revealForgery) throw new Error('Expected reveal-forgery choice');

    // Since keep-secret and reveal-forgery are mutually exclusive, the second path should be locked.
    expect(tsConversationEngine.applyChoice(revisitMaps, revealForgery)).toBe(revisitMaps);

    const atArchives = {
      ...initial,
      currentDialogue: dialogueTree['hall-archives'],
      rngSeed: 123456789,
    };

    const sellAccord = atArchives.currentDialogue!.choices.find(c => c.id === 'archives-renzo');
    if (!sellAccord) throw new Error('Expected archives-renzo choice');

    const afterSellAccord = tsConversationEngine.applyChoice(atArchives, sellAccord);
    expect(afterSellAccord.selectedChoiceIds).toContain('archives-renzo');

    const revisitArchives = {
      ...afterSellAccord,
      currentDialogue: dialogueTree['hall-archives'],
    };

    const showToAldric = revisitArchives.currentDialogue!.choices.find(c => c.id === 'archives-aldric');
    if (!showToAldric) throw new Error('Expected archives-aldric choice');

    expect(tsConversationEngine.applyChoice(revisitArchives, showToAldric)).toBe(revisitArchives);

    const atRenzoOffer = {
      ...initial,
      currentDialogue: dialogueTree['renzo-offer'],
      rngSeed: 123456789,
    };

    const refuse = atRenzoOffer.currentDialogue!.choices.find(c => c.id === 'offer-refuse');
    if (!refuse) throw new Error('Expected offer-refuse choice');

    const afterRefuse = tsConversationEngine.applyChoice(atRenzoOffer, refuse);
    expect(afterRefuse.selectedChoiceIds).toContain('offer-refuse');

    const revisitOffer = {
      ...afterRefuse,
      currentDialogue: dialogueTree['renzo-offer'],
    };

    const sign = revisitOffer.currentDialogue!.choices.find(c => c.id === 'offer-sign');
    if (!sign) throw new Error('Expected offer-sign choice');

    expect(tsConversationEngine.applyChoice(revisitOffer, sign)).toBe(revisitOffer);

    const atLedgerRequest = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-request'],
      rngSeed: 123456789,
    };

    const buy = atLedgerRequest.currentDialogue!.choices.find(c => c.id === 'ledger-buy');
    if (!buy) throw new Error('Expected ledger-buy choice');

    const afterBuy = tsConversationEngine.applyChoice(atLedgerRequest, buy);
    expect(afterBuy.selectedChoiceIds).toContain('ledger-buy');

    const revisitLedgerRequest = {
      ...afterBuy,
      currentDialogue: dialogueTree['renzo-ledger-request'],
    };

    const steal = revisitLedgerRequest.currentDialogue!.choices.find(c => c.id === 'ledger-steal');
    if (!steal) throw new Error('Expected ledger-steal choice');

    expect(tsConversationEngine.applyChoice(revisitLedgerRequest, steal)).toBe(revisitLedgerRequest);

    const atStolenLedger = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
      rngSeed: 123456789,
    };

    const sellBack = atStolenLedger.currentDialogue!.choices.find(c => c.id === 'stolen-sell');
    if (!sellBack) throw new Error('Expected stolen-sell choice');

    const afterSell = tsConversationEngine.applyChoice(atStolenLedger, sellBack);
    expect(afterSell.selectedChoiceIds).toContain('stolen-sell');

    const revisitStolenLedger = {
      ...afterSell,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
    };

    const takeToAldric = revisitStolenLedger.currentDialogue!.choices.find(c => c.id === 'stolen-to-aldric');
    if (!takeToAldric) throw new Error('Expected stolen-to-aldric choice');

    expect(tsConversationEngine.applyChoice(revisitStolenLedger, takeToAldric)).toBe(revisitStolenLedger);
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
