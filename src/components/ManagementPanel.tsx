import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { GameState } from '@/game/types';

import { MANAGEMENT_ACTIONS, getManagementActionAvailability } from '@/game/management/actions';

interface ManagementPanelProps {
  state: GameState;
  onTakeAction: (actionId: string) => void;
}

const formatCost = (state: GameState, resourceId: keyof GameState['resources'], amount: number) => {
  const have = state.resources[resourceId] ?? 0;
  return `${resourceId} ${have}/${amount}`;
};

const ManagementPanel = ({ state, onTakeAction }: ManagementPanelProps) => {
  const ap = state.management;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm tracking-[0.3em] text-muted-foreground uppercase">
          Management
        </h2>
        <span className="font-display text-xs text-primary">AP {ap.apRemaining}/{ap.apMax}</span>
      </div>

      <div className="parchment-border rounded-sm bg-card p-4">
        <div className="mb-3 font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Resources</div>
        <div className="grid grid-cols-2 gap-2">
          {(['coin', 'influence', 'supplies', 'intel'] as const).map(k => (
            <div key={k} className="rounded-sm bg-secondary/40 px-2 py-1">
              <div className="font-display text-[10px] tracking-[0.22em] text-muted-foreground uppercase">{k}</div>
              <div className="text-sm text-card-foreground">{state.resources[k]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="parchment-border rounded-sm bg-card p-4">
        <div className="mb-3 font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Actions</div>
        <div className="flex flex-col gap-2">
          {MANAGEMENT_ACTIONS.map((action, i) => {
            const availability = getManagementActionAvailability(state, action);
            const disabled = !availability.available;

            const costLabel = action.costs?.length
              ? action.costs.map(c => formatCost(state, c.resourceId, c.amount)).join(' · ')
              : null;

            return (
              <motion.div
                key={action.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i, duration: 0.25 }}
                className="rounded-sm border border-border bg-secondary/20 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-xs tracking-[0.18em] text-card-foreground uppercase">
                      {action.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{action.description}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      <span className="font-display tracking-[0.18em] uppercase">Cost:</span>{' '}
                      {action.apCost} AP
                      {costLabel ? ` · ${costLabel}` : ''}
                      {action.cooldownTurns ? ` · cooldown ${action.cooldownTurns}` : ''}
                    </div>
                    {disabled && (
                      <div className="mt-1 text-[11px] text-destructive">
                        {availability.reason}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant={disabled ? 'secondary' : 'default'}
                    disabled={disabled}
                    onClick={() => onTakeAction(action.id)}
                    className="shrink-0"
                  >
                    Do
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagementPanel;
