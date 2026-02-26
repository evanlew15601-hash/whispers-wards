import type { ConversationEngine } from './conversationEngine';
import type { DialogueChoice, GameState } from '../types';

import { dialogueTree } from '../data';
import { applyExpiredEncounterConsequence } from '../encounters';
import { simulateWorldTurn } from '../simulation';
import { createTsConversationEngine, MAX_PENDING_ENCOUNTERS, tsConversationEngine } from './tsConversationEngine';
import type { UqmWasmRuntime } from './uqmWasmRuntime';
import { choiceUsedSecret, getDialogueChoiceLock, getDialogueChoiceSecretsToAdd } from './dialogueChoiceLocks';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function factionIndex(factionId: string): number {
  if (factionId === 'iron-pact') return 0;
  if (factionId === 'verdant-court') return 1;
  if (factionId === 'ember-throne') return 2;
  return -1;
}

type CompiledGraph = {
  nodeIds: string[];
  nodeIdToIndex: Map<string, number>;
  secretToBit: Map<string, number>;
};

const CHOICE_META_SIZE = 30;

function compileGraph(tree: typeof dialogueTree): CompiledGraph {
  const nodeIds = Object.keys(tree).sort();
  const nodeIdToIndex = new Map<string, number>(nodeIds.map((id, idx) => [id, idx]));

  // The wasm conversation core uses a 32-bit secrets mask. We prioritize secrets
  // that affect locking semantics (requires/forbids/once) so they are less likely
  // to be dropped if the narrative contains many secrets.
  const lockRelevantSecrets = new Set<string>();
  const revealSecrets = new Set<string>();

  for (const nodeId of nodeIds) {
    for (const c of tree[nodeId].choices) {
      if (c.requiresInfo) lockRelevantSecrets.add(c.requiresInfo);
      if (c.forbidsInfo) lockRelevantSecrets.add(c.forbidsInfo);
      if (c.once) lockRelevantSecrets.add(choiceUsedSecret(c.id));
      if (c.revealsInfo) revealSecrets.add(c.revealsInfo);
    }
  }

  const secretsSorted = [...lockRelevantSecrets].sort();
  for (const s of [...revealSecrets].sort()) {
    if (!lockRelevantSecrets.has(s)) secretsSorted.push(s);
  }

  const secretsForWasm = secretsSorted.slice(0, 32);
  const secretToBit = new Map<string, number>(secretsForWasm.map((s, i) => [s, i]));

  return { nodeIds, nodeIdToIndex, secretToBit };
}

function writeGraphToWasm(uqm: UqmWasmRuntime, graph: CompiledGraph, tree: typeof dialogueTree) {
  const { exports } = uqm;

  const nodeCount = graph.nodeIds.length;
  const nodesSize = 8 + nodeCount * 8;

  let totalChoices = 0;
  for (const id of graph.nodeIds) totalChoices += tree[id].choices.length;
  const choicesSize = totalChoices * CHOICE_META_SIZE;

  const nodesPtr = exports.uqm_alloc(nodesSize);
  const choicesPtr = exports.uqm_alloc(choicesSize);

  const mem = new DataView(exports.memory.buffer);

  mem.setUint32(nodesPtr + 0, nodeCount, true);
  mem.setUint32(nodesPtr + 4, totalChoices, true);

  let choiceCursor = 0;

  for (let nodeIdx = 0; nodeIdx < graph.nodeIds.length; nodeIdx++) {
    const node = tree[graph.nodeIds[nodeIdx]];

    // NodeMeta { u32 firstChoice; u32 choiceCount }
    mem.setUint32(nodesPtr + 8 + nodeIdx * 8 + 0, choiceCursor, true);
    mem.setUint32(nodesPtr + 8 + nodeIdx * 8 + 4, node.choices.length, true);

    for (const choice of node.choices) {
      const base = choicesPtr + choiceCursor * CHOICE_META_SIZE;

      const nextIdx = choice.nextNodeId ? (graph.nodeIdToIndex.get(choice.nextNodeId) ?? -1) : -1;
      mem.setInt32(base + 0, nextIdx, true);

      // Match TS engine semantics: apply at most one effect per faction (first match).
      const d0 = choice.effects.find(e => e.factionId === 'iron-pact')?.reputationChange ?? 0;
      const d1 = choice.effects.find(e => e.factionId === 'verdant-court')?.reputationChange ?? 0;
      const d2 = choice.effects.find(e => e.factionId === 'ember-throne')?.reputationChange ?? 0;

      const d0s = clamp(d0, -32768, 32767);
      const d1s = clamp(d1, -32768, 32767);
      const d2s = clamp(d2, -32768, 32767);

      mem.setInt16(base + 4, d0s, true);
      mem.setInt16(base + 6, d1s, true);
      mem.setInt16(base + 8, d2s, true);

      const req = choice.requiredReputation;
      let reqFaction = -1;
      let reqMin = 0;
      if (req) {
        reqFaction = factionIndex(req.factionId);
        if (reqFaction < 0) reqFaction = 3; // unknown => always locked
        reqMin = req.min;
      }

      mem.setInt16(base + 10, reqFaction, true);
      mem.setInt16(base + 12, reqMin, true);

      let revealMask = 0;
      if (choice.revealsInfo) {
        const bit = graph.secretToBit.get(choice.revealsInfo);
        if (bit !== undefined) revealMask = 1 << bit;
      }
      mem.setUint32(base + 14, revealMask >>> 0, true);

      let requiresMask = 0;
      if (choice.requiresInfo) {
        const bit = graph.secretToBit.get(choice.requiresInfo);
        if (bit !== undefined) requiresMask = 1 << bit;
      }
      mem.setUint32(base + 18, requiresMask >>> 0, true);

      let forbidsMask = 0;
      if (choice.forbidsInfo) {
        const bit = graph.secretToBit.get(choice.forbidsInfo);
        if (bit !== undefined) forbidsMask = 1 << bit;
      }
      mem.setUint32(base + 22, forbidsMask >>> 0, true);

      let usedMask = 0;
      if (choice.once) {
        const bit = graph.secretToBit.get(choiceUsedSecret(choice.id));
        if (bit !== undefined) usedMask = 1 << bit;
      }
      mem.setUint32(base + 26, usedMask >>> 0, true);

      choiceCursor++;
    }
  }

  exports.uqm_conv_set_graph(nodesPtr, choicesPtr);
}

function secretsMaskFromKnown(knownSecrets: string[], secretToBit: Map<string, number>): number {
  let mask = 0;
  for (const s of knownSecrets) {
    const bit = secretToBit.get(s);
    if (bit !== undefined) mask |= 1 << bit;
  }
  return mask >>> 0;
}

function presentDialogueNodeForWasmResponsePool(
  state: GameState,
  uqm: UqmWasmRuntime,
  graph: CompiledGraph,
  tree: typeof dialogueTree,
): GameState {
  if (!state.currentDialogue) return state;

  const baseNode = tree[state.currentDialogue.id];
  if (!baseNode) return state;

  // Escape hatch used by tests/dev tooling: show the canonical node (including locked choices).
  if (state.knownSecrets.includes('override')) {
    if (state.currentDialogue === baseNode) return state;
    return {
      ...state,
      currentDialogue: baseNode,
    };
  }

  const nodeIdx = graph.nodeIdToIndex.get(baseNode.id);
  if (nodeIdx === undefined) return state;

  const rep0 = state.factions.find(f => f.id === 'iron-pact')?.reputation ?? 0;
  const rep1 = state.factions.find(f => f.id === 'verdant-court')?.reputation ?? 0;
  const rep2 = state.factions.find(f => f.id === 'ember-throne')?.reputation ?? 0;

  const secrets = secretsMaskFromKnown(state.knownSecrets, graph.secretToBit);

  const exp = uqm.exports;
  exp.uqm_conv_reset(nodeIdx, rep0, rep1, rep2, secrets);

  const visibleCount = exp.uqm_conv_get_available_choice_count();
  if (visibleCount <= 0) return state;

  const visibleLocalIndices: number[] = [];
  for (let i = 0; i < visibleCount; i++) {
    const localIdx = exp.uqm_conv_get_available_choice_local_index(i);
    if (localIdx < 0 || localIdx >= baseNode.choices.length) continue;
    visibleLocalIndices.push(localIdx);
  }

  if (visibleLocalIndices.length <= 0) return state;

  const visibleChoices = visibleLocalIndices.map(i => baseNode.choices[i]).filter(Boolean);

  const currentChoices = state.currentDialogue.choices;
  if (
    currentChoices.length === visibleChoices.length &&
    currentChoices.every((c, i) => c.id === visibleChoices[i]!.id)
  ) {
    return state;
  }

  // Return a shallow copy so we don't mutate the dialogueTree.
  return {
    ...state,
    currentDialogue: {
      ...baseNode,
      choices: visibleChoices,
    },
  };
}

function applyChoiceUsingWasm(
  prev: GameState,
  choice: DialogueChoice,
  uqm: UqmWasmRuntime,
  graph: CompiledGraph,
  tree: typeof dialogueTree,
): GameState | null {
  if (!prev.currentDialogue) return null;

  const baseNode = tree[prev.currentDialogue.id];
  if (!baseNode) return null;

  const nodeIdx = graph.nodeIdToIndex.get(baseNode.id);
  if (nodeIdx === undefined) return null;

  // Important: `prev.currentDialogue.choices` may be a *filtered presentation* for
  // UQM-style response pool semantics, so we must map choice->localIdx using the
  // canonical tree node.
  const localIdx = baseNode.choices.findIndex(c => c.id === choice.id);
  if (localIdx < 0) return null;

  const lock = getDialogueChoiceLock(prev, choice);
  if (lock.locked) {
    return prev;
  }

  const rep0 = prev.factions.find(f => f.id === 'iron-pact')?.reputation ?? 0;
  const rep1 = prev.factions.find(f => f.id === 'verdant-court')?.reputation ?? 0;
  const rep2 = prev.factions.find(f => f.id === 'ember-throne')?.reputation ?? 0;

  const secrets = secretsMaskFromKnown(prev.knownSecrets, graph.secretToBit);

  const exp = uqm.exports;
  exp.uqm_conv_reset(nodeIdx, rep0, rep1, rep2, secrets);

  if (exp.uqm_conv_choice_is_locked(localIdx)) {
    return prev;
  }

  const nextNodeIdx = exp.uqm_conv_choose(localIdx);

  // `-1` can mean either "end conversation" or "invalid". Disambiguate using the
  // TS node id on the choice; if the choice expects a next node but wasm returned
  // an invalid index, fall back.
  let nextDialogueId: string | null = null;
  if (nextNodeIdx >= 0 && nextNodeIdx < graph.nodeIds.length) {
    nextDialogueId = graph.nodeIds[nextNodeIdx];
  } else if (choice.nextNodeId != null) {
    return null;
  }

  const newRep0 = clamp(exp.uqm_conv_get_rep(0), -100, 100);
  const newRep1 = clamp(exp.uqm_conv_get_rep(1), -100, 100);
  const newRep2 = clamp(exp.uqm_conv_get_rep(2), -100, 100);

  const nextDialogue = nextDialogueId ? tree[nextDialogueId] ?? null : null;

  const newFactions = prev.factions.map(f => {
    if (f.id === 'iron-pact') return { ...f, reputation: newRep0 };
    if (f.id === 'verdant-court') return { ...f, reputation: newRep1 };
    if (f.id === 'ember-throne') return { ...f, reputation: newRep2 };
    return f;
  });

  const addedSecrets = getDialogueChoiceSecretsToAdd(choice);
  const newSecrets = addedSecrets.length > 0 ? [...prev.knownSecrets, ...addedSecrets] : prev.knownSecrets;

  // Check events (same logic as TS engine)
  const newEvents = prev.events.map(event => {
    if (event.triggered || !event.triggerCondition) return event;

    const faction = newFactions.find(f => f.id === event.triggerCondition!.factionId);
    if (!faction) return event;

    const met =
      event.triggerCondition.direction === 'above'
        ? faction.reputation >= event.triggerCondition.reputationThreshold
        : faction.reputation <= event.triggerCondition.reputationThreshold;

    return met ? { ...event, triggered: true } : event;
  });

  const triggeredEvents = newEvents.filter((e, i) => e.triggered && !prev.events[i].triggered);

  const newLog = [
    ...prev.log,
    `> ${choice.text}`,
    ...triggeredEvents.map(e => `⚡ Event: ${e.title} — ${e.description}`),
    ...(choice.revealsInfo ? [`🔍 Secret learned: ${choice.revealsInfo}`] : []),
  ];

  const nextTurnNumber = prev.turnNumber + 1;

  // `expiresOnTurn` is inclusive: an encounter expires only after turn N resolves
  // (i.e. it is still retained when `expiresOnTurn === nextTurnNumber`).
  const retainedEncounters = prev.pendingEncounters.filter(e => e.expiresOnTurn >= nextTurnNumber);

  const expiredEncounters = prev.pendingEncounters
    .filter(e => e.expiresOnTurn < nextTurnNumber)
    .slice()
    .sort((a, b) => (a.expiresOnTurn - b.expiresOnTurn) || a.id.localeCompare(b.id));

  // If encounters expired this turn, apply deterministic consequences *before*
  // running the world's simulation so that the consequences can influence the sim.
  let worldBeforeSim = prev.world;
  const expiryLog: string[] = [];
  for (const encounter of expiredEncounters) {
    const expired = applyExpiredEncounterConsequence({
      world: worldBeforeSim,
      encounter,
      turnNumber: nextTurnNumber,
    });
    worldBeforeSim = expired.world;
    expiryLog.push(...expired.logEntries);
  }

  // Turn-based world simulation runs after each player choice.
  const sim = simulateWorldTurn({
    world: worldBeforeSim,
    factions: newFactions,
    turnNumber: nextTurnNumber,
    rngSeed: prev.rngSeed,
  });

  const worldLog = sim.logEntries.map(e => `🌍 ${e}`);

  const nextPendingEncounters = retainedEncounters.slice();

  for (const encounter of sim.pendingEncounters) {
    if (nextPendingEncounters.length >= MAX_PENDING_ENCOUNTERS) break;
    if (!nextPendingEncounters.some(e => e.id === encounter.id)) {
      nextPendingEncounters.push(encounter);
    }
  }

  nextPendingEncounters.sort((a, b) => (a.expiresOnTurn - b.expiresOnTurn) || a.id.localeCompare(b.id));

  return {
    ...prev,
    factions: newFactions,
    currentDialogue: nextDialogue,
    events: newEvents,
    knownSecrets: [...new Set(newSecrets)],
    turnNumber: nextTurnNumber,
    log: [...newLog, ...worldLog, ...expiryLog],
    world: sim.world,
    rngSeed: sim.rngSeed,
    pendingEncounters: nextPendingEncounters,
  };
}

/**
 * Create a ConversationEngine backed by the minimal UQM-derived WASM conversation core.
 *
 * This keeps the broader game-state transition logic identical to `tsConversationEngine`
 * (events, logging, world simulation), but delegates *conversation graph transitions*
 * (next node, reputation deltas, choice locks) to WASM.
 */
export function createUqmWasmConversationEngine(
  uqm: UqmWasmRuntime,
  tree: typeof dialogueTree = dialogueTree,
): ConversationEngine {
  const graph = compileGraph(tree);
  writeGraphToWasm(uqm, graph, tree);

  // When a caller passes a custom dialogue tree (tests), ensure the TS fallback
  // and startNewGame are consistent with that tree.
  const tsEngineForTree = tree === dialogueTree ? tsConversationEngine : createTsConversationEngine(tree);

  const present = (state: GameState) => presentDialogueNodeForWasmResponsePool(state, uqm, graph, tree);

  const engine: ConversationEngine = {
    createInitialState() {
      return present(tsEngineForTree.createInitialState());
    },
    startNewGame() {
      return present(tsEngineForTree.startNewGame());
    },
    applyChoice(prev, choice) {
      const next = prev.knownSecrets.includes('override')
        ? tsEngineForTree.applyChoice(prev, choice)
        : applyChoiceUsingWasm(prev, choice, uqm, graph, tree) ?? tsEngineForTree.applyChoice(prev, choice);

      return next === prev ? prev : present(next);
    },
    presentState(state) {
      return present(state);
    },
  };

  return engine;
}

      
