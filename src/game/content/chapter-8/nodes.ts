import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-8-hub': {
    id: 'chapter-8-hub',
    speaker: 'Narrator',
    text: `The River Gate did not end the argument. It moved it.

You have read Iron oath-lines scratched into ration boards after a winter the roads failed. You have watched Verdant warders press living fiber into paper so a promise could outlast a speaker. You have watched Ember factors turn a ruined route into a new contract before the ash cooled.

Concord was supposed to be the place where those instincts could argue in daylight.

Someone is keeping a ledger on the quay. Someone is balancing losses against obedience.

If you want to understand how continuity feeds itself, you start by finding who is doing the counting.`,
    choices: [
      {
        id: 'ch8-hub-aftermath',
        text: `Take stock of what your decision at the river actually changed.`,
        effects: [],
        nextNodeId: 'ch8-aftermath',
      },
      {
        id: 'ch8-hub-ledger',
        text: `Find the quay ledger and see what is being tallied as a “cost of order.”`,
        effects: [],
        grantsTokens: ['tok:ch08:proof:ledger'],
        nextNodeId: 'ch8-ledger',
      },
      {
        id: 'ch8-hub-stamps',
        text: `Inspect the stampwork on reroute slips and trace which office is teaching clerks to obey.`,
        effects: [],
        grantsTokens: ['tok:ch08:proof:signature'],
        nextNodeId: 'ch8-stamps',
      },
      {
        id: 'ch8-hub-cutouts',
        text: `Search the discard bundles for cutouts and “corrected” manifests.`,
        effects: [],
        grantsTokens: ['tok:ch08:proof:cutouts'],
        nextNodeId: 'ch8-cutouts',
      },
      {
        id: 'ch8-hub-fees',
        text: `Ask who is collecting the emergency fees and where the coin is being routed.`,
        effects: [],
        grantsTokens: ['tok:ch08:proof:bond'],
        nextNodeId: 'ch8-fees',
      },
      {
        id: 'ch8-hub-decision',
        text: `Decide what to do with a system that keeps a ledger on obedience.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch08:proof:ledger',
          'tok:ch08:proof:signature',
          'tok:ch08:proof:cutouts',
          'tok:ch08:proof:bond',
          'tok:ch07:outcome:expose',
          'tok:ch06:outcome:expose',
          'tok:ch06:outcome:raid',
          'tok:ch06:outcome:name',
        ],
        nextNodeId: 'ch8-decision',
      },
      {
        id: 'ch8-hub-back',
        text: `End here for now.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch8-aftermath': {
    id: 'ch8-aftermath',
    speaker: 'Narrator',
    text: `The Hall does not keep promises. It keeps habits.

The river is where habits become visible.`,
    choices: [
      {
        id: 'ch8-aftermath-release',
        text: `Consider the release order you issued, and the record you forced onto paper.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:release'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-release',
      },
      {
        id: 'ch8-aftermath-cordon',
        text: `Consider the cordon you kept, and the signatures you demanded.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:cordon'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-cordon',
      },
      {
        id: 'ch8-aftermath-escrow',
        text: `Consider the escrow bond you imposed, and what it taught the Hall to price.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-escrow',
      },
      {
        id: 'ch8-aftermath-ward',
        text: `Consider the ward-mark you bound to emergency authority.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:ward'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-ward',
      },
      {
        id: 'ch8-aftermath-expose',
        text: `Consider the scandal you forced, and what it will make the office do next.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-expose',
      },
      {
        id: 'ch8-aftermath-quiet',
        text: `Consider the proof you kept, and the method you let continue.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-aftermath-quiet',
      },
      {
        id: 'ch8-aftermath-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-release': {
    id: 'ch8-aftermath-release',
    speaker: 'Narrator',
    text: `The barges moved. People ate.

And somewhere in Concord, a clerk copied your record into a template for the next emergency.

Mercy becomes precedent faster than you expect.`,
    choices: [
      {
        id: 'ch8-aftermath-release-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-cordon': {
    id: 'ch8-aftermath-cordon',
    speaker: 'Narrator',
    text: `The line held.

The method slowed.

A slow injustice still counts as injustice. It just becomes easier to accept as weather.`,
    choices: [
      {
        id: 'ch8-aftermath-cordon-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-escrow': {
    id: 'ch8-aftermath-escrow',
    speaker: 'Narrator',
    text: `The bond made harm expensive.

It also made harm legible.

When the Hall learns a new math, it will try to use it for everything.`,
    choices: [
      {
        id: 'ch8-aftermath-escrow-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-ward': {
    id: 'ch8-aftermath-ward',
    speaker: 'Narrator',
    text: `A visible mark does not stop a decision.

It stops the lie that nobody decided.

If the office survives, it will survive in daylight.`,
    choices: [
      {
        id: 'ch8-aftermath-ward-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-expose': {
    id: 'ch8-aftermath-expose',
    speaker: 'Narrator',
    text: `A scandal is a fire.

It spreads. It consumes. It teaches everyone nearby how to run.

The office will not vanish. It will learn to change its clothing faster.`,
    choices: [
      {
        id: 'ch8-aftermath-expose-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-aftermath-quiet': {
    id: 'ch8-aftermath-quiet',
    speaker: 'Narrator',
    text: `Keeping proof is a kind of power.

It is also a kind of loneliness.

The method kept moving. You kept watching. Both choices will come due.`,
    choices: [
      {
        id: 'ch8-aftermath-quiet-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ledger': {
    id: 'ch8-ledger',
    speaker: 'Narrator',
    text: `The quay ledger is kept in a box that looks too cheap for what it contains.

Pages of tallies. Delays. Fees. Names reissued under new names.

The layout is Ember-clean: columns balanced, totals aligned, the kind of neatness that makes theft look like accounting.

Along the margin is a column with no label. The numbers there do not match coin.

They match compliance.`,
    choices: [
      {
        id: 'ch8-ledger-compare-release',
        text: `Compare the tallies to the record you forced at the river.`,
        effects: [],
        requiresAllTokens: ['tok:ch07:outcome:release'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-ledger-compare-release',
      },
      {
        id: 'ch8-ledger-note',
        text: `Memorize the unlabeled column and the way it repeats.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
        revealsInfo: 'A quay ledger tracks delays, reissued names, and an unlabeled column that correlates with compliance rather than coin.',
      },
    ],
  },

  'ch8-ledger-compare-release': {
    id: 'ch8-ledger-compare-release',
    speaker: 'Narrator',
    text: `Your release order appears as a dip in the compliance column.

Somebody annotated it in a tight hand: "noise." Then, beneath it, another note: "price later."

Mercy is being treated as a temporary defect that the method will correct.`,
    choices: [
      {
        id: 'ch8-ledger-compare-release-back',
        text: `Close the box and step back.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-stamps': {
    id: 'ch8-stamps',
    speaker: 'Narrator',
    text: `The stampwork is careful.

The slips do not say "committee." They do not say "continuity." They do not say any word that could be argued with.

They use formats. Docket spacing. A particular kind of wax.

It is not Iron language. Iron writes rank.

It is not Verdant language. Verdant writes permanence.

It is not Ember language. Ember writes who pays.

It is Concord language: neutral enough to be treated as inevitable.

The paper is teaching the clerks what to obey.`,
    choices: [
      {
        id: 'ch8-stamps-note',
        text: `Commit the formatting to memory and keep one reroute slip folded in your sleeve.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
        revealsInfo: 'Reroute slips on the quay use docket formatting and stampwork that teach clerks what to obey without naming any authority.',
      },
    ],
  },

  'ch8-cutouts': {
    id: 'ch8-cutouts',
    speaker: 'Narrator',
    text: `Discard bundles are where the story leaks.

You find manifests with names cut away and replaced. Numbers rewritten to look like a correction.

The work is neat. The intent is not.`,
    choices: [
      {
        id: 'ch8-cutouts-note',
        text: `Take a copy of the cleanest cutout and the original name it hides.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
        revealsInfo: 'Discarded manifests on the quay show names cut away and replaced; corrections used as camouflage for reroutes.',
      },
    ],
  },

  'ch8-fees': {
    id: 'ch8-fees',
    speaker: 'Factor Sera Quill',
    speakerFaction: 'ember-throne',
    text: `Quill is still on the quay, still smiling.

"Fees are how you keep promises when nobody trusts vows," she says.

"Ash Road taught us that routes are only as real as the paper that survives a bad season." She taps the ledger box with one finger. "Someone else is learning the same lesson."`,
    choices: [
      {
        id: 'ch8-fees-escrow',
        text: `Ask how an escrow bond would look if it followed every reroute slip.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch07:outcome:escrow'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch8-fees-escrow',
      },
      {
        id: 'ch8-fees-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-fees-escrow': {
    id: 'ch8-fees-escrow',
    speaker: 'Factor Sera Quill',
    speakerFaction: 'ember-throne',
    text: `"You already started," Quill says.

"Bind the fee to the paper. Bind the paper to a bond. Bind the bond to a name the Hall cannot quietly erase.

It will not make authority moral. It will make it collectible."`,
    choices: [
      {
        id: 'ch8-fees-escrow-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-decision': {
    id: 'ch8-decision',
    speaker: 'Narrator',
    text: `A ledger is a confession that wants to be called accounting.

If you let this one stand, it will become a tool the Hall reaches for by reflex.

If you break it badly, the method will rewrite itself in a cleaner hand.

You decide what kind of accountability can survive in a corridor built for speed.`,
    choices: [
      {
        id: 'ch8-decision-audit',
        text: `Publish the quay ledger and the reroute slip formats. Force a public inquiry into method-authority.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -3 }],
        exclusiveGroup: 'ch8-quay-decision',
        requiresAllTokens: ['tok:ch08:proof:ledger', 'tok:ch08:proof:signature'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch08:outcome:audit'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:audit' },
          { kind: 'tension', a: 'ember-throne', b: 'iron-pact', delta: 3 },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Quay Ledger: Compliance tallies and stamp formats published; inquiry forced onto paper.' },
        ],
        nextNodeId: 'ch8-ending-audit',
      },
      {
        id: 'ch8-decision-seize',
        text: `Seize the ledger and stampwork under Iron custody before it can disappear into procedure.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 3 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch8-quay-decision',
        requiresAnyTokens: ['tok:ch06:outcome:raid', 'tok:ch05:outcome:enforce', 'tok:ch02:outcome:iron', 'tok:ch08:proof:signature'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch08:outcome:seize'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:seize' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 3 },
          { kind: 'log', message: '🛡️ Quay Ledger: Ledger and stampwork seized under Iron custody.' },
        ],
        nextNodeId: 'ch8-ending-seize',
      },
      {
        id: 'ch8-decision-ward',
        text: `Bind emergency reroutes to a visible mark: no slip is valid unless it carries a trace the quay cannot file away.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 3 }],
        exclusiveGroup: 'ch8-quay-decision',
        requiresAnyTokens: ['tok:ch07:outcome:ward', 'tok:ch06:outcome:ward', 'tok:ch05:outcome:counterseal', 'tok:ch02:outcome:verdant', 'tok:ch08:proof:signature'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch08:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Quay Ledger: Reroute authority bound to visible marks that survive filing.' },
        ],
        nextNodeId: 'ch8-ending-ward',
      },
      {
        id: 'ch8-decision-escrow',
        text: `Bind the fee column to escrow bonds: make every act of coercion collectible and traceable.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch8-quay-decision',
        requiresAnyTokens: ['tok:ch07:outcome:escrow', 'tok:ch05:outcome:fund', 'tok:ch02:outcome:ember', 'tok:ch08:proof:bond'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch08:outcome:escrow'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:escrow' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Quay Ledger: Fees bound into escrow bonds; coercion made traceable.' },
        ],
        nextNodeId: 'ch8-ending-escrow',
      },
      {
        id: 'ch8-decision-name',
        text: `Name the ledger as an office function and force oversight onto it: make continuity admit its own handwriting.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: 1 }],
        exclusiveGroup: 'ch8-quay-decision',
        requiresAllTokens: ['tok:ch06:outcome:name'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch08:outcome:name'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:name' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🧷 Quay Ledger: Brought under named oversight as a declared office function.' },
        ],
        nextNodeId: 'ch8-ending-name',
      },
      {
        id: 'ch8-decision-quiet',
        text: `Keep the proof and let the ledger keep working while you watch where it leads.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }],
        exclusiveGroup: 'ch8-quay-decision',
        grantsTokens: ['tok:ch08:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-8:resolved' },
          { kind: 'milestone:add', id: 'chapter-8:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Quay Ledger: Evidence retained privately while the method continues.' },
        ],
        nextNodeId: 'ch8-ending-quiet',
      },
      {
        id: 'ch8-decision-back',
        text: `Not yet. Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-audit': {
    id: 'ch8-ending-audit',
    speaker: 'Narrator',
    text: `You make the ledger public.

People will argue about whether the numbers are real. They will argue about whether the method is necessary. They will argue about whether anyone is responsible.

But they cannot argue about whether it exists.`,
    choices: [
      {
        id: 'ch8-ending-audit-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-seize': {
    id: 'ch8-ending-seize',
    speaker: 'Narrator',
    text: `Iron custody makes the paper stop moving.

It does not make the desire behind the paper stop.

If the method returns, it will return with new stamps and a better excuse.`,
    choices: [
      {
        id: 'ch8-ending-seize-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-ward': {
    id: 'ch8-ending-ward',
    speaker: 'Narrator',
    text: `You do not remove the method.

You make it leave marks.

The quay will learn the difference between routine and choice. The Hall will learn whether it can stand being seen.`,
    choices: [
      {
        id: 'ch8-ending-ward-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-escrow': {
    id: 'ch8-ending-escrow',
    speaker: 'Narrator',
    text: `You turn coercion into a debt.

A debt can be collected. A debt can be traded. A debt can be hidden.

You have not made the Hall virtuous. You have made it legible.`,
    choices: [
      {
        id: 'ch8-ending-escrow-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-name': {
    id: 'ch8-ending-name',
    speaker: 'Narrator',
    text: `Naming a function is not the same as controlling it.

But it is a start. The method loses some of its favorite armor: vagueness.

Now it will have to choose whether to fight you in public or retreat to another corridor.`,
    choices: [
      {
        id: 'ch8-ending-name-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },

  'ch8-ending-quiet': {
    id: 'ch8-ending-quiet',
    speaker: 'Narrator',
    text: `You keep the ledger out of sight.

The quay keeps moving. The Hall keeps breathing.

This is how systems survive: not by being right, but by being uninterrupted.`,
    choices: [
      {
        id: 'ch8-ending-quiet-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-8-hub',
      },
    ],
  },
});
