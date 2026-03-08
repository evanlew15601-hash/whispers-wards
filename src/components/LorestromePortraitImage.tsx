import { useMemo, useState } from 'react';

import {
  LORESTROME_COLS,
  LORESTROME_ROWS,
  LORESTROME_SHEET_URL,
  lorestromeGeneratedThumbUrl,
  type LorestromeCell,
} from '@/game/lorestrome';

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
  const [useSheetFallback, setUseSheetFallback] = useState(false);

  const backgroundPosition = useMemo(() => {
    const x = LORESTROME_COLS > 1 ? (cell.col / (LORESTROME_COLS - 1)) * 100 : 0;
    const y = LORESTROME_ROWS > 1 ? (cell.row / (LORESTROME_ROWS - 1)) * 100 : 0;
    return `${x}% ${y}%`;
  }, [cell.col, cell.row]);

  if (useSheetFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          backgroundImage: `url(${LORESTROME_SHEET_URL})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${LORESTROME_COLS * 100}% ${LORESTROME_ROWS * 100}%`,
          backgroundPosition,
        }}
      />
    );
  }

  return (
    <img
      src={lorestromeGeneratedThumbUrl(cell, { size, format: 'jpg' })}
      alt={alt}
      className={className}
      style={{ objectPosition }}
      onError={() => setUseSheetFallback(true)}
    />
  );
};

export default LorestromePortraitImage;
