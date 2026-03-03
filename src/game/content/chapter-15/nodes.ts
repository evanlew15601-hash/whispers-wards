import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-15-hub': {
    id: 'chapter-15-hub',
    speaker: 'Field Notes',
    text: 'A third address is where a corridor stops being a rumor.

It is where it becomes a policy.

You have found desks.

You have found routes.

Now you need the place where routes get copied into templates and called “how the Hall works.”',
    choices: [
      {
        id: 'ch15-hub-pattern',
        text: 'Start from your last intervention and follow where the corridor had to adapt.',
        effects: [],
        requiresAnyTokens: [
          'tok:ch14:outcome:concord',
          'tok:ch14:outcome:iron',
          'tok:ch14:outcome:verdant',
          'tok:ch14:outcome:ember',
          'tok:ch14:outcome:quiet',
        ],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch15-pattern',
      },
      {
        id: 'ch15-hub-templates',
        text: 'Enter the form library and see who is allowed to mint “routine” templates.',
        effects: [],
        grantsTokens: ['tok:ch15:proof:templates'],
        nextNodeId: 'ch15-templates',
      },
      {
        id: 'ch15-hub-minutes',
        text: 'Find the minutes ledger and learn which arguments get turned into neutral language.',
        effects: [],
        grantsTokens: ['tok:ch15:proof:minutes'],
        nextNodeId: 'ch15-minutes',
      },
      {
        id: 'ch15-hub-signatories',
        text: 'Find the signing registry and see who keeps being present without being named.',
        effects: [],
        grantsTokens: ['tok:ch15:proof:signatories'],
        nextNodeId: 'ch15-signatories',
      },
      {
        id: 'ch15-hub-cabinet',
        text: 'Inspect the template cabinet and note which clauses keep returning in different ink.',
        effects: [],
        grantsTokens: ['tok:ch15:proof:cabinet'],
        nextNodeId: 'ch15-cabinet',
      },
      {
        id: 'ch15-hub-decision',
        text: 'Decide what to do with a place that turns choices into routine.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch15:proof:pattern',
          'tok:ch15:proof:templates',
          'tok:ch15:proof:minutes',
          'tok:ch15:proof:signatories',
          'tok:ch15:proof:cabinet',
        ],
        nextNodeId: 'ch15-decision',
      },
      {
        id: 'ch15-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch15-pattern': {
    id: 'ch15-pattern',
    speaker: 'Field Notes',
    text: 'The corridor had to respond to you.

It could not do it loudly.

It did it by rerouting.

You choose which reroute to follow.',
    choices: [
      {
        id: 'ch15-pattern-concord',
        text: 'Follow the newly “official” Concord office routing.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:concord'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:proof:pattern'],
        nextNodeId: 'ch15-pattern-concord',
      },
      {
        id: 'ch15-pattern-iron',
        text: 'Follow the rank-and-consequence routing.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:iron'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:proof:pattern'],
        nextNodeId: 'ch15-pattern-iron',
      },
      {
        id: 'ch15-pattern-verdant',
        text: 'Follow the permanence-and-marks routing.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:proof:pattern'],
        nextNodeId: 'ch15-pattern-verdant',
      },
      {
        id: 'ch15-pattern-ember',
        text: 'Follow the obligation-and-liability routing.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:ember'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:proof:pattern'],
        nextNodeId: 'ch15-pattern-ember',
      },
      {
        id: 'ch15-pattern-quiet',
        text: 'Follow the corridor quietly and see where it goes when nobody announces a right to watch.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:proof:pattern'],
        nextNodeId: 'ch15-pattern-quiet',
      },
      {
        id: 'ch15-pattern-back',
        text: 'Return to the Hall.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-pattern-concord': {
    id: 'ch15-pattern-concord',
    speaker: 'Field Notes',
    text: 'You follow the new official routing.

It does what Concord always tries to do: it makes the corridor legible.

The legibility is a performance.

The bundles still go somewhere first.

Not a witness desk.

A form library.

A cabinet with no crest, only an index number.',
    choices: [
      {
        id: 'ch15-pattern-concord-note',
        text: 'Keep the index number in mind. Official routing still feeds the cabinet.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'Even after converting review into a named Concord office, corrected bundles still feed an uncrested form-library cabinet by index number.',
      },
    ],
  },

  'ch15-pattern-iron': {
    id: 'ch15-pattern-iron',
    speaker: 'Field Notes',
    text: 'You follow the rank-and-consequence routing.

Iron makes the corridor honest about one thing: somebody will be punished.

The corridor’s response is not to stop.

It is to move the choice earlier.

The bundles you expected to become “records” are rewritten into templates before they ever meet enforcement.

The cabinet is waiting.

The cabinet is always waiting.',
    choices: [
      {
        id: 'ch15-pattern-iron-note',
        text: 'Keep the lesson in mind: the corridor survives by moving the choice upstream into templates.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'Rank-and-consequence routing pushes the corridor to move decisions upstream into templates before enforcement ever sees them.',
      },
    ],
  },

  'ch15-pattern-verdant': {
    id: 'ch15-pattern-verdant',
    speaker: 'Field Notes',
    text: 'You follow the permanence-and-marks routing.

Marks that survive filing force the corridor to treat harm as something that lasts.

The corridor’s response is to change what gets filed.

Not the record.

The language.

Templates are rewritten so the future harm is called “administrative necessity” instead of “damage.”

A cabinet swallows the new words.

Then the new words become routine.',
    choices: [
      {
        id: 'ch15-pattern-verdant-note',
        text: 'Keep the pattern in mind: when marks persist, the corridor shifts language to make harm sound inevitable.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'When ward traces make harm durable, the corridor adapts by rewriting templates so harm becomes “administrative necessity” instead of damage.',
      },
    ],
  },

  'ch15-pattern-ember': {
    id: 'ch15-pattern-ember',
    speaker: 'Field Notes',
    text: 'You follow the obligation-and-liability routing.

Pricing a correction makes it collectible.

The corridor’s response is not to refuse collection.

It is to standardize the debt.

Fee annexes are copied into templates until the harm reads like a schedule.

Once the schedule is routine, nobody calls it corruption.

They call it policy.',
    choices: [
      {
        id: 'ch15-pattern-ember-note',
        text: 'Keep the pattern in mind: pricing forces the corridor to standardize, and standardization is how it survives.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'Making corrections collectible pushes the corridor to standardize fee annexes into templates; once routine, debt reads like policy rather than corruption.',
      },
    ],
  },

  'ch15-pattern-quiet': {
    id: 'ch15-pattern-quiet',
    speaker: 'Field Notes',
    text: 'You follow without being seen.

No doors announce themselves.

No clerks greet you.

You watch a bundle leave the second address.

It does not go to a desk.

It goes to shelves.

A form library.

The corridor is building its future in advance, and it does not need witnesses to do it.',
    choices: [
      {
        id: 'ch15-pattern-quiet-note',
        text: 'Keep the route in mind: second address to the form library, without witnesses.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'Following quietly reveals the second address routes corrected bundles directly into the form library shelves, without witnesses.',
      },
    ],
  },

  'ch15-templates': {
    id: 'ch15-templates',
    speaker: 'Formkeeper Ansel Roe',
    text: 'Ansel Roe stands between shelves the way a guard stands between doors.

"Envoy," Roe says. "Templates are not politics. They are survival."

They gesture to a cabinet of stamped slips.

"When the Hall is afraid, it asks for neutral language. Neutral language is just language that has not been blamed yet."',
    choices: [
      {
        id: 'ch15-templates-ask',
        text: 'Ask who decides which template becomes “routine.”',
        effects: [],
        nextNodeId: 'ch15-templates-ask',
      },
      {
        id: 'ch15-templates-back',
        text: 'Leave the form library.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-templates-ask': {
    id: 'ch15-templates-ask',
    speaker: 'Formkeeper Ansel Roe',
    text: 'Roe’s expression tightens.

"The Hall decides," they say.

Then, after a pause: "The Hall is a convenient lie."

They tap the cabinet index. "A small group writes the first draft. A smaller group approves the language. A clerk stamps it. Then it exists, and everyone pretends it always existed."',
    choices: [
      {
        id: 'ch15-templates-ask-note',
        text: 'Keep the mechanism in mind: a small group writes, a smaller group approves, and the stamp makes it feel inevitable.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'Formkeeper Roe claims templates are made inevitable by a small drafting group, a smaller approving group, and a stamp that makes the result feel like it always existed.',
      },
    ],
  },

  'ch15-minutes': {
    id: 'ch15-minutes',
    speaker: 'Field Notes',
    text: 'You find the minutes ledger.

It is not labeled “committee.”

It is labeled “coordination.”

The minutes do not record arguments.

They record outcomes.

Each outcome is written in language that sounds like weather.

Not chosen.

Not ordered.

Simply arrived.',
    choices: [
      {
        id: 'ch15-minutes-note',
        text: 'Keep the trick in mind: the minutes record outcomes while hiding the choice as tone.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'A coordination minutes ledger records outcomes in neutral, weather-like language that hides who chose them.',
      },
    ],
  },

  'ch15-signatories': {
    id: 'ch15-signatories',
    speaker: 'Field Notes',
    text: 'The signing registry is old and overfull.

Names appear.

Titles appear.

Sometimes only a docket range appears.

The same witness initials recur, and the same “temporary” title recurs.

You have seen this trick before.

A person becomes a function.

A function becomes a habit.

Then nobody remembers there was ever a person to blame.',
    choices: [
      {
        id: 'ch15-signatories-note',
        text: 'Memorize the repeating initials and the “temporary” title.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'A signing registry shows repeating witness initials and a recurring “temporary” title used like a function, obscuring personal responsibility.',
      },
    ],
  },

  'ch15-cabinet': {
    id: 'ch15-cabinet',
    speaker: 'Field Notes',
    text: 'The template cabinet is not locked.

It does not need to be.

Most people do not imagine templates as weapons.

You pull a stack and read.

The same clauses return, with small changes:

- “administrative necessity”
- “delegated instrument”
- “routine correction”

Different ink.

Same effect.

The corridor is not improvising. It is iterating.',
    choices: [
      {
        id: 'ch15-cabinet-note',
        text: 'Keep the clause cluster in mind: the same three phrases keep rewriting ownership.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
        revealsInfo: 'A template cabinet reveals recurring clause clusters (“administrative necessity”, “delegated instrument”, “routine correction”) that repeatedly rewrite ownership in different ink.',
      },
    ],
  },

  'ch15-decision': {
    id: 'ch15-decision',
    speaker: 'Field Notes',
    text: 'You have enough to act.

A desk can hide.

A room can hide.

A template cannot hide once it becomes routine.

If you take the cabinet, you are taking tomorrow.

You decide what kind of tomorrow the Hall will be forced to repeat.',
    choices: [
      {
        id: 'ch15-decision-audit',
        text: 'Force a witness audit: every template must include a witness line and a review date.',
        effects: [],
        exclusiveGroup: 'ch15-template-decision',
        requiresAnyTokens: ['tok:ch15:proof:minutes', 'tok:ch15:proof:signatories'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:outcome:audit'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:audit' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ Templates: Witness lines and review dates forced into routine forms.' },
        ],
        nextNodeId: 'ch15-ending-audit',
      },
      {
        id: 'ch15-decision-seize',
        text: 'Seize the cabinet under Iron custody and require rank ownership for each template revision.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch15-template-decision',
        requiresAnyTokens: ['tok:ch15:proof:templates', 'tok:ch15:proof:cabinet'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:outcome:seize'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:seize' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 1 },
          { kind: 'log', message: '🪖 Templates: Cabinet seized; revisions bound to rank ownership.' },
        ],
        nextNodeId: 'ch15-ending-seize',
      },
      {
        id: 'ch15-decision-marks',
        text: 'Bind templates to permanence: embed a ward trace into any clause that assigns long-term harm.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch15-template-decision',
        requiresAnyTokens: ['tok:ch15:proof:cabinet', 'tok:ch14:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:outcome:marks'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:marks' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Templates: Ward traces bound to clauses that assign long-term harm.' },
        ],
        nextNodeId: 'ch15-ending-marks',
      },
      {
        id: 'ch15-decision-bond',
        text: 'Attach liability: each template clause that assigns cost becomes a bondable obligation.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch15-template-decision',
        requiresAnyTokens: ['tok:ch15:proof:minutes', 'tok:ch14:outcome:ember'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:outcome:bond'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:bond' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Templates: Liability clauses made bondable obligations.' },
        ],
        nextNodeId: 'ch15-ending-bond',
      },
      {
        id: 'ch15-decision-expose',
        text: 'Expose the approval loop: publish the cabinet’s clause cluster and the repeating signatory initials.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch15-template-decision',
        requiresAllTokens: ['tok:ch15:proof:cabinet', 'tok:ch15:proof:signatories'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch15:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Templates: Approval loop exposed via clause clusters and repeating initials.' },
        ],
        nextNodeId: 'ch15-ending-expose',
      },
      {
        id: 'ch15-decision-quiet',
        text: 'Do not strike yet. Mark the cabinet index and watch who comes to revise it next.',
        effects: [],
        exclusiveGroup: 'ch15-template-decision',
        grantsTokens: ['tok:ch15:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-15:resolved' },
          { kind: 'milestone:add', id: 'chapter-15:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Templates: Cabinet marked; surveillance continues toward the next reviser.' },
        ],
        nextNodeId: 'ch15-ending-quiet',
      },
      {
        id: 'ch15-decision-back',
        text: 'Not yet. Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-audit': {
    id: 'ch15-ending-audit',
    speaker: 'Field Notes',
    text: 'You force witness lines into the templates.

It is not a battle.

It is a habit.

Habits are how Concord survives.

Now the corridor will have to choose whether it wants speed or anonymity more.',
    choices: [
      {
        id: 'ch15-ending-audit-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-seize': {
    id: 'ch15-ending-seize',
    speaker: 'Field Notes',
    text: 'You seize the cabinet.

Iron will call it discipline.

Someone else will call it seizure.

The corridor will call it temporary.

You have learned what it calls everything it intends to keep.',
    choices: [
      {
        id: 'ch15-ending-seize-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-marks': {
    id: 'ch15-ending-marks',
    speaker: 'Field Notes',
    text: 'You bind templates to traces that survive filing.

Verdant will call it restraint.

Now “routine” will have to carry marks.

Marks make denial harder.

That is the point.',
    choices: [
      {
        id: 'ch15-ending-marks-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-bond': {
    id: 'ch15-ending-bond',
    speaker: 'Field Notes',
    text: 'You attach obligations to the templates.

Once obligations are routine, they stop feeling like choices.

They start feeling like reality.

Ember understands that.

So does the corridor.',
    choices: [
      {
        id: 'ch15-ending-bond-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-expose': {
    id: 'ch15-ending-expose',
    speaker: 'Field Notes',
    text: 'You publish the clause cluster.

You publish the repeating initials.

You do not find one villain.

You find a loop.

A loop is a thing you can interrupt.',
    choices: [
      {
        id: 'ch15-ending-expose-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },

  'ch15-ending-quiet': {
    id: 'ch15-ending-quiet',
    speaker: 'Field Notes',
    text: 'You do not strike.

You mark the cabinet index.

You wait.

The corridor has to revise.

Revisions have hands.

You will learn whose.',
    choices: [
      {
        id: 'ch15-ending-quiet-back',
        text: 'Return to the shelves.',
        effects: [],
        nextNodeId: 'chapter-15-hub',
      },
    ],
  },
});
