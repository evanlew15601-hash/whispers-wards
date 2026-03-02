import type { DialogueChoice, DialogueNode } from '../types';

export function defineChoice<const T extends DialogueChoice>(choice: T): T {
  return choice;
}

export function defineNode<const T extends DialogueNode>(node: T): T {
  return node;
}

export function defineDialogueTree<const T extends Record<string, DialogueNode>>(
  tree: { [K in keyof T]: T[K] & { id: K } },
): T {
  return tree as T;
}
