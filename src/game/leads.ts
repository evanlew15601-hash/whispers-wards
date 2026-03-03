import type { DialogueNode } from './types';

import { isChoiceLockedBySecrets, isChoiceLockedByTokens } from './choiceLocks';

const proofLeadHintsBySecret: Record<string, string[]> = {
  'The Ember Throne forged maps to manipulate the border dispute.': [
    'Compare border maps against older surveys; look for recent revisions and mismatched seals.',
    'Cross-check patrol orders and witness accounts against what the maps claim.',
  ],
  'Renzo\'s ledger pages show coded payments tied to the border killings.': [
    'Obtain financial records from the Ember delegation—ledgers, receipts, or copied pages.',
  ],
  'Renzo sold you a curated ledger copy; it still suggests payments aligned with the killings.': [
    'Obtain financial records from the Ember delegation—ledgers, receipts, or copied pages.',
  ],
  'Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.': [
    'Cross-reference shipping manifests with Concord docket filings in the archives.',
  ],
  'Verdant hinge-sigils mark a hidden passage door in Concord\'s east wing.': [
    'Search the east wing for seams behind tapestries or alcoves; look for faint hinge carvings in Verdant style.',
  ],

  // Chapter II — Ash Road
  'tok:ch02:seal:ashwax': [
    'Inspect the seals used on seized cargo; keep a flake as proof before it is replaced.',
  ],
  'tok:ch02:witness:waystation': [
    'Get a signed statement from a merchant at the waystation. Names and dates matter.',
  ],
  'tok:ch02:docket:trail': [
    'Obtain the docket ledger at the customs post and follow the reissue numbers.',
  ],
  'tok:ch02:iron:toll-order': [
    'Demand the original toll order that justifies the barrier, not a summary of it.',
  ],
  'tok:ch02:ledger:irregular': [
    'Request raw ledger entries from the counting-house tied to the reissued names.',
  ],
  'tok:ch02:verdant:reroute-ward': [
    'Speak to the tally-keeper in the grove about a reroute ward and its consequences.',
  ],
  'tok:ch02:ember:escrow-terms': [
    'Ask the Ember factor to state escrow terms without ceremony. Keep the paper.',
  ],
  'tok:ch02:pattern:committee': [
    'Press for the committee docket behind the seizures. Someone is issuing authority without being seen.',
  ],

  // Chapter III — The Root-Archive
  'tok:ch03:door:toolmarks': [
    'Inspect the Root-Archive door and the newest stampwork. Someone has been here with tools recently.',
  ],
  'tok:ch03:courier:ashwax': [
    'Ask the courier what kind of seal was on the packet. If it was ash wax, it ties back to Ash Road.',
  ],
  'tok:ch03:clue:stamps': [
    'Push the curator for stamp lineage and docket formats that exist outside the three delegations.',
  ],

  // Chapter IV — The Counting-House
  'tok:ch04:proof:authority': [
    'Demand the annex authority letter and inspect who signed it. Emergency authority leaves a signature somewhere.',
  ],
  'tok:ch04:proof:missing-lines': [
    'Walk the annex floor and look for what never makes it onto paper. Missing denials are a policy, not a mistake.',
  ],
  'tok:ch04:proof:petitions': [
    'Read the unstamped petitions. If people are appealing to the annex directly, it has become a shadow delegation.',
  ],
  'tok:ch04:proof:cutouts': [
    'Ask to see the annex ledgers and fee schedules. Repeated intermediaries point to coordination.',
  ],

  // Chapter V — Oathline
  'tok:ch05:proof:draft': [
    'Inspect the oath draft for new emergency clauses. If it names a method instead of a person, it is hiding an office.',
  ],
  'tok:ch05:proof:oathkeeper': [
    'Speak to the oathkeeper about where the clause came from and what seal arrived with it.',
  ],
  'tok:ch05:proof:iron-order': [
    'Ask Aldric what enforcement looks like when authority is anonymous. He will tell you what can be made to sign.',
  ],
  'tok:ch05:proof:verdant-seal': [
    'Ask Thessaly about a counterseal ward that makes emergency authority leave visible marks.',
  ],
  'tok:ch05:proof:ember-price': [
    'Ask Renzo how to fund restraint: bonds, escrow, and compensation for legal harms.',
  ],

  // Chapter VI — The Quiet Office
  'tok:ch06:proof:visitor-log': [
    'Check the visitor list in the quiet office. Initials and docket numbers can still point to a pattern.',
  ],
  'tok:ch06:proof:ledger': [
    'Search the desk for the reroute schedule the office uses to steer trade without debate.',
  ],
  'tok:ch06:proof:seal': [
    'Compare seal impressions to the annex authority mark. A signature disguised as routine is still a signature.',
  ],
  'tok:ch06:proof:ward-scratch': [
    'Inspect the latch and hinge line for ward-scratches. Quiet magic is still policy.',
  ],
  'tok:ch06:proof:confession': [
    'Press the registrar to admit what continuity means: authority that does not ask.',
  ],

  // Chapter VII — The River Gate
  'tok:ch07:proof:gate-order': [
    'Demand the seizure order at the River Gate. If it names a method instead of a signer, it is the office at work again.',
  ],
  'tok:ch07:proof:manifest': [
    'Inspect the manifests for reissued names and repeated weights. Paper reroutes leave patterns.',
  ],
  'tok:ch07:proof:witness': [
    'Find a bargemaster willing to speak. A witness makes paperwork feel less clean.',
  ],
  'tok:ch07:proof:fees': [
    'Ask the Ember factor for the fee sheet. Emergency authority loves to hide behind "costs."',
  ],
  'tok:ch07:proof:ward': [
    'Ask the Verdant warder what marks emergency authority leaves on lock-gates and stampwork.',
  ],

  // Chapter VIII — The Quay Ledger
  'tok:ch08:proof:ledger': [
    'Locate the quay ledger and look for tallies that track compliance rather than coin.',
  ],
  'tok:ch08:proof:signature': [
    'Inspect the reroute slips and stamp formats. The paper may never name authority, but it can still show it.',
  ],
  'tok:ch08:proof:cutouts': [
    'Search discarded manifests for cut names and overwritten numbers. Corrections are camouflage.',
  ],
  'tok:ch08:proof:bond': [
    'Ask who is collecting emergency fees and where the coin is routed. Bonds leave trails.',
  ],

  // Chapter IX — The Docket Stair
  'tok:ch09:proof:stairlog': [
    'Check the docket-stair logbook for initials and ranges that repeat whenever reroutes surge.',
  ],
  'tok:ch09:proof:registry': [
    'Find the archive index that maps docket ranges to templates. The corridor has a catalog.',
  ],
  'tok:ch09:proof:ward': [
    'Inspect the banister and landings for ward-scratches and wiped counterseals. The stair is where marks get sanded down.',
  ],
  'tok:ch09:proof:seal': [
    'Compare seal impressions tied to registry entries. A bribe is still a clue if it names a hand.',
  ],

  // Chapter X — The Corridor King
  'tok:ch10:proof:charter': [
    'Read the envoy charter copy near the top landing. Old clauses sometimes become new weapons.',
  ],
  'tok:ch10:proof:signet': [
    'Inspect the signet book for new emergency impressions used too often to still be “rare.”',
  ],
  'tok:ch10:proof:templates': [
    'Study the continuity templates. The corridor teaches clerks what to obey without naming authority.',
  ],
  'tok:ch10:proof:memoirs': [
    'Find the memoir of an earlier envoy. The failures they wrote down are still maps.',
  ],
  'tok:ch10:proof:bundle': [
    'Use public attention to demand a sealed docket bundle. Docket ranges can reveal a Concord hand behind reroutes.',
  ],
  'tok:ch10:proof:seal-match': [
    'Compare seized stampwork to the stair signets. If the impressions match, the corridor has a recognized toolset.',
  ],

  // Chapter XI — Drafting Table
  'tok:ch11:proof:oathlog': [
    'Read the Iron oath-log and what it expects from signatures, rank, and consequence.',
  ],
  'tok:ch11:proof:wardfolio': [
    'Study Verdant ward craft with an eye for what it treats as permanent harm and what it makes expensive.',
  ],
  'tok:ch11:proof:charter': [
    'Review the Ember charter annex and the enforcement assumptions baked into its permissions.',
  ],
  'tok:ch11:proof:precedent': [
    'Consult Concord precedent notes: legitimacy is witnessed and repeated, not declared once.',
  ],
  'tok:ch11:proof:margin': [
    'Track the red-ink margin edits across drafts. An unsigned edit is still a decision.',
  ],

  // Chapter XII — The Red Margin
  'tok:ch12:proof:copyroom': [
    'Visit the copy room. The people who move drafts know where red ink enters the process.',
  ],
  'tok:ch12:proof:ink': [
    'Track the red ink requisitions. Scarce supplies create a paper trail even when names are hidden.',
  ],
  'tok:ch12:proof:witness': [
    'Check the witness desk for which edits were made in the open and which were treated as routine.',
  ],
  'tok:ch12:proof:wardmarks': [
    'Inspect the filing corridor for subtle ward marks that delay scrutiny without looking like a barrier.',
  ],
  'tok:ch12:proof:counter': [
    'Compare your protocol to the red ink edits. A counter-protocol in the margins reveals what the corridor fears.',
  ],

  // Chapter XIII — The First Recipient
  'tok:ch13:proof:bundlelog': [
    'Check the delivery log for corrected bundles. The corridor’s first address is often a desk, not a title.',
  ],
  'tok:ch13:proof:runner': [
    'Speak to a stair runner. Runners know who is allowed to be surprised last.',
  ],
  'tok:ch13:proof:seals': [
    'Inspect bundle seals and compare them to the signet book. Routine use of emergency marks is a tell.',
  ],
  'tok:ch13:proof:desk': [
    'Search the first recipient desk and note what tools it keeps close.',
  ],
  'tok:ch13:proof:route': [
    'Follow the ink requisition range. If the trail points to a desk, someone designed anonymity.',
  ],
  'tok:ch13:proof:unwitnessed': [
    'Identify which corrections are never witnessed. Unwitnessed edits cluster where ownership would otherwise be forced.',
  ],

  // Chapter XIV — Second Address
  'tok:ch14:proof:timing': [
    'Watch the mezzanine routes and note who takes corrected bundles between correction and filing.',
  ],
  'tok:ch14:proof:oathtrail': [
    'Track where rank-language appears in margin corrections. Iron handwriting is never neutral.',
  ],
  'tok:ch14:proof:wardtrail': [
    'Track ward residue in margins. Verdant traces are designed to survive filing.',
  ],
  'tok:ch14:proof:receipts': [
    'Track obligation language and fee annexes. Ember turns uncertainty into leverage by pricing it.',
  ],
  'tok:ch14:proof:second': [
    'Follow the next corrected bundle to its second address. Corridors survive by choosing their audience.',
  ],

  // Chapter XV — Third Address
  'tok:ch15:proof:pattern': [
    'Start from your last intervention and follow where the corridor had to adapt. Adaptation reveals intent.',
  ],
  'tok:ch15:proof:templates': [
    'Enter the form library. If the corridor survives, it survives by standardizing.',
  ],
  'tok:ch15:proof:minutes': [
    'Find the coordination minutes. Outcomes written like weather hide who chose them.',
  ],
  'tok:ch15:proof:signatories': [
    'Check the signing registry for repeating initials and “temporary” titles used like functions.',
  ],
  'tok:ch15:proof:cabinet': [
    'Inspect the template cabinet. Repeating clause clusters are how ownership gets erased.',
  ],

  // Chapter XVI — The Approval Loop
  'tok:ch16:proof:pressure': [
    'Follow how the corridor adjusted after your template decision. Adaptation reveals where approval really happens.',
  ],
  'tok:ch16:proof:approvers': [
    'Find the coordination room. Listen to how approval is spoken as continuity until it sounds inevitable.',
  ],
  'tok:ch16:proof:stamp': [
    'Inspect the approval seal. Routine emergency marks are how permanent systems are built.',
  ],
  'tok:ch16:proof:witness': [
    'Ask the witness desk how decisions are moved across the line into “routine.”',
  ],
  'tok:ch16:proof:routes': [
    'Track which hands touch forms before they are allowed to be called ordinary.',
  ],
};

function collectMissingProofKeys(node: DialogueNode, knownSecrets: string[], knownTokens: string[]): Set<string> {
  const missing = new Set<string>();
  const shouldHintToken = (token: string) => !token.includes(':outcome:');

  for (const choice of node.choices) {
    const lockedBySecrets = isChoiceLockedBySecrets(choice, knownSecrets);
    const lockedByTokens = isChoiceLockedByTokens(choice, knownTokens);
    if (!lockedBySecrets && !lockedByTokens) continue;

    const needsAllSecrets = choice.requiresAllSecrets ?? null;
    if (needsAllSecrets?.length) {
      for (const s of needsAllSecrets) {
        if (!knownSecrets.includes(s)) missing.add(s);
      }
    }

    const needsAnySecrets = choice.requiresAnySecrets ?? null;
    if (needsAnySecrets?.length) {
      const hasAny = needsAnySecrets.some(s => knownSecrets.includes(s));
      if (!hasAny) {
        for (const s of needsAnySecrets) missing.add(s);
      }
    }

    const needsAllTokens = choice.requiresAllTokens ?? null;
    if (needsAllTokens?.length) {
      for (const t of needsAllTokens) {
        if (!shouldHintToken(t)) continue;
        if (!knownTokens.includes(t)) missing.add(t);
      }
    }

    const needsAnyTokens = choice.requiresAnyTokens ?? null;
    if (needsAnyTokens?.length) {
      const hasAny = needsAnyTokens.some(t => knownTokens.includes(t));
      if (!hasAny) {
        for (const t of needsAnyTokens) {
          if (!shouldHintToken(t)) continue;
          missing.add(t);
        }
      }
    }
  }

  return missing;
}

export function getLeadHintsForCurrentDialogue(
  currentDialogue: DialogueNode | null,
  knownSecrets: string[],
  knownTokens: string[] = [],
): string[] {
  if (!currentDialogue) return [];
  if (knownSecrets.includes('override')) return [];

  const missing = collectMissingProofKeys(currentDialogue, knownSecrets, knownTokens);
  if (!missing.size) return [];

  const hints: string[] = [];
  const seen = new Set<string>();

  for (const key of missing) {
    const mapped = proofLeadHintsBySecret[key] ?? null;
    if (!mapped?.length) continue;

    for (const hint of mapped) {
      if (seen.has(hint)) continue;
      seen.add(hint);
      hints.push(hint);
    }
  }

  if (!hints.length) {
    hints.push('Seek credible documentation or witnesses before pressing claims that would escalate the summit.');
  }

  return hints.slice(0, 4);
}
