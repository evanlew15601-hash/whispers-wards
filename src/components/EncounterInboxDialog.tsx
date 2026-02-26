import { SecondaryEncounter } from '@/game/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EncounterInboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encounters: SecondaryEncounter[];
  turnNumber: number;
  onSelectEncounter: (encounterId: string) => void;
}

const EncounterInboxDialog = ({ open, onOpenChange, encounters, turnNumber, onSelectEncounter }: EncounterInboxDialogProps) => {
  const sorted = encounters
    .slice()
    .sort((a, b) => (a.expiresOnTurn - b.expiresOnTurn) || a.id.localeCompare(b.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display tracking-[0.2em] uppercase">Pending Encounters</DialogTitle>
          <DialogDescription>
            Choose one encounter to address. You can resolve at most one encounter per turn.
          </DialogDescription>
        </DialogHeader>

        {sorted.length === 0 ? (
          <div className="text-sm text-muted-foreground">No pending encounters.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map(encounter => {
              const turnsLeft = encounter.expiresOnTurn - turnNumber;

              return (
                <div key={encounter.id} className="flex items-start justify-between gap-3 rounded-sm border border-border bg-background/20 p-3">
                  <div className="min-w-0">
                    <div className="text-sm text-foreground truncate">{encounter.title}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {turnsLeft >= 0
                        ? `Expires in ${turnsLeft} turn${turnsLeft === 1 ? '' : 's'} (turn ${encounter.expiresOnTurn})`
                        : `Expired on turn ${encounter.expiresOnTurn}`}
                    </div>
                  </div>

                  <Button size="sm" onClick={() => onSelectEncounter(encounter.id)}>
                    Address
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EncounterInboxDialog;
