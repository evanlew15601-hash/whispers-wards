import { describe, expect, it, beforeAll } from 'vitest';

import { createUqmWasmConversationEngine } from './uqmWasmConversationEngine';
import { tsConversationEngine } from './tsConversationEngine';
import type { UqmWasmRuntime } from './uqmWasmRuntime';
import { loadUqmMinimalWasmExports } from '@/test/uqmWasmTestUtils';
import { dialogueTree } from '../data';
import { isChoiceLocked } from '../choiceLocks';
import { buildEncounterDialogueNode } from '../encounters';
import type { SecondaryEncounter } from '../types';
import type { GameEffect } from '../effects';

const repByFaction = (state: { factions: { id: string; reputation: number }[] }) => {
  return Object.fromEntries(state.factions.map(f => [f.id, f.reputation] as const));
};

const triggeredEventIds = (state: { events: { id: string; triggered: boolean }[] }) => {
  return state.events.filter(e => e.triggered).map(e => e.id).sort();
};

const sortedSet = (values: string[]) => [...new Set(values)].sort();

const expectParity = (tsState: any, wasmState: any) => {
  expect(wasmState.currentDialogue?.id).toBe(tsState.currentDialogue?.id);
  expect(repByFaction(wasmState)).toEqual(repByFaction(tsState));
  expect(sortedSet(wasmState.knownSecrets)).toEqual(sortedSet(tsState.knownSecrets));
  expect(sortedSet(wasmState.selectedChoiceIds)).toEqual(sortedSet(tsState.selectedChoiceIds));
  expect(triggeredEventIds(wasmState)).toEqual(triggeredEventIds(tsState));

  const tsEncounterId = tsState.pendingEncounter?.id ?? null;
  const wasmEncounterId = wasmState.pendingEncounter?.id ?? null;
  expect(wasmEncounterId).toBe(tsEncounterId);

  expect(wasmState.resources).toEqual(tsState.resources);
  expect(sortedSet(wasmState.milestones)).toEqual(sortedSet(tsState.milestones));
};

function makeRuntime(exports: Awaited<ReturnType<typeof loadUqmMinimalWasmExports>>): UqmWasmRuntime {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return {
    exports,
    getVersionString() {
      const ptr = exports.uqm_version_ptr();
      const len = exports.uqm_version_len();
      return decoder.decode(new Uint8Array(exports.memory.buffer, ptr, len));
    },
    lineFitChars(text, maxWidth) {
      const bytes = encoder.encode(text);
      const ptr = exports.uqm_alloc(bytes.length + 1);
      const mem = new Uint8Array(exports.memory.buffer, ptr, bytes.length + 1);
      mem.set(bytes);
      mem[bytes.length] = 0;
      return exports.uqm_line_fit_chars(ptr, maxWidth);
    },
  };
}

describe('uqmWasmConversationEngine', () => {
  let uqmRuntime: UqmWasmRuntime;

  beforeAll(async () => {
    const exports = await loadUqmMinimalWasmExports();
    uqmRuntime = makeRuntime(exports);
  }, 60_000);

  it('produces same state transitions as tsConversationEngine for basic choices', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();
    const seeded = { ...start, rngSeed: 123456789 };

    const choice0 = seeded.currentDialogue!.choices[0];

    const nextTs = tsConversationEngine.applyChoice(seeded, choice0);
    const nextWasm = wasmEngine.applyChoice(seeded, choice0);

    expect(nextWasm.currentDialogue?.id).toBe(nextTs.currentDialogue?.id);
    expect(nextWasm.turnNumber).toBe(nextTs.turnNumber);
    expect(nextWasm.rngSeed).toBe(nextTs.rngSeed);
    expect(nextWasm.world).toEqual(nextTs.world);

    // Compare reputations.
    const repTs = Object.fromEntries(nextTs.factions.map(f => [f.id, f.reputation] as const));
    const repWasm = Object.fromEntries(nextWasm.factions.map(f => [f.id, f.reputation] as const));
    expect(repWasm).toEqual(repTs);

    expect(nextWasm.knownSecrets).toEqual(nextTs.knownSecrets);

    // Do another step to ensure graph indices stay consistent.
    const followChoice = nextTs.currentDialogue?.choices?.[0];
    if (!followChoice) throw new Error('Expected a follow-up choice');

    const nextTs2 = tsConversationEngine.applyChoice(nextTs, followChoice);
    const nextWasm2 = wasmEngine.applyChoice(nextWasm, followChoice);

    expect(nextWasm2.currentDialogue?.id).toBe(nextTs2.currentDialogue?.id);
    expect(nextWasm2.turnNumber).toBe(nextTs2.turnNumber);

    const repTs2 = Object.fromEntries(nextTs2.factions.map(f => [f.id, f.reputation] as const));
    const repWasm2 = Object.fromEntries(nextWasm2.factions.map(f => [f.id, f.reputation] as const));
    expect(repWasm2).toEqual(repTs2);

    expect(nextWasm2.knownSecrets).toEqual(nextTs2.knownSecrets);
    expect(nextWasm2.world).toEqual(nextTs2.world);
    expect(nextWasm2.rngSeed).toBe(nextTs2.rngSeed);
  });

  it('matches tsConversationEngine lock bypass when knownSecrets includes override', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();
    const seeded = {
      ...start,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
    };

    const lockedChoice = seeded.currentDialogue!.choices.find(c => c.id === 'summit-iron');
    if (!lockedChoice) throw new Error('Expected summit-iron choice');

    const nextTsLocked = tsConversationEngine.applyChoice(seeded, lockedChoice);
    const nextWasmLocked = wasmEngine.applyChoice(seeded, lockedChoice);

    expect(nextTsLocked).toBe(seeded);
    expect(nextWasmLocked).toBe(seeded);

    const withOverride = { ...seeded, knownSecrets: ['override'] };

    const nextTsOverride = tsConversationEngine.applyChoice(withOverride, lockedChoice);
    const nextWasmOverride = wasmEngine.applyChoice(withOverride, lockedChoice);

    expect(nextTsOverride.currentDialogue?.id).toBe('ending-iron-march');
    expect(nextWasmOverride.currentDialogue?.id).toBe('ending-iron-march');

    expect(nextWasmOverride.turnNumber).toBe(nextTsOverride.turnNumber);
    expect(nextWasmOverride.rngSeed).toBe(nextTsOverride.rngSeed);
    expect(nextWasmOverride.world).toEqual(nextTsOverride.world);

    const repTs = Object.fromEntries(nextTsOverride.factions.map(f => [f.id, f.reputation] as const));
    const repWasm = Object.fromEntries(nextWasmOverride.factions.map(f => [f.id, f.reputation] as const));
    expect(repWasm).toEqual(repTs);

    expect(nextWasmOverride.knownSecrets).toEqual(nextTsOverride.knownSecrets);
  });

  it('matches tsConversationEngine transitions through new investigative nodes', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();
    const seeded = { ...start, rngSeed: 123456789 };

    // Jump to a node where we added a new investigative option.
    const atFollowup = {
      ...seeded,
      currentDialogue: dialogueTree['aldric-followup'],
    };

    const auditChoice = atFollowup.currentDialogue!.choices.find(c => c.id === 'aldric-dispatches');
    if (!auditChoice) throw new Error('Expected aldric-dispatches choice');

    const nextTs = tsConversationEngine.applyChoice(atFollowup, auditChoice);
    const nextWasm = wasmEngine.applyChoice(atFollowup, auditChoice);

    expect(nextWasm.currentDialogue?.id).toBe(nextTs.currentDialogue?.id);
    expect(nextWasm.turnNumber).toBe(nextTs.turnNumber);
    expect(nextWasm.rngSeed).toBe(nextTs.rngSeed);
    expect(nextWasm.world).toEqual(nextTs.world);

    const repTs = Object.fromEntries(nextTs.factions.map(f => [f.id, f.reputation] as const));
    const repWasm = Object.fromEntries(nextWasm.factions.map(f => [f.id, f.reputation] as const));
    expect(repWasm).toEqual(repTs);

    expect(nextWasm.knownSecrets).toEqual(nextTs.knownSecrets);

    const backChoice = nextTs.currentDialogue?.choices?.find(c => c.id === 'dispatch-back');
    if (!backChoice) throw new Error('Expected dispatch-back choice');

    const nextTs2 = tsConversationEngine.applyChoice(nextTs, backChoice);
    const nextWasm2 = wasmEngine.applyChoice(nextWasm, backChoice);

    expect(nextWasm2.currentDialogue?.id).toBe(nextTs2.currentDialogue?.id);
    expect(nextWasm2.turnNumber).toBe(nextTs2.turnNumber);
    expect(nextWasm2.rngSeed).toBe(nextTs2.rngSeed);
    expect(nextWasm2.world).toEqual(nextTs2.world);

    const repTs2 = Object.fromEntries(nextTs2.factions.map(f => [f.id, f.reputation] as const));
    const repWasm2 = Object.fromEntries(nextWasm2.factions.map(f => [f.id, f.reputation] as const));
    expect(repWasm2).toEqual(repTs2);

    expect(nextWasm2.knownSecrets).toEqual(nextTs2.knownSecrets);

    // Secret learning is now derived from the WASM secrets mask; ensure the log reflects that too.
    const learnedInTs = nextTs.log.filter(l => l.startsWith('🔍 Secret learned: '));
    const learnedInWasm = nextWasm.log.filter(l => l.startsWith('🔍 Secret learned: '));
    expect(learnedInWasm).toEqual(learnedInTs);
  });

  it('locks proof-gated summit actions until evidence is discovered', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();

    const atSummit = {
      ...start,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
      factions: start.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
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

    const lockedFlags = wasmEngine.getChoiceLockedFlags?.(atSummit);
    expect(lockedFlags?.[ledgerIdx]).toBe(true);
    expect(lockedFlags?.[manifestIdx]).toBe(true);
    expect(lockedFlags?.[mapsIdx]).toBe(true);

    expect(tsConversationEngine.applyChoice(atSummit, ledgerChoice)).toBe(atSummit);
    expect(wasmEngine.applyChoice(atSummit, ledgerChoice)).toBe(atSummit);

    const withLedgerProof = {
      ...atSummit,
      knownSecrets: ['Renzo\'s ledger pages show coded payments tied to the border killings.'],
    };

    const unlockedLedger = wasmEngine.getChoiceLockedFlags?.(withLedgerProof);
    expect(unlockedLedger?.[ledgerIdx]).toBe(false);
    expect(unlockedLedger?.[manifestIdx]).toBe(true);
    expect(unlockedLedger?.[mapsIdx]).toBe(true);

    const nextLedgerTs = tsConversationEngine.applyChoice(withLedgerProof, ledgerChoice);
    const nextLedgerWasm = wasmEngine.applyChoice(withLedgerProof, ledgerChoice);
    expectParity(nextLedgerTs, nextLedgerWasm);
    expect(nextLedgerWasm.currentDialogue?.id).toBe('ending-embers-fall-ledger');

    const withManifestProof = {
      ...atSummit,
      knownSecrets: ['Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.'],
    };

    const unlockedManifest = wasmEngine.getChoiceLockedFlags?.(withManifestProof);
    expect(unlockedManifest?.[ledgerIdx]).toBe(true);
    expect(unlockedManifest?.[manifestIdx]).toBe(false);
    expect(unlockedManifest?.[mapsIdx]).toBe(true);

    const nextManifestTs = tsConversationEngine.applyChoice(withManifestProof, manifestChoice);
    const nextManifestWasm = wasmEngine.applyChoice(withManifestProof, manifestChoice);
    expectParity(nextManifestTs, nextManifestWasm);
    expect(nextManifestWasm.currentDialogue?.id).toBe('ending-embers-fall-manifest');

    const withMapsProof = {
      ...atSummit,
      knownSecrets: ['The Ember Throne forged maps to manipulate the border dispute.'],
    };

    const unlockedMaps = wasmEngine.getChoiceLockedFlags?.(withMapsProof);
    expect(unlockedMaps?.[ledgerIdx]).toBe(true);
    expect(unlockedMaps?.[manifestIdx]).toBe(true);
    expect(unlockedMaps?.[mapsIdx]).toBe(false);

    const nextMapsTs = tsConversationEngine.applyChoice(withMapsProof, mapsChoice);
    const nextMapsWasm = wasmEngine.applyChoice(withMapsProof, mapsChoice);
    expectParity(nextMapsTs, nextMapsWasm);
    expect(nextMapsWasm.currentDialogue?.id).toBe('ending-embers-fall-maps');

    const withMultipleProofs = {
      ...atSummit,
      knownSecrets: [
        'Renzo\'s ledger pages show coded payments tied to the border killings.',
        'Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.',
        'The Ember Throne forged maps to manipulate the border dispute.',
      ],
    };

    const unlockedMultiple = wasmEngine.getChoiceLockedFlags?.(withMultipleProofs);
    expect(unlockedMultiple?.[ledgerIdx]).toBe(false);
    expect(unlockedMultiple?.[manifestIdx]).toBe(false);
    expect(unlockedMultiple?.[mapsIdx]).toBe(false);
  });

  it('keeps lock behavior aligned (UI/TS helper vs engine execution) for summit choices', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();
    const base = {
      ...start,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
      factions: start.factions.map(f => ({ ...f, reputation: 0 })),
    };

    expect(wasmEngine.getChoiceLockedFlags?.(base)).toEqual(tsConversationEngine.getChoiceLockedFlags?.(base));
    expect(wasmEngine.getChoiceUiHints?.(base)).toEqual(tsConversationEngine.getChoiceUiHints?.(base));

    for (const choice of base.currentDialogue!.choices) {
      const helperLocked = isChoiceLocked(choice, base.factions, base.knownSecrets, base.selectedChoiceIds);
      const nextTs = tsConversationEngine.applyChoice(base, choice);
      const nextWasm = wasmEngine.applyChoice(base, choice);

      if (helperLocked) {
        expect(nextTs).toBe(base);
        expect(nextWasm).toBe(base);
      } else {
        expect(nextTs).not.toBe(base);
        expect(nextWasm).not.toBe(base);
      }
    }

    const withOverride = { ...base, knownSecrets: ['override'] };
    const lockedChoice = withOverride.currentDialogue!.choices.find(c => c.requiredReputation);
    if (!lockedChoice) throw new Error('Expected a reputation-locked choice');

    expect(isChoiceLocked(lockedChoice, withOverride.factions, withOverride.knownSecrets, withOverride.selectedChoiceIds)).toBe(false);
    expect(wasmEngine.getChoiceLockedFlags?.(withOverride)).toEqual(withOverride.currentDialogue!.choices.map(() => false));

    const nextTs = tsConversationEngine.applyChoice(withOverride, lockedChoice);
    const nextWasm = wasmEngine.applyChoice(withOverride, lockedChoice);

    expect(nextTs).not.toBe(withOverride);
    expect(nextWasm).not.toBe(withOverride);
    expect(nextWasm.currentDialogue?.id).toBe(nextTs.currentDialogue?.id);

    // Already-decided choices should stay selectable even if later reputation would lock them.
    const emberIdx = base.currentDialogue!.choices.findIndex(c => c.id === 'summit-ember');
    expect(emberIdx).toBeGreaterThanOrEqual(0);

    const emberChoice = base.currentDialogue!.choices[emberIdx];

    const revisitWithLowRep = {
      ...base,
      factions: base.factions.map(f => (f.id === 'ember-throne' ? { ...f, reputation: 0 } : f)),
      selectedChoiceIds: [...base.selectedChoiceIds, emberChoice.id],
    };

    expect(wasmEngine.getChoiceLockedFlags?.(revisitWithLowRep)).toEqual(tsConversationEngine.getChoiceLockedFlags?.(revisitWithLowRep));
    expect(wasmEngine.getChoiceUiHints?.(revisitWithLowRep)).toEqual(tsConversationEngine.getChoiceUiHints?.(revisitWithLowRep));

    const revisitHints = wasmEngine.getChoiceUiHints?.(revisitWithLowRep);
    expect(revisitHints?.[emberIdx]?.alreadyDecided).toBe(true);
    expect(revisitHints?.[emberIdx]?.locked).toBe(false);
  });

  it('locks mutually-exclusive choices via exclusiveGroup to prevent branch swapping on revisit', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const initial = tsConversationEngine.startNewGame();

    const atMaps = {
      ...initial,
      currentDialogue: dialogueTree['map-revelation'],
      rngSeed: 123456789,
    };

    const keepSecret = atMaps.currentDialogue!.choices.find(c => c.id === 'keep-secret');
    if (!keepSecret) throw new Error('Expected keep-secret choice');

    const afterKeepTs = tsConversationEngine.applyChoice(atMaps, keepSecret);
    const afterKeepWasm = wasmEngine.applyChoice(atMaps, keepSecret);
    expectParity(afterKeepTs, afterKeepWasm);
    expect(afterKeepWasm.selectedChoiceIds).toContain('keep-secret');

    const revisitMapsTs = {
      ...afterKeepTs,
      currentDialogue: dialogueTree['map-revelation'],
    };

    const revisitMapsWasm = {
      ...afterKeepWasm,
      currentDialogue: dialogueTree['map-revelation'],
    };

    const revealForgery = revisitMapsWasm.currentDialogue!.choices.find(c => c.id === 'reveal-forgery');
    if (!revealForgery) throw new Error('Expected reveal-forgery choice');

    expect(tsConversationEngine.applyChoice(revisitMapsTs, revealForgery)).toBe(revisitMapsTs);
    expect(wasmEngine.applyChoice(revisitMapsWasm, revealForgery)).toBe(revisitMapsWasm);

    const atArchives = {
      ...initial,
      currentDialogue: dialogueTree['hall-archives'],
      rngSeed: 123456789,
    };

    const sellAccord = atArchives.currentDialogue!.choices.find(c => c.id === 'archives-renzo');
    if (!sellAccord) throw new Error('Expected archives-renzo choice');

    const afterSellAccordTs = tsConversationEngine.applyChoice(atArchives, sellAccord);
    const afterSellAccordWasm = wasmEngine.applyChoice(atArchives, sellAccord);
    expectParity(afterSellAccordTs, afterSellAccordWasm);
    expect(afterSellAccordWasm.selectedChoiceIds).toContain('archives-renzo');

    const revisitArchivesTs = {
      ...afterSellAccordTs,
      currentDialogue: dialogueTree['hall-archives'],
    };

    const revisitArchivesWasm = {
      ...afterSellAccordWasm,
      currentDialogue: dialogueTree['hall-archives'],
    };

    const showToAldric = revisitArchivesWasm.currentDialogue!.choices.find(c => c.id === 'archives-aldric');
    if (!showToAldric) throw new Error('Expected archives-aldric choice');

    expect(tsConversationEngine.applyChoice(revisitArchivesTs, showToAldric)).toBe(revisitArchivesTs);
    expect(wasmEngine.applyChoice(revisitArchivesWasm, showToAldric)).toBe(revisitArchivesWasm);

    const atRenzoOffer = {
      ...initial,
      currentDialogue: dialogueTree['renzo-offer'],
      rngSeed: 123456789,
    };

    const refuse = atRenzoOffer.currentDialogue!.choices.find(c => c.id === 'offer-refuse');
    if (!refuse) throw new Error('Expected offer-refuse choice');

    const afterRefuseTs = tsConversationEngine.applyChoice(atRenzoOffer, refuse);
    const afterRefuseWasm = wasmEngine.applyChoice(atRenzoOffer, refuse);
    expectParity(afterRefuseTs, afterRefuseWasm);
    expect(afterRefuseWasm.selectedChoiceIds).toContain('offer-refuse');

    const revisitOfferTs = {
      ...afterRefuseTs,
      currentDialogue: dialogueTree['renzo-offer'],
    };

    const revisitOfferWasm = {
      ...afterRefuseWasm,
      currentDialogue: dialogueTree['renzo-offer'],
    };

    const sign = revisitOfferWasm.currentDialogue!.choices.find(c => c.id === 'offer-sign');
    if (!sign) throw new Error('Expected offer-sign choice');

    expect(tsConversationEngine.applyChoice(revisitOfferTs, sign)).toBe(revisitOfferTs);
    expect(wasmEngine.applyChoice(revisitOfferWasm, sign)).toBe(revisitOfferWasm);

    const atLedgerRequest = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-request'],
      rngSeed: 123456789,
    };

    const buy = atLedgerRequest.currentDialogue!.choices.find(c => c.id === 'ledger-buy');
    if (!buy) throw new Error('Expected ledger-buy choice');

    const afterBuyTs = tsConversationEngine.applyChoice(atLedgerRequest, buy);
    const afterBuyWasm = wasmEngine.applyChoice(atLedgerRequest, buy);
    expectParity(afterBuyTs, afterBuyWasm);
    expect(afterBuyWasm.selectedChoiceIds).toContain('ledger-buy');

    const revisitLedgerRequestTs = {
      ...afterBuyTs,
      currentDialogue: dialogueTree['renzo-ledger-request'],
    };

    const revisitLedgerRequestWasm = {
      ...afterBuyWasm,
      currentDialogue: dialogueTree['renzo-ledger-request'],
    };

    const steal = revisitLedgerRequestWasm.currentDialogue!.choices.find(c => c.id === 'ledger-steal');
    if (!steal) throw new Error('Expected ledger-steal choice');

    expect(tsConversationEngine.applyChoice(revisitLedgerRequestTs, steal)).toBe(revisitLedgerRequestTs);
    expect(wasmEngine.applyChoice(revisitLedgerRequestWasm, steal)).toBe(revisitLedgerRequestWasm);

    const atStolenLedger = {
      ...initial,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
      rngSeed: 123456789,
    };

    const sellBack = atStolenLedger.currentDialogue!.choices.find(c => c.id === 'stolen-sell');
    if (!sellBack) throw new Error('Expected stolen-sell choice');

    const afterSellTs = tsConversationEngine.applyChoice(atStolenLedger, sellBack);
    const afterSellWasm = wasmEngine.applyChoice(atStolenLedger, sellBack);
    expectParity(afterSellTs, afterSellWasm);
    expect(afterSellWasm.selectedChoiceIds).toContain('stolen-sell');

    const revisitStolenLedgerTs = {
      ...afterSellTs,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
    };

    const revisitStolenLedgerWasm = {
      ...afterSellWasm,
      currentDialogue: dialogueTree['renzo-ledger-stolen'],
    };

    const takeToAldric = revisitStolenLedgerWasm.currentDialogue!.choices.find(c => c.id === 'stolen-to-aldric');
    if (!takeToAldric) throw new Error('Expected stolen-to-aldric choice');

    expect(tsConversationEngine.applyChoice(revisitStolenLedgerTs, takeToAldric)).toBe(revisitStolenLedgerTs);
    expect(wasmEngine.applyChoice(revisitStolenLedgerWasm, takeToAldric)).toBe(revisitStolenLedgerWasm);
  });

  it('keeps choice history after resolving an encounter (summit-adjourn effects are not re-applied)', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();
    const atSummit = {
      ...start,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
    };

    const adjournIdx = atSummit.currentDialogue!.choices.findIndex(c => c.id === 'summit-adjourn');
    expect(adjournIdx).toBeGreaterThanOrEqual(0);

    const adjourn = atSummit.currentDialogue!.choices[adjournIdx];
    const afterAdjourn = wasmEngine.applyChoice(atSummit, adjourn);
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
    const afterEncounter = wasmEngine.applyChoice(inEncounter, resolveChoice);

    const revisitSummit = {
      ...afterEncounter,
      currentDialogue: dialogueTree['summit-start'],
    };

    expect(revisitSummit.selectedChoiceIds).toContain('summit-adjourn');

    const repeatAdjourn = revisitSummit.currentDialogue!.choices.find(c => c.id === 'summit-adjourn');
    if (!repeatAdjourn) throw new Error('Expected summit-adjourn choice on revisit');

    const repsBefore = Object.fromEntries(revisitSummit.factions.map(f => [f.id, f.reputation] as const));

    const afterRepeat = wasmEngine.applyChoice(revisitSummit, repeatAdjourn);

    const repsAfter = Object.fromEntries(afterRepeat.factions.map(f => [f.id, f.reputation] as const));
    expect(repsAfter).toEqual(repsBefore);
  });

  it('maintains parity across summit conclusion variants (proof-backed vs generic)', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();

    const baseSummit = {
      ...start,
      currentDialogue: dialogueTree['summit-start'],
      rngSeed: 123456789,
      factions: start.factions.map(f => (f.id === 'iron-pact' ? { ...f, reputation: 5 } : f)),
    };

    const accordSummit = {
      ...baseSummit,
      knownSecrets: ['The archives confirm Greenmarch Pass was once neutral ground under a tripartite accord.'],
    };

    const accordChoice = accordSummit.currentDialogue!.choices.find(c => c.id === 'summit-compact-accord');
    if (!accordChoice) throw new Error('Expected summit-compact-accord choice');

    expect(isChoiceLocked(accordChoice, accordSummit.factions, accordSummit.knownSecrets, accordSummit.selectedChoiceIds)).toBe(false);

    const nextTsAccord = tsConversationEngine.applyChoice(accordSummit, accordChoice);
    const nextWasmAccord = wasmEngine.applyChoice(accordSummit, accordChoice);

    expectParity(nextTsAccord, nextWasmAccord);

    const genericChoice = baseSummit.currentDialogue!.choices.find(c => c.id === 'summit-compact');
    if (!genericChoice) throw new Error('Expected summit-compact choice');

    const nextTsGeneric = tsConversationEngine.applyChoice(baseSummit, genericChoice);
    const nextWasmGeneric = wasmEngine.applyChoice(baseSummit, genericChoice);

    expectParity(nextTsGeneric, nextWasmGeneric);
  });

  it('falls back to TS when a choice includes generalized gameEffects (parity)', () => {
    const wasmEngine = createUqmWasmConversationEngine(uqmRuntime);

    const start = tsConversationEngine.startNewGame();

    const node = dialogueTree['aldric-followup'];
    const original = node.choices.find(c => c.id === 'aldric-dispatches');
    if (!original) throw new Error('Expected aldric-dispatches choice');

    const gameEffects: GameEffect[] = [{ kind: 'resource', resourceId: 'intel', delta: 2 }];

    const injected = {
      ...original,
      gameEffects,
    };

    const injectedNode = {
      ...node,
      choices: node.choices.map(c => (c.id === injected.id ? injected : c)),
    };

    const state = {
      ...start,
      rngSeed: 123456789,
      currentDialogue: injectedNode,
    };

    const nextTs = tsConversationEngine.applyChoice(state, injected);
    const nextWasm = wasmEngine.applyChoice(state, injected);

    expectParity(nextTs, nextWasm);
    expect(nextTs.resources.intel).toBe(2);
  });

  it('suppresses generalized effects on revisit using choice history (no resource farming)', () => {
    const initial = tsConversationEngine.startNewGame();

    const node = dialogueTree['aldric-followup'];
    const original = node.choices.find(c => c.id === 'aldric-dispatches');
    if (!original) throw new Error('Expected aldric-dispatches choice');

    const injected = {
      ...original,
      gameEffects: [{ kind: 'resource', resourceId: 'intel', delta: 2 } satisfies GameEffect],
    };

    const injectedNode = {
      ...node,
      choices: node.choices.map(c => (c.id === injected.id ? injected : c)),
    };

    const state = {
      ...initial,
      currentDialogue: injectedNode,
    };

    const afterFirst = tsConversationEngine.applyChoice(state, injected);
    expect(afterFirst.resources.intel).toBe(2);

    const revisit = {
      ...afterFirst,
      currentDialogue: injectedNode,
    };

    const afterSecond = tsConversationEngine.applyChoice(revisit, injected);
    expect(afterSecond.resources.intel).toBe(2);
  });
});
