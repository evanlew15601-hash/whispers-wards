import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { GameState } from '@/game/types';
import type { SaveSlotInfo } from '@/game/storage';

import GameScreen from '@/components/GameScreen';

const getActiveTabPanel = (dialog: HTMLElement) => {
  const tabs = within(dialog).getAllByRole('tab');
  const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') ?? tabs[0];
  if (!selected) throw new Error('Expected at least one tab');

  const controls = selected.getAttribute('aria-controls');
  if (controls) {
    const byId = document.getElementById(controls);
    if (byId) return byId;
  }

  const panels = within(dialog).getAllByRole('tabpanel');
  const active = panels.find(panel => panel.getAttribute('data-state') === 'active') ?? panels.find(panel => !panel.hasAttribute('hidden'));
  if (!active) throw new Error('Expected an active tab panel');
  return active;
};

const state: GameState = {
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
  currentDialogue: null,
  events: [],
  knownSecrets: [],
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

const saveSlots: SaveSlotInfo[] = [
  { id: 1, meta: null },
  {
    id: 2,
    meta: {
      savedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
      turnNumber: 12,
      factions: [{ id: 'iron', name: 'Iron Dominion', reputation: 0 }],
    },
  },
];

const renderScreen = () =>
  render(
    <GameScreen
      state={state}
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

describe('GameScreen menu keyboard shortcuts', () => {
  it('Escape opens the menu (Save tab active by default)', async () => {
    renderScreen();

    fireEvent.keyDown(window, { key: 'Escape' });

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('tab', { name: /^save$/i })).toHaveAttribute('aria-selected', 'true');

    const panel = getActiveTabPanel(dialog);
    expect(within(panel).getAllByRole('button', { name: /^save$/i }).length).toBeGreaterThan(0);
  });

  it('Ctrl+S opens the menu with Save tab active', async () => {
    renderScreen();

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('tab', { name: /^save$/i })).toHaveAttribute('aria-selected', 'true');

    const panel = getActiveTabPanel(dialog);
    expect(within(panel).getAllByRole('button', { name: /^save$/i }).length).toBeGreaterThan(0);
  });

  it('Ctrl+O opens the menu with Load tab active', async () => {
    renderScreen();

    fireEvent.keyDown(window, { key: 'o', ctrlKey: true });

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('tab', { name: /^load$/i })).toHaveAttribute('aria-selected', 'true');

    const panel = getActiveTabPanel(dialog);
    expect(within(panel).getAllByRole('button', { name: /^load$/i }).length).toBeGreaterThan(0);
  });

  it('does not open the menu when typing in an input (Ctrl+S / Esc)', async () => {
    renderScreen();

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    input.remove();
  });
});
