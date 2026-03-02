import { useState } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { GameState } from '@/game/types';

import { MANAGEMENT_ACTIONS, getManagementActionAvailability } from '@/game/management/actions';
import { getChapter } from '@/game/chapters';

interface ManagementPanelProps {
  state: GameState;
  onTakeAction: (actionId: string) => void;
  actionsEnabled?: boolean;
}

const formatCost = (state: GameState, resourceId: keyof GameState['resources'], amount: number) => {
  const have = state.resources[resourceId] ?? 0;
  return `${resourceId} ${have}/${amount}`;
};

const ManagementPanel = ({ state, onTakeAction, actionsEnabled = true }: ManagementPanelProps) => {
  const ap = state.management;
  const [showUnavailableActions, setShowUnavailableActions] = useState(false);

  const chapter = getChapter(state.chapterId);
  const allowedPools = new Set([chapter.managementPoolId, chapter.projectPoolId]);

  // Project actions (accelerate/pause/resume/cancel) are rendered in the Projects panel.
  // Keep the general Actions list focused on non-project actions + project starts.
  const availableActions = MANAGEMENT_ACTIONS.filter(a => allowedPools.has(a.poolId)).filter(a => {
    if (a.category !== 'projects') return true;

    const start = a.effects.find(e => e.kind === 'project:start');
    if (!start) return false;

    // Hide project start actions when the project is already underway.
    const alreadyUnderway = state.projects.some(
      p => p.templateId === start.templateId && p.status !== 'cancelled' && p.status !== 'completed'
    );
    return !alreadyUnderway;
  });

  const actionCards = availableActions.map(action => ({
    action,
    availability: getManagementActionAvailability(state, action),
  }));

  const visibleActionCards = showUnavailableActions
    ? actionCards
    : actionCards.filter(a => a.availability.available);

  const actionsByCategory = (['projects', 'diplomacy', 'routes'] as const)
    .map(category => ({
      category,
      label: category === 'projects' ? 'Projects' : category === 'diplomacy' ? 'Diplomacy' : 'Routes',
      actions: visibleActionCards.filter(a => a.action.category === category),
    }))
    .filter(g => g.actions.length);

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
        <div className="mb-3 font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Projects</div>
        {state.projects.length ? (
          <div className="flex flex-col gap-2">
            {state.projects.map(p => {
              const accelerateId = `projects:accelerate:${p.templateId}`;
              const pauseId = `projects:pause:${p.templateId}`;
              const resumeId = `projects:resume:${p.templateId}`;
              const cancelId = `projects:cancel:${p.templateId}`;

              const accelerate = MANAGEMENT_ACTIONS.find(a => a.id === accelerateId);
              const pause = MANAGEMENT_ACTIONS.find(a => a.id === pauseId);
              const resume = MANAGEMENT_ACTIONS.find(a => a.id === resumeId);
              const cancel = MANAGEMENT_ACTIONS.find(a => a.id === cancelId);

              const accelerateAvail = accelerate ? getManagementActionAvailability(state, accelerate) : null;
              const pauseAvail = pause ? getManagementActionAvailability(state, pause) : null;
              const resumeAvail = resume ? getManagementActionAvailability(state, resume) : null;
              const cancelAvail = cancel ? getManagementActionAvailability(state, cancel) : null;

              return (
                <div key={p.id} className="rounded-sm border border-border bg-secondary/20 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-xs tracking-[0.18em] text-card-foreground uppercase">
                        {p.title}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{p.description}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-display text-[10px] tracking-[0.22em] text-muted-foreground uppercase">{p.status}</div>
                      <div className="text-xs text-card-foreground">{p.remainingTurns}T</div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {accelerate && (
                      <Button
                        size="sm"
                        variant={actionsEnabled && accelerateAvail?.available ? 'default' : 'secondary'}
                        disabled={!actionsEnabled || !accelerateAvail?.available}
                        onClick={() => onTakeAction(accelerate.id)}
                        title={!actionsEnabled ? 'Return to Concord Hall to manage projects.' : !accelerateAvail?.available ? accelerateAvail?.reason : undefined}
                      >
                        Accelerate
                      </Button>
                    )}
                    {pause && (
                      <Button
                        size="sm"
                        variant={actionsEnabled && pauseAvail?.available ? 'default' : 'secondary'}
                        disabled={!actionsEnabled || !pauseAvail?.available}
                        onClick={() => onTakeAction(pause.id)}
                        title={!actionsEnabled ? 'Return to Concord Hall to manage projects.' : !pauseAvail?.available ? pauseAvail?.reason : undefined}
                      >
                        Pause
                      </Button>
                    )}
                    {resume && (
                      <Button
                        size="sm"
                        variant={actionsEnabled && resumeAvail?.available ? 'default' : 'secondary'}
                        disabled={!actionsEnabled || !resumeAvail?.available}
                        onClick={() => onTakeAction(resume.id)}
                        title={!actionsEnabled ? 'Return to Concord Hall to manage projects.' : !resumeAvail?.available ? resumeAvail?.reason : undefined}
                      >
                        Resume
                      </Button>
                    )}
                    {cancel && (
                      <Button
                        size="sm"
                        variant={actionsEnabled && cancelAvail?.available ? 'destructive' : 'secondary'}
                        disabled={!actionsEnabled || !cancelAvail?.available}
                        onClick={() => onTakeAction(cancel.id)}
                        title={!actionsEnabled ? 'Return to Concord Hall to manage projects.' : !cancelAvail?.available ? cancelAvail?.reason : undefined}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No projects underway.</div>
        )}
      </div>

      <div className="parchment-border rounded-sm bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="font-display text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Actions</div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowUnavailableActions(v => !v)}
            className="h-7 px-2 text-[11px]"
          >
            {showUnavailableActions ? 'Hide unavailable' : 'Show unavailable'}
          </Button>
        </div>
        {!actionsEnabled && (
          <div className="mb-2 text-xs text-muted-foreground">Return to Concord Hall to take actions.</div>
        )}

        {actionsByCategory.length ? (
          <Accordion type="multiple" defaultValue={[actionsByCategory[0].category]} className="w-full">
            {actionsByCategory.map(group => (
              <AccordionItem key={group.category} value={group.category} className="border-border">
                <AccordionTrigger className="py-2 font-display text-xs tracking-[0.18em] text-card-foreground uppercase">
                  {group.label} <span className="ml-2 text-[10px] text-muted-foreground">({group.actions.length})</span>
                </AccordionTrigger>
                <AccordionContent className="pt-1">
                  <div className="flex flex-col gap-2">
                    {group.actions.map(({ action, availability }, i) => {
                      const disabled = !actionsEnabled || !availability.available;

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
                              {showUnavailableActions && !availability.available && (
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-xs text-muted-foreground">
            {showUnavailableActions ? 'No actions available.' : 'No actions available (toggle "Show unavailable" to view all).'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementPanel;
