import { useContext } from 'react';
import { AudioContext } from '@/audio/audioContext';

export const useAudio = () => useContext(AudioContext);
