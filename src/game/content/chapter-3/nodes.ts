import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-3-hub': {
    id: 'chapter-3-hub',
    speaker: 'Narrator',
    text: 'The Root-Archive sits in a shallow valley beyond the road. Stone steps descend to a sealed door where Verdant marks sit beside clerk-script under old Concord stamps.

Thessaly Wren waits under the trees, close enough to be seen and far enough to deny she was here. A courier lingers by the entrance while an Iron scout watches the path.

Someone tried to make this place neutral. Someone tried to make it useful.',
    choices: [
      {
        id: 'ch3-hub-thessaly',
        text: 'Speak to Thessaly Wren before you go inside.',
        effects: [],
        nextNodeId: 'ch3-thessaly',
      },
      {
        id: 'ch3-hub-stonework',
        text: 'Inspect the door, stamps, and latch marks.',
        effects: [],
        nextNodeId: 'ch3-stonework',
      },
      {
        id: 'ch3-hub-curator',
        text: 'Request entry and ask for the curator by name.',
        effects: [],
        nextNodeId: 'ch3-curator',
      },
      {
        id: 'ch3-hub-scout',
        text: 'Speak to the Iron scout and ask what they are here to prevent.',
        effects: [],
        nextNodeId: 'ch3-scout',
      },
      {
        id: 'ch3-hub-courier',
        text: 'Question the courier about who sent them and what they carried.',
        effects: [],
        nextNodeId: 'ch3-courier',
      },
      {
        id: 'ch3-hub-replies',
        text: 'Review the notes that arrived after Ash Road.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
      {
        id: 'ch3-hub-back',
        text: 'Step away from the door and reconsider.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch3-thessaly': {
    id: 'ch3-thessaly',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"You moved Ash Road," Thessaly says. She watches the entrance as if the door might listen.

"Now you want records." She lowers her voice. "If you take anything out of this place, make sure it is something you are willing to defend in daylight."',
    choices: [
      {
        id: 'ch3-thessaly-ask-stopgap',
        text: 'Ask what she thinks of the stopgap escort and partial release.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:stopgap'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-stopgap',
      },
      {
        id: 'ch3-thessaly-ask-iron',
        text: 'Ask what she thinks of Iron enforcement on the road.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-iron',
      },
      {
        id: 'ch3-thessaly-ask-verdant',
        text: 'Ask what she thinks of the reroute ward and its cost.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-verdant',
      },
      {
        id: 'ch3-thessaly-ask-ember',
        text: 'Ask what she thinks of Ember escrow administration.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-ember',
      },
      {
        id: 'ch3-thessaly-ask-expose',
        text: 'Ask whether exposing the chain was worth the backlash.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-expose',
      },
      {
        id: 'ch3-thessaly-ask-committee',
        text: 'Ask what she thinks of naming the committee docket in public.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:committee'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-thessaly-react-committee',
      },
      {
        id: 'ch3-thessaly-ask',
        text: 'Ask what she expects the Archive to show.',
        effects: [],
        nextNodeId: 'ch3-thessaly-ask',
      },
      {
        id: 'ch3-thessaly-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-stopgap': {
    id: 'ch3-thessaly-react-stopgap',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"A stopgap is honest," she says. "It admits you are choosing who eats first. It also teaches everyone to wait for the next exception."',
    choices: [
      {
        id: 'ch3-thessaly-react-stopgap-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-iron': {
    id: 'ch3-thessaly-react-iron',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"Iron can move a line," she says. "It can teach a line to fear moving without permission. Once that lesson spreads, you do not get to choose where it stops."',
    choices: [
      {
        id: 'ch3-thessaly-react-iron-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-verdant': {
    id: 'ch3-thessaly-react-verdant',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"A reroute ward is a clean tool," she says. "If you moved the pressure onto someone who never consented to carry it, remember their names."',
    choices: [
      {
        id: 'ch3-thessaly-react-verdant-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-ember': {
    id: 'ch3-thessaly-react-ember',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"Escrow moves goods," she says. "It turns the road into a test of who can pay to be treated as real, and it will be called fair by the people collecting the fees."',
    choices: [
      {
        id: 'ch3-thessaly-react-ember-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-expose': {
    id: 'ch3-thessaly-react-expose',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"Truth has a cost," she says. "If you force it out too early, the cost lands on people who did not choose the fight. If you never force it out, the cost still lands."',
    choices: [
      {
        id: 'ch3-thessaly-react-expose-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-react-committee': {
    id: 'ch3-thessaly-react-committee',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"Naming it makes it real," she says. "That can be useful. It can also give it a banner to hide behind."',
    choices: [
      {
        id: 'ch3-thessaly-react-committee-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-thessaly-ask': {
    id: 'ch3-thessaly-ask',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: '"Chains," she says. "Who signed, who stamped, who recorded it, who enforced it. The committee you heard about sits in a line of them. This one is active."',
    choices: [
      {
        id: 'ch3-thessaly-note',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-stonework': {
    id: 'ch3-stonework',
    speaker: 'Narrator',
    text: 'The door is older than the stamps on it. The latch has been replaced more than once. A clean set of tool marks sits under the newest Concord impression.

Someone repaired the entrance recently. They did not advertise it.',
    choices: [
      {
        id: 'ch3-stonework-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-curator': {
    id: 'ch3-curator',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'Hest keeps his hands clean by never touching anything directly. He uses a cloth for the latch. He uses titles for people.

"Envoy," he says. "If Ash Road taught you anything, it should have taught you that paper is a tool. It can serve order, or it can serve theft."',
    choices: [
      {
        id: 'ch3-curator-margin',
        text: 'Ask about the ward keys hidden in margins.',
        effects: [],
        nextNodeId: 'ch3-margin-keys',
      },
      {
        id: 'ch3-curator-ask-entry',
        text: 'Request access to the sealed registers.',
        effects: [],
        nextNodeId: 'ch3-sealed-registers',
      },
      {
        id: 'ch3-curator-back',
        text: 'Leave the curator to his work.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-margin-keys': {
    id: 'ch3-margin-keys',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'Hest looks past you, as if checking whether the idea is listening.

"A ward key is permission," he says. "It appears in the margin when someone grants access without putting their name on it. That is what worries me."',
    choices: [
      {
        id: 'ch3-margin-note',
        text: 'Ask what the Archive can trace in writing and stampwork.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        nextNodeId: 'ch3-margin-proof',
      },
      {
        id: 'ch3-margin-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-margin-proof': {
    id: 'ch3-margin-proof',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: '"This place keeps chains," Hest says. "Ink lineages and custody notes.

Courts turn those chains into judgement. The Archive keeps them intact.

If someone built a committee that issues authority through paperwork and ward craft, we can find where its stamp first appeared."',
    choices: [
      {
        id: 'ch3-margin-close',
        text: 'Tell him you will return with a specific docket to trace.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-sealed-registers': {
    id: 'ch3-sealed-registers',
    speaker: 'Curator Hest',
    speakerFaction: 'verdant-court',
    text: 'He does not refuse. He does not agree.

"Access is a policy question," he says. "If I open a sealed register for you, I set a rule that outlives both of us. If I refuse, someone less careful will come later with a better threat."',
    choices: [
      {
        id: 'ch3-registers-pledge',
        text: 'Offer a written pledge: no copies, no names, only chain-of-authority.',
        effects: [{ factionId: 'verdant-court', reputationChange: 2 }],
        nextNodeId: 'ch3-registers-result',
        revealsInfo: 'You offered a pledge to limit what you take from the Root-Archive: chain-of-authority without names.',
      },
      {
        id: 'ch3-registers-pressure',
        text: 'Tell him the road is already being strangled by hidden rules.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'verdant-court', reputationChange: -1 }],
        nextNodeId: 'ch3-registers-result',
      },
      {
        id: 'ch3-registers-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-registers-result': {
    id: 'ch3-registers-result',
    speaker: 'Narrator',
    text: 'The curator does not give you what you want. He gives you a path to it.

He provides a list of committee stamps that exist outside the delegations, along with docket formats that predate recent crises. It gives you a place to start. It would not hold up in open court.

If the committee is real, it did not begin on Ash Road.',
    choices: [
      {
        id: 'ch3-registers-result-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-scout': {
    id: 'ch3-scout',
    speaker: 'Scout Rell',
    speakerFaction: 'iron-pact',
    text: 'Rell keeps his hands near his belt but not on the hilt.

"I was ordered to watch the door," he says. "If the wrong record comes out of it, someone will use it to justify a purge."',
    choices: [
      {
        id: 'ch3-scout-ask',
        text: 'Ask who he thinks will do it.',
        effects: [],
        nextNodeId: 'ch3-scout-ask',
      },
      {
        id: 'ch3-scout-back',
        text: 'Leave him to his watch.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-scout-ask': {
    id: 'ch3-scout-ask',
    speaker: 'Scout Rell',
    speakerFaction: 'iron-pact',
    text: '"Anyone with the will," he says. "If you build a system where orders can be issued without a face, the only safeguard is who has the courage to refuse. That courage runs out."',
    choices: [
      {
        id: 'ch3-scout-note',
        text: 'Thank him and return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-courier': {
    id: 'ch3-courier',
    speaker: 'Courier Sera',
    text: 'Sera\'s boots are still muddy from the road. She does not seem impressed by the Archive.

"I was paid to carry a packet," she says. "No seal and no name. Only a drop point." She looks at you. "If you want a neutral story, don\'t hire couriers. Hire liars."',
    choices: [
      {
        id: 'ch3-courier-open',
        text: 'Ask what the packet smelled like and what it weighed.',
        effects: [],
        nextNodeId: 'ch3-courier-detail',
      },
      {
        id: 'ch3-courier-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-courier-detail': {
    id: 'ch3-courier-detail',
    speaker: 'Courier Sera',
    text: '"Paper and ash wax," she says. "The kind of seal that breaks if you breathe on it. Whoever paid me wanted the look of authority. They didn\'t want responsibility."',
    choices: [
      {
        id: 'ch3-courier-note',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-replies': {
    id: 'ch3-replies',
    speaker: 'Narrator',
    text: 'Two notes arrived after Ash Road. One bears an Iron seal pressed too hard. The other carries Ember wax, thin and careful.

Neither solves the Archive for you. Both are reminders that your decisions travel.',
    choices: [
      {
        id: 'ch3-replies-aldric',
        text: 'Open the Iron note.',
        effects: [],
        nextNodeId: 'ch3-replies-aldric-select',
      },
      {
        id: 'ch3-replies-renzo',
        text: 'Open the Ember note.',
        effects: [],
        nextNodeId: 'ch3-replies-renzo-select',
      },
      {
        id: 'ch3-replies-back',
        text: 'Return to the entrance.',
        effects: [],
        nextNodeId: 'chapter-3-hub',
      },
    ],
  },

  'ch3-replies-aldric-select': {
    id: 'ch3-replies-aldric-select',
    speaker: 'Narrator',
    text: 'Aldric\'s hand is spare and direct. You scan for what he is asking you to make easier for him, and what he is warning you not to make normal.',
    choices: [
      {
        id: 'ch3-aldric-stopgap',
        text: 'Read Aldric\'s note on the stopgap.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:stopgap'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-stopgap',
      },
      {
        id: 'ch3-aldric-iron',
        text: 'Read Aldric\'s note on enforcement.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-iron',
      },
      {
        id: 'ch3-aldric-verdant',
        text: 'Read Aldric\'s note on the reroute.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-verdant',
      },
      {
        id: 'ch3-aldric-ember',
        text: 'Read Aldric\'s note on escrow administration.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-ember',
      },
      {
        id: 'ch3-aldric-expose',
        text: 'Read Aldric\'s note on the exposure.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-expose',
      },
      {
        id: 'ch3-aldric-committee',
        text: 'Read Aldric\'s note on naming the docket.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:committee'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-aldric-committee',
      },
      {
        id: 'ch3-aldric-back',
        text: 'Set the letter aside.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-stopgap': {
    id: 'ch3-letter-aldric-stopgap',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nStopgaps keep people alive. Write the limits down before they become a habit."',
    choices: [
      {
        id: 'ch3-letter-aldric-stopgap-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-iron': {
    id: 'ch3-letter-aldric-iron',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nYou chose enforcement. Publish the seizures in full and keep the escort disciplined."',
    choices: [
      {
        id: 'ch3-letter-aldric-iron-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-verdant': {
    id: 'ch3-letter-aldric-verdant',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nYou moved the pressure off the barrier. Watch the detours; that is where resentment turns into raids."',
    choices: [
      {
        id: 'ch3-letter-aldric-verdant-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-ember': {
    id: 'ch3-letter-aldric-ember',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nEscrow will move goods. Keep an exit clause in the record."',
    choices: [
      {
        id: 'ch3-letter-aldric-ember-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-expose': {
    id: 'ch3-letter-aldric-expose',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nYou put the papers on the table. Guard the originals and the witnesses."',
    choices: [
      {
        id: 'ch3-letter-aldric-expose-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-aldric-committee': {
    id: 'ch3-letter-aldric-committee',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: '"Envoy.\n\nYou named the docket. Demand signatures for any order it issues."',
    choices: [
      {
        id: 'ch3-letter-aldric-committee-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-replies-renzo-select': {
    id: 'ch3-replies-renzo-select',
    speaker: 'Narrator',
    text: 'Renzo\'s note is folded too neatly. Even his compliments feel like they were weighed for shipping.',
    choices: [
      {
        id: 'ch3-renzo-stopgap',
        text: 'Read Renzo\'s note on the stopgap.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:stopgap'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-stopgap',
      },
      {
        id: 'ch3-renzo-iron',
        text: 'Read Renzo\'s note on enforcement.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:iron'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-iron',
      },
      {
        id: 'ch3-renzo-verdant',
        text: 'Read Renzo\'s note on the reroute.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:verdant'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-verdant',
      },
      {
        id: 'ch3-renzo-ember',
        text: 'Read Renzo\'s note on escrow administration.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:ember'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-ember',
      },
      {
        id: 'ch3-renzo-expose',
        text: 'Read Renzo\'s note on the exposure.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:expose'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-expose',
      },
      {
        id: 'ch3-renzo-committee',
        text: 'Read Renzo\'s note on naming the docket.',
        effects: [],
        requiresAllTokens: ['tok:ch02:outcome:committee'],
        hideWhenLockedBySecrets: true,
        nextNodeId: 'ch3-letter-renzo-committee',
      },
      {
        id: 'ch3-renzo-back',
        text: 'Set the letter aside.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-stopgap': {
    id: 'ch3-letter-renzo-stopgap',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nStopgaps are expensive. Someone will try to invoice you in favors."',
    choices: [
      {
        id: 'ch3-letter-renzo-stopgap-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-iron': {
    id: 'ch3-letter-renzo-iron',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nEnforcement is predictable. Predictable systems invite pricing."',
    choices: [
      {
        id: 'ch3-letter-renzo-iron-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-verdant': {
    id: 'ch3-letter-renzo-verdant',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nNew detours create new owners. Expect a friendly offer with sharp terms."',
    choices: [
      {
        id: 'ch3-letter-renzo-verdant-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-ember': {
    id: 'ch3-letter-renzo-ember',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nEscrow is a clean story. Fees are where the leverage lives."',
    choices: [
      {
        id: 'ch3-letter-renzo-ember-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-expose': {
    id: 'ch3-letter-renzo-expose',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nPublic proof changes bargaining. Keep the originals and do not let copies wander."',
    choices: [
      {
        id: 'ch3-letter-renzo-expose-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },

  'ch3-letter-renzo-committee': {
    id: 'ch3-letter-renzo-committee',
    speaker: 'Renzo Calder',
    speakerFaction: 'ember-throne',
    text: '"Envoy.\n\nOnce you name it, it becomes a counterparty. Useful, if you can make it liable."',
    choices: [
      {
        id: 'ch3-letter-renzo-committee-back',
        text: 'Fold the note and return.',
        effects: [],
        nextNodeId: 'ch3-replies',
      },
    ],
  },
});
