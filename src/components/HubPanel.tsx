import { motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import type { DialogueChoice, DialogueNode, Faction } from '@/game/types';
import Tip from '@/ui/tips/Tip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Lock } from 'lucide-react';
import { isChoiceLockedBySecrets } from '@/game/choiceLocks';

import type { ChoiceUiHint } from '@/game/engine/conversationEngine';

const isUserTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

  return el.isContentEditable;
};

interface HubPanelProps {
  node: DialogueNode;
  onChoice: (choice: DialogueChoice) => void;
  knownSecrets: string[];
  factions: Faction[];
  selectedChoiceIds: string[];
  lockedChoices?: boolean[] | null;
  choiceUiHints?: ChoiceUiHint[] | null;
  crisisPending?: boolean;
  crisisTurnsLeft?: number | null;
  crisisConsequence?: string | null;
}

const PROOF_SECRETS = [
  'The Ember Throne forged maps to manipulate the border dispute.',
  'Renzo\'s ledger pages show coded payments tied to the border killings.',
  'Renzo sold you a curated ledger copy; it still suggests payments aligned with the killings.',
  'Renzo\'s manifests list furnace salts disguised as "road salt" under a Concord Hall docket number.',
  'An old tripartite accord names Greenmarch Pass neutral hinge-ground and warns to keep the binding unbroken.',
];

const HubPanel = ({
  node,
  onChoice,
  knownSecrets,
  factions,
  selectedChoiceIds,
  lockedChoices,
  choiceUiHints,
  crisisPending = false,
  crisisTurnsLeft = null,
  crisisConsequence = null,
}: HubPanelProps) => {
  const paragraphs = node.text.split(/\n\n+/g).filter(Boolean);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<DialogueChoice | null>(null);

  const confirmDescription = useMemo(() => {
    if (!crisisPending) return '';

    const suffix =
      crisisTurnsLeft !== null && crisisTurnsLeft >= 0
        ? ` It expires in ${crisisTurnsLeft} turn${crisisTurnsLeft === 1 ? '' : 's'}.`
        : '';

    const base = `A crisis is pending in the Hall. You can address it immediately without advancing time.${suffix}`;
    return crisisConsequence ? `${base}\n\n${crisisConsequence}` : base;
  }, [crisisConsequence, crisisPending, crisisTurnsLeft]);

  const crisisUrgent = crisisPending && crisisTurnsLeft !== null && crisisTurnsLeft <= 1;

  const choiceUiHintById = useMemo(() => {
    const map = new Map<string, ChoiceUiHint>();
    if (!choiceUiHints?.length) return map;
    node.choices.forEach((choice, idx) => {
      const hint = choiceUiHints[idx];
      if (hint) map.set(choice.id, hint);
    });
    return map;
  }, [node.id, node.choices, choiceUiHints]);

  const lockedChoiceFlagById = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!lockedChoices?.length) return map;
    node.choices.forEach((choice, idx) => {
      const locked = lockedChoices[idx];
      if (typeof locked === 'boolean') map.set(choice.id, locked);
    });
    return map;
  }, [node.id, node.choices, lockedChoices]);

  const hasProof = useMemo(() => {
    if (knownSecrets.includes('override')) return true;
    return PROOF_SECRETS.some(s => knownSecrets.includes(s));
  }, [knownSecrets]);

  const requestChoice = useCallback((choice: DialogueChoice) => {
    const hint = choiceUiHintById.get(choice.id);
    const locked = hint?.locked ?? lockedChoiceFlagById.get(choice.id) ?? false;

    if (locked) return;

    if (!crisisUrgent) {
      onChoice(choice);
      return;
    }

    setPendingChoice(choice);
    setConfirmOpen(true);
  }, [choiceUiHintById, lockedChoiceFlagById, crisisUrgent, onChoice]);

  const confirmChoice = useCallback(() => {
    if (pendingChoice) onChoice(pendingChoice);
    setConfirmOpen(false);
    setPendingChoice(null);
  }, [onChoice, pendingChoice]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (isUserTyping()) return;

      if (confirmOpen) return;

      const key = e.key;
      if (key >= '1' && key <= '9') {
        const idx = Number(key) - 1;
        const choice = node.choices[idx];
        if (!choice) return;
        e.preventDefault();
        requestChoice(choice);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [confirmOpen, node.id, node.choices, requestChoice]);

  return (
    <motion.div
      key={node.id}
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Concord Hall
          </div>
          <div className="mt-1 text-[11px] font-display tracking-[0.2em] text-muted-foreground/70 uppercase">
            Hall agenda • Choose a destination
          </div>
        </div>

        <Tip
          id="hall-mode"
          label="Tip: Hall mode"
          content={
            'Hall is the planning phase: address crises, spend AP on management, then choose a destination. Ending the turn advances the world.'
          }
        />
      </div>

      <div className="parchment-border rounded-sm bg-card/40 p-6">
        <div className="mb-3 font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          Briefing
        </div>
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-body text-sm leading-relaxed text-card-foreground sm:text-base">
              {p.split(/\n/g).map((line, j, arr) => (
                <Fragment key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Destinations
          </span>
          <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground/70 uppercase">
            Select 1–9
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Suggested loop: gather at least one piece of proof, then call the summit to commit to an outcome.
          {!hasProof ? ' (Summit is locked until you have proof.)' : ''}
        </div>

        {crisisPending && (
          <div className="text-xs text-muted-foreground">
            A crisis is pending in the Hall. You can still travel, but the crisis will remain unresolved.
            {crisisUrgent && crisisConsequence ? ` ${crisisConsequence}` : ''}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {node.choices.map((choice, i) => {
            const hotkey = i < 9 ? String(i + 1) : null;

            const hint = choiceUiHintById.get(choice.id);
            const locked = hint?.locked ?? lockedChoiceFlagById.get(choice.id) ?? false;

            const secretsLocked = locked && isChoiceLockedBySecrets(choice, knownSecrets);

            const repReq = hint?.requiredReputation ?? choice.requiredReputation ?? null;
            const reqFactionName = repReq
              ? factions.find(f => f.id === repReq.factionId)?.name ?? repReq.factionId.replace('-', ' ')
              : null;

            return (
              <motion.button
                key={choice.id}
                type="button"
                aria-disabled={locked}
                aria-keyshortcuts={hotkey ?? undefined}
                onClick={() => requestChoice(choice)}
                className={`group relative overflow-hidden rounded-sm border border-border bg-secondary/35 p-4 text-left font-body text-sm transition-all sm:text-base
                  ${locked
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:border-primary/40 hover:bg-secondary'}
                `}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.25 }}
                whileHover={locked ? {} : { x: 3 }}
              >
                <div className="flex items-start gap-3">
                  {hotkey && (
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border bg-card/60 font-display text-[10px] tracking-wider text-muted-foreground">
                      {hotkey}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-secondary-foreground">{choice.text}</span>

                    {(secretsLocked || (repReq && locked)) && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {repReq && locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display tracking-wider text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            requires {reqFactionName ?? repReq.factionId.replace('-', ' ')} ≥ {repReq.min}
                          </span>
                        )}

                        {secretsLocked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display tracking-wider text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            requires proof
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <span className="absolute left-0 top-0 h-full w-0.5 bg-primary/0 transition-all group-hover:bg-primary/60" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={next => {
        if (!next) {
          setConfirmOpen(false);
          setPendingChoice(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the Hall?</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay in Hall</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChoice}>Leave anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default HubPanel;
