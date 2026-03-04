import { useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { loadTipSettings, saveTipSettings, type TipSettings } from '@/ui/tips/storage';
import { TipsContext, type TipsApi } from '@/ui/tips/tipsContext';

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
