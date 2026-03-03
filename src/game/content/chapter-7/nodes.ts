import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-7-hub': {
    id: 'chapter-7-hub',
    speaker: 'Narrator',
    text: 'Dawn at the River Gate smells like wet stone and old iron.

Barges wait in a line that looks polite until you notice the soldiers counting them. Couriers wait with stamped packets they cannot open. Merchants wait with faces trained to look harmless.

Whatever you did in the Hall has reached the water. It has changed who is allowed to move.',
    choices: [
      {
        id: 'ch7-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
