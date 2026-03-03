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
