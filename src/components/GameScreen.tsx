import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAmbience } from '@/audio/useAmbience';
import { GameState, DialogueChoice } from '@/game/types';
import { SaveSlotInfo } from '@/game/storage';
import DialoguePanel from '@/components/DialoguePanel';
import ManagementPanel from '@/components/ManagementPanel';
import FactionPanel from '@/components/FactionPanel';
import InfoPanel from '@/components/InfoPanel';
import GameMenu from '@/components/GameMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BUILD_ID } from '@/lib/buildInfo';
import { getChapter } from '@/game/chapters';

import type { ChoiceUiHint } from '@/game/engine/conversationEngine';

interface GameScreenProps {
  state: GameState;
  engineLabel: string;
  makeChoice: (choice: DialogueChoice) => void;
  endTurn: () => void;
  takeManagementAction: (actionId: string) => void;
  resetGame: () => void;
  saveSlots: SaveSlotInfo[];
  saveToSlot: (slotId: number) => void;
  loadFromSlot: (slotId: number) => void;
  deleteSlot: (slotId: number) => void;
  exitToTitle: () => void;
  enterPendingEncounter: () => void;
  returnToHub: () => void;
  choiceLockedFlags: boolean[] | null;
  choiceUiHints: ChoiceUiHint[] | null;
}

type GameMenuTab = 'save' | 'load' | 'campaign' | 'about';

const isUserTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

  return el.isContentEditable;
};

const GameScreen = ({
  state,
  engineLabel,
  makeChoice,
  endTurn,
  takeManagementAction,
  resetGame,
  saveSlots,
  saveToSlot,
  loadFromSlot,
  deleteSlot,
  exitToTitle,
  enterPendingEncounter,
  returnToHub,
  choiceLockedFlags,
  choiceUiHints,
}: GameScreenProps) => {
  useAmbience('game');

  const conversationEnded = !state.currentDialogue;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<GameMenuTab>('save');

  const chapter = getChapter(state.chapterId);
  const isInHub = state.currentDialogue?.id === chapter.hubNodeId;
  const focusMode = !conversationEnded && !isInHub;

  const canAddressEncounter = Boolean(state.pendingEncounter && isInHub);

  const encounterTurnsLeft = state.pendingEncounter ? state.pendingEncounter.expiresOnTurn - state.turnNumber : null;
  const encounterBadgeVariant: 'default' | 'secondary' | 'destructive' =
    encounterTurnsLeft !== null && encounterTurnsLeft <= 1 ? 'destructive' : focusMode ? 'secondary' : 'default';

  const concordButtonVariant: 'secondary' | 'destructive' =
    encounterTurnsLeft !== null && encounterTurnsLeft <= 1 ? 'destructive' : 'secondary';

  const scrollToManagement = () => {
    document.getElementById('cc-management-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;

      const key = e.key?.toLowerCase();
      if (!key) return;

      if (isUserTyping()) return;

      const mod = e.ctrlKey || e.metaKey;

      if (key === 'escape') {
        setMenuOpen(prev => !prev);
        return;
      }

      if (mod && key === 's') {
        e.preventDefault();
        setMenuTab('save');
        setMenuOpen(true);
        return;
      }

      if (mod && key === 'o') {
        e.preventDefault();
        setMenuTab('load');
        setMenuOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(900px circle at 50% -10%, hsl(var(--gold-glow) / 0.12), transparent 55%), radial-gradient(700px circle at 12% 110%, hsl(var(--faction-verdant) / 0.08), transparent 60%), radial-gradient(800px circle at 110% 40%, hsl(var(--faction-ember) / 0.08), transparent 60%)',
        }}
      />
      <div className="pointer-events-none fixed inset-0 opacity-25 cc-dialogue-grain" />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-6 py-3 backdrop-blur-sm">
        <h1 className="font-display text-sm tracking-[0.4em] gold-text-gradient uppercase">
          Crown & Concord
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-display text-xs text-muted-foreground">Turn {state.turnNumber}</span>

          {focusMode && (
            <span className="hidden md:inline font-display text-[10px] tracking-[0.22em] text-muted-foreground/70 uppercase">
              AP {state.management.apRemaining}/{state.management.apMax} • Coin {state.resources.coin} • Influence {state.resources.influence} • Supplies {state.resources.supplies} • Intel {state.resources.intel}
            </span>
          )}

          {state.pendingEncounter && (
            <Badge
              variant={encounterBadgeVariant}
              className="font-display text-[10px] tracking-[0.22em] uppercase"
              title={
                encounterTurnsLeft !== null && encounterTurnsLeft >= 0
                  ? `Pending encounter (expires in ${encounterTurnsLeft} turn${encounterTurnsLeft === 1 ? '' : 's'})`
                  : 'Pending encounter'
              }
            >
              Encounter
              {encounterTurnsLeft !== null && encounterTurnsLeft >= 0 ? ` ${encounterTurnsLeft}T` : ''}
            </Badge>
          )}

          {isInHub ? (
            <Button
              onClick={endTurn}
              variant="outline"
              className="h-8 rounded-sm border-primary/20 px-3 font-display text-[11px] tracking-[0.22em] uppercase"
            >
              End Turn
            </Button>
          ) : !conversationEnded ? (
            <Button
              onClick={returnToHub}
              variant={concordButtonVariant}
              className="h-8 rounded-sm px-3 font-display text-[11px] tracking-[0.22em] uppercase"
            >
              Concord Hall
            </Button>
          ) : null}

          {!focusMode && (
            <>
              <span className="font-display text-xs text-muted-foreground">Envoy: {state.player.name}</span>
              <span className="font-display text-[10px] tracking-[0.22em] text-muted-foreground/70 uppercase">
                Engine: {engineLabel}
              </span>
              <span className="font-display text-[10px] tracking-[0.22em] text-muted-foreground/60 uppercase">
                Build: {BUILD_ID}
              </span>
            </>
          )}

          <GameMenu
            slots={saveSlots}
            onSave={saveToSlot}
            onLoad={loadFromSlot}
            onDelete={deleteSlot}
            engineLabel={engineLabel}
            onExitToTitle={exitToTitle}
            onRestartCampaign={resetGame}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            activeTab={menuTab}
            onActiveTabChange={setMenuTab}
          />
        </div>
      </header>

      <div className={focusMode ? "mx-auto flex max-w-3xl flex-col gap-6 p-6" : "mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row"}>
        {!focusMode && (
          <motion.aside className="w-full shrink-0 lg:w-72" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div id="cc-management-panel" className="flex flex-col gap-6">
              <ManagementPanel state={state} onTakeAction={takeManagementAction} actionsEnabled={isInHub} />
              <FactionPanel factions={state.factions} />
            </div>
          </motion.aside>
        )}

        <main className="flex-1 min-w-0">
          {conversationEnded ? (
            <motion.div className="flex flex-col items-center justify-center gap-6 py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-display text-lg text-muted-foreground text-center">The conversation has reached its conclusion.</p>
              <p className="font-body text-sm italic text-muted-foreground/60 text-center max-w-md">Your choices have shaped the realm's future. The factions remember.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={returnToHub}
                  className="h-auto rounded-sm px-6 py-2 font-display text-sm tracking-[0.2em] uppercase"
                >
                  Return to Concord Hall
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="h-auto rounded-sm border-primary/30 px-6 py-2 font-display text-sm tracking-[0.2em] text-primary transition-colors hover:border-primary/60 hover:text-gold-glow"
                >
                  Begin Again
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {isInHub && (state.pendingEncounter || state.management.apRemaining > 0) && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="parchment-border rounded-sm bg-card/40 shadow-none">
                    <div className="flex flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                            Agenda
                          </div>

                          {state.pendingEncounter ? (
                            <>
                              <div className="mt-1 font-display text-xs tracking-[0.2em] text-primary uppercase">
                                Pending encounter
                              </div>
                              <div className="mt-1 text-sm text-card-foreground">
                                {state.pendingEncounter.title}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {state.pendingEncounter.description}
                              </div>
                              <div
                                className={`mt-2 text-[11px] ${
                                  encounterTurnsLeft !== null && encounterTurnsLeft <= 1
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {encounterTurnsLeft !== null && encounterTurnsLeft >= 0
                                  ? `Expires in ${encounterTurnsLeft} turn${encounterTurnsLeft === 1 ? '' : 's'} (turn ${state.pendingEncounter.expiresOnTurn})`
                                  : `Expires on turn ${state.pendingEncounter.expiresOnTurn}`}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mt-1 font-display text-xs tracking-[0.2em] text-primary uppercase">
                                Actions available
                              </div>
                              <div className="mt-1 text-sm text-card-foreground">
                                You have {state.management.apRemaining} AP remaining.
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Spend AP in Management to advance projects and directives.
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {state.pendingEncounter ? (
                            <Button
                              size="sm"
                              variant={encounterTurnsLeft !== null && encounterTurnsLeft <= 1 ? 'destructive' : 'default'}
                              onClick={enterPendingEncounter}
                              disabled={!canAddressEncounter}
                              title={!canAddressEncounter ? 'Already addressing this encounter' : undefined}
                            >
                              Address
                            </Button>
                          ) : state.management.apRemaining > 0 ? (
                            <Button size="sm" variant="secondary" onClick={scrollToManagement}>
                              Management
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              <DialoguePanel
                node={state.currentDialogue!}
                onChoice={makeChoice}
                knownSecrets={state.knownSecrets}
                factions={state.factions}
                selectedChoiceIds={state.selectedChoiceIds}
                playerName={state.player.name}
                playerPortraitId={state.player.portraitId}
                lockedChoices={choiceLockedFlags}
                choiceUiHints={choiceUiHints}
              />
            </>
          )}
        </main>

        {!focusMode && (
          <motion.aside className="w-full shrink-0 lg:w-72" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <InfoPanel
              currentDialogue={state.currentDialogue}
              knownSecrets={state.knownSecrets}
              turnNumber={state.turnNumber}
              log={state.log}
              world={state.world}
              factions={state.factions}
              pendingEncounter={state.pendingEncounter}
              player={state.player}
            />
          </motion.aside>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
