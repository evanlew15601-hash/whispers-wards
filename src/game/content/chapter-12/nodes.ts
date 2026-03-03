import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-12-hub': {
    id: 'chapter-12-hub',
    speaker: 'Narrator',
    text: 'Every law has a margin.

In the Hall, margins are where people hide exceptions and call them mercy.

Someone has been writing in red ink.

End here for now.',
    choices: [
      {
        id: 'ch12-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
