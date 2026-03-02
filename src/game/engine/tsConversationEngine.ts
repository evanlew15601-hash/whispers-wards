import type { ConversationEngine } from './conversationEngine';
import type { DialogueChoice, GameState } from '../types';

import { dialogueTree, initialEvents, initialFactions } from '../data';
import { createInitialRngSeed, createInitialWorldState } from '../world';
import { applyExpiredEncounterConsequence, parseEncounterResolutionChoiceId, resolveEncounter } from '../encounters';
import { simulateWorldTurn } from '../simulation';
import { isChoiceLocked, isChoiceLockedByExclusiveGroup, isChoiceLockedByHistory, isChoiceLockedBySecrets } from '../choiceLocks';
import { resolveNextNodeId } from '../choiceNext';
import { applyEffects, type GameEffect } from '../effects';
import { evaluateChapterTransition, getChapter } from '../chapters';
import { advanceProjectsOneTurn } from '../projects';
import { DEFAULT_PLAYER_PROFILE } from '../player';

const OPENING_LOG_LINE = 'You arrive at the Concord Hall as envoy to the fractured realm...';

const createInitialState = (): GameState => ({
  currentScene: 'title',
  player: { ...DEFAULT_PLAYER_PROFILE },
  factions: initialFactions.map(f => ({ ...f })),
  currentDialogue: null,
  events: initialEvents.map(e => ({ ...e })),
  knownSecrets: [],
  selectedChoiceIds: [],
  stepNumber: 0,
  turnNumber: 1,
  chapterId: 'chapter-1',
  chapterTurn: 1,
  milestones: [],
  resources: {
    coin: 6,
    influence: 3,
    supplies: 2,
    intel: 0,
  },
  projects: [],
  management: {
    apMax: 3,
    apRemaining: 3,
    actionsTakenThisTurn: [],
    lastUsedTurnByActionId: {},
    usedThisChapter: {},
  },
  log: [],
  rngSeed: createInitialRngSeed(),
  world: createInitialWorldState(initialFactions),
  pendingEncounter: null,
});

const startNewGame = (): GameState => {
  const base = createInitialState();
  return {
    ...base,
    currentScene: 'game',
    currentDialogue: dialogueTree['opening'],
    log: [OPENING_LOG_LINE],
  };
};

const addChoiceId = (prevIds: string[], id: string) => (prevIds.includes(id) ? prevIds : [...prevIds, id]);

const suppressReputationEffects = (choice: DialogueChoice): DialogueChoice => {
  return {
    ...choice,
    effects: choice.effects.map(e => ({ ...e, reputationChange: 0 })),
    gameEffects: choice.gameEffects?.length ? [] : choice.gameEffects,
  };
};

const evaluateEvents = (prev: GameState, factions: GameState['factions']) => {
  const newEvents = prev.events.map(event => {
    if (event.triggered || !event.triggerCondition) return event;

    const faction = factions.find(f => f.id === event.triggerCondition!.factionId);
    if (!faction) return event;

    const met =
      event.triggerCondition.direction === 'above'
        ? faction.reputation >= event.triggerCondition.reputationThreshold
        : faction.reputation <= event.triggerCondition.reputationThreshold;

    return met ? { ...event, triggered: true } : event;
  });

  const triggeredEvents = newEvents.filter((e, i) => e.triggered && !prev.events[i].triggered);

  return { newEvents, triggeredEvents };
};

const choiceToEffects = (prev: GameState, choice: DialogueChoice): GameEffect[] => {
  const effects: GameEffect[] = [...(choice.gameEffects ?? [])];

  for (const e of choice.effects) {
    if (e.reputationChange === 0) continue;
    effects.push({ kind: 'rep', factionId: e.factionId, delta: e.reputationChange });
  }

  if (choice.revealsInfo && !prev.knownSecrets.includes(choice.revealsInfo)) {
    effects.push({ kind: 'secret:add', secret: choice.revealsInfo });
  }

  return effects;
};

const applyChoice = (prev: GameState, choice: DialogueChoice): GameState => {
  const alreadyDecided = isChoiceLockedByHistory(choice, prev.selectedChoiceIds, prev.knownSecrets, prev.log);

  // Only block genuinely unavailable choices. If the player already made this decision in
  // the past, keep it selectable and suppress its reputation effects.
  if (isChoiceLocked(choice, prev.factions, prev.knownSecrets, prev.selectedChoiceIds) && !alreadyDecided) {
    return prev;
  }

  const effectiveChoice = alreadyDecided ? suppressReputationEffects(choice) : choice;

  const secretLearned = Boolean(choice.revealsInfo && !prev.knownSecrets.includes(choice.revealsInfo));

  const baseWithLog = {
    ...prev,
    log: [...prev.log, `> ${choice.text}`],
  };

  const withEffects = applyEffects(baseWithLog, choiceToEffects(prev, effectiveChoice));

  const { newEvents, triggeredEvents } = evaluateEvents(prev, withEffects.factions);

  const encounterPick = withEffects.pendingEncounter ? parseEncounterResolutionChoiceId(choice.id) : null;
  if (withEffects.pendingEncounter && encounterPick && encounterPick.encounterId === withEffects.pendingEncounter.id) {
    const resolved = resolveEncounter({
      world: withEffects.world,
      encounter: withEffects.pendingEncounter,
      turnNumber: withEffects.turnNumber,
      resolution: encounterPick.resolution,
    });

    return {
      ...withEffects,
      events: newEvents,
      selectedChoiceIds: addChoiceId(prev.selectedChoiceIds, choice.id),
      stepNumber: prev.stepNumber + 1,
      // Return to the main hall hub so the campaign continues.
      currentDialogue: dialogueTree[getChapter(withEffects.chapterId).hubNodeId] ?? withEffects.currentDialogue,
      pendingEncounter: null,
      log: [
        ...withEffects.log,
        ...triggeredEvents.map(e => `⚡ Event: ${e.title} — ${e.description}`),
        ...(secretLearned ? [`🔍 Secret learned: ${choice.revealsInfo}`] : []),
        ...resolved.logEntries,
      ],
      world: resolved.world,
    };
  }

  const chapter = getChapter(withEffects.chapterId);
  const hub = dialogueTree[chapter.hubNodeId] ?? null;

  // Most scenes should resolve back to the chapter hub rather than dropping the player
  // into a "no dialogue" state.
  const resolvedNextNodeId = resolveNextNodeId(choice, withEffects.knownSecrets);
  const nextDialogue = resolvedNextNodeId ? dialogueTree[resolvedNextNodeId] || null : hub;

  return {
    ...withEffects,
    currentDialogue: nextDialogue,
    events: newEvents,
    selectedChoiceIds: addChoiceId(prev.selectedChoiceIds, choice.id),
    stepNumber: prev.stepNumber + 1,
    log: [
      ...withEffects.log,
      ...triggeredEvents.map(e => `⚡ Event: ${e.title} — ${e.description}`),
      ...(secretLearned ? [`🔍 Secret learned: ${choice.revealsInfo}`] : []),
    ],
  };
};

const endTurn = (prev: GameState): GameState => {
  if (prev.currentScene !== 'game') return prev;

  const nextTurnNumber = prev.turnNumber + 1;

  // `expiresOnTurn` is inclusive: the encounter expires only after turn N resolves
  // (i.e. it is still retained when `expiresOnTurn === nextTurnNumber`).
  const existingEncounter =
    prev.pendingEncounter && prev.pendingEncounter.expiresOnTurn >= nextTurnNumber ? prev.pendingEncounter : null;

  const expiredEncounter =
    prev.pendingEncounter && prev.pendingEncounter.expiresOnTurn < nextTurnNumber ? prev.pendingEncounter : null;

  // If an encounter just expired this turn, apply a deterministic consequence *before*
  // running the world's simulation so that the consequence can influence the sim.
  let worldBeforeSim = prev.world;
  let expiryLog: string[] = [];
  if (expiredEncounter) {
    const expired = applyExpiredEncounterConsequence({
      world: worldBeforeSim,
      encounter: expiredEncounter,
      turnNumber: nextTurnNumber,
    });
    worldBeforeSim = expired.world;
    expiryLog = expired.logEntries;
  }

  const chapter = getChapter(prev.chapterId);

  const sim = simulateWorldTurn({
    world: worldBeforeSim,
    factions: prev.factions,
    turnNumber: nextTurnNumber,
    rngSeed: prev.rngSeed,
    encounterPoolId: chapter.encounterPoolId,
  });

  const worldLog = sim.logEntries.map(e => `🌍 ${e}`);
  const nextEncounter = existingEncounter ?? sim.pendingEncounter;

  const baseCoinIncome = 1;
  const baseInfluenceIncome = 1;
  const baseSuppliesIncome = 1;
  const baseIntelIncome = 0;

  const routes = Object.values(sim.world.tradeRoutes);
  const openRoutes = routes.filter(r => r.status === 'open').length;
  const embargoedRoutes = routes.filter(r => r.status === 'embargoed').length;
  const raidedRoutes = routes.filter(r => r.status === 'raided').length;
  const blockedRoutes = embargoedRoutes + raidedRoutes;

  const coinIncome = Math.max(0, baseCoinIncome + openRoutes - blockedRoutes);

  const incomeEffects: GameEffect[] = [
    { kind: 'resource', resourceId: 'coin', delta: coinIncome },
    { kind: 'resource', resourceId: 'influence', delta: baseInfluenceIncome },
    { kind: 'resource', resourceId: 'supplies', delta: baseSuppliesIncome },
    { kind: 'resource', resourceId: 'intel', delta: baseIntelIncome },
  ];

  const nextState: GameState = {
    ...prev,
    stepNumber: prev.stepNumber + 1,
    turnNumber: nextTurnNumber,
    chapterTurn: prev.chapterTurn + 1,
    log: [...prev.log, '⏭ End Turn', ...expiryLog, ...worldLog],
    world: sim.world,
    rngSeed: sim.rngSeed,
    pendingEncounter: nextEncounter,
    management: {
      ...prev.management,
      apRemaining: prev.management.apMax,
      actionsTakenThisTurn: [],
    },
  };

  let withIncome = applyEffects(nextState, incomeEffects);

  const incomeLog =
    `💰 Income: +${coinIncome} coin, +${baseInfluenceIncome} influence, +${baseSuppliesIncome} supplies` +
    (blockedRoutes ? ` (routes disrupted: ${blockedRoutes})` : '') +
    (baseIntelIncome ? `, +${baseIntelIncome} intel` : '');

  withIncome = {
    ...withIncome,
    log: [...withIncome.log, incomeLog],
  };

  const projectTick = advanceProjectsOneTurn(withIncome);

  let withProjects: GameState = {
    ...withIncome,
    projects: projectTick.projects,
    log: [...withIncome.log, ...projectTick.logEntries],
  };

  if (projectTick.completionEffects.length) {
    withProjects = applyEffects(withProjects, projectTick.completionEffects);
  }

  return evaluateChapterTransition(withProjects);
};

export const tsConversationEngine: ConversationEngine = {
  createInitialState,
  startNewGame,
  applyChoice,
  endTurn,
  getChoiceLockedFlags(state) {
    if (!state.currentDialogue) return null;
    return state.currentDialogue.choices.map(choice =>
      isChoiceLocked(choice, state.factions, state.knownSecrets, state.selectedChoiceIds)
    );
  },
  getChoiceUiHints(state) {
    if (!state.currentDialogue) return null;

    return state.currentDialogue.choices.map(choice => {
      const alreadyDecided = isChoiceLockedByHistory(choice, state.selectedChoiceIds, state.knownSecrets, state.log);

      if (alreadyDecided) {
        return {
          locked: false,
          alreadyDecided: true,
          lockedBySecrets: false,
          lockedByReputation: false,
          lockedByExclusiveGroup: false,
          requiredReputationMin: choice.requiredReputation ?? null,
          requiredReputationMax: choice.requiredReputationMax ?? null,
          effects: choice.effects,
          revealsInfo: choice.revealsInfo ?? null,
        };
      }

      const lockedByExclusiveGroup = isChoiceLockedByExclusiveGroup(choice, state.selectedChoiceIds);
      const lockedBySecrets = isChoiceLockedBySecrets(choice, state.knownSecrets);

      const repReqMin = choice.requiredReputation ?? null;
      const repReqMax = choice.requiredReputationMax ?? null;

      const repMinLocked = Boolean(
        repReqMin && (state.factions.find(f => f.id === repReqMin.factionId)?.reputation ?? -Infinity) < repReqMin.min
      );

      const repMaxLocked = Boolean(
        repReqMax && (state.factions.find(f => f.id === repReqMax.factionId)?.reputation ?? Infinity) > repReqMax.max
      );

      return {
        locked: isChoiceLocked(choice, state.factions, state.knownSecrets, state.selectedChoiceIds),
        alreadyDecided: false,
        lockedBySecrets,
        lockedByReputation: repMinLocked || repMaxLocked,
        lockedByExclusiveGroup,
        requiredReputationMin: repReqMin,
        requiredReputationMax: repReqMax,
        effects: choice.effects,
        revealsInfo: choice.revealsInfo ?? null,
      };
    });
  },
};

export const TS_OPENING_LOG_LINE = OPENING_LOG_LINE;
