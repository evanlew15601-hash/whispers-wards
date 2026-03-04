import { describe, expect, it } from 'vitest';

import { dialogueTree } from './data';

// Guard against a specific narrative gap class:
// choices that *set up a conditional bargain* ("If I bring you proof...") but then
// immediately return to the hub without recording any state or providing a follow-up node.
//
// This is intentionally heuristic and narrowly scoped to avoid over-constraining story writing.
const BARGAIN_CHOICE_RE = /\bif\s+(i|you)\s+bring\b/i;

describe('bargain followups integrity', () => {
  it('does not drop conditional bargain choices back to the hub without a follow-up', () => {
    const offenders: { nodeId: string; choiceId: string; text: string }[] = [];

    for (const node of Object.values(dialogueTree)) {
      for (const choice of node.choices) {
        if (!BARGAIN_CHOICE_RE.test(choice.text)) continue;

        // Either go to a follow-up node (preferred), or at least record progress.
        if (choice.nextNodeId === 'concord-hub' && !choice.revealsInfo) {
          offenders.push({ nodeId: node.id, choiceId: choice.id, text: choice.text });
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
