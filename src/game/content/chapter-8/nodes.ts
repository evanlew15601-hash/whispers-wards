import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-8-hub': {
    id: 'chapter-8-hub',
    speaker: 'Narrator',
    text: 'The River Gate did not end the argument. It moved it.

Someone is keeping a ledger on the quay. Someone is balancing losses against obedience.

If you want to understand how continuity feeds itself, you start by finding who is doing the counting.',
    choices: [
      {
        id: 'ch8-hub-aftermath',
        text: 'Take stock of what your decision at the river actually changed.',
        effects: [],
        nextNodeId: 'ch8-aftermath',
      },
      {
        id: 'ch8-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch8-aftermath': {
    id: 'ch8-aftermath',
    speaker: 'Narrator',
    text: 'The Hall does not keep promises. It keeps habits.

The river is where habits become visible.',
    choices: [
      {
        id: 'ch8-aftermath-release',
        text: 'Consider the release order you issued, and the record you forced onto paper.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:release'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-release',
      },
      {
        id: 'ch8-aftermath-cordon',
        text: 'Consider the cordon you kept, and the signatures you demanded.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:cordon'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-cordon',
      },
      {
        id: 'ch8-aftermath-escrow',
        text: 'Consider the escrow bond you imposed, and what it taught the Hall to price.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-escrow',
      },
      {
        id: 'ch8-aftermath-ward',
        text: 'Consider the ward-mark you bound to emergency authority.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-ward',
      },
      {
        id: 'ch8-aftermath-expose',
        text: 'Consider the scandal you forced, and what it will make the office do next.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-expose',
      },
      {
        id: 'ch8-aftermath-quiet',
        text: 'Consider the proof you kept, and the method you let continue.',
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-quiet',
      },
      {
        id: 'ch8-aftermath-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-release': {
    id: 'ch8-aftermath-release',
    speaker: 'Narrator',
    text: 'The barges moved. People ate.

And somewhere in Concord, a clerk copied your record into a template for the next emergency.

Mercy becomes precedent faster than you expect.',
    choices: [
      {
        id: 'ch8-aftermath-release-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-cordon': {
    id: 'ch8-aftermath-cordon',
    speaker: 'Narrator',
    text: 'The line held.

The method slowed.

A slow injustice still counts as injustice. It just becomes easier to accept as weather.',
    choices: [
      {
        id: 'ch8-aftermath-cordon-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-escrow': {
    id: 'ch8-aftermath-escrow',
    speaker: 'Narrator',
    text: 'The bond made harm expensive.

It also made harm legible.

When the Hall learns a new math, it will try to use it for everything.',
    choices: [
      {
        id: 'ch8-aftermath-escrow-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-ward': {
    id: 'ch8-aftermath-ward',
    speaker: 'Narrator',
    text: 'A visible mark does not stop a decision.

It stops the lie that nobody decided.

If the office survives, it will survive in daylight.',
    choices: [
      {
        id: 'ch8-aftermath-ward-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-expose': {
    id: 'ch8-aftermath-expose',
    speaker: 'Narrator',
    text: 'A scandal is a fire.

It spreads. It consumes. It teaches everyone nearby how to run.

The office will not vanish. It will learn to change its clothing faster.',
    choices: [
      {
        id: 'ch8-aftermath-expose-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-quiet': {
    id: 'ch8-aftermath-quiet',
    speaker: 'Narrator',
    text: 'Keeping proof is a kind of power.

It is also a kind of loneliness.

The method kept moving. You kept watching. Both choices will come due.',
    choices: [
      {
        id: 'ch8-aftermath-quiet-back',
        text: 'Return to the quay.',
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },
});
