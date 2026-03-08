import { useEffect, useMemo, useState } from 'react';

import { lorestromeThumbUrl, type LorestromeCell } from '@/game/lorestrome';

interface LorestromePortraitImageProps {
  cell: LorestromeCell;
  size: number;
  alt: string;
  className?: string;
  objectPosition?: string;
}

const LorestromePortraitImage = ({
  cell,
  size,
  alt,
  className,
  objectPosition,
}: LorestromePortraitImageProps) => {
  const primarySrc = useMemo(() => lorestromeThumbUrl(cell, { size, format: 'auto' }), [cell, size]);
  const fallbackSrc = useMemo(() => lorestromeThumbUrl(cell, { size, format: 'png' }), [cell, size]);

  const [src, setSrc] = useState(primarySrc);

  useEffect(() => {
    setSrc(primarySrc);
  }, [primarySrc]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectPosition }}
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
};

export default LorestromePortraitImage;
