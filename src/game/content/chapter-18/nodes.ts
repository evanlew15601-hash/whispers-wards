import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-18-hub': {
    id: 'chapter-18-hub',
    speaker: 'Field Notes',
    text: 'You wanted a villain.

You found a loop.

A loop is harder.

It does not bleed when cut.

It reroutes.

It learns.

If Concord survives, it will survive by choosing what it repeats.

Now you name what you changed.',
    choices: [
      {
        id: 'ch18-hub-epilogue',
        text: 'Read the epilogue.',
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
      {
        id: 'ch18-hub-end',
        text: 'End here.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-epilogue': {
    id: 'ch18-epilogue',
    speaker: 'Field Notes',
    text: 'You cannot stop a corridor from existing.

You can decide whether it is honest.

You can decide whether it is witnessed.

You can decide whether it is priced.

You can decide whether it is marked.

You can decide whether it is named.

You read what your decision will be remembered as.',
    choices: [
      {
        id: 'ch18-epilogue-concord',
        text: 'Read the Concord epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-concord',
      },
      {
        id: 'ch18-epilogue-iron',
        text: 'Read the Iron epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-iron',
      },
      {
        id: 'ch18-epilogue-verdant',
        text: 'Read the Verdant epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-verdant',
      },
      {
        id: 'ch18-epilogue-ember',
        text: 'Read the Ember epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-ember',
      },
      {
        id: 'ch18-epilogue-expose',
        text: 'Read the exposure epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-expose',
      },
      {
        id: 'ch18-epilogue-quiet',
        text: 'Read the quiet epilogue.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-quiet',
      },
      {
        id: 'ch18-epilogue-recap',
        text: 'Review the dossier you assembled along the way.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-epilogue-back',
        text: 'Return.',
        effects: [],
        nextNodeId: 'chapter-18-hub',
      },
    ],
  },

  'ch18-recap': {
    id: 'ch18-recap',
    speaker: 'Field Notes',
    text: 'You lay the dossier out.

Each chapter was a different kind of corridor.

The loop survived by changing shape.

You survived by learning what it serves.',
    choices: [
      {
        id: 'ch18-recap-ch12',
        text: 'Chapter XII — The Red Margin',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
      {
        id: 'ch18-recap-ch13',
        text: 'Chapter XIII — The First Recipient',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
      {
        id: 'ch18-recap-ch14',
        text: 'Chapter XIV — Second Address',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
      {
        id: 'ch18-recap-ch15',
        text: 'Chapter XV — Third Address',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
      {
        id: 'ch18-recap-ch16',
        text: 'Chapter XVI — The Approval Loop',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
      {
        id: 'ch18-recap-ch17',
        text: 'Chapter XVII — The First Beneficiary',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
      {
        id: 'ch18-recap-back',
        text: 'Return to the epilogue.',
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
    ],
  },

  'ch18-recap-ch12': {
    id: 'ch18-recap-ch12',
    speaker: 'Field Notes',
    text: 'The margin was where the Hall learned to lie without changing the printed page.

You decided what red ink would mean next.',
    choices: [
      {
        id: 'ch18-recap-ch12-chain',
        text: 'You bound red ink to rank and consequence.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:chain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-chain',
      },
      {
        id: 'ch18-recap-ch12-ward',
        text: 'You bound red ink to marks that last.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-ward',
      },
      {
        id: 'ch18-recap-ch12-bond',
        text: 'You bound red ink to obligation.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-bond',
      },
      {
        id: 'ch18-recap-ch12-record',
        text: 'You forced red ink into witness record.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:record'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-record',
      },
      {
        id: 'ch18-recap-ch12-expose',
        text: 'You exposed the red ink as method, not accident.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-expose',
      },
      {
        id: 'ch18-recap-ch12-quiet',
        text: 'You chose to watch and collect proof.',
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-quiet',
      },
      {
        id: 'ch18-recap-ch12-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch12-chain': {
    id: 'ch18-recap-ch12-chain',
    speaker: 'Field Notes',
    text: 'You treated red ink as an order that should admit its author.

Iron’s oldest story is a winter where mercy became a breach because nobody owned the consequence.

You made the margin speak in that language.

It did not make the Hall kind.

It made the Hall name who would be punished for the lie.',
    choices: [
      {
        id: 'ch18-recap-ch12-chain-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-ward': {
    id: 'ch18-recap-ch12-ward',
    speaker: 'Field Notes',
    text: 'You treated red ink as a harm that should leave a trace.

Verdant’s foundations are built on permanence: what burns does not return.

You made the margin carry that memory.

The corridor learned a new fear.

Not scandal.

Marks that survive copying.',
    choices: [
      {
        id: 'ch18-recap-ch12-ward-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-bond': {
    id: 'ch18-recap-ch12-bond',
    speaker: 'Field Notes',
    text: 'You treated red ink as debt.

Ember was built by turning instability into a price before it became a ruin.

You made the margin speak in that language.

The corridor could still lie.

Now it had to budget for the lie.',
    choices: [
      {
        id: 'ch18-recap-ch12-bond-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-record': {
    id: 'ch18-recap-ch12-record',
    speaker: 'Field Notes',
    text: 'You treated red ink as a choice that must be witnessed.

Concord’s founding wound was always the same: everyone agreed, and nobody agreed on what it meant.

You refused to let the margin become private meaning.

The corridor learned a new cost.

It could not change language without leaving a date and a line someone could point to.',
    choices: [
      {
        id: 'ch18-recap-ch12-record-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-expose': {
    id: 'ch18-recap-ch12-expose',
    speaker: 'Field Notes',
    text: 'You treated red ink as evidence.

Not of one corrupt clerk.

Of a repeatable method.

The corridor learned the oldest political lesson: once a trick can be named, it can be hunted.

It did not stop.

It started adapting sooner.',
    choices: [
      {
        id: 'ch18-recap-ch12-expose-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-quiet': {
    id: 'ch18-recap-ch12-quiet',
    speaker: 'Field Notes',
    text: 'You treated red ink as a trail.

You did not strike.

You watched who reached for the margin when they thought nobody was looking.

The corridor survives on repetition.

You started learning the repeatable part.',
    choices: [
      {
        id: 'ch18-recap-ch12-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch13': {
    id: 'ch18-recap-ch13',
    speaker: 'Field Notes',
    text: 'A corrected draft always landed somewhere first.

You found the first recipient desk, and you decided what it would be allowed to do next.',
    choices: [
      {
        id: 'ch18-recap-ch13-witness',
        text: 'You forced the first recipient into witness record.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:witness'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-witness',
      },
      {
        id: 'ch18-recap-ch13-chain',
        text: 'You bound the first recipient to enforceable rank chains.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:chain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-chain',
      },
      {
        id: 'ch18-recap-ch13-marks',
        text: 'You bound the first recipient to durable marks.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:marks'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-marks',
      },
      {
        id: 'ch18-recap-ch13-bond',
        text: 'You bound the first recipient to liability.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-bond',
      },
      {
        id: 'ch18-recap-ch13-expose',
        text: 'You exposed the desk’s function as a corridor address.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-expose',
      },
      {
        id: 'ch18-recap-ch13-quiet',
        text: 'You chose to observe who used the desk first.',
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-quiet',
      },
      {
        id: 'ch18-recap-ch13-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch13-witness': {
    id: 'ch18-recap-ch13-witness',
    speaker: 'Field Notes',
    text: 'You turned the first recipient into a witness problem.

If the desk receives a draft, it must also receive a ledger line.

Concord survives by repetition.

You forced the repetition to be visible.',
    choices: [
      {
        id: 'ch18-recap-ch13-witness-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-chain': {
    id: 'ch18-recap-ch13-chain',
    speaker: 'Field Notes',
    text: 'You turned the first recipient into an enforcement chain.

Iron does not care who is liked.

It cares who is responsible.

Now the desk could not receive drafts without a rank that could be punished for what happened next.',
    choices: [
      {
        id: 'ch18-recap-ch13-chain-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-marks': {
    id: 'ch18-recap-ch13-marks',
    speaker: 'Field Notes',
    text: 'You turned the first recipient into a trace.

Verdant’s oldest fear is permanent harm dressed as convenience.

You forced the desk to carry marks that survived filing.

The corridor learned a new limitation: it could not claim nobody touched it.',
    choices: [
      {
        id: 'ch18-recap-ch13-marks-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-bond': {
    id: 'ch18-recap-ch13-bond',
    speaker: 'Field Notes',
    text: 'You turned the first recipient into liability.

Ember does not fear instability.

It fears instability nobody will pay for.

Now the desk could not move drafts without creating obligations somebody could collect.',
    choices: [
      {
        id: 'ch18-recap-ch13-bond-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-expose': {
    id: 'ch18-recap-ch13-expose',
    speaker: 'Field Notes',
    text: 'You exposed the desk.

A desk is just furniture.

A desk that receives drafts first is policy.

Once that can be said out loud, the corridor has to defend it.

Defense is where mistakes happen.',
    choices: [
      {
        id: 'ch18-recap-ch13-expose-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-quiet': {
    id: 'ch18-recap-ch13-quiet',
    speaker: 'Field Notes',
    text: 'You watched.

The first user of a corridor always reveals what it was built for.

You did not close the desk.

You learned who reached for it when they needed an outcome without a signature.',
    choices: [
      {
        id: 'ch18-recap-ch13-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch14': {
    id: 'ch18-recap-ch14',
    speaker: 'Field Notes',
    text: 'The corridor chose its second address.

You decided what kind of audience it would have.',
    choices: [
      {
        id: 'ch18-recap-ch14-concord',
        text: 'You made the second address a Concord office.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-concord',
      },
      {
        id: 'ch18-recap-ch14-iron',
        text: 'You made the second address answer to Iron.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-iron',
      },
      {
        id: 'ch18-recap-ch14-verdant',
        text: 'You made the second address answer to Verdant.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-verdant',
      },
      {
        id: 'ch18-recap-ch14-ember',
        text: 'You made the second address answer to Ember.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-ember',
      },
      {
        id: 'ch18-recap-ch14-quiet',
        text: 'You let the second address remain unseen, to learn its full route.',
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-quiet',
      },
      {
        id: 'ch18-recap-ch14-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch14-concord': {
    id: 'ch18-recap-ch14-concord',
    speaker: 'Field Notes',
    text: 'You tried to make the corridor answer to a witnessable office.

Concord’s foundation is precedent, not force.

You forced the second address to become a place that could be pointed at.

It did not end the corridor.

It made it legible.',
    choices: [
      {
        id: 'ch18-recap-ch14-concord-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-iron': {
    id: 'ch18-recap-ch14-iron',
    speaker: 'Field Notes',
    text: 'You made the second address answer to consequence.

Iron’s foundations are built on supply lines that do not forgive.

You forced the corridor to admit it could be punished.

It adapted.

It also flinched.',
    choices: [
      {
        id: 'ch18-recap-ch14-iron-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-verdant': {
    id: 'ch18-recap-ch14-verdant',
    speaker: 'Field Notes',
    text: 'You made the second address answer to permanence.

Verdant’s foundations are built on the refusal to treat the future as fuel.

You forced the corridor to meet marks that survive filing.

It adapted by changing language.

You learned that too.',
    choices: [
      {
        id: 'ch18-recap-ch14-verdant-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-ember': {
    id: 'ch18-recap-ch14-ember',
    speaker: 'Field Notes',
    text: 'You made the second address answer to obligation.

Ember’s foundations are routes, contracts, and what happens when debt becomes law.

You forced the corridor to treat reroutes as liabilities.

It adapted by standardizing the debt.

That standardization became a map.',
    choices: [
      {
        id: 'ch18-recap-ch14-ember-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-quiet': {
    id: 'ch18-recap-ch14-quiet',
    speaker: 'Field Notes',
    text: 'You chose not to name the second address.

Naming is power.

You wanted to know the full route first.

The corridor kept moving.

So did you.

You learned it was never only one room.

It was always a chain.',
    choices: [
      {
        id: 'ch18-recap-ch14-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch15': {
    id: 'ch18-recap-ch15',
    speaker: 'Field Notes',
    text: 'The third address was where the corridor stopped pretending it was improvising.

It was iterating.

You decided what would happen to the template cabinet and the language it repeats.',
    choices: [
      {
        id: 'ch18-recap-ch15-audit',
        text: 'You forced witness lines and review dates into routine forms.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-audit',
      },
      {
        id: 'ch18-recap-ch15-seize',
        text: 'You seized the cabinet under Iron custody.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:seize'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-seize',
      },
      {
        id: 'ch18-recap-ch15-marks',
        text: 'You bound template harm to ward traces.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:marks'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-marks',
      },
      {
        id: 'ch18-recap-ch15-bond',
        text: 'You attached bondable liability to template clauses.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-bond',
      },
      {
        id: 'ch18-recap-ch15-expose',
        text: 'You exposed the approval loop behind routine language.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-expose',
      },
      {
        id: 'ch18-recap-ch15-quiet',
        text: 'You marked the cabinet and waited for the reviser.',
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-quiet',
      },
      {
        id: 'ch18-recap-ch15-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch15-audit': {
    id: 'ch18-recap-ch15-audit',
    speaker: 'Field Notes',
    text: 'You tried to make routine confess its authors.

The corridor answered by moving approval earlier.

It learned from you.

You learned from it.

That is how a loop becomes a war of habits.',
    choices: [
      {
        id: 'ch18-recap-ch15-audit-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-seize': {
    id: 'ch18-recap-ch15-seize',
    speaker: 'Field Notes',
    text: 'You put the cabinet under custody.

The corridor responded by approving drafts before objects existed.

You learned what it fears: seizure.

You also learned what it prefers: ideas that cannot be held.',
    choices: [
      {
        id: 'ch18-recap-ch15-seize-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-marks': {
    id: 'ch18-recap-ch15-marks',
    speaker: 'Field Notes',
    text: 'You put durable traces into routine.

The corridor tried to domesticate marks into decoration.

Verdant would call that contempt.

You called it evidence.',
    choices: [
      {
        id: 'ch18-recap-ch15-marks-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-bond': {
    id: 'ch18-recap-ch15-bond',
    speaker: 'Field Notes',
    text: 'You priced harm into routine language.

The corridor responded by making blame weather.

Ember recognizes the move.

If nobody owns harm, nobody pays.

You learned the loop’s preferred kind of fraud: polite abstraction.',
    choices: [
      {
        id: 'ch18-recap-ch15-bond-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-expose': {
    id: 'ch18-recap-ch15-expose',
    speaker: 'Field Notes',
    text: 'You exposed the approval loop.

It responded by approving through absence.

“No objections recorded.”

Silence as signature.

You learned how far deniability will go to keep moving.',
    choices: [
      {
        id: 'ch18-recap-ch15-expose-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-quiet': {
    id: 'ch18-recap-ch15-quiet',
    speaker: 'Field Notes',
    text: 'You waited.

Waiting was not surrender.

It was measurement.

You learned which hands returned.

You learned which stamp returned.

Repetition became a map.',
    choices: [
      {
        id: 'ch18-recap-ch15-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch16': {
    id: 'ch18-recap-ch16',
    speaker: 'Field Notes',
    text: 'The cabinet was never enough.

Approval was the real lock.

You decided what approval would have to admit.',
    choices: [
      {
        id: 'ch18-recap-ch16-concord',
        text: 'You forced recorded approval into witness logs.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-concord',
      },
      {
        id: 'ch18-recap-ch16-iron',
        text: 'You forced approval into enforceable rank chains.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-iron',
      },
      {
        id: 'ch18-recap-ch16-verdant',
        text: 'You bound approval seals to durable ward marks.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-verdant',
      },
      {
        id: 'ch18-recap-ch16-ember',
        text: 'You made approvals bondable liabilities.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-ember',
      },
      {
        id: 'ch18-recap-ch16-expose',
        text: 'You published the seal and coordination language as routine proof.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-expose',
      },
      {
        id: 'ch18-recap-ch16-quiet',
        text: 'You chose to watch the next approval happen.',
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-quiet',
      },
      {
        id: 'ch18-recap-ch16-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch16-concord': {
    id: 'ch18-recap-ch16-concord',
    speaker: 'Field Notes',
    text: 'You forced approval to become record.

Concord does not win by purity.

It wins by repetition.

Now approval repeats in a ledger where people can learn the pattern and name it.',
    choices: [
      {
        id: 'ch18-recap-ch16-concord-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-iron': {
    id: 'ch18-recap-ch16-iron',
    speaker: 'Field Notes',
    text: 'You forced approval to become consequence.

Iron will respect that.

The corridor will respond by trying to make responsibility look like air.

You learned to hunt the part that wants to be nobody.',
    choices: [
      {
        id: 'ch18-recap-ch16-iron-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-verdant': {
    id: 'ch18-recap-ch16-verdant',
    speaker: 'Field Notes',
    text: 'You forced approval to leave traces.

Verdant measures harm in what cannot be repaired.

Now approval has to carry marks that survive copying.

The corridor will still move.

It will leave evidence when it does.',
    choices: [
      {
        id: 'ch18-recap-ch16-verdant-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-ember': {
    id: 'ch18-recap-ch16-ember',
    speaker: 'Field Notes',
    text: 'You forced approval to carry a price.

Ember understands that every corridor is a route, and every route is a contract with hidden costs.

Now approval cannot be cheap.

Cheapness was how it bought anonymity.',
    choices: [
      {
        id: 'ch18-recap-ch16-ember-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-expose': {
    id: 'ch18-recap-ch16-expose',
    speaker: 'Field Notes',
    text: 'You exposed the loop as a government wearing polite language.

The Hall’s first defense is always debate.

Debate buys time.

Time buys witnesses.

You turned delay into leverage.',
    choices: [
      {
        id: 'ch18-recap-ch16-expose-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-quiet': {
    id: 'ch18-recap-ch16-quiet',
    speaker: 'Field Notes',
    text: 'You watched the next approval happen.

You learned that the corridor does not survive on genius.

It survives on repetition.

You learned where the repeat happens, and who it needs nearby.

That is what you take into the last choice.',
    choices: [
      {
        id: 'ch18-recap-ch16-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch17': {
    id: 'ch18-recap-ch17',
    speaker: 'Field Notes',
    text: 'A loop always serves someone first.

You decided what would happen to the first beneficiary: the people who needed tomorrow without signing for it.',
    choices: [
      {
        id: 'ch18-recap-ch17-concord',
        text: 'You forced simultaneous delivery so delegations no longer received tomorrow first.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-concord',
      },
      {
        id: 'ch18-recap-ch17-iron',
        text: 'You bound fast-track routine to named responsibility.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-iron',
      },
      {
        id: 'ch18-recap-ch17-verdant',
        text: 'You forced traces into delegation packets so first recipients left marks.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-verdant',
      },
      {
        id: 'ch18-recap-ch17-ember',
        text: 'You priced deniability so first beneficiaries had to pay to avoid ownership.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-ember',
      },
      {
        id: 'ch18-recap-ch17-expose',
        text: 'You published the delivery order and the seal custody column.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-expose',
      },
      {
        id: 'ch18-recap-ch17-quiet',
        text: 'You chose to watch who used first delivery to steer the next crisis.',
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-quiet',
      },
      {
        id: 'ch18-recap-ch17-back',
        text: 'Back to the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch17-concord': {
    id: 'ch18-recap-ch17-concord',
    speaker: 'Field Notes',
    text: 'You took away the privilege of being early.

That is what Concord can do when it is serious.

Not command.

Synchronize.

Now deniability has to share time with record.',
    choices: [
      {
        id: 'ch18-recap-ch17-concord-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-iron': {
    id: 'ch18-recap-ch17-iron',
    speaker: 'Field Notes',
    text: 'You forced ownership into fast-track routine.

Now every request has a rank attached.

Some ranks will refuse.

Refusal will be evidence.

Iron was built on the belief that consequence is what turns a promise into a thing that exists.',
    choices: [
      {
        id: 'ch18-recap-ch17-iron-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-verdant': {
    id: 'ch18-recap-ch17-verdant',
    speaker: 'Field Notes',
    text: 'You forced traces into delegation packets.

Verdant will call it restraint.

Now first beneficiaries cannot take tomorrow without leaving marks that survive copying.

The corridor still moves.

Now it leaves tracks when it does.',
    choices: [
      {
        id: 'ch18-recap-ch17-verdant-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-ember': {
    id: 'ch18-recap-ch17-ember',
    speaker: 'Field Notes',
    text: 'You priced deniability.

Ember understands what you did: you made silence expensive.

Now first beneficiaries will have to pay to avoid owning outcomes.

Paying is a kind of confession.

Not moral.

Useful.',
    choices: [
      {
        id: 'ch18-recap-ch17-ember-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-expose': {
    id: 'ch18-recap-ch17-expose',
    speaker: 'Field Notes',
    text: 'You published the delivery order.

In Concord, order is power.

Now the Hall has to explain why delegations were receiving tomorrow first.

That explanation will fail.

Failure is where institutions change.',
    choices: [
      {
        id: 'ch18-recap-ch17-expose-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-quiet': {
    id: 'ch18-recap-ch17-quiet',
    speaker: 'Field Notes',
    text: 'You watched.

A corridor that serves deniability will be used.

Sooner than you want.

You chose to learn which principal used first delivery to steer the next crisis.

You did not end the loop.

You learned its favorite hand.',
    choices: [
      {
        id: 'ch18-recap-ch17-quiet-back',
        text: 'Back.',
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-ending-concord': {
    id: 'ch18-ending-concord',
    speaker: 'Field Notes',
    text: 'You forced simultaneity.

Delegations no longer receive tomorrow first.

The corridor can still move.

Now it cannot move ahead of memory.

Concord does not win by command.

It wins by making the record arrive on time.

The corridor still moves.

Now its first footprints appear when it does.',
    choices: [
      {
        id: 'ch18-ending-concord-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-concord-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-iron': {
    id: 'ch18-ending-iron',
    speaker: 'Field Notes',
    text: 'You forced ownership into fast-track routine.

A request that used to be tone now needs a name.

Iron respects rank because it makes responsibility visible.

Some ranks refuse.

Refusal becomes evidence.

The corridor still moves.

Now it marches with blame attached.',
    choices: [
      {
        id: 'ch18-ending-iron-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-iron-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-verdant': {
    id: 'ch18-ending-verdant',
    speaker: 'Field Notes',
    text: 'You forced traces into the first deliveries.

Verdant measures harm in what cannot be repaired.

Now the packets that used to carry deniability also carry marks that survive copying.

The corridor still moves.

Now it leaves tracks when it serves the people who cannot afford to sign.',
    choices: [
      {
        id: 'ch18-ending-verdant-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-verdant-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-ember': {
    id: 'ch18-ending-ember',
    speaker: 'Field Notes',
    text: 'You priced deniability.

A fast-track request becomes a bondable obligation.

Ember survives by pricing instability.

Now silence is no longer free.

The corridor still moves.

Now it invoices the people who used to call their signatures “unnecessary.”',
    choices: [
      {
        id: 'ch18-ending-ember-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-ember-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-expose': {
    id: 'ch18-ending-expose',
    speaker: 'Field Notes',
    text: 'You published the schedule.

You published the custody column.

The Hall pretends it is shocked.

Then it does what it always does.

It argues about wording.

That argument buys you time.

Time buys you witnesses.

The corridor still moves.

Now its first service has been named: deniability.',
    choices: [
      {
        id: 'ch18-ending-expose-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-expose-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-quiet': {
    id: 'ch18-ending-quiet',
    speaker: 'Field Notes',
    text: 'You chose not to strike.

You learned the full route.

A corridor with one address is rumor.

A corridor with three is policy.

You learned the first beneficiary.

You also learned what the loop fears: being interrupted mid-repeat.

The corridor still moves.

For now.',
    choices: [
      {
        id: 'ch18-ending-quiet-recap',
        text: 'Review the dossier.',
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-quiet-end',
        text: 'End.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});
