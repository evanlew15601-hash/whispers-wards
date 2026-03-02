import type { DialogueChoice } from './types';

export type ConditionalNextNodeRule = {
  requiresAnySecrets: string[];
  nextNodeId: string | null;
};

export function resolveNextNodeId(
  choice: Pick<DialogueChoice, 'nextNodeId' | 'nextNodeIdBySecrets'>,
  knownSecrets: string[],
): string | null {
  const rules = choice.nextNodeIdBySecrets ?? null;
  if (!rules?.length) return choice.nextNodeId;

  for (const rule of rules) {
    if (rule.requiresAnySecrets.some(s => knownSecrets.includes(s))) return rule.nextNodeId;
  }

  return choice.nextNodeId;
}
