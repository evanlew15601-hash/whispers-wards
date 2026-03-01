import { Howl, Howler } from 'howler';

declare global {
  interface Window {
    Howl?: typeof Howl;
    Howler?: typeof Howler;
  }
}

// Ensure the rest of the audio system can keep using the existing window-global lookup.
if (typeof window !== 'undefined') {
  window.Howl = window.Howl ?? Howl;
  window.Howler = window.Howler ?? Howler;
}
