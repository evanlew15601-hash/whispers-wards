import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-17-hub': {
    id: 'chapter-17-hub',
    speaker: 'Field Notes',
    text: `A government always serves someone first.

Not the public.

Not the delegations.

A first beneficiary.

You have followed desks.

You have followed rooms.

Now you follow what gets delivered first, and to whom.`,
    choices: [
      {
        id: 'ch17-hub-distribution',
        text: `Find the distribution schedule and see which offices receive approved templates before the archive does.`,
        effects: [],
        grantsTokens: ['tok:ch17:proof:distribution'],
        nextNodeId: 'ch17-distribution',
      },
      {
        id: 'ch17-hub-private',
        text: `Follow the approval seal’s travel log and see where it goes when it is “not in use.”`,
        effects: [],
        grantsTokens: ['tok:ch17:proof:seallog'],
        nextNodeId: 'ch17-seallog',
      },
      {
        id: 'ch17-hub-queue',
        text: `Check which cases get “routine” fast-tracked after your last intervention.`,
        effects: [],
        grantsTokens: ['tok:ch17:proof:queue'],
        nextNodeId: 'ch17-queue',
      },
      {
        id: 'ch17-hub-benefit',
        text: `Compare the first deliveries to the delegations’ stated foundations and see who is being insulated from blame.`,
        effects: [],
        grantsTokens: ['tok:ch17:proof:beneficiary'],
        nextNodeId: 'ch17-beneficiary',
      },
      {
        id: 'ch17-hub-decision',
        text: `Decide what to do with the first beneficiary.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch17:proof:distribution',
          'tok:ch17:proof:seallog',
          'tok:ch17:proof:queue',
          'tok:ch17:proof:beneficiary',
        ],
        nextNodeId: 'ch17-decision',
      },
      {
        id: 'ch17-hub-back',
        text: `End here for now.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch17-distribution': {
    id: 'ch17-distribution',
    speaker: 'Field Notes',
    text: `The distribution schedule is a list of rooms that pretend to be equal.

The order gives it away.

The archive is not first.

The witness desk is not first.

Three sealed packets always go out before anything becomes “record.”

One to a fortress liaison office.

One to a warden’s clerk.

One to a counting-house courier.

The delegations receive tomorrow before Concord is allowed to remember it.`,
    choices: [
      {
        id: 'ch17-distribution-note',
        text: `Keep the order in mind: delegation liaisons receive approved language before the archive does.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
        revealsInfo: 'Distribution schedules send sealed packets to delegation liaison offices before witness desks or archives, giving delegations early access to approved language.',
      },
    ],
  },

  'ch17-seallog': {
    id: 'ch17-seallog',
    speaker: 'Field Notes',
    text: `The seal’s travel log is kept like a confession nobody intends to make.

Hours.

Initials.

A blank column labeled “custody.”

The seal spends more time “in custody” than “in use.”

Custody points to the same corridor doors you learned to fear.

Not a committee.

Private rooms where people can claim they never approved anything.

They only “held the seal.”`,
    choices: [
      {
        id: 'ch17-seallog-note',
        text: `Keep the custody trick in mind: approvals hide inside “holding,” not signing.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
        revealsInfo: 'The approval seal travel log emphasizes “custody” over “use,” implying approvals are hidden as mere holding rather than named signing.',
      },
    ],
  },

  'ch17-queue': {
    id: 'ch17-queue',
    speaker: 'Field Notes',
    text: `You read the fast-track queue.

The cases that move first are not the most urgent.

They are the most politically dangerous.

They are the cases where a delegation would otherwise have to say “yes” out loud.

The corridor exists to spare them that sentence.

It is not mercy.

It is insulation.`,
    choices: [
      {
        id: 'ch17-queue-note',
        text: `Keep the pattern in mind: fast-tracked cases are the ones that would force an explicit delegation yes.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
        revealsInfo: 'Fast-tracked cases cluster around politically dangerous decisions that would otherwise require explicit delegation approval.',
      },
    ],
  },

  'ch17-beneficiary': {
    id: 'ch17-beneficiary',
    speaker: 'Field Notes',
    text: `You compare the first deliveries to the delegations’ foundations.

Iron wants consequence without debate.

Verdant wants restraint without panic.

Ember wants obligation without confession.

The corridor gives each delegation what it wants most.

And it asks for one thing in return.

Silence.

The first beneficiary is not one faction.

It is the people who need to be surprised last: delegation principals and their fixers.

They get policy without signatures.

They get outcomes without ownership.`,
    choices: [
      {
        id: 'ch17-beneficiary-note',
        text: `Keep the conclusion in mind: the loop first serves leaders who need plausible deniability.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
        revealsInfo: 'Comparing deliveries suggests the loop serves delegation principals and fixers first, giving them outcomes without signatures and insulating them from blame.',
      },
    ],
  },

  'ch17-decision': {
    id: 'ch17-decision',
    speaker: 'Field Notes',
    text: `You have enough to act.

A corridor survives by serving whoever can punish it.

If you want it to stop serving deniability first, you have to change what gets delivered first.

You decide what Concord will repeat.`,
    choices: [
      {
        id: 'ch17-decision-concord',
        text: `Force simultaneous delivery: archive and witness desks receive approved templates at the same time as delegations.`,
        effects: [],
        exclusiveGroup: 'ch17-beneficiary',
        requiresAnyTokens: ['tok:ch17:proof:distribution', 'tok:ch17:proof:seallog'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch17:outcome:concord'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:concord' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ First Beneficiary: Simultaneous delivery forced; delegations no longer receive tomorrow first.' },
        ],
        nextNodeId: 'ch17-ending-concord',
      },
      {
        id: 'ch17-decision-iron',
        text: `Force ownership: delegation liaisons must attach a named rank to any request for fast-track routine.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch17-beneficiary',
        requiresAnyTokens: ['tok:ch17:proof:queue', 'tok:ch17:proof:beneficiary'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch17:outcome:iron'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:iron' },
          { kind: 'log', message: '🪖 First Beneficiary: Fast-track routine bound to named ranks and enforceable ownership.' },
        ],
        nextNodeId: 'ch17-ending-iron',
      },
      {
        id: 'ch17-decision-verdant',
        text: `Force durable traces: delegation packets must carry a ward mark that survives copying and reveals first recipients.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch17-beneficiary',
        requiresAnyTokens: ['tok:ch17:proof:distribution', 'tok:ch17:proof:beneficiary'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch17:outcome:verdant'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:verdant' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 First Beneficiary: Delegation packets bound to ward marks that reveal first recipients.' },
        ],
        nextNodeId: 'ch17-ending-verdant',
      },
      {
        id: 'ch17-decision-ember',
        text: `Force prices: delegation requests for routine fast-track become bondable liabilities.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch17-beneficiary',
        requiresAnyTokens: ['tok:ch17:proof:queue', 'tok:ch17:proof:seallog'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch17:outcome:ember'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:ember' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 First Beneficiary: Fast-track deniability priced as bondable liabilities.' },
        ],
        nextNodeId: 'ch17-ending-ember',
      },
      {
        id: 'ch17-decision-expose',
        text: `Expose the order: publish the distribution schedule and the seal custody column as proof of deniability first.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch17-beneficiary',
        requiresAllTokens: ['tok:ch17:proof:distribution', 'tok:ch17:proof:seallog'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch17:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 First Beneficiary: Distribution order and seal custody published; deniability made visible.' },
        ],
        nextNodeId: 'ch17-ending-expose',
      },
      {
        id: 'ch17-decision-quiet',
        text: `Do not strike yet. Watch which principal uses the first delivery to steer the next crisis.`,
        effects: [],
        exclusiveGroup: 'ch17-beneficiary',
        grantsTokens: ['tok:ch17:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-17:resolved' },
          { kind: 'milestone:add', id: 'chapter-17:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ First Beneficiary: Surveillance continues; the next crisis will reveal the first user.' },
        ],
        nextNodeId: 'ch17-ending-quiet',
      },
      {
        id: 'ch17-decision-back',
        text: `Not yet. Return to the schedule.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-concord': {
    id: 'ch17-ending-concord',
    speaker: 'Field Notes',
    text: `You force simultaneity.

It does not make the delegations honest.

It makes them early no longer.

That is enough to change how a corridor thinks.

Now it cannot protect deniability without creating record at the same time.`,
    choices: [
      {
        id: 'ch17-ending-concord-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-iron': {
    id: 'ch17-ending-iron',
    speaker: 'Field Notes',
    text: `You force rank ownership.

Someone will refuse.

Refusal is evidence.

Iron was built on the belief that a promise without consequence is a lie.

Now the corridor will have to decide whether it wants speed more than it wants to stay anonymous.`,
    choices: [
      {
        id: 'ch17-ending-iron-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-verdant': {
    id: 'ch17-ending-verdant',
    speaker: 'Field Notes',
    text: `You force traces into the delegation packets.

Verdant will call it restraint.

A trace does not stop a hand.

It tells you which hand to watch.

Now first beneficiaries will leave marks when they take tomorrow.`,
    choices: [
      {
        id: 'ch17-ending-verdant-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-ember': {
    id: 'ch17-ending-ember',
    speaker: 'Field Notes',
    text: `You put a price on fast-track deniability.

Ember will understand.

So will everyone who has ever tried to call a bribe a fee.

Now the first beneficiary will have to pay to avoid owning the outcome.

Paying is a kind of confession.`,
    choices: [
      {
        id: 'ch17-ending-ember-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-expose': {
    id: 'ch17-ending-expose',
    speaker: 'Field Notes',
    text: `You publish the order of delivery.

It looks small.

A schedule.

A column.

But in Concord, order is power.

Now the Hall has to argue about why delegations receive tomorrow first.

That argument is a blade.

It cuts deniability.`,
    choices: [
      {
        id: 'ch17-ending-expose-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },

  'ch17-ending-quiet': {
    id: 'ch17-ending-quiet',
    speaker: 'Field Notes',
    text: `You choose to watch.

A corridor that serves deniability will always be used.

Sooner than you want.

In a crisis.

By a principal who cannot afford to sign.

You will see the hand.

Then you will decide what kind of peace Concord deserves.`,
    choices: [
      {
        id: 'ch17-ending-quiet-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-17-hub',
      },
    ],
  },
});
