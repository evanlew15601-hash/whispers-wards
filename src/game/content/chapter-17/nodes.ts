import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-17-hub': {
    id: 'chapter-17-hub',
    speaker: 'Field Notes',
    text: 'A government always serves someone first.

Not the public.

Not the delegations.

A first beneficiary.

End here for now.',
    choices: [
      {
        id: 'ch17-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
