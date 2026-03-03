import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

const baseDialogueTree = defineDialogueTree({
  'chapter-18-hub': {
    id: 'chapter-18-hub',
    speaker: 'Field Notes',
    text: `You wanted a villain.

You found a loop.

A loop is harder.

It does not bleed when cut.

It reroutes.

It learns.

If Concord survives, it will survive by choosing what it repeats.

Now you name what you changed.`,
    choices: [
      {
        id: 'ch18-hub-epilogue',
        text: `Read the epilogue.`,
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
      {
        id: 'ch18-hub-end',
        text: `End here.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-epilogue': {
    id: 'ch18-epilogue',
    speaker: 'Field Notes',
    text: `You cannot stop a corridor from existing.

You can decide whether it is honest.

You can decide whether it is witnessed.

You can decide whether it is priced.

You can decide whether it is marked.

You can decide whether it is named.

You read what your decision will be remembered as.`,
    choices: [
      {
        id: 'ch18-epilogue-concord',
        text: `Read the Concord epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-concord',
      },
      {
        id: 'ch18-epilogue-iron',
        text: `Read the Iron epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-iron',
      },
      {
        id: 'ch18-epilogue-verdant',
        text: `Read the Verdant epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-verdant',
      },
      {
        id: 'ch18-epilogue-ember',
        text: `Read the Ember epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-ember',
      },
      {
        id: 'ch18-epilogue-expose',
        text: `Read the exposure epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-expose',
      },
      {
        id: 'ch18-epilogue-quiet',
        text: `Read the quiet epilogue.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-ending-quiet',
      },
      {
        id: 'ch18-epilogue-recap',
        text: `Review the dossier you assembled along the way.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-epilogue-back',
        text: `Return.`,
        effects: [],
        nextNodeId: 'chapter-18-hub',
      },
    ],
  },

  'ch18-recap': {
    id: 'ch18-recap',
    speaker: 'Field Notes',
    text: `You lay the dossier out.

Each chapter was a different kind of corridor.

The loop survived by changing shape.

You survived by learning what it serves.

You separate the record into sections so your memory does not flatten it into a single story.`,
    choices: [
      {
        id: 'ch18-recap-early',
        text: `Chapters II–VI — How the method learned to hide.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
      {
        id: 'ch18-recap-mid',
        text: `Chapters VII–XI — How the method learned to move.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
      {
        id: 'ch18-recap-late',
        text: `Chapters XII–XVII — How the method learned to repeat.`,
        effects: [],
        nextNodeId: 'ch18-recap-late',
      },
      {
        id: 'ch18-recap-back',
        text: `Return to the epilogue.`,
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
    ],
  },

  'ch18-recap-early': {
    id: 'ch18-recap-early',
    speaker: 'Field Notes',
    text: `You start where you started: on the road.

The early record is not about villains.

It is about a machine discovering it can act like weather.`,
    choices: [
      {
        id: 'ch18-recap-early-ch02',
        text: `Chapter II — Ash Road`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
      {
        id: 'ch18-recap-early-ch03',
        text: `Chapter III — Root-Archive`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
      {
        id: 'ch18-recap-early-ch04',
        text: `Chapter IV — Counting-House Annex`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
      {
        id: 'ch18-recap-early-ch05',
        text: `Chapter V — Oathline`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
      {
        id: 'ch18-recap-early-ch06',
        text: `Chapter VI — Quiet Office`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
      {
        id: 'ch18-recap-early-sections',
        text: `Back to dossier sections.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-recap-early-epilogue',
        text: `Return to the epilogue.`,
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
    ],
  },

  'ch18-recap-mid': {
    id: 'ch18-recap-mid',
    speaker: 'Field Notes',
    text: `The middle record is the part people remember as crisis.

This is where the method stopped hiding behind paperwork and started moving bodies by moving paper.`,
    choices: [
      {
        id: 'ch18-recap-mid-ch07',
        text: `Chapter VII — River Gate`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
      {
        id: 'ch18-recap-mid-ch08',
        text: `Chapter VIII — Quay Ledger`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
      {
        id: 'ch18-recap-mid-ch09',
        text: `Chapter IX — Docket Stair`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
      {
        id: 'ch18-recap-mid-ch10',
        text: `Chapter X — Corridor King`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
      {
        id: 'ch18-recap-mid-ch11',
        text: `Chapter XI — Drafting Table`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
      {
        id: 'ch18-recap-mid-sections',
        text: `Back to dossier sections.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-recap-mid-epilogue',
        text: `Return to the epilogue.`,
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
    ],
  },

  'ch18-recap-late': {
    id: 'ch18-recap-late',
    speaker: 'Field Notes',
    text: `Once red ink appeared, the corridor stopped pretending it was accidental.

You learned to read the loop as a repeatable method.`,
    choices: [
      {
        id: 'ch18-recap-late-ch12',
        text: `Chapter XII — The Red Margin`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
      {
        id: 'ch18-recap-late-ch13',
        text: `Chapter XIII — The First Recipient`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
      {
        id: 'ch18-recap-late-ch14',
        text: `Chapter XIV — Second Address`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
      {
        id: 'ch18-recap-late-ch15',
        text: `Chapter XV — Third Address`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
      {
        id: 'ch18-recap-late-ch16',
        text: `Chapter XVI — The Approval Loop`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
      {
        id: 'ch18-recap-late-ch17',
        text: `Chapter XVII — The First Beneficiary`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
      {
        id: 'ch18-recap-late-sections',
        text: `Back to dossier sections.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-recap-late-epilogue',
        text: `Return to the epilogue.`,
        effects: [],
        nextNodeId: 'ch18-epilogue',
      },
    ],
  },

  'ch18-recap-ch02': {
    id: 'ch18-recap-ch02',
    speaker: 'Field Notes',
    text: `Ash Road was the first place you watched procedure turn into force.

The line did not move because people agreed.

The line moved because someone learned how to write delay in a hand nobody could argue with.`,
    choices: [
      {
        id: 'ch18-recap-ch02-stopgap',
        text: `You moved the essentials and bought time.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:stopgap'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-stopgap',
      },
      {
        id: 'ch18-recap-ch02-iron',
        text: `You kept the barrier and forced seizures onto record.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-iron',
      },
      {
        id: 'ch18-recap-ch02-verdant',
        text: `You shifted traffic with a reroute ward.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-verdant',
      },
      {
        id: 'ch18-recap-ch02-ember',
        text: `You let Ember administer the road through fees and escrow terms.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-ember',
      },
      {
        id: 'ch18-recap-ch02-expose',
        text: `You exposed the irregular chain and made denial costly.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-expose',
      },
      {
        id: 'ch18-recap-ch02-committee',
        text: `You named the committee docket and demanded written authority.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:committee'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch02-committee',
      },
      {
        id: 'ch18-recap-ch02-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
    ],
  },

  'ch18-recap-ch02-stopgap': {
    id: 'ch18-recap-ch02-stopgap',
    speaker: 'Field Notes',
    text: `You got the essential wagons moving under escort.

You did not solve the machinery behind the delay.

You learned the first shape of the corridor: emergency as alibi.`,
    choices: [
      {
        id: 'ch18-recap-ch02-stopgap-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch02-iron': {
    id: 'ch18-recap-ch02-iron',
    speaker: 'Field Notes',
    text: `You kept the barrier and forced seizures to happen in front of witnesses.

Iron prefers visible responsibility, even when responsibility hurts.

It made the road slower.

It also made the anger aimable.`,
    choices: [
      {
        id: 'ch18-recap-ch02-iron-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch02-verdant': {
    id: 'ch18-recap-ch02-verdant',
    speaker: 'Field Notes',
    text: `You moved the pressure by moving the route.

Verdant’s answer was not speed.

It was permanence: do not let the chokepoint decide who starves.

The corridor learned it could be redirected.

So did you.`,
    choices: [
      {
        id: 'ch18-recap-ch02-verdant-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch02-ember': {
    id: 'ch18-recap-ch02-ember',
    speaker: 'Field Notes',
    text: `You opened the road by giving it terms.

Ember’s instinct is older than Ash Road: if a route is unstable, turn instability into fees before it becomes ruin.

The corridor learned that obligation can move goods when consent cannot.`,
    choices: [
      {
        id: 'ch18-recap-ch02-ember-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch02-expose': {
    id: 'ch18-recap-ch02-expose',
    speaker: 'Field Notes',
    text: `You put the docket trail beside the copied entries and forced the room to choose a story.

Not truth.

A story it could afford.

The corridor learned the cost of being legible.

It began learning to write cleaner.`,
    choices: [
      {
        id: 'ch18-recap-ch02-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch02-committee': {
    id: 'ch18-recap-ch02-committee',
    speaker: 'Field Notes',
    text: `You named the committee docket out loud.

The demand was small: written authority for every seizure.

The consequence was large: a ghost had to learn how to hold a pen in public.`,
    choices: [
      {
        id: 'ch18-recap-ch02-committee-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch02',
      },
    ],
  },

  'ch18-recap-ch03': {
    id: 'ch18-recap-ch03',
    speaker: 'Field Notes',
    text: `The Root-Archive was where the corridor admitted it had a lineage.

A stamp is never just ink.

A stamp is permission that wants to outlive its signer.`,
    choices: [
      {
        id: 'ch18-recap-ch03-audit',
        text: `You demanded an audit and a chain-of-authority for committee orders.`,
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch03-audit',
      },
      {
        id: 'ch18-recap-ch03-iron',
        text: `You gave Iron the stamp lineage and asked it to enforce signatures.`,
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch03-iron',
      },
      {
        id: 'ch18-recap-ch03-verdant',
        text: `You left the file under Verdant custody and controlled access.`,
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch03-verdant',
      },
      {
        id: 'ch18-recap-ch03-ember',
        text: `You bargained with Ember to turn authority into liability and paper trails.`,
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch03-ember',
      },
      {
        id: 'ch18-recap-ch03-quiet',
        text: `You kept the trail private and built a case without handing anyone leverage.`,
        effects: [],
        requiresAllTokens: ['tok:ch03:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch03-quiet',
      },
      {
        id: 'ch18-recap-ch03-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
    ],
  },

  'ch18-recap-ch03-audit': {
    id: 'ch18-recap-ch03-audit',
    speaker: 'Field Notes',
    text: `You accused the method instead of a person.

A chain-of-authority requirement forces power to sign its work or admit it cannot.

The corridor learned the first rule of survival: when asked to name itself, it learns to delegate.`,
    choices: [
      {
        id: 'ch18-recap-ch03-audit-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
    ],
  },

  'ch18-recap-ch03-iron': {
    id: 'ch18-recap-ch03-iron',
    speaker: 'Field Notes',
    text: `You asked Iron to solve anonymity the way it solves famine winters.

With discipline.

With consequences that outlive the excuse.

The corridor learned to fear refusal.

It also learned to hide behind rank.`,
    choices: [
      {
        id: 'ch18-recap-ch03-iron-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
    ],
  },

  'ch18-recap-ch03-verdant': {
    id: 'ch18-recap-ch03-verdant',
    speaker: 'Field Notes',
    text: `You chose controlled access.

Verdant calls it restraint.

Restraint can keep people safe.

It can also keep them obedient.

The corridor learned a second rule: if you cannot erase a record, you can lock it.`,
    choices: [
      {
        id: 'ch18-recap-ch03-verdant-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
    ],
  },

  'ch18-recap-ch03-ember': {
    id: 'ch18-recap-ch03-ember',
    speaker: 'Field Notes',
    text: `You chose leverage.

Ember understands paper trails the way it understands routes: not as truth, but as enforceable cost.

The corridor learned that liability is only a brake if someone is willing to collect.`,
    choices: [
      {
        id: 'ch18-recap-ch03-ember-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
    ],
  },

  'ch18-recap-ch03-quiet': {
    id: 'ch18-recap-ch03-quiet',
    speaker: 'Field Notes',
    text: `You kept the trail in your own hands.

You bought time.

You also left everyone else free to keep using the stamp.

The corridor learned your patience.

It began to count on it.`,
    choices: [
      {
        id: 'ch18-recap-ch03-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch03',
      },
    ],
  },

  'ch18-recap-ch04': {
    id: 'ch18-recap-ch04',
    speaker: 'Field Notes',
    text: `In the annex you learned a quieter trick.

Approvals are written.

Denials are spoken.

That is how a corridor avoids owning the harm it causes.`,
    choices: [
      {
        id: 'ch18-recap-ch04-appeals',
        text: `You created an appeals channel and forced seizures to answer stamped petitions.`,
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:appeals'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch04-appeals',
      },
      {
        id: 'ch18-recap-ch04-publish',
        text: `You published the pattern and dragged denials onto paper.`,
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:publish'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch04-publish',
      },
      {
        id: 'ch18-recap-ch04-suspend',
        text: `You suspended the annex authority and forced orders back through delegations.`,
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:suspend'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch04-suspend',
      },
      {
        id: 'ch18-recap-ch04-liability',
        text: `You bound unnamed orders to signer debt and made paper heavy.`,
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:liability'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch04-liability',
      },
      {
        id: 'ch18-recap-ch04-quiet',
        text: `You made a quiet correction and left the story unspoken.`,
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch04-quiet',
      },
      {
        id: 'ch18-recap-ch04-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
    ],
  },

  'ch18-recap-ch04-appeals': {
    id: 'ch18-recap-ch04-appeals',
    speaker: 'Field Notes',
    text: `You turned petitions into an instrument.

Not mercy.

Procedure.

A queue leaves a record.

A record leaves someone to blame.

The corridor learned to speak in stamped suffering.`,
    choices: [
      {
        id: 'ch18-recap-ch04-appeals-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
    ],
  },

  'ch18-recap-ch04-publish': {
    id: 'ch18-recap-ch04-publish',
    speaker: 'Field Notes',
    text: `You made the annex answer in public.

Publicity is not justice.

It is friction.

The corridor learned to hate friction.

It began to look for quieter rooms.`,
    choices: [
      {
        id: 'ch18-recap-ch04-publish-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
    ],
  },

  'ch18-recap-ch04-suspend': {
    id: 'ch18-recap-ch04-suspend',
    speaker: 'Field Notes',
    text: `You forced a return to visible authority.

That did not guarantee better behavior.

It guaranteed a clearer target.

The corridor learned that if you pull one office into the light, it can grow two more in shadow.`,
    choices: [
      {
        id: 'ch18-recap-ch04-suspend-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
    ],
  },

  'ch18-recap-ch04-liability': {
    id: 'ch18-recap-ch04-liability',
    speaker: 'Field Notes',
    text: `You bound unnamed orders to liability.

Ember can live with the idea.

Iron can enforce the pain.

The corridor’s response is older than both: find a hand you can afford to burn.`,
    choices: [
      {
        id: 'ch18-recap-ch04-liability-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
    ],
  },

  'ch18-recap-ch04-quiet': {
    id: 'ch18-recap-ch04-quiet',
    speaker: 'Field Notes',
    text: `You corrected the machine without embarrassing it.

The Hall loves that kind of fix.

Comfort is how bad habits become permanent.

The corridor learned that quiet can be bought.`,
    choices: [
      {
        id: 'ch18-recap-ch04-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch04',
      },
    ],
  },

  'ch18-recap-ch05': {
    id: 'ch18-recap-ch05',
    speaker: 'Field Notes',
    text: `At the oathline you saw how the Hall makes consent look like paperwork.

A clause that calls itself necessary is still a claim.

You decided what kind of claim it would be allowed to become.`,
    choices: [
      {
        id: 'ch18-recap-ch05-rewrite',
        text: `You rewrote the clause to force named authority.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:rewrite'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-rewrite',
      },
      {
        id: 'ch18-recap-ch05-counterseal',
        text: `You attached a counterseal ward so each use became visible and costly.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:counterseal'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-counterseal',
      },
      {
        id: 'ch18-recap-ch05-enforce',
        text: `You assigned Iron to enforce signatures and punish anonymous orders.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:enforce'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-enforce',
      },
      {
        id: 'ch18-recap-ch05-fund',
        text: `You priced emergency authority with a compensation bond.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:fund'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-fund',
      },
      {
        id: 'ch18-recap-ch05-expose',
        text: `You called the clause a power grab and read it aloud.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-expose',
      },
      {
        id: 'ch18-recap-ch05-delay',
        text: `You delayed renewal until the corridor revealed its hand.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:delay'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch05-delay',
      },
      {
        id: 'ch18-recap-ch05-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
    ],
  },

  'ch18-recap-ch05-rewrite': {
    id: 'ch18-recap-ch05-rewrite',
    speaker: 'Field Notes',
    text: `You forced the Hall to name its machinery.

A named office can be blamed.

It can also be defended.

Either way, the corridor lost the comfort of being a ghost.`,
    choices: [
      {
        id: 'ch18-recap-ch05-rewrite-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch05-counterseal': {
    id: 'ch18-recap-ch05-counterseal',
    speaker: 'Field Notes',
    text: `You let emergency authority live.

You made it leave bruises.

Every use gained a mark nobody could file away as routine.

The corridor learned the cost of being seen.`,
    choices: [
      {
        id: 'ch18-recap-ch05-counterseal-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch05-enforce': {
    id: 'ch18-recap-ch05-enforce',
    speaker: 'Field Notes',
    text: `You gave the clause teeth.

Iron makes anonymous authority expensive.

Iron also makes fear useful.

The corridor learned it could survive by calling itself discipline.`,
    choices: [
      {
        id: 'ch18-recap-ch05-enforce-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch05-fund': {
    id: 'ch18-recap-ch05-fund',
    speaker: 'Field Notes',
    text: `You paid for restraint.

That is an Ember move: make harm budgetable, then collect when people pretend they did not choose it.

The corridor learned that morality is negotiable.

So is the invoice.`,
    choices: [
      {
        id: 'ch18-recap-ch05-fund-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch05-expose': {
    id: 'ch18-recap-ch05-expose',
    speaker: 'Field Notes',
    text: `You made the room hear the clause as a claim.

Exposure does not remove power.

It makes power defend itself.

Defense is where corridors start making mistakes.`,
    choices: [
      {
        id: 'ch18-recap-ch05-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch05-delay': {
    id: 'ch18-recap-ch05-delay',
    speaker: 'Field Notes',
    text: `You refused to sign what you did not understand.

Delay is not neutral.

It favors whoever already benefits from the corridor.

Still, delay bought you something the Hall hates: time to watch it repeat.`,
    choices: [
      {
        id: 'ch18-recap-ch05-delay-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch05',
      },
    ],
  },

  'ch18-recap-ch06': {
    id: 'ch18-recap-ch06',
    speaker: 'Field Notes',
    text: `The quiet office was not a conspiracy.

It was a method.

A corridor built for speed, pretending it was built for stability.`,
    choices: [
      {
        id: 'ch18-recap-ch06-name',
        text: `You named the office, assigned oversight, and required signatures.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:name'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-name',
      },
      {
        id: 'ch18-recap-ch06-raid',
        text: `You seized the office and its stamps under Iron guard.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:raid'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-raid',
      },
      {
        id: 'ch18-recap-ch06-ward',
        text: `You bound the office to visible marks that made emergency orders leave fingerprints.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-ward',
      },
      {
        id: 'ch18-recap-ch06-bargain',
        text: `You priced reroutes and made the schedule harder to hide.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:bargain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-bargain',
      },
      {
        id: 'ch18-recap-ch06-expose',
        text: `You exposed the visitor list and seal pattern and forced a scandal.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-expose',
      },
      {
        id: 'ch18-recap-ch06-quiet',
        text: `You waited and let the office believe it was still invisible.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch06-quiet',
      },
      {
        id: 'ch18-recap-ch06-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-early',
      },
    ],
  },

  'ch18-recap-ch06-name': {
    id: 'ch18-recap-ch06-name',
    speaker: 'Field Notes',
    text: `You put a face on the method.

A named office is easier to fight.

It is also easier to justify.

The corridor learned that exposure can become appointment.`,
    choices: [
      {
        id: 'ch18-recap-ch06-name-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch06-raid': {
    id: 'ch18-recap-ch06-raid',
    speaker: 'Field Notes',
    text: `You answered a corridor with boots.

Iron can do that.

Paper cannot resist.

The corridor learned a new lesson: if you cannot defend your method, you must make it look like policy.`,
    choices: [
      {
        id: 'ch18-recap-ch06-raid-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch06-ward': {
    id: 'ch18-recap-ch06-ward',
    speaker: 'Field Notes',
    text: `You did not end the office.

You made it leave fingerprints.

Verdant calls that the price of pretending at justice.

The corridor learned that invisibility is a resource.

And resources can be taxed.`,
    choices: [
      {
        id: 'ch18-recap-ch06-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch06-bargain': {
    id: 'ch18-recap-ch06-bargain',
    speaker: 'Field Notes',
    text: `You taught the office to fear accounting.

A priced reroute is still a reroute.

A public schedule is still a schedule.

But now the corridor had to survive being measured.`,
    choices: [
      {
        id: 'ch18-recap-ch06-bargain-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch06-expose': {
    id: 'ch18-recap-ch06-expose',
    speaker: 'Field Notes',
    text: `You gave the Hall something it hates more than scandal.

A description of its own habit.

The corridor learned the danger of being understood.

It began to change its words.`,
    choices: [
      {
        id: 'ch18-recap-ch06-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch06-quiet': {
    id: 'ch18-recap-ch06-quiet',
    speaker: 'Field Notes',
    text: `You did not strike.

The office kept making the Hall feel calm.

You carried the proof alone.

The corridor learned what you were willing to carry.`,
    choices: [
      {
        id: 'ch18-recap-ch06-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch06',
      },
    ],
  },

  'ch18-recap-ch07': {
    id: 'ch18-recap-ch07',
    speaker: 'Field Notes',
    text: `At River Gate you watched trade move without moving.

Names changed. Weights stayed. The river waited.

The method learned it could reroute reality by rerouting paperwork.`,
    choices: [
      {
        id: 'ch18-recap-ch07-release',
        text: `You ordered a temporary release and forced seizures onto paper.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:release'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-release',
      },
      {
        id: 'ch18-recap-ch07-cordon',
        text: `You held the cordon but rejected anonymous reroute orders.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:cordon'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-cordon',
      },
      {
        id: 'ch18-recap-ch07-escrow',
        text: `You bound emergency fees into escrow bonds.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-escrow',
      },
      {
        id: 'ch18-recap-ch07-ward',
        text: `You bound reroutes to visible marks that could not be filed away.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-ward',
      },
      {
        id: 'ch18-recap-ch07-expose',
        text: `You published reissued manifests and forced a scandal.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-expose',
      },
      {
        id: 'ch18-recap-ch07-quiet',
        text: `You watched while the method continued under your eye.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch07-quiet',
      },
      {
        id: 'ch18-recap-ch07-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
    ],
  },

  'ch18-recap-ch07-release': {
    id: 'ch18-recap-ch07-release',
    speaker: 'Field Notes',
    text: `You made a small mercy loud.

The Hall hated the record.

The Hall also kept it.

That is how procedure becomes precedent: someone is forced to admit what happened.`,
    choices: [
      {
        id: 'ch18-recap-ch07-release-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch07-cordon': {
    id: 'ch18-recap-ch07-cordon',
    speaker: 'Field Notes',
    text: `You kept the line and changed what the line demanded.

No anonymous authority passed the river.

The method slowed.

It did not stop.

It started looking for signatures it could borrow.`,
    choices: [
      {
        id: 'ch18-recap-ch07-cordon-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch07-escrow': {
    id: 'ch18-recap-ch07-escrow',
    speaker: 'Field Notes',
    text: `You turned emergency authority into a bond.

The corridor could still move goods.

It just could not pretend it was free.

Ember calls that accountability.

Everyone else calls it a price.`,
    choices: [
      {
        id: 'ch18-recap-ch07-escrow-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch07-ward': {
    id: 'ch18-recap-ch07-ward',
    speaker: 'Field Notes',
    text: `You did not remove the method.

You made it leave marks.

Verdant knows this language.

Shame is a kind of brake.

The corridor learned to fear surviving proof.`,
    choices: [
      {
        id: 'ch18-recap-ch07-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch07-expose': {
    id: 'ch18-recap-ch07-expose',
    speaker: 'Field Notes',
    text: `You made the trick speak its own name.

That did not end it.

It made it adapt sooner.

Scandal is not a wall.

It is a warning that the corridor is changing routes.`,
    choices: [
      {
        id: 'ch18-recap-ch07-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch07-quiet': {
    id: 'ch18-recap-ch07-quiet',
    speaker: 'Field Notes',
    text: `You chose to watch.

A corridor that serves deniability will be used.

You started learning who needed it.

That knowledge was not clean.

It was useful.`,
    choices: [
      {
        id: 'ch18-recap-ch07-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch07',
      },
    ],
  },

  'ch18-recap-ch08': {
    id: 'ch18-recap-ch08',
    speaker: 'Field Notes',
    text: `On the quay you saw the method as accounting.

Compliance tallies.

Reroute slips.

A ledger pretending it was only numbers.`,
    choices: [
      {
        id: 'ch18-recap-ch08-audit',
        text: `You published the ledger and forced an inquiry into method-authority.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-audit',
      },
      {
        id: 'ch18-recap-ch08-seize',
        text: `You seized the ledger under Iron custody before it could disappear.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:seize'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-seize',
      },
      {
        id: 'ch18-recap-ch08-ward',
        text: `You made reroute authority leave marks that survived filing.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-ward',
      },
      {
        id: 'ch18-recap-ch08-escrow',
        text: `You bound fees into escrow bonds and made coercion collectible.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-escrow',
      },
      {
        id: 'ch18-recap-ch08-name',
        text: `You forced the ledger under named oversight as an office function.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:name'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-name',
      },
      {
        id: 'ch18-recap-ch08-quiet',
        text: `You kept the proof and watched where the ledger led.`,
        effects: [],
        requiresAllTokens: ['tok:ch08:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch08-quiet',
      },
      {
        id: 'ch18-recap-ch08-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
    ],
  },

  'ch18-recap-ch08-audit': {
    id: 'ch18-recap-ch08-audit',
    speaker: 'Field Notes',
    text: `You made the ledger public.

They argued about the numbers.

They argued about necessity.

They stopped being able to argue that the method did not exist.

The corridor learned a new cost: witnesses.`,
    choices: [
      {
        id: 'ch18-recap-ch08-audit-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch08-seize': {
    id: 'ch18-recap-ch08-seize',
    speaker: 'Field Notes',
    text: `You made the paper stop moving.

Iron custody is faster than debate.

The desire behind the paper stayed.

The corridor learned to return with new stamps.`,
    choices: [
      {
        id: 'ch18-recap-ch08-seize-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch08-ward': {
    id: 'ch18-recap-ch08-ward',
    speaker: 'Field Notes',
    text: `You did not remove the method.

You made it leave marks.

A clerk can file a lie.

A clerk cannot file away a bruise on the record.

The corridor learned to fear permanence.`,
    choices: [
      {
        id: 'ch18-recap-ch08-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch08-escrow': {
    id: 'ch18-recap-ch08-escrow',
    speaker: 'Field Notes',
    text: `You made coercion collectible.

Ember likes the idea.

Concord fears the precedent.

The corridor learned that every act of speed can be turned into an obligation.`,
    choices: [
      {
        id: 'ch18-recap-ch08-escrow-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch08-name': {
    id: 'ch18-recap-ch08-name',
    speaker: 'Field Notes',
    text: `You named the function.

The corridor hates names.

Names can be repeated.

Repetition is enforcement.

Concord was built for that kind of violence.`,
    choices: [
      {
        id: 'ch18-recap-ch08-name-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch08-quiet': {
    id: 'ch18-recap-ch08-quiet',
    speaker: 'Field Notes',
    text: `You let the ledger keep working while you watched.

The corridor took that as permission.

It used the time to build the next corridor.

You used the time to learn its handwriting.`,
    choices: [
      {
        id: 'ch18-recap-ch08-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch08',
      },
    ],
  },

  'ch18-recap-ch09': {
    id: 'ch18-recap-ch09',
    speaker: 'Field Notes',
    text: `The docket stair was where politics became docket ranges and called itself procedure.

If continuity is a corridor, this was where the corridor learned to reproduce.`,
    choices: [
      {
        id: 'ch18-recap-ch09-freeze',
        text: `You issued a docket freeze and forced review.`,
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:freeze'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch09-freeze',
      },
      {
        id: 'ch18-recap-ch09-purge',
        text: `You purged the stair and forced the corridor into open conflict.`,
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:purge'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch09-purge',
      },
      {
        id: 'ch18-recap-ch09-ward',
        text: `You bound reroute dockets to visible ward marks.`,
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch09-ward',
      },
      {
        id: 'ch18-recap-ch09-bonds',
        text: `You attached escrow terms to docket ranges that caused harm.`,
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:bonds'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch09-bonds',
      },
      {
        id: 'ch18-recap-ch09-quiet',
        text: `You let the stair keep moving and followed its paperwork.`,
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch09-quiet',
      },
      {
        id: 'ch18-recap-ch09-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
    ],
  },

  'ch18-recap-ch09-freeze': {
    id: 'ch18-recap-ch09-freeze',
    speaker: 'Field Notes',
    text: `You bought time.

Time is what corridors spend to avoid consequences.

You made the corridor pay with its favorite currency.

It began searching for a faster pocket.`,
    choices: [
      {
        id: 'ch18-recap-ch09-freeze-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
    ],
  },

  'ch18-recap-ch09-purge': {
    id: 'ch18-recap-ch09-purge',
    speaker: 'Field Notes',
    text: `You forced the corridor into daylight.

That is a victory.

It is also an invitation.

Once a corridor is visible, the Hall starts arguing about what to rebuild in its place.`,
    choices: [
      {
        id: 'ch18-recap-ch09-purge-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
    ],
  },

  'ch18-recap-ch09-ward': {
    id: 'ch18-recap-ch09-ward',
    speaker: 'Field Notes',
    text: `You made reroutes leave marks.

Verdant would call it restraint.

Clerks called it obstruction.

The corridor called it something else and kept moving.

You learned it could change its language and keep its function.`,
    choices: [
      {
        id: 'ch18-recap-ch09-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
    ],
  },

  'ch18-recap-ch09-bonds': {
    id: 'ch18-recap-ch09-bonds',
    speaker: 'Field Notes',
    text: `You priced delay.

That is the Ember instinct: make the harm collectible.

The corridor learned to treat docket ranges like accounts.

Accounts can be hidden.

They can also be audited.`,
    choices: [
      {
        id: 'ch18-recap-ch09-bonds-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
    ],
  },

  'ch18-recap-ch09-quiet': {
    id: 'ch18-recap-ch09-quiet',
    speaker: 'Field Notes',
    text: `You let the stair keep moving.

You learned that the corridor does not survive on genius.

It survives on repetition.

Repetition is how you found the next room.`,
    choices: [
      {
        id: 'ch18-recap-ch09-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch09',
      },
    ],
  },

  'ch18-recap-ch10': {
    id: 'ch18-recap-ch10',
    speaker: 'Field Notes',
    text: `By then you were no longer chasing a person.

You were chasing a habit.

A corridor built out of refusals.`,
    choices: [
      {
        id: 'ch18-recap-ch10-oversight',
        text: `You invoked the charter clause and required envoy countersign on reroute templates.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:oversight'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-oversight',
      },
      {
        id: 'ch18-recap-ch10-trap',
        text: `You set a seal trap and seized the hand that pressed it.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:trap'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-trap',
      },
      {
        id: 'ch18-recap-ch10-ward',
        text: `You bound reroutes to marks that survived filing.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-ward',
      },
      {
        id: 'ch18-recap-ch10-bonds',
        text: `You bound corridor shortcuts into debts and bonds.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:bonds'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-bonds',
      },
      {
        id: 'ch18-recap-ch10-expose',
        text: `You exposed the corridor as method and forced the Hall to defend it.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-expose',
      },
      {
        id: 'ch18-recap-ch10-quiet',
        text: `You watched, collected proof, and let the corridor keep moving.`,
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch10-quiet',
      },
      {
        id: 'ch18-recap-ch10-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
    ],
  },

  'ch18-recap-ch10-oversight': {
    id: 'ch18-recap-ch10-oversight',
    speaker: 'Field Notes',
    text: `You tried to win with a rule.

A rule can name a signatory.

The Hall can decide the signatory acted alone.

You learned the corridor’s core defense: isolate blame and keep moving.`,
    choices: [
      {
        id: 'ch18-recap-ch10-oversight-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch10-trap': {
    id: 'ch18-recap-ch10-trap',
    speaker: 'Field Notes',
    text: `You treated the corridor like a criminal.

Set bait.

Wait.

Seize the hand.

Iron approves of the clarity.

The corridor approves of the lesson and starts hiding its hands deeper.`,
    choices: [
      {
        id: 'ch18-recap-ch10-trap-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch10-ward': {
    id: 'ch18-recap-ch10-ward',
    speaker: 'Field Notes',
    text: `You treated reroutes like fire.

Not because they are dramatic.

Because they are permanent.

A corridor that leaves marks has to account for itself.

Accounting is how habits die.`,
    choices: [
      {
        id: 'ch18-recap-ch10-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch10-bonds': {
    id: 'ch18-recap-ch10-bonds',
    speaker: 'Field Notes',
    text: `You attached cost to speed.

Ember calls it pricing instability.

Once approvals have costs, anonymity stops being cheap.

The corridor learned it could still buy silence.

It just had to budget for it.`,
    choices: [
      {
        id: 'ch18-recap-ch10-bonds-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch10-expose': {
    id: 'ch18-recap-ch10-expose',
    speaker: 'Field Notes',
    text: `You called continuity what it was.

A set of refusals.

A refusal to wait.

A refusal to negotiate.

A refusal to be embarrassed in public.

The corridor learned to apologize.

Then it kept moving.`,
    choices: [
      {
        id: 'ch18-recap-ch10-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch10-quiet': {
    id: 'ch18-recap-ch10-quiet',
    speaker: 'Field Notes',
    text: `You chose to watch.

You learned what Vale warned you: victory requires delegations to want the same outcome at the same time.

That is rarer than any seal.

The corridor survives on that rarity.`,
    choices: [
      {
        id: 'ch18-recap-ch10-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch10',
      },
    ],
  },

  'ch18-recap-ch11': {
    id: 'ch18-recap-ch11',
    speaker: 'Field Notes',
    text: `At the drafting table, you put faction foundations into the same room and asked them to behave like law.

You learned that “neutral” is a style, not a truth.

You wrote a protocol anyway.`,
    choices: [
      {
        id: 'ch18-recap-ch11-oathchain',
        text: `You wrote an oathchain protocol: rank, consequence, and punishable breach.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:oathchain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-oathchain',
      },
      {
        id: 'ch18-recap-ch11-wards',
        text: `You wrote a ward protocol: visible marks and Verdant assent for permanent-harm measures.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:wards'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-wards',
      },
      {
        id: 'ch18-recap-ch11-escrow',
        text: `You wrote an escrow protocol: bonded debts, traceable and collectible.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-escrow',
      },
      {
        id: 'ch18-recap-ch11-precedent',
        text: `You wrote a precedent protocol: witnessed record and review.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:precedent'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-precedent',
      },
      {
        id: 'ch18-recap-ch11-margin',
        text: `You made red ink actionable and treated unsigned edits as breaches.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:margin'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-margin',
      },
      {
        id: 'ch18-recap-ch11-quiet',
        text: `You did not finalize the protocol and waited for the corridor to reveal its hand.`,
        effects: [],
        requiresAllTokens: ['tok:ch11:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch11-quiet',
      },
      {
        id: 'ch18-recap-ch11-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-mid',
      },
    ],
  },

  'ch18-recap-ch11-oathchain': {
    id: 'ch18-recap-ch11-oathchain',
    speaker: 'Field Notes',
    text: `You traded discretion for predictability.

Iron likes that.

The corridor does too.

Anything predictable can be gamed.

You forced one truth onto paper: breaches have owners.`,
    choices: [
      {
        id: 'ch18-recap-ch11-oathchain-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch11-wards': {
    id: 'ch18-recap-ch11-wards',
    speaker: 'Field Notes',
    text: `You made continuity assume permanence.

Verdant likes that.

People who want speed call it obstruction.

You forced the corridor to carry marks that survive copying.

That is how you make a machine feel shame.`,
    choices: [
      {
        id: 'ch18-recap-ch11-wards-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch11-escrow': {
    id: 'ch18-recap-ch11-escrow',
    speaker: 'Field Notes',
    text: `You made the corridor pay.

Paying does not make an act moral.

It makes the act traceable.

Ember understands the difference and lives in it.`,
    choices: [
      {
        id: 'ch18-recap-ch11-escrow-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch11-precedent': {
    id: 'ch18-recap-ch11-precedent',
    speaker: 'Field Notes',
    text: `You made the corridor do its work in rooms with witnesses.

That is Concord’s best weapon.

Not force.

Memory that can be repeated.

Repetition is how a record becomes a law.`,
    choices: [
      {
        id: 'ch18-recap-ch11-precedent-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch11-margin': {
    id: 'ch18-recap-ch11-margin',
    speaker: 'Field Notes',
    text: `You made unsigned edits actionable.

Somebody stopped writing in red.

Somebody started writing in a color you did not recognize.

That is the corridor’s talent.

It changes ink.

It keeps the hand.`,
    choices: [
      {
        id: 'ch18-recap-ch11-margin-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch11-quiet': {
    id: 'ch18-recap-ch11-quiet',
    speaker: 'Field Notes',
    text: `You kept the drafts.

You watched.

In the Hall, patience is sometimes the only way to find the hand behind the ink.

The corridor counted on your patience.

You used it to count on the corridor.`,
    choices: [
      {
        id: 'ch18-recap-ch11-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch11',
      },
    ],
  },

  'ch18-recap-ch12': {
    id: 'ch18-recap-ch12',
    speaker: 'Field Notes',
    text: `The margin was where the Hall learned to lie without changing the printed page.

You decided what red ink would mean next.`,
    choices: [
      {
        id: 'ch18-recap-ch12-chain',
        text: `You bound red ink to rank and consequence.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:chain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-chain',
      },
      {
        id: 'ch18-recap-ch12-ward',
        text: `You bound red ink to marks that last.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-ward',
      },
      {
        id: 'ch18-recap-ch12-bond',
        text: `You bound red ink to obligation.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-bond',
      },
      {
        id: 'ch18-recap-ch12-record',
        text: `You forced red ink into witness record.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:record'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-record',
      },
      {
        id: 'ch18-recap-ch12-expose',
        text: `You exposed the red ink as method, not accident.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-expose',
      },
      {
        id: 'ch18-recap-ch12-quiet',
        text: `You chose to watch and collect proof.`,
        effects: [],
        requiresAllTokens: ['tok:ch12:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch12-quiet',
      },
      {
        id: 'ch18-recap-ch12-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch12-chain': {
    id: 'ch18-recap-ch12-chain',
    speaker: 'Field Notes',
    text: `You treated red ink as an order that should admit its author.

Iron’s oldest story is a winter where mercy became a breach because nobody owned the consequence.

You made the margin speak in that language.

It did not make the Hall kind.

It made the Hall name who would be punished for the lie.`,
    choices: [
      {
        id: 'ch18-recap-ch12-chain-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-ward': {
    id: 'ch18-recap-ch12-ward',
    speaker: 'Field Notes',
    text: `You treated red ink as a harm that should leave a trace.

Verdant’s foundations are built on permanence: what burns does not return.

You made the margin carry that memory.

The corridor learned a new fear.

Not scandal.

Marks that survive copying.`,
    choices: [
      {
        id: 'ch18-recap-ch12-ward-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-bond': {
    id: 'ch18-recap-ch12-bond',
    speaker: 'Field Notes',
    text: `You treated red ink as debt.

Ember was built by turning instability into a price before it became a ruin.

You made the margin speak in that language.

The corridor could still lie.

Now it had to budget for the lie.`,
    choices: [
      {
        id: 'ch18-recap-ch12-bond-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-record': {
    id: 'ch18-recap-ch12-record',
    speaker: 'Field Notes',
    text: `You treated red ink as a choice that must be witnessed.

Concord’s founding wound was always the same: everyone agreed, and nobody agreed on what it meant.

You refused to let the margin become private meaning.

The corridor learned a new cost.

It could not change language without leaving a date and a line someone could point to.`,
    choices: [
      {
        id: 'ch18-recap-ch12-record-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-expose': {
    id: 'ch18-recap-ch12-expose',
    speaker: 'Field Notes',
    text: `You treated red ink as evidence.

Not of one corrupt clerk.

Of a repeatable method.

The corridor learned the oldest political lesson: once a trick can be named, it can be hunted.

It did not stop.

It started adapting sooner.`,
    choices: [
      {
        id: 'ch18-recap-ch12-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch12-quiet': {
    id: 'ch18-recap-ch12-quiet',
    speaker: 'Field Notes',
    text: `You treated red ink as a trail.

You did not strike.

You watched who reached for the margin when they thought nobody was looking.

The corridor survives on repetition.

You started learning the repeatable part.`,
    choices: [
      {
        id: 'ch18-recap-ch12-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch12',
      },
    ],
  },

  'ch18-recap-ch13': {
    id: 'ch18-recap-ch13',
    speaker: 'Field Notes',
    text: `A corrected draft always landed somewhere first.

You found the first recipient desk, and you decided what it would be allowed to do next.`,
    choices: [
      {
        id: 'ch18-recap-ch13-witness',
        text: `You forced the first recipient into witness record.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:witness'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-witness',
      },
      {
        id: 'ch18-recap-ch13-chain',
        text: `You bound the first recipient to enforceable rank chains.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:chain'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-chain',
      },
      {
        id: 'ch18-recap-ch13-marks',
        text: `You bound the first recipient to durable marks.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:marks'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-marks',
      },
      {
        id: 'ch18-recap-ch13-bond',
        text: `You bound the first recipient to liability.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-bond',
      },
      {
        id: 'ch18-recap-ch13-expose',
        text: `You exposed the desk’s function as a corridor address.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-expose',
      },
      {
        id: 'ch18-recap-ch13-quiet',
        text: `You chose to observe who used the desk first.`,
        effects: [],
        requiresAllTokens: ['tok:ch13:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch13-quiet',
      },
      {
        id: 'ch18-recap-ch13-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap-late',
      },
    ],
  },

  'ch18-recap-ch13-witness': {
    id: 'ch18-recap-ch13-witness',
    speaker: 'Field Notes',
    text: `You turned the first recipient into a witness problem.

If the desk receives a draft, it must also receive a ledger line and a date.

Concord survives by repetition.

You forced the repetition to be visible.`,
    choices: [
      {
        id: 'ch18-recap-ch13-witness-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-chain': {
    id: 'ch18-recap-ch13-chain',
    speaker: 'Field Notes',
    text: `You turned the first recipient into an enforcement chain.

Iron does not care who is liked.

It cares who is responsible.

Now the desk could not receive drafts without a rank that could be punished for what happened next.`,
    choices: [
      {
        id: 'ch18-recap-ch13-chain-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-marks': {
    id: 'ch18-recap-ch13-marks',
    speaker: 'Field Notes',
    text: `You turned the first recipient into a trace.

Verdant’s oldest fear is permanent harm dressed as convenience.

You forced the desk to carry marks that survived filing.

The corridor learned a new limitation: it could not claim nobody touched it.`,
    choices: [
      {
        id: 'ch18-recap-ch13-marks-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-bond': {
    id: 'ch18-recap-ch13-bond',
    speaker: 'Field Notes',
    text: `You turned the first recipient into liability.

Ember does not fear instability.

It fears instability nobody will pay for.

Now the desk could not move drafts without creating obligations somebody could collect.`,
    choices: [
      {
        id: 'ch18-recap-ch13-bond-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-expose': {
    id: 'ch18-recap-ch13-expose',
    speaker: 'Field Notes',
    text: `You exposed the desk’s function.

A desk is just furniture.

A desk that receives drafts first is policy.

Once that can be said out loud, the corridor has to defend itself.

Defense is where mistakes happen.`,
    choices: [
      {
        id: 'ch18-recap-ch13-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch13-quiet': {
    id: 'ch18-recap-ch13-quiet',
    speaker: 'Field Notes',
    text: `You watched.

The first user of a corridor always reveals what it was built to serve.

You did not close the desk.

You learned who reached for it when they needed an outcome without a signature.`,
    choices: [
      {
        id: 'ch18-recap-ch13-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch13',
      },
    ],
  },

  'ch18-recap-ch14': {
    id: 'ch18-recap-ch14',
    speaker: 'Field Notes',
    text: `The corridor chose its second address.

You decided what kind of audience it would have.`,
    choices: [
      {
        id: 'ch18-recap-ch14-concord',
        text: `You made the second address a Concord office.`,
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-concord',
      },
      {
        id: 'ch18-recap-ch14-iron',
        text: `You made the second address answer to Iron.`,
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-iron',
      },
      {
        id: 'ch18-recap-ch14-verdant',
        text: `You made the second address answer to Verdant.`,
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-verdant',
      },
      {
        id: 'ch18-recap-ch14-ember',
        text: `You made the second address answer to Ember.`,
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-ember',
      },
      {
        id: 'ch18-recap-ch14-quiet',
        text: `You let the second address remain unseen, to learn its full route.`,
        effects: [],
        requiresAllTokens: ['tok:ch14:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch14-quiet',
      },
      {
        id: 'ch18-recap-ch14-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap-late',
      },
    ],
  },

  'ch18-recap-ch14-concord': {
    id: 'ch18-recap-ch14-concord',
    speaker: 'Field Notes',
    text: `You tried to make the corridor answer to a witnessable office.

Concord’s foundation is precedent, not force.

You forced the second address to become a place that could be pointed to.

It did not end the corridor.

It made it legible.`,
    choices: [
      {
        id: 'ch18-recap-ch14-concord-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-iron': {
    id: 'ch18-recap-ch14-iron',
    speaker: 'Field Notes',
    text: `You made the second address answer to consequence.

Iron’s foundations are built on supply lines that do not forgive.

You forced the corridor to admit it could be punished.

It adapted.

It also flinched.`,
    choices: [
      {
        id: 'ch18-recap-ch14-iron-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-verdant': {
    id: 'ch18-recap-ch14-verdant',
    speaker: 'Field Notes',
    text: `You made the second address answer to permanence.

Verdant’s foundations are built on the refusal to treat the future as fuel.

You forced the corridor to meet marks that survive filing.

It adapted by changing language.

You learned that too.`,
    choices: [
      {
        id: 'ch18-recap-ch14-verdant-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-ember': {
    id: 'ch18-recap-ch14-ember',
    speaker: 'Field Notes',
    text: `You made the second address answer to obligation.

Ember’s foundations are routes, contracts, and what happens when debt becomes law.

You forced the corridor to treat reroutes as liabilities.

It adapted by standardizing the debt.

That standardization became a map.`,
    choices: [
      {
        id: 'ch18-recap-ch14-ember-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch14-quiet': {
    id: 'ch18-recap-ch14-quiet',
    speaker: 'Field Notes',
    text: `You chose not to name the second address.

Naming is power.

You wanted to know the full route first.

The corridor kept moving.

So did you.

You learned it was never only one room.

It was always a chain.`,
    choices: [
      {
        id: 'ch18-recap-ch14-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch14',
      },
    ],
  },

  'ch18-recap-ch15': {
    id: 'ch18-recap-ch15',
    speaker: 'Field Notes',
    text: `The third address was where the corridor stopped pretending it was improvising.

It was iterating.

You decided what would happen to the template cabinet and the language it repeats.`,
    choices: [
      {
        id: 'ch18-recap-ch15-audit',
        text: `You forced witness lines and review dates into routine forms.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:audit'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-audit',
      },
      {
        id: 'ch18-recap-ch15-seize',
        text: `You seized the cabinet under Iron custody.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:seize'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-seize',
      },
      {
        id: 'ch18-recap-ch15-marks',
        text: `You bound template harm to ward traces.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:marks'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-marks',
      },
      {
        id: 'ch18-recap-ch15-bond',
        text: `You attached bondable liability to template clauses.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:bond'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-bond',
      },
      {
        id: 'ch18-recap-ch15-expose',
        text: `You exposed the approval loop behind routine language.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-expose',
      },
      {
        id: 'ch18-recap-ch15-quiet',
        text: `You marked the cabinet and waited for the reviser.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch15-quiet',
      },
      {
        id: 'ch18-recap-ch15-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch15-audit': {
    id: 'ch18-recap-ch15-audit',
    speaker: 'Field Notes',
    text: `You tried to make routine confess its authors.

The corridor answered by moving approval earlier.

It learned from you.

You learned from it.

That is how a loop becomes a war of habits.`,
    choices: [
      {
        id: 'ch18-recap-ch15-audit-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-seize': {
    id: 'ch18-recap-ch15-seize',
    speaker: 'Field Notes',
    text: `You put the cabinet under custody.

The corridor responded by approving drafts before objects existed.

You learned what it fears: seizure.

You also learned what it prefers: ideas that cannot be held.`,
    choices: [
      {
        id: 'ch18-recap-ch15-seize-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-marks': {
    id: 'ch18-recap-ch15-marks',
    speaker: 'Field Notes',
    text: `You put durable traces into routine.

The corridor tried to domesticate marks into decoration.

Verdant would call that contempt.

You called it evidence.`,
    choices: [
      {
        id: 'ch18-recap-ch15-marks-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-bond': {
    id: 'ch18-recap-ch15-bond',
    speaker: 'Field Notes',
    text: `You priced harm into routine language.

The corridor responded by making blame weather.

Ember recognizes the move.

If nobody owns harm, nobody pays.

You learned the loop’s preferred kind of fraud: polite abstraction.`,
    choices: [
      {
        id: 'ch18-recap-ch15-bond-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-expose': {
    id: 'ch18-recap-ch15-expose',
    speaker: 'Field Notes',
    text: `You exposed the approval loop.

It responded by approving through absence.

“No objections recorded.”

Silence as signature.

You learned how far deniability will go to keep moving.`,
    choices: [
      {
        id: 'ch18-recap-ch15-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch15-quiet': {
    id: 'ch18-recap-ch15-quiet',
    speaker: 'Field Notes',
    text: `You waited.

Waiting was not surrender.

It was measurement.

You learned which hands returned.

You learned which stamp returned.

Repetition became a map.`,
    choices: [
      {
        id: 'ch18-recap-ch15-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch15',
      },
    ],
  },

  'ch18-recap-ch16': {
    id: 'ch18-recap-ch16',
    speaker: 'Field Notes',
    text: `The cabinet was never enough.

Approval was the real lock.

You decided what approval would have to admit.`,
    choices: [
      {
        id: 'ch18-recap-ch16-concord',
        text: `You forced recorded approval into witness logs.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-concord',
      },
      {
        id: 'ch18-recap-ch16-iron',
        text: `You forced approval into enforceable rank chains.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-iron',
      },
      {
        id: 'ch18-recap-ch16-verdant',
        text: `You bound approval seals to durable ward marks.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-verdant',
      },
      {
        id: 'ch18-recap-ch16-ember',
        text: `You made approvals bondable liabilities.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-ember',
      },
      {
        id: 'ch18-recap-ch16-expose',
        text: `You published the seal and coordination language as routine proof.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-expose',
      },
      {
        id: 'ch18-recap-ch16-quiet',
        text: `You chose to watch the next approval happen.`,
        effects: [],
        requiresAllTokens: ['tok:ch16:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch16-quiet',
      },
      {
        id: 'ch18-recap-ch16-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch16-concord': {
    id: 'ch18-recap-ch16-concord',
    speaker: 'Field Notes',
    text: `You forced approval to become record.

Concord does not win by purity.

It wins by repetition.

Now approval repeats in a ledger where people can learn the pattern and name it.`,
    choices: [
      {
        id: 'ch18-recap-ch16-concord-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-iron': {
    id: 'ch18-recap-ch16-iron',
    speaker: 'Field Notes',
    text: `You forced approval to become consequence.

Iron will respect that.

The corridor will respond by trying to make responsibility look like air.

You learned to hunt the part that wants to be nobody.`,
    choices: [
      {
        id: 'ch18-recap-ch16-iron-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-verdant': {
    id: 'ch18-recap-ch16-verdant',
    speaker: 'Field Notes',
    text: `You forced approval to leave traces.

Verdant measures harm in what cannot be repaired.

Now approval has to carry marks that survive copying.

The corridor will still move.

It will leave evidence when it does.`,
    choices: [
      {
        id: 'ch18-recap-ch16-verdant-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-ember': {
    id: 'ch18-recap-ch16-ember',
    speaker: 'Field Notes',
    text: `You forced approval to carry a price.

Ember understands that every corridor is a route, and every route is a contract with hidden costs.

Now approval cannot be cheap.

Cheapness was how it bought anonymity.`,
    choices: [
      {
        id: 'ch18-recap-ch16-ember-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-expose': {
    id: 'ch18-recap-ch16-expose',
    speaker: 'Field Notes',
    text: `You exposed the loop as a government wearing polite language.

The Hall’s first defense is always debate.

Debate buys time.

Time buys witnesses.

You turned delay into leverage.`,
    choices: [
      {
        id: 'ch18-recap-ch16-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch16-quiet': {
    id: 'ch18-recap-ch16-quiet',
    speaker: 'Field Notes',
    text: `You watched the next approval happen.

You learned that the corridor does not survive on genius.

It survives on repetition.

You learned where the repeat happens, and who it needs nearby.

That is what you take into the last choice.`,
    choices: [
      {
        id: 'ch18-recap-ch16-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch16',
      },
    ],
  },

  'ch18-recap-ch17': {
    id: 'ch18-recap-ch17',
    speaker: 'Field Notes',
    text: `A loop always serves someone first.

You decided what would happen to the first beneficiary: the people who needed tomorrow without signing for it.`,
    choices: [
      {
        id: 'ch18-recap-ch17-concord',
        text: `You forced simultaneous delivery so delegations no longer received tomorrow first.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:concord'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-concord',
      },
      {
        id: 'ch18-recap-ch17-iron',
        text: `You bound fast-track routine to named responsibility.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-iron',
      },
      {
        id: 'ch18-recap-ch17-verdant',
        text: `You forced traces into delegation packets so first recipients left marks.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-verdant',
      },
      {
        id: 'ch18-recap-ch17-ember',
        text: `You priced deniability so first beneficiaries had to pay to avoid ownership.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-ember',
      },
      {
        id: 'ch18-recap-ch17-expose',
        text: `You published the delivery order and the seal custody column.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-expose',
      },
      {
        id: 'ch18-recap-ch17-quiet',
        text: `You chose to watch who used first delivery to steer the next crisis.`,
        effects: [],
        requiresAllTokens: ['tok:ch17:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch18-recap-ch17-quiet',
      },
      {
        id: 'ch18-recap-ch17-back',
        text: `Back to the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
    ],
  },

  'ch18-recap-ch17-concord': {
    id: 'ch18-recap-ch17-concord',
    speaker: 'Field Notes',
    text: `You took away the privilege of being early.

That is what Concord can do when it is serious.

Not command.

Synchronize.

Now deniability has to share time with record.`,
    choices: [
      {
        id: 'ch18-recap-ch17-concord-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-iron': {
    id: 'ch18-recap-ch17-iron',
    speaker: 'Field Notes',
    text: `You forced ownership into fast-track routine.

Now every request has a rank attached.

Some ranks will refuse.

Refusal will be evidence.

Iron was built on the belief that consequence is what turns a promise into a thing that exists.`,
    choices: [
      {
        id: 'ch18-recap-ch17-iron-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-verdant': {
    id: 'ch18-recap-ch17-verdant',
    speaker: 'Field Notes',
    text: `You forced traces into delegation packets.

Verdant will call it restraint.

Now first beneficiaries cannot take tomorrow without leaving marks that survive copying.

The corridor still moves.

Now it leaves tracks when it does.`,
    choices: [
      {
        id: 'ch18-recap-ch17-verdant-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-ember': {
    id: 'ch18-recap-ch17-ember',
    speaker: 'Field Notes',
    text: `You priced deniability.

Ember understands what you did: you made silence expensive.

Now first beneficiaries will have to pay to avoid owning outcomes.

Paying is a kind of confession.

Not moral.

Useful.`,
    choices: [
      {
        id: 'ch18-recap-ch17-ember-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-expose': {
    id: 'ch18-recap-ch17-expose',
    speaker: 'Field Notes',
    text: `You published the delivery order.

In Concord, order is power.

Now the Hall has to explain why delegations were receiving tomorrow first.

That explanation will fail.

Failure is where institutions change.`,
    choices: [
      {
        id: 'ch18-recap-ch17-expose-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-recap-ch17-quiet': {
    id: 'ch18-recap-ch17-quiet',
    speaker: 'Field Notes',
    text: `You watched.

A corridor that serves deniability will be used.

Sooner than you want.

You chose to learn which principal used first delivery to steer the next crisis.

You did not end the loop.

You learned its favorite hand.`,
    choices: [
      {
        id: 'ch18-recap-ch17-quiet-back',
        text: `Back.`,
        effects: [],
        nextNodeId: 'ch18-recap-ch17',
      },
    ],
  },

  'ch18-ending-concord': {
    id: 'ch18-ending-concord',
    speaker: 'Field Notes',
    text: `You forced simultaneity.

Delegations no longer receive tomorrow first.

The corridor can still move.

Now it cannot move ahead of memory.

Concord does not win by command.

It wins by making the record arrive on time.

The corridor still moves.

Now its first footprints appear when it does.`,
    choices: [
      {
        id: 'ch18-ending-concord-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-concord-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-iron': {
    id: 'ch18-ending-iron',
    speaker: 'Field Notes',
    text: `You forced ownership into fast-track routine.

A request that used to be tone now needs a name.

Iron respects rank because it makes responsibility visible.

Some ranks refuse.

Refusal becomes evidence.

The corridor still moves.

Now it marches with blame attached.`,
    choices: [
      {
        id: 'ch18-ending-iron-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-iron-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-verdant': {
    id: 'ch18-ending-verdant',
    speaker: 'Field Notes',
    text: `You forced traces into the first deliveries.

Verdant measures harm in what cannot be repaired.

Now the packets that used to carry deniability also carry marks that survive copying.

The corridor still moves.

Now it leaves tracks when it serves the people who cannot afford to sign.`,
    choices: [
      {
        id: 'ch18-ending-verdant-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-verdant-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-ember': {
    id: 'ch18-ending-ember',
    speaker: 'Field Notes',
    text: `You priced deniability.

A fast-track request becomes a bondable obligation.

Ember survives by pricing instability.

Now silence is no longer free.

The corridor still moves.

Now it invoices the people who used to call their signatures “unnecessary.”`,
    choices: [
      {
        id: 'ch18-ending-ember-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-ember-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-expose': {
    id: 'ch18-ending-expose',
    speaker: 'Field Notes',
    text: `You published the schedule.

You published the custody column.

The Hall pretends it is shocked.

Then it does what it always does.

It argues about wording.

That argument buys you time.

Time buys you witnesses.

The corridor still moves.

Now its first service has been named: deniability.`,
    choices: [
      {
        id: 'ch18-ending-expose-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-expose-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch18-ending-quiet': {
    id: 'ch18-ending-quiet',
    speaker: 'Field Notes',
    text: `You chose not to strike.

You learned the full route.

A corridor with one address is rumor.

A corridor with three is policy.

You learned the first beneficiary.

You also learned what the loop fears: being interrupted mid-repeat.

The corridor still moves.

For now.`,
    choices: [
      {
        id: 'ch18-ending-quiet-recap',
        text: `Review the dossier.`,
        effects: [],
        nextNodeId: 'ch18-recap',
      },
      {
        id: 'ch18-ending-quiet-end',
        text: `End.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },
});

const stripRecapOutcomeLocks = <T extends typeof baseDialogueTree>(tree: T): T => {
  const out: Record<string, unknown> = {};

  for (const [nodeId, node] of Object.entries(tree)) {
    if (!nodeId.startsWith('ch18-recap-')) {
      out[nodeId] = node;
      continue;
    }

    out[nodeId] = {
      ...node,
      choices: node.choices.map(choice => {
        if (!choice.requiresAllTokens && !choice.requiresAnyTokens) return choice;
        return {
          ...choice,
          requiresAllTokens: undefined,
          requiresAnyTokens: undefined,
          hideWhenLockedBySecrets: undefined,
        };
      }),
    };
  }

  return out as T;
};

export const dialogueTree = stripRecapOutcomeLocks(baseDialogueTree);
