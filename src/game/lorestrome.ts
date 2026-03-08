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
 * We previously used wsrv.nl to crop+resize the Wikimedia spritesheet, but that can
 * intermittently return a placeholder/"?" image when the upstream blocks proxy fetches.
 *
 * Instead we return a tiny SVG (as a data URL) that crops the spritesheet client-side.
 * This keeps the rest of the UI on simple <img src="..."/> tags without shipping 200 files.
 */
export function lorestromeThumbUrl(
  cell: LorestromeCell,
  opts: {
    size?: number;
    format?: 'jpg' | 'png' | 'webp';
  } = {},
): string {
  const { size = 192 } = opts;
  const { cx, cy } = lorestromeCropForCell(cell);

  const sheetW = LORESTROME_COLS * LORESTROME_CELL_SIZE;
  const sheetH = LORESTROME_ROWS * LORESTROME_CELL_SIZE;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${LORESTROME_CELL_SIZE} ${LORESTROME_CELL_SIZE}">` +
    `<image href="${LORESTROME_SHEET_URL}" x="-${cx}" y="-${cy}" width="${sheetW}" height="${sheetH}" preserveAspectRatio="none"/>` +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
