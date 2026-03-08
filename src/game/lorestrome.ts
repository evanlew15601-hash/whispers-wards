export const LORESTROME_SHEET_URL =
  'https://upload.wikimedia.org/wikipedia/commons/3/3d/200_portraits_of_fictional_characters.png';

export const LORESTROME_LAB_STORAGE_KEY = 'cc-portrait-lab-selections-v1';

export const LORESTROME_CELL_SIZE = 300;
export const LORESTROME_COLS = 6;
export const LORESTROME_ROWS = 36;

export type LorestromeCell = {
  row: number;
  col: number;
};

export function lorestromeIndexToCell(index: number): LorestromeCell {
  const safe = Math.max(0, Math.min(index, LORESTROME_COLS * LORESTROME_ROWS - 1));
  return { row: Math.floor(safe / LORESTROME_COLS), col: safe % LORESTROME_COLS };
}

export function lorestromeCellToIndex(cell: LorestromeCell): number {
  return cell.row * LORESTROME_COLS + cell.col;
}

export function lorestromeCropForCell(cell: LorestromeCell): { cx: number; cy: number; cw: number; ch: number } {
  return {
    cx: cell.col * LORESTROME_CELL_SIZE,
    cy: cell.row * LORESTROME_CELL_SIZE,
    cw: LORESTROME_CELL_SIZE,
    ch: LORESTROME_CELL_SIZE,
  };
}

/**
 * Returns a stable thumbnail URL for a single portrait.
 *
 * The production build generates cropped thumbnails into public/portraits/lorestrome
 * (so GitHub Pages can serve them reliably without third-party proxies).
 *
 * In dev/test (or if you request a non-webp format), we fall back to an SVG data URL
 * that crops the Wikimedia spritesheet client-side.
 */
let cachedWebpSupport: boolean | null = null;

function supportsWebp(): boolean {
  if (cachedWebpSupport !== null) return cachedWebpSupport;
  if (typeof document === 'undefined') {
    cachedWebpSupport = true;
    return cachedWebpSupport;
  }

  try {
    const canvas = document.createElement('canvas');
    const ok = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    cachedWebpSupport = ok;
    return ok;
  } catch {
    cachedWebpSupport = false;
    return false;
  }
}

export function lorestromeThumbUrl(
  cell: LorestromeCell,
  opts: {
    size?: number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {},
): string {
  const { size = 192, format = 'auto' } = opts;

  const generatedSizes = [96, 140, 192, 640];
  const pickGeneratedSize = (desired: number) => {
    for (const s of generatedSizes) {
      if (s >= desired) return s;
    }
    return generatedSizes[generatedSizes.length - 1] ?? 192;
  };

  // In practice, relying on WebP in the wild causes broken-image icons on some
  // iOS/Safari versions. Default to JPG for production builds.
  const resolvedFormat =
    format === 'auto'
      ? import.meta.env.MODE === 'production'
        ? 'jpg'
        : supportsWebp()
          ? 'webp'
          : 'jpg'
      : format;

  if (import.meta.env.MODE === 'production' && (resolvedFormat === 'webp' || resolvedFormat === 'jpg')) {
    const idx = lorestromeCellToIndex(cell);
    const s = pickGeneratedSize(size);
    const padded = String(idx).padStart(3, '0');
    // Cache-bust when formats/hosting change (helps iOS Safari which can aggressively cache 404s).
    return `${import.meta.env.BASE_URL}portraits/lorestrome/idx-${padded}-${s}.${resolvedFormat}?v=2`;
  }

  const { cx, cy } = lorestromeCropForCell(cell);

  const sheetW = LORESTROME_COLS * LORESTROME_CELL_SIZE;
  const sheetH = LORESTROME_ROWS * LORESTROME_CELL_SIZE;

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${LORESTROME_CELL_SIZE} ${LORESTROME_CELL_SIZE}">` +
    `<image href="${LORESTROME_SHEET_URL}" xlink:href="${LORESTROME_SHEET_URL}" x="-${cx}" y="-${cy}" width="${sheetW}" height="${sheetH}" preserveAspectRatio="none"/>` +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
