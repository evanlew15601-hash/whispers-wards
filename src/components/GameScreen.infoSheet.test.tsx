import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { GameState, DialogueNode } from '@/game/types';
import type { SaveSlotInfo } from '@/game/storage';

vi.mock('@/components/DialoguePanel', () => ({
  default: () => <div data-testid="dialogue-panel" />,
}));

import GameScreen from '@/components/GameScreen';

const otherDialogue: DialogueNode = {
  id: 'some-dialogue',
  speaker: 'NPC',
  text: 'Not the hub.',
  choices: [],
};

const baseState: GameState = {
  currentScene: 'game',
  player: {
    name: 'Envoy',
    pronouns: 'they/them',
    portraitId: 'envoy-default',
  },
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
  currentDialogue: otherDialogue,
  events: [],
  knownSecrets: [],
  knownTokens: [],
  selectedChoiceIds: [],
  stepNumber: 0,
  turnNumber: 12,
  chapterId: 'chapter-1',
  chapterTurn: 1,
  milestones: [],
  resources: { coin: 3, influence: 1, supplies: 1, intel: 0 },
  projects: [],
  management: { apMax: 3, apRemaining: 3, actionsTakenThisTurn: [], lastUsedTurnByActionId: {}, usedThisChapter: {} },
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
  pendingEncounter: null,
};

const saveSlots: SaveSlotInfo[] = [{ id: 1, meta: null }];

describe('GameScreen focus mode info sheet', () => {
  it('shows an Info button in focus mode and opens the info sheet', async () => {
    render(
      <GameScreen
        state={baseState}
        engineLabel="test"
        choiceLockedFlags={null}
        choiceUiHints={null}
        makeChoice={vi.fn()}
        endTurn={vi.fn()}
        takeManagementAction={vi.fn()}
        resetGame={vi.fn()}
        saveSlots={saveSlots}
        saveToSlot={vi.fn()}
        loadFromSlot={vi.fn()}
        deleteSlot={vi.fn()}
        exitToTitle={vi.fn()}
        enterPendingEncounter={vi.fn()}
        returnToHub={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^info$/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/leads, intel, event log/i)).toBeInTheDocument();
  });
});
