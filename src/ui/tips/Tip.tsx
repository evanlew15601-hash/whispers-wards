import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
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
    <span
      role="button"
      tabIndex={0}
      aria-label={aria}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        className ?? 'h-6 w-6 rounded-sm p-0 text-muted-foreground hover:text-foreground focus-visible:ring-primary/60',
      )}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
      }}
    >
      <CircleHelp className="h-4 w-4" />
    </span>
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          <div className="max-w-72 text-sm">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Tip;
