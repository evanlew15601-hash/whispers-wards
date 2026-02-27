export type CodexCategory =
  | 'Realm'
  | 'Law & Custom'
  | 'Factions'
  | 'Places'
  | 'Roles'
  | 'Magic';

export type CodexEntry = {
  id: string;
  title: string;
  category: CodexCategory;
  summary: string;
  paragraphs: string[];
};

export const codexCategories: CodexCategory[] = [
  'Realm',
  'Law & Custom',
  'Factions',
  'Places',
  'Roles',
  'Magic',
];

export const codexEntries: CodexEntry[] = [
  {
    id: 'concord',
    title: 'The Concord',
    category: 'Realm',
    summary: 'A legitimacy system built from witnessed oaths, precedent, and public memory.',
    paragraphs: [
      'The Concord is not a crown and not a scripture. It is a practiced agreement: what titles mean, what promises bind, and what acts forfeit trust.',
      'In most realms, power comes from bloodlines. Here, power comes from recognition. If enough important people stop treating a title as real, it becomes a costume.',
      'Because of that, courts do not only fight over land—they fight over the right to define what “counts.”',
    ],
  },
  {
    id: 'concord-hall',
    title: 'Concord Hall',
    category: 'Places',
    summary: 'A neutral seat for negotiation where etiquette is a weapon and silence is policy.',
    paragraphs: [
      'Concord Hall was built to make conflict formal: meetings in daylight, arguments on record, and tempers kept behind velvet and stone.',
      'Delegations gather here not because they trust one another, but because the alternative is bargaining on a battlefield.',
      'Old treaties, sealed letters, and oath-logs are kept close—because in this realm, paperwork can end a war.',
    ],
  },
  {
    id: 'envoy',
    title: 'Envoy of Concord',
    category: 'Roles',
    summary: 'A negotiator empowered to bind factions—while remaining personally expendable.',
    paragraphs: [
      'An envoy carries authority by mandate, not by force. Your protection is the Concord itself: harming you is an insult to the process that keeps the realm governable.',
      'Your craft is consequence: arranging outcomes that powerful people can accept without losing face.',
      'In practice, you spend as much effort managing pride as you do managing truth.',
    ],
  },
  {
    id: 'iron-pact',
    title: 'The Iron Pact',
    category: 'Factions',
    summary: 'Fortress cities united by discipline, supply lines, and oaths that outlive their signers.',
    paragraphs: [
      'The Iron Pact fears chaos more than defeat. When roads fail, granaries empty. When granaries empty, the realm burns.',
      'They value procedures that prevent hesitation: clear ranks, clear orders, clear consequences.',
      'Their compliment sounds like a warning. Their mercy looks like a timetable.',
    ],
  },
  {
    id: 'verdant-court',
    title: 'The Verdant Court',
    category: 'Factions',
    summary: 'Forest-governors of ward and root, patient enough to treat politics as weather.',
    paragraphs: [
      'The Verdant Court speaks softly because it expects time to do the shouting. They measure victory in seasons, not speeches.',
      'They keep lore and leverage close. Not every secret is a weapon—but every secret can become one.',
      'Their magic is practical and intimate: wards, growth, memory carried through living things.',
    ],
  },
  {
    id: 'ember-throne',
    title: 'The Ember Throne',
    category: 'Factions',
    summary: 'A merchant empire that treats conflict like a market and etiquette like a contract.',
    paragraphs: [
      'The Ember Throne built power on trade routes and the ability to price risk. They rarely threaten; they offer terms.',
      'Their diplomats arrive smiling, with ledgers already open. Every favor becomes a debt, and every debt becomes a lever.',
      'They believe stability should be profitable—and if it is not, they know how to change the incentives.',
    ],
  },
  {
    id: 'greenmarch-pass',
    title: 'Greenmarch Pass',
    category: 'Places',
    summary: 'A strategic corridor and a political fault line between iron roads and verdant wards.',
    paragraphs: [
      'Greenmarch is narrow enough that a few watchtowers can control trade, troop movement, and winter survival.',
      'It is argued over like property, but it behaves like a hinge: when it moves, everything attached to it moves too.',
      'When tempers rise, Greenmarch becomes more than geography—it becomes proof of who gets to decide the realm’s future.',
    ],
  },
  {
    id: 'root-oath',
    title: 'The Root-Oath',
    category: 'Law & Custom',
    summary: 'A Verdant pledge witnessed in blood and bound to stewardship rather than conquest.',
    paragraphs: [
      'Verdant oaths are designed to last. Words can be reinterpreted; a ritual can be remembered.',
      'Taking a Root-Oath does not make you “good.” It makes you accountable to a standard that does not care about court fashion.',
      'To Verdant eyes, refusing an oath can be wisdom—or a confession that you plan to keep your options sharp.',
    ],
  },
  {
    id: 'ledgers',
    title: 'Ledgers and Charters',
    category: 'Law & Custom',
    summary: 'Ember paperwork that turns trade into influence and influence into obligation.',
    paragraphs: [
      'In Ember practice, the cleanest blade is a contract. Not because contracts are sacred, but because they can be enforced without raising your voice.',
      'A charter is never only a document. It is a promise of protection, a permission to travel, and a claim about what the realm will tolerate.',
      'A wise envoy reads the margins as carefully as the terms.',
    ],
  },
  {
    id: 'wards',
    title: 'Wards',
    category: 'Magic',
    summary: 'Defensive magic that redirects, delays, and misleads rather than simply destroying.',
    paragraphs: [
      'Wards are the realm’s most common magic: stones that remember, corridors that miscount steps, thresholds that refuse certain kinds of intent.',
      'Most wards do not punish. They inconvenience. That is why they are used: they change behavior without starting a war.',
      'Because wards work best when understood by their makers, knowledge is power—sometimes literally.',
    ],
  },
  {
    id: 'fire-taboo',
    title: 'The Fire Taboo',
    category: 'Magic',
    summary: 'A Verdant restraint: not an inability, but a refusal born of hard lessons.',
    paragraphs: [
      'Verdant doctrine treats fire as a tool that escapes its owner. It can solve a problem quickly, but it leaves a hunger behind.',
      'To Verdant speakers, “you smell of fire” is not poetry. It is suspicion.',
      'In diplomacy, taboos matter because they let others predict what you will not do—until someone fakes your signature.',
    ],
  },
];
