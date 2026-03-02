import { createContext, useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { loadTipSettings, saveTipSettings, type TipSettings, DEFAULT_TIP_SETTINGS } from '@/ui/tips/storage';

export interface TipsApi {
  settings: TipSettings;
  setEnabled: (enabled: boolean) => void;
}

const noop = () => {};

export const TipsContext = createContext<TipsApi>({
  settings: DEFAULT_TIP_SETTINGS,
  setEnabled: noop,
});

export const TipsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<TipSettings>(() => loadTipSettings());

  const setEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, enabled };
      saveTipSettings(next);
      return next;
    });
  }, []);

  const api = useMemo<TipsApi>(() => ({
    settings,
    setEnabled,
  }), [settings, setEnabled]);

  return (
    <TipsContext.Provider value={api}>
      {children}
    </TipsContext.Provider>
  );
};
