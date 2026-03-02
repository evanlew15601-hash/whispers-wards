import { Faction } from '@/game/types';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FactionPanelProps {
  factions: Faction[];
}

const factionColorMap = {
  iron: 'faction-iron',
  verdant: 'faction-verdant',
  ember: 'faction-ember',
} as const;

const FactionPanel = ({ factions }: FactionPanelProps) => {
  const [openById, setOpenById] = useState<Record<string, boolean>>({});

  const sorted = useMemo(
    () => [...factions].sort((a, b) => b.reputation - a.reputation),
    [factions],
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-sm tracking-[0.3em] text-muted-foreground uppercase">
        Factions
      </h2>

      {sorted.map((faction, i) => {
        const open = openById[faction.id] ?? false;

        return (
          <Collapsible
            key={faction.id}
            open={open}
            onOpenChange={next => setOpenById(prev => ({ ...prev, [faction.id]: next }))}
          >
            <motion.div
              className="parchment-border rounded-sm bg-card p-4"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`h-3 w-3 shrink-0 rounded-full ${factionColorMap[faction.color]}`} />
                  <h3 className="truncate font-display text-sm font-semibold text-card-foreground">
                    {faction.name}
                  </h3>
                </div>

                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-secondary/30 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={open ? `Collapse ${faction.name}` : `Expand ${faction.name}`}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
              </div>

              {/* Reputation bar */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Hostile</span>
                  <span className="font-semibold text-card-foreground">
                    {faction.reputation > 0 ? '+' : ''}{faction.reputation}
                  </span>
                  <span>Allied</span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-muted">
                  <motion.div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: '50%',
                      width: `${Math.abs(faction.reputation) / 2}%`,
                      transform: faction.reputation < 0 ? 'translateX(-100%)' : 'translateX(0)',
                      backgroundColor: faction.reputation >= 0
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--destructive))',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(faction.reputation) / 2}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/30" />
                </div>
              </div>

              <CollapsibleContent>
                <div className="mt-3">
                  <p className="text-xs italic text-muted-foreground">{faction.motto}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {faction.traits.map(trait => (
                      <span
                        key={trait}
                        className="rounded-sm bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </motion.div>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default FactionPanel;
