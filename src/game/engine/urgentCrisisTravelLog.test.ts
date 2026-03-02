import { describe, expect, it } from 'vitest';

import { tsConversationEngine } from './tsConversationEngine';
import { dialogueTree } from '../data';
import { getChapter } from '../chapters';

import type { GameState } from '../types';

const withHubDialogue = (state: GameState): GameState => {
  const chapter = getChapter(state.chapterId);
  const hub = dialogueTree[chapter.hubNodeId];
  if (!hub) throw new Error('Expected hub dialogue');
  return { ...state, currentDialogue: hub };
};

describe('urgent crisis travel logging', () => {
  it('logs a warning when leaving the Hall with an urgent crisis pending', () => {
    const started = tsConversationEngine.startNewGame();
    const inHall = withHubDialogue({
      ...started,
      turnNumber: 5,
      pendingEncounter: {
        id: 'enc',
        kind: 'raid',
        title: 'Caravans attacked',
        description: 'test',
        relatedFactions: ['iron-pact', 'verdant-court'],
        expiresOnTurn: 6,
      },
    });

    const hub = inHall.currentDialogue!;
    const choice = hub.choices.find(c => c.nextNodeId && c.nextNodeId !== hub.id) ?? hub.choices[0]!;

    const next = tsConversationEngine.applyChoice(inHall, choice);

    expect(next.log.some(line => line.startsWith('⚠ Left Hall with crisis pending:'))).toBe(true);
  });
});
