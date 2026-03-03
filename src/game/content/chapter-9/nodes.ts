import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-9-hub': {
    id: 'chapter-9-hub',
    speaker: 'Narrator',
    text: 'The quay ledger points inland, toward the Hall.

There is a stairwell behind the records rooms that clerks call the docket stair. It is not grand. It is simply always in use.

People say it was cut after an earlier Concord crisis, when delegations agreed on a settlement and then spent a year arguing about what the settlement meant.

The stair is the answer to that failure: a place to turn politics into docket ranges and call it procedure.

If continuity is a corridor, this is the place where the corridor gets built.',
    choices: [
      {
        id: 'ch9-hub-stairlog',
        text: 'Read the stair logbook and see which initials repeat.',
        effects: [],
        grantsTokens: ['tok:ch09:proof:stairlog'],
        nextNodeId: 'ch9-stairlog',
      },
      {
        id: 'ch9-hub-registrar',
        text: 'Speak to the deputy registrar who keeps the docket stair supplied with paper.',
        effects: [],
        nextNodeId: 'ch9-registrar',
      },
      {
        id: 'ch9-hub-archive',
        text: 'Follow the docket bundles into the archive room and look for the index that explains them.',
        effects: [],
        grantsTokens: ['tok:ch09:proof:registry'],
        nextNodeId: 'ch9-archive',
      },
      {
        id: 'ch9-hub-ward',
        text: 'Inspect the stairwell for ward marks and counterseals that survive filing.',
        effects: [],
        grantsTokens: ['tok:ch09:proof:ward'],
        nextNodeId: 'ch9-ward',
      },
      {
        id: 'ch9-hub-carry-audit',
        text: 'Use the quay inquiry to demand the full docket trail while everyone is watching.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:audit'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:proof:registry'],
        nextNodeId: 'ch9-carry-audit',
      },
      {
        id: 'ch9-hub-carry-seize',
        text: 'Present the seized ledger and demand the matching registry entries now.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:seize'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:proof:seal'],
        nextNodeId: 'ch9-carry-seize',
      },
      {
        id: 'ch9-hub-decision',
        text: 'Decide what to do with the docket stair itself.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch09:proof:registry',
          'tok:ch09:proof:stairlog',
          'tok:ch09:proof:ward',
          'tok:ch09:proof:seal',
          'tok:ch08:outcome:name',
          'tok:ch08:outcome:seize',
          'tok:ch08:outcome:ward',
          'tok:ch08:outcome:escrow',
          'tok:ch08:outcome:quiet',
        ],
        nextNodeId: 'ch9-decision',
      },
      {
        id: 'ch9-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch9-stairlog': {
    id: 'ch9-stairlog',
    speaker: 'Narrator',
    text: 'The logbook is kept in the kind of handwriting that tries to be invisible.

Dates. Initials. Docket ranges.

A pattern emerges: the same initials appear whenever reroutes surge. The same range of dockets appears whenever a delegation complains.

Continuity is learning how to look like traffic.',
    choices: [
      {
        id: 'ch9-stairlog-note',
        text: 'Memorize the repeating initials and the docket ranges they touch.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
        revealsInfo: 'A docket-stair logbook shows repeating initials and docket ranges that coincide with reroute surges and delegation complaints.',
      },
    ],
  },

  'ch9-registrar': {
    id: 'ch9-registrar',
    speaker: 'Deputy Registrar Lysa Renn',
    text: 'Lysa Renn looks like someone who has learned to hold their breath around important corridors.

"Envoy," they say. "You are late. Not to the stair. No one is late to the stair. Only to the consequences."',
    choices: [
      {
        id: 'ch9-registrar-ask',
        text: 'Ask what the docket stair is really for when nobody is pretending it is neutral.',
        effects: [],
        nextNodeId: 'ch9-registrar-ask',
      },
      {
        id: 'ch9-registrar-name',
        text: 'Tell Renn you brought the quay ledger under named oversight. Ask what the stair will do to avoid being named next.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:name'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch9-registrar-name',
      },
      {
        id: 'ch9-registrar-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-registrar-ask': {
    id: 'ch9-registrar-ask',
    speaker: 'Deputy Registrar Lysa Renn',
    text: '"It is for distance," Renn says.

"Orders come down the stair as docket numbers, not as decisions. If a delegation objects, the paper says the paper did it."',
    choices: [
      {
        id: 'ch9-registrar-ask-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-registrar-name': {
    id: 'ch9-registrar-name',
    speaker: 'Deputy Registrar Lysa Renn',
    text: 'Renn’s expression flattens.

"Then the stair will get quieter," they say.

"If you can be held responsible for naming a function, the function learns to move one step farther away."',
    choices: [
      {
        id: 'ch9-registrar-name-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-archive': {
    id: 'ch9-archive',
    speaker: 'Narrator',
    text: 'The archive index is not hidden.

It is simply exhausting.

Docket ranges map to rooms, clerks, and templates. Every template has a name that means nothing until you read enough of them.

You find the one that matters: a reroute template that never names authority, only process.',
    choices: [
      {
        id: 'ch9-archive-note',
        text: 'Copy the reroute template name and the docket ranges that invoke it.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
        revealsInfo: 'An archive index maps docket ranges to reroute templates; one template invokes process without naming authority.',
      },
    ],
  },

  'ch9-ward': {
    id: 'ch9-ward',
    speaker: 'Narrator',
    text: 'The stairwell smells like dust and varnish.

Along the banister are small scratches where counterseals were tested and wiped away.

If wards have been added to make authority visible, this is where the corridor will try to sand them down.',
    choices: [
      {
        id: 'ch9-ward-compare',
        text: 'Compare the marks to the ward language you imposed at the quay.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch9-ward-compare',
      },
      {
        id: 'ch9-ward-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ward-compare': {
    id: 'ch9-ward-compare',
    speaker: 'Narrator',
    text: 'The marks are the same family of ward.

Someone tried to apply it. Someone tried to make it look like wear.

Your rule reached the stair. The stair is trying to make it look accidental.',
    choices: [
      {
        id: 'ch9-ward-compare-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-carry-audit': {
    id: 'ch9-carry-audit',
    speaker: 'Narrator',
    text: 'The inquiry crowd gives you cover.

Clerks who would refuse you in quiet will obey you in public.

You do not gain access because the Hall respects you. You gain access because the Hall wants the argument to look orderly.',
    choices: [
      {
        id: 'ch9-carry-audit-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-carry-seize': {
    id: 'ch9-carry-seize',
    speaker: 'Narrator',
    text: 'The seized ledger makes the corridor nervous.

People glance at it and then look away, like looking is consent.

Someone offers you a registry entry with a seal impression you did not ask for. It is a bribe disguised as helpfulness.',
    choices: [
      {
        id: 'ch9-carry-seize-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-decision': {
    id: 'ch9-decision',
    speaker: 'Narrator',
    text: 'The docket stair is where the Hall turns choices into paperwork.

If you want decisions to be accountable, you do not only fight the outcomes.

You fight the machinery that makes outcomes feel inevitable.',
    choices: [
      {
        id: 'ch9-decision-freeze',
        text: 'Issue a docket freeze: no reroutes move until templates are reviewed and named.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch9-docket-decision',
        requiresAllTokens: ['tok:ch09:proof:registry'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:outcome:freeze'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-9:resolved' },
          { kind: 'milestone:add', id: 'chapter-9:resolved:freeze' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 2 },
          { kind: 'log', message: '🗂️ Docket Stair: Reroute dockets frozen pending named template review.' },
        ],
        nextNodeId: 'ch9-ending-freeze',
      },
      {
        id: 'ch9-decision-purge',
        text: 'Purge the stair: remove the clerks, seize the seals, and accept that the corridor will fight back.',
        effects: [{ factionId: 'iron-pact', reputationChange: 3 }, { factionId: 'verdant-court', reputationChange: -1 }],
        exclusiveGroup: 'ch9-docket-decision',
        requiresAnyTokens: ['tok:ch08:outcome:seize', 'tok:ch05:outcome:enforce', 'tok:ch06:outcome:raid', 'tok:ch02:outcome:iron', 'tok:ch09:proof:seal'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:outcome:purge'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-9:resolved' },
          { kind: 'milestone:add', id: 'chapter-9:resolved:purge' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 3 },
          { kind: 'log', message: '🛡️ Docket Stair: Clerks removed and seals seized; corridor forced into open conflict.' },
        ],
        nextNodeId: 'ch9-ending-purge',
      },
      {
        id: 'ch9-decision-ward',
        text: 'Bind the stair to wards that mark reroutes visibly, so the corridor cannot pretend it is neutral traffic.',
        effects: [{ factionId: 'verdant-court', reputationChange: 3 }],
        exclusiveGroup: 'ch9-docket-decision',
        requiresAnyTokens: ['tok:ch08:outcome:ward', 'tok:ch02:outcome:verdant', 'tok:ch09:proof:ward'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-9:resolved' },
          { kind: 'milestone:add', id: 'chapter-9:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Docket Stair: Reroute dockets bound to visible ward marks.' },
        ],
        nextNodeId: 'ch9-ending-ward',
      },
      {
        id: 'ch9-decision-bonds',
        text: 'Turn delays into bonds: attach escrow terms to the docket ranges that cause harm.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch9-docket-decision',
        requiresAnyTokens: ['tok:ch08:outcome:escrow', 'tok:ch02:outcome:ember', 'tok:ch09:proof:stairlog'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch09:outcome:bonds'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-9:resolved' },
          { kind: 'milestone:add', id: 'chapter-9:resolved:bonds' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Docket Stair: Harmful delays bound into escrow terms keyed to docket ranges.' },
        ],
        nextNodeId: 'ch9-ending-bonds',
      },
      {
        id: 'ch9-decision-quiet',
        text: 'Let the stair keep moving and follow its paperwork to whoever is writing the corridor itself.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch9-docket-decision',
        grantsTokens: ['tok:ch09:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-9:resolved' },
          { kind: 'milestone:add', id: 'chapter-9:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Docket Stair: Corridor observed rather than halted; evidence gathered for a later strike.' },
        ],
        nextNodeId: 'ch9-ending-quiet',
      },
      {
        id: 'ch9-decision-back',
        text: 'Not yet. Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ending-freeze': {
    id: 'ch9-ending-freeze',
    speaker: 'Narrator',
    text: 'The stair slows.

Clerks complain. Delegations pretend they always wanted this. Traders begin to count their losses in days instead of rumors.

You have bought time. You have also made enemies who live on speed.',
    choices: [
      {
        id: 'ch9-ending-freeze-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ending-purge': {
    id: 'ch9-ending-purge',
    speaker: 'Narrator',
    text: 'The corridor is forced into daylight.

That is victory of a kind.

It is also an invitation: the Hall will now decide whether to rebuild the stair, replace it, or make it someone else’s problem.',
    choices: [
      {
        id: 'ch9-ending-purge-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ending-ward': {
    id: 'ch9-ending-ward',
    speaker: 'Narrator',
    text: 'You bind the stair to marks that outlive filing.

The corridor will still move.

It will just have to move with its fingerprints showing.',
    choices: [
      {
        id: 'ch9-ending-ward-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ending-bonds': {
    id: 'ch9-ending-bonds',
    speaker: 'Narrator',
    text: 'You price harm.

That is not the same as stopping it.

But the people who profit from the corridor now have to admit what they are selling.',
    choices: [
      {
        id: 'ch9-ending-bonds-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },

  'ch9-ending-quiet': {
    id: 'ch9-ending-quiet',
    speaker: 'Narrator',
    text: 'You choose patience.

The stair keeps building the corridor.

You keep learning its shape.

Somewhere above you, someone will notice the shadow you cast on their paper.',
    choices: [
      {
        id: 'ch9-ending-quiet-back',
        text: 'Return to the stair.',
        effects: [],
        nextNodeId: 'chapter-9-hub',
      },
    ],
  },
});
