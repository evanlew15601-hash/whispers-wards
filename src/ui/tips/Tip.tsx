import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTips } from '@/ui/tips/useTips';

export type TipProps = {
  id: string;
  content: ReactNode;
  label?: string;
  kind?: 'tooltip' | 'popover';
  className?: string;
};

const shouldUsePopover = (content: ReactNode) => {
  if (typeof content !== 'string') return true;
  if (content.length > 110) return true;
  if (content.includes('\n')) return true;
  return false;
};

const Tip = ({ id, content, label, kind, className }: TipProps) => {
  const { settings } = useTips();
  if (!settings.enabled) return null;

  const resolvedKind = kind ?? (shouldUsePopover(content) ? 'popover' : 'tooltip');
  const aria = label ?? `Tip: ${id}`;

  const trigger = (
    <Button
      type="button"
      variant="ghost"
      className={
        className ??
        'h-6 w-6 rounded-sm p-0 text-muted-foreground hover:text-foreground focus-visible:ring-primary/60'
      }
      aria-label={aria}
    >
      <CircleHelp className="h-4 w-4" />
    </Button>
  );

  if (resolvedKind === 'popover') {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-72 text-sm">
          <div className="font-body text-sm text-popover-foreground">{content}</div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>
        <div className="max-w-72 text-sm">{content}</div>
      </TooltipContent>
    </Tooltip>
  );
};

export default Tip;
