import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-16-hub': {
    id: 'chapter-16-hub',
    speaker: 'Field Notes',
    text: `A template is only paper until it gets approved.

Approval is where a corridor becomes a government.

You can seize a cabinet.

You can mark a margin.

You can publish initials.

If the Hall keeps approving the same language, nothing you did stays rare.

It becomes routine.

You need the approval loop.`,
    choices: [
      {
        id: 'ch16-hub-aftermath',
        text: `Start from what you did to the templates and see how the corridor adjusted its approval habits.`,
        effects: [],
        requiresAnyTokens: [
          'tok:ch15:outcome:audit',
          'tok:ch15:outcome:seize',
          'tok:ch15:outcome:marks',
          'tok:ch15:outcome:bond',
          'tok:ch15:outcome:expose',
          'tok:ch15:outcome:quiet',
        ],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch16-aftermath',
      },
      {
        id: 'ch16-hub-committee',
        text: `Find the coordination room and listen to how approval is spoken into being.`,
        effects: [],
        grantsTokens: ['tok:ch16:proof:approvers'],
        nextNodeId: 'ch16-committee',
      },
      {
        id: 'ch16-hub-stamp',
        text: `Inspect the approval seal and learn what mark turns a template into inevitability.`,
        effects: [],
        grantsTokens: ['tok:ch16:proof:stamp'],
        nextNodeId: 'ch16-stamp',
      },
      {
        id: 'ch16-hub-witness',
        text: `Ask the witness desk how approvals are kept “routine” instead of “decided.”`,
        effects: [],
        grantsTokens: ['tok:ch16:proof:witness'],
        nextNodeId: 'ch16-witness',
      },
      {
        id: 'ch16-hub-routes',
        text: `Ask the copy room who receives a template before it is allowed to be a record.`,
        effects: [],
        grantsTokens: ['tok:ch16:proof:routes'],
        nextNodeId: 'ch16-routes',
      },
      {
        id: 'ch16-hub-decision',
        text: `Decide what to do with the approval loop.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch16:proof:pressure',
          'tok:ch16:proof:approvers',
          'tok:ch16:proof:stamp',
          'tok:ch16:proof:witness',
          'tok:ch16:proof:routes',
        ],
        nextNodeId: 'ch16-decision',
      },
      {
        id: 'ch16-hub-back',
        text: `End here for now.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch16-aftermath': {
    id: 'ch16-aftermath',
    speaker: 'Field Notes',
    text: `You cannot touch a system without teaching it something.

The corridor has been learning from you.

You decide which lesson to follow.`,
    choices: [
      {
        id: 'ch16-aftermath-audit',
        text: `Follow how the corridor reacted to witness lines and review dates.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:audit'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-audit',
      },
      {
        id: 'ch16-aftermath-seize',
        text: `Follow how the corridor reacted to Iron custody.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:seize'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-seize',
      },
      {
        id: 'ch16-aftermath-marks',
        text: `Follow how the corridor reacted to ward traces in routine forms.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:marks'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-marks',
      },
      {
        id: 'ch16-aftermath-bond',
        text: `Follow how the corridor reacted to bondable obligations.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:bond'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-bond',
      },
      {
        id: 'ch16-aftermath-expose',
        text: `Follow how the corridor reacted to public exposure.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:expose'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-expose',
      },
      {
        id: 'ch16-aftermath-quiet',
        text: `Follow how the corridor reacted when you chose to wait.`,
        effects: [],
        requiresAllTokens: ['tok:ch15:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:proof:pressure'],
        nextNodeId: 'ch16-aftermath-quiet',
      },
      {
        id: 'ch16-aftermath-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-aftermath-audit': {
    id: 'ch16-aftermath-audit',
    speaker: 'Field Notes',
    text: `Review dates made the corridor faster.

Not because it respects time.

Because it fears the moment when a witness might say, “I remember this.”

Approval now happens earlier.

Before the witness line is even written.

You did not slow the corridor.

You taught it where to move.`,
    choices: [
      {
        id: 'ch16-aftermath-audit-note',
        text: `Keep the shift in mind: approval moved earlier to avoid memory.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'After witness audits, approvals moved earlier in the process to avoid recorded memory and review dates.',
      },
    ],
  },

  'ch16-aftermath-seize': {
    id: 'ch16-aftermath-seize',
    speaker: 'Field Notes',
    text: `Iron custody made the corridor polite.

Polite means indirect.

Templates are now approved in drafts before they become templates.

The stamp arrives on paper that is still pretending to be discussion.

The corridor is trying to outrun seizure by approving the idea before the object exists.`,
    choices: [
      {
        id: 'ch16-aftermath-seize-note',
        text: `Keep the trick in mind: approval can be moved from objects to ideas.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'After cabinet seizure, approval shifted from stamped templates to earlier draft discussions, approving the idea before an object can be seized.',
      },
    ],
  },

  'ch16-aftermath-marks': {
    id: 'ch16-aftermath-marks',
    speaker: 'Field Notes',
    text: `Ward traces made denial harder.

So the corridor learned a new denial.

It approves language that defines the traces as “decorative compliance.”

A trace without enforcement becomes a charm.

The corridor is trying to turn restraint into ornament.`,
    choices: [
      {
        id: 'ch16-aftermath-marks-note',
        text: `Keep the move in mind: it is trying to domesticate marks into ornament.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'After ward-trace bindings, the corridor began approving language that frames traces as decorative compliance, attempting to domesticate restraint into ornament.',
      },
    ],
  },

  'ch16-aftermath-bond': {
    id: 'ch16-aftermath-bond',
    speaker: 'Field Notes',
    text: `Bondable obligations made the corridor count.

So it changed what gets counted.

Approval language now assigns liability to “unknown actors” and “unpredictable conditions.”

If blame is weather, nobody pays.

The corridor is trying to price harm without pricing ownership.`,
    choices: [
      {
        id: 'ch16-aftermath-bond-note',
        text: `Keep the move in mind: it is trying to make blame weather so no one pays.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'After liability bonds, approvals shifted toward weather-like blame clauses (“unknown actors”, “unpredictable conditions”) to avoid pricing ownership.',
      },
    ],
  },

  'ch16-aftermath-expose': {
    id: 'ch16-aftermath-expose',
    speaker: 'Field Notes',
    text: `Exposure made the corridor quieter.

It stopped using initials.

It stopped using names.

It started using absence.

Approvals are now logged as “no objections recorded.”

Absence is safer than lying.

The corridor is trying to approve by silence.`,
    choices: [
      {
        id: 'ch16-aftermath-expose-note',
        text: `Keep the shift in mind: it is trying to approve by silence.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'After exposure, approvals shifted toward “no objections recorded” silence rather than named sign-off.',
      },
    ],
  },

  'ch16-aftermath-quiet': {
    id: 'ch16-aftermath-quiet',
    speaker: 'Field Notes',
    text: `Waiting gave you the simplest proof.

The corridor kept revising.

The same hands returned.

The same stamp returned.

The corridor does not survive on genius.

It survives on repetition.

Now you know where to strike: the repeatable part.`,
    choices: [
      {
        id: 'ch16-aftermath-quiet-note',
        text: `Keep the lesson in mind: repetition is where the corridor can be trapped.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'Choosing to wait reveals the corridor survives by repetition—same hands, same stamp—making the repeatable part the point of leverage.',
      },
    ],
  },

  'ch16-committee': {
    id: 'ch16-committee',
    speaker: 'Field Notes',
    text: `The coordination room does not look like power.

It looks like furniture.

A table. Ink. A clock that keeps time for nobody.

People speak in a tone that makes choices sound like inventory.

You hear a phrase repeated until it becomes a conclusion: “standardization for continuity.”

No one says who benefits.

That is also standardization.`,
    choices: [
      {
        id: 'ch16-committee-note',
        text: `Keep the room in mind: approval is spoken as continuity until it sounds inevitable.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'The coordination room frames approvals as “standardization for continuity,” using tone to make choices sound inevitable and ownerless.',
      },
    ],
  },

  'ch16-stamp': {
    id: 'ch16-stamp',
    speaker: 'Field Notes',
    text: `The approval seal is kept in a box with a key that is never left alone.

The seal impression is the same one used for “rare emergencies.”

The corridor loves a mark that sounds temporary.

Temporary marks are how permanent systems are built.

Once the emergency impression is routine, the Hall forgets it was ever an exception.`,
    choices: [
      {
        id: 'ch16-stamp-note',
        text: `Keep the mark in mind: the emergency impression is being used to build permanence.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'The approval seal uses the signet-book emergency impression; routine emergency marks are being used to build permanent systems.',
      },
    ],
  },

  'ch16-witness': {
    id: 'ch16-witness',
    speaker: 'Witness Clerk Sabine Wirth',
    text: `Wirth does not look up.

"Approval is a word people use when they want something to exist without owning it," they say.

They slide a ledger toward you.

One column is witnesses.

One column is “routine.”

The corridor’s favorite trick is to move a decision across that line.

Then it calls the crossing administrative.`,
    choices: [
      {
        id: 'ch16-witness-note',
        text: `Keep the witness framing in mind: approval is the crossing from decision to routine.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'Witness Clerk Wirth frames approval as moving a decision across the line into “routine,” then calling the crossing administrative.',
      },
    ],
  },

  'ch16-routes': {
    id: 'ch16-routes',
    speaker: 'Copy Master Elen Mott',
    text: `Mott’s eyes flick over you like a checklist.

"Templates come here," they say.

"Approval happens elsewhere." They tap the edge of a bundle. "If you want to find the loop, find the hands that touch a form before it is allowed to be called ordinary."`,
    choices: [
      {
        id: 'ch16-routes-note',
        text: `Keep Mott’s advice in mind: find the hands that touch a form before it is ordinary.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
        revealsInfo: 'Copy Master Mott suggests tracking which hands touch forms before they are allowed to be called ordinary; approval happens away from the copy room.',
      },
    ],
  },

  'ch16-decision': {
    id: 'ch16-decision',
    speaker: 'Field Notes',
    text: `You have enough to act.

Approval is not a stamp.

It is a permission to stop arguing.

If you want a corridor to change, you do not fight its speed.

You fight its right to call itself routine.`,
    choices: [
      {
        id: 'ch16-decision-concord',
        text: `Force recorded approval: every template must have a witnessed approval entry and a named review docket.`,
        effects: [],
        exclusiveGroup: 'ch16-approval',
        requiresAnyTokens: ['tok:ch16:proof:witness', 'tok:ch16:proof:approvers'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:outcome:concord'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:concord' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ Approval Loop: Recorded approval forced into witness logs and named dockets.' },
        ],
        nextNodeId: 'ch16-ending-concord',
      },
      {
        id: 'ch16-decision-iron',
        text: `Force rank ownership: approvals become enforceable chains with named responsibility.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch16-approval',
        requiresAnyTokens: ['tok:ch16:proof:routes', 'tok:ch16:proof:pressure'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:outcome:iron'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:iron' },
          { kind: 'log', message: '🪖 Approval Loop: Approval converted into rank chains with named responsibility.' },
        ],
        nextNodeId: 'ch16-ending-iron',
      },
      {
        id: 'ch16-decision-verdant',
        text: `Force durable traces: every approval seal must carry a ward mark that survives copying.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch16-approval',
        requiresAnyTokens: ['tok:ch16:proof:stamp', 'tok:ch16:proof:pressure'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:outcome:verdant'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:verdant' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Approval Loop: Approval seals bound to ward marks that survive copying.' },
        ],
        nextNodeId: 'ch16-ending-verdant',
      },
      {
        id: 'ch16-decision-ember',
        text: `Attach liability: every approval becomes a bondable obligation collectible when harm is shown.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch16-approval',
        requiresAnyTokens: ['tok:ch16:proof:pressure', 'tok:ch16:proof:stamp'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:outcome:ember'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:ember' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Approval Loop: Approvals made bondable obligations with collectible harm clauses.' },
        ],
        nextNodeId: 'ch16-ending-ember',
      },
      {
        id: 'ch16-decision-expose',
        text: `Expose the loop: publish the coordination language and the emergency seal as routine proof.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch16-approval',
        requiresAllTokens: ['tok:ch16:proof:approvers', 'tok:ch16:proof:stamp'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch16:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Approval Loop: Coordination language and emergency seal published as routine proof.' },
        ],
        nextNodeId: 'ch16-ending-expose',
      },
      {
        id: 'ch16-decision-quiet',
        text: `Do not strike yet. Watch the next approval and learn who benefits first.`,
        effects: [],
        exclusiveGroup: 'ch16-approval',
        grantsTokens: ['tok:ch16:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-16:resolved' },
          { kind: 'milestone:add', id: 'chapter-16:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Approval Loop: Surveillance continues toward the first beneficiary.' },
        ],
        nextNodeId: 'ch16-ending-quiet',
      },
      {
        id: 'ch16-decision-back',
        text: `Not yet. Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-concord': {
    id: 'ch16-ending-concord',
    speaker: 'Field Notes',
    text: `You force approvals into record.

The corridor will still try to be routine.

Now it will have to be routine in a ledger where someone can point to a line and say: this was chosen.`,
    choices: [
      {
        id: 'ch16-ending-concord-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-iron': {
    id: 'ch16-ending-iron',
    speaker: 'Field Notes',
    text: `You make approval enforceable.

Iron will respect that.

The corridor will respond by searching for a way to make responsibility look like air.

Now you will know what to hunt: the next place it tries to become nobody.`,
    choices: [
      {
        id: 'ch16-ending-iron-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-verdant': {
    id: 'ch16-ending-verdant',
    speaker: 'Field Notes',
    text: `You bind approval to marks that survive copying.

Verdant will call it stewardship.

Now approval will leave a trace.

Traces are a kind of memory.

Memory is a kind of enforcement.`,
    choices: [
      {
        id: 'ch16-ending-verdant-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-ember': {
    id: 'ch16-ending-ember',
    speaker: 'Field Notes',
    text: `You attach liability to approval.

Ember will call it realism.

Now the corridor will have to decide whether it wants speed more than it wants cheapness.

Cheapness is how it bought anonymity.

You have raised the price.`,
    choices: [
      {
        id: 'ch16-ending-ember-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-expose': {
    id: 'ch16-ending-expose',
    speaker: 'Field Notes',
    text: `You publish the proof.

Not one signature.

Not one villain.

A loop.

A tone.

A seal used as routine.

In the Hall, that is what a government looks like when it hopes nobody will call it one.`,
    choices: [
      {
        id: 'ch16-ending-expose-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },

  'ch16-ending-quiet': {
    id: 'ch16-ending-quiet',
    speaker: 'Field Notes',
    text: `You do not strike yet.

You watch the next approval.

Approval is where a corridor becomes a government.

Now you will learn who that government serves first.`,
    choices: [
      {
        id: 'ch16-ending-quiet-back',
        text: `Return to the Hall.`,
        effects: [],
        nextNodeId: 'chapter-16-hub',
      },
    ],
  },
});
