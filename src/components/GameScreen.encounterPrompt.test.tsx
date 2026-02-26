import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { GameState, DialogueNode, SecondaryEncounter } from '@/game/types';
import type { SaveSlotInfo } from '@/game/storage';

// DialoguePanel does async text-wrapping work which can cause act() warnings.
// Stub it out: these tests only care about the presence/behavior of the encounter prompt.
vi.mock('@/components/DialoguePanel', () => ({
  default: () => <div data-testid="dialogue-panel" />,
}));

import GameScreen from '@/components/GameScreen';

const hubDialogue: DialogueNode = {
  id: 'concord-hub',
  speaker: 'Concord',
  text: 'Welcome to the hub.',
  choices: [],
};

const otherDialogue: DialogueNode = {
  id: 'some-dialogue',
  speaker: 'NPC',
  text: 'Not the hub.',
  choices: [],
};

const encounterDialogue: DialogueNode = {
  id: 'encounter:test',
  speaker: 'Encounter',
  text: 'In an encounter.',
  choices: [],
};

const pendingEncounter: SecondaryEncounter = {
  id: 'enc-1',
  title: 'Test Encounter',
  description: 'A test encounter is pending.',
  relatedFactions: ['iron'],
  expiresOnTurn: 20,
};

const baseState: GameState = {
  currentScene: 'game',
  factions: [
    {
      id: 'iron',
      name: 'Iron Dominion',
      description: 'Test faction',
      motto: 'Test motto',
      color: 'iron',
      reputation: 0,
      traits: [],
    },
  ],
  currentDialogue: hubDialogue,
  events: [],
  knownSecrets: [],
  turnNumber: 12,
  log: [],
  rngSeed: 0,
  world: {
    regions: {
      ironhold: { id: 'ironhold', name: 'Ironhold', control: 'iron', contested: false },
    },
    tradeRoutes: {},
    tensions: {},
    aiMemory: { lastOfferTurn: {}, lastEmbargoTurn: {} },
  },
  pendingEncounters: [],
  encounterResolvedOnTurn: null,
};

const saveSlots: SaveSlotInfo[] = [{ id: 1, meta: null }];

const renderScreen = (state: GameState, enterPendingEncounter = vi.fn()) =>
  render(
    <GameScreen
      state={state}
      engineLabel="test"
      makeChoice={vi.fn()}
      resetGame={vi.fn()}
      saveSlots={saveSlots}
      saveToSlot={vi.fn()}
      loadFromSlot={vi.fn()}
      deleteSlot={vi.fn()}
      exitToTitle={vi.fn()}
      enterPendingEncounter={enterPendingEncounter}
    />,
  );

describe('GameScreen encounter prompt', () => {
  it('renders a Review button in the hub when pending encounters exist, and selecting an encounter calls handler', async () => {
    const enterPendingEncounter = vi.fn();

    renderScreen(
      {
        ...baseState,
        currentDialogue: hubDialogue,
        pendingEncounters: [pendingEncounter],
      },
      enterPendingEncounter,
    );

    const button = screen.getByRole('button', { name: /review/i });
    fireEvent.click(button);

    const dialog = await screen.findByRole('dialog');
    const address = within(dialog).getByRole('button', { name: /^address$/i });
    fireEvent.click(address);

    expect(enterPendingEncounter).toHaveBeenCalledTimes(1);
    expect(enterPendingEncounter).toHaveBeenCalledWith('enc-1');
  });

  it('does not render the Review button outside hub+pendingEncounters', () => {
    const cases: GameState[] = [
      {
        ...baseState,
        currentDialogue: hubDialogue,
        pendingEncounters: [],
      },
      {
        ...baseState,
        currentDialogue: otherDialogue,
        pendingEncounters: [pendingEncounter],
      },
      {
        ...baseState,
        currentDialogue: encounterDialogue,
        pendingEncounters: [pendingEncounter],
      },
    ];

    for (const testState of cases) {
      const { unmount } = renderScreen(testState);

      expect(screen.queryByRole('button', { name: /review/i })).not.toBeInTheDocument();

      unmount();
    }
  });
});
