import { createContext } from 'react';
import { DEFAULT_TIP_SETTINGS, type TipSettings } from '@/ui/tips/storage';

export interface TipsApi {
  settings: TipSettings;
  setEnabled: (enabled: boolean) => void;
}

const noop = () => {};

export const TipsContext = createContext<TipsApi>({
  settings: DEFAULT_TIP_SETTINGS,
  setEnabled: noop,
});
