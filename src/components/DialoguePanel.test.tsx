import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
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

const flushAsync = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const pressKey = async (key: string) => {
  await act(async () => {
    fireEvent.keyDown(window, { key });
  });
};

describe('DialoguePanel', () => {
  it('supports skipping reveal and choosing responses via number keys', async () => {
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

    await flushAsync();

    await pressKey('1');
    expect(onChoice).not.toHaveBeenCalled();

    await pressKey(' ');
    await pressKey('1');

    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[0]);

    vi.useRealTimers();
  });

  it('does not choose locked options via hotkeys', async () => {
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

    await flushAsync();

    await pressKey(' ');
    await pressKey('1');

    expect(onChoice).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('locks choices that require proof until the secret is known', async () => {
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

    await flushAsync();

    await pressKey(' ');
    await pressKey('1');
    expect(onChoice).not.toHaveBeenCalled();

    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:ember']}
        factions={factions}
      />,
    );

    await flushAsync();

    await pressKey('1');
    expect(onChoice).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
