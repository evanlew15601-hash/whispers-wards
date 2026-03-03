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

Somewhere above it, someone is deciding which delays count as emergencies and which people count as collateral.

If you want to end a method, you eventually have to meet the person who benefits from it.',
    choices: [
      {
        id: 'ch10-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
