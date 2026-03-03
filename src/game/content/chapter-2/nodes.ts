import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-2-hub': {
    id: 'chapter-2-hub',
    speaker: 'Archivist Mera',
    speakerFaction: 'verdant-court',
    text: 'The Concord Hall corridors thin into quieter stonework. Behind an ironwood door, Archivist Mera waits amid shelves and sealed chests—half scholar, half gatekeeper.\n\n"You bring noise from the summit," she says, not unkindly. "But if you want truth, the Hall keeps its own ledgers."',
    choices: [
      {
        id: 'ch2-ask-access',
        text: '"I need access to the restricted shelves."',
        effects: [],
        nextNodeId: 'ch2-archives-entrance',
      },
      {
        id: 'ch2-leave',
        text: '"Not yet. I need to prepare."',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch2-archives-entrance': {
    id: 'ch2-archives-entrance',
    speaker: 'Archivist Mera',
    speakerFaction: 'verdant-court',
    text: 'Mera slides a small tray of wax seals across the desk. "The restricted shelves are a promise," she says. "A promise I won\'t give to just anyone."\n\nHer gaze lingers on your hands. "Convince me you\'ll return what you take."',
    choices: [
      {
        id: 'ch2-earn-seal',
        text: 'Offer a sworn statement and accept the archivist\'s seal.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        nextNodeId: 'ch2-archives-inner',
        grantsTokens: ['tok:ch02:archives-seal'],
      },
      {
        id: 'ch2-press-with-rank',
        text: '"Time is short. I\'m acting on behalf of the Hall."',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: -2 }],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-archives-inner': {
    id: 'ch2-archives-inner',
    speaker: 'Archivist Mera',
    speakerFaction: 'verdant-court',
    text: 'The seal warms in your palm as the ironwood door unclicks. Inside, the air smells of dust and vellum—old promises and older betrayals.',
    choices: [
      {
        id: 'ch2-open-ledger',
        text: 'Break the wax on the restricted ledger.',
        effects: [],
        nextNodeId: null,
        requiresAllTokens: ['tok:ch02:archives-seal'],
        revealsInfo: 'A Concord Hall ledger shows sanctioned payments that predate the Greenmarch killings.',
      },
      {
        id: 'ch2-return-hub',
        text: 'Return to the reading room.',
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },
});
