import { describe, expect, it, vi } from 'vitest';

import type { ConversationEngine } from './conversationEngine';
import { createInkConversationEngine } from './inkConversationEngine';
import { tsConversationEngine } from './tsConversationEngine';

describe('createInkConversationEngine', () => {
  it('delegates Ink #goto handoff via the fallback engine', () => {
    const applyChoiceMock = vi.fn(tsConversationEngine.applyChoice);

    const fallback: ConversationEngine = {
      ...tsConversationEngine,
      applyChoice: applyChoiceMock,
    };

    const engine = createInkConversationEngine(fallback);

    const initial = engine.startNewGame();

    const diplomatic = initial.currentDialogue!.choices.find(c => c.id === 'diplomatic');
    if (!diplomatic) throw new Error('Expected diplomatic choice');

    const afterDip = engine.applyChoice(initial, diplomatic);

    const about = afterDip.currentDialogue!.choices.find(c => c.id === 'ask-about-thessaly');
    if (!about) throw new Error('Expected ask-about-thessaly choice');

    const afterAbout = engine.applyChoice(afterDip, about);

    const compromise = afterAbout.currentDialogue!.choices.find(c => c.id === 'thessaly-compromise');
    if (!compromise) throw new Error('Expected thessaly-compromise choice');

    const afterExit = engine.applyChoice(afterAbout, compromise);

    expect(applyChoiceMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ nextNodeId: 'thessaly-strategic' }),
    );

    expect(afterExit.currentDialogue?.id).toBe('thessaly-strategic');
    expect(afterExit.ink ?? null).toBeNull();
  });
});
