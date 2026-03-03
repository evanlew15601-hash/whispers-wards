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
  'tok:ch02:archives-seal': [
    'Earn Archivist Mera\'s seal in the Hall Archives to access restricted ledgers.',
  ],
};

function collectMissingProofKeys(node: DialogueNode, knownSecrets: string[], knownTokens: string[]): Set<string> {
  const missing = new Set<string>();

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
        if (!knownTokens.includes(t)) missing.add(t);
      }
    }

    const needsAnyTokens = choice.requiresAnyTokens ?? null;
    if (needsAnyTokens?.length) {
      const hasAny = needsAnyTokens.some(t => knownTokens.includes(t));
      if (!hasAny) {
        for (const t of needsAnyTokens) missing.add(t);
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
