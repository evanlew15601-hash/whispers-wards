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
        id: 'ch4-hub-petitions',
        text: 'Read the stack of petitions nobody has stamped yet.',
        effects: [],
        nextNodeId: 'ch4-petitions',
      },
      {
        id: 'ch4-hub-ledgers',
        text: 'Ask to see the annex ledgers and the fee schedules that are moving goods.',
        effects: [],
        nextNodeId: 'ch4-ledgers',
      },
      {
        id: 'ch4-hub-session',
        text: 'Call a session in the annex and force the authority question into the open.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch04:proof:authority',
          'tok:ch04:proof:missing-lines',
          'tok:ch04:proof:petitions',
          'tok:ch04:proof:cutouts',
        ],
        nextNodeId: 'ch4-session',
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
        id: 'ch4-auditor-ask-authority',
        text: 'Demand to see the authority letter that opened the annex.',
        effects: [],
        grantsTokens: ['tok:ch04:proof:authority'],
        nextNodeId: 'ch4-authority-letter',
      },
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

  'ch4-authority-letter': {
    id: 'ch4-authority-letter',
    speaker: 'Narrator',
    text: 'The authority letter is a single page. It invokes emergency trade continuity. It cites a committee docket and a custody clause.

It is signed.

Not by any of the three delegations.

The signature is an official mark you have seen before on quieter paperwork.',
    choices: [
      {
        id: 'ch4-authority-letter-note',
        text: 'Memorize the clause and keep the signature shape in mind.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
        revealsInfo: 'The annex authority letter is signed under a committee docket by a Concord official outside the three delegations.',
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

You find a pattern in what is missing.

Requests are recorded. Approvals are recorded. The denials are spoken and never written down.',
    choices: [
      {
        id: 'ch4-floor-mark',
        text: 'Mark the missing denials as a deliberate habit.',
        effects: [],
        grantsTokens: ['tok:ch04:proof:missing-lines'],
        nextNodeId: 'chapter-4-hub',
        revealsInfo: 'Annex clerks record approvals and requests, but denials are kept off paper to avoid a trail.',
      },
    ],
  },

  'ch4-petitions': {
    id: 'ch4-petitions',
    speaker: 'Narrator',
    text: 'The petitions are written in different hands and the same desperation.

A miller wants their seized flour released before it spoils. A guard wants their wages paid on time. A Verdant courier wants a travel ward honored.

None of them are addressed to a delegation. All of them are addressed to the annex.',
    choices: [
      {
        id: 'ch4-petitions-index',
        text: 'Index the petitions and keep the names and dates intact.',
        effects: [],
        grantsTokens: ['tok:ch04:proof:petitions'],
        nextNodeId: 'chapter-4-hub',
        revealsInfo: 'A stack of petitions shows the annex is becoming a direct authority people appeal to, bypassing delegations.',
      },
    ],
  },

  'ch4-ledgers': {
    id: 'ch4-ledgers',
    speaker: 'Narrator',
    text: 'The ledgers smell like vinegar and old ink. Fees are listed as storage. Inspections. Escort. Emergency continuity.

The numbers do not hurt anyone directly. The pattern does.

The same few names appear as intermediaries. The same fees recur whenever a shipment changes hands on paper.',
    choices: [
      {
        id: 'ch4-ledgers-copy',
        text: 'Copy the fee pattern and note the intermediaries.',
        effects: [],
        grantsTokens: ['tok:ch04:proof:cutouts'],
        nextNodeId: 'chapter-4-hub',
        revealsInfo: 'Annex ledgers show repeated fees routed through the same intermediaries whenever shipments are reissued on paper.',
      },
    ],
  },

  'ch4-session': {
    id: 'ch4-session',
    speaker: 'Narrator',
    text: 'You call the annex into a room with a door that shuts.

A clerk arrives with ink on their fingers. A guard arrives with a hand near their belt. Rook arrives with a clean coat.

You do not have to convince them the annex is powerful. You have to decide what kind of power it is allowed to be.',
    choices: [
      {
        id: 'ch4-session-appeals',
        text: 'Create an appeals channel and force every seizure to answer a stamped petition.',
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch04:proof:petitions'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch04:outcome:appeals'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-4:resolved' },
          { kind: 'milestone:add', id: 'chapter-4:resolved:appeals' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '📬 Counting-House: Appeals channel imposed on annex seizures.' },
        ],
        nextNodeId: 'ch4-ending-appeals',
      },
      {
        id: 'ch4-session-publish',
        text: 'Publish the fee pattern and the missing denials. Make the annex answer in public.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -4 }],
        requiresAllTokens: ['tok:ch04:proof:cutouts', 'tok:ch04:proof:missing-lines'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch04:outcome:publish'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-4:resolved' },
          { kind: 'milestone:add', id: 'chapter-4:resolved:publish' },
          { kind: 'tension', a: 'ember-throne', b: 'iron-pact', delta: 6 },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Counting-House: Annex patterns published and denials dragged onto paper.' },
        ],
        nextNodeId: 'ch4-ending-publish',
      },
      {
        id: 'ch4-session-suspend',
        text: 'Suspend the annex authority letter and force every order back through a delegation.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }, { factionId: 'ember-throne', reputationChange: -2 }],
        requiresAllTokens: ['tok:ch04:proof:authority'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch04:outcome:suspend'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-4:resolved' },
          { kind: 'milestone:add', id: 'chapter-4:resolved:suspend' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 2 },
          { kind: 'log', message: '🛑 Counting-House: Annex authority suspended and orders forced back to delegations.' },
        ],
        nextNodeId: 'ch4-ending-suspend',
      },
      {
        id: 'ch4-session-liability',
        text: 'Bind the annex to liability: any order without a name becomes a debt on the signer.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch04:proof:cutouts'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch04:outcome:liability'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-4:resolved' },
          { kind: 'milestone:add', id: 'chapter-4:resolved:liability' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Counting-House: Liability charter imposed on annex orders.' },
        ],
        nextNodeId: 'ch4-ending-liability',
      },
      {
        id: 'ch4-session-quiet',
        text: 'Make a private correction: change the fee schedule, remove one intermediary, and leave the story unspoken.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        grantsTokens: ['tok:ch04:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-4:resolved' },
          { kind: 'milestone:add', id: 'chapter-4:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Counting-House: Quiet correction made to annex terms without public rupture.' },
        ],
        nextNodeId: 'ch4-ending-quiet',
      },
      {
        id: 'ch4-session-back',
        text: 'Adjourn. You need more on paper before you force policy.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-ending-appeals': {
    id: 'ch4-ending-appeals',
    speaker: 'Narrator',
    text: 'You turn the petitions into a weapon that looks like mercy.

Clerks hate it. It creates work. Guards hate it. It creates delay. People who were ignored learn where to aim their anger.

The annex survives. It also becomes answerable in a way it was not built to be.',
    choices: [
      {
        id: 'ch4-ending-appeals-back',
        text: 'Return to the hall.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-ending-publish': {
    id: 'ch4-ending-publish',
    speaker: 'Narrator',
    text: 'The first copy is read aloud. The second copy is copied again. The third copy becomes a rumor with numbers.

Someone will swear the ledger is a lie. Someone else will swear it proves everything.

You do not control which version survives. You control that the annex can no longer pretend it leaves no marks.',
    choices: [
      {
        id: 'ch4-ending-publish-back',
        text: 'Return to the hall.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-ending-suspend': {
    id: 'ch4-ending-suspend',
    speaker: 'Narrator',
    text: 'The annex authority letter is pulled out from under the desk it lived on.

The clerks protest. Rook does not. The guard looks relieved and terrified.

You forced a return to visible power. The question now is whether visible power will behave better, or simply behave louder.',
    choices: [
      {
        id: 'ch4-ending-suspend-back',
        text: 'Return to the hall.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-ending-liability': {
    id: 'ch4-ending-liability',
    speaker: 'Narrator',
    text: 'You turn anonymous authority into a bill.

The annex will still issue orders. It will just have to choose who signs them.

Rook smiles once, and you see a thought: if the Hall can be made to pay for its paper, it can be made to negotiate with it.',
    choices: [
      {
        id: 'ch4-ending-liability-back',
        text: 'Return to the hall.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },

  'ch4-ending-quiet': {
    id: 'ch4-ending-quiet',
    speaker: 'Narrator',
    text: 'Nothing is announced.

The fee schedule shifts. One intermediary stops appearing on paper. The annex continues as if it always meant to behave this way.

You bought a calmer week. You may have bought a stronger machine.',
    choices: [
      {
        id: 'ch4-ending-quiet-back',
        text: 'Return to the hall.',
        effects: [],
        nextNodeId: 'chapter-4-hub',
      },
    ],
  },
});
