import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-3-hub': {
    id: 'chapter-3-hub',
    speaker: 'Narrator',
    text: 'The Root-Archive sits in a shallow valley beyond the road. Stone steps descend to a sealed door. Verdant marks sit alongside clerk-script and old Concord stamps.

A young courier waits by the entrance. An Iron scout watches the path from a distance. Someone has tried to make this place neutral. Someone else has tried to make it useful.',
    choices: [
      {
        id: 'ch3-hub-curator',
        text: 'Request entry and ask for the curator by name.',
        effects: [],
        nextNodeId: 'ch3-curator',
      },
      {
        id: 'ch3-hub-scout',
        text: 'Speak to the Iron scout and ask what they are here to prevent.',
        effects: [],
        nextNodeId: 'ch3-scout',
      },
      {
        id: 'ch3-hub-courier',
        text: 'Question the courier about who sent them and what they carried.',
        effects: [],
        nextNodeId: 'ch3-courier',
      },
      {
        id: 'ch3-hub-back',
        text: 'Step away from the door and reconsider.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch3-curator': {
    id: 'ch3-curator',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'Hest keeps his hands clean by never touching anything directly. He uses a cloth for the latch. He uses titles for people.

"Envoy," he says. "If Ash Road taught you anything, it should have taught you that paper is a tool. It can be a tool for order. It can be a tool for theft. The difference is rarely the ink."',
    choices: [
      {
        id: 'ch3-curator-margin',
        text: 'Ask about the ward keys hidden in margins.',
        effects: [],
        nextNodeId: 'ch3-margin-keys',
      },
      {
        id: 'ch3-curator-ask-entry',
        text: 'Request access to the sealed registers.',
        effects: [],
        nextNodeId: 'ch3-sealed-registers',
      },
      {
        id: 'ch3-curator-back',
        text: 'Leave the curator to his work.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-margin-keys': {
    id: 'ch3-margin-keys',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'Hest looks past you, as if checking whether the idea is listening.

"A ward key is not a spell," he says. "It is permission. When it appears where it should not, it means someone is granting permission without saying so. That is the part I worry about."',
    choices: [
      {
        id: 'ch3-margin-note',
        text: 'Ask what the Archive can prove, not what it suspects.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        nextNodeId: 'ch3-margin-proof',
      },
      {
        id: 'ch3-margin-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-margin-proof': {
    id: 'ch3-margin-proof',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: '"Proof is the wrong word," Hest says. "The Archive is not a court. It is a memory.

But yes. The ink has a lineage. The stamps have a chain. If someone built a committee that issues authority through paperwork and ward craft, the Archive will show where it started."',
    choices: [
      {
        id: 'ch3-margin-close',
        text: 'Tell him you will return with a specific docket to trace.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-sealed-registers': {
    id: 'ch3-sealed-registers',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'He does not refuse. He does not agree.

"Access is a policy question," he says. "If I open a sealed register for you, I am setting a rule that outlives both of us. If I refuse, someone less careful will come later with a better threat."',
    choices: [
      {
        id: 'ch3-registers-pledge',
        text: 'Offer a written pledge: no copies, no names, only chain-of-authority.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        nextNodeId: 'ch3-registers-result',
        revealsInfo: 'You offered a pledge to limit what you take from the Root-Archive: chain-of-authority without names.',
      },
      {
        id: 'ch3-registers-pressure',
        text: 'Tell him the road is already being strangled by hidden rules.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: -1 }],
        nextNodeId: 'ch3-registers-result',
      },
      {
        id: 'ch3-registers-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-registers-result': {
    id: 'ch3-registers-result',
    speaker: 'Narrator',
    text: 'The curator does not give you what you want. He gives you a path to it.

A list of committee stamps that exist outside the delegations. A sequence of docket formats that predate recent crises. Enough to follow, not enough to burn.

If the committee is real, it did not begin on Ash Road.',
    choices: [
      {
        id: 'ch3-registers-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-scout': {
    id: 'ch3-scout',
    speaker: 'Scout Rell',
    speakerFaction: 'iron-pact',
    text: 'Rell keeps his hands near his belt but not on the hilt.

"I\'m not here to threaten druids," he says. "I\'m here because if the wrong record comes out of that door, someone will use it to justify a purge. People like justification more than they like truth."',
    choices: [
      {
        id: 'ch3-scout-ask',
        text: 'Ask who he thinks will do it.',
        effects: [],
        nextNodeId: 'ch3-scout-ask',
      },
      {
        id: 'ch3-scout-back',
        text: 'Leave him to his watch.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-scout-ask': {
    id: 'ch3-scout-ask',
    speaker: 'Scout Rell',
    speakerFaction: 'iron-pact',
    text: '"Anyone with the will," he says. "If you build a system where orders can be issued without a face, the only safeguard is who has the courage to refuse. That courage runs out."',
    choices: [
      {
        id: 'ch3-scout-note',
        text: 'Thank him and return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-courier': {
    id: 'ch3-courier',
    speaker: 'Courier Sera',
    text: 'Sera\'s boots are still muddy from the road. She does not seem impressed by the Archive.

"I was paid to carry a packet," she says. "No seal. No name. Just a place to drop it." She looks at you. "If you want a neutral story, don\'t hire couriers. Hire liars."',
    choices: [
      {
        id: 'ch3-courier-open',
        text: 'Ask what the packet smelled like and what it weighed.',
        effects: [],
        nextNodeId: 'ch3-courier-detail',
      },
      {
        id: 'ch3-courier-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-courier-detail': {
    id: 'ch3-courier-detail',
    speaker: 'Courier Sera',
    text: '"Paper and ash wax," she says. "The kind of seal that breaks if you breathe on it. Whoever paid me wanted the look of authority. They didn\'t want responsibility."',
    choices: [
      {
        id: 'ch3-courier-note',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },
});
