import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-4-hub': {
    id: 'chapter-4-hub',
    speaker: 'Narrator',
    text: 'Back inside Concord Hall, the noise has changed. On the road you heard fear. Here you hear certainty.

The counting-house annex has been opened under temporary authority. Clerks carry ink and keys. Guards carry lists.

If the committee exists, it will not hide here. It will sit at a desk and call itself necessary.',
    choices: [
      {
        id: 'ch4-hub-auditor',
        text: 'Request the acting auditor and ask what they are empowered to do.',
        effects: [],
        nextNodeId: 'ch4-auditor',
      },
      {
        id: 'ch4-hub-floor',
        text: 'Walk the floor and watch what the clerks avoid writing down.',
        effects: [],
        nextNodeId: 'ch4-floor',
      },
      {
        id: 'ch4-hub-back',
        text: 'Step away and take stock.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch4-auditor': {
    id: 'ch4-auditor',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: 'Rook greets you with the calm of someone who expects to be blamed and has already priced it.

"Envoy," they say. "We are here to keep goods moving and keep the Hall solvent. If you ask whether that is justice, you are asking the wrong room."',
    choices: [
      {
        id: 'ch4-auditor-ask-committee',
        text: 'Ask whether the committee docket is real or just a convenient phrase.',
        effects: [],
        nextNodeId: 'ch4-auditor-committee',
      },
      {
        id: 'ch4-auditor-press-audit',
        text: 'Tell Rook you demanded a formal audit: authority must sign its work.',
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch4-react-audit',
      },
      {
        id: 'ch4-auditor-press-iron',
        text: 'Tell Rook you put the authority file into Iron custody with signature demands.',
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch4-react-iron',
      },
      {
        id: 'ch4-auditor-press-verdant',
        text: 'Tell Rook the Archive will control access to the committee trail.',
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch4-react-verdant',
      },
      {
        id: 'ch4-auditor-press-ember',
        text: 'Tell Rook you bound the trail to liability and paper through an Ember bargain.',
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch4-react-ember',
      },
      {
        id: 'ch4-auditor-press-quiet',
        text: 'Ask what happens if an envoy keeps a trail private instead of weaponizing it.',
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch4-react-quiet',
      },
      {
        id: 'ch4-auditor-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-react-audit': {
    id: 'ch4-react-audit',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: 'Rook nods once.

"You want signatures," they say. "Then you want scarcity. Some people will refuse to sign. Others will sign and demand a price for the risk."',
    choices: [
      {
        id: 'ch4-react-audit-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-react-iron': {
    id: 'ch4-react-iron',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: '"Iron custody," Rook repeats. Their voice stays polite.

"That will stop some thieves. It will also teach anyone smart to hide behind an Iron badge."',
    choices: [
      {
        id: 'ch4-react-iron-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-react-verdant': {
    id: 'ch4-react-verdant',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: 'Rook glances at the clerk tables.

"Controlled access," they say. "It keeps a secret from becoming a riot. It also keeps a riot from becoming reform."',
    choices: [
      {
        id: 'ch4-react-verdant-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-react-ember': {
    id: 'ch4-react-ember',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: '"Liability," Rook says. "A rare word in a hall built on deniability."

They pause. "If you make paper dangerous, people will start paying for clean hands."',
    choices: [
      {
        id: 'ch4-react-ember-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-react-quiet': {
    id: 'ch4-react-quiet',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: 'Rook studies you for a moment.

"Private trails make private bargains," they say. "If you do not spend the truth, someone else will spend a rumor."',
    choices: [
      {
        id: 'ch4-react-quiet-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-auditor-committee': {
    id: 'ch4-auditor-committee',
    speaker: 'Acting Auditor Sable Rook',
    speakerFaction: 'ember-throne',
    text: '"Real enough to sign," Rook says. "Real enough to redirect a convoy without raising a banner. That is what people like about committees. They turn policy into paperwork."',
    choices: [
      {
        id: 'ch4-auditor-committee-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-floor': {
    id: 'ch4-floor',
    speaker: 'Narrator',
    text: 'The annex is busy in a disciplined way. Every request has a form. Every form has a copy. Every copy has a destination.

The missing part is the reason. Reasons are spoken and forgotten. Copies remain.',
    choices: [
      {
        id: 'ch4-floor-back',
        text: 'Return to the annex entrance.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },
});
