import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DialogueNode, Faction, PlayerProfile, WorldState, SecondaryEncounter } from '@/game/types';
import LorestromePortraitImage from '@/components/LorestromePortraitImage';
import { lorestromeIndexToCell } from '@/game/lorestrome';
import { getPortraitById } from '@/game/portraits';
import { getLeadHintsForCurrentDialogue } from '@/game/leads';
import WorldMap from '@/components/WorldMap';
import Tip from '@/ui/tips/Tip';
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

  const crisisExpiryPreview = useMemo(() => {
    if (!pendingEncounter) return null;

    const kind = pendingEncounter.kind ?? 'summit';
    const routeId = pendingEncounter.routeId;
    const regionId = pendingEncounter.regionId;

    const aId = pendingEncounter.relatedFactions[0] ?? null;
    const bId = pendingEncounter.relatedFactions[1] ?? null;

    const nameOf = (id: string | null) => {
      if (!id) return 'Unknown';
      return factions.find(f => f.id === id)?.name ?? id;
    };

    const parts: string[] = [];
    if (aId && bId) parts.push(`+5 tension (${nameOf(aId)} vs ${nameOf(bId)})`);
    else parts.push('+5 tension');

    if ((kind === 'embargo' || kind === 'raid') && routeId) {
      const route = world.tradeRoutes[routeId];
      if (route) {
        parts.push(`Trade route: ${route.name} becomes ${kind === 'embargo' ? 'embargoed' : 'raided'}`);
      }
    }

    if (kind === 'skirmish' && regionId) {
      const region = world.regions[regionId];
      if (region) parts.push(`Region: ${region.name} becomes contested`);
    }

    return `If ignored: ${parts.join(' · ')}`;
  }, [factions, pendingEncounter, world.regions, world.tradeRoutes]);

  const playerPortrait = player ? getPortraitById(player.portraitId) : null;

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
              {playerPortrait?.src ? (
                typeof playerPortrait.lorestromeIndex === 'number' ? (
                  <LorestromePortraitImage
                    cell={lorestromeIndexToCell(playerPortrait.lorestromeIndex)}
                    size={96}
                    alt={player.name}
                    className="h-full w-full object-cover"
                    objectPosition={playerPortrait.objectPosition}
                  />
                ) : (
                  <img
                    src={playerPortrait.src}
                    alt={player.name}
                    className="h-full w-full object-cover"
                  />
                )
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
              <div className="flex items-center justify-between gap-2">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="group flex flex-1 items-center justify-between gap-3"
                    aria-label="Toggle crisis"
                  >
                    <h3 className="flex items-center gap-2 font-display text-xs tracking-[0.2em] text-primary uppercase">
                      <Swords className="h-4 w-4" aria-hidden="true" />
                      Crisis pending
                    </h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>

                <Tip
                  id="pending-encounter"
                  label="Tip: Crisis"
                  content={
                    'A crisis can be addressed immediately from the Hall without advancing time. If it expires, tensions rise and the situation may worsen.'
                  }
                />
              </div>

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
                {log.map((entry, i) => {
                  const intelPrefix = '[INTEL] Secret learned: ';
                  const isIntelLearned = entry.startsWith(intelPrefix);
                  const intelBody = isIntelLearned ? entry.slice(intelPrefix.length) : null;

                  return (
                    <p
                      key={i}
                      className={`font-body text-xs ${
                        entry.startsWith('>')
                          ? 'text-primary/80 italic'
                          : entry.startsWith('[EVT]')
                          ? 'text-accent font-semibold'
                          : entry.startsWith('[INTEL]')
                          ? 'text-accent font-semibold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {isIntelLearned ? (
                        <span className="inline-flex items-start gap-1.5">
                          <Eye className="mt-0.5 h-3 w-3" aria-hidden="true" />
                          <span>
                            Intel: <span className="text-card-foreground">{intelBody}</span>
                          </span>
                        </span>
                      ) : (
                        entry
                      )}
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
