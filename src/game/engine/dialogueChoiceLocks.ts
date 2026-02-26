import type { DialogueChoice, GameState } from '../types';

export const CHOICE_USED_SECRET_PREFIX = 'choice-used:';

export function choiceUsedSecret(choiceId: string): string {
  return `${CHOICE_USED_SECRET_PREFIX}${choiceId}`;
}

export function isChoiceUsedSecret(secret: string): boolean {
  return secret.startsWith(CHOICE_USED_SECRET_PREFIX);
}

export type DialogueChoiceLockReason =
  | 'used'
  | 'requires-info'
  | 'forbids-info'
  | 'requires-reputation'
  | null;

export function getDialogueChoiceLockFromStateParts(args: {
  knownSecrets: string[];
  factions: GameState['factions'];
  choice: DialogueChoice;
}): { locked: boolean; reason: DialogueChoiceLockReason } {
  const { knownSecrets, factions, choice } = args;

  // Escape hatch used by tests/dev tooling.
  if (knownSecrets.includes('override')) {
    return { locked: false, reason: null };
  }

  if (choice.once && knownSecrets.includes(choiceUsedSecret(choice.id))) {
    return { locked: true, reason: 'used' };
  }

  if (choice.requiresInfo && !knownSecrets.includes(choice.requiresInfo)) {
    return { locked: true, reason: 'requires-info' };
  }

  if (choice.forbidsInfo && knownSecrets.includes(choice.forbidsInfo)) {
    return { locked: true, reason: 'forbids-info' };
  }

  const repReq = choice.requiredReputation;
  if (repReq) {
    const rep = factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity;
    if (rep < repReq.min) {
      return { locked: true, reason: 'requires-reputation' };
    }
  }

  return { locked: false, reason: null };
}

export function getDialogueChoiceLock(
  state: GameState,
  choice: DialogueChoice,
): { locked: boolean; reason: DialogueChoiceLockReason } {
  return getDialogueChoiceLockFromStateParts({
    knownSecrets: state.knownSecrets,
    factions: state.factions,
    choice,
  });
}

export function getDialogueChoiceSecretsToAdd(choice: DialogueChoice): string[] {
  const out: string[] = [];
  if (choice.revealsInfo) out.push(choice.revealsInfo);
  if (choice.once) out.push(choiceUsedSecret(choice.id));
  return out;
}
