import type { Faction, GameEvent } from '../../types';

import { defineDialogueTree } from '../builders';
import { initialEvents as chapter1Events, initialFactions as chapter1Factions } from '../chapter-1/nodes';

export const initialFactions: Faction[] = chapter1Factions;

export const initialEvents: GameEvent[] = chapter1Events;

export const dialogueTree = defineDialogueTree({
  'chapter-11-hub': {
    id: 'chapter-11-hub',
    speaker: 'Narrator',
    text: 'A drafting table has no opinions. It simply holds whatever you put on it.

In the Hall, that is dangerous.

Today, the table holds four stacks: an oath-log in a heavy hand, a ward folio with living fibers pressed into the paper, a charter annex copied in neat mercantile script, and a precedent note in plain Concord ink.

You are not here to admire writing.

You are here to decide what kind of writing people will obey.',
    choices: [
      {
        id: 'ch11-hub-iron',
        text: 'Read the Iron oath-log and what it expects from a signature.',
        effects: [],
        grantsTokens: ['tok:ch11:proof:oathlog'],
        nextNodeId: 'ch11-iron-oathlog',
      },
      {
        id: 'ch11-hub-verdant',
        text: 'Read the Verdant ward folio and what it treats as permanent harm.',
        effects: [],
        grantsTokens: ['tok:ch11:proof:wardfolio'],
        nextNodeId: 'ch11-verdant-wardfolio',
      },
      {
        id: 'ch11-hub-ember',
        text: 'Read the Ember charter annex and what it turns into debt.',
        effects: [],
        grantsTokens: ['tok:ch11:proof:charter'],
        nextNodeId: 'ch11-ember-charter',
      },
      {
        id: 'ch11-hub-concord',
        text: 'Read a Concord precedent note on legitimacy and witnessed oaths.',
        effects: [],
        grantsTokens: ['tok:ch11:proof:precedent'],
        nextNodeId: 'ch11-concord-precedent',
      },
      {
        id: 'ch11-hub-payoff-freeze',
        text: 'Use the docket freeze you imposed to request the drafts that were never meant to be seen.',
        effects: [],
        requiresAllTokens: ['tok:ch09:outcome:freeze'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:proof:margin'],
        nextNodeId: 'ch11-payoff-freeze',
      },
      {
        id: 'ch11-hub-payoff-quiet',
        text: 'Follow the corridor quietly and learn what it does when nobody is watching.',
        effects: [],
        requiresAllTokens: ['tok:ch10:outcome:quiet'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:proof:margin'],
        nextNodeId: 'ch11-payoff-quiet',
      },
      {
        id: 'ch11-hub-draft',
        text: 'Draft a protocol the delegations can recognize without calling it surrender.',
        effects: [],
        hideWhenLockedBySecrets: true,
        requiresAnyTokens: [
          'tok:ch11:proof:oathlog',
          'tok:ch11:proof:wardfolio',
          'tok:ch11:proof:charter',
          'tok:ch11:proof:precedent',
          'tok:ch11:proof:margin',
        ],
        nextNodeId: 'ch11-draft',
      },
      {
        id: 'ch11-hub-back',
        text: 'End here for now.',
        effects: [],
        nextNodeId: null,
      },
    ],
  },

  'ch11-iron-oathlog': {
    id: 'ch11-iron-oathlog',
    speaker: 'Commander Aldric Vane',
    speakerFaction: 'iron-pact',
    text: 'Vane brings the oath-log as if it were a tool.

"Iron does not trust feelings," he says. "We trust what outlives the signer."

The log is a list of names and clauses. It is also a list of punishments.

Every breach has a consequence written beside it, not to be cruel, but to prevent bargaining after the fact.

"When you ask Iron to wait," Vane adds, "you are asking us to accept that people can die while paper debates."',
    choices: [
      {
        id: 'ch11-iron-oathlog-note',
        text: 'Note what Iron treats as non-negotiable: time, consequence, and rank.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'Iron oath-logs bind consequences to breaches to prevent bargaining after the fact; delays are treated as casualties, not politeness.',
      },
    ],
  },

  'ch11-verdant-wardfolio': {
    id: 'ch11-verdant-wardfolio',
    speaker: 'Thessaly Wren',
    speakerFaction: 'verdant-court',
    text: 'The ward folio is stiff with pressed fibers.

Thessaly touches the page lightly. "We measure what lasts," she says.

The folio contains ward schematics. Not spells as spectacle. Constraints. Redirects. Delays. The art of making a harm expensive.

A margin note repeats in several hands: “Fire is permanent.”

"To Verdant," Thessaly adds, "a policy that burns the future for a clean week is not efficient. It is contempt."',
    choices: [
      {
        id: 'ch11-verdant-wardfolio-note',
        text: 'Keep the folio’s restraint in mind: prevent permanent harm even if the week goes badly.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'Verdant ward craft focuses on constraints that make harm expensive; fire is treated as permanent damage and a political accusation.',
      },
    ],
  },

  'ch11-ember-charter': {
    id: 'ch11-ember-charter',
    speaker: 'Renzo Lark',
    speakerFaction: 'ember-throne',
    text: 'Renzo reads the annex like a merchant reads weather.

"Charters are not promises," he says. "They are enforcement plans." He taps the line about reporting.

The annex lists permissions and penalties. It assumes someone will break it. It is prepared for that.

"The Ember Throne does not fear instability," Renzo adds. "We fear unpriced instability. If you can price it, you can survive it."',
    choices: [
      {
        id: 'ch11-ember-charter-note',
        text: 'Keep the Ember instinct in mind: if harm can be priced, it can be pressured.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'Ember charters are enforcement plans with reporting and penalties baked in; instability is dangerous when it is unpriced.',
      },
    ],
  },

  'ch11-concord-precedent': {
    id: 'ch11-concord-precedent',
    speaker: 'Archivist Marrow',
    text: 'The precedent note is plain.

It explains legitimacy the way a clerk explains gravity: witnessed oaths, recorded clauses, and other people treating a title as binding.

"Concord is not a crown," Marrow says. "It is a memory system." They tap the line about witnesses.

"Your job is to produce a settlement people can repeat without you. That is why we keep records. A deal without repetition is only a mood."',
    choices: [
      {
        id: 'ch11-concord-precedent-note',
        text: 'Keep Concord’s core in mind: repetition is enforcement.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'Concord legitimacy relies on witnessed oaths and recorded precedent; repetition is what makes a settlement enforceable without the envoy present.',
      },
    ],
  },

  'ch11-payoff-freeze': {
    id: 'ch11-payoff-freeze',
    speaker: 'Narrator',
    text: 'The freeze buys you leverage.

People who would normally bury drafts under new drafts hand you the older versions, still warm with embarrassment.

In the margins, a red ink note repeats: “If challenged, cite continuity.”

The ink is not the same hand as the draft.

That is the point. The corridor edits without signing.',
    choices: [
      {
        id: 'ch11-payoff-freeze-note',
        text: 'Remember the red ink and the habit: edits without signatures.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'A repeated red-ink margin note (“If challenged, cite continuity”) appears across drafts, suggesting corridor edits without signatures.',
      },
    ],
  },

  'ch11-payoff-quiet': {
    id: 'ch11-payoff-quiet',
    speaker: 'Narrator',
    text: 'You do not announce yourself.

You follow the corridor.

A bundle is rerouted three times before it lands on a desk. Each reroute is “routine.” Each reroute changes who can object.

The red ink appears at the end, not the start.

Someone is watching the corridor and correcting it in real time.',
    choices: [
      {
        id: 'ch11-payoff-quiet-note',
        text: 'Keep the pattern in mind: the corridor reacts, it does not only plan.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
        revealsInfo: 'Following the corridor quietly reveals reroutes that change who can object; red-ink corrections appear late, suggesting real-time control.',
      },
    ],
  },

  'ch11-draft': {
    id: 'ch11-draft',
    speaker: 'Narrator',
    text: 'A protocol is a promise that expects to be abused.

To write one, you have to assume your enemies will read it.

You choose what it protects, and what it sacrifices.',
    choices: [
      {
        id: 'ch11-draft-oathchain',
        text: 'Write an oath-chain: continuity actions require a named rank, a written consequence, and a clock that cannot be paused by debate.',
        effects: [{ factionId: 'iron-pact', reputationChange: 2 }, { factionId: 'verdant-court', reputationChange: -1 }],
        exclusiveGroup: 'ch11-protocol',
        requiresAllTokens: ['tok:ch11:proof:oathlog'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:outcome:oathchain'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:oathchain' },
          { kind: 'log', message: '🪖 Drafting: Oath-chain protocol drafted with rank, consequence, and a fixed clock.' },
        ],
        nextNodeId: 'ch11-ending-oathchain',
      },
      {
        id: 'ch11-draft-wards',
        text: 'Write a ward protocol: continuity actions must leave a visible mark that survives filing, and fire-adjacent measures require Verdant assent.',
        effects: [{ factionId: 'verdant-court', reputationChange: 3 }, { factionId: 'iron-pact', reputationChange: -1 }],
        exclusiveGroup: 'ch11-protocol',
        requiresAllTokens: ['tok:ch11:proof:wardfolio'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:outcome:wards'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:wards' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🌿 Drafting: Continuity bound to visible marks; Verdant assent required for permanent-harm measures.' },
        ],
        nextNodeId: 'ch11-ending-wards',
      },
      {
        id: 'ch11-draft-escrow',
        text: 'Write an escrow protocol: continuity fees become bonded debts, traceable to a signer and collectible by charter court.',
        effects: [{ factionId: 'ember-throne', reputationChange: 2 }],
        exclusiveGroup: 'ch11-protocol',
        requiresAllTokens: ['tok:ch11:proof:charter'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:outcome:escrow'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:escrow' },
          { kind: 'resource', resourceId: 'coin', delta: 1 },
          { kind: 'log', message: '🧾 Drafting: Continuity fees bonded and made collectible under charter court.' },
        ],
        nextNodeId: 'ch11-ending-escrow',
      },
      {
        id: 'ch11-draft-precedent',
        text: 'Write a precedent protocol: every continuity action must be witnessed, recorded, and reviewable by the delegations within one turn.',
        effects: [{ factionId: 'verdant-court', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -1 }],
        exclusiveGroup: 'ch11-protocol',
        requiresAllTokens: ['tok:ch11:proof:precedent'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:outcome:precedent'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:precedent' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🗂️ Drafting: Continuity bound to witnessed record and delegation review.' },
        ],
        nextNodeId: 'ch11-ending-precedent',
      },
      {
        id: 'ch11-draft-expose',
        text: 'Write a margin clause: any unsigned corridor edit is treated as a breach, and the red ink becomes admissible evidence.',
        effects: [{ factionId: 'iron-pact', reputationChange: 1 }, { factionId: 'ember-throne', reputationChange: -2 }],
        exclusiveGroup: 'ch11-protocol',
        requiresAllTokens: ['tok:ch11:proof:margin'],
        hideWhenLockedBySecrets: true,
        grantsTokens: ['tok:ch11:outcome:margin'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:margin' },
          { kind: 'resource', resourceId: 'influence', delta: 1 },
          { kind: 'log', message: '🟥 Drafting: Unsigned corridor edits treated as breaches; red ink admitted as evidence.' },
        ],
        nextNodeId: 'ch11-ending-margin',
      },
      {
        id: 'ch11-draft-quiet',
        text: 'Do not finalize the protocol. Keep the drafts and wait for the corridor to reveal its hand.',
        effects: [{ factionId: 'ember-throne', reputationChange: 1 }],
        exclusiveGroup: 'ch11-protocol',
        grantsTokens: ['tok:ch11:outcome:quiet'],
        gameEffects: [
          { kind: 'milestone:add', id: 'chapter-11:resolved' },
          { kind: 'milestone:add', id: 'chapter-11:resolved:quiet' },
          { kind: 'resource', resourceId: 'intel', delta: 1 },
          { kind: 'log', message: '🕯️ Drafting: Protocol delayed while evidence is gathered.' },
        ],
        nextNodeId: 'ch11-ending-quiet',
      },
      {
        id: 'ch11-draft-back',
        text: 'Not yet. Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-oathchain': {
    id: 'ch11-ending-oathchain',
    speaker: 'Narrator',
    text: 'Iron reads the protocol and nods once.

It will make the corridor faster in some ways. It will make it crueler in others.

You have traded discretion for predictability.

The Hall will test the chain the first time it wants to pretend a delay was nobody’s fault.',
    choices: [
      {
        id: 'ch11-ending-oathchain-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-wards': {
    id: 'ch11-ending-wards',
    speaker: 'Narrator',
    text: 'Verdant reads the protocol slowly.

They like that it assumes permanence.

They dislike that it will be treated as obstruction whenever someone wants speed.

If the Hall accepts this, it will be because someone decided that shame is a better brake than force.',
    choices: [
      {
        id: 'ch11-ending-wards-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-escrow': {
    id: 'ch11-ending-escrow',
    speaker: 'Narrator',
    text: 'Ember reads the protocol like an investment.

If the Hall wants to reroute, it will have to pay.

Paying will not make the act moral.

It will make the act traceable, and that is sometimes the only leverage a corridor respects.',
    choices: [
      {
        id: 'ch11-ending-escrow-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-precedent': {
    id: 'ch11-ending-precedent',
    speaker: 'Narrator',
    text: 'Concord clerks read the protocol and start copying it.

That is the real vote.

If it becomes habit, it becomes enforcement.

The corridor will still exist. It will just have to do its work in rooms with witnesses.',
    choices: [
      {
        id: 'ch11-ending-precedent-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-margin': {
    id: 'ch11-ending-margin',
    speaker: 'Narrator',
    text: 'You make the red ink actionable.

Someone in the corridor will stop writing in red.

Someone else will start writing in a color you have not learned to recognize yet.

But you have forced one truth onto the record: edits are decisions, and decisions have owners.',
    choices: [
      {
        id: 'ch11-ending-margin-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },

  'ch11-ending-quiet': {
    id: 'ch11-ending-quiet',
    speaker: 'Narrator',
    text: 'You keep the drafts.

You let the corridor keep moving.

It is not courage. It is patience.

In the Hall, patience is sometimes the only way to find the hand behind the ink.',
    choices: [
      {
        id: 'ch11-ending-quiet-back',
        text: 'Return to the drafting table.',
        effects: [],
        nextNodeId: 'chapter-11-hub',
      },
    ],
  },
});
