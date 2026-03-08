import { describe, expect, it } from 'vitest';

import { dialogueTree, initialFactions } from '../data';

const readInkSource = async () => {
  const url = new URL('./main.ink', import.meta.url);
  const fs = await import('node:fs/promises');
  return fs.readFile(url, 'utf8');
};

describe('Ink story integrity', () => {
  it('keeps choice metadata tags stable and valid', async () => {
    const source = await readInkSource();
    const lines = source.split(/\r?\n/);

    const factionIds = new Set(initialFactions.map(f => f.id));

    const choiceIds = new Set<string>();

    for (const line of lines) {
      // Convention: every choice line carries its metadata inline.
      if (!/^\s*\+\s*\[/.test(line)) continue;

      const idMatch = line.match(/#id:([^\s#]+)/);
      expect(idMatch).toBeTruthy();

      const choiceId = idMatch?.[1]?.trim() ?? '';
      expect(choiceId.length).toBeGreaterThan(0);

      expect(choiceIds.has(choiceId)).toBe(false);
      choiceIds.add(choiceId);

      const gotoMatches = [...line.matchAll(/#goto:([^\s#]+)/g)];
      for (const m of gotoMatches) {
        const gotoId = m[1]?.trim() ?? '';
        if (!gotoId) continue;

        // We only use #goto to hand off into the TS dialogue graph.
        expect(dialogueTree[gotoId]).toBeTruthy();
      }

      const repMatches = [...line.matchAll(/#rep:([^\s:#]+):([+-]?[0-9]+)/g)];
      for (const m of repMatches) {
        const factionId = m[1]?.trim() ?? '';
        const deltaRaw = m[2]?.trim() ?? '';
        const delta = Number(deltaRaw);

        expect(factionIds.has(factionId)).toBe(true);
        expect(Number.isFinite(delta)).toBe(true);
      }

      const revealMatches = [...line.matchAll(/#reveal:([^\s#].*?)($|\s#)/g)];
      for (const m of revealMatches) {
        const secret = (m[1] ?? '').trim();
        expect(secret.length).toBeGreaterThan(0);
      }
    }
  });
});
