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

export function getPlayerPortraits(): PortraitAsset[] {
  const portraitLabSelections = readPortraitLabSelections();

  return [
    {
      id: 'envoy-default',
      label: 'Envoy (Default)',
      src:
        typeof portraitLabSelections['envoy-default'] === 'number'
          ? lorestromePortraitUrlFromIndex(portraitLabSelections['envoy-default'])
          : heroImage,
      objectPosition: '50% 20%',
      credit:
        typeof portraitLabSelections['envoy-default'] === 'number'
          ? {
              sourceUrl: LORESTROME_SHEET_URL,
              license: 'CC0 (Hyptosis / Lorestrome)',
              author: 'Hyptosis',
            }
          : {
              sourceUrl: 'local:src/assets/hero-throne.jpg',
              license: 'placeholder',
            },
    },
    {
      id: 'envoy-alternate',
      label: 'Envoy (Alternate)',
      src:
        typeof portraitLabSelections['envoy-alternate'] === 'number'
          ? lorestromePortraitUrlFromIndex(portraitLabSelections['envoy-alternate'])
          : heroImage,
      objectPosition: '50% 35%',
      filterClassName: 'cc-portrait-alt',
      credit:
        typeof portraitLabSelections['envoy-alternate'] === 'number'
          ? {
              sourceUrl: LORESTROME_SHEET_URL,
              license: 'CC0 (Hyptosis / Lorestrome)',
              author: 'Hyptosis',
            }
          : {
              sourceUrl: 'local:src/assets/hero-throne.jpg',
              license: 'placeholder',
            },
    },
    {
      id: 'envoy-shadow',
      label: 'Envoy (Shadow)',
      src:
        typeof portraitLabSelections['envoy-shadow'] === 'number'
          ? lorestromePortraitUrlFromIndex(portraitLabSelections['envoy-shadow'])
          : heroImage,
      objectPosition: '50% 25%',
      filterClassName: 'cc-portrait-shadow',
      credit:
        typeof portraitLabSelections['envoy-shadow'] === 'number'
          ? {
              sourceUrl: LORESTROME_SHEET_URL,
              license: 'CC0 (Hyptosis / Lorestrome)',
              author: 'Hyptosis',
            }
          : {
              sourceUrl: 'local:src/assets/hero-throne.jpg',
              license: 'placeholder',
            },
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

function getNpcOverrideSrc(key: string): string | null {
  const idx = readPortraitLabSelections()[key];
  if (typeof idx !== 'number') return null;
  return lorestromePortraitUrlFromIndex(idx);
}

export function getSpeakerPortrait(speaker: string, speakerFaction?: string): SpeakerPortraitSpec {
  const normalized = speaker.toLowerCase();

  // Named NPC portraits (placeholder crops/grades until bespoke art is added).
  if (normalized.includes('aldric')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('aldric') ?? heroImage,
      alt: speaker,
      objectPosition: '52% 15%',
      filterClassName: 'cc-portrait-iron',
    };
  }

  if (normalized.includes('thessaly')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('thessaly') ?? heroImage,
      alt: speaker,
      objectPosition: '45% 30%',
      filterClassName: 'cc-portrait-verdant',
    };
  }

  if (normalized.includes('renzo')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('renzo') ?? heroImage,
      alt: speaker,
      objectPosition: '60% 28%',
      filterClassName: 'cc-portrait-ember',
    };
  }

  if (normalized.includes('maren')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('maren') ?? heroImage,
      alt: speaker,
      objectPosition: '48% 25%',
      filterClassName: 'cc-portrait-iron',
    };
  }

  if (normalized.includes('sera')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('sera') ?? heroImage,
      alt: speaker,
      objectPosition: '52% 25%',
      filterClassName: 'cc-portrait-verdant',
    };
  }

  if (normalized.includes('ilya')) {
    return {
      kind: 'image',
      src: getNpcOverrideSrc('ilya') ?? heroImage,
      alt: speaker,
      objectPosition: '50% 22%',
      filterClassName: 'cc-portrait-ember',
    };
  }

  if (speakerFaction) {
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

  return {
    kind: 'sigil',
    alt: speaker,
    initials: initialsFromName(speaker),
    auraVar: '--gold-glow',
  };
}
