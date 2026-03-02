import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('can hide redundant evidence-dependent choices once proof is known', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-hide',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'generic',
          text: 'Generic option',
          effects: [],
          nextNodeId: 'node-2',
          hideWhenHasAnySecrets: ['proof:better'],
        },
        {
          id: 'specific',
          text: 'Specific option',
          effects: [],
          nextNodeId: 'node-3',
          requiresAnySecrets: ['proof:better'],
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

    const { rerender, queryByText } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });

    // Initially: only generic is visible (specific is hidden due to missing proof).
    expect(queryByText('Generic option')).toBeTruthy();
    expect(queryByText('Specific option')).toBeFalsy();

    // After learning proof: generic disappears and specific appears.
    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:better']}
        factions={factions}
      />,
    );

    expect(queryByText('Generic option')).toBeFalsy();
    expect(queryByText('Specific option')).toBeTruthy();

    // Hotkey 1 should now select the specific option (since it's the first visible choice).
    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[1]);

    vi.useRealTimers();
  });

  it('hides lower-priority proof options when multiple proofs are known (reduce redundancy)', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const node: DialogueNode = {
      id: 'node-priority-hide',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'expose-ledger',
          text: 'Expose (ledger)',
          effects: [],
          nextNodeId: 'node-ledger',
          requiresAnySecrets: ['proof:ledger'],
          hideWhenLockedBySecrets: true,
        },
        {
          id: 'expose-manifest',
          text: 'Expose (manifest)',
          effects: [],
          nextNodeId: 'node-manifest',
          requiresAnySecrets: ['proof:manifest'],
          hideWhenLockedBySecrets: true,
          hideWhenHasAnySecrets: ['proof:ledger'],
        },
        {
          id: 'expose-maps',
          text: 'Expose (maps)',
          effects: [],
          nextNodeId: 'node-maps',
          requiresAnySecrets: ['proof:maps'],
          hideWhenLockedBySecrets: true,
          hideWhenHasAnySecrets: ['proof:ledger', 'proof:manifest'],
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

    const { rerender, queryByText } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:manifest', 'proof:maps']}
        factions={factions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });

    // With manifest + maps proof: only manifest should remain.
    expect(queryByText('Expose (ledger)')).toBeFalsy();
    expect(queryByText('Expose (manifest)')).toBeTruthy();
    expect(queryByText('Expose (maps)')).toBeFalsy();

    onChoice.mockClear();
    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[1]);

    // With all three proofs: only ledger remains.
    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={['proof:ledger', 'proof:manifest', 'proof:maps']}
        factions={factions}
      />,
    );

    expect(queryByText('Expose (ledger)')).toBeTruthy();
    expect(queryByText('Expose (manifest)')).toBeFalsy();
    expect(queryByText('Expose (maps)')).toBeFalsy();

    vi.useRealTimers();
  });

  it('does not hide secret-gated choices when unlocked by secrets but still reputation-locked', () => {
    vi.useFakeTimers();

    const onChoice = vi.fn();

    const proofSecret = 'proof:ledger';

    const node: DialogueNode = {
      id: 'node-hide-vs-rep',
      speaker: 'Narrator',
      text: 'A short line of dialogue.',
      choices: [
        {
          id: 'present-proof',
          text: 'Present proof',
          effects: [],
          nextNodeId: 'node-2',
          requiresAnySecrets: [proofSecret],
          hideWhenLockedBySecrets: true,
          requiredReputation: { factionId: 'ember-throne', min: 10 },
        },
        {
          id: 'fallback',
          text: 'Fallback option',
          effects: [],
          nextNodeId: 'node-3',
        },
      ],
    };

    const baseFactions: Faction[] = [
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

    const { rerender, queryByText } = render(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[]}
        factions={baseFactions}
      />,
    );

    fireEvent.keyDown(window, { key: ' ' });

    // Missing secret => choice is hidden; hotkey should map to the first visible choice.
    expect(queryByText('Present proof')).toBeFalsy();
    expect(queryByText('Fallback option')).toBeTruthy();

    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[1]);

    onChoice.mockClear();

    // Has secret but insufficient rep => choice becomes visible (not hidden), but is locked.
    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[proofSecret]}
        factions={baseFactions}
      />,
    );

    expect(queryByText('Present proof')).toBeTruthy();

    const proofButton = screen.getByRole('button', { name: /present proof/i });
    expect(proofButton.getAttribute('aria-disabled')).toBe('true');

    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).not.toHaveBeenCalled();

    // With sufficient rep, the same hotkey should now choose the proof option.
    rerender(
      <DialoguePanel
        node={node}
        onChoice={onChoice}
        knownSecrets={[proofSecret]}
        factions={baseFactions.map(f => ({ ...f, reputation: 20 }))}
      />,
    );

    fireEvent.keyDown(window, { key: '1' });
    expect(onChoice).toHaveBeenCalledTimes(1);
    expect(onChoice).toHaveBeenCalledWith(node.choices[0]);

    vi.useRealTimers();
  });
});
