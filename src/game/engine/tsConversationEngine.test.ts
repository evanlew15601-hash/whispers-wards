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
    expect(afterTurn.log.some(l => l.startsWith('[WORLD] '))).toBe(true);

    const routes = Object.values(afterTurn.world.tradeRoutes);
    const openRoutes = routes.filter(r => r.status === 'open').length;
    const blockedRoutes = routes.filter(r => r.status !== 'open').length;
    const coinIncome = Math.max(0, 1 + openRoutes - blockedRoutes);
    expect(afterTurn.resources.coin).toBe(drained.resources.coin + coinIncome);
    expect(afterTurn.resources.influence).toBe(drained.resources.influence + 1);
    expect(afterTurn.resources.supplies).toBe(drained.resources.supplies + 1);
    expect(afterTurn.log.some(l => l.startsWith('[INC] Income: '))).toBe(true);
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

  it('can transition out of the game scene when a choice sets nextScene', () => {
    const initial = tsConversationEngine.startNewGame();

    const choice = {
      id: 'qa-exit-title',
      text: 'Exit to title',
      effects: [],
      nextNodeId: null,
      nextScene: 'title' as const,
    };

    const next = tsConversationEngine.applyChoice(initial, choice);

    expect(next.currentScene).toBe('title');
    expect(next.currentDialogue).toBeNull();
  });

  it('exits to title from the Act II end-of-demo node', () => {
    const initial = tsConversationEngine.startNewGame();

    const atDemoEnd = {
      ...initial,
      chapterId: 'chapter-2',
      currentDialogue: dialogueTree['act2-demo-end'],
    };

    const exit = atDemoEnd.currentDialogue!.choices.find(c => c.id === 'act2-demo-end-exit-title');
    if (!exit) throw new Error('Expected act2-demo-end-exit-title choice');

    const next = tsConversationEngine.applyChoice(atDemoEnd, exit);

    expect(next.currentScene).toBe('title');
    expect(next.currentDialogue).toBeNull();
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

    expect(afterChoice.log.some(l => l.startsWith('[EVT] '))).toBe(true);
    expect(afterChoice.log.some(l => l.startsWith('[INTEL] Secret learned: '))).toBe(true);
    expect(afterChoice.log.some(l => l.startsWith('[WORLD] '))).toBe(false);

    const afterTurn = tsConversationEngine.endTurn(afterChoice);
    expect(afterTurn.log.some(l => l.startsWith('[WORLD] '))).toBe(true);
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

  it('allows calling the Hall summit without requiring prior leverage (demo-friendly)', () => {
    const initial = tsConversationEngine.startNewGame();

    const atHub = {
      ...initial,
      currentDialogue: dialogueTree['concord-hub'],
      knownSecrets: [],
    };

    const summitIdx = atHub.currentDialogue!.choices.findIndex(c => c.id === 'hub-summit');
    expect(summitIdx).toBeGreaterThanOrEqual(0);

    const lockedFlags = tsConversationEngine.getChoiceLockedFlags(atHub);
    expect(lockedFlags?.[summitIdx]).toBe(false);
  });

  it('advances to chapter 2 after resolving the Greenmarch summit', () => {
    const initial = tsConversationEngine.startNewGame();

    const atEnding = {
      ...initial,
      currentDialogue: dialogueTree['ending-greenmarch-compact'],
      knownSecrets: [],
      chapterId: 'chapter-1',
      chapterTurn: 7,
    };

    const choice = atEnding.currentDialogue!.choices[0];
    const after = tsConversationEngine.applyChoice(atEnding, choice);

    expect(after.chapterId).toBe('chapter-2');
    expect(after.currentDialogue?.id).toBe('concord-hub-2');
    expect(after.log.some(l => l.includes('Chapter II'))).toBe(true);
  });

  it('lets the player complete the summit with no proof and transition into Chapter II', () => {
    const initial = tsConversationEngine.startNewGame();

    const atHub = {
      ...initial,
      currentDialogue: dialogueTree['concord-hub'],
      chapterId: 'chapter-1',
      chapterTurn: 3,
      knownSecrets: [],
    };

    const summitFromHub = atHub.currentDialogue!.choices.find(c => c.id === 'hub-summit');
    if (!summitFromHub) throw new Error('Expected hub-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(atHub, summitFromHub);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');

    const breakdown = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-breakdown');
    if (!breakdown) throw new Error('Expected summit-breakdown choice');

    const atEnding = tsConversationEngine.applyChoice(atSummit, breakdown);
    expect(atEnding.currentDialogue?.id).toBe('ending-summit-breakdown');

    const endChoice = atEnding.currentDialogue!.choices[0];
    const after = tsConversationEngine.applyChoice(atEnding, endChoice);

    expect(after.chapterId).toBe('chapter-2');
    expect(after.currentDialogue?.id).toBe('concord-hub-2');
  });

  it('locks proof-gated summit actions until evidence is discovered', () => {
    const initial = tsConversationEngine.startNewGame();

    const atSummit = {
      ...initial,
      currentDialogue: dialogueTree['summit-floor'],
      rngSeed: 123456789,
      factions: initial.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
      knownSecrets: [],
    };

    const exposeIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-expose-ledger');
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
    expect(next.currentDialogue?.id).toBe('ending-embers-fall-ledger');
  });

  it('carries proof-forward when going straight from Renzo\'s ledgers to the summit (bought copy)', () => {
    const initial = tsConversationEngine.startNewGame();

    const atBought = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-bought'],
      rngSeed: 123456789,
      factions: initial.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
      knownSecrets: [],
    };

    const toSummit = atBought.currentDialogue!.choices.find(c => c.id === 'bought-summit');
    if (!toSummit) throw new Error('Expected bought-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(atBought, toSummit);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');
    expect(atSummit.knownSecrets).toContain(
      'Renzo sold you a curated ledger copy; it still suggests payments aligned with the killings.'
    );

    const expose = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-expose-ledger');
    if (!expose) throw new Error('Expected summit-expose-ledger choice');

    const afterExpose = tsConversationEngine.applyChoice(atSummit, expose);
    expect(afterExpose.currentDialogue?.id).toBe('ending-embers-fall-ledger');
  });

  it('carries proof-forward when going straight from stolen ledger pages to the summit', () => {
    const initial = tsConversationEngine.startNewGame();

    const atStolen = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
      rngSeed: 123456789,
      factions: initial.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
      knownSecrets: [],
    };

    const toSummit = atStolen.currentDialogue!.choices.find(c => c.id === 'stolen-summit');
    if (!toSummit) throw new Error('Expected stolen-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(atStolen, toSummit);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');
    expect(atSummit.knownSecrets).toContain('Renzo\'s ledger pages show coded payments tied to the border killings.');

    const expose = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-expose-ledger');
    if (!expose) throw new Error('Expected summit-expose-ledger choice');

    const afterExpose = tsConversationEngine.applyChoice(atSummit, expose);
    expect(afterExpose.currentDialogue?.id).toBe('ending-embers-fall-ledger');
  });

  it('unlocks and follows up on the forged map proof path', () => {
    const initial = tsConversationEngine.startNewGame();

    const atMaps = {
      ...initial,
      currentDialogue: dialogueTree['map-revelation'],
      rngSeed: 123456789,
      knownSecrets: [],
    };

    const revealForgery = atMaps.currentDialogue!.choices.find(c => c.id === 'reveal-forgery');
    if (!revealForgery) throw new Error('Expected reveal-forgery choice');

    const afterReveal = tsConversationEngine.applyChoice(atMaps, revealForgery);
    expect(afterReveal.currentDialogue?.id).toBe('aldric-map-confront');
    expect(afterReveal.knownSecrets).toContain('The Ember Throne forged maps to manipulate the border dispute.');

    const toSummit = afterReveal.currentDialogue!.choices.find(c => c.id === 'map-call-summit');
    if (!toSummit) throw new Error('Expected map-call-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(afterReveal, toSummit);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');

    const expose = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-expose-maps');
    if (!expose) throw new Error('Expected summit-expose-maps choice');

    const afterExpose = tsConversationEngine.applyChoice(atSummit, expose);
    expect(afterExpose.currentDialogue?.id).toBe('ending-embers-fall-maps');
  });

  it('unlocks and follows up on the manifest/docket proof path', () => {
    const initial = tsConversationEngine.startNewGame();

    const atLedger = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-request'],
      rngSeed: 123456789,
      knownSecrets: [],
    };

    const toManifests = atLedger.currentDialogue!.choices.find(c => c.id === 'ledger-manifests');
    if (!toManifests) throw new Error('Expected ledger-manifests choice');

    const atManifests = tsConversationEngine.applyChoice(atLedger, toManifests);
    expect(atManifests.currentDialogue?.id).toBe('ember-manifest-check');

    const backToHub = atManifests.currentDialogue!.choices.find(c => c.id === 'manifest-back');
    if (!backToHub) throw new Error('Expected manifest-back choice');

    const afterProof = tsConversationEngine.applyChoice(atManifests, backToHub);
    expect(afterProof.currentDialogue?.id).toBe('concord-hub');
    expect(afterProof.knownSecrets).toContain(
      'Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.'
    );

    const withIronRep = {
      ...afterProof,
      factions: afterProof.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
    };

    const toSummit = withIronRep.currentDialogue!.choices.find(c => c.id === 'hub-summit');
    if (!toSummit) throw new Error('Expected hub-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(withIronRep, toSummit);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');

    const expose = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-expose-manifest');
    if (!expose) throw new Error('Expected summit-expose-manifest choice');

    const afterExpose = tsConversationEngine.applyChoice(atSummit, expose);
    expect(afterExpose.currentDialogue?.id).toBe('ending-embers-fall-manifest');
  });

  it('unlocks and follows up on the old accord proof path', () => {
    const initial = tsConversationEngine.startNewGame();

    const atArchives = {
      ...initial,
      currentDialogue: dialogueTree['hall-archives'],
      rngSeed: 123456789,
      knownSecrets: [],
    };

    const toSummit = atArchives.currentDialogue!.choices.find(c => c.id === 'archives-summit');
    if (!toSummit) throw new Error('Expected archives-summit choice');

    const atSummitGate = tsConversationEngine.applyChoice(atArchives, toSummit);
    expect(atSummitGate.currentDialogue?.id).toBe('summit-start');

    const enter = atSummitGate.currentDialogue!.choices.find(c => c.id === 'summit-enter');
    if (!enter) throw new Error('Expected summit-enter choice');

    const atSummit = tsConversationEngine.applyChoice(atSummitGate, enter);
    expect(atSummit.currentDialogue?.id).toBe('summit-floor');
    expect(atSummit.knownSecrets).toContain(
      'An old tripartite accord names Greenmarch Pass neutral hinge-ground and warns to keep the binding unbroken.'
    );

    const accord = atSummit.currentDialogue!.choices.find(c => c.id === 'summit-compact-accord');
    if (!accord) throw new Error('Expected summit-compact-accord choice');

    const afterAccord = tsConversationEngine.applyChoice(atSummit, accord);
    expect(afterAccord.currentDialogue?.id).toBe('ending-greenmarch-compact-accord');
  });

  it('lets proof unlock a character-to-character meeting followup (Thessaly → Aldric)', () => {
    const initial = tsConversationEngine.startNewGame();

    const withProof = {
      ...initial,
      currentDialogue: dialogueTree['thessaly-followup'],
      rngSeed: 123456789,
      knownSecrets: ['The Ember Throne forged maps to manipulate the border dispute.'],
    };

    const present = withProof.currentDialogue!.choices.find(c => c.id === 'followup-present-proof');
    if (!present) throw new Error('Expected followup-present-proof choice');

    const afterPresent = tsConversationEngine.applyChoice(withProof, present);
    expect(afterPresent.currentDialogue?.id).toBe('thessaly-meeting-arranged');

    const send = afterPresent.currentDialogue!.choices.find(c => c.id === 'thessaly-meeting-arranged-send');
    if (!send) throw new Error('Expected thessaly-meeting-arranged-send choice');

    const afterSend = tsConversationEngine.applyChoice(afterPresent, send);
    expect(afterSend.currentDialogue?.id).toBe('concord-hub');
    expect(afterSend.knownSecrets).toContain('Thessaly agreed to meet Aldric in private before the summit.');

    const atAldric = {
      ...afterSend,
      currentDialogue: dialogueTree['aldric-followup'],
    };

    const tellAldric = atAldric.currentDialogue!.choices.find(c => c.id === 'aldric-private-meeting');
    if (!tellAldric) throw new Error('Expected aldric-private-meeting choice');

    const afterTell = tsConversationEngine.applyChoice(atAldric, tellAldric);
    expect(afterTell.currentDialogue?.id).toBe('aldric-meeting-confirmed');

    const confirm = afterTell.currentDialogue!.choices.find(c => c.id === 'aldric-meeting-confirmed-back');
    if (!confirm) throw new Error('Expected aldric-meeting-confirmed-back choice');

    const afterConfirm = tsConversationEngine.applyChoice(afterTell, confirm);
    expect(afterConfirm.currentDialogue?.id).toBe('concord-hub');
    expect(afterConfirm.knownSecrets).toContain('Aldric agreed to the private meeting with Thessaly.');
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
      currentDialogue: dialogueTree['summit-floor'],
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
      currentDialogue: dialogueTree['summit-floor'],
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
