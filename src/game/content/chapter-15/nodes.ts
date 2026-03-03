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

End here for now.',
    choices: [
      {
        id: 'ch15-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
