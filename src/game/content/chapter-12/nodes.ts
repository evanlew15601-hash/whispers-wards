import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-12-hub': {
    id: 'chapter-12-hub',
    speaker: 'Field Notes',
    text: `Every law has a margin.

You have seen what the delegations write when they expect to be obeyed.

Iron writes rank and consequence. Verdant writes permanence. Ember writes obligation.

Concord writes neutrality.

Someone has been writing in red ink on top of Concord’s neutrality.

You decide whether the red ink becomes evidence, weapon, or habit.`,
    choices: [
      {
        id: 'ch12-hub-copyroom',
        text: `Enter the copy room and see who handles the draft bundles before they are filed.`,
        effects: [],
        grantsTokens: ['tok:ch12:proof:copyroom'],
        nextNodeId: 'ch12-copyroom',
      },
      {
        id: 'ch12-hub-ink',
        text: `Track the red ink supply and see who is allowed to requisition it.`,
        effects: [],
        grantsTokens: ['tok:ch12:proof:ink'],
        nextNodeId: 'ch12-ink',
      },
      {
        id: 'ch12-hub-witness',
        text: `Find the witness desk and learn which edits are treated as “routine” rather than “orders.”`,
        effects: [],
        grantsTokens: ['tok:ch12:proof:witness'],
        nextNodeId: 'ch12-witness',
      },
      {
        id: 'ch12-hub-wardmarks',
        text: `Inspect the filing corridor for ward marks that deter scrutiny without stopping workflow.`,
        effects: [],
        grantsTokens: ['tok:ch12:proof:wardmarks'],
        nextNodeId: 'ch12-wardmarks',
      },
      {
        id: 'ch12-hub-payoff-margin',
        text: `Compare your drafted protocol to the red ink edits and see what the corridor is trying to blunt.`,
        effects: [],
        requiresAnyTokens: [
          'tok:ch11:outcome:oathchain',
          'tok:ch11:outcome:wards',
          'tok:ch11:outcome:escrow',
          'tok:ch11:outcome:precedent',
          'tok:ch11:outcome:margin',
        ],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:proof:counter'],
        nextNodeId: 'ch12-payoff-margin',
      },
      {
        id: 'ch12-hub-decision',
        text: `Decide what to do with the red margin.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch12:proof:copyroom',
          'tok:ch12:proof:ink',
          'tok:ch12:proof:witness',
          'tok:ch12:proof:wardmarks',
          'tok:ch12:proof:counter',
        ],
        nextNodeId: 'ch12-decision',
      },
      {
        id: 'ch12-hub-back',
        text: `End here for now.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch12-copyroom': {
    id: 'ch12-copyroom',
    speaker: 'Copy Master Elen Mott',
    text: `The copy room smells of varnish and damp paper.

Elen Mott does not greet you like a courtier. They greet you like a deadline.

"Envoy," Mott says. "If you are here to argue about language, take a number." They point to a bundle stack. "Language is traffic."`,
    choices: [
      {
        id: 'ch12-copyroom-ask-red',
        text: `Ask who is allowed to write in red ink on a filed draft.`,
        effects: [],
        nextNodeId: 'ch12-copyroom-red',
      },
      {
        id: 'ch12-copyroom-back',
        text: `Leave the copy room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-copyroom-red': {
    id: 'ch12-copyroom-red',
    speaker: 'Copy Master Elen Mott',
    text: `Mott looks offended by the concept.

"Allowed?" they repeat. "We are not priests. We are not soldiers. We are not merchants."

Their voice softens, a fraction. "Red is for corrections that must be seen. If someone is writing in it quietly, they are not correcting. They are steering."`,
    choices: [
      {
        id: 'ch12-copyroom-red-note',
        text: `Keep the distinction in mind: correction versus steering.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
        revealsInfo: 'Copy room staff treat red ink as a visible correction; quiet red edits suggest steering rather than clerical cleanup.',
      },
    ],
  },

  'ch12-ink': {
    id: 'ch12-ink',
    speaker: 'Supply Clerk Nema Ors',
    text: `The supply ledger is a small tyranny.

Nema Ors reads it with the focus of someone who believes scarcity is the only honest language.

"Red ink is not common," Ors says. "It is expensive, and it stains. We track it." They tap a line. "Someone has been signing for it under a docket range, not a name."`,
    choices: [
      {
        id: 'ch12-ink-note',
        text: `Note the docket range and who is hiding behind it.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
        revealsInfo: 'A red ink requisition is being signed under a docket range rather than a name, suggesting authority hiding as procedure.',
      },
    ],
  },

  'ch12-witness': {
    id: 'ch12-witness',
    speaker: 'Witness Clerk Sabine Wirth',
    text: `The witness desk is where Concord tries to be real.

Sabine Wirth keeps a list of who was present for what.

"A law that cannot be witnessed is a story," Wirth says, without looking up. "A story that cannot be repeated is a rumor."

They slide a sheet toward you. "These edits were witnessed. These were not."`,
    choices: [
      {
        id: 'ch12-witness-note',
        text: `Keep the split in mind: edits with witnesses and edits that hide behind routine.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
        revealsInfo: 'The witness desk distinguishes edits made in the open from edits treated as routine and left unwitnessed.',
      },
    ],
  },

  'ch12-wardmarks': {
    id: 'ch12-wardmarks',
    speaker: 'Field Notes',
    text: `The corridor outside the copy rooms carries small ward marks.

Not the kind that stop you.

The kind that make you second-guess which door you meant.

Verdant would call it restraint. Iron would call it interference. Ember would call it a cost.

Concord calls it “workflow.”`,
    choices: [
      {
        id: 'ch12-wardmarks-note',
        text: `Memorize the pattern and the intent: delay without a visible barrier.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
        revealsInfo: 'Subtle ward marks in the filing corridor slow scrutiny without visibly blocking workflow.',
      },
    ],
  },

  'ch12-payoff-margin': {
    id: 'ch12-payoff-margin',
    speaker: 'Field Notes',
    text: `You compare your protocol draft to the red ink edits.

The edits are surgical.

Where you named a signatory, the red ink adds a clause about “delegated instruments.” Where you demanded witnesses, the red ink adds “administrative necessity.”

The corridor is not only moving paper. It is rewriting the meaning of restraint.`,
    choices: [
      {
        id: 'ch12-payoff-margin-note',
        text: `Keep the edits in mind: a counter-protocol written in the margins.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
        revealsInfo: 'Red ink edits act like a counter-protocol, adding delegated instruments and administrative necessity clauses to blunt oversight.',
      },
    ],
  },

  'ch12-decision': {
    id: 'ch12-decision',
    speaker: 'Field Notes',
    text: `You have enough to act.

Red ink is not a person. It is a practice.

If you treat it like a villain, it will become a rumor and return.

If you treat it like a habit, you can starve it or domesticate it.

You choose what kind of proof the Hall will be forced to live with.`,
    choices: [
      {
        id: 'ch12-decision-chain',
        text: `Bind red ink to rank: any margin edit must carry a named Iron-style chain of responsibility.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch12-margin-decision',
        requiresAnyTokens: ['tok:ch12:proof:ink', 'tok:ch12:proof:witness'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:outcome:chain'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:chain' },
          { kind: 'log', message: '🪖 Red Margin: Margin edits bound to rank and named responsibility.' },
        ],
        nextNodeId: 'ch12-ending-chain',
      },
      {
        id: 'ch12-decision-ward',
        text: `Bind red ink to marks: every margin edit must leave a visible ward trace that survives filing.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch12-margin-decision',
        requiresAnyTokens: ['tok:ch12:proof:wardmarks', 'tok:ch11:outcome:wards'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Red Margin: Margin edits bound to visible ward traces that survive filing.' },
        ],
        nextNodeId: 'ch12-ending-ward',
      },
      {
        id: 'ch12-decision-bond',
        text: `Attach a bond to red ink: every margin edit becomes a debt collectible when harm can be shown.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch12-margin-decision',
        requiresAnyTokens: ['tok:ch12:proof:copyroom', 'tok:ch11:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:outcome:bond'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:bond' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Red Margin: Margin edits made bondable liabilities under charter court.' },
        ],
        nextNodeId: 'ch12-ending-bond',
      },
      {
        id: 'ch12-decision-record',
        text: `Force witness review: every red ink edit must be logged and reviewed within one turn.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }, { factionId: 'iron-pact', reputationChange: 1 }],
        exclusiveGroup: 'ch12-margin-decision',
        requiresAnyTokens: ['tok:ch12:proof:witness', 'tok:ch11:outcome:precedent'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:outcome:record'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:record' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ Red Margin: Edits forced into witness log and review cycle.' },
        ],
        nextNodeId: 'ch12-ending-record',
      },
      {
        id: 'ch12-decision-expose',
        text: `Publish the counter-protocol: present the red ink edits as evidence of decisions made without signatures.`,
        effects: [{ factionId: 'ember-throne', reputationChange: -1 }, { factionId: 'iron-pact', reputationChange: 1 }],
        exclusiveGroup: 'ch12-margin-decision',
        requiresAnyTokens: ['tok:ch12:proof:counter', 'tok:ch11:outcome:margin'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch12:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Red Margin: Counter-protocol published as evidence of unsigned decisions.' },
        ],
        nextNodeId: 'ch12-ending-expose',
      },
      {
        id: 'ch12-decision-quiet',
        text: `Do not strike yet. Keep the red ink examples and follow who receives the corrected drafts.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch12-margin-decision',
        grantsTokens: ['tok:ch12:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-12:resolved' },
          { kind: 'milestone:add', id: 'chapter-12:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Red Margin: Evidence retained while the corridor remains under observation.' },
        ],
        nextNodeId: 'ch12-ending-quiet',
      },
      {
        id: 'ch12-decision-back',
        text: `Not yet. Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-chain': {
    id: 'ch12-ending-chain',
    speaker: 'Field Notes',
    text: `Rank is a kind of honesty.

It does not stop abuse. It tells you whose hand to watch.

The corridor will search for a way to pretend it is still anonymous.

You have made that pretense more expensive.`,
    choices: [
      {
        id: 'ch12-ending-chain-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-ward': {
    id: 'ch12-ending-ward',
    speaker: 'Field Notes',
    text: `You bind margin edits to marks that survive filing.

Verdant will call it restraint.

Iron will call it delay.

The corridor will call it an obstacle and start looking for a cleaner color of ink.`,
    choices: [
      {
        id: 'ch12-ending-ward-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-bond': {
    id: 'ch12-ending-bond',
    speaker: 'Field Notes',
    text: `You attach debt to edits.

Someone will stop writing in red.

Someone else will keep writing and start keeping receipts.

In the Hall, accountability often arrives dressed as accounting.`,
    choices: [
      {
        id: 'ch12-ending-bond-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-record': {
    id: 'ch12-ending-record',
    speaker: 'Field Notes',
    text: `You force edits back into the witness cycle.

That does not stop the corridor.

It changes its schedule.

The corridor will now choose its moments more carefully, and the Hall will have to admit those moments are choices.`,
    choices: [
      {
        id: 'ch12-ending-record-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-expose': {
    id: 'ch12-ending-expose',
    speaker: 'Field Notes',
    text: `You publish the counter-protocol.

You do not prove one villain.

You prove a habit: decisions made without signatures, then filed as routine.

The Hall will argue about whether the habit was “necessary.” That argument is the point. It is no longer silent.`,
    choices: [
      {
        id: 'ch12-ending-expose-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },

  'ch12-ending-quiet': {
    id: 'ch12-ending-quiet',
    speaker: 'Field Notes',
    text: `You keep the red ink examples.

You wait.

The corridor keeps moving.

Now you know what to look for: the hand that receives the corrected drafts first.`,
    choices: [
      {
        id: 'ch12-ending-quiet-back',
        text: `Return to the drafting room.`,
        effects: [],
        nextNodeId: 'chapter-12-hub',
      },
    ],
  },
});
