import { DialogueNode, DialogueChoice, Faction } from '@/game/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import { splitWrappedLinesIntoParagraphs, wrapTextLinesJs, wrapTextLinesUqm } from '@/game/engine/uqmTextWrap';
import { isChoiceLocked, isChoiceLockedByExclusiveGroup, isChoiceLockedByHistory, isChoiceLockedBySecrets } from '@/game/choiceLocks';
import { useAudio } from '@/audio/useAudio';
import { Eye, Flame, Leaf, Lock, Shield, Sparkles } from 'lucide-react';
import CommPortrait from '@/components/CommPortrait';
import LorestromePortraitImage from '@/components/LorestromePortraitImage';
import { lorestromeIndexToCell } from '@/game/lorestrome';
import { getPortraitById, getSpeakerPortrait } from '@/game/portraits';
import Tip from '@/ui/tips/Tip';

import type { ChoiceUiHint } from '@/game/engine/conversationEngine';

interface DialoguePanelProps {
  node: DialogueNode;
  onChoice: (choice: DialogueChoice) => void;
  knownSecrets: string[];
  factions: Faction[];
  selectedChoiceIds?: string[];
  playerPortraitId?: string;
  playerName?: string;
  lockedChoices?: boolean[] | null;
  choiceUiHints?: ChoiceUiHint[] | null;
}

const factionLabelColors: Record<string, string> = {
  'iron-pact': 'faction-iron',
  'verdant-court': 'faction-verdant',
  'ember-throne': 'faction-ember',
};

const factionAuraVars: Record<string, string> = {
  'iron-pact': 'var(--faction-iron)',
  'verdant-court': 'var(--faction-verdant)',
  'ember-throne': 'var(--faction-ember)',
};

const factionIcons: Record<string, ComponentType<{ className?: string }>> = {
  'iron-pact': Shield,
  'verdant-court': Leaf,
  'ember-throne': Flame,
};

const DIALOGUE_MAX_COLUMNS = 56;
const CHOICE_MAX_COLUMNS = 52;
const REVEAL_TICK_MS = 28;

const isUserTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

  return el.isContentEditable;
};

const formatSecretLabel = (secret: string) => {
  if (secret.startsWith('proof:')) return secret.slice('proof:'.length).replace(/-/g, ' ');

  const lower = secret.toLowerCase();
  if (lower.includes('ledger')) return 'ledger pages';
  if (lower.includes('manifest')) return 'manifests';
  if (lower.includes('forged') && lower.includes('map')) return 'forged maps';
  if (lower.includes('map') && lower.includes('forg')) return 'forged maps';

  return secret
    .replace(/^(intel|evidence):/i, '')
    .replace(/[-_]/g, ' ')
    .trim();
};

const formatProofRequirement = (choice: Pick<DialogueChoice, 'requiresAllSecrets' | 'requiresAnySecrets'>, known: string[]) => {
  const needsAll = choice.requiresAllSecrets ?? null;
  if (needsAll?.length) {
    const missingAll = needsAll.filter(s => !known.includes(s)).map(formatSecretLabel);
    if (missingAll.length) return missingAll.join(' + ');
  }

  const needsAny = choice.requiresAnySecrets ?? null;
  if (needsAny?.length) {
    const okAny = needsAny.some(s => known.includes(s));
    if (!okAny) return needsAny.map(formatSecretLabel).join(' / ');
  }

  return 'proof';
};

const DialoguePanel = ({ node, onChoice, knownSecrets, factions, selectedChoiceIds = [], playerPortraitId, playerName, lockedChoices, choiceUiHints }: DialoguePanelProps) => {
  const { playSfx } = useAudio();

  const fullText = node.text;

  const [revealedChars, setRevealedChars] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);

  const [dialogueLines, setDialogueLines] = useState<string[]>(() => wrapTextLinesJs('', DIALOGUE_MAX_COLUMNS));
  const [choiceLines, setChoiceLines] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(node.choices.map(c => [c.id, wrapTextLinesJs(c.text, CHOICE_MAX_COLUMNS)] as const))
  );

  const [lockedNudgeId, setLockedNudgeId] = useState<string | null>(null);

  const revealTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);
  const lastVoiceAtRef = useRef(0);

  const visibleText = useMemo(() => fullText.slice(0, revealedChars), [fullText, revealedChars]);

  const choiceUiHintById = useMemo(() => {
    const map = new Map<string, ChoiceUiHint>();
    if (!choiceUiHints?.length) return map;
    node.choices.forEach((choice, idx) => {
      const hint = choiceUiHints[idx];
      if (hint) map.set(choice.id, hint);
    });
    return map;
  }, [node.choices, choiceUiHints]);

  const lockedChoiceFlagById = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!lockedChoices?.length) return map;
    node.choices.forEach((choice, idx) => {
      const locked = lockedChoices[idx];
      if (typeof locked === 'boolean') map.set(choice.id, locked);
    });
    return map;
  }, [node.choices, lockedChoices]);

  const visibleChoices = useMemo(() => {
    if (knownSecrets.includes('override')) return node.choices;

    const candidates = node.choices.filter(choice => {
      if (choice.hideWhenHasAnySecrets?.length) {
        const shouldHide = choice.hideWhenHasAnySecrets.some(s => knownSecrets.includes(s));
        if (shouldHide) return false;
      }

      const secretsLocked = isChoiceLockedBySecrets(choice, knownSecrets);

      if (choice.hideWhenLockedBySecrets && secretsLocked) {
        return false;
      }

      // Hide choices that are locked due to exclusiveGroup (post-decision branch swapping),
      // even if they also have other locks (rep/proof) that would otherwise keep them visible.
      if (isChoiceLockedByExclusiveGroup(choice, selectedChoiceIds)) {
        return false;
      }

      const repReq = choice.requiredReputation ?? null;
      const repLocked = Boolean(
        repReq && (factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity) < repReq.min
      );

      const locked = isChoiceLocked(choice, factions, knownSecrets, selectedChoiceIds);
      if (locked && !repLocked && !secretsLocked) return false;

      return true;
    });

    const undecided = candidates.filter(choice => !isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets));

    // Only hide already-decided responses when the player still has other options in this node.
    return undecided.length ? undecided : candidates;
  }, [factions, knownSecrets, node.choices, selectedChoiceIds]);

  const skipReveal = useCallback(() => {
    playSfx('ui.skip');

    if (revealTimerRef.current != null) {
      window.clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    setRevealedChars(fullText.length);
    setIsRevealing(false);
  }, [fullText.length, playSfx]);

  const nudgeLockedChoice = useCallback((choiceId: string) => {
    playSfx('ui.locked');

    setLockedNudgeId(choiceId);
    if (nudgeTimerRef.current != null) window.clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = window.setTimeout(() => {
      setLockedNudgeId(prev => (prev === choiceId ? null : prev));
      nudgeTimerRef.current = null;
    }, 220);
  }, [playSfx]);

  const voiceSfxId = useMemo(() => (
    node.speakerFaction === 'iron-pact'
      ? 'voice.iron'
      : node.speakerFaction === 'verdant-court'
        ? 'voice.verdant'
        : node.speakerFaction === 'ember-throne'
          ? 'voice.ember'
          : 'voice.narrator'
  ), [node.speakerFaction]);

  useEffect(() => {
    playSfx('ui.page');

    setRevealedChars(0);
    setIsRevealing(true);
    setLockedNudgeId(null);
    setDialogueLines(wrapTextLinesJs('', DIALOGUE_MAX_COLUMNS));

    if (revealTimerRef.current != null) {
      window.clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (nudgeTimerRef.current != null) {
      window.clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }

    const durationMs = Math.min(3200, Math.max(900, fullText.length * 16));
    const steps = Math.max(1, Math.ceil(durationMs / REVEAL_TICK_MS));
    const stepChars = Math.max(1, Math.ceil(fullText.length / steps));

    lastVoiceAtRef.current = 0;

    revealTimerRef.current = window.setInterval(() => {
      setRevealedChars(prev => {
        const next = Math.min(fullText.length, prev + stepChars);

        const chunk = fullText.slice(prev, next);
        if (chunk && /[A-Za-z0-9]/.test(chunk)) {
          const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
          if (now - lastVoiceAtRef.current > 70) {
            playSfx(voiceSfxId);
            lastVoiceAtRef.current = now;
          }
        }

        if (next >= fullText.length) {
          if (revealTimerRef.current != null) {
            window.clearInterval(revealTimerRef.current);
            revealTimerRef.current = null;
          }
          setIsRevealing(false);
        }
        return next;
      });
    }, REVEAL_TICK_MS);

    return () => {
      if (revealTimerRef.current != null) {
        window.clearInterval(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (nudgeTimerRef.current != null) {
        window.clearTimeout(nudgeTimerRef.current);
        nudgeTimerRef.current = null;
      }
    };
  }, [node.id, fullText, playSfx, voiceSfxId]);

  useEffect(() => {
    setDialogueLines(wrapTextLinesJs(visibleText, DIALOGUE_MAX_COLUMNS));

    if (isRevealing) return;

    let cancelled = false;

    void (async () => {
      const lines = await wrapTextLinesUqm(fullText, DIALOGUE_MAX_COLUMNS);
      if (!cancelled) setDialogueLines(lines);
    })();

    return () => {
      cancelled = true;
    };
  }, [visibleText, isRevealing, fullText]);

  useEffect(() => {
    let cancelled = false;

    setChoiceLines(
      Object.fromEntries(node.choices.map(c => [c.id, wrapTextLinesJs(c.text, CHOICE_MAX_COLUMNS)] as const))
    );

    void (async () => {
      const entries = await Promise.all(
        node.choices.map(async c => [c.id, await wrapTextLinesUqm(c.text, CHOICE_MAX_COLUMNS)] as const)
      );
      if (!cancelled) setChoiceLines(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [node.id, node.choices]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (isUserTyping()) return;

      const key = e.key;

      if ((key === ' ' || key === 'Enter') && isRevealing) {
        e.preventDefault();
        skipReveal();
        return;
      }

      if (isRevealing) return;

      if (key >= '1' && key <= '9') {
        const idx = Number(key) - 1;
        const choice = visibleChoices[idx];
        if (!choice) return;

        const alreadyDecided = isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets);

        const hint = choiceUiHintById.get(choice.id);
        const lockedFlag = lockedChoiceFlagById.get(choice.id);

        const locked =
          alreadyDecided
            ? false
            : hint?.locked ?? lockedFlag ?? isChoiceLocked(choice, factions, knownSecrets, selectedChoiceIds);

        if (locked) {
          nudgeLockedChoice(choice.id);
          return;
        }

        playSfx('ui.select');
        onChoice(choice);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [
    isRevealing,
    skipReveal,
    visibleChoices,
    choiceUiHintById,
    lockedChoiceFlagById,
    factions,
    knownSecrets,
    selectedChoiceIds,
    onChoice,
    nudgeLockedChoice,
    playSfx,
  ]);

  const dialogueParagraphs = splitWrappedLinesIntoParagraphs(dialogueLines);

  const auraFromFaction = node.speakerFaction
    ? factionAuraVars[node.speakerFaction] ?? 'var(--gold-glow)'
    : null;
  const SpeakerIcon = node.speakerFaction ? factionIcons[node.speakerFaction] ?? Sparkles : Sparkles;

  const portrait = useMemo(() => getSpeakerPortrait(node.speaker, node.speakerFaction), [node.speaker, node.speakerFaction]);
  const aura = auraFromFaction ?? `var(${portrait.auraVar})`;
  const playerPortraitAsset = useMemo(
    () => (playerPortraitId ? getPortraitById(playerPortraitId) : null),
    [playerPortraitId],
  );

  const isEncounterNode = node.id.startsWith('encounter:');

  const responseLabel = isRevealing
    ? 'Hold—listening…'
    : isEncounterNode
      ? 'Choose an action'
      : 'Choose a response';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={node.id}
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Speaker */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="cc-speaker-sigil flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card"
                style={{ '--cc-aura': aura } as CSSProperties}
              >
                <SpeakerIcon className="h-4 w-4 text-primary" />
              </div>
              {node.speakerFaction && (
                <div className={`absolute -bottom-1 -right-1 h-2 w-2 rounded-full ${factionLabelColors[node.speakerFaction] || ''}`} />
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-display text-sm tracking-widest text-primary uppercase">
                {node.speaker}
              </span>
              <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground/70 uppercase">
                {isRevealing
                  ? 'Press Space to reveal'
                  : isEncounterNode
                    ? 'Press 1–9 to choose'
                    : 'Press 1–9 to respond'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {playerPortraitAsset?.src && (
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="cc-comm-frame relative h-8 w-8 overflow-hidden rounded-sm"
                  style={{ '--cc-aura': 'var(--gold-glow)' } as CSSProperties}
                >
                  {typeof playerPortraitAsset.lorestromeIndex === 'number' ? (
                    <LorestromePortraitImage
                      cell={lorestromeIndexToCell(playerPortraitAsset.lorestromeIndex)}
                      size={96}
                      alt={playerName ?? 'Envoy'}
                      className="absolute inset-0 h-full w-full object-cover opacity-85"
                      objectPosition={playerPortraitAsset.objectPosition}
                    />
                  ) : (
                    <img
                      src={playerPortraitAsset.src}
                      alt={playerName ?? 'Envoy'}
                      className="absolute inset-0 h-full w-full object-cover opacity-85"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="cc-comm-scanlines absolute inset-0" />
                    <div className="cc-dialogue-grain absolute inset-0" />
                    <div className="cc-portrait-vignette absolute inset-0" />
                  </div>
                  <div className="cc-comm-frame-border pointer-events-none absolute inset-0" />
                </div>
                <span className="max-w-36 truncate text-[10px] font-display tracking-[0.2em] text-muted-foreground/70">
                  {playerName?.trim() ? playerName : 'Envoy'}
                </span>
              </div>
            )}

            {node.speakerFaction && (
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-display tracking-[0.2em] text-muted-foreground/70 uppercase">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50" />
                <span>{node.speakerFaction.replace('-', ' ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div
            className="parchment-border relative overflow-hidden rounded-sm bg-card/40 p-4"
            style={{ '--cc-aura': aura } as CSSProperties}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
              <div className="cc-dialogue-aura absolute inset-0 opacity-70" />
              <div className="cc-dialogue-grain absolute inset-0" />
              <div className="cc-comm-scanlines absolute inset-0" />
            </div>

            <div className="relative">
              <div className="mb-2 font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Transmission
              </div>

              <div className="h-72">
                <CommPortrait portrait={portrait} />
              </div>

              {node.speakerFaction && (
                <div className="mt-3 text-[10px] font-display tracking-[0.2em] text-muted-foreground/70 uppercase">
                  {node.speakerFaction.replace('-', ' ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Dialogue text */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => isRevealing && skipReveal()}
              onKeyDown={e => {
                if (!isRevealing) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  skipReveal();
                }
              }}
              className="parchment-border group relative cursor-pointer rounded-sm bg-card/40 p-6 outline-none transition-colors hover:bg-card/55 focus-visible:ring-2 focus-visible:ring-primary/60"
              style={{ '--cc-aura': aura } as CSSProperties}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
                <div className="cc-dialogue-aura absolute inset-0 opacity-70" />
                <div className="cc-dialogue-grain absolute inset-0" />
              </div>

              <div className="relative">
            {dialogueParagraphs.map((paragraphLines, i) => (
              <motion.p
                key={i}
                className="mb-3 font-body text-sm leading-relaxed text-card-foreground last:mb-0 sm:text-base"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
              >
                {paragraphLines.map((line, j) => (
                  <Fragment key={j}>
                    {line}
                    {j < paragraphLines.length - 1 && <br />}
                  </Fragment>
                ))}
              </motion.p>
            ))}

            {isRevealing && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full bg-primary/70"
                    style={{ width: `${Math.min(100, Math.round((revealedChars / Math.max(1, fullText.length)) * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground uppercase">
                  skip
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {responseLabel}
            </span>
            <Tip
              id="choices"
              label="Tip: Choices"
              content={
                isEncounterNode
                  ? 'Encounters often have mechanical outcomes. Some options may require reputation or proof to unlock.'
                  : 'Some responses require reputation or proof to unlock. Locked options will explain what you need.'
              }
              kind="tooltip"
            />
          </div>

          <div className={`flex flex-col gap-2 transition-opacity ${isRevealing ? 'opacity-45 pointer-events-none' : 'opacity-100'}`}>
            {visibleChoices.map((choice, i) => {
              const hint = choiceUiHintById.get(choice.id);

              const alreadyDecided = isChoiceLockedByHistory(choice, selectedChoiceIds, knownSecrets);

              const locked = alreadyDecided
                ? false
                : hint?.locked ?? lockedChoiceFlagById.get(choice.id) ?? isChoiceLocked(choice, factions, knownSecrets, selectedChoiceIds);

              const repReq = hint?.requiredReputation ?? choice.requiredReputation;

              const repLocked = Boolean(
                repReq && (factions.find(f => f.id === repReq.factionId)?.reputation ?? -Infinity) < repReq.min
              );

              const reqFactionName = repReq
                ? factions.find(f => f.id === repReq.factionId)?.name ?? repReq.factionId.replace('-', ' ')
                : null;

              const lines = choiceLines[choice.id] ?? [choice.text];
              const hotkey = i < 9 ? String(i + 1) : null;

              const onSelect = () => {
                if (locked) {
                  nudgeLockedChoice(choice.id);
                  return;
                }
                playSfx('ui.select');
                onChoice(choice);
              };

              const secretsLocked = locked && isChoiceLockedBySecrets(choice, knownSecrets);
              const proofRequirement = secretsLocked ? formatProofRequirement(choice, knownSecrets) : null;
              const historyLocked = alreadyDecided;

              const displayEffects = alreadyDecided
                ? (hint?.effects ?? choice.effects).map(effect => ({ ...effect, reputationChange: 0 }))
                : (hint?.effects ?? choice.effects);

              return (
                <motion.button
                  key={choice.id}
                  type="button"
                  aria-disabled={locked}
                  aria-keyshortcuts={hotkey ?? undefined}
                  title={
                    locked
                      ? repReq
                        ? `Requires ${reqFactionName ?? repReq.factionId.replace('-', ' ')} reputation ≥ ${repReq.min}`
                        : proofRequirement
                          ? `Requires proof: ${proofRequirement}`
                          : undefined
                      : undefined
                  }
                  onClick={onSelect}
                  className={`group relative overflow-hidden rounded-sm border border-border bg-secondary/45 p-4 text-left font-body text-sm transition-all sm:text-base
                    ${locked
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:border-primary/50 hover:bg-secondary'
                    }
                    ${lockedNudgeId === choice.id ? 'cc-choice-nudge' : ''}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.35 }}
                  whileHover={locked ? {} : { x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    {hotkey && (
                      <div
                        className="cc-comm-frame relative mt-0.5 h-6 w-6 shrink-0 overflow-hidden rounded-sm"
                        style={{ '--cc-aura': 'var(--gold-glow)' } as CSSProperties}
                      >
                        {playerPortraitAsset?.src && (
                          typeof playerPortraitAsset.lorestromeIndex === 'number' ? (
                            <LorestromePortraitImage
                              cell={lorestromeIndexToCell(playerPortraitAsset.lorestromeIndex)}
                              size={96}
                              alt={playerName ?? 'You'}
                              className="absolute inset-0 h-full w-full object-cover opacity-80"
                              objectPosition={playerPortraitAsset.objectPosition}
                            />
                          ) : (
                            <img
                              src={playerPortraitAsset.src}
                              alt={playerName ?? 'You'}
                              className="absolute inset-0 h-full w-full object-cover opacity-80"
                            />
                          )
                        )}
                        <div className="pointer-events-none absolute inset-0">
                          <div className="cc-comm-scanlines absolute inset-0" />
                          <div className="cc-dialogue-grain absolute inset-0" />
                          <div className="cc-portrait-vignette absolute inset-0" />
                        </div>
                        <div className="relative flex h-full w-full items-center justify-center bg-background/15 font-display text-[10px] tracking-wider text-muted-foreground">
                          {hotkey}
                        </div>
                        <div className="cc-comm-frame-border pointer-events-none absolute inset-0" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="text-secondary-foreground">
                        {lines.map((line, j) => (
                          <Fragment key={j}>
                            {line}
                            {j < lines.length - 1 && <br />}
                          </Fragment>
                        ))}
                      </span>

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
                            requires {proofRequirement}
                          </span>
                        )}

                        {historyLocked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display tracking-wider text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            already decided
                          </span>
                        )}

                        {displayEffects.map(effect => (
                          <span
                            key={effect.factionId}
                            className={`text-[10px] font-display tracking-wider ${
                              effect.reputationChange > 0
                                ? 'text-primary'
                                : effect.reputationChange < 0
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {effect.factionId.replace('-', ' ')} {effect.reputationChange > 0 ? '▲' : effect.reputationChange < 0 ? '▼' : '—'}
                          </span>
                        ))}

                        {(hint?.revealsInfo ?? choice.revealsInfo) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-display tracking-wider text-accent">
                            <Eye className="h-3 w-3" />
                            intel
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="absolute left-0 top-0 h-full w-0.5 bg-primary/0 transition-all group-hover:bg-primary/60" />

                  {!locked && (
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="cc-choice-sheen absolute inset-0" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DialoguePanel;
