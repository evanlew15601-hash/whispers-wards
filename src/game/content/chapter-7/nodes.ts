import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-7-hub': {
    id: 'chapter-7-hub',
    speaker: 'Narrator',
    text: `Dawn at the River Gate smells like wet stone and old iron.

Barges wait in a line that looks polite until you notice the soldiers counting them. Couriers wait with stamped packets they cannot open. Merchants wait with faces trained to look harmless.

Whatever you did in the Hall has reached the water. It has changed who is allowed to move.`,
    choices: [
      {
        id: 'ch7-hub-captain',
        text: `Speak to the gate captain and ask who wrote the order that stopped the river.`,
        effects: [],
        nextNodeId: 'ch7-captain',
      },
      {
        id: 'ch7-hub-manifests',
        text: `Inspect the manifests and see what name the seizures are hiding behind.`,
        effects: [],
        grantsTokens: ['tok:ch07:proof:manifest'],
        nextNodeId: 'ch7-manifests',
      },
      {
        id: 'ch7-hub-bargemaster',
        text: `Find a bargemaster who is willing to say what happened out loud.`,
        effects: [],
        grantsTokens: ['tok:ch07:proof:witness'],
        nextNodeId: 'ch7-bargemaster',
      },
      {
        id: 'ch7-hub-factor',
        text: `Speak to the Ember factor collecting "emergency fees" on the quay.`,
        effects: [],
        nextNodeId: 'ch7-factor',
      },
      {
        id: 'ch7-hub-warder',
        text: `Speak to the Verdant warder watching the lock-gates and the stampwork.`,
        effects: [],
        nextNodeId: 'ch7-warder',
      },
      {
        id: 'ch7-hub-decision',
        text: `Intervene. The river will not wait for Concord to finish arguing with itself.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch07:proof:manifest',
          'tok:ch07:proof:witness',
          'tok:ch07:proof:gate-order',
          'tok:ch07:proof:fees',
          'tok:ch07:proof:ward',
          'tok:ch06:outcome:name',
          'tok:ch06:outcome:raid',
          'tok:ch06:outcome:ward',
          'tok:ch06:outcome:bargain',
          'tok:ch06:outcome:expose',
          'tok:ch06:outcome:quiet',
        ],
        nextNodeId: 'ch7-decision',
      },
      {
        id: 'ch7-hub-back',
        text: `Step away.`,
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch7-captain': {
    id: 'ch7-captain',
    speaker: 'Captain Jory Strake',
    speakerFaction: 'iron-pact',
    text: `Captain Strake stands with their hands behind their back, as if the river is a parade ground.

"Envoy," they say. "I have an order. I have a line. If I let a barge through without a name on paper, I lose the only thing the Hall respects: precedent."`,
    choices: [
      {
        id: 'ch7-captain-order',
        text: `Ask to see the seizure order and who signed it.`,
        effects: [],
        grantsTokens: ['tok:ch07:proof:gate-order'],
        nextNodeId: 'ch7-captain-order',
      },
      {
        id: 'ch7-captain-raid',
        text: `Tell Strake you seized the continuity stamps. If this order uses them, it is already compromised.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:raid'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:proof:gate-order'],
        nextNodeId: 'ch7-captain-raid',
      },
      {
        id: 'ch7-captain-name',
        text: `Tell Strake the office is named and under oversight now. The river cannot be held on anonymous authority.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:name'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:proof:gate-order'],
        nextNodeId: 'ch7-captain-name',
      },
      {
        id: 'ch7-captain-enforce',
        text: `Invoke your oathline enforcement: if a reroute wants obedience, it can carry a name and a hand.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:enforce'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch7-captain-enforce',
      },
      {
        id: 'ch7-captain-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-captain-order': {
    id: 'ch7-captain-order',
    speaker: 'Narrator',
    text: `The order is stamped cleanly and written to look routine.

It cites emergency continuity.

It cites an administrative office.

It does not name a person.

The captain is obeying a method.`,
    choices: [
      {
        id: 'ch7-captain-order-back',
        text: `Fold the paper and return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
        revealsInfo: 'The River Gate seizure order cites emergency continuity and an administrative office, but names no signer — authority by method, not person.',
      },
    ],
  },

  'ch7-captain-raid': {
    id: 'ch7-captain-raid',
    speaker: 'Captain Jory Strake',
    speakerFaction: 'iron-pact',
    text: `Strake goes still for a moment.

"If you have the stamps," they say quietly, "then the order is either forged or foolish. Either way, I will not be the one left holding it."`,
    choices: [
      {
        id: 'ch7-captain-raid-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-captain-name': {
    id: 'ch7-captain-name',
    speaker: 'Captain Jory Strake',
    speakerFaction: 'iron-pact',
    text: `"Named oversight," Strake repeats.

"Good. Give me a name and I will follow it. Give me a ghost and I will follow it too, because ghosts still leave me a corpse if I disobey."`,
    choices: [
      {
        id: 'ch7-captain-name-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-captain-enforce': {
    id: 'ch7-captain-enforce',
    speaker: 'Captain Jory Strake',
    speakerFaction: 'iron-pact',
    text: `Strake nods.

"That is the only kind of rule I trust," they say. "One that can be arrested."`,
    choices: [
      {
        id: 'ch7-captain-enforce-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-factor': {
    id: 'ch7-factor',
    speaker: 'Factor Sera Quill',
    speakerFaction: 'ember-throne',
    text: `Factor Quill is smiling the way merchants smile when soldiers are nearby.

"Envoy," she says. "The river is delayed. Delays have costs. We are merely making sure the costs are written down."`,
    choices: [
      {
        id: 'ch7-factor-fees',
        text: `Ask for the fee sheet and the name it is being written under.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        grantsTokens: ['tok:ch07:proof:fees'],
        nextNodeId: 'ch7-factor-fees',
      },
      {
        id: 'ch7-factor-bargain',
        text: `Remind Quill you already forced the office to publish schedules. A hidden fee is just a reroute with better manners.`,
        effects: [],
        requiresAllTokens: ['tok:ch06:outcome:bargain'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:proof:fees'],
        nextNodeId: 'ch7-factor-bargain',
      },
      {
        id: 'ch7-factor-fund',
        text: `Invoke your compensation bond: if the river harms people legally, the Hall pays, and the Hall learns.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:fund'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch7-factor-fund',
      },
      {
        id: 'ch7-factor-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-factor-fees': {
    id: 'ch7-factor-fees',
    speaker: 'Narrator',
    text: `The fee sheet is written as storage, inspection, escort, continuity.

It is all legal language.

It is also a price list for permission.`,
    choices: [
      {
        id: 'ch7-factor-fees-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
        revealsInfo: 'An Ember fee sheet at the River Gate prices "continuity" as storage, inspection, and escort — legal language used as permission.',
      },
    ],
  },

  'ch7-factor-bargain': {
    id: 'ch7-factor-bargain',
    speaker: 'Factor Sera Quill',
    speakerFaction: 'ember-throne',
    text: `Quill’s smile tightens.

"A published schedule is still a schedule," she says. "It only changes who feels entitled to haggle."`,
    choices: [
      {
        id: 'ch7-factor-bargain-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-factor-fund': {
    id: 'ch7-factor-fund',
    speaker: 'Factor Sera Quill',
    speakerFaction: 'ember-throne',
    text: `"A bond," Quill says, pleased.

"If the Hall wants to buy stability, Ember will happily sell it. Just do not mistake a purchase for a cure."`,
    choices: [
      {
        id: 'ch7-factor-fund-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-warder': {
    id: 'ch7-warder',
    speaker: 'Warder Ilen',
    speakerFaction: 'verdant-court',
    text: `Warder Ilen stands by the lock-gate with their palm on the wood.

"The stamps are wrong," they say without greeting. "Not forged. Repurposed. The river does not care what paper says, but people do."`,
    choices: [
      {
        id: 'ch7-warder-ward',
        text: `Ask Ilen what kind of ward could make emergency authority leave marks people cannot ignore.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }],
        grantsTokens: ['tok:ch07:proof:ward'],
        nextNodeId: 'ch7-warder-ward',
      },
      {
        id: 'ch7-warder-counterseal',
        text: `Tell Ilen you already bound emergency authority to a counterseal. Ask what it will look like here.`,
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:counterseal'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:proof:ward'],
        nextNodeId: 'ch7-warder-counterseal',
      },
      {
        id: 'ch7-warder-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-warder-ward': {
    id: 'ch7-warder-ward',
    speaker: 'Warder Ilen',
    speakerFaction: 'verdant-court',
    text: `"A visible mark," Ilen says. "Not pain. Not punishment. A mark that tells the truth: that somebody chose this."`,
    choices: [
      {
        id: 'ch7-warder-ward-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-warder-counterseal': {
    id: 'ch7-warder-counterseal',
    speaker: 'Warder Ilen',
    speakerFaction: 'verdant-court',
    text: `"Then the river will learn a new language," Ilen says.

"When the Hall uses emergency authority, the lock-gates will know. The barges will know. People will stop pretending it was weather."`,
    choices: [
      {
        id: 'ch7-warder-counterseal-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-bargemaster': {
    id: 'ch7-bargemaster',
    speaker: 'Bargemaster Nessa Pike',
    text: `Nessa Pike has rope burns on her hands and a look that says she has stopped believing officials can be embarrassed.

"They stopped us at dawn," she says. "Told us we were rerouted on paper. We never moved. Only our names did."`,
    choices: [
      {
        id: 'ch7-bargemaster-back',
        text: `Thank her and return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-manifests': {
    id: 'ch7-manifests',
    speaker: 'Narrator',
    text: `The manifests list flour, salt, lamp oil.

Ordinary goods.

Then you see the pattern: shipments reissued under new names with the same weights, the same dates, the same destination.

Trade is being moved without moving.`,
    choices: [
      {
        id: 'ch7-manifests-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
        revealsInfo: 'River manifests show shipments reissued under new names with identical weights and dates — trade moved on paper without moving in reality.',
      },
    ],
  },

  'ch7-decision': {
    id: 'ch7-decision',
    speaker: 'Narrator',
    text: `The River Gate is a lesson the Hall is teaching itself.

If authority can reroute goods here, it can reroute everything.

You decide whether this becomes a practice, a scandal, or a scar.`,
    choices: [
      {
        id: 'ch7-decision-release',
        text: `Order a temporary release: move the barges, record every seizure, and force the Hall to own the delay.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }],
        exclusiveGroup: 'ch7-river-decision',
        requiresAllTokens: ['tok:ch07:proof:gate-order', 'tok:ch07:proof:manifest'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:outcome:release'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:release' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🚢 River Gate: Barges released under recorded oversight; seizures forced onto paper.' },
        ],
        nextNodeId: 'ch7-ending-release',
      },
      {
        id: 'ch7-decision-cordon',
        text: `Keep the cordon but force signatures: no anonymous reroute order is valid at the river.`,
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }, { factionId: 'verdant-court', reputationChange: -1 }],
        exclusiveGroup: 'ch7-river-decision',
        requiresAnyTokens: ['tok:ch07:proof:gate-order', 'tok:ch06:outcome:raid', 'tok:ch05:outcome:enforce'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:outcome:cordon'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:cordon' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 3 },
          { kind: 'log', message: '🛡️ River Gate: Cordon held, but anonymous reroute orders rejected without signatures.' },
        ],
        nextNodeId: 'ch7-ending-cordon',
      },
      {
        id: 'ch7-decision-escrow',
        text: `Allow reroutes, but bind them to escrow: every emergency fee becomes a traceable bond the Hall can be made to pay.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch7-river-decision',
        requiresAnyTokens: ['tok:ch07:proof:fees', 'tok:ch05:outcome:fund', 'tok:ch06:outcome:bargain'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:outcome:escrow'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:escrow' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 River Gate: Emergency fees bound into escrow bonds and made traceable.' },
        ],
        nextNodeId: 'ch7-ending-escrow',
      },
      {
        id: 'ch7-decision-ward',
        text: `Bind emergency authority to a visible ward: every reroute leaves a mark that cannot be filed away as routine.`,
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        exclusiveGroup: 'ch7-river-decision',
        requiresAnyTokens: ['tok:ch07:proof:ward', 'tok:ch06:outcome:ward', 'tok:ch05:outcome:counterseal'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 River Gate: Emergency authority bound to a visible ward-mark.' },
        ],
        nextNodeId: 'ch7-ending-ward',
      },
      {
        id: 'ch7-decision-expose',
        text: `Expose the paper trick: publish the reissued manifests and the witness account and force a scandal.`,
        effects: [{ factionId: 'ember-throne', reputationChange: -2 }, { factionId: 'verdant-court', reputationChange: 1 }],
        exclusiveGroup: 'ch7-river-decision',
        requiresAllTokens: ['tok:ch07:proof:manifest', 'tok:ch07:proof:witness'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch07:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:expose' },
          { kind: 'tension', a: 'ember-throne', b: 'verdant-court', delta: 3 },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 River Gate: Reissued manifests published; scandal forced into daylight.' },
        ],
        nextNodeId: 'ch7-ending-expose',
      },
      {
        id: 'ch7-decision-quiet',
        text: `Do not strike yet. Keep the proof and let the river move under the office’s method while you watch.`,
        effects: [{ factionId: 'iron-pact', reputationChange: -1 }],
        exclusiveGroup: 'ch7-river-decision',
        grantsTokens: ['tok:ch07:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-7:resolved' },
          { kind: 'milestone:add', id: 'chapter-7:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ River Gate: Evidence kept privately while the method continues under watch.' },
        ],
        nextNodeId: 'ch7-ending-quiet',
      },
      {
        id: 'ch7-decision-back',
        text: `Not yet. Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-release': {
    id: 'ch7-ending-release',
    speaker: 'Narrator',
    text: `The barges move.

It is a small mercy and a loud one.

The Hall will hate the record you made. The Hall will also use it the next time it wants to pretend it was never asked.`,
    choices: [
      {
        id: 'ch7-ending-release-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-cordon': {
    id: 'ch7-ending-cordon',
    speaker: 'Narrator',
    text: `You keep the line, but you change what the line demands.

Anonymous authority cannot pass the river without a hand to blame.

That will slow the method. It will not stop people from wanting it.`,
    choices: [
      {
        id: 'ch7-ending-cordon-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-escrow': {
    id: 'ch7-ending-escrow',
    speaker: 'Narrator',
    text: `You turn emergency authority into a bond.

The method can still move goods. It just cannot pretend it was free.

Some people will call that justice. Others will call it a price they are willing to pay.`,
    choices: [
      {
        id: 'ch7-ending-escrow-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-ward': {
    id: 'ch7-ending-ward',
    speaker: 'Narrator',
    text: `You do not remove power.

You make its use visible.

At the River Gate, visibility will feel like a verdict: either the Hall stops pretending, or it learns to live with being seen.`,
    choices: [
      {
        id: 'ch7-ending-ward-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-expose': {
    id: 'ch7-ending-expose',
    speaker: 'Narrator',
    text: `The river hears rumors faster than it carries cargo.

The reissued names become a story with numbers. The witness account becomes a story with anger.

You have not broken the method. You have made it costlier to pretend it is not happening.`,
    choices: [
      {
        id: 'ch7-ending-expose-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },

  'ch7-ending-quiet': {
    id: 'ch7-ending-quiet',
    speaker: 'Narrator',
    text: `You watch the method work.

The river moves. Paper moves faster.

Waiting is not peace. It is a strategy. It is also a gamble.`,
    choices: [
      {
        id: 'ch7-ending-quiet-back',
        text: `Return to the quay.`,
        effects: [],
        nextNodeId: 'chapter-7-hub',
      },
    ],
  },
});
