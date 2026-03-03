import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-10-hub': {
    id: 'chapter-10-hub',
    speaker: 'Narrator',
    text: 'The docket stair never sleeps.

It is narrower near the top. The air smells of paper dust and varnish.

It is the kind of place that only exists because Concord exists: a realm held together by witnessed oaths and repeated precedent, not by a crown.

Iron built fortress cities by swearing supply lines into discipline. Verdant built patience into wards and called it stewardship. Ember built empires out of routes and debt.

Concord tried to make those foundations share a room.

Somewhere above, someone is deciding which delays count as emergencies and which people count as collateral.

You have been an envoy long enough to recognize a simple truth: corridors have owners.',
    choices: [
      {
        id: 'ch10-hub-charter',
        text: 'Read the envoy charter copy kept at the stair’s top landing.',
        effects: [],
        grantsTokens: ['tok:ch10:proof:charter'],
        nextNodeId: 'ch10-charter',
      },
      {
        id: 'ch10-hub-signet',
        text: 'Examine the signet book and the seal-box used for “routine” orders.',
        effects: [],
        grantsTokens: ['tok:ch10:proof:signet'],
        nextNodeId: 'ch10-signet',
      },
      {
        id: 'ch10-hub-templates',
        text: 'Look through the continuity templates and see what the Hall is training clerks to do.',
        effects: [],
        grantsTokens: ['tok:ch10:proof:templates'],
        nextNodeId: 'ch10-templates',
      },
      {
        id: 'ch10-hub-memoirs',
        text: 'Read a battered memoir of an earlier envoy who tried to outlive the corridor.',
        effects: [],
        grantsTokens: ['tok:ch10:proof:memoirs'],
        nextNodeId: 'ch10-memoirs',
      },
      {
        id: 'ch10-hub-payoff-audit',
        text: 'Use the quay inquiry to demand a sealed docket bundle while everyone is watching.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:audit'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:proof:bundle'],
        nextNodeId: 'ch10-payoff-audit',
      },
      {
        id: 'ch10-hub-payoff-seize',
        text: 'Compare your seized stampwork against the stair’s “official” signets.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:seize'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:proof:seal-match'],
        nextNodeId: 'ch10-payoff-seize',
      },
      {
        id: 'ch10-hub-corridor-king',
        text: 'Ask for an audience with the person who keeps the corridor moving.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch10:proof:charter',
          'tok:ch10:proof:signet',
          'tok:ch10:proof:templates',
          'tok:ch10:proof:memoirs',
          'tok:ch10:proof:bundle',
          'tok:ch10:proof:seal-match',
          'tok:ch09:outcome:quiet',
          'tok:ch09:outcome:freeze',
          'tok:ch08:outcome:name',
        ],
        nextNodeId: 'ch10-corridor-king',
      },
      {
        id: 'ch10-hub-decision',
        text: 'Decide what to do with a method that survives by turning decisions into paperwork.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch10:proof:charter',
          'tok:ch10:proof:signet',
          'tok:ch10:proof:templates',
          'tok:ch10:proof:memoirs',
          'tok:ch10:proof:bundle',
          'tok:ch10:proof:seal-match',
        ],
        nextNodeId: 'ch10-decision',
      },
      {
        id: 'ch10-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch10-charter': {
    id: 'ch10-charter',
    speaker: 'Narrator',
    text: 'The charter copy is written in the kind of script that assumes it will be obeyed.

It does not flatter the envoy. It limits the envoy.

Your office exists because the delegations could not agree on who should speak for Concord when Concord was burning. The text does not call it “war.” It calls it “dispute.”

Near the end is a clause you have never seen cited in debate: the envoy may name a signatory when a process is used to hide a decision.

It is a small line. It is also a weapon that was never popular enough to become tradition.',
    choices: [
      {
        id: 'ch10-charter-note',
        text: 'Memorize the clause. You may need to quote it without warning.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'The envoy charter includes a clause allowing the envoy to name a signatory when process is used to hide a decision.',
      },
    ],
  },

  'ch10-signet': {
    id: 'ch10-signet',
    speaker: 'Narrator',
    text: 'The signet book is not a book of names. It is a book of shapes.

Old delegation marks. Concord clerk-stamps. A set of neutral seals meant to look boring.

One page is newer than the rest.

The seal impression there has been pressed too many times for something that is supposed to be rare. Someone is spending authority like coin.

If you had to describe the corridor in a single image, it would be this: a stamp worn smooth by use.',
    choices: [
      {
        id: 'ch10-signet-note',
        text: 'Commit the new seal impression to memory.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'A recently added seal impression in the signet book has been used far more than a “rare emergency” mark should be.',
      },
    ],
  },

  'ch10-templates': {
    id: 'ch10-templates',
    speaker: 'Narrator',
    text: 'The template shelf is the corridor made visible.

Forms for reroutes. Forms for “temporary custody.” Forms for “clarifying” old orders.

The words are careful. They never say who chooses.

They say the choice happened. They say the choice was necessary. They say the choice was always going to happen.

In the margin, a clerk has written a shorthand note: “If challenged, cite continuity.”',
    choices: [
      {
        id: 'ch10-templates-note',
        text: 'Take down the template name and the clerk shorthand.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'Continuity templates frame decisions as inevitabilities and instruct clerks to cite continuity when challenged.',
      },
    ],
  },

  'ch10-memoirs': {
    id: 'ch10-memoirs',
    speaker: 'Narrator',
    text: 'The memoir is written by an envoy whose name has been struck out in the catalog.

It is not heroic writing.

It is a record of rooms, of bargains, of papers that arrived on the desk already decided.

One passage sticks:

“I thought power lived in the summit chamber. It lives in the copy rooms. The summit chamber makes declarations. The copy rooms make habits.”

The envoy ends with advice that reads like resignation: never fight the corridor directly unless you are ready to live in it.',
    choices: [
      {
        id: 'ch10-memoirs-note',
        text: 'Close the memoir and keep the sentence about copy rooms in mind.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'An earlier envoy wrote that real power lives in the copy rooms; summits declare, but paperwork creates habits.',
      },
    ],
  },

  'ch10-payoff-audit': {
    id: 'ch10-payoff-audit',
    speaker: 'Narrator',
    text: 'Your inquiry has made the corridor nervous.

A clerk brings you a sealed bundle that would normally take weeks to request.

The seal is intact. That is the point. Someone wants you to know they can still keep parts of the Hall closed.

Inside are docket ranges tied to reroute templates. The same handwriting appears across months.

Not a delegation hand.

A Concord hand.',
    choices: [
      {
        id: 'ch10-payoff-audit-note',
        text: 'Keep the docket ranges and the handwriting pattern in mind.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'A sealed docket bundle links reroute templates to repeating handwriting over months — a Concord hand, not any delegation.',
      },
    ],
  },

  'ch10-payoff-seize': {
    id: 'ch10-payoff-seize',
    speaker: 'Narrator',
    text: 'You compare impressions.

The seized stampwork matches the new page in the signet book.

That does not prove who pressed it. It proves something simpler: the corridor is not improvising.

It has a recognized toolset.

The Hall has been training itself to obey an emergency mark until the mark became routine.',
    choices: [
      {
        id: 'ch10-payoff-seize-note',
        text: 'Note the match. Proof does not need to be dramatic to be lethal.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
        revealsInfo: 'Seized stampwork matches a recently added signet-book impression, suggesting the corridor uses recognized emergency tools that have become routine.',
      },
    ],
  },

  'ch10-corridor-king': {
    id: 'ch10-corridor-king',
    speaker: 'Master Clerk Oren Vale',
    text: 'The person who arrives looks ordinary enough to be ignored in any room.

Oren Vale wears a clerk’s coat. The kind that collects ink stains and never collects blame.

"Envoy," Vale says. "You keep trying to make the Hall admit it chooses."',
    choices: [
      {
        id: 'ch10-corridor-king-ask',
        text: 'Ask whether Vale is the one issuing continuity orders.',
        effects: [],
        nextNodeId: 'ch10-corridor-king-ask',
      },
      {
        id: 'ch10-corridor-king-charter',
        text: 'Quote the charter clause about naming a signatory when process hides a decision.',
        effects: [],
        requiresAllTokens: ['tok:ch10:proof:charter'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch10-corridor-king-charter',
      },
      {
        id: 'ch10-corridor-king-seal',
        text: 'Describe the worn emergency seal and ask who is authorized to press it.',
        effects: [],
        requiresAnyTokens: ['tok:ch10:proof:signet', 'tok:ch10:proof:seal-match'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch10-corridor-king-seal',
      },
      {
        id: 'ch10-corridor-king-back',
        text: 'Step away and return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-corridor-king-ask': {
    id: 'ch10-corridor-king-ask',
    speaker: 'Master Clerk Oren Vale',
    text: 'Vale’s eyes flick toward the template shelf.

"You want a villain," they say. "A hand you can bind. A name you can put in a report."

They shake their head.

"Continuity is not one person. It is a set of refusals. Refusal to wait. Refusal to negotiate. Refusal to be embarrassed in public."',
    choices: [
      {
        id: 'ch10-corridor-king-ask-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-corridor-king-charter': {
    id: 'ch10-corridor-king-charter',
    speaker: 'Master Clerk Oren Vale',
    text: 'Vale listens without blinking.

"That clause was written by people who thought a rule could tame a corridor," they say.

"You can name a signatory. The Hall can decide the signatory was acting alone."

They lean closer.

"If you want to win, you need more than a rule. You need the delegations to want the same outcome at the same time. That is rarer than any seal."',
    choices: [
      {
        id: 'ch10-corridor-king-charter-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-corridor-king-seal': {
    id: 'ch10-corridor-king-seal',
    speaker: 'Master Clerk Oren Vale',
    text: 'Vale’s mouth turns, almost into a smile.

"Authorized," they repeat. "That is a fine word. It makes people sleep."',
    choices: [
      {
        id: 'ch10-corridor-king-seal-audit',
        text: 'Tell Vale you have already forced the ledger into daylight. Ask what the corridor does when it is watched.',
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch10-corridor-king-seal-audit',
      },
      {
        id: 'ch10-corridor-king-seal-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-corridor-king-seal-audit': {
    id: 'ch10-corridor-king-seal-audit',
    speaker: 'Master Clerk Oren Vale',
    text: '"It learns to look sincere," Vale says.

"It produces committees. It produces apologies. It produces a new corridor that promises to do better." They shrug.

"Then it keeps moving."',
    choices: [
      {
        id: 'ch10-corridor-king-seal-audit-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-decision': {
    id: 'ch10-decision',
    speaker: 'Narrator',
    text: 'You have enough to act.

Nothing here will feel final. Corridors do not end. They reroute.

But you can choose what kind of reroute the Hall will learn from you.',
    choices: [
      {
        id: 'ch10-decision-oversight',
        text: 'Invoke the charter clause: name continuity as a function and require an envoy countersign on every reroute template.',
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }, { factionId: 'iron-pact', reputationChange: 1 }],
        exclusiveGroup: 'ch10-corridor-decision',
        requiresAllTokens: ['tok:ch10:proof:charter', 'tok:ch10:proof:templates'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:outcome:oversight'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:oversight' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🧷 Corridor: Continuity named and bound to envoy countersign on reroute templates.' },
        ],
        nextNodeId: 'ch10-ending-oversight',
      },
      {
        id: 'ch10-decision-trap',
        text: 'Set a stamp-trap: issue a dummy reroute that can only be activated by the worn emergency seal, then seize the hand that presses it.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch10-corridor-decision',
        requiresAnyTokens: ['tok:ch10:proof:seal-match', 'tok:ch08:outcome:seize'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:outcome:trap'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:trap' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 2 },
          { kind: 'log', message: '🪤 Corridor: Seal trap set to catch the hand that activates anonymous reroutes.' },
        ],
        nextNodeId: 'ch10-ending-trap',
      },
      {
        id: 'ch10-decision-ward',
        text: 'Bind the templates to visible marks: every emergency order leaves a trace the corridor cannot file away as routine.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch10-corridor-decision',
        requiresAnyTokens: ['tok:ch08:outcome:ward', 'tok:ch07:outcome:ward', 'tok:ch10:proof:templates'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Corridor: Continuity templates bound to visible marks that survive filing.' },
        ],
        nextNodeId: 'ch10-ending-ward',
      },
      {
        id: 'ch10-decision-bonds',
        text: 'Attach bonds to authority: emergency delays become escrow terms keyed to the reroute templates that cause harm.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch10-corridor-decision',
        requiresAnyTokens: ['tok:ch08:outcome:escrow', 'tok:ch09:outcome:bonds', 'tok:ch10:proof:bundle'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:outcome:bonds'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:bonds' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Corridor: Authority bound to escrow terms keyed to reroute templates.' },
        ],
        nextNodeId: 'ch10-ending-bonds',
      },
      {
        id: 'ch10-decision-expose',
        text: 'Build a public packet: charter clause, template names, and docket ranges, then force the delegations to argue in the open.',
        effects: [{ factionId: 'ember-throne', reputationChange: -1 }, { factionId: 'iron-pact', reputationChange: 1 }],
        exclusiveGroup: 'ch10-corridor-decision',
        requiresAnyTokens: ['tok:ch08:outcome:audit', 'tok:ch10:proof:bundle', 'tok:ch10:proof:memoirs'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch10:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Corridor: Public packet forced delegations to argue about method-authority in the open.' },
        ],
        nextNodeId: 'ch10-ending-expose',
      },
      {
        id: 'ch10-decision-quiet',
        text: 'Do not strike yet. Follow the next docket bundle and learn who the corridor serves.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch10-corridor-decision',
        grantsTokens: ['tok:ch10:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-10:resolved' },
          { kind: 'milestone:add', id: 'chapter-10:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Corridor: Evidence gathered quietly while the method continues.' },
        ],
        nextNodeId: 'ch10-ending-quiet',
      },
      {
        id: 'ch10-decision-back',
        text: 'Not yet. Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-oversight': {
    id: 'ch10-ending-oversight',
    speaker: 'Narrator',
    text: 'You do not destroy the corridor.

You put your name on its paperwork.

For a time, it will move more slowly. For a time, the Hall will have to look you in the eye before it calls harm “routine.”',
    choices: [
      {
        id: 'ch10-ending-oversight-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-trap': {
    id: 'ch10-ending-trap',
    speaker: 'Narrator',
    text: 'A trap is a form of honesty.

It admits that someone will try again.

If you catch a hand, the Hall will argue about whether it was authorized. If you do not, the corridor will learn a new way to press the seal.',
    choices: [
      {
        id: 'ch10-ending-trap-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-ward': {
    id: 'ch10-ending-ward',
    speaker: 'Narrator',
    text: 'You make the corridor leave marks.

Clerks will still copy. Orders will still travel.

But now the paper will remember that it was touched by choice.',
    choices: [
      {
        id: 'ch10-ending-ward-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-bonds': {
    id: 'ch10-ending-bonds',
    speaker: 'Narrator',
    text: 'You price authority.

It does not become moral. It becomes accountable to a ledger.

Someone will try to buy their way out. Someone else will learn how to collect.',
    choices: [
      {
        id: 'ch10-ending-bonds-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-expose': {
    id: 'ch10-ending-expose',
    speaker: 'Narrator',
    text: 'You force the Hall to argue about method-authority as if it were policy.

Some people will call it reform.

Others will call it sabotage.

Either way, the corridor has been named in public. That matters.',
    choices: [
      {
        id: 'ch10-ending-expose-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },

  'ch10-ending-quiet': {
    id: 'ch10-ending-quiet',
    speaker: 'Narrator',
    text: 'You choose patience.

The corridor keeps moving.

You keep watching.

In the Hall, that is sometimes the only way to learn who is really making decisions.',
    choices: [
      {
        id: 'ch10-ending-quiet-back',
        text: 'Return to the stair landing.',
        effects: [],
        nextNodeId: 'chapter-10-hub',
      },
    ],
  },
});
