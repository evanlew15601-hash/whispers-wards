import heroImage from '@/assets/hero-throne.jpg';
import {
  LORESTROME_LAB_STORAGE_KEY,
  LORESTROME_SHEET_URL,
  lorestromeIndexToCell,
  lorestromeThumbUrl,
} from '@/game/lorestrome';
import type { PortraitId } from './portraitIds';
export { isPortraitId } from './portraitIds';

export type Pronouns = 'they/them' | 'she/her' | 'he/him';

export type PortraitAsset = {
  id: PortraitId;
  label: string;
  src: string;
  lorestromeIndex?: number;
  /** Optional CSS styling hooks for quick, coherent variations while art is in flux. */
  objectPosition?: string;
  filterClassName?: string;
  /**
   * Asset provenance (keep updated when replacing placeholders).
   *
   * NOTE: hero-throne.jpg is a temporary stand-in; replace with curated CC0/PD portraits.
   */
  credit?: {
    sourceUrl?: string;
    license?: string;
    author?: string;
  };
};

type PortraitLabSelections = Partial<Record<string, number>>;

// Defaults chosen via the Portrait Lab (kept here so the game has a stable cast
// even when localStorage is empty).
export const DEFAULT_PORTRAIT_LAB_SELECTIONS: Readonly<Record<string, number>> = {
  'envoy-default': 37,
  'envoy-alternate': 97,
  'envoy-shadow': 210,
  aldric: 142,
  thessaly: 32,
  renzo: 73,
  // Avoid reusing the envoy portrait; pick a distinct option for Maren.
  maren: 16,
  sera: 24,
  ilya: 166,
};

function readPortraitLabSelections(): PortraitLabSelections {
  if (typeof window === 'undefined') return {};
  const storage = window.localStorage;
  if (!storage) return {};

  try {
    const raw = storage.getItem(LORESTROME_LAB_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as PortraitLabSelections;
  } catch {
    return {};
  }
}

function lorestromePortraitUrlFromIndex(index: number): string {
  return lorestromeThumbUrl(lorestromeIndexToCell(index), { size: 640 });
}

function portraitIndexForKey(selections: PortraitLabSelections, key: string): number | null {
  const stored = selections[key];
  if (typeof stored === 'number') return stored;

  const fallback = DEFAULT_PORTRAIT_LAB_SELECTIONS[key];
  return typeof fallback === 'number' ? fallback : null;
}

export function getPlayerPortraits(): PortraitAsset[] {
  const portraitLabSelections = readPortraitLabSelections();

  const envoyDefaultIdx = portraitIndexForKey(portraitLabSelections, 'envoy-default');
  const envoyAltIdx = portraitIndexForKey(portraitLabSelections, 'envoy-alternate');
  const envoyShadowIdx = portraitIndexForKey(portraitLabSelections, 'envoy-shadow');

  const sheetCredit = {
    sourceUrl: LORESTROME_SHEET_URL,
    license: 'CC0 (Hyptosis / Lorestrome)',
    author: 'Hyptosis',
  };

  return [
    {
      id: 'envoy-default',
      label: 'Envoy (Default)',
      src: typeof envoyDefaultIdx === 'number' ? lorestromePortraitUrlFromIndex(envoyDefaultIdx) : heroImage,
      lorestromeIndex: typeof envoyDefaultIdx === 'number' ? envoyDefaultIdx : undefined,
      objectPosition: '50% 20%',
      credit: typeof envoyDefaultIdx === 'number' ? sheetCredit : { sourceUrl: 'local:src/assets/hero-throne.jpg', license: 'placeholder' },
    },
    {
      id: 'envoy-alternate',
      label: 'Envoy (Alternate)',
      src: typeof envoyAltIdx === 'number' ? lorestromePortraitUrlFromIndex(envoyAltIdx) : heroImage,
      lorestromeIndex: typeof envoyAltIdx === 'number' ? envoyAltIdx : undefined,
      objectPosition: '50% 35%',
      filterClassName: 'cc-portrait-alt',
      credit: typeof envoyAltIdx === 'number' ? sheetCredit : { sourceUrl: 'local:src/assets/hero-throne.jpg', license: 'placeholder' },
    },
    {
      id: 'envoy-shadow',
      label: 'Envoy (Shadow)',
      src: typeof envoyShadowIdx === 'number' ? lorestromePortraitUrlFromIndex(envoyShadowIdx) : heroImage,
      lorestromeIndex: typeof envoyShadowIdx === 'number' ? envoyShadowIdx : undefined,
      objectPosition: '50% 25%',
      filterClassName: 'cc-portrait-shadow',
      credit: typeof envoyShadowIdx === 'number' ? sheetCredit : { sourceUrl: 'local:src/assets/hero-throne.jpg', license: 'placeholder' },
    },
  ];
}

export function getPortraitById(id: string): PortraitAsset | null {
  return getPlayerPortraits().find(p => p.id === id) ?? null;
}

export type SpeakerPortraitSpec =
  | {
      kind: 'image';
      src: string;
      lorestromeIndex?: number;
      alt: string;
      objectPosition?: string;
      filterClassName?: string;
    }
  | {
      kind: 'sigil';
      alt: string;
      initials: string;
      auraVar: string;
    };

function initialsFromName(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const take = parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
  return take || '?';
}

function getNpcOverride(key: string): { src: string; idx: number } | null {
  const selections = readPortraitLabSelections();

  let idx = portraitIndexForKey(selections, key);
  if (typeof idx !== 'number') return null;

  // Prevent accidental reuse of the player's default portrait for Maren.
  if (key === 'maren') {
    const envoyIdx = portraitIndexForKey(selections, 'envoy-default');
    if (typeof envoyIdx === 'number' && idx === envoyIdx) {
      idx = DEFAULT_PORTRAIT_LAB_SELECTIONS.maren ?? idx;
    }
  }

  return { src: lorestromePortraitUrlFromIndex(idx), idx };
}

export function getSpeakerPortrait(speaker: string, speakerFaction?: string): SpeakerPortraitSpec {
  const normalized = speaker.toLowerCase();

  // Named NPC portraits (placeholder crops/grades until bespoke art is added).
  if (normalized.includes('aldric')) {
    const override = getNpcOverride('aldric');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '52% 15%',
      filterClassName: 'cc-portrait-iron',
    };
  }

  if (normalized.includes('thessaly')) {
    const override = getNpcOverride('thessaly');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '45% 30%',
      filterClassName: 'cc-portrait-verdant',
    };
  }

  if (normalized.includes('renzo')) {
    const override = getNpcOverride('renzo');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '60% 28%',
      filterClassName: 'cc-portrait-ember',
    };
  }

  if (normalized.includes('maren')) {
    const override = getNpcOverride('maren');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '48% 25%',
      filterClassName: 'cc-portrait-iron',
    };
  }

  if (normalized.includes('sera')) {
    const override = getNpcOverride('sera');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '52% 25%',
      filterClassName: 'cc-portrait-verdant',
    };
  }

  if (normalized.includes('ilya')) {
    const override = getNpcOverride('ilya');
    return {
      kind: 'image',
      src: override?.src ?? heroImage,
      lorestromeIndex: override?.idx,
      alt: speaker,
      objectPosition: '50% 22%',
      filterClassName: 'cc-portrait-ember',
    };
  }

  const auraVar =
    speakerFaction === 'iron-pact'
      ? '--faction-iron'
      : speakerFaction === 'verdant-court'
        ? '--faction-verdant'
        : speakerFaction === 'ember-throne'
          ? '--faction-ember'
          : '--gold-glow';

  return {
    kind: 'sigil',
    alt: speaker,
    initials: initialsFromName(speaker),
    auraVar,
  };
}
