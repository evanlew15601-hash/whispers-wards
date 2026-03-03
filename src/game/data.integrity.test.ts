import { describe, expect, it } from 'vitest';

import { CHAPTER_CONTENT_BY_ID, getDialogueTree, getInitialFactions } from './data';

const TOKEN_PREFIX_RE = /^tok:ch\d{2}:/;

describe('dialogueTree integrity', () => {
  it('has valid edges and consistent ids (per chapter)', () => {
    const factionIds = new Set(getInitialFactions().map(f => f.id));

    const globalChoiceIds = new Set<string>();

    for (const [chapterId] of Object.entries(CHAPTER_CONTENT_BY_ID)) {
      const tree = getDialogueTree(chapterId);

      for (const [key, node] of Object.entries(tree)) {
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
            expect(tree[choice.nextNodeId]).toBeTruthy();
          }

          if (choice.requiredReputation) {
            expect(factionIds.has(choice.requiredReputation.factionId)).toBe(true);
            expect(typeof choice.requiredReputation.min).toBe('number');
          }

          if (choice.requiredReputationMax) {
            expect(factionIds.has(choice.requiredReputationMax.factionId)).toBe(true);
            expect(typeof choice.requiredReputationMax.max).toBe('number');
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

          if (choice.requiresAllTokens) {
            expect(Array.isArray(choice.requiresAllTokens)).toBe(true);
            expect(choice.requiresAllTokens.length).toBeGreaterThan(0);
            for (const token of choice.requiresAllTokens) {
              expect(typeof token).toBe('string');
              expect(token.trim().length).toBeGreaterThan(0);
              expect(TOKEN_PREFIX_RE.test(token)).toBe(true);
            }
          }

          if (choice.requiresAnyTokens) {
            expect(Array.isArray(choice.requiresAnyTokens)).toBe(true);
            expect(choice.requiresAnyTokens.length).toBeGreaterThan(0);
            for (const token of choice.requiresAnyTokens) {
              expect(typeof token).toBe('string');
              expect(token.trim().length).toBeGreaterThan(0);
              expect(TOKEN_PREFIX_RE.test(token)).toBe(true);
            }
          }

          if (choice.grantsTokens) {
            expect(Array.isArray(choice.grantsTokens)).toBe(true);
            expect(choice.grantsTokens.length).toBeGreaterThan(0);
            for (const token of choice.grantsTokens) {
              expect(typeof token).toBe('string');
              expect(token.trim().length).toBeGreaterThan(0);
              expect(TOKEN_PREFIX_RE.test(token)).toBe(true);
            }
          }

          if (choice.hideWhenLockedBySecrets != null) {
            expect(typeof choice.hideWhenLockedBySecrets).toBe('boolean');
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

          if (choice.gameEffects) {
            expect(Array.isArray(choice.gameEffects)).toBe(true);
            expect(choice.gameEffects.length).toBeGreaterThan(0);
            for (const eff of choice.gameEffects) {
              expect(typeof eff).toBe('object');
              expect(eff).not.toBeNull();
              expect('kind' in eff).toBe(true);
            }
          }

          // UI constraint: hotkeys 1–9.
          expect(node.choices.length).toBeLessThanOrEqual(9);
        }
      }
    }
  });

  it('keeps lock-affecting proof (secrets/tokens) within the WASM mask budget (per chapter)', () => {
    for (const [chapterId] of Object.entries(CHAPTER_CONTENT_BY_ID)) {
      const tree = getDialogueTree(chapterId);

      const lockFacts = new Set<string>();
      const otherSecrets = new Set<string>();

      for (const node of Object.values(tree)) {
        for (const choice of node.choices) {
          for (const s of choice.requiresAllSecrets ?? []) lockFacts.add(s);
          for (const s of choice.requiresAnySecrets ?? []) lockFacts.add(s);
          for (const t of choice.requiresAllTokens ?? []) lockFacts.add(t);
          for (const t of choice.requiresAnyTokens ?? []) lockFacts.add(t);
          if (choice.revealsInfo) otherSecrets.add(choice.revealsInfo);
        }
      }

      expect(lockFacts.size).toBeLessThanOrEqual(64);

      const lockSorted = [...lockFacts].sort();
      const otherSorted = [...otherSecrets].filter(s => !lockFacts.has(s)).sort();
      const mapping = [...lockSorted, ...otherSorted].slice(0, 64);
      const encodable = new Set(mapping);

      for (const s of lockFacts) {
        if (s === 'override') continue;
        expect(encodable.has(s)).toBe(true);
      }
    }
  });

  it('only requires secrets that can actually be learned in the same chapter tree', () => {
    for (const [chapterId] of Object.entries(CHAPTER_CONTENT_BY_ID)) {
      const tree = getDialogueTree(chapterId);

      const learnableSecrets = new Set<string>();

      for (const node of Object.values(tree)) {
        for (const choice of node.choices) {
          if (choice.revealsInfo) learnableSecrets.add(choice.revealsInfo);
        }
      }

      for (const node of Object.values(tree)) {
        for (const choice of node.choices) {
          const required = [...(choice.requiresAllSecrets ?? []), ...(choice.requiresAnySecrets ?? [])];
          for (const secret of required) {
            if (secret === 'override') continue;
            expect(learnableSecrets.has(secret)).toBe(true);
          }
        }
      }
    }
  });

  it('keeps exclusiveGroup values meaningful (at least 2 choices per group, across all chapters)', () => {
    const groups = new Map<string, string[]>();

    for (const [chapterId] of Object.entries(CHAPTER_CONTENT_BY_ID)) {
      const tree = getDialogueTree(chapterId);

      for (const node of Object.values(tree)) {
        for (const choice of node.choices) {
          if (!choice.exclusiveGroup) continue;
          const ids = groups.get(choice.exclusiveGroup) ?? [];
          ids.push(choice.id);
          groups.set(choice.exclusiveGroup, ids);
        }
      }
    }

    for (const [group, ids] of groups.entries()) {
      expect(ids.length).toBeGreaterThanOrEqual(2);
      // Ensure the group doesn't accidentally repeat the same id.
      expect(new Set(ids).size).toBe(ids.length);
      expect(group.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps new investigative nodes reachable from the opening (chapter-1)', () => {
    const tree = getDialogueTree('chapter-1');
    const startId = 'opening';

    const visited = new Set<string>();
    const queue: string[] = [startId];

    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const node = tree[id];
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
