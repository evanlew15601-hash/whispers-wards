import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-14-hub': {
    id: 'chapter-14-hub',
    speaker: 'Field Notes',
    text: 'A corridor that survives scrutiny does not survive by hiding forever.

It survives by choosing who to be visible to.

You have the first address.

Now you need the second.',
    choices: [
      {
        id: 'ch14-hub-watch',
        text: 'Watch the mezzanine routes and learn who is allowed to touch corrected bundles.',
        effects: [],
        grantsTokens: ['tok:ch14:proof:timing'],
        nextNodeId: 'ch14-watch',
      },
      {
        id: 'ch14-hub-oaths',
        text: 'Follow the signature chain and see which corrections attract rank-language.',
        effects: [],
        grantsTokens: ['tok:ch14:proof:oathtrail'],
        nextNodeId: 'ch14-oaths',
      },
      {
        id: 'ch14-hub-wards',
        text: 'Follow ward residue and see which corrections attract permanence-language.',
        effects: [],
        grantsTokens: ['tok:ch14:proof:wardtrail'],
        nextNodeId: 'ch14-wards',
      },
      {
        id: 'ch14-hub-receipts',
        text: 'Follow receipts and see which corrections attract obligation-language.',
        effects: [],
        grantsTokens: ['tok:ch14:proof:receipts'],
        nextNodeId: 'ch14-receipts',
      },
      {
        id: 'ch14-hub-follow',
        text: 'Use your last intervention and follow the next corrected bundle to its second address.',
        effects: [],
        requiresAnyTokens: [
          'tok:ch13:outcome:witness',
          'tok:ch13:outcome:chain',
          'tok:ch13:outcome:marks',
          'tok:ch13:outcome:bond',
          'tok:ch13:outcome:quiet',
        ],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch14-follow',
      },
      {
        id: 'ch14-hub-decision',
        text: 'Decide what to do with the second address.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch14:proof:second',
          'tok:ch14:proof:timing',
          'tok:ch14:proof:oathtrail',
          'tok:ch14:proof:wardtrail',
          'tok:ch14:proof:receipts',
        ],
        nextNodeId: 'ch14-decision',
      },
      {
        id: 'ch14-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch14-follow': {
    id: 'ch14-follow',
    speaker: 'Field Notes',
    text: 'You do not need a speech.

You need a route.

You choose which leverage to follow.',
    choices: [
      {
        id: 'ch14-follow-witness',
        text: 'Follow the witness forwarding bundle.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:witness'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:proof:second'],
        nextNodeId: 'ch14-payoff-witness',
      },
      {
        id: 'ch14-follow-chain',
        text: 'Follow the chain-of-responsibility copy.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:chain'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:proof:second'],
        nextNodeId: 'ch14-payoff-chain',
      },
      {
        id: 'ch14-follow-marks',
        text: 'Follow the ward-trace copy.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:marks'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:proof:second'],
        nextNodeId: 'ch14-payoff-marks',
      },
      {
        id: 'ch14-follow-bond',
        text: 'Follow the liability copy.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:bond'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:proof:second'],
        nextNodeId: 'ch14-payoff-bond',
      },
      {
        id: 'ch14-follow-quiet',
        text: 'Follow the next corrected bundle quietly.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:proof:second'],
        nextNodeId: 'ch14-payoff-quiet',
      },
      {
        id: 'ch14-follow-back',
        text: 'Return to the mezzanine.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-watch': {
    id: 'ch14-watch',
    speaker: 'Field Notes',
    text: 'You watch the mezzanine routes.

Clerks come and go.

Runners come and go.

One person does not.

They arrive after corrections are made and before filing begins. They take bundles that should go to the archive, and they carry them toward a door without a plaque.

In the Hall, the most important doors are the ones nobody advertises.',
    choices: [
      {
        id: 'ch14-watch-note',
        text: 'Memorize the timing and the unmarked door the bundles go through.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'A consistent courier takes corrected bundles through an unmarked door between correction and filing, implying a hidden second address.',
      },
    ],
  },

  'ch14-oaths': {
    id: 'ch14-oaths',
    speaker: 'Field Notes',
    text: 'You follow the signature chain.

When a correction threatens rank, Iron handwriting appears.

Not a signature.

A note that looks like a consequence waiting to be justified.

Iron was built on the fear of roads failing. It does not forgive delay, and it does not forgive ambiguity.

Someone is feeding Iron corrections that translate uncertainty into order.',
    choices: [
      {
        id: 'ch14-oaths-note',
        text: 'Keep the pattern in mind: rank-language appears where delay would become unpunished.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Iron-flavored rank language appears around corrections that would otherwise leave delay unpunished, suggesting a patron that fears ambiguity.',
      },
    ],
  },

  'ch14-wards': {
    id: 'ch14-wards',
    speaker: 'Field Notes',
    text: 'You follow ward residue.

Not dramatic.

Just the faint pressure of living fiber in a margin where it does not belong.

Verdant was built on seasons outlasting rulers. It measures harm in permanence.

Someone is feeding Verdant corrections that turn short-term convenience into long-term restraint.',
    choices: [
      {
        id: 'ch14-wards-note',
        text: 'Keep the pattern in mind: ward residue appears where future harm would otherwise be treated as a fee.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Ward residue appears around corrections that would otherwise treat long-term harm as a short-term fee, suggesting a patron that fears permanent damage.',
      },
    ],
  },

  'ch14-receipts': {
    id: 'ch14-receipts',
    speaker: 'Field Notes',
    text: 'You follow the receipts.

Not coin.

Obligation.

A correction that changes who pays is followed by a neat annex line about “fees owed upon delay.”

Ember was built on routes and debt. It makes instability survivable by pricing it.

Someone is feeding Ember corrections that turn uncertainty into leverage.',
    choices: [
      {
        id: 'ch14-receipts-note',
        text: 'Keep the pattern in mind: obligation-language appears where blame would otherwise be free.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Obligation-language clusters around corrections that reassign payment and liability, suggesting a patron that profits from priced instability.',
      },
    ],
  },

  'ch14-payoff-witness': {
    id: 'ch14-payoff-witness',
    speaker: 'Witness Clerk Sabine Wirth',
    text: 'Wirth sets the witnessed corrections into a second bundle.

"Now they go to the quiet desk," they say.

"Not the archive." Wirth’s eyes flick upward. "Somebody reads them before they become history."',
    choices: [
      {
        id: 'ch14-payoff-witness-note',
        text: 'Note the quiet desk and the corridor’s habit: history is reviewed before it becomes record.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Witnessed corrections are forwarded to a quiet desk for review before filing, implying a second address that edits history pre-record.',
      },
    ],
  },

  'ch14-payoff-chain': {
    id: 'ch14-payoff-chain',
    speaker: 'Iven Rell',
    speakerFaction: 'iron-pact',
    text: 'Rell receives the bundle like it is a report.

"A desk became a rank," they say, approvingly.

They tap the red ink. "Good. If someone edits, someone owns it."

Then they add, quieter: "Now we find out who was owning it before you named it."',
    choices: [
      {
        id: 'ch14-payoff-chain-note',
        text: 'Keep the Iron instinct in mind: once a thing is named, it becomes enforceable.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Iron liaison Iven Rell receives corrected bundles as enforceable reports, focusing on identifying who owned the edits before they were named.',
      },
    ],
  },

  'ch14-payoff-marks': {
    id: 'ch14-payoff-marks',
    speaker: 'Cerys Holt',
    speakerFaction: 'verdant-court',
    text: 'Cerys holds the corrected draft as if it might bleed.

"Marks are honesty," they say.

"If the corridor must steer, let it steer with traces." Their gaze stays on the margin. "Now show me where the margin leads."',
    choices: [
      {
        id: 'ch14-payoff-marks-note',
        text: 'Keep the Verdant instinct in mind: restraint must survive filing.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Verdant warden Cerys Holt values ward traces as durable honesty and presses to follow where margin marks lead.',
      },
    ],
  },

  'ch14-payoff-bond': {
    id: 'ch14-payoff-bond',
    speaker: 'Loran Vex',
    speakerFaction: 'ember-throne',
    text: 'Loran reads the corrected bundle like a debt schedule.

"You made edits collectible," they say.

"Good." They smile without warmth. "Now the corridor will learn what it costs to pretend it is nobody."',
    choices: [
      {
        id: 'ch14-payoff-bond-note',
        text: 'Keep the Ember instinct in mind: anonymity is a luxury that can be priced.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Ember consul Loran Vex frames anonymity as a priceable luxury once edits are made collectible.',
      },
    ],
  },

  'ch14-payoff-quiet': {
    id: 'ch14-payoff-quiet',
    speaker: 'Field Notes',
    text: 'You follow the next corrected bundle.

You do not announce yourself.

You do not ask permission.

The runner turns left where the corridor usually turns right.

They bring the bundle to an unmarked door.

Inside is a desk with fresh ink and no witnesses.

That is the second address. A place built to be unseen by everyone who thinks they have a right to see.',
    choices: [
      {
        id: 'ch14-payoff-quiet-note',
        text: 'Keep the location in mind: an unmarked room where corrections are reviewed without witnesses.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
        revealsInfo: 'Following quietly reveals a second address: an unmarked room where corrected bundles are reviewed without witnesses before filing.',
      },
    ],
  },

  'ch14-decision': {
    id: 'ch14-decision',
    speaker: 'Field Notes',
    text: 'You have enough to act.

The second address is the corridor’s audience.

If you change the audience, you change what the corridor believes it is allowed to do.

You choose which foundation the corridor will be forced to respect.',
    choices: [
      {
        id: 'ch14-decision-concord',
        text: 'Make the second address a named Concord office: witnesses, records, and review as habit.',
        effects: [],
        exclusiveGroup: 'ch14-second-address',
        requiresAnyTokens: ['tok:ch14:proof:second', 'tok:ch14:proof:timing'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:outcome:concord'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-14:resolved' },
          { kind: 'milestone:add', id: 'chapter-14:resolved:concord' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ Second Address: Unmarked review converted into a named Concord office with witnesses and review.' },
        ],
        nextNodeId: 'ch14-ending-concord',
      },
      {
        id: 'ch14-decision-iron',
        text: 'Bind the second address to consequence: rank language becomes explicit, and delays become punishable breaches.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch14-second-address',
        requiresAllTokens: ['tok:ch14:proof:oathtrail'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:outcome:iron'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-14:resolved' },
          { kind: 'milestone:add', id: 'chapter-14:resolved:iron' },
          { kind: 'log', message: '🪖 Second Address: Review bound to rank and consequence; delays treated as enforceable breaches.' },
        ],
        nextNodeId: 'ch14-ending-iron',
      },
      {
        id: 'ch14-decision-verdant',
        text: 'Bind the second address to permanence: ward traces become mandatory where harm would outlast a season.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch14-second-address',
        requiresAllTokens: ['tok:ch14:proof:wardtrail'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:outcome:verdant'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-14:resolved' },
          { kind: 'milestone:add', id: 'chapter-14:resolved:verdant' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Second Address: Review bound to ward traces and permanence where harm would outlast a season.' },
        ],
        nextNodeId: 'ch14-ending-verdant',
      },
      {
        id: 'ch14-decision-ember',
        text: 'Bind the second address to obligation: corrections become priced liabilities with collectible harm clauses.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch14-second-address',
        requiresAllTokens: ['tok:ch14:proof:receipts'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch14:outcome:ember'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-14:resolved' },
          { kind: 'milestone:add', id: 'chapter-14:resolved:ember' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Second Address: Review bound to priced obligations and collectible liabilities.' },
        ],
        nextNodeId: 'ch14-ending-ember',
      },
      {
        id: 'ch14-decision-quiet',
        text: 'Do not restructure it yet. Keep watching until the corridor reveals the third address.',
        effects: [],
        exclusiveGroup: 'ch14-second-address',
        grantsTokens: ['tok:ch14:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-14:resolved' },
          { kind: 'milestone:add', id: 'chapter-14:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Second Address: Surveillance continues; action delayed for deeper proof.' },
        ],
        nextNodeId: 'ch14-ending-quiet',
      },
      {
        id: 'ch14-decision-back',
        text: 'Not yet. Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-ending-concord': {
    id: 'ch14-ending-concord',
    speaker: 'Field Notes',
    text: 'You make the second address a room with witnesses.

The corridor will keep moving.

Now it will have to move in daylight, and daylight is a kind of enforcement.',
    choices: [
      {
        id: 'ch14-ending-concord-back',
        text: 'Return to the routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-ending-iron': {
    id: 'ch14-ending-iron',
    speaker: 'Field Notes',
    text: 'You bind review to consequence.

Iron will call it order.

Someone else will call it cruelty.

The corridor will call it a timetable.',
    choices: [
      {
        id: 'ch14-ending-iron-back',
        text: 'Return to the routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-ending-verdant': {
    id: 'ch14-ending-verdant',
    speaker: 'Field Notes',
    text: 'You bind review to permanence.

Verdant will call it stewardship.

Someone else will call it obstruction.

The corridor will learn to fear marks that survive filing.',
    choices: [
      {
        id: 'ch14-ending-verdant-back',
        text: 'Return to the routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-ending-ember': {
    id: 'ch14-ending-ember',
    speaker: 'Field Notes',
    text: 'You bind review to obligation.

Ember will call it realism.

Someone will call it corruption.

The corridor will learn that anonymity has a price.',
    choices: [
      {
        id: 'ch14-ending-ember-back',
        text: 'Return to the routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },

  'ch14-ending-quiet': {
    id: 'ch14-ending-quiet',
    speaker: 'Field Notes',
    text: 'You do not strike yet.

You keep watching.

A corridor that has a second address usually has a third.

You will learn it.',
    choices: [
      {
        id: 'ch14-ending-quiet-back',
        text: 'Return to the routes.',
        effects: [],
        nextNodeId: 'chapter-14-hub',
      },
    ],
  },
});
