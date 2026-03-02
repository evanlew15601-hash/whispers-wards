import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DialogueNode, Faction, PlayerProfile, WorldState, SecondaryEncounter } from '@/game/types';
import { describeExpiredEncounterConsequence } from '@/game/encounters';
import { getPortraitById } from '@/game/portraits';
import { getLeadHintsForCurrentDialogue } from '@/game/leads';
import WorldMap from '@/components/WorldMap';
import Tip from '@/ui/tips/Tip';
import { getTopTensionPairs } from '@/game/tension';
import { parseLogLine } from '@/game/logging';
import { ChevronDown, Compass, Eye, Swords } from 'lucide-react';

interface InfoPanelProps {
  currentDialogue: DialogueNode | null;
  knownSecrets: string[];
  turnNumber: number;
  log: string[];
  world: WorldState;
  factions: Faction[];
  pendingEncounter: SecondaryEncounter | null;
  player?: PlayerProfile;
}

const InfoPanel = (
  { currentDialogue, knownSecrets, turnNumber, log, world, factions, pendingEncounter, player }: InfoPanelProps,
) => {
  const encounterTurnsLeft = pendingEncounter ? pendingEncounter.expiresOnTurn - turnNumber : null;
  const leadHints = getLeadHintsForCurrentDialogue(currentDialogue, knownSecrets);

  const pendingUrgent = encounterTurnsLeft !== null && encounterTurnsLeft <= 1;

  const tensionHotspots = useMemo(() => {
    return getTopTensionPairs(world, factions, 3);
  }, [factions, world]);

  const crisisExpiryPreview = useMemo(() => {
    if (!pendingEncounter) return null;

    const factionNameById = Object.fromEntries(factions.map(f => [f.id, f.name] as const));

    return describeExpiredEncounterConsequence({
      world,
      encounter: pendingEncounter,
      // Deterministic preview only; this value only affects duration bookkeeping for route effects.
      turnNumber: turnNumber + 1,
      factionNameById,
    });
  }, [factions, pendingEncounter, turnNumber, world]);

  return (
    <Tabs defaultValue="chronicle" className="flex flex-col gap-4">
      {/* Turn counter */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm tracking-[0.3em] text-muted-foreground uppercase">
          Info
        </h2>
        <span className="font-display text-xs text-primary">
          Turn {turnNumber}
        </span>
      </div>

      {player && (
        <div className="parchment-border rounded-sm bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-sm border border-border bg-secondary/40">
              {getPortraitById(player.portraitId)?.src ? (
                <img
                  src={getPortraitById(player.portraitId)!.src}
                  alt={player.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    {player.name.slice(0, 1)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                Envoy
              </div>
              <div className="truncate text-sm text-card-foreground">
                {player.name} <span className="text-muted-foreground">({player.pronouns})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <TabsList className="w-full">
        <TabsTrigger value="chronicle" className="flex-1 font-display text-xs tracking-[0.2em] uppercase">
          Chronicle
        </TabsTrigger>
        <TabsTrigger value="world" className="flex-1 font-display text-xs tracking-[0.2em] uppercase">
          World Map
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chronicle" className="mt-0 flex flex-col gap-4">
        {/* Leads */}
        {leadHints.length > 0 && (
          <Collapsible defaultOpen={true}>
            <div className="parchment-border rounded-sm bg-card p-4">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-3"
                  aria-label="Toggle leads"
                >
                  <h3 className="flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    Leads
                  </h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  Some arguments will land better with documentation. These are plausible threads—not instructions.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {leadHints.map((hint, i) => (
                    <motion.p
                      key={hint}
                      className="font-body text-xs italic text-card-foreground/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      • {hint}
                    </motion.p>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Intelligence */}
        {knownSecrets.length > 0 && (
          <Collapsible defaultOpen={false}>
            <div className="parchment-border rounded-sm bg-card p-4">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-3"
                  aria-label="Toggle intelligence"
                >
                  <h3 className="flex items-center gap-2 font-display text-xs tracking-[0.2em] text-accent uppercase">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    Intelligence ({knownSecrets.length})
                  </h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-3 flex flex-col gap-2">
                  {knownSecrets.map((secret, i) => (
                    <motion.p
                      key={i}
                      className="font-body text-xs italic text-card-foreground/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      • {secret}
                    </motion.p>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Crisis */}
        {pendingEncounter && (
          <Collapsible defaultOpen={pendingUrgent}>
            <div className={`parchment-border rounded-sm bg-card p-4 ${pendingUrgent ? 'ring-1 ring-destructive/20' : ''}`}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-3"
                  aria-label="Toggle crisis"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="flex items-center gap-2 font-display text-xs tracking-[0.2em] text-primary uppercase">
                      <Swords className="h-4 w-4" aria-hidden="true" />
                      Crisis pending
                    </h3>
                    <Tip
                      id="pending-encounter"
                      label="Tip: Crisis"
                      content={
                        'A crisis can be addressed immediately from the Hall without advancing time. If it expires, tensions rise and the situation may worsen.'
                      }
                    />
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-2">
                  <div className="text-sm text-card-foreground">{pendingEncounter.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{pendingEncounter.description}</div>

                  <div
                    className={`mt-2 text-[11px] ${
                      encounterTurnsLeft !== null && encounterTurnsLeft <= 1 ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {encounterTurnsLeft !== null && encounterTurnsLeft >= 0
                      ? `Expires in ${encounterTurnsLeft} turn${encounterTurnsLeft === 1 ? '' : 's'} (turn ${pendingEncounter.expiresOnTurn})`
                      : `Expires on turn ${pendingEncounter.expiresOnTurn}`}
                  </div>

                  {crisisExpiryPreview && (
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      {crisisExpiryPreview}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Tension hotspots */}
        {tensionHotspots.length > 0 && (
          <div className="parchment-border rounded-sm bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Tension hotspots
                </h3>
                <Tip
                  id="tension"
                  label="Tip: Tension"
                  content={
                    'Tension is a 0–100 pressure gauge between factions. Higher tension makes raids, embargoes, and skirmishes more likely. 0–39 Calm, 40–69 Strained, 70+ Volatile.'
                  }
                />
              </div>
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Top 3</span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {tensionHotspots.map(pair => (
                <div key={`${pair.aId}:${pair.bId}`} className="flex items-center justify-between gap-2 text-[11px]">
                  <div className="min-w-0 truncate text-muted-foreground">
                    {pair.aName} ↔ {pair.bName}
                  </div>
                  <div className="shrink-0 font-display text-[10px] tracking-[0.2em] text-primary uppercase">
                    {pair.value} {pair.tier}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event log */}
        <Collapsible defaultOpen={true}>
          <div className="parchment-border rounded-sm bg-card p-4">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-3"
                aria-label="Toggle event log"
              >
                <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Event Log
                </h3>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mt-3 flex max-h-48 flex-col gap-1.5 overflow-y-auto">
                {log.map((raw, i) => {
                  const entry = parseLogLine(raw);

                  const className =
                    entry.kind === 'choice'
                      ? 'text-primary/80 italic'
                      : entry.kind === 'event'
                        ? 'text-accent font-semibold'
                        : entry.kind === 'secret'
                          ? 'text-accent/80'
                          : entry.kind === 'warning'
                            ? 'text-destructive'
                            : entry.kind === 'income'
                              ? 'text-primary/80'
                              : 'text-muted-foreground';

                  return (
                    <p key={i} className={`font-body text-xs ${className}`}>
                      {entry.raw}
                    </p>
                  );
                })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </TabsContent>

      <TabsContent value="world" className="mt-0">
        <WorldMap world={world} factions={factions} highlightEncounter={pendingEncounter ?? null} />
      </TabsContent>
    </Tabs>
  );
};

export default InfoPanel;
