import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { DialogueNode } from '@/game/types';

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

  it('confirms before leaving the Hall when a crisis is pending', async () => {
    const onChoice = vi.fn();

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
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

  it('does not confirm when no crisis is pending', () => {
    const onChoice = vi.fn();

    render(
      <HubPanel
        node={node}
        onChoice={onChoice}
        crisisPending={false}
        crisisTurnsLeft={null}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /go to the docks/i }));

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
