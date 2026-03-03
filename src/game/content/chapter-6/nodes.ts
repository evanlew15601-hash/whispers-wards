import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-6-hub': {
    id: 'chapter-6-hub',
    speaker: 'Narrator',
    text: 'There is an office in Concord Hall that is always unlocked if you know which latch to lift.

No banners. No guards. Only a desk, a lamp, and a ledger that never admits it is a ledger.

If you have been looking for the committee, this is the kind of place it would call home.',
    choices: [
      {
        id: 'ch6-hub-registrar',
        text: 'Enter and address whoever is waiting behind the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
      {
        id: 'ch6-hub-visitor-log',
        text: 'Check the visitor log and see who has been coming here in the quiet hours.',
        effects: [],
        grantsTokens: ['tok:ch06:proof:visitor-log'],
        nextNodeId: 'ch6-visitor-log',
      },
      {
        id: 'ch6-hub-desk',
        text: 'Open the desk drawers and look for the ledger the ledger pretends it is not.',
        effects: [],
        grantsTokens: ['tok:ch06:proof:ledger'],
        nextNodeId: 'ch6-desk',
      },
      {
        id: 'ch6-hub-seals',
        text: 'Inspect the seal impressions on outgoing packets and the stamps they imitate.',
        effects: [],
        grantsTokens: ['tok:ch06:proof:seal'],
        nextNodeId: 'ch6-seals',
      },
      {
        id: 'ch6-hub-door',
        text: 'Inspect the latch and the hinge line for ward-scratches and recent toolwork.',
        effects: [],
        grantsTokens: ['tok:ch06:proof:ward-scratch'],
        nextNodeId: 'ch6-door',
      },
      {
        id: 'ch6-hub-decision',
        text: 'Decide what to do with what the office is doing.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch06:proof:visitor-log',
          'tok:ch06:proof:ledger',
          'tok:ch06:proof:seal',
          'tok:ch06:proof:ward-scratch',
          'tok:ch06:proof:confession',
        ],
        nextNodeId: 'ch6-decision',
      },
      {
        id: 'ch6-hub-back',
        text: 'Not yet. Step away.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch6-registrar': {
    id: 'ch6-registrar',
    speaker: 'Registrar Corven Hale',
    text: 'The person behind the desk stands only when you are close enough that leaving would be rude.

"Envoy," Corven Hale says. Their hair is pinned back with a clerk-pin. Their hands are clean in the way only paper-shufflers manage.

"You have been forcing the Hall to sign its work. That is a fine principle. It is also a slow one."',
    choices: [
      {
        id: 'ch6-registrar-ask-name',
        text: 'Ask what this office calls itself when it writes orders.',
        effects: [],
        nextNodeId: 'ch6-office-name',
      },
      {
        id: 'ch6-registrar-ask-signer',
        text: 'Ask whose seal impression is being used to make the paper obey.',
        effects: [],
        nextNodeId: 'ch6-signer',
      },
      {
        id: 'ch6-registrar-ask-why-now',
        text: 'Ask why the Hall needed this office to exist now, and not ten years ago.',
        effects: [],
        nextNodeId: 'ch6-why-now',
      },
      {
        id: 'ch6-registrar-rewrite',
        text: 'Tell Hale you rewrote the oath clause to force named authority.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:rewrite'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-react-rewrite',
      },
      {
        id: 'ch6-registrar-counterseal',
        text: 'Tell Hale you allowed emergency authority but bound it to a counterseal.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:counterseal'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-react-counterseal',
      },
      {
        id: 'ch6-registrar-expose',
        text: 'Tell Hale you read the clause aloud and called it a power grab.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-react-expose',
      },
      {
        id: 'ch6-registrar-prior',
        text: 'Tell Hale what you have already forced the Hall to do, and see what they admit in response.',
        effects: [],
        nextNodeId: 'ch6-prior',
      },
      {
        id: 'ch6-registrar-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-office-name': {
    id: 'ch6-office-name',
    speaker: 'Registrar Corven Hale',
    text: '"Administrative Continuity," Hale says, like the words are meant to sound inevitable.

"It is not a committee, not exactly. Committees argue. This office prevents arguments from interrupting supply."',
    choices: [
      {
        id: 'ch6-office-name-confession',
        text: 'Tell Hale that calling it continuity does not make it consent.',
        effects: [],
        grantsTokens: ['tok:ch06:proof:confession'],
        nextNodeId: 'ch6-confession',
      },
      {
        id: 'ch6-office-name-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-signer': {
    id: 'ch6-signer',
    speaker: 'Registrar Corven Hale',
    text: 'Hale does not flinch.

"We use what the Hall has always used," they say. "Delegated seal, clerk-recognized stampwork, emergency clause." Their voice stays even. "You could call it theft. The Hall calls it governance."',
    choices: [
      {
        id: 'ch6-signer-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-why-now': {
    id: 'ch6-why-now',
    speaker: 'Registrar Corven Hale',
    text: '"Because the old ways were visible," Hale says. "Visible power has opponents. Invisible power has customers." They glance at the ledger.

"Your reforms are making paper heavier. We are here to make it light again."',
    choices: [
      {
        id: 'ch6-why-now-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-react-rewrite': {
    id: 'ch6-react-rewrite',
    speaker: 'Registrar Corven Hale',
    text: '"Then you have made my job simpler," Hale says.

"Named authority can be bargained with. It can also be blamed. You will discover which people prefer."',
    choices: [
      {
        id: 'ch6-react-rewrite-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-react-counterseal': {
    id: 'ch6-react-counterseal',
    speaker: 'Registrar Corven Hale',
    text: 'Hale looks amused.

"A visible bruise," they say. "A clever constraint. It will work for a while. Then someone will pay to call the bruise normal."',
    choices: [
      {
        id: 'ch6-react-counterseal-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-react-expose': {
    id: 'ch6-react-expose',
    speaker: 'Registrar Corven Hale',
    text: '"Words in the right room," Hale says.

"You can make the Hall embarrassed. Embarrassment is not enforcement."',
    choices: [
      {
        id: 'ch6-react-expose-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-prior': {
    id: 'ch6-prior',
    speaker: 'Registrar Corven Hale',
    text: 'Hale listens without interrupting.

The office is not offended by your reforms. It is curious about them.

"You keep choosing scars," Hale says. "Tell me which ones you think are permanent."',
    choices: [
      {
        id: 'ch6-prior-publish',
        text: 'Tell Hale you published the counting-house patterns and dragged denials onto paper.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:publish'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-publish-node',
      },
      {
        id: 'ch6-prior-suspend',
        text: 'Tell Hale you suspended the annex authority letter and forced orders back to delegations.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:suspend'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-suspend-node',
      },
      {
        id: 'ch6-prior-appeals',
        text: 'Tell Hale you built an appeals channel that forces seizures to answer petitions.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:appeals'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-appeals-node',
      },
      {
        id: 'ch6-prior-liability',
        text: 'Tell Hale you bound anonymous orders to liability and forced names onto risk.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:liability'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-liability-node',
      },
      {
        id: 'ch6-prior-quiet',
        text: 'Tell Hale you made a quiet correction and left the Hall a machine that still looks calm.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-quiet-node',
      },
      {
        id: 'ch6-prior-enforce',
        text: 'Tell Hale you assigned Iron to enforce signatures and punish anonymous authority.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:enforce'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-enforce-node',
      },
      {
        id: 'ch6-prior-fund',
        text: 'Tell Hale you created a compensation bond to price emergency authority.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:fund'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-fund-node',
      },
      {
        id: 'ch6-prior-delay',
        text: 'Tell Hale you delayed the oath renewal rather than sign a clause you did not understand.',
        effects: [],
        requiresAllTokens: ['tok:ch05:outcome:delay'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch6-prior-delay-node',
      },
      {
        id: 'ch6-prior-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-publish-node': {
    id: 'ch6-prior-publish-node',
    speaker: 'Registrar Corven Hale',
    text: '"So you learned the value of noise," Hale says.

"When the Hall is watched, it reaches for procedure. Procedure is a fence. Fences can be climbed, but they keep people honest about where they are."',
    choices: [
      {
        id: 'ch6-prior-publish-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-suspend-node': {
    id: 'ch6-prior-suspend-node',
    speaker: 'Registrar Corven Hale',
    text: '"Visible authority," Hale says.

"People love it. They can point at it. They can threaten it. They can replace it. Then they can pretend the replacement was always the plan."',
    choices: [
      {
        id: 'ch6-prior-suspend-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-appeals-node': {
    id: 'ch6-prior-appeals-node',
    speaker: 'Registrar Corven Hale',
    text: '"Appeals," Hale repeats.

"You put suffering in a queue and call the queue fairness." They shrug. "That may still be an improvement. A queue leaves a record, and records can be used."',
    choices: [
      {
        id: 'ch6-prior-appeals-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-liability-node': {
    id: 'ch6-prior-liability-node',
    speaker: 'Registrar Corven Hale',
    text: '"Liability makes paper heavy," Hale says.

"It also teaches the clever where to hide. If a signature is dangerous, someone will find a hand they can afford to burn."',
    choices: [
      {
        id: 'ch6-prior-liability-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-quiet-node': {
    id: 'ch6-prior-quiet-node',
    speaker: 'Registrar Corven Hale',
    text: 'Hale nods.

"Quiet corrections keep the Hall stable," they say. "They also keep the Hall comfortable. Comfort is how bad habits become permanent."',
    choices: [
      {
        id: 'ch6-prior-quiet-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-enforce-node': {
    id: 'ch6-prior-enforce-node',
    speaker: 'Registrar Corven Hale',
    text: '"A hammer," Hale says, without judgment.

"Hammers solve problems. Hammers also create new rules: whoever holds one gets to define what looks like a nail."',
    choices: [
      {
        id: 'ch6-prior-enforce-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-fund-node': {
    id: 'ch6-prior-fund-node',
    speaker: 'Registrar Corven Hale',
    text: '"You paid for restraint," Hale says.

"That means you believe restraint is possible. It also means you have created a budget for harm. Budgets are easier to renew than vows."',
    choices: [
      {
        id: 'ch6-prior-fund-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-prior-delay-node': {
    id: 'ch6-prior-delay-node',
    speaker: 'Registrar Corven Hale',
    text: '"Delay," Hale says.

"The Hall loves delay. Delay is how it survives consequences. If you want to win against a habit, you do not ask it to wait."',
    choices: [
      {
        id: 'ch6-prior-delay-node-back',
        text: 'Return to the desk.',
        effects: [],
        nextNodeId: 'ch6-registrar',
      },
    ],
  },

  'ch6-visitor-log': {
    id: 'ch6-visitor-log',
    speaker: 'Narrator',
    text: 'The visitor log is not a log. It is a list of initials, docket numbers, and times.

You recognize patterns. Iron escorts listed as "S." Verdant clerks listed as "V." Ember factors listed as "E."

There are also entries that use none of those.

A small set of recurring marks. Concord officials who do not want their names written down.',
    choices: [
      {
        id: 'ch6-visitor-log-note',
        text: 'Memorize the initials and the times that repeat.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
        revealsInfo: 'A visitor list in the quiet office shows recurring Concord officials meeting under initials and docket numbers, outside delegation channels.',
      },
    ],
  },

  'ch6-desk': {
    id: 'ch6-desk',
    speaker: 'Narrator',
    text: 'The top drawer contains clean paper. The second contains red wax sticks cut into careful lengths.

The third drawer is the one that matters.

A fee schedule. A reroute list. A note that reads like a recipe: if Iron escorts are delayed, the route shifts. If petitions stack up, the route shifts. If a delegation objects, the route shifts.

The office does not stop trade. It steers it.',
    choices: [
      {
        id: 'ch6-desk-note',
        text: 'Keep the schedule in mind and put the drawer back exactly as you found it.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
        revealsInfo: 'A hidden fee schedule and reroute list in the quiet office show trade being steered through rules that avoid delegation oversight.',
      },
    ],
  },

  'ch6-seals': {
    id: 'ch6-seals',
    speaker: 'Narrator',
    text: 'The seal impressions are subtle on purpose.

Some imitate delegation wax. Some imitate Concord clerk-stamps.

One is new: a thin mark that looks like nothing unless you know what to compare it to. It matches the shape you saw on the annex authority letter.

A signature disguised as routine.',
    choices: [
      {
        id: 'ch6-seals-note',
        text: 'Keep the signature shape in mind.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
        revealsInfo: 'Seal impressions in the quiet office match the same signature-mark used to authorize the annex outside delegation control.',
      },
    ],
  },

  'ch6-door': {
    id: 'ch6-door',
    speaker: 'Narrator',
    text: 'The latch is polished where a thumb lifts it. The hinge line carries faint scratches.

Not damage. Patterning.

Someone has reinforced this door with a ward fragment meant to discourage casual intrusion and invite the kind of intrusion that leaves no witnesses.

It is a quiet spell for a quiet office.',
    choices: [
      {
        id: 'ch6-door-note',
        text: 'Remember the ward-scratch pattern and what it implies.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
        revealsInfo: 'Ward-scratch patterning on the quiet office door suggests deliberate magical reinforcement designed to deter casual scrutiny.',
      },
    ],
  },

  'ch6-confession': {
    id: 'ch6-confession',
    speaker: 'Registrar Corven Hale',
    text: '"Consent is slow," Hale says. "Consent is political. Consent is a fight in a room full of people who want different things." Their eyes stay on you.

"Continuity is a corridor. You walk it. You arrive. You do not ask the corridor for permission."',
    choices: [
      {
        id: 'ch6-confession-back',
        text: 'Step away from the desk.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-decision': {
    id: 'ch6-decision',
    speaker: 'Narrator',
    text: 'You have enough to act.

The quiet office is not a villain in a cloak. It is a method.

If you allow the method to stand, it will grow into a tradition. If you break it too loudly, it will return under a new name.

You decide what kind of scar the Hall will carry.',
    choices: [
      {
        id: 'ch6-decision-name',
        text: 'Force the office into the light: name it, assign oversight, require signatures for every reroute.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: 1 }],
        requiresAnyTokens: ['tok:ch06:proof:visitor-log', 'tok:ch06:proof:confession'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch06:outcome:name'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:name' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🧷 Quiet Office: Administrative Continuity forced into the light with oversight and signatures.' },
        ],
        nextNodeId: 'ch6-ending-name',
      },
      {
        id: 'ch6-decision-raid',
        text: 'Seize the office and its stamps under Iron guard before it can move its files.',
        effects: [{ factionId: 'iron-pact', reputationChange: 4 }, { factionId: 'ember-throne', reputationChange: -2 }],
        requiresAllTokens: ['tok:ch06:proof:seal'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch06:outcome:raid'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:raid' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 4 },
          { kind: 'log', message: '🛡️ Quiet Office: Seized under Iron guard before its files could disappear.' },
        ],
        nextNodeId: 'ch6-ending-raid',
      },
      {
        id: 'ch6-decision-ward',
        text: 'Bind the office to a ward that makes every emergency order leave a visible mark.',
        effects: [{ factionId: 'verdant-court', reputationChange: 4 }, { factionId: 'iron-pact', reputationChange: -1 }],
        requiresAllTokens: ['tok:ch06:proof:ward-scratch'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch06:outcome:ward'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:ward' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Quiet Office: Emergency authority bound to a visible-mark ward.' },
        ],
        nextNodeId: 'ch6-ending-ward',
      },
      {
        id: 'ch6-decision-bargain',
        text: 'Make a constrained bargain: let the office continue, but price every reroute and publish the schedule to the Hall.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        requiresAllTokens: ['tok:ch06:proof:ledger'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch06:outcome:bargain'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:bargain' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Quiet Office: Constrained bargain struck; reroutes priced and schedule made harder to hide.' },
        ],
        nextNodeId: 'ch6-ending-bargain',
      },
      {
        id: 'ch6-decision-expose',
        text: 'Expose the visitor list and the seal pattern. Turn the office into a public scandal.',
        effects: [{ factionId: 'ember-throne', reputationChange: -2 }, { factionId: 'verdant-court', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch06:proof:visitor-log'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch06:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:expose' },
          { kind: 'tension', a: 'ember-throne', b: 'verdant-court', delta: 2 },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📢 Quiet Office: Visitor list and seal pattern exposed; scandal forced into daylight.' },
        ],
        nextNodeId: 'ch6-ending-expose',
      },
      {
        id: 'ch6-decision-quiet',
        text: 'Do not strike yet. Keep what you learned and let the office believe it is still invisible.',
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }],
        grantsTokens: ['tok:ch06:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-6:resolved' },
          { kind: 'milestone:add', id: 'chapter-6:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Quiet Office: Evidence retained privately while the office remains unaware it has been seen.' },
        ],
        nextNodeId: 'ch6-ending-quiet',
      },
      {
        id: 'ch6-decision-back',
        text: 'Not yet. Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-name': {
    id: 'ch6-ending-name',
    speaker: 'Narrator',
    text: 'A named office is easier to fight.

It is also easier to justify.

You have put a face on the method. The Hall will decide whether to punish the face or appoint it.',
    choices: [
      {
        id: 'ch6-ending-name-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-raid': {
    id: 'ch6-ending-raid',
    speaker: 'Narrator',
    text: 'Iron boots in a quiet corridor sound like thunder.

The office does not resist. It cannot. Paper does not swing swords.

If the method survives, it will survive as resentment: the idea that the Hall could have been governed without asking anyone.',
    choices: [
      {
        id: 'ch6-ending-raid-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-ward': {
    id: 'ch6-ending-ward',
    speaker: 'Narrator',
    text: 'You do not end the office. You make it leave fingerprints.

The ward will not stop a determined tyrant. It will stop the comfortable lie that nobody chose this.

Visibility is not justice. It is the price of pretending at it.',
    choices: [
      {
        id: 'ch6-ending-ward-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-bargain': {
    id: 'ch6-ending-bargain',
    speaker: 'Narrator',
    text: 'You let the office continue and teach it a new fear: accounting.

A priced reroute is still a reroute. A public schedule is still a schedule.

You have made the method negotiable. You have not made it good.',
    choices: [
      {
        id: 'ch6-ending-bargain-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-expose': {
    id: 'ch6-ending-expose',
    speaker: 'Narrator',
    text: 'The office was built to survive being known.

It was not built to survive being understood.

You have given the Hall something it hates more than scandal: a clear description of its own bad habit.',
    choices: [
      {
        id: 'ch6-ending-expose-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },

  'ch6-ending-quiet': {
    id: 'ch6-ending-quiet',
    speaker: 'Narrator',
    text: 'You do not strike.

The office keeps moving goods. It keeps making the Hall feel calm.

In your pocket, the proof feels heavy. That is the price of waiting: you carry the weight alone.',
    choices: [
      {
        id: 'ch6-ending-quiet-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-6-hub',
      },
    ],
  },
});
