import type { DialogueChoice, Faction } from './types';
import { getAllDialogueNodes } from './data';

type LockableChoice = Pick<
  DialogueChoice,
  'id' |
    'text' |
    'effects' |
    'gameEffects' |
    'revealsInfo' |
    'exclusiveGroup' |
    'requiredReputation' |
    'requiredReputationMax' |
    'requiresAllSecrets' |
    'requiresAnySecrets' |
    'requiresAllTokens' |
    'requiresAnyTokens'
>;

type SecretLockableChoice = Pick<DialogueChoice, 'requiresAllSecrets' | 'requiresAnySecrets'>;

type TokenLockableChoice = Pick<DialogueChoice, 'requiresAllTokens' | 'requiresAnyTokens'>;

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

export function isChoiceLockedByTokens(choice: TokenLockableChoice, knownTokens: string[]): boolean {
  const needsAll = choice.requiresAllTokens ?? null;
  if (needsAll?.length) {
    const ok = needsAll.every(t => knownTokens.includes(t));
    if (!ok) return true;
  }

  const needsAny = choice.requiresAnyTokens ?? null;
  if (needsAny?.length) {
    const ok = needsAny.some(t => knownTokens.includes(t));
    if (!ok) return true;
  }

  return false;
}

const hasNonZeroReputationEffect = (choice: Pick<DialogueChoice, 'effects'>) => {
  return choice.effects.some(e => e.reputationChange !== 0);
};

const hasAnyGameEffects = (choice: Pick<DialogueChoice, 'gameEffects'>) => {
  return Boolean(choice.gameEffects?.length);
};

const uniqueRepChoiceIdByRevealsInfo = (() => {
  const seen = new Map<string, string | null>();

  for (const node of getAllDialogueNodes()) {
    for (const c of node.choices) {
      if (!c.revealsInfo) continue;
      if (!hasNonZeroReputationEffect(c)) continue;

      const existing = seen.get(c.revealsInfo);
      if (existing === undefined) seen.set(c.revealsInfo, c.id);
      else if (existing !== c.id) seen.set(c.revealsInfo, null);
    }
  }

  const out = new Map<string, string>();
  for (const [secret, id] of seen.entries()) {
    if (id) out.set(secret, id);
  }

  return out;
})();

const uniqueRepChoiceIdByText = (() => {
  const seen = new Map<string, string | null>();

  for (const node of getAllDialogueNodes()) {
    for (const c of node.choices) {
      if (!hasNonZeroReputationEffect(c)) continue;

      const existing = seen.get(c.text);
      if (existing === undefined) seen.set(c.text, c.id);
      else if (existing !== c.id) seen.set(c.text, null);
    }
  }

  const out = new Map<string, string>();
  for (const [text, id] of seen.entries()) {
    if (id) out.set(text, id);
  }

  return out;
})();

const choiceIdToExclusiveGroup = (() => {
  const out = new Map<string, string>();

  for (const node of getAllDialogueNodes()) {
    for (const c of node.choices) {
      if (!c.exclusiveGroup) continue;
      out.set(c.id, c.exclusiveGroup);
    }
  }

  return out;
})();

export function isChoiceLockedByExclusiveGroup(
  choice: Pick<DialogueChoice, 'id' | 'exclusiveGroup'>,
  selectedChoiceIds: string[],
): boolean {
  const group = choice.exclusiveGroup ?? null;
  if (!group) return false;

  for (const pickedId of selectedChoiceIds) {
    const pickedGroup = choiceIdToExclusiveGroup.get(pickedId) ?? null;
    if (pickedGroup === group && pickedId !== choice.id) return true;
  }

  return false;
}

export function isChoiceLockedByHistory(
  choice: Pick<DialogueChoice, 'id' | 'text' | 'effects' | 'gameEffects' | 'revealsInfo'>,
  selectedChoiceIds: string[],
  knownSecrets: string[] = [],
  log: string[] = [],
): boolean {
  const hasSuppressibleEffects = hasNonZeroReputationEffect(choice) || hasAnyGameEffects(choice);
  if (!hasSuppressibleEffects) return false;

  // Primary guard: record by id.
  if (selectedChoiceIds.includes(choice.id)) return true;

  // Secondary guard: if a rep-affecting choice represents learning a specific fact,
  // treat that fact as proof the choice has already been taken (helps older saves),
  // but only when the secret is uniquely revealed by this one choice.
  if (hasNonZeroReputationEffect(choice) && choice.revealsInfo && knownSecrets.includes(choice.revealsInfo)) {
    const uniqueId = uniqueRepChoiceIdByRevealsInfo.get(choice.revealsInfo) ?? null;
    if (uniqueId === choice.id) return true;
  }

  // Tertiary guard: legacy saves without selectedChoiceIds can still contain a choice log.
  if (hasNonZeroReputationEffect(choice) && log.length) {
    const uniqueId = uniqueRepChoiceIdByText.get(choice.text) ?? null;
    if (uniqueId === choice.id && log.includes(`> ${choice.text}`)) return true;
  }

  return false;
}

export function isChoiceLocked(
  choice: LockableChoice,
  factions: Faction[],
  knownSecrets: string[],
  selectedChoiceIds: string[] = [],
  knownTokens: string[] = [],
): boolean {
  if (knownSecrets.includes('override')) return false;

  // Persistent branching: if the player has already committed to a different choice in the
  // same exclusivity group, prevent swapping paths on revisit.
  if (isChoiceLockedByExclusiveGroup(choice, selectedChoiceIds)) return true;

  // If the player already took this rep-affecting choice earlier, keep it selectable so
  // revisits can't soft-lock the story (effects are suppressed by the engine).
  if (isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets)) return false;

  if (isChoiceLockedBySecrets(choice, knownSecrets)) return true;
  if (isChoiceLockedByTokens(choice, knownTokens)) return true;

  const repReq = choice.requiredReputation;
  if (repReq) {
    const rep = factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity;
    if (rep < repReq.min) return true;
  }

  const repReqMax = choice.requiredReputationMax;
  if (repReqMax) {
    const rep = factions.find(f => f.id === repReqMax.factionId)?.reputation ?? Infinity;
    if (rep > repReqMax.max) return true;
  }

  return false;
}
