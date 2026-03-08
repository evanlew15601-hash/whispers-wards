import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  LORESTROME_COLS,
  LORESTROME_LAB_STORAGE_KEY,
  LORESTROME_ROWS,
  LORESTROME_SHEET_URL,
  lorestromeCellToIndex,
  lorestromeThumbUrl,
  type LorestromeCell,
} from '@/game/lorestrome';

type PortraitFeatures = {
  cell: LorestromeCell;
  index: number;
  outfitHue: number;
  outfitSat: number;
  outfitLum: number;
  hairHue: number;
  hairSat: number;
  hairLum: number;
  beardScore: number;
};

type CharacterKey =
  | 'envoy-default'
  | 'envoy-alternate'
  | 'envoy-shadow'
  | 'aldric'
  | 'thessaly'
  | 'renzo'
  | 'maren'
  | 'sera'
  | 'ilya';

const CHARACTER_LABELS: Record<CharacterKey, string> = {
  'envoy-default': 'Envoy (Default)',
  'envoy-alternate': 'Envoy (Alternate)',
  'envoy-shadow': 'Envoy (Shadow)',
  aldric: 'Commander Aldric Vane',
  thessaly: 'Emissary Thessaly',
  renzo: 'Trade Consul Renzo',
  maren: 'Chief Clerk Maren Vale',
  sera: 'Archivist Sera Quill',
  ilya: 'Quartermaster Ilya Rook',
};



function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;

    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function computeHueAffinity(hue: number, target: number, tolerance: number): number {
  const dist = hueDistance(hue, target);
  return clamp01(1 - dist / tolerance);
}

function analyzeCell(data: Uint8ClampedArray, width: number, height: number, cell: LorestromeCell): PortraitFeatures {
  const sampleStep = 6;

  const region = (x0: number, y0: number, x1: number, y1: number) => {
    let count = 0;
    let sumHueX = 0;
    let sumHueY = 0;
    let sumSat = 0;
    let sumLum = 0;

    for (let y = y0; y < y1; y += sampleStep) {
      for (let x = x0; x < x1; x += sampleStep) {
        const idx = (y * width + x) * 4;
        const r = data[idx] ?? 0;
        const g = data[idx + 1] ?? 0;
        const b = data[idx + 2] ?? 0;

        const { h, s, l } = rgbToHsl(r, g, b);
        const rad = (h / 180) * Math.PI;

        sumHueX += Math.cos(rad);
        sumHueY += Math.sin(rad);
        sumSat += s;
        sumLum += l;
        count++;
      }
    }

    if (!count) return { hue: 0, sat: 0, lum: 0 };

    const avgHue = (Math.atan2(sumHueY / count, sumHueX / count) * 180) / Math.PI;
    const hue = avgHue < 0 ? avgHue + 360 : avgHue;

    return {
      hue,
      sat: sumSat / count,
      lum: sumLum / count,
    };
  };

  // Regions are approximate and tuned for this portrait sheet.
  const hair = region(40, 0, 260, 90);
  const outfit = region(20, 170, 280, 295);

  const cheeks = region(80, 110, 220, 165);
  const chin = region(90, 175, 210, 235);

  // Beard heuristic: if the chin area is meaningfully darker than the cheeks.
  const beardScore = clamp01((cheeks.lum - chin.lum - 0.04) / 0.18);

  return {
    cell,
    index: lorestromeCellToIndex(cell),
    outfitHue: outfit.hue,
    outfitSat: outfit.sat,
    outfitLum: outfit.lum,
    hairHue: hair.hue,
    hairSat: hair.sat,
    hairLum: hair.lum,
    beardScore,
  };
}

function scoreForCharacter(key: CharacterKey, f: PortraitFeatures): number {
  const grayHair = clamp01((0.35 - f.hairSat) / 0.35) * clamp01(1 - Math.abs(f.hairLum - 0.55) / 0.35);

  const greenOutfit = computeHueAffinity(f.outfitHue, 120, 55) * clamp01((f.outfitSat - 0.1) / 0.6);
  const redOutfit = computeHueAffinity(f.outfitHue, 15, 55) * clamp01((f.outfitSat - 0.12) / 0.6);
  const blueOutfit = computeHueAffinity(f.outfitHue, 225, 65) * clamp01((f.outfitSat - 0.08) / 0.6);
  const brownOutfit = computeHueAffinity(f.outfitHue, 32, 55) * clamp01((f.outfitSat - 0.06) / 0.6);

  const formalDark = clamp01((0.55 - f.outfitLum) / 0.55) * clamp01((0.35 - f.outfitSat) / 0.35);
  const vibrant = clamp01((f.outfitSat - 0.2) / 0.8) * clamp01((f.outfitLum - 0.25) / 0.6);

  const noBeard = 1 - f.beardScore;

  if (key === 'aldric') {
    // Weathered commander: beard/gray hair + muted outfit.
    return 0.55 * f.beardScore + 0.4 * grayHair + 0.2 * formalDark;
  }

  if (key === 'thessaly') {
    // Verdant emissary: green tones, not bearded.
    return 0.8 * greenOutfit + 0.25 * noBeard + 0.1 * (1 - formalDark);
  }

  if (key === 'renzo') {
    // Ember merchant: warmer, more saturated wardrobe.
    return 0.7 * redOutfit + 0.25 * vibrant + 0.1 * noBeard;
  }

  if (key === 'maren') {
    // Stern clerk: darker/formal palette, generally clean-shaven.
    return 0.7 * formalDark + 0.25 * noBeard + 0.1 * blueOutfit;
  }

  if (key === 'sera') {
    // Quiet archivist: cooler tones, lower saturation.
    return 0.6 * blueOutfit + 0.35 * clamp01((0.35 - f.outfitSat) / 0.35) + 0.2 * noBeard;
  }

  if (key === 'ilya') {
    // Quartermaster: practical, rugged (brown tones, optional beard).
    return 0.55 * brownOutfit + 0.2 * f.beardScore + 0.2 * formalDark;
  }

  // Envoy variants: aim for neutral, professional, non-combat silhouette.
  // We can't reliably infer gender/androgyny, so this tries to avoid strong signals.
  const neutral =
    clamp01((0.55 - Math.abs(f.outfitLum - 0.45)) / 0.55) *
    clamp01((0.45 - Math.abs(f.outfitSat - 0.22)) / 0.45);

  return 0.7 * neutral + 0.25 * noBeard + 0.1 * blueOutfit;
}

function buildAllCells(): LorestromeCell[] {
  const out: LorestromeCell[] = [];
  for (let row = 0; row < LORESTROME_ROWS; row++) {
    for (let col = 0; col < LORESTROME_COLS; col++) {
      out.push({ row, col });
    }
  }
  return out;
}

function loadSelections(): Partial<Record<CharacterKey, number>> {
  try {
    const raw = localStorage.getItem(LORESTROME_LAB_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Partial<Record<CharacterKey, number>>;
  } catch {
    return {};
  }
}

function saveSelections(selections: Partial<Record<CharacterKey, number>>) {
  localStorage.setItem(LORESTROME_LAB_STORAGE_KEY, JSON.stringify(selections));
}

const PortraitLab = () => {
  const cells = useMemo(() => buildAllCells(), []);
  const [activeChar, setActiveChar] = useState<CharacterKey>('envoy-default');
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<PortraitFeatures[] | null>(null);
  const [selections, setSelections] = useState<Partial<Record<CharacterKey, number>>>(() => loadSelections());

  useEffect(() => {
    saveSelections(selections);
  }, [selections]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);

      try {
        const res = await fetch(LORESTROME_SHEET_URL, { mode: 'cors' });
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas context unavailable');

        const all: PortraitFeatures[] = [];

        for (const cell of cells) {
          ctx.clearRect(0, 0, 300, 300);
          ctx.drawImage(bitmap, cell.col * 300, cell.row * 300, 300, 300, 0, 0, 300, 300);
          const img = ctx.getImageData(0, 0, 300, 300);
          all.push(analyzeCell(img.data, 300, 300, cell));
        }

        if (!cancelled) setFeatures(all);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cells]);

  const sortedForActive = useMemo(() => {
    if (!features) return [];
    return [...features]
      .map(f => ({ f, score: scoreForCharacter(activeChar, f) }))
      .sort((a, b) => b.score - a.score);
  }, [features, activeChar]);

  const selectedIndex = selections[activeChar] ?? null;

  const selectionText = useMemo(() => {
    const orderedKeys: CharacterKey[] = [
      'envoy-default',
      'envoy-alternate',
      'envoy-shadow',
      'aldric',
      'thessaly',
      'renzo',
      'maren',
      'sera',
      'ilya',
    ];

    const entries = orderedKeys
      .map(key => {
        const idx = selections[key];
        if (typeof idx !== 'number') return null;
        const cell = { row: Math.floor(idx / LORESTROME_COLS), col: idx % LORESTROME_COLS };
        return `${key}: idx ${idx} (r${cell.row} c${cell.col})`;
      })
      .filter(Boolean)
      .join('\n');

    return entries || '(no selections yet)';
  }, [selections]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xs tracking-[0.4em] text-muted-foreground uppercase">Crown & Concord</div>
            <h1 className="mt-2 font-display text-3xl tracking-[0.18em] gold-text-gradient uppercase">Portrait Lab</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              CC0 portraits (Hyptosis / Lorestrome). This screen attempts to auto-suggest portraits for the current main cast
              based on rough palette + “beard/no-beard” heuristics. Click any candidate to assign it to the active character.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Source sheet: <a className="underline" href={LORESTROME_SHEET_URL} target="_blank" rel="noreferrer">{LORESTROME_SHEET_URL}</a>
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="h-auto rounded-sm px-5 py-2 font-display text-xs tracking-[0.25em] uppercase">
                Back
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="parchment-border rounded-sm bg-card/40 p-4">
            <div className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">Character</div>
            <div className="mt-3 grid gap-2">
              {(Object.keys(CHARACTER_LABELS) as CharacterKey[]).map(key => {
                const active = key === activeChar;
                const picked = selections[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveChar(key)}
                    className={`w-full rounded-sm border px-3 py-2 text-left text-sm transition-colors
                      ${active ? 'border-primary/70 bg-secondary/40' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className="font-display text-[11px] tracking-[0.18em] uppercase">{CHARACTER_LABELS[key]}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {typeof picked === 'number' ? `Selected: idx ${picked}` : 'Selected: —'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">Selection summary</div>
              <pre className="mt-2 max-h-56 overflow-auto rounded-sm border border-border bg-background/30 p-3 text-[11px] text-muted-foreground">
                {selectionText}
              </pre>

              <div className="mt-2 text-xs text-muted-foreground">
                Tip: once these look good, paste the chosen indices back to me and I’ll wire them into the game’s portrait
                mapping.
              </div>
            </div>
          </div>

          <div className="parchment-border rounded-sm bg-card/40 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">Auto-suggestions</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {loading ? 'Analyzing the sheet…' : features ? 'Click a portrait to assign it.' : 'Preparing…'}
                </div>
              </div>

              {selectedIndex !== null && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelections(prev => {
                      const next = { ...prev };
                      delete next[activeChar];
                      return next;
                    });
                  }}
                  className="h-auto rounded-sm px-4 py-2 font-display text-xs tracking-[0.25em] uppercase"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sortedForActive.slice(0, 20).map(({ f, score }) => {
                const active = selections[activeChar] === f.index;
                return (
                  <button
                    key={f.index}
                    type="button"
                    onClick={() => setSelections(prev => ({ ...prev, [activeChar]: f.index }))}
                    className={`group overflow-hidden rounded-sm border bg-secondary/30 transition-colors
                      ${active ? 'border-primary/70' : 'border-border hover:border-primary/40'}`}
                    title={`idx ${f.index} (score ${score.toFixed(2)})`}
                  >
                    <img
                      src={lorestromeThumbUrl(f.cell, { size: 140, format: 'webp' })}
                      alt={`Portrait ${f.index}`}
                      className="h-28 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-2 text-left">
                      <div className="font-display text-[10px] tracking-[0.18em] text-muted-foreground uppercase">idx {f.index}</div>
                      <div className="text-[10px] text-muted-foreground/70">score {score.toFixed(2)}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <div className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">Full grid</div>
              <div className="mt-2 text-xs text-muted-foreground">
                For manual browsing (r0–r{LORESTROME_ROWS - 1}, c0–c{LORESTROME_COLS - 1}).
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {cells.map(cell => {
                  const idx = lorestromeCellToIndex(cell);
                  const active = selections[activeChar] === idx;
                  return (
                    <button
                      key={`${cell.row}-${cell.col}`}
                      type="button"
                      onClick={() => setSelections(prev => ({ ...prev, [activeChar]: idx }))}
                      className={`relative overflow-hidden rounded-sm border transition-colors
                        ${active ? 'border-primary/70' : 'border-border hover:border-primary/40'}`}
                      title={`idx ${idx} (r${cell.row} c${cell.col})`}
                    >
                      <img
                        src={lorestromeThumbUrl(cell, { size: 96, format: 'webp' })}
                        alt={`Portrait ${idx}`}
                        className="h-20 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/70 px-1 py-0.5 text-[9px] text-foreground/80">
                        {idx}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortraitLab;
