import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-18-hub': {
    id: 'chapter-18-hub',
    speaker: 'Field Notes',
    text: 'You wanted a villain.

You found a loop.

A loop is harder.

It does not bleed when cut.

It reroutes.

It learns.

If Concord survives, it will survive by choosing what it repeats.

Now you name what you changed.',
    choices: [
      {
        id: 'ch18-hub-epilogue',
        text: 'Read the epilogue.',
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
      {
        id: 'ch18-hub-end',
        text: 'End here.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-epilogue': {
    id: 'ch18-epilogue',
    speaker: 'Field Notes',
    text: 'You cannot stop a corridor from existing.

You can decide whether it is honest.

You can decide whether it is witnessed.

You can decide whether it is priced.

You can decide whether it is marked.

You can decide whether it is named.

You read what your decision will be remembered as.',
    choices: [
      {
        id: 'ch18-epilogue-concord',
        text: 'Read the Concord epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-concord',
      },
      {
        id: 'ch18-epilogue-iron',
        text: 'Read the Iron epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-iron',
      },
      {
        id: 'ch18-epilogue-verdant',
        text: 'Read the Verdant epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-verdant',
      },
      {
        id: 'ch18-epilogue-ember',
        text: 'Read the Ember epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-ember',
      },
      {
        id: 'ch18-epilogue-expose',
        text: 'Read the exposure epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-expose',
      },
      {
        id: 'ch18-epilogue-quiet',
        text: 'Read the quiet epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-quiet',
      },
      {
        id: 'ch18-epilogue-back',
        text: 'Return.',
        effects: [],
        nextNodeId: 'chapter-18-hub',
      },
    ],
  },

  'ch18-ending-concord': {
    id: 'ch18-ending-concord',
    speaker: 'Field Notes',
    text: 'You forced the corridor into record.

Not because Concord is pure.

Because Concord is memory.

Witnesses begin to recognize patterns.

Patterns begin to feel like choices.

Choices begin to demand owners.

The corridor still moves.

Now it leaves footprints.',
    choices: [
      {
        id: 'ch18-ending-concord-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-iron': {
    id: 'ch18-ending-iron',
    speaker: 'Field Notes',
    text: 'You bound the corridor to consequence.

Iron respects rank because it makes responsibility visible.

The Hall becomes faster.

It also becomes harsher.

People begin to obey procedures the way soldiers obey orders: because the punishment is certain.

The corridor still moves.

Now it marches.',
    choices: [
      {
        id: 'ch18-ending-iron-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-verdant': {
    id: 'ch18-ending-verdant',
    speaker: 'Field Notes',
    text: 'You bound the corridor to permanence.

Verdant measures harm in what cannot be repaired.

Marks begin to appear where convenience would have burned a future.

Clerks learn to fear traces that survive copying.

The corridor still moves.

Now it has to carry what it would rather forget.',
    choices: [
      {
        id: 'ch18-ending-verdant-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-ember': {
    id: 'ch18-ending-ember',
    speaker: 'Field Notes',
    text: 'You bound the corridor to obligation.

Ember survives by pricing instability.

Once approvals have costs, anonymity stops being cheap.

A new class of clerks appears: people who can read a margin and smell a liability.

The corridor still moves.

Now it leaves invoices.',
    choices: [
      {
        id: 'ch18-ending-ember-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-expose': {
    id: 'ch18-ending-expose',
    speaker: 'Field Notes',
    text: 'You exposed the loop.

The Hall pretends it is shocked.

Then it does what it always does.

It argues about wording.

That argument buys you time.

Time buys you witnesses.

The corridor still moves.

Now it has a name that can be said out loud.',
    choices: [
      {
        id: 'ch18-ending-expose-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-quiet': {
    id: 'ch18-ending-quiet',
    speaker: 'Field Notes',
    text: 'You chose not to strike.

You learned the full route.

A corridor with one address is rumor.

A corridor with three is policy.

You now know what it serves.

You also know what it fears: being interrupted mid-repeat.

The corridor still moves.

For now.',
    choices: [
      {
        id: 'ch18-ending-quiet-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
