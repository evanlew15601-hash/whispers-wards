import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { DialogueNode, Faction } from '@/game/types';

import HubPanel from '@/components/HubPanel';

describe('HubPanel crisis guard', () => {
  const node: DialogueNode = {
    id: 'concord-hub',
    speaker: 'Concord',
    text: 'Briefing.',
    choices: [
      { id: 'c1', text: 'Go to the docks', effects: [], nextNodeId: 'scene:docks' },
    ],
  };

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

  it('confirms before leaving the Hall when a crisis is urgent', async () => {
    const onChoice = vi.fn();

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
        resources={{ coin: 0, influence: 0, supplies: 0, intel: 0 }}
        selectedChoiceIds={[]}
        crisisPending={true}
        crisisTurnsLeft={1}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /go to the docks/i }));

    expect(onChoice).not.toHaveBeenCalled();

    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/crisis is pending/i)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /leave anyway/i }));

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[0]);
  });

  it('does not confirm when a crisis is not urgent', () => {
    const onChoice = vi.fn();

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
        resources={{ coin: 0, influence: 0, supplies: 0, intel: 0 }}
        selectedChoiceIds={[]}
        crisisPending={true}
        crisisTurnsLeft={2}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /go to the docks/i }));

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('does not confirm when no crisis is pending', () => {
    const onChoice = vi.fn();

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
        selectedChoiceIds={[]}
        crisisPending={false}
        crisisTurnsLeft={null}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /go to the docks/i }));

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
