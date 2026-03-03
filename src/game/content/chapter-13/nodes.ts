import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-13-hub': {
    id: 'chapter-13-hub',
    speaker: 'Field Notes',
    text: 'A corrected draft always lands somewhere first.

Not the archive.

A desk.

A person.

You have watched every delegation pretend that procedures are neutral. You have also watched them panic when a procedure gains an owner.

If you want the corridor to have an owner, you start by finding who receives the red ink bundles before anyone else is allowed to see them.',
    choices: [
      {
        id: 'ch13-hub-bundlelog',
        text: 'Check the delivery log for corrected bundles and see which desk is listed first.',
        effects: [],
        grantsTokens: ['tok:ch13:proof:bundlelog'],
        nextNodeId: 'ch13-bundlelog',
      },
      {
        id: 'ch13-hub-runner',
        text: 'Speak to the stair runner who carries drafts before they become “records.”',
        effects: [],
        grantsTokens: ['tok:ch13:proof:runner'],
        nextNodeId: 'ch13-runner',
      },
      {
        id: 'ch13-hub-seals',
        text: 'Inspect the seal impressions on corrected bundles and compare them to the signet book.',
        effects: [],
        grantsTokens: ['tok:ch13:proof:seals'],
        nextNodeId: 'ch13-seals',
      },
      {
        id: 'ch13-hub-desk',
        text: 'Find the first recipient desk and see what it keeps within arm’s reach.',
        effects: [],
        grantsTokens: ['tok:ch13:proof:desk'],
        nextNodeId: 'ch13-desk',
      },
      {
        id: 'ch13-hub-payoff-ink',
        text: 'Use the ink requisition range and trace where the red ink goes after it leaves stores.',
        effects: [],
        requiresAllTokens: ['tok:ch12:proof:ink'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:proof:route'],
        nextNodeId: 'ch13-payoff-ink',
      },
      {
        id: 'ch13-hub-payoff-witness',
        text: 'Use the witness desk split and identify which corrections are never witnessed at all.',
        effects: [],
        requiresAllTokens: ['tok:ch12:proof:witness'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:proof:unwitnessed'],
        nextNodeId: 'ch13-payoff-witness',
      },
      {
        id: 'ch13-hub-decision',
        text: 'Decide what to do with the first recipient.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch13:proof:bundlelog',
          'tok:ch13:proof:runner',
          'tok:ch13:proof:seals',
          'tok:ch13:proof:desk',
          'tok:ch13:proof:route',
          'tok:ch13:proof:unwitnessed',
        ],
        nextNodeId: 'ch13-decision',
      },
      {
        id: 'ch13-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch13-bundlelog': {
    id: 'ch13-bundlelog',
    speaker: 'Field Notes',
    text: 'You find the delivery log clipped to a board near the copy room.

Most entries name rooms.

One entry names a desk.

Not a title. Not a committee. A desk identifier that only makes sense to the people who push bundles through the Hall.

The same desk appears whenever a clause is struck and rewritten in red ink.

The habit has a first address.',
    choices: [
      {
        id: 'ch13-bundlelog-note',
        text: 'Memorize the desk identifier and the hours it receives corrected bundles.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'A delivery log lists a specific desk identifier as the first recipient of red-ink corrected bundles, recurring during clause rewrites.',
      },
    ],
  },

  'ch13-runner': {
    id: 'ch13-runner',
    speaker: 'Stair Runner Jalen Tress',
    text: 'Jalen’s hands are ink-stained in a way that suggests speed rather than craft.

"Envoy," Jalen says. "If you want a story, speak to a herald. If you want a route, speak to me."',
    choices: [
      {
        id: 'ch13-runner-ask',
        text: 'Ask where corrected drafts go before they are filed.',
        effects: [],
        nextNodeId: 'ch13-runner-ask',
      },
      {
        id: 'ch13-runner-back',
        text: 'Leave the runner to their routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-runner-ask': {
    id: 'ch13-runner-ask',
    speaker: 'Stair Runner Jalen Tress',
    text: '"People think records go to the archive," Jalen says.

"Records go to whoever is allowed to be surprised last." They shrug.

"First recipient desk is on the mezzanine. Looks like nothing. That is the point."

They glance at your hands. "You want the desk? Or you want who the desk is protecting?"',
    choices: [
      {
        id: 'ch13-runner-ask-note',
        text: 'Keep the runner’s framing in mind: records are routed so the right people are surprised last.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'A stair runner claims records are routed so the right people are surprised last; the first recipient desk sits on a mezzanine designed to look insignificant.',
      },
    ],
  },

  'ch13-seals': {
    id: 'ch13-seals',
    speaker: 'Field Notes',
    text: 'You inspect the bundle seals.

They are not loud.

No delegation mark.

No threat.

Just enough wax to make the paper feel official.

The impression matches the “rare emergency” page in the signet book.

Continuity is borrowing the language of necessity to avoid being treated as choice.',
    choices: [
      {
        id: 'ch13-seals-note',
        text: 'Keep the match in mind: the same emergency impression is being used as routine.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'Corrected bundle seals match the signet-book emergency impression, suggesting “rare” authority used as routine camouflage.',
      },
    ],
  },

  'ch13-desk': {
    id: 'ch13-desk',
    speaker: 'Field Notes',
    text: 'The first recipient desk is small.

It has no crest.

It has three drawers with three different keys.

Inside the top drawer: a copy of the envoy charter clause about naming signatories.

Inside the second: a bundle of ward-fiber slips cut to fit into margins.

Inside the third: a stack of fee schedules with blank signature lines.

The desk is a mirror. It reflects whatever the delegations fear most losing.',
    choices: [
      {
        id: 'ch13-desk-note',
        text: 'Take note of what the desk keeps: charter leverage, ward fiber, and debt terms.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'The first recipient desk keeps envoy charter leverage, ward-fiber slips, and blank fee schedules—tools that map to each delegation’s core instincts.',
      },
    ],
  },

  'ch13-payoff-ink': {
    id: 'ch13-payoff-ink',
    speaker: 'Field Notes',
    text: 'You follow the requisition range.

The paper trail does not name a person.

It names a docket route.

The route ends at the mezzanine desk.

Somebody built a system where the supply ledger points to a place instead of a hand.',
    choices: [
      {
        id: 'ch13-payoff-ink-note',
        text: 'Keep the connection in mind: ink requisitions route to a desk, not to a named clerk.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'Red ink requisitions trace to the mezzanine first recipient desk via docket routing rather than named sign-off.',
      },
    ],
  },

  'ch13-payoff-witness': {
    id: 'ch13-payoff-witness',
    speaker: 'Field Notes',
    text: 'You compare the witness split.

The unwitnessed corrections share a pattern.

They touch clauses that would otherwise require a named owner.

Someone is using “routine” to take authority away from the witness desk.',
    choices: [
      {
        id: 'ch13-payoff-witness-note',
        text: 'Keep the pattern in mind: unwitnessed edits cluster around ownership clauses.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
        revealsInfo: 'Unwitnessed corrections cluster around clauses that would otherwise force named ownership, suggesting routine used to bypass witness control.',
      },
    ],
  },

  'ch13-decision': {
    id: 'ch13-decision',
    speaker: 'Field Notes',
    text: 'You have enough to act.

If you expose the desk, the corridor will move.

If you bind the desk, the corridor will test the binding.

If you bargain with the desk, the corridor will learn a price.

You choose what kind of lesson gets repeated.',
    choices: [
      {
        id: 'ch13-decision-witness',
        text: 'Force witness routing: every corrected bundle must be witnessed before it reaches any desk.',
        effects: [],
        exclusiveGroup: 'ch13-first-recipient',
        requiresAnyTokens: ['tok:ch13:proof:bundlelog', 'tok:ch13:proof:unwitnessed'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:outcome:witness'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:witness' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ First Recipient: Corrected bundles forced through witness routing before any desk review.' },
        ],
        nextNodeId: 'ch13-ending-witness',
      },
      {
        id: 'ch13-decision-chain',
        text: 'Bind it to a chain: the desk becomes a named rank with explicit responsibility for each margin edit.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        exclusiveGroup: 'ch13-first-recipient',
        requiresAnyTokens: ['tok:ch13:proof:bundlelog', 'tok:ch13:proof:desk'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:outcome:chain'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:chain' },
          { kind: 'log', message: '🪖 First Recipient: Mezzanine desk converted into a named chain-of-responsibility rank.' },
        ],
        nextNodeId: 'ch13-ending-chain',
      },
      {
        id: 'ch13-decision-marks',
        text: 'Bind it to marks: the desk may correct, but every correction must carry a ward trace that survives filing.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch13-first-recipient',
        requiresAnyTokens: ['tok:ch13:proof:desk', 'tok:ch12:outcome:ward'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:outcome:marks'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:marks' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 First Recipient: Margin corrections bound to ward traces that survive filing.' },
        ],
        nextNodeId: 'ch13-ending-marks',
      },
      {
        id: 'ch13-decision-bond',
        text: 'Set a price: every corrected bundle becomes a bonded liability with a collectible harm clause.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch13-first-recipient',
        requiresAnyTokens: ['tok:ch13:proof:seals', 'tok:ch12:outcome:bond'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:outcome:bond'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:bond' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 First Recipient: Corrected bundles made bondable liabilities with collectible harm clauses.' },
        ],
        nextNodeId: 'ch13-ending-bond',
      },
      {
        id: 'ch13-decision-expose',
        text: 'Expose the desk: publish the delivery log and the seal match as evidence of unsigned ownership.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch13-first-recipient',
        requiresAnyTokens: ['tok:ch13:proof:bundlelog', 'tok:ch13:proof:seals'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch13:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:expose' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 First Recipient: Delivery log and seal match published; desk ownership forced into daylight.' },
        ],
        nextNodeId: 'ch13-ending-expose',
      },
      {
        id: 'ch13-decision-quiet',
        text: 'Do not strike. Follow the next corrected bundle and learn the second recipient.',
        effects: [],
        exclusiveGroup: 'ch13-first-recipient',
        grantsTokens: ['tok:ch13:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-13:resolved' },
          { kind: 'milestone:add', id: 'chapter-13:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ First Recipient: Evidence retained; surveillance continues toward a second recipient.' },
        ],
        nextNodeId: 'ch13-ending-quiet',
      },
      {
        id: 'ch13-decision-back',
        text: 'Not yet. Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-witness': {
    id: 'ch13-ending-witness',
    speaker: 'Field Notes',
    text: 'You force the corridor to touch witnesses before it touches desks.

It will still move.

Now it will move in rooms where somebody has to say they were there.',
    choices: [
      {
        id: 'ch13-ending-witness-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-chain': {
    id: 'ch13-ending-chain',
    speaker: 'Field Notes',
    text: 'You turn a desk into a rank.

Iron respects that kind of honesty.

The corridor will respond by trying to invent another desk.',
    choices: [
      {
        id: 'ch13-ending-chain-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-marks': {
    id: 'ch13-ending-marks',
    speaker: 'Field Notes',
    text: 'You force every correction to leave a trace.

Verdant will call it restraint.

The corridor will call it inconvenience.

Inconvenience is sometimes enough to change a habit.',
    choices: [
      {
        id: 'ch13-ending-marks-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-bond': {
    id: 'ch13-ending-bond',
    speaker: 'Field Notes',
    text: 'You make corrections collectible.

Ember will call it realism.

Somebody will start keeping receipts.

Now you will have something to seize when the harm is done.',
    choices: [
      {
        id: 'ch13-ending-bond-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-expose': {
    id: 'ch13-ending-expose',
    speaker: 'Field Notes',
    text: 'You publish a desk identifier and a seal match.

It is not dramatic proof.

It is bureaucratic proof.

In this Hall, that is how a practice gets a name.',
    choices: [
      {
        id: 'ch13-ending-expose-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },

  'ch13-ending-quiet': {
    id: 'ch13-ending-quiet',
    speaker: 'Field Notes',
    text: 'You let the desk keep working.

You follow the bundle.

The corridor has a second address.

You will learn it.',
    choices: [
      {
        id: 'ch13-ending-quiet-back',
        text: 'Return to the mezzanine routes.',
        effects: [],
        nextNodeId: 'chapter-13-hub',
      },
    ],
  },
});
