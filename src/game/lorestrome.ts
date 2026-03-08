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
 * Uses wsrv.nl to do the crop+resize so we don't have to ship 200 separate files.
 */
export function lorestromeThumbUrl(
  cell: LorestromeCell,
  opts: {
    size?: number;
    format?: 'jpg' | 'png' | 'webp';
  } = {},
): string {
  const { size = 192, format = 'webp' } = opts;
  const { cx, cy, cw, ch } = lorestromeCropForCell(cell);
  const url = encodeURIComponent(LORESTROME_SHEET_URL);

  return `https://wsrv.nl/?url=${url}&cx=${cx}&cy=${cy}&cw=${cw}&ch=${ch}&w=${size}&h=${size}&fit=cover&output=${format}`;
}
