import { motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import type { DialogueChoice, DialogueNode } from '@/game/types';
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
  crisisPending?: boolean;
  crisisTurnsLeft?: number | null;
}

const HubPanel = ({ node, onChoice, crisisPending = false, crisisTurnsLeft = null }: HubPanelProps) => {
  const paragraphs = node.text.split(/\n\n+/g).filter(Boolean);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<DialogueChoice | null>(null);

  const confirmDescription = useMemo(() => {
    if (!crisisPending) return '';

    const suffix =
      crisisTurnsLeft !== null && crisisTurnsLeft >= 0
        ? ` It expires in ${crisisTurnsLeft} turn${crisisTurnsLeft === 1 ? '' : 's'}.`
        : '';

    return `A crisis is pending in the Hall. You can address it immediately without advancing time.${suffix}`;
  }, [crisisPending, crisisTurnsLeft]);

  const requestChoice = useCallback((choice: DialogueChoice) => {
    if (!crisisPending) {
      onChoice(choice);
      return;
    }

    setPendingChoice(choice);
    setConfirmOpen(true);
  }, [crisisPending, onChoice]);

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

        {crisisPending && (
          <div className="text-xs text-muted-foreground">
            A crisis is pending in the Hall. You can still travel, but the crisis will remain unresolved.
          </div>
        )}

        <div className="flex flex-col gap-2">
          {node.choices.map((choice, i) => {
            const hotkey = i < 9 ? String(i + 1) : null;

            return (
              <motion.button
                key={choice.id}
                type="button"
                aria-keyshortcuts={hotkey ?? undefined}
                onClick={() => requestChoice(choice)}
                className="group relative overflow-hidden rounded-sm border border-border bg-secondary/35 p-4 text-left font-body text-sm transition-all sm:text-base hover:border-primary/40 hover:bg-secondary"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.25 }}
                whileHover={{ x: 3 }}
              >
                <div className="flex items-start gap-3">
                  {hotkey && (
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border bg-card/60 font-display text-[10px] tracking-wider text-muted-foreground">
                      {hotkey}
                    </div>
                  )}
                  <span className="text-secondary-foreground">{choice.text}</span>
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
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
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
