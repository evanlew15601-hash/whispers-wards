import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-2-hub': {
    id: 'chapter-2-hub',
    speaker: 'Narrator',
    text: `Ash Road is jammed with stalled wagons and tired guards. A customs barrier blocks the lane. A clerk keeps writing while people argue with him.

Farther up, a waystation serves watered ale and rumors. A small counting-house flies Ember colors and pretends it is here by accident. On the hillside, a Verdant tally-grove watches the line in patient silence. Beyond them, an Iron field tent posts fresh orders that do not match the state of the line.

If you clear the road too quickly, you may be clearing it for the wrong reason. If you take too long, it will clear itself with force.`,
    choices: [
      {
        id: 'ch2-hub-waystation',
        text: `Start at the waystation. Hear what the merchants are saying.`,
        effects: [],
        nextNodeId: 'ch2-waystation',
      },
      {
        id: 'ch2-hub-customs',
        text: `Go to the customs post and ask for the docket trail.`,
        effects: [],
        nextNodeId: 'ch2-customs',
      },
      {
        id: 'ch2-hub-counting',
        text: `Visit the Ember counting-house and request terms in plain language.`,
        effects: [],
        nextNodeId: 'ch2-counting-house',
      },
      {
        id: 'ch2-hub-tally',
        text: `Climb to the tally-grove and ask what the road remembers.`,
        effects: [],
        nextNodeId: 'ch2-tally-grove',
      },
      {
        id: 'ch2-hub-dispatches',
        text: `Open the Concord Hall dispatches you carried into the crisis.`,
        effects: [],
        nextNodeId: 'ch2-dispatches',
      },
      {
        id: 'ch2-hub-tribunal',
        text: `Call a roadside tribunal and force a decision while there is still time.`,
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch02:seal:ashwax',
          'tok:ch02:witness:waystation',
          'tok:ch02:docket:trail',
          'tok:ch02:iron:toll-order',
          'tok:ch02:ledger:irregular',
          'tok:ch02:verdant:reroute-ward',
          'tok:ch02:ember:escrow-terms',
          'tok:ch02:pattern:committee',
        ],
        nextNodeId: 'ch2-tribunal',
      },
    ],
  },

  'ch2-dispatches': {
    id: 'ch2-dispatches',
    speaker: 'Narrator',
    text: `You break the seals in the shade of a wagon. One packet bears an Iron impress. The other carries Ember wax, thin and immaculate.

Neither message will clear the road for you. Both will try to claim your decision after the fact.`,
    choices: [
      {
        id: 'ch2-dispatches-aldric',
        text: `Read the Iron dispatch.`,
        effects: [],
        nextNodeId: 'ch2-dispatch-aldric',
      },
      {
        id: 'ch2-dispatches-renzo',
        text: `Read the Ember dispatch.`,
        effects: [],
        nextNodeId: 'ch2-dispatch-renzo',
      },
      {
        id: 'ch2-dispatches-back',
        text: `Put the papers away and return to the road.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-dispatch-aldric': {
    id: 'ch2-dispatch-aldric',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: `"Envoy.

Ash Road is a throat. Do not let a merchant\'s hand close it and call it law. If you must choose, choose a rule that can be enforced in public and explained to a hungry guard.

Make the record clean. If someone is issuing orders without a face, drag the face into daylight."`,
    choices: [
      {
        id: 'ch2-aldric-back',
        text: `Return to the dispatches.`,
        effects: [],
        nextNodeId: 'ch2-dispatches',
        revealsInfo: 'Aldric urged you to choose a public rule on Ash Road and expose any hidden chain of orders.',
      },
    ],
  },

  'ch2-dispatch-renzo': {
    id: 'ch2-dispatch-renzo',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: `"Envoy,

I am told your line has stalled and that everyone is shouting at the same tired clerk. That is the oldest trick in governance: exhaust the witness and call the exhaustion truth.

Put the costs on paper and decide who pays them. Then find the signature that profits from delay.

If you want advice I would sign, I will give it to you when you can offer me the same."`,
    choices: [
      {
        id: 'ch2-renzo-back',
        text: `Return to the dispatches.`,
        effects: [],
        nextNodeId: 'ch2-dispatches',
        revealsInfo: 'Renzo framed Ash Road as an exhaustion tactic and urged you to trace who benefits from delay.',
      },
    ],
  },

  'ch2-waystation': {
    id: 'ch2-waystation',
    speaker: 'Keeper Marra',
    text: `Marra wipes down a table that never stays clean. Her sleeves are rolled up; her patience is not.

"Envoy," she says. "If this line doesn\'t move by dusk, someone will try to move it with a blade. The guards will answer. Then it becomes a story nobody can stop repeating."`,
    choices: [
      {
        id: 'ch2-waystation-seal',
        text: `Ask to see the crate seal everyone is shouting about.`,
        effects: [],
        nextNodeId: 'ch2-seal-check',
      },
      {
        id: 'ch2-waystation-witness',
        text: `Take a sworn statement from the merchant who claims their cargo was seized.`,
        effects: [],
        nextNodeId: 'ch2-witness',
      },
      {
        id: 'ch2-waystation-calm',
        text: `Tell the crowd you will produce an answer before nightfall.`,
        effects: [
          { factionId: 'iron-pact', reputationChange: 2 },
          { factionId: 'verdant-court', reputationChange: 2 },
        ],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'Ash Road is close to boiling. If the line holds through dusk, violence is likely.',
      },
      {
        id: 'ch2-waystation-back',
        text: `Leave the waystation.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-seal-check': {
    id: 'ch2-seal-check',
    speaker: 'Narrator',
    text: `The seal is the right shape, pressed with a crest that looks official at a glance. Up close, the wax flakes too easily. Your fingertip comes away dark.

Someone wanted the appearance of authority, not the burden of it.`,
    choices: [
      {
        id: 'ch2-seal-record',
        text: `Record the seal as ash wax and keep a flake as proof.`,
        effects: [],
        grantsTokens: ['tok:ch02:seal:ashwax'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'The customs seals on seized cargo are made of ash wax. They imitate authority and do not hold under scrutiny.',
      },
      {
        id: 'ch2-seal-ask-origin',
        text: `Ask which clerk issued the seal.`,
        effects: [],
        grantsTokens: ['tok:ch02:seal:ashwax'],
        nextNodeId: 'ch2-customs',
      },
    ],
  },

  'ch2-witness': {
    id: 'ch2-witness',
    speaker: 'Merchant Jalen',
    text: `Jalen keeps glancing over his shoulder as he speaks. His hands shake when he tries to hold them still.

"They took crates," he says. "Not contraband. Grain and lamp oil. The guard said it was a docket order. I asked for the number. He told me to stop asking."`,
    choices: [
      {
        id: 'ch2-witness-sign',
        text: `Make him sign a statement and add your mark as witness.`,
        effects: [],
        grantsTokens: ['tok:ch02:witness:waystation'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'A merchant signed a statement that grain and lamp oil were seized under a docket order, without a number given to the owner.',
      },
      {
        id: 'ch2-witness-push',
        text: `Press him. Ask what he is not telling you.`,
        effects: [
          { factionId: 'ember-throne', reputationChange: 2 },
          { factionId: 'verdant-court', reputationChange: -1 },
        ],
        grantsTokens: ['tok:ch02:witness:waystation'],
        nextNodeId: 'ch2-witness-addendum',
      },
      {
        id: 'ch2-witness-back',
        text: `Let him go.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-witness-addendum': {
    id: 'ch2-witness-addendum',
    speaker: 'Merchant Jalen',
    text: `He swallows.

"There was a second man. Not in uniform. He spoke for the clerk. He told the guard what to take." Jalen stares at the table. "He called it the committee. Like that meant I should know."`,
    choices: [
      {
        id: 'ch2-witness-committee',
        text: `Write down the name and keep it separate from gossip.`,
        effects: [],
        grantsTokens: ['tok:ch02:pattern:committee'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'A merchant claims a civilian adviser spoke for customs and referred to a committee issuing seizures.',
      },
    ],
  },

  'ch2-customs': {
    id: 'ch2-customs',
    speaker: 'Clerk Iven',
    speakerFaction: 'iron-pact',
    text: `Iven does not look up until you say your title. When he does, his eyes go to your hands first.

"Envoy," he says. "We\'re holding the road under a temporary toll order. The docket trail is complete. The seizures are lawful."`,
    choices: [
      {
        id: 'ch2-customs-audit',
        text: `Ask for the docket ledger and follow the numbers yourself.`,
        effects: [],
        grantsTokens: ['tok:ch02:docket:trail'],
        nextNodeId: 'ch2-docket-trail',
        revealsInfo: 'You obtained the Ash Road docket ledger. It records seizures, reissues, and delays by number.',
      },
      {
        id: 'ch2-customs-order',
        text: `Demand the original toll order that justifies the barrier.`,
        effects: [],
        nextNodeId: 'ch2-toll-order',
      },
      {
        id: 'ch2-customs-back',
        text: `Leave customs.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-docket-trail': {
    id: 'ch2-docket-trail',
    speaker: 'Narrator',
    text: `The numbers are clean.

A shipment is seized, then reissued to a different name, then delayed again. The same few agents appear on the margins in careful handwriting. The clerks\' signatures do not match the pace of the crisis.

The clerk will call it procedure. Procedure can be accurate and still be used as a weapon.`,
    choices: [
      {
        id: 'ch2-docket-counting',
        text: `Follow the reissued names to the Ember counting-house.`,
        effects: [],
        nextNodeId: 'ch2-counting-house',
      },
      {
        id: 'ch2-docket-tally',
        text: `Show the margin marks to the Verdant tally-keepers.`,
        effects: [],
        nextNodeId: 'ch2-tally-marks',
      },
      {
        id: 'ch2-docket-back',
        text: `Return to the road.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-toll-order': {
    id: 'ch2-toll-order',
    speaker: 'Clerk Iven',
    speakerFaction: 'iron-pact',
    text: `Iven opens a folder without touching the rest of the stack. He slides one sheet across the desk.

It is signed and sealed. It is dated before the first wagons stalled.

"Temporary," it says. "Until stability is restored."`,
    choices: [
      {
        id: 'ch2-order-copy',
        text: `Take a copy for the record.`,
        effects: [],
        grantsTokens: ['tok:ch02:iron:toll-order'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'The Ash Road toll order was signed and dated before the crisis began.',
      },
      {
        id: 'ch2-order-origin',
        text: `Ask who requested the order.`,
        effects: [],
        grantsTokens: ['tok:ch02:iron:toll-order'],
        nextNodeId: 'ch2-order-origin',
      },
    ],
  },

  'ch2-order-origin': {
    id: 'ch2-order-origin',
    speaker: 'Clerk Iven',
    speakerFaction: 'iron-pact',
    text: `He pauses long enough to decide what kind of trouble you are.

"It came from the Hall," he says. "Not from the Commander. Not from the druid emissary. Not from the trade consul." He shuts the folder. "It came through a committee docket."`,
    choices: [
      {
        id: 'ch2-origin-token',
        text: `Write down the committee docket and keep it separate.`,
        effects: [],
        grantsTokens: ['tok:ch02:pattern:committee'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'Customs claims the toll order came through a Concord committee docket, not directly from any of the three delegations.',
      },
    ],
  },

  'ch2-counting-house': {
    id: 'ch2-counting-house',
    speaker: 'Factor Loran',
    speakerFaction: 'ember-throne',
    text: `Loran\'s smile is practiced. He looks like someone who can answer a question and still avoid it.

"Envoy," he says. "Roads close and markets adjust. People find new ways to pay. You want the line to move again. That can be arranged."`,
    choices: [
      {
        id: 'ch2-counting-terms',
        text: `Ask for escrow terms in plain language, not flourishes.`,
        effects: [],
        grantsTokens: ['tok:ch02:ember:escrow-terms'],
        nextNodeId: 'ch2-escrow-terms',
      },
      {
        id: 'ch2-counting-ledger',
        text: `Ask for the raw ledger entries tied to the reissued names.`,
        effects: [],
        nextNodeId: 'ch2-ledger-request',
      },
      {
        id: 'ch2-counting-back',
        text: `Leave the counting-house.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-escrow-terms': {
    id: 'ch2-escrow-terms',
    speaker: 'Factor Loran',
    speakerFaction: 'ember-throne',
    text: `He lays out the offer. Ember will administer the road. Goods move if fees are paid up front. Disputes are settled by accountants. Miss one payment and your cargo waits.

"It\'s fair," Loran says. "Equal rules for everyone." He does not say who wrote the rules.`,
    choices: [
      {
        id: 'ch2-escrow-accept-info',
        text: `Take the terms and keep them as leverage.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'Ember offered to administer Ash Road through escrow fees and accountant arbitration. The rules are equal. The leverage is not.',
      },
    ],
  },

  'ch2-ledger-request': {
    id: 'ch2-ledger-request',
    speaker: 'Factor Loran',
    speakerFaction: 'ember-throne',
    text: `Loran\'s eyes flick to the door.

"Raw entries are not polite," he says. "They hurt people who believe themselves important." He steeples his fingers. "If you want them, give me a reason to believe you won\'t use them to start a public fight."`,
    choices: [
      {
        id: 'ch2-ledger-with-witness',
        text: `Show him the sworn statement. Tell him you are building a record, not a spectacle.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:witness:waystation'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:ledger:irregular'],
        nextNodeId: 'ch2-ledger-result',
      },
      {
        id: 'ch2-ledger-appeal',
        text: `Offer to protect sources if he gives you the truth.`,
        effects: [{ factionId: 'ember-throne', reputationChange: 3 }],
        requiredReputation: { factionId: 'ember-throne', min: 10 },
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:ledger:irregular'],
        nextNodeId: 'ch2-ledger-result',
      },
      {
        id: 'ch2-ledger-back',
        text: `Leave it for now.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ledger-result': {
    id: 'ch2-ledger-result',
    speaker: 'Narrator',
    text: `The entries are short, dense, and unromantic. Payments routed through cutouts. Fees recorded as storage and inspection. The same few names show up whenever a wagon is delayed.

None of it proves intent on its own. It proves coordination.`,
    choices: [
      {
        id: 'ch2-ledger-note',
        text: `Mark the irregular chain and keep the copied entries sealed.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'A raw ledger copy shows repeated fees and payments tied to delays and seizures on Ash Road.',
      },
    ],
  },

  'ch2-tally-grove': {
    id: 'ch2-tally-grove',
    speaker: 'Tally-Keeper Cerys',
    speakerFaction: 'verdant-court',
    text: `The grove is a terrace of living columns, each marked with careful cuts. Cerys watches you approach.

"A road forces choices," she says. "People pretend the road decides for them. It doesn\'t."`,
    choices: [
      {
        id: 'ch2-tally-ritual',
        text: `Ask for a reroute ward to relieve the pressure on the road.`,
        effects: [],
        grantsTokens: ['tok:ch02:verdant:reroute-ward'],
        nextNodeId: 'ch2-ward-result',
      },
      {
        id: 'ch2-tally-marks',
        text: `Show her the margin marks from the docket ledger.`,
        effects: [],
        requiresAllTokens: ['tok:ch02:docket:trail'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch2-tally-marks',
      },
      {
        id: 'ch2-tally-back',
        text: `Leave the grove.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ward-result': {
    id: 'ch2-ward-result',
    speaker: 'Narrator',
    text: `Cerys does not offer a chant. She offers constraints. A ward that shifts traffic to a secondary path, away from the barrier.

"It will work," she says. "It will also make new enemies."`,
    choices: [
      {
        id: 'ch2-ward-note',
        text: `Take the ward pattern and keep the details quiet.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'A Verdant reroute ward could move traffic off Ash Road. It would also shift who profits and who suffers.',
      },
    ],
  },

  'ch2-tally-marks': {
    id: 'ch2-tally-marks',
    speaker: 'Tally-Keeper Cerys',
    speakerFaction: 'verdant-court',
    text: `She studies the marks, then the page around them.

"Not clerk marks," she says. "Keys." She taps the margin with one nail. "Someone taught a scribe to write a ward fragment in a place no soldier thinks to look."`,
    choices: [
      {
        id: 'ch2-marks-committee',
        text: `Ask who taught them.`,
        effects: [],
        grantsTokens: ['tok:ch02:pattern:committee'],
        nextNodeId: 'chapter-2-hub',
        revealsInfo: 'Verdant tally-keepers say the docket margin marks act like ward keys. Someone blended clerk craft with ward craft.',
      },
    ],
  },

  'ch2-tribunal': {
    id: 'ch2-tribunal',
    speaker: 'Narrator',
    text: `You pull the relevant people into the same space. A guard lieutenant. A customs clerk. A merchant with shaking hands. An Ember factor who keeps smiling. A Verdant keeper who refuses to look rushed.

No decision will be clean. A clean decision is usually a decision that hides its costs.`,
    choices: [
      {
        id: 'ch2-trib-stopgap',
        text: `Broker a stopgap. Release essential goods under escort and revisit the rest after tempers cool.`,
        effects: [
          { factionId: 'iron-pact', reputationChange: 2 },
          { factionId: 'verdant-court', reputationChange: 1 },
          { factionId: 'ember-throne', reputationChange: -2 },
        ],
        grantsTokens: ['tok:ch02:outcome:stopgap'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:stopgap' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 4 },
          { kind: 'log', message: '📜 Ash Road: Stopgap release under escort.' },
        ],
        nextNodeId: 'ch2-ending-stopgap',
      },
      {
        id: 'ch2-trib-iron',
        text: `Back Iron enforcement. Keep the barrier and make seizures transparent.`,
        effects: [
          { factionId: 'iron-pact', reputationChange: 6 },
          { factionId: 'verdant-court', reputationChange: -4 },
          { factionId: 'ember-throne', reputationChange: -2 },
        ],
        requiresAllTokens: ['tok:ch02:iron:toll-order'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:outcome:iron'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:iron' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 8 },
          { kind: 'log', message: '🛡️ Ash Road: Iron enforcement and published seizures.' },
        ],
        nextNodeId: 'ch2-ending-iron',
      },
      {
        id: 'ch2-trib-verdant',
        text: `Back a Verdant reroute ward and accept the political cost.`,
        effects: [
          { factionId: 'verdant-court', reputationChange: 6 },
          { factionId: 'iron-pact', reputationChange: -2 },
          { factionId: 'ember-throne', reputationChange: -2 },
        ],
        requiresAllTokens: ['tok:ch02:verdant:reroute-ward'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:outcome:verdant'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:verdant' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 4 },
          { kind: 'tension', a: 'ember-throne', b: 'verdant-court', delta: 4 },
          { kind: 'log', message: '🌿 Ash Road: Verdant reroute ward applied.' },
        ],
        nextNodeId: 'ch2-ending-verdant',
      },
      {
        id: 'ch2-trib-ember',
        text: `Accept Ember escrow administration. Let the road move and pay the price later.`,
        effects: [
          { factionId: 'ember-throne', reputationChange: 8 },
          { factionId: 'iron-pact', reputationChange: -2 },
          { factionId: 'verdant-court', reputationChange: -2 },
        ],
        requiresAllTokens: ['tok:ch02:ember:escrow-terms'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:outcome:ember'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:ember' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 2 },
          { kind: 'tension', a: 'verdant-court', b: 'ember-throne', delta: 2 },
          { kind: 'log', message: '🧾 Ash Road: Ember escrow administration accepted.' },
        ],
        nextNodeId: 'ch2-ending-ember',
      },
      {
        id: 'ch2-trib-expose',
        text: `Expose the irregular chain. Put the docket trail and the ledger copy on the table.`,
        effects: [
          { factionId: 'ember-throne', reputationChange: -10 },
          { factionId: 'iron-pact', reputationChange: 3 },
          { factionId: 'verdant-court', reputationChange: 3 },
        ],
        requiresAllTokens: ['tok:ch02:docket:trail', 'tok:ch02:ledger:irregular'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:expose' },
          { kind: 'tension', a: 'ember-throne', b: 'iron-pact', delta: 10 },
          { kind: 'log', message: '🔎 Ash Road: Irregular chain exposed in tribunal.' },
        ],
        nextNodeId: 'ch2-ending-expose',
      },
      {
        id: 'ch2-trib-name-committee',
        text: `Name the committee docket and require written authority for every seizure.`,
        effects: [
          { factionId: 'iron-pact', reputationChange: 2 },
          { factionId: 'verdant-court', reputationChange: 2 },
          { factionId: 'ember-throne', reputationChange: -4 },
        ],
        requiresAllTokens: ['tok:ch02:pattern:committee'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch02:outcome:committee'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-2:resolved' },
          { kind: 'milestone:add', id: 'chapter-2:resolved:committee' },
          { kind: 'tension', a: 'iron-pact', b: 'ember-throne', delta: 6 },
          { kind: 'log', message: '📎 Ash Road: Committee docket named and constrained.' },
        ],
        nextNodeId: 'ch2-ending-committee',
      },
      {
        id: 'ch2-trib-back',
        text: `Adjourn. You need more proof before you force a public decision.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-stopgap': {
    id: 'ch2-ending-stopgap',
    speaker: 'Narrator',
    text: `You get the essential wagons moving. Grain and lamp oil. Under escort, with signatures. Everyone agrees because the alternative is worse.

The rest remains stuck. The clerk keeps writing. The factor keeps smiling.

You bought time. You did not buy clarity.`,
    choices: [
      {
        id: 'ch2-ending-stopgap-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-iron': {
    id: 'ch2-ending-iron',
    speaker: 'Narrator',
    text: `The barrier stays. Seizures are logged in front of witnesses. The crowd hates it, but it stops pretending it does not know where to aim its anger.

The road moves again, slowly, under the weight of enforcement.`,
    choices: [
      {
        id: 'ch2-ending-iron-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-verdant': {
    id: 'ch2-ending-verdant',
    speaker: 'Narrator',
    text: `The ward shifts traffic off the chokepoint. The barrier matters less within an hour.

Merchants cheer until they realize someone else is paying the cost. A village off the old path now sees wagons at its door. Guards follow.

You moved the pressure. You did not remove it.`,
    choices: [
      {
        id: 'ch2-ending-verdant-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-ember': {
    id: 'ch2-ending-ember',
    speaker: 'Narrator',
    text: `Under Ember administration, the wagons move. Not because anyone is persuaded, but because the terms are clear and the fees are due.

People who can pay will say the system is fair. People who cannot will learn what fairness means in a ledger.

The road opens. A new obligation takes shape.`,
    choices: [
      {
        id: 'ch2-ending-ember-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-expose': {
    id: 'ch2-ending-expose',
    speaker: 'Narrator',
    text: `You put the docket trail beside the copied entries. The room goes quiet as prepared lines stop working.

The factor disputes the interpretation. The clerk claims he only follows procedure. The merchant looks like he might faint.

You did not prove the whole scheme. You proved enough to make denial costly.

The line moves. The backlash starts moving with it.`,
    choices: [
      {
        id: 'ch2-ending-expose-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },

  'ch2-ending-committee': {
    id: 'ch2-ending-committee',
    speaker: 'Narrator',
    text: `You name the committee docket out loud and demand written authority for every seizure.

It is a small demand on paper. It is a large demand in practice.

The clerk hesitates and the guard waits. The factor watches, measuring the cost of compliance.

The road begins to move because delay is harder to defend in public.`,
    choices: [
      {
        id: 'ch2-ending-committee-back',
        text: `Return to the line.`,
        effects: [],
        nextNodeId: 'chapter-2-hub',
      },
    ],
  },
});
;
