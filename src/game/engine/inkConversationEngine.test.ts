import { describe, expect, it } from 'vitest';

import { inkConversationEngine } from './inkConversationEngine';
import { dialogueTree } from '../data';

describe('inkConversationEngine', () => {
  it('starts in Ink and can hand off to the TS dialogueTree via #goto tags', () => {
    const initial = inkConversationEngine.startNewGame();

    expect(initial.currentScene).toBe('game');
    expect(initial.currentDialogue?.id).toBe('ink:opening');
    expect(initial.ink?.storyId).toBe('main');

    const diplomatic = initial.currentDialogue!.choices.find(c => c.id === 'diplomatic');
    if (!diplomatic) throw new Error('Expected diplomatic choice');

    const afterDip = inkConversationEngine.applyChoice(initial, diplomatic);
    expect(afterDip.currentDialogue?.id).toBe('ink:aldric-diplomatic');

    const iron = afterDip.factions.find(f => f.id === 'iron-pact');
    const verdant = afterDip.factions.find(f => f.id === 'verdant-court');
    expect(iron?.reputation).toBe((initial.factions.find(f => f.id === 'iron-pact')?.reputation ?? 0) - 5);
    expect(verdant?.reputation).toBe((initial.factions.find(f => f.id === 'verdant-court')?.reputation ?? 0) + 10);

    const about = afterDip.currentDialogue!.choices.find(c => c.id === 'ask-about-thessaly');
    if (!about) throw new Error('Expected ask-about-thessaly choice');

    const afterAbout = inkConversationEngine.applyChoice(afterDip, about);
    expect(afterAbout.currentDialogue?.id).toBe('ink:thessaly-intro');

    const compromise = afterAbout.currentDialogue!.choices.find(c => c.id === 'thessaly-compromise');
    if (!compromise) throw new Error('Expected thessaly-compromise choice');

    const afterExit = inkConversationEngine.applyChoice(afterAbout, compromise);
    expect(afterExit.currentDialogue?.id).toBe('thessaly-strategic');
    expect(dialogueTree['thessaly-strategic']).toBeTruthy();
    expect(afterExit.ink ?? null).toBeNull();
  });
});
