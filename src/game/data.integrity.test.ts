import { describe, expect, it } from 'vitest';

import { dialogueTree, initialFactions } from './data';

function collectWasmGraphSecrets(): { allSecretsSorted: string[]; requiredSecretsSorted: string[] } {
  // Must match uqmWasmConversationEngine compileGraph() semantics:
  // - include revealsInfo
  // - include requiresAllSecrets
  // - include requiresAnySecrets
  // - then sort lexicographically and take the first N (N=64) as encodable.
  const all = new Set<string>();
  const required = new Set<string>();

  const nodeIds = Object.keys(dialogueTree).sort();

  for (const nodeId of nodeIds) {
    const node = dialogueTree[nodeId];

    for (const choice of node.choices) {
      if (choice.revealsInfo) all.add(choice.revealsInfo);

      for (const s of choice.requiresAllSecrets ?? []) {
        all.add(s);
        required.add(s);
      }

      for (const s of choice.requiresAnySecrets ?? []) {
        all.add(s);
        required.add(s);
      }
    }
  }

  return {
    allSecretsSorted: [...all].sort(),
    requiredSecretsSorted: [...required].sort(),
  };
}

describe('dialogueTree integrity', () => {
  it('has valid edges and consistent ids', () => {
    const factionIds = new Set(initialFactions.map(f => f.id));

    const globalChoiceIds = new Set<string>();

    for (const [key, node] of Object.entries(dialogueTree)) {
      expect(node.id).toBe(key);

      if (node.speakerFaction) {
        expect(factionIds.has(node.speakerFaction)).toBe(true);
      }

      const choiceIds = new Set<string>();

      for (const choice of node.choices) {
        expect(choiceIds.has(choice.id)).toBe(false);
        choiceIds.add(choice.id);

        // Choice ids are persisted in save data; they must be globally unique.
        expect(globalChoiceIds.has(choice.id)).toBe(false);
        globalChoiceIds.add(choice.id);

        if (choice.nextNodeId !== null) {
          expect(dialogueTree[choice.nextNodeId]).toBeTruthy();
        }

        if (choice.requiredReputation) {
          expect(factionIds.has(choice.requiredReputation.factionId)).toBe(true);
          expect(typeof choice.requiredReputation.min).toBe('number');
        }

        if (choice.requiresAllSecrets) {
          expect(Array.isArray(choice.requiresAllSecrets)).toBe(true);
          expect(choice.requiresAllSecrets.length).toBeGreaterThan(0);
          for (const secret of choice.requiresAllSecrets) {
            expect(typeof secret).toBe('string');
            expect(secret.trim().length).toBeGreaterThan(0);
          }
        }

        if (choice.requiresAnySecrets) {
          expect(Array.isArray(choice.requiresAnySecrets)).toBe(true);
          expect(choice.requiresAnySecrets.length).toBeGreaterThan(0);
          for (const secret of choice.requiresAnySecrets) {
            expect(typeof secret).toBe('string');
            expect(secret.trim().length).toBeGreaterThan(0);
          }
        }

        if (choice.hideWhenHasAnySecrets) {
          expect(Array.isArray(choice.hideWhenHasAnySecrets)).toBe(true);
          expect(choice.hideWhenHasAnySecrets.length).toBeGreaterThan(0);
          for (const secret of choice.hideWhenHasAnySecrets) {
            expect(typeof secret).toBe('string');
            expect(secret.trim().length).toBeGreaterThan(0);
          }
        }

        for (const eff of choice.effects) {
          expect(factionIds.has(eff.factionId)).toBe(true);
          expect(typeof eff.reputationChange).toBe('number');
        }
      }
    }
  });

  it('caps choice count per node at 9 (UQM numeric hotkeys)', () => {
    const maxChoices = 9;

    const offenders: { nodeId: string; count: number }[] = [];

    for (const node of Object.values(dialogueTree)) {
      if (node.choices.length > maxChoices) offenders.push({ nodeId: node.id, count: node.choices.length });
    }

    if (offenders.length) {
      offenders.sort((a, b) => b.count - a.count || a.nodeId.localeCompare(b.nodeId));
      const details = offenders.map(o => `- ${o.nodeId}: ${o.count}`).join('\n');

      throw new Error(
        [
          `Some dialogue nodes exceed the max of ${maxChoices} choices:`,
          details,
          '',
          'Suggested minimal fix:',
          '- Split the node into a short "More…" follow-up node and move the extra investigative choices there,',
          '  keeping <= 9 choices on each screen (add a "Back" choice if needed).',
        ].join('\n'),
      );
    }
  });

  it('ensures all lock-affecting secrets are encodable in the WASM secret mask (64-bit)', () => {
    const secretBitCapacity = 64;

    const { allSecretsSorted, requiredSecretsSorted } = collectWasmGraphSecrets();

    const encodable = new Set(allSecretsSorted.slice(0, secretBitCapacity));

    const nonEncodable = requiredSecretsSorted.filter(s => !encodable.has(s));

    if (nonEncodable.length) {
      const indices = new Map<string, number>();
      for (let i = 0; i < allSecretsSorted.length; i++) indices.set(allSecretsSorted[i], i);

      throw new Error(
        [
          `WASM secret masks can encode only the first ${secretBitCapacity} unique secrets in sorted order.`,
          `Any secret used by requiresAllSecrets/requiresAnySecrets must be within that set.`,
          '',
          'Non-encodable lock-affecting secrets:',
          ...nonEncodable.map(s => `- ${s} (sorted index ${indices.get(s) ?? -1})`),
          '',
          'Suggested minimal fixes:',
          '- Merge/reuse secret strings so lock-affecting secrets fall within the first 64 sorted secrets, OR',
          '- Convert some locks to reputation gating (TS-only) to reduce lock-secret count/pressure.',
        ].join('\n'),
      );
    }
  });

  it('only requires secrets that can actually be learned in the dialogue graph', () => {
    const learnableSecrets = new Set<string>();

    for (const node of Object.values(dialogueTree)) {
      for (const choice of node.choices) {
        if (choice.revealsInfo) learnableSecrets.add(choice.revealsInfo);
      }
    }

    for (const node of Object.values(dialogueTree)) {
      for (const choice of node.choices) {
        const required = [
          ...(choice.requiresAllSecrets ?? []),
          ...(choice.requiresAnySecrets ?? []),
          ...(choice.hideWhenHasAnySecrets ?? []),
        ];
        for (const secret of required) {
          if (secret === 'override') continue;
          expect(learnableSecrets.has(secret)).toBe(true);
        }
      }
    }
  });

  it('keeps exclusiveGroup values meaningful (at least 2 choices per group)', () => {
    const groups = new Map<string, string[]>();

    for (const node of Object.values(dialogueTree)) {
      for (const choice of node.choices) {
        if (!choice.exclusiveGroup) continue;
        const ids = groups.get(choice.exclusiveGroup) ?? [];
        ids.push(choice.id);
        groups.set(choice.exclusiveGroup, ids);
      }
    }

    for (const [group, ids] of groups.entries()) {
      expect(ids.length).toBeGreaterThanOrEqual(2);
      // Ensure the group doesn't accidentally repeat the same id.
      expect(new Set(ids).size).toBe(ids.length);
      expect(group.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps new investigative nodes reachable from the opening', () => {
    const startId = 'opening';

    const visited = new Set<string>();
    const queue: string[] = [startId];

    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const node = dialogueTree[id];
      if (!node) continue;

      for (const choice of node.choices) {
        if (!choice.nextNodeId) continue;
        queue.push(choice.nextNodeId);
      }
    }

    const required = [
      'iron-dispatch-audit',
      'verdant-ward-inspection',
      'aldric-ward-sample',
      'ember-manifest-check',
    ];

    for (const id of required) {
      expect(visited.has(id)).toBe(true);
    }
  });
});
