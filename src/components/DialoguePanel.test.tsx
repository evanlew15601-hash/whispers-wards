import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import type { DialogueNode, Faction } from '@/game/types';

vi.mock('@/game/engine/uqmTextWrap', async () => {
  const actual = await vi.importActual<typeof import('@/game/engine/uqmTextWrap')>(
    '@/game/engine/uqmTextWrap',
  );

  return {
    ...actual,
    wrapTextLinesUqm: async (text: string, maxWidth: number) => actual.wrapTextLinesJs(text, maxWidth),
  };
});

import DialoguePanel from '@/components/DialoguePanel';

describe('DialoguePanel', () => {
  it('supports skipping reveal and choosing responses via number keys', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-1',
      speaker: 'Commander Aldric Vane',
      speakerFaction: 'iron-pact',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'c1',
          text: 'First choice',
          effects: [],
          nextNodeId: 'node-2',
        },
        {
          id: 'c2',
          text: 'Second choice',
          effects: [],
          nextNodeId: 'node-3',
        },
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

    render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: '1' });

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[0]);

    vi.useRealTimers();
  });

  it('does not choose locked options via hotkeys', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-locked',
      speaker: 'Trade Consul Renzo',
      speakerFaction: 'ember-throne',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'locked',
          text: 'Locked choice',
          effects: [],
          nextNodeId: 'node-2',
          requiredReputation: { factionId: 'ember-throne', min: 10 },
        },
      ],
    };

    const factions: Faction[] = [
      {
        id: 'ember-throne',
        name: 'The Ember Throne',
        description: '',
        motto: '',
        color: 'ember',
        reputation: 0,
        traits: [],
      },
    ];

    render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: '1' });

    expect(onChoice).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('locks choices that require proof until the secret is known', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-proof',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'present-proof',
          text: 'Present your proof.',
          effects: [],
          nextNodeId: 'node-2',
          requiresAnySecrets: ['proof:ember'],
        },
      ],
    };

    const factions: Faction[] = [
      {
        id: 'ember-throne',
        name: 'The Ember Throne',
        description: '',
        motto: '',
        color: 'ember',
        reputation: 0,
        traits: [],
      },
    ];

    const { rerender } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).not.toHaveBeenCalled();

    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:ember']}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('can hide secret-locked options entirely and remap hotkeys to visible choices', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-hide-locked',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'always-1',
          text: 'Always visible',
          effects: [],
          nextNodeId: 'node-2',
        },
        {
          id: 'needs-proof',
          text: 'Only visible with proof',
          effects: [],
          nextNodeId: 'node-3',
          requiresAnySecrets: ['proof:ember'],
          hideWhenLockedBySecrets: true,
        },
        {
          id: 'always-2',
          text: 'Second visible choice',
          effects: [],
          nextNodeId: 'node-4',
        },
      ],
    };

    const factions: Faction[] = [
      {
        id: 'ember-throne',
        name: 'The Ember Throne',
        description: '',
        motto: '',
        color: 'ember',
        reputation: 0,
        traits: [],
      },
    ];

    const { queryByText } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });

    // Hidden because it's locked by secrets and marked hideWhenLockedBySecrets.
    expect(queryByText('Only visible with proof')).toBeNull();

    // Hotkey 2 should now select the third choice (second visible choice).
    fireEvent.keyDown(window, { key: '2' });
    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[2]);

    vi.useRealTimers();
  });

  it('can hide redundant choices once a proof secret is already known', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-hide-redundant',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'generic',
          text: 'Generic option',
          effects: [],
          nextNodeId: 'node-2',
          hideWhenHasAnySecrets: ['proof:ember'],
        },
        {
          id: 'specific',
          text: 'Specific proof-backed option',
          effects: [],
          nextNodeId: 'node-3',
          requiresAnySecrets: ['proof:ember'],
          hideWhenLockedBySecrets: true,
        },
      ],
    };

    const factions: Faction[] = [
      {
        id: 'ember-throne',
        name: 'The Ember Throne',
        description: '',
        motto: '',
        color: 'ember',
        reputation: 0,
        traits: [],
      },
    ];

    const { queryByText } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:ember']}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });

    expect(queryByText('Generic option')).toBeNull();
    expect(queryByText('Specific proof-backed option')).toBeTruthy();

    vi.useRealTimers();
  });
});
