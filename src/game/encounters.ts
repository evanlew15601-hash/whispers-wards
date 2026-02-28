import type { DialogueChoice, DialogueNode, SecondaryEncounter, SecondaryEncounterKind, WorldState } from './types';

import { pickEncounterVignette } from './encounterVignettes';
import { applyWorldEffects, type GameEffect } from './effects';

type EncounterResolutionKey =
  | 'embargo-lift'
  | 'embargo-extend'
  | 'embargo-compromise'
  | 'raid-patrol'
  | 'raid-retaliate'
  | 'raid-compensate'
  | 'skirmish-ceasefire'
  | 'skirmish-back-a'
  | 'skirmish-back-b'
  | 'summit-accord'
  | 'summit-slight-a'
  | 'summit-slight-b';

const choiceIdFor = (encounterId: string, resolution: EncounterResolutionKey) => `encounter:${encounterId}:${resolution}`;

export function parseEncounterResolutionChoiceId(choiceId: string): { encounterId: string; resolution: EncounterResolutionKey } | null {
  const prefix = 'encounter:';
  if (!choiceId.startsWith(prefix)) return null;

  const rest = choiceId.slice(prefix.length);
  const parts = rest.split(':');
  if (parts.length !== 2) return null;

  const [encounterId, resolutionRaw] = parts;
  const resolution = resolutionRaw as EncounterResolutionKey;

  const allowed: Set<string> = new Set([
    'embargo-lift',
    'embargo-extend',
    'embargo-compromise',
    'raid-patrol',
    'raid-retaliate',
    'raid-compensate',
    'skirmish-ceasefire',
    'skirmish-back-a',
    'skirmish-back-b',
    'summit-accord',
    'summit-slight-a',
    'summit-slight-b',
  ]);

  if (!allowed.has(resolution)) return null;

  return { encounterId, resolution };
}

function resolutionEffectsFor(
  kind: SecondaryEncounterKind,
  relatedFactions: string[],
  resolution: EncounterResolutionKey,
): DialogueChoice['effects'] {
  const a = relatedFactions[0] ?? null;
  const b = relatedFactions[1] ?? null;
  if (!a || !b) return [];

  let aDelta = 0;
  let bDelta = 0;

  // Balancing notes:
  // - Encounters can occur frequently (every turn), so reputation impact needs to be small.
  // - De-escalation generally boosts both sides slightly.
  // - Backing a side gives a small swing (+/-2).
  if (kind === 'embargo') {
    if (resolution === 'embargo-lift') {
      aDelta = -2;
      bDelta = 2;
    } else if (resolution === 'embargo-compromise') {
      aDelta = 1;
      bDelta = 1;
    } else if (resolution === 'embargo-extend') {
      aDelta = 2;
      bDelta = -2;
    }
  } else if (kind === 'raid') {
    if (resolution === 'raid-patrol') {
      aDelta = 1;
      bDelta = 1;
    } else if (resolution === 'raid-compensate') {
      aDelta = -1;
      bDelta = 2;
    } else if (resolution === 'raid-retaliate') {
      aDelta = -2;
      bDelta = 2;
    }
  } else if (kind === 'skirmish') {
    if (resolution === 'skirmish-ceasefire') {
      aDelta = 1;
      bDelta = 1;
    } else if (resolution === 'skirmish-back-a') {
      aDelta = 2;
      bDelta = -2;
    } else if (resolution === 'skirmish-back-b') {
      aDelta = -2;
      bDelta = 2;
    }
  } else {
    // summit
    if (resolution === 'summit-accord') {
      aDelta = 2;
      bDelta = 2;
    } else if (resolution === 'summit-slight-a') {
      aDelta = -2;
      bDelta = 2;
    } else if (resolution === 'summit-slight-b') {
      aDelta = 2;
      bDelta = -2;
    }
  }

  const effects: DialogueChoice['effects'] = [];
  if (aDelta) effects.push({ factionId: a, reputationChange: aDelta });
  if (bDelta) effects.push({ factionId: b, reputationChange: bDelta });
  return effects;
}

function resolutionChoicesFor(
  kind: SecondaryEncounterKind,
  encounterId: string,
  relatedFactions: string[],
  choiceTexts?: [string, string, string],
): DialogueChoice[] {
  const mk = (resolution: EncounterResolutionKey, text: string): DialogueChoice => ({
    id: choiceIdFor(encounterId, resolution),
    text,
    effects: resolutionEffectsFor(kind, relatedFactions, resolution),
    nextNodeId: null,
  });

  if (kind === 'embargo') {
    const texts = choiceTexts ?? [
      'Broker a swift lifting of the embargo.',
      'Negotiate a compromise charter and reopen trade.',
      'Stand firm; let the embargo bite until concessions are made.',
    ];

    return [mk('embargo-lift', texts[0]), mk('embargo-compromise', texts[1]), mk('embargo-extend', texts[2])];
  }

  if (kind === 'raid') {
    const texts = choiceTexts ?? [
      'Deploy patrols and restore safe passage immediately.',
      'Demand compensation and guarantee escorts for future caravans.',
      'Authorize reprisals; make an example of the raiders.',
    ];

    return [mk('raid-patrol', texts[0]), mk('raid-compensate', texts[1]), mk('raid-retaliate', texts[2])];
  }

  if (kind === 'skirmish') {
    const texts = choiceTexts ?? [
      'Call for a ceasefire and neutral observers.',
      'Endorse the first claimant and press their advantage.',
      'Endorse the second claimant and press their advantage.',
    ];

    return [mk('skirmish-ceasefire', texts[0]), mk('skirmish-back-a', texts[1]), mk('skirmish-back-b', texts[2])];
  }

  // summit
  const texts = choiceTexts ?? [
    'Draft a binding accord and have both sides sign.',
    'Publicly rebuke the first delegation.',
    'Publicly rebuke the second delegation.',
  ];

  return [mk('summit-accord', texts[0]), mk('summit-slight-a', texts[1]), mk('summit-slight-b', texts[2])];
}

export function buildEncounterDialogueNode(encounter: SecondaryEncounter): DialogueNode {
  const kind: SecondaryEncounterKind = encounter.kind ?? 'summit';
  const vignette = pickEncounterVignette(encounter);

  return {
    id: `encounter:${encounter.id}`,
    speaker: vignette.speaker,
    text: `${vignette.preface}\n\n${encounter.title}\n\n${encounter.description}\n\n${vignette.prompt}`,
    choices: resolutionChoicesFor(kind, encounter.id, encounter.relatedFactions, vignette.choiceTexts),
  };
}

export function applyExpiredEncounterConsequence(args: {
  world: WorldState;
  encounter: SecondaryEncounter;
  turnNumber: number;
}): { world: WorldState; logEntries: string[] } {
  const kind: SecondaryEncounterKind = args.encounter.kind ?? 'summit';
  const a = args.encounter.relatedFactions[0] ?? 'unknown-a';
  const b = args.encounter.relatedFactions[1] ?? 'unknown-b';

  const routeId = args.encounter.routeId;
  const regionId = args.encounter.regionId;

  const effects: GameEffect[] = [];

  if ((kind === 'embargo' || kind === 'raid') && routeId) {
    const route = args.world.tradeRoutes[routeId];
    if (route) {
      const untilTurn = Math.max(route.untilTurn ?? -Infinity, args.turnNumber + 1);

      effects.push({
        kind: 'tradeRoute:setStatus',
        routeId,
        status: kind === 'embargo' ? 'embargoed' : 'raided',
        embargoedBy: kind === 'embargo' ? a : undefined,
        untilTurn,
      });
    }
  }

  if (kind === 'skirmish' && regionId) {
    const region = args.world.regions[regionId];
    if (region) {
      effects.push({
        kind: 'region:setControl',
        regionId,
        control: region.control,
        contested: true,
      });
    }
  }

  effects.push({ kind: 'tension', a, b, delta: 5 });

  const logEntries = [`⏳ Encounter expired: ${args.encounter.title} (+5 tension)`];

  return { world: applyWorldEffects(args.world, effects), logEntries };
}

export function resolveEncounter(args: {
  world: WorldState;
  encounter: SecondaryEncounter;
  turnNumber: number;
  resolution: EncounterResolutionKey;
}): { world: WorldState; logEntries: string[] } {
  const kind: SecondaryEncounterKind = args.encounter.kind ?? 'summit';
  const a = args.encounter.relatedFactions[0] ?? 'unknown-a';
  const b = args.encounter.relatedFactions[1] ?? 'unknown-b';

  const routeId = args.encounter.routeId;
  const regionId = args.encounter.regionId;

  const effects: GameEffect[] = [];
  const logEntries: string[] = [];

  if (kind === 'embargo') {
    const routeName = routeId ? args.world.tradeRoutes[routeId]?.name ?? routeId : 'the trade routes';

    if (args.resolution === 'embargo-lift') {
      if (routeId) {
        effects.push({ kind: 'tradeRoute:setStatus', routeId, status: 'open' });
      }
      effects.push({ kind: 'tension', a, b, delta: -12 });
      logEntries.push(`⚔ Embargo lifted on ${routeName} (-12 tension).`);
    } else if (args.resolution === 'embargo-compromise') {
      if (routeId) {
        effects.push({ kind: 'tradeRoute:setStatus', routeId, status: 'open' });
      }
      effects.push({ kind: 'tension', a, b, delta: -5 });
      logEntries.push(`⚔ Compromise reached on ${routeName} (-5 tension).`);
    } else if (args.resolution === 'embargo-extend') {
      if (routeId) {
        effects.push({
          kind: 'tradeRoute:setStatus',
          routeId,
          status: 'embargoed',
          embargoedBy: a,
          untilTurn: args.turnNumber + 3,
        });
      }
      effects.push({ kind: 'tension', a, b, delta: 8 });
      logEntries.push(`⚔ Embargo escalated on ${routeName} (+8 tension).`);
    }

    return { world: applyWorldEffects(args.world, effects), logEntries };
  }

  if (kind === 'raid') {
    const routeName = routeId ? args.world.tradeRoutes[routeId]?.name ?? routeId : 'the trade routes';

    if (args.resolution === 'raid-patrol') {
      if (routeId) {
        effects.push({ kind: 'tradeRoute:setStatus', routeId, status: 'open' });
      }
      effects.push({ kind: 'tension', a, b, delta: -10 });
      logEntries.push(`⚔ Patrols secure ${routeName}; commerce resumes (-10 tension).`);
    } else if (args.resolution === 'raid-compensate') {
      if (routeId) {
        effects.push({ kind: 'tradeRoute:setStatus', routeId, status: 'open' });
      }
      effects.push({ kind: 'tension', a, b, delta: -4 });
      logEntries.push(`⚔ Compensation pledged for losses on ${routeName} (-4 tension).`);
    } else if (args.resolution === 'raid-retaliate') {
      if (routeId) {
        effects.push({ kind: 'tradeRoute:setStatus', routeId, status: 'raided', untilTurn: args.turnNumber + 2 });
      }
      effects.push({ kind: 'tension', a, b, delta: 10 });
      logEntries.push(`⚔ Reprisals ordered after raids on ${routeName} (+10 tension).`);
    }

    return { world: applyWorldEffects(args.world, effects), logEntries };
  }

  if (kind === 'skirmish') {
    const regionName = regionId ? args.world.regions[regionId]?.name ?? regionId : 'the borderlands';

    if (args.resolution === 'skirmish-ceasefire') {
      if (regionId) {
        const region = args.world.regions[regionId];
        if (region) {
          effects.push({ kind: 'region:setControl', regionId, control: region.control, contested: false });
        }
      }
      effects.push({ kind: 'tension', a, b, delta: -8 });
      logEntries.push(`⚔ Ceasefire brokered in ${regionName} (-8 tension).`);
    } else if (args.resolution === 'skirmish-back-a') {
      if (regionId) {
        effects.push({ kind: 'region:setControl', regionId, control: a, contested: false });
      }
      effects.push({ kind: 'tension', a, b, delta: 6 });
      logEntries.push(`⚔ Claim endorsed in ${regionName} (+6 tension).`);
    } else if (args.resolution === 'skirmish-back-b') {
      if (regionId) {
        effects.push({ kind: 'region:setControl', regionId, control: b, contested: false });
      }
      effects.push({ kind: 'tension', a, b, delta: 6 });
      logEntries.push(`⚔ Claim endorsed in ${regionName} (+6 tension).`);
    }

    return { world: applyWorldEffects(args.world, effects), logEntries };
  }

  // summit
  if (args.resolution === 'summit-accord') {
    effects.push({ kind: 'tension', a, b, delta: -15 });
    logEntries.push('⚔ Accord signed at the summit (-15 tension).');
  } else if (args.resolution === 'summit-slight-a') {
    effects.push({ kind: 'tension', a, b, delta: 10 });
    logEntries.push('⚔ The summit ends in public rebuke (+10 tension).');
  } else if (args.resolution === 'summit-slight-b') {
    effects.push({ kind: 'tension', a, b, delta: 10 });
    logEntries.push('⚔ The summit ends in public rebuke (+10 tension).');
  }

  return { world: applyWorldEffects(args.world, effects), logEntries };
}
