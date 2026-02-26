import type { ConversationEngine } from './conversationEngine';
import type { DialogueChoice, GameState } from '../types';

import { dialogueTree, initialEvents, initialFactions } from '../data';
import { createInitialRngSeed, createInitialWorldState } from '../world';
import { applyExpiredEncounterConsequence, parseEncounterResolutionChoiceId, resolveEncounter } from '../encounters';
import { simulateWorldTurn } from '../simulation';
import { getDialogueChoiceLock, getDialogueChoiceSecretsToAdd } from './dialogueChoiceLocks';

const OPENING_LOG_LINE = 'You arrive at the Concord Hall as envoy to the fractured realm...';

export const MAX_PENDING_ENCOUNTERS = 3;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const createInitialState = (): GameState => ({
  currentScene: 'title',
  factions: initialFactions.map(f => ({ ...f })),
  currentDialogue: null,
  events: initialEvents.map(e => ({ ...e })),
  knownSecrets: [],
  turnNumber: 1,
  log: [],
  rngSeed: createInitialRngSeed(),
  world: createInitialWorldState(initialFactions),
  pendingEncounters: [],
  encounterResolvedOnTurn: null,
});

function startNewGameWithTree(tree: typeof dialogueTree): GameState {
  const base = createInitialState();
  return {
    ...base,
    currentScene: 'game',
    currentDialogue: tree['opening'],
    log: [OPENING_LOG_LINE],
  };
}

function applyChoiceWithTree(prev: GameState, choice: DialogueChoice, tree: typeof dialogueTree): GameState {
  const lock = getDialogueChoiceLock(prev, choice);
  if (lock.locked) return prev;

  const encounterDeferPrefix = 'encounter-defer:';
  if (choice.id.startsWith(encounterDeferPrefix)) {
    const encounterId = choice.id.slice(encounterDeferPrefix.length);

    if (prev.currentDialogue?.id !== `encounter:${encounterId}`) return prev;

    return {
      ...prev,
      currentDialogue: tree['concord-hub'] ?? prev.currentDialogue,
      log: [...prev.log, `> ${choice.text}`],
    };
  }

  const encounterPick = parseEncounterResolutionChoiceId(choice.id);
  const encounterInInbox = encounterPick
    ? prev.pendingEncounters.find(e => e.id === encounterPick.encounterId) ?? null
    : null;

  const isEncounterDialogueForPick = encounterPick
    ? prev.currentDialogue?.id === `encounter:${encounterPick.encounterId}`
    : false;

  if (encounterPick) {
    if (!isEncounterDialogueForPick) return prev;
    if (prev.encounterResolvedOnTurn === prev.turnNumber) return prev;

    const encounter = encounterInInbox;
    if (!encounter) return prev;

    // Even though encounter choices are dynamically generated, we still want to apply
    // any standard choice side-effects (rep, secrets, event triggers).
    const newFactions = prev.factions.map(f => {
      const effect = choice.effects.find(e => e.factionId === f.id);
      if (!effect) return f;

      return {
        ...f,
        reputation: clamp(f.reputation + effect.reputationChange, -100, 100),
      };
    });

    const addedSecrets = getDialogueChoiceSecretsToAdd(choice);
    const newSecrets = addedSecrets.length > 0 ? [...prev.knownSecrets, ...addedSecrets] : prev.knownSecrets;

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

    const resolved = resolveEncounter({
      world: prev.world,
      encounter,
      turnNumber: prev.turnNumber,
      resolution: encounterPick.resolution,
    });

    return {
      ...prev,
      factions: newFactions,
      events: newEvents,
      knownSecrets: [...new Set(newSecrets)],
      // Return to the main hall hub so the campaign continues.
      currentDialogue: tree['concord-hub'] ?? prev.currentDialogue,
      pendingEncounters: prev.pendingEncounters.filter(e => e.id !== encounter.id),
      encounterResolvedOnTurn: prev.turnNumber,
      log: [
        ...prev.log,
        `> ${choice.text}`,
        ...triggeredEvents.map(e => `⚡ Event: ${e.title} — ${e.description}`),
        ...(choice.revealsInfo ? [`🔍 Secret learned: ${choice.revealsInfo}`] : []),
        ...resolved.logEntries,
      ],
      world: resolved.world,
    };
  }

  const newFactions = prev.factions.map(f => {
    const effect = choice.effects.find(e => e.factionId === f.id);
    if (!effect) return f;

    return {
      ...f,
      reputation: clamp(f.reputation + effect.reputationChange, -100, 100),
    };
  });

  const addedSecrets = getDialogueChoiceSecretsToAdd(choice);
  const newSecrets = addedSecrets.length > 0 ? [...prev.knownSecrets, ...addedSecrets] : prev.knownSecrets;

  // Check events
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

  const nextDialogue = choice.nextNodeId ? tree[choice.nextNodeId] || null : null;

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

export function createTsConversationEngine(tree: typeof dialogueTree = dialogueTree): ConversationEngine {
  return {
    createInitialState,
    startNewGame: () => startNewGameWithTree(tree),
    applyChoice: (prev, choice) => applyChoiceWithTree(prev, choice, tree),
  };
}

export const tsConversationEngine: ConversationEngine = createTsConversationEngine();

export const TS_OPENING_LOG_LINE = OPENING_LOG_LINE;
