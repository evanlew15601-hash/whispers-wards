import type { DialogueChoice, Faction } from './types';
import { dialogueTree } from './data';

export type ChoiceLockReason =
  | { kind: 'exclusiveGroup'; group: string }
  | { kind: 'reputation'; factionId: string; min: number }
  | { kind: 'secretsAll'; missing: string[] }
  | { kind: 'secretsAny'; required: string[] }
  | { kind: 'resource'; resourceId: 'coin' | 'influence' | 'supplies' | 'intel'; min: number; current: number };

type LockableChoice = Pick<
  DialogueChoice,
  'id' |
    'text' |
    'effects' |
    'gameEffects' |
    'revealsInfo' |
    'exclusiveGroup' |
    'requiredReputation' |
    'requiresAllSecrets' |
    'requiresAnySecrets'
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

export const isChoiceLockedByResources = (
  choice: Pick<DialogueChoice, 'gameEffects'>,
  resources: Record<'coin' | 'influence' | 'supplies' | 'intel', number>,
  knownSecrets: string[] = [],
): boolean => {
  if (knownSecrets.includes('override')) return false;

  const deltas: Partial<Record<'coin' | 'influence' | 'supplies' | 'intel', number>> = {};

  const effects = choice.gameEffects ?? [];
  for (const eff of effects) {
    if (eff.kind !== 'resource') continue;
    deltas[eff.resourceId] = (deltas[eff.resourceId] ?? 0) + eff.delta;
  }

  for (const [resourceId, delta] of Object.entries(deltas) as Array<[
    'coin' | 'influence' | 'supplies' | 'intel',
    number
  ]>) {
    if (delta >= 0) continue;
    const current = resources[resourceId] ?? 0;
    if (current < -delta) return true;
  }

  return false;
};

const hasNonZeroReputationEffect = (choice: Pick<DialogueChoice, 'effects'>) => {
  return choice.effects.some(e => e.reputationChange !== 0);
};

const uniqueRepChoiceIdByRevealsInfo = (() => {
  const seen = new Map<string, string | null>();

  for (const node of Object.values(dialogueTree)) {
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

  for (const node of Object.values(dialogueTree)) {
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

  for (const node of Object.values(dialogueTree)) {
    for (const c of node.choices) {
      if (!c.exclusiveGroup) continue;
      out.set(c.id, c.exclusiveGroup);
    }
  }

  return out;
})();

export const isChoiceLockedByExclusiveGroup = (
  choice: Pick<DialogueChoice, 'id' | 'exclusiveGroup'>,
  selectedChoiceIds: string[],
): boolean => {
  const group = choice.exclusiveGroup ?? null;
  if (!group) return false;

  for (const pickedId of selectedChoiceIds) {
    const pickedGroup = choiceIdToExclusiveGroup.get(pickedId) ?? null;
    if (pickedGroup === group && pickedId !== choice.id) return true;
  }

  return false;
};

export function isChoiceLockedByHistory(
  choice: Pick<DialogueChoice, 'id' | 'text' | 'effects' | 'revealsInfo'>,
  selectedChoiceIds: string[],
  knownSecrets: string[] = [],
  log: string[] = [],
): boolean {
  if (!hasNonZeroReputationEffect(choice)) return false;

  // Primary guard: record by id.
  if (selectedChoiceIds.includes(choice.id)) return true;

  // Secondary guard: if a rep-affecting choice represents learning a specific fact,
  // treat that fact as proof the choice has already been taken (helps older saves),
  // but only when the secret is uniquely revealed by this one choice.
  if (choice.revealsInfo && knownSecrets.includes(choice.revealsInfo)) {
    const uniqueId = uniqueRepChoiceIdByRevealsInfo.get(choice.revealsInfo) ?? null;
    if (uniqueId === choice.id) return true;
  }

  // Tertiary guard: legacy saves without selectedChoiceIds can still contain a choice log.
  if (log.length) {
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
  resources?: Record<'coin' | 'influence' | 'supplies' | 'intel', number>,
): boolean {
  if (knownSecrets.includes('override')) return false;

  // Persistent branching: if the player has already committed to a different choice in the
  // same exclusivity group, prevent swapping paths on revisit.
  if (isChoiceLockedByExclusiveGroup(choice, selectedChoiceIds)) return true;

  // If the player already took this rep-affecting choice earlier, keep it selectable so
  // revisits can't soft-lock the story (effects are suppressed by the engine).
  if (isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets)) return false;

  if (isChoiceLockedBySecrets(choice, knownSecrets)) return true;

  if (resources && isChoiceLockedByResources(choice, resources, knownSecrets)) return true;

  const repReq = choice.requiredReputation;
  if (!repReq) return false;

  const rep = factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity;
  return rep < repReq.min;
}

export const getChoiceLockReasons = (
  choice: Pick<
    DialogueChoice,
    'id' | 'exclusiveGroup' | 'requiredReputation' | 'requiresAllSecrets' | 'requiresAnySecrets' | 'gameEffects'
  >,
  factions: Faction[],
  knownSecrets: string[],
  selectedChoiceIds: string[] = [],
  resources?: Record<'coin' | 'influence' | 'supplies' | 'intel', number>,
): ChoiceLockReason[] => {
  if (knownSecrets.includes('override')) return [];

  const reasons: ChoiceLockReason[] = [];

  if (isChoiceLockedByExclusiveGroup(choice, selectedChoiceIds)) {
    if (choice.exclusiveGroup) reasons.push({ kind: 'exclusiveGroup', group: choice.exclusiveGroup });
  }

  const needsAll = choice.requiresAllSecrets ?? null;
  if (needsAll?.length) {
    const missing = needsAll.filter(s => !knownSecrets.includes(s));
    if (missing.length) reasons.push({ kind: 'secretsAll', missing });
  }

  const needsAny = choice.requiresAnySecrets ?? null;
  if (needsAny?.length) {
    const ok = needsAny.some(s => knownSecrets.includes(s));
    if (!ok) reasons.push({ kind: 'secretsAny', required: needsAny });
  }

  if (resources && isChoiceLockedByResources(choice, resources, knownSecrets)) {
    const deltas: Partial<Record<'coin' | 'influence' | 'supplies' | 'intel', number>> = {};

    const effects = choice.gameEffects ?? [];
    for (const eff of effects) {
      if (eff.kind !== 'resource') continue;
      deltas[eff.resourceId] = (deltas[eff.resourceId] ?? 0) + eff.delta;
    }

    for (const [resourceId, delta] of Object.entries(deltas) as Array<[
      'coin' | 'influence' | 'supplies' | 'intel',
      number
    ]>) {
      if (delta >= 0) continue;
      const current = resources[resourceId] ?? 0;
      const min = -delta;
      if (current < min) reasons.push({ kind: 'resource', resourceId, min, current });
    }
  }

  const repReq = choice.requiredReputation ?? null;
  if (repReq) {
    const rep = factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity;
    if (rep < repReq.min) reasons.push({ kind: 'reputation', factionId: repReq.factionId, min: repReq.min });
  }

  return reasons;
};
