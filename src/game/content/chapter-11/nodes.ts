import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-11-hub': {
    id: 'chapter-11-hub',
    speaker: 'Narrator',
    text: 'A drafting table has no opinions. It simply holds whatever you put on it.

In the Hall, that is dangerous.

Here, the corridor tries to turn your decisions into templates. You decide whether the templates obey you, or replace you.',
    choices: [
      {
        id: 'ch11-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
