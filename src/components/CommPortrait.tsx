import { CSSProperties } from 'react';

import LorestromePortraitImage from '@/components/LorestromePortraitImage';
import { lorestromeIndexToCell } from '@/game/lorestrome';
import type { SpeakerPortraitSpec } from '@/game/portraits';

interface CommPortraitProps {
  portrait: SpeakerPortraitSpec;
}

const CommPortrait = ({ portrait }: CommPortraitProps) => {
  if (portrait.kind === 'image') {
    return (
      <div
        className="cc-comm-frame relative h-full w-full overflow-hidden rounded-sm"
        style={{ '--cc-aura': `var(${portrait.auraVar})` } as CSSProperties}
      >
        {typeof portrait.lorestromeIndex === 'number' ? (
          <LorestromePortraitImage
            cell={lorestromeIndexToCell(portrait.lorestromeIndex)}
            size={640}
            alt={portrait.alt}
            className={`relative z-0 h-full w-full object-cover ${portrait.filterClassName ?? ''}`}
            objectPosition={portrait.objectPosition}
          />
        ) : (
          <img
            src={portrait.src}
            alt={portrait.alt}
            className={`relative z-0 h-full w-full object-cover ${portrait.filterClassName ?? ''}`}
            style={{ objectPosition: portrait.objectPosition }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="cc-portrait-tint absolute inset-0" />
          <div className="cc-comm-scanlines absolute inset-0" />
          <div className="cc-dialogue-grain absolute inset-0" />
          <div className="cc-portrait-vignette absolute inset-0" />
        </div>

        <div className="cc-comm-frame-border pointer-events-none absolute inset-0 z-20" />
      </div>
    );
  }

  return (
    <div
      className="cc-comm-frame relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm"
      style={{ '--cc-aura': `var(${portrait.auraVar})` } as CSSProperties}
      aria-label={portrait.alt}
      role="img"
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="cc-portrait-tint absolute inset-0" />
        <div className="cc-comm-scanlines absolute inset-0" />
        <div className="cc-dialogue-grain absolute inset-0" />
        <div className="cc-portrait-vignette absolute inset-0" />
      </div>
      <div className="cc-comm-sigil relative flex h-24 w-24 items-center justify-center rounded-sm border border-border bg-card/50">
        <span className="font-display text-3xl tracking-[0.25em] text-primary/90">
          {portrait.initials}
        </span>
      </div>
      <div className="cc-comm-frame-border pointer-events-none absolute inset-0 z-20" />
    </div>
  );
};

export default CommPortrait;
