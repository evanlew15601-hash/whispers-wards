import { createContext } from 'react';
import type { SfxId } from '@/audio/sfx';
import { DEFAULT_AUDIO_SETTINGS, type AudioSettings } from '@/audio/storage';
import type { AmbienceId } from '@/audio/proceduralAmbience';

export interface AudioApi {
  settings: AudioSettings;
  setSettings: (next: AudioSettings) => void;
  patchSettings: (patch: Partial<AudioSettings>) => void;
  playSfx: (id: SfxId) => void;
  setAmbience: (id: AmbienceId | null) => void;
  unlockAudio: () => void;
}

const noop = () => {};

export const AudioContext = createContext<AudioApi>({
  settings: DEFAULT_AUDIO_SETTINGS,
  setSettings: noop,
  patchSettings: noop,
  playSfx: noop,
  setAmbience: noop,
  unlockAudio: noop,
});
