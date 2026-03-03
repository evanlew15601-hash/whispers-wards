import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-6-hub': {
    id: 'chapter-6-hub',
    speaker: 'Narrator',
    text: 'There is an office in Concord Hall that is always unlocked if you know which latch to lift.

No banners. No guards. Only a desk, a lamp, and a ledger that never admits it is a ledger.

If you have been looking for the committee, this is the kind of place it would call home.',
    choices: [
      {
        id: 'ch6-hub-enter',
        text: 'Enter and see who is waiting.',
        effects: [],
        nextNodeId: 'ch6-enter',
      },
      {
        id: 'ch6-hub-back',
        text: 'Not yet. Step away.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch6-enter': {
    id: 'ch6-enter',
    speaker: 'Narrator',
    text: 'A figure sits behind the desk as if they have been there all day. Their ink is dry. Their hands are clean.

"Envoy," they say. "You have been forcing the Hall to sign its work."',
    choices: [
      {
        id: 'ch6-enter-back',
        text: 'Leave the office and return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },
});
