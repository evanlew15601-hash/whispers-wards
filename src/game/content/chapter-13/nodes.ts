import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-13-hub': {
    id: 'chapter-13-hub',
    speaker: 'Narrator',
    text: 'A corrected draft always lands somewhere first.

Not the archive.

A desk.

A person.

If you want the corridor to have an owner, you start by finding who receives the red ink bundles before anyone else is allowed to see them.',
    choices: [
      {
        id: 'ch13-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
