import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DialogueNode, Faction } from '@/game/types';

import HubPanel from '@/components/HubPanel';

describe('HubPanel repeatable choices', () => {
  const factions: Faction[] = [
    {
      id: 'iron-pact',
      name: 'The Iron Pact',
      description: '',
      motto: '',
      color: 'iron',
      reputation: 0,
      traits: [],
    },
  ];

  it('hides non-repeatable choices that were already selected', () => {
    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'concord-hub-2',
      speaker: 'Narrator',
      text: 'Briefing.',
      choices: [
        { id: 'c1', text: 'Read the minutes', repeatable: false, effects: [], nextNodeId: 'scene:minutes' },
        { id: 'c2', text: 'Recap', effects: [], nextNodeId: 'scene:recap' },
      ],
    };

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
        resources={{ coin: 0, influence: 0, supplies: 0, intel: 0 }}
        selectedChoiceIds={['c1']}
      />,
    );

    expect(screen.queryByRole('button', { name: /read the minutes/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recap/i })).toBeInTheDocument();
  });

  it('does not hide choices when override is set', () => {
    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'concord-hub-2',
      speaker: 'Narrator',
      text: 'Briefing.',
      choices: [
        { id: 'c1', text: 'Read the minutes', repeatable: false, effects: [], nextNodeId: 'scene:minutes' },
      ],
    };

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['override']}
        factions={factions}
        resources={{ coin: 0, influence: 0, supplies: 0, intel: 0 }}
        selectedChoiceIds={['c1']}
      />,
    );

    expect(screen.getByRole('button', { name: /read the minutes/i })).toBeInTheDocument();
  });
});
