import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-5-hub': {
    id: 'chapter-5-hub',
    speaker: 'Narrator',
    text: 'The Hall calls it an oathline: the thin set of promises that keeps commanders, curators, and merchants from tearing the place apart.

After the counting-house, the oathline feels like a rope pulled tight. Everyone keeps hold of it. Everyone waits for someone else to let go first.

Tonight the oath is being renewed early. That is not a tradition. That is a response.',
    choices: [
      {
        id: 'ch5-hub-draft',
        text: 'Inspect the oath draft and the new clause everyone keeps referencing.',
        effects: [],
        nextNodeId: 'ch5-draft',
      },
      {
        id: 'ch5-hub-aldric',
        text: 'Speak to Aldric about what an oath is worth when paper lies.',
        effects: [],
        nextNodeId: 'ch5-aldric',
      },
      {
        id: 'ch5-hub-thessaly',
        text: 'Speak to Thessaly about wards, consent, and what counts as binding.',
        effects: [],
        nextNodeId: 'ch5-thessaly',
      },
      {
        id: 'ch5-hub-renzo',
        text: 'Speak to Renzo about pricing risk when the Hall forces signatures.',
        effects: [],
        nextNodeId: 'ch5-renzo',
      },
      {
        id: 'ch5-hub-oathkeeper',
        text: 'Find the oathkeeper and ask who wrote the new language.',
        effects: [],
        nextNodeId: 'ch5-oathkeeper',
      },
      {
        id: 'ch5-hub-ceremony',
        text: 'Attend the renewal and decide what kind of promise this place is allowed to be.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch05:proof:draft',
          'tok:ch05:proof:iron-order',
          'tok:ch05:proof:verdant-seal',
          'tok:ch05:proof:ember-price',
          'tok:ch05:proof:oathkeeper',
        ],
        nextNodeId: 'ch5-ceremony',
      },
      {
        id: 'ch5-hub-back',
        text: 'Step away and wait.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch5-draft': {
    id: 'ch5-draft',
    speaker: 'Narrator',
    text: 'The oath draft is formal, old, and intentionally boring. It promises restraint. It promises process.

Then you find the new clause.

It grants emergency authority to an "administrative continuity office" empowered to reroute goods and compel compliance through delegated seal.

It does not name the office. It names a method.',
    choices: [
      {
        id: 'ch5-draft-take',
        text: 'Mark the clause and keep a copy of the draft language.',
        effects: [],
        grantsTokens: ['tok:ch05:proof:draft'],
        nextNodeId: 'chapter-5-hub',
        revealsInfo: 'The oathline draft adds a clause granting emergency authority to an unnamed "administrative continuity office" via delegated seal.',
      },
    ],
  },

  'ch5-aldric': {
    id: 'ch5-aldric',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: 'Aldric reads the draft with the expression of a man forced to pretend he respects paper.

"An oath is not a spell," he says. "It is a line you agree to enforce, even when it costs you."',
    choices: [
      {
        id: 'ch5-aldric-order',
        text: 'Ask what enforcement looks like if the clause stays and the office stays unnamed.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }],
        grantsTokens: ['tok:ch05:proof:iron-order'],
        nextNodeId: 'ch5-aldric-order',
      },
      {
        id: 'ch5-aldric-back',
        text: 'Leave him to the draft.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-aldric-order': {
    id: 'ch5-aldric-order',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Then we make it name itself," Aldric says. "Every order requires a signature. Every seal requires a hand. If the office wants authority, it can carry the weight."',
    choices: [
      {
        id: 'ch5-aldric-order-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-thessaly': {
    id: 'ch5-thessaly',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: 'Thessaly does not touch the draft. She reads it as if it might stain.

"Binding without consent is still binding," she says. "It is also the kind of binding that rots."',
    choices: [
      {
        id: 'ch5-thessaly-seal',
        text: 'Ask whether a counterseal ward could limit what the clause can do.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        grantsTokens: ['tok:ch05:proof:verdant-seal'],
        nextNodeId: 'ch5-thessaly-seal',
      },
      {
        id: 'ch5-thessaly-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-thessaly-seal': {
    id: 'ch5-thessaly-seal',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"A counterseal can make the clause expensive," she says. "Not in coin. In attention. If every use leaves a mark that cannot be scrubbed, people stop calling it an accident."',
    choices: [
      {
        id: 'ch5-thessaly-seal-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-renzo': {
    id: 'ch5-renzo',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: 'Renzo smiles at the draft like it is a contract he expected to see.

"You are teaching the Hall a new skill," he says. "Liability. That skill spreads."',
    choices: [
      {
        id: 'ch5-renzo-price',
        text: 'Ask what it costs to keep trade moving without giving the office a blank check.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        grantsTokens: ['tok:ch05:proof:ember-price'],
        nextNodeId: 'ch5-renzo-price',
      },
      {
        id: 'ch5-renzo-back',
        text: 'Leave him to his sums.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-renzo-price': {
    id: 'ch5-renzo-price',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"If you want restraint to be real, you fund it," he says. "Escrow. Bonds. A compensation fund for seizures that were legal and still wrong."',
    choices: [
      {
        id: 'ch5-renzo-price-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper': {
    id: 'ch5-oathkeeper',
    speaker: 'Oathkeeper Lysa Mar',
    text: 'Lysa Mar has ink under her nails and a voice trained to make words sound older than they are.

"I keep the oathline," she says. "I do not decide who deserves it."',
    choices: [
      {
        id: 'ch5-oathkeeper-proof',
        text: 'Ask who drafted the new clause and who is empowered by it.',
        effects: [],
        grantsTokens: ['tok:ch05:proof:oathkeeper'],
        nextNodeId: 'ch5-oathkeeper-proof',
      },
      {
        id: 'ch5-oathkeeper-react-publish',
        text: 'Ask why the Hall is rushing the oath after you published the annex patterns.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:publish'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch5-oathkeeper-react-publish',
      },
      {
        id: 'ch5-oathkeeper-react-suspend',
        text: 'Ask what happens now that you suspended the annex authority letter.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:suspend'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch5-oathkeeper-react-suspend',
      },
      {
        id: 'ch5-oathkeeper-react-appeals',
        text: 'Ask whether an appeals channel makes the oathline stronger or just louder.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:appeals'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch5-oathkeeper-react-appeals',
      },
      {
        id: 'ch5-oathkeeper-react-liability',
        text: 'Ask who will try to dodge the liability charter you imposed.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:liability'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch5-oathkeeper-react-liability',
      },
      {
        id: 'ch5-oathkeeper-react-quiet',
        text: 'Ask whether quiet corrections ever stay quiet in this Hall.',
        effects: [],
        requiresAllTokens: ['tok:ch04:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch5-oathkeeper-react-quiet',
      },
      {
        id: 'ch5-oathkeeper-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-proof': {
    id: 'ch5-oathkeeper-proof',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"The clause came from a committee docket," she says. "It arrived with a seal impression I could not refuse without causing a scandal." She meets your eyes.

"I can tell you what it is not. It is not any delegation. It is not any court. It is an office that claims the Hall itself."',
    choices: [
      {
        id: 'ch5-oathkeeper-proof-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-react-publish': {
    id: 'ch5-oathkeeper-react-publish',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"Because you forced people to look," she says.

"When the Hall is watched, it reaches for tradition. Tradition is a shield that looks like virtue."',
    choices: [
      {
        id: 'ch5-oathkeeper-react-publish-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-react-suspend': {
    id: 'ch5-oathkeeper-react-suspend',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"It becomes harder to pretend," she says. "And easier to threaten."',
    choices: [
      {
        id: 'ch5-oathkeeper-react-suspend-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-react-appeals': {
    id: 'ch5-oathkeeper-react-appeals',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"Appeals create a record," she says. "Records create enemies. The question is whether you can protect the people who have to sign their anger."',
    choices: [
      {
        id: 'ch5-oathkeeper-react-appeals-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-react-liability': {
    id: 'ch5-oathkeeper-react-liability',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"The same people who have always dodged it," she says. "The people whose names can afford to disappear."',
    choices: [
      {
        id: 'ch5-oathkeeper-react-liability-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-oathkeeper-react-quiet': {
    id: 'ch5-oathkeeper-react-quiet',
    speaker: 'Oathkeeper Lysa Mar',
    text: '"Quiet is a currency," she says. "It spends fast."',
    choices: [
      {
        id: 'ch5-oathkeeper-react-quiet-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ceremony': {
    id: 'ch5-ceremony',
    speaker: 'Narrator',
    text: 'The oathline chamber is cold by design. It keeps hands steady.

Three seals are placed on the table. Three witnesses stand behind them. The oathkeeper opens the book.

The Hall has always called this consent. The Hall has always enforced it like law.

The new clause sits on the page like a knife that insists it is a pen.',
    choices: [
      {
        id: 'ch5-ceremony-rewrite',
        text: 'Strike the clause as written and replace it with one rule: authority must be named.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch05:proof:draft'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch05:outcome:rewrite'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:rewrite' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '✒️ Oathline: Clause rewritten to force named authority.' },
        ],
        nextNodeId: 'ch5-ending-rewrite',
      },
      {
        id: 'ch5-ceremony-counterseal',
        text: 'Allow the clause but bind it to a counterseal ward that makes each use visible and costly.',
        effects: [{ factionId: 'verdant-court', reputationChange: 3 }, { factionId: 'ember-throne', reputationChange: -1 }],
        requiresAllTokens: ['tok:ch05:proof:verdant-seal'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch05:outcome:counterseal'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:counterseal' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Oathline: Counterseal ward attached to emergency authority.' },
        ],
        nextNodeId: 'ch5-ending-counterseal',
      },
      {
        id: 'ch5-ceremony-enforce',
        text: 'Allow the clause and assign Iron to enforce signatures and punish anonymous orders.',
        effects: [{ factionId: 'iron-pact', reputationChange: 4 }, { factionId: 'verdant-court', reputationChange: -2 }],
        requiresAllTokens: ['tok:ch05:proof:iron-order'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch05:outcome:enforce'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:enforce' },
          { kind: 'tension', a: 'iron-pact', b: 'verdant-court', delta: 4 },
          { kind: 'log', message: '🛡️ Oathline: Iron assigned to enforce signatures and punish anonymous authority.' },
        ],
        nextNodeId: 'ch5-ending-enforce',
      },
      {
        id: 'ch5-ceremony-fund',
        text: 'Allow the clause but fund restraint: a compensation bond for legal harms and a price for emergency orders.',
        effects: [{ factionId: 'ember-throne', reputationChange: 3 }, { factionId: 'iron-pact', reputationChange: -1 }],
        requiresAllTokens: ['tok:ch05:proof:ember-price'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch05:outcome:fund'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:fund' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🪙 Oathline: Compensation bond created to price emergency authority.' },
        ],
        nextNodeId: 'ch5-ending-fund',
      },
      {
        id: 'ch5-ceremony-expose',
        text: 'Read the clause aloud and call it what it is: an office claiming the Hall without consent.',
        effects: [{ factionId: 'ember-throne', reputationChange: -2 }, { factionId: 'verdant-court', reputationChange: 1 }],
        requiresAllTokens: ['tok:ch05:proof:draft', 'tok:ch05:proof:oathkeeper'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch05:outcome:expose'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:expose' },
          { kind: 'tension', a: 'ember-throne', b: 'verdant-court', delta: 2 },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '📜 Oathline: Emergency authority clause exposed as a power grab by an unnamed office.' },
        ],
        nextNodeId: 'ch5-ending-expose',
      },
      {
        id: 'ch5-ceremony-delay',
        text: 'Delay the renewal. Keep the oathline unspoken until you know who the office is.',
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }, { factionId: 'iron-pact', reputationChange: -1 }],
        grantsTokens: ['tok:ch05:outcome:delay'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-5:resolved' },
          { kind: 'milestone:add', id: 'chapter-5:resolved:delay' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '⏳ Oathline: Renewal delayed to avoid binding the Hall to an unnamed office.' },
        ],
        nextNodeId: 'ch5-ending-delay',
      },
      {
        id: 'ch5-ceremony-back',
        text: 'Step away from the table.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-rewrite': {
    id: 'ch5-ending-rewrite',
    speaker: 'Narrator',
    text: 'You force the Hall to name its machinery.

The room goes still. Some people look relieved. Some look like you have taken a tool from them.

A named office can be blamed. It can also be defended. Either way, it is no longer a ghost.',
    choices: [
      {
        id: 'ch5-ending-rewrite-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-counterseal': {
    id: 'ch5-ending-counterseal',
    speaker: 'Narrator',
    text: 'You let the clause live, but you make it leave bruises.

Every emergency order will carry a mark no clerk can file away as routine.

You have not removed power. You have chosen to make its use audible.',
    choices: [
      {
        id: 'ch5-ending-counterseal-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-enforce': {
    id: 'ch5-ending-enforce',
    speaker: 'Narrator',
    text: 'You turn the oathline into a policy with teeth.

Iron will make anonymous authority expensive. Iron will also make fear useful.

If the Hall stays together, it will be because the wrong people learned to flinch first.',
    choices: [
      {
        id: 'ch5-ending-enforce-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-fund': {
    id: 'ch5-ending-fund',
    speaker: 'Narrator',
    text: 'You pay for restraint.

It will keep trade moving. It will also teach the office how to speak in numbers no one can argue with.

A priced injustice still counts as injustice. It just becomes harder to call it theft.',
    choices: [
      {
        id: 'ch5-ending-fund-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-expose': {
    id: 'ch5-ending-expose',
    speaker: 'Narrator',
    text: 'You say the quiet part in the room built to keep quiet parts quiet.

The oathkeeper closes the book. The seals sit untouched. Someone laughs, sharp with panic.

You have not won. You have made the Hall aware of its own reflex to create authority without consent.',
    choices: [
      {
        id: 'ch5-ending-expose-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },

  'ch5-ending-delay': {
    id: 'ch5-ending-delay',
    speaker: 'Narrator',
    text: 'You refuse to bind the Hall to a clause you do not understand.

Delay keeps you from signing a mistake. It also gives the unnamed office time to move.

The oathline remains a rope. Everyone keeps hold. Everyone waits.',
    choices: [
      {
        id: 'ch5-ending-delay-back',
        text: 'Return to the corridor.',
        effects: [],
        nextNodeId: 'chapter-5-hub',
      },
    ],
  },
});
