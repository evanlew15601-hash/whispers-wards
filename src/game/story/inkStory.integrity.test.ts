import { describe, expect, it } from 'vitest';

import { dialogueTree, initialFactions } from '../data';
import { getProjectTemplateById } from '../projects';

const readInkSource = async () => {
  const url = new URL('./main.ink', import.meta.url);
  const fs = await import('node:fs/promises');
  return fs.readFile(url, 'utf8');
};

const ALLOWED_SHARED_CHOICE_IDS = new Set([
  'diplomatic',
  'pragmatic',
  'information',
  'ask-about-thessaly',
  'thank-proceed',
  'pragmatic-maps',
  'pragmatic-motives',
  'suspicious-accuse',
  'suspicious-investigate',
  'thessaly-justice',
  'thessaly-compromise',
]);

describe('Ink story integrity', () => {
  it('keeps choice metadata tags stable and valid', async () => {
    const source = await readInkSource();
    const lines = source.split(/\r?\n/);

    const factionIds = new Set(initialFactions.map(f => f.id));

    const tsChoiceIds = new Set<string>();
    for (const node of Object.values(dialogueTree)) {
      for (const c of node.choices) tsChoiceIds.add(c.id);
    }

    const choiceIds = new Set<string>();

    for (const line of lines) {
      // Convention: every choice line carries its metadata inline.
      if (!/^\s*\+\s*\[/.test(line)) continue;

      const idMatch = line.match(/#id:([^\s#]+)/);
      expect(idMatch).toBeTruthy();

      const choiceId = idMatch?.[1]?.trim() ?? '';
      expect(choiceId.length).toBeGreaterThan(0);

      expect(choiceIds.has(choiceId)).toBe(false);
      if (tsChoiceIds.has(choiceId)) {
        expect(ALLOWED_SHARED_CHOICE_IDS.has(choiceId)).toBe(true);
      }
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

      const resourceMatches = [...line.matchAll(/#res:(coin|influence|supplies|intel):([+-]?[0-9]+)/g)];
      for (const m of resourceMatches) {
        const delta = Number((m[2] ?? '').trim());
        expect(Number.isFinite(delta)).toBe(true);
      }

      const milestoneMatches = [...line.matchAll(/#milestone:([^\s#]+)/g)];
      for (const m of milestoneMatches) {
        const id = (m[1] ?? '').trim();
        expect(id.length).toBeGreaterThan(0);
      }

      const projectStartMatches = [...line.matchAll(/#proj:start:([^\s#]+)/g)];
      for (const m of projectStartMatches) {
        const templateId = (m[1] ?? '').trim();
        expect(templateId.length).toBeGreaterThan(0);
        expect(getProjectTemplateById(templateId)).toBeTruthy();
      }

      const tensionMatches = [...line.matchAll(/#tension:([^\s:#]+):([^\s:#]+):([+-]?[0-9]+)/g)];
      for (const m of tensionMatches) {
        const a = (m[1] ?? '').trim();
        const b = (m[2] ?? '').trim();
        const delta = Number((m[3] ?? '').trim());
        expect(factionIds.has(a)).toBe(true);
        expect(factionIds.has(b)).toBe(true);
        expect(Number.isFinite(delta)).toBe(true);
      }

      const logMatches = [...line.matchAll(/#log:([^\s#].*?)($|\s#)/g)];
      for (const m of logMatches) {
        const message = (m[1] ?? '').trim();
        expect(message.length).toBeGreaterThan(0);
      }
    }
  });
});
