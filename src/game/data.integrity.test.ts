import { describe, expect, it } from 'vitest';

import { dialogueTree, initialFactions } from './data';
import { choiceUsedSecret } from './engine/dialogueChoiceLocks';

describe('dialogueTree integrity', () => {
  it('has valid edges and consistent ids', () => {
    const factionIds = new Set(initialFactions.map(f => f.id));

    for (const [key, node] of Object.entries(dialogueTree)) {
      expect(node.id).toBe(key);

      if (node.speakerFaction) {
        expect(factionIds.has(node.speakerFaction)).toBe(true);
      }

      const choiceIds = new Set<string>();

      for (const choice of node.choices) {
        expect(choiceIds.has(choice.id)).toBe(false);
        choiceIds.add(choice.id);

        if (choice.nextNodeId !== null) {
          expect(dialogueTree[choice.nextNodeId]).toBeTruthy();
        }

        if (choice.requiredReputation) {
          expect(factionIds.has(choice.requiredReputation.factionId)).toBe(true);
          expect(typeof choice.requiredReputation.min).toBe('number');
        }

        for (const eff of choice.effects) {
          expect(factionIds.has(eff.factionId)).toBe(true);
          expect(typeof eff.reputationChange).toBe('number');
        }
      }
    }
  });

  it('stays within alpha limits for UQM-style response pool + secret gating', () => {
    // The WASM conversation core uses a 32-bit secrets mask. To keep TS/WASM parity
    // stable for alpha, ensure that lock-relevant secrets stay within this limit.
    const lockRelevantSecrets = new Set<string>();

    for (const node of Object.values(dialogueTree)) {
      // Response pool semantics cap visible choices at 8.
      expect(node.choices.length).toBeLessThanOrEqual(8);

      for (const choice of node.choices) {
        if (choice.requiresInfo) lockRelevantSecrets.add(choice.requiresInfo);
        if (choice.forbidsInfo) lockRelevantSecrets.add(choice.forbidsInfo);
        if (choice.once) lockRelevantSecrets.add(choiceUsedSecret(choice.id));
      }
    }

    expect(lockRelevantSecrets.size).toBeLessThanOrEqual(32);
  });
});
