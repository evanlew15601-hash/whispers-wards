import type { DialogueChoice, Faction } from './types';

type LockableChoice = Pick<
  DialogueChoice,
  'id' | 'effects' | 'revealsInfo' | 'requiredReputation' | 'requiresAllSecrets' | 'requiresAnySecrets'
>;

type SecretLockableChoice = Pick<DialogueChoice, 'requiresAllSecrets' | 'requiresAnySecrets'>;

export function isChoiceLockedBySecrets(choice: SecretLockableChoice, knownSecrets: string[]): boolean {
  const needsAll = choice.requiresAllSecrets ?? null;
  if (needsAll?.length) {
    const ok = needsAll.every(s => knownSecrets.includes(s));
    if (!ok) return true;
  }

  const needsAny = choice.requiresAnySecrets ?? null;
  if (needsAny?.length) {
    const ok = needsAny.some(s => knownSecrets.includes(s));
    if (!ok) return true;
  }

  return false;
}

const hasNonZeroReputationEffect = (choice: Pick<DialogueChoice, 'effects'>) => {
  return choice.effects.some(e => e.reputationChange !== 0);
};

export function isChoiceLockedByHistory(
  choice: Pick<DialogueChoice, 'id' | 'effects' | 'revealsInfo'>,
  selectedChoiceIds: string[],
  knownSecrets: string[] = [],
): boolean {
  if (!hasNonZeroReputationEffect(choice)) return false;

  // Primary guard: record by id.
  if (selectedChoiceIds.includes(choice.id)) return true;

  // Secondary guard: if a rep-affecting choice represents learning a specific fact,
  // treat that fact as proof the choice has already been taken (helps older saves).
  if (choice.revealsInfo && knownSecrets.includes(choice.revealsInfo)) return true;

  return false;
}

export function isChoiceLocked(
  choice: LockableChoice,
  factions: Faction[],
  knownSecrets: string[],
  selectedChoiceIds: string[] = [],
): boolean {
  if (knownSecrets.includes('override')) return false;

  // Prevent farming reputation by repeating past decisions.
  if (isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets)) return true;

  if (isChoiceLockedBySecrets(choice, knownSecrets)) return true;

  const repReq = choice.requiredReputation;
  if (!repReq) return false;

  const rep = factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity;
  return rep < repReq.min;
}
